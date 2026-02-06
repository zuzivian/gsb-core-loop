import { prisma } from "../../lib/prisma";
import { addPerson, addTouch } from "../../lib/actions";

export default async function PeoplePage() {
  const people = await prisma.person.findMany({
    orderBy: [{ lastTouchAt: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="stack">
      <section className="card">
        <h1>People CRM</h1>
        <form action={addPerson} className="form">
          <label>
            Name
            <input name="name" placeholder="Jane Doe" required />
          </label>
          <label>
            Context tag
            <input name="contextTag" placeholder="Pre-GSB mixer" />
          </label>
          <label>
            Next step
            <input name="nextStep" placeholder="Follow up next week" />
          </label>
          <button type="submit">Add Person</button>
        </form>
      </section>

      <section className="card">
        <h2>Log a Touch</h2>
        <form action={addTouch} className="form">
          <label>
            Person
            <select name="personId" required>
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Summary
            <input name="summary" placeholder="Quick coffee chat" required />
          </label>
          <button type="submit">Log Touch</button>
        </form>
      </section>

      <section className="card">
        <h2>People</h2>
        {people.length === 0 ? (
          <p className="empty">No contacts yet.</p>
        ) : (
          <ul className="list">
            {people.map((person) => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                {person.contextTag ? ` · ${person.contextTag}` : ""}
                {person.lastTouchAt
                  ? ` · Last touch ${new Date(person.lastTouchAt).toLocaleDateString()}`
                  : " · No touches yet"}
                {person.nextStep ? ` · Next: ${person.nextStep}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
