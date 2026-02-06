import { prisma } from "../../lib/prisma";
import { addGoal, addSignal } from "../../lib/actions";

export default async function GoalsPage() {
  const goals = await prisma.goal.findMany({
    orderBy: { createdAt: "desc" },
    include: { signals: true }
  });

  return (
    <div className="stack">
      <section className="card">
        <h1>Goals</h1>
        <form action={addGoal} className="form">
          <label>
            Goal title
            <input name="title" placeholder="Build deep GSB friendships" required />
          </label>
          <label>
            Category
            <select name="category" required>
              <option value="">Select</option>
              <option value="RELATIONSHIPS">Relationships</option>
              <option value="CAREER">Career</option>
              <option value="SKILLS">Skills</option>
            </select>
          </label>
          <label>
            Description
            <textarea name="description" rows={3} placeholder="Optional"></textarea>
          </label>
          <button type="submit">Add Goal</button>
        </form>
      </section>

      <section className="card">
        <h2>Add Signal</h2>
        <form action={addSignal} className="form">
          <label>
            Goal
            <select name="goalId" required>
              <option value="">Select a goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Signal title
            <input name="title" placeholder="2 meaningful 1:1s" required />
          </label>
          <label>
            Weekly target
            <input name="weeklyTarget" type="number" min={1} defaultValue={1} />
          </label>
          <button type="submit">Add Signal</button>
        </form>
      </section>

      <section className="card">
        <h2>Existing Goals</h2>
        {goals.length === 0 ? (
          <p className="empty">No goals yet.</p>
        ) : (
          <div className="grid">
            {goals.map((goal) => (
              <div key={goal.id} className="panel">
                <div className="panel-title">{goal.title}</div>
                <div className="panel-meta">{goal.category}</div>
                {goal.signals.length === 0 ? (
                  <p className="muted">No signals yet.</p>
                ) : (
                  <ul className="list">
                    {goal.signals.map((signal) => (
                      <li key={signal.id}>
                        {signal.title} · Target {signal.weeklyTarget}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
