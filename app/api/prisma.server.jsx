export const createSettings = async ({ title, description }) => {
  return await prisma.settings.upsert({
    where: { id: 1 },
    update: { title: title, description: description },
    create: { title: title, description: description },
  });
};
