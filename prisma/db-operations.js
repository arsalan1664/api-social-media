import prisma from "./Prisma.js";

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById({ Id }) {
  const user = await prisma.user.findById({
    where: {
      Id,
    },
  });
  return user;
}
