"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

function toString(value: FormDataEntryValue | null) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return "";
}

export async function addGoal(formData: FormData) {
  const title = toString(formData.get("title"));
  const category = toString(formData.get("category"));
  const description = toString(formData.get("description"));

  const allowedCategories = ["RELATIONSHIPS", "CAREER", "SKILLS"] as const;
  if (!title || !allowedCategories.includes(category as (typeof allowedCategories)[number])) return;

  await prisma.goal.create({
    data: {
      title,
      category,
      description: description || null
    }
  });

  revalidatePath("/goals");
}

export async function addSignal(formData: FormData) {
  const goalId = toString(formData.get("goalId"));
  const title = toString(formData.get("title"));
  const weeklyTargetRaw = toString(formData.get("weeklyTarget"));
  const weeklyTarget = Number.parseInt(weeklyTargetRaw, 10);

  if (!goalId || !title || Number.isNaN(weeklyTarget)) return;

  await prisma.signal.create({
    data: { goalId, title, weeklyTarget }
  });

  revalidatePath("/goals");
}

export async function addAction(formData: FormData) {
  const signalId = toString(formData.get("signalId"));
  const title = toString(formData.get("title"));
  const notes = toString(formData.get("notes"));

  if (!signalId || !title) return;

  await prisma.action.create({
    data: { signalId, title, notes: notes || null }
  });

  revalidatePath("/");
}

export async function addPerson(formData: FormData) {
  const name = toString(formData.get("name"));
  const contextTag = toString(formData.get("contextTag"));
  const nextStep = toString(formData.get("nextStep"));

  if (!name) return;

  await prisma.person.create({
    data: {
      name,
      contextTag: contextTag || null,
      nextStep: nextStep || null
    }
  });

  revalidatePath("/people");
  revalidatePath("/");
}

export async function addTouch(formData: FormData) {
  const personId = toString(formData.get("personId"));
  const summary = toString(formData.get("summary"));

  if (!personId || !summary) return;

  await prisma.touch.create({
    data: { personId, summary }
  });

  await prisma.person.update({
    where: { id: personId },
    data: { lastTouchAt: new Date() }
  });

  revalidatePath("/people");
  revalidatePath("/");
}

export async function addWeeklyReview(formData: FormData) {
  const weekStartRaw = toString(formData.get("weekStart"));
  const wins = toString(formData.get("wins"));
  const misses = toString(formData.get("misses"));
  const commitments = toString(formData.get("commitments"));

  if (!weekStartRaw) return;

  const weekStart = new Date(weekStartRaw);

  await prisma.weeklyReview.create({
    data: {
      weekStart,
      wins: wins || null,
      misses: misses || null,
      commitments: commitments || null
    }
  });

  revalidatePath("/reviews");
}
