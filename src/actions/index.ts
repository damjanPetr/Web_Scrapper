import db from "../database/Database";

export async function getProperActions() {
  const instance = await db.scrap_Instance.findMany({
    include: {
      actions: {
        include: {
          parameters: true,
        },
      },
      _count: true,
    },
  });
}
