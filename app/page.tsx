import { prisma } from "../lib/prisma";
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from "../lib/dates";
import { addAction } from "../lib/actions";

export default async function DashboardPage() {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const staleThreshold = new Date(now);
  staleThreshold.setDate(staleThreshold.getDate() - 14);

  const signals = await prisma.signal.findMany({
    where: { active: true },
    include: { goal: true },
    orderBy: { createdAt: "asc" }
  });

  const actionsThisWeek = await prisma.action.findMany({
    where: { happenedAt: { gte: weekStart, lt: weekEnd } },
    select: { signalId: true }
  });

  const todayActions = await prisma.action.findMany({
    where: { happenedAt: { gte: todayStart, lt: todayEnd } },
    orderBy: { happenedAt: "desc" }
  });

  const stalePeople = await prisma.person.findMany({
    where: {
      OR: [{ lastTouchAt: null }, { lastTouchAt: { lt: staleThreshold } }]
    },
    orderBy: { lastTouchAt: "asc" },
    take: 5
  });

  const counts = new Map<string, number>();
  for (const action of actionsThisWeek) {
    counts.set(action.signalId, (counts.get(action.signalId) ?? 0) + 1);
  }

  const topSignals = signals.slice(0, 3);

  return (
    <div className="stack">
      <section className="card">
        <h1>Today</h1>
        <p className="muted">Pick 1-2 actions that move a signal.</p>
        {todayActions.length === 0 ? (
          <p className="empty">No actions logged today yet.</p>
        ) : (
          <ul className="list">
            {todayActions.map((action) => (
              <li key={action.id}>{action.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Signal Progress (This Week)</h2>
        {topSignals.length === 0 ? (
          <p className="empty">Add a goal and signal to start tracking.</p>
        ) : (
          <div className="grid">
            {topSignals.map((signal) => {
              const count = counts.get(signal.id) ?? 0;
              return (
                <div key={signal.id} className="panel">
                  <div className="panel-title">{signal.title}</div>
                  <div className="panel-meta">
                    {signal.goal.category} · {count}/{signal.weeklyTarget}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Stale Contacts</h2>
        {stalePeople.length === 0 ? (
          <p className="empty">No stale contacts. Nice.</p>
        ) : (
          <ul className="list">
            {stalePeople.map((person) => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                {person.nextStep ? ` — Next: ${person.nextStep}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Quick Add Action</h2>
        <form action={addAction} className="form">
          <label>
            Signal
            <select name="signalId" required>
              <option value="">Select a signal</option>
              {signals.map((signal) => (
                <option key={signal.id} value={signal.id}>
                  {signal.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Action
            <input name="title" placeholder="Coffee chat with..." required />
          </label>
          <label>
            Notes
            <textarea name="notes" rows={3} placeholder="Optional"></textarea>
          </label>
          <button type="submit">Add Action</button>
        </form>
      </section>
    </div>
  );
}
