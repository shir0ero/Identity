import prisma from "./prisma";

export async function findRoot(contact: any): Promise<any> {
  if (!contact.linkedId) return contact;

  const parent = await prisma.contact.findUnique({
    where: { id: contact.linkedId },
  });

  if (!parent) return contact;

  return findRoot(parent);
}
