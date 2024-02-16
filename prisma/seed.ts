import db from "@/app/database/Database";

[
  "loadBrowser",
  "closeBrowser",
  "waitPageNavigation",
  "waitSelector",
  "type",
].forEach(async (item) => {
  await db.action.create({
    data: {
      title: item,
    },
  });
});
