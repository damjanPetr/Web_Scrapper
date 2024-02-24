"use server";
import db from "../database/Database";
import { closeBrowserAction, loadBrowserAction } from "../lib/Action";
import { Invoker } from "../lib/Invoker";

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
export async function name(objects: FormData) {
  const rawFormData = Object.fromEntries(objects.entries());

  return;
}
