import prisma from "../utils/prisma";
import { findRoot } from "../utils/findRoot";

export async function identifyContact(email?: string, phoneNumber?: string) {
  if (!email && !phoneNumber) {
    throw new Error("Provide email or phoneNumber");
  }

  const matches = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : {},
        phoneNumber ? { phoneNumber } : {},
      ],
      deletedAt: null,
    },
  });

  if (matches.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });

    return buildResponse(newContact.id);
  }

  const roots = await Promise.all(matches.map(findRoot));

  roots.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const primary = roots[0];

  for (const root of roots.slice(1)) {
    if (root.id !== primary.id && root.linkPrecedence === "primary") {
      await prisma.contact.update({
        where: { id: root.id },
        data: {
          linkedId: primary.id,
          linkPrecedence: "secondary",
        },
      });
    }
  }

  const group = await prisma.contact.findMany({
    where: {
      OR: [{ id: primary.id }, { linkedId: primary.id }],
    },
  });

  const emails = group.map((c) => c.email);
  const phones = group.map((c) => c.phoneNumber);

  const isNewInfo =
    (email && !emails.includes(email)) ||
    (phoneNumber && !phones.includes(phoneNumber));

  if (isNewInfo) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary",
      },
    });
  }

  return buildResponse(primary.id);
}

async function buildResponse(primaryId: number) {
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [{ id: primaryId }, { linkedId: primaryId }],
    },
    orderBy: { createdAt: "asc" },
  });

  const primary = contacts.find(c => c.id === primaryId)!;

  return {
    contact: {
      primaryContactId: primaryId,
      emails: [...new Set(contacts.map(c => c.email).filter(Boolean))],
      phoneNumbers: [...new Set(contacts.map(c => c.phoneNumber).filter(Boolean))],
      secondaryContactIds: contacts
        .filter(c => c.linkPrecedence === "secondary")
        .map(c => c.id),
    },
  };
}
