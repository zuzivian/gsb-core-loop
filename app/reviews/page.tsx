import { prisma } from "../../lib/prisma";
import { addWeeklyReview } from "../../lib/actions";

export default async function ReviewsPage() {
  const reviews = await prisma.weeklyReview.findMany({
    orderBy: { weekStart: "desc" },
    take: 8
  });

  return (
    <div className="stack">
      <section className="card">
        <h1>Weekly Review</h1>
        <form action={addWeeklyReview} className="form">
          <label>
            Week start
            <input name="weekStart" type="date" required />
          </label>
          <label>
            Wins
            <textarea name="wins" rows={3} placeholder="What moved signals?" />
          </label>
          <label>
            Misses
            <textarea name="misses" rows={3} placeholder="What did not happen?" />
          </label>
          <label>
            Commitments (max 3)
            <textarea name="commitments" rows={3} placeholder="1) ... 2) ..." />
          </label>
          <button type="submit">Save Review</button>
        </form>
      </section>

      <section className="card">
        <h2>Recent Reviews</h2>
        {reviews.length === 0 ? (
          <p className="empty">No reviews yet.</p>
        ) : (
          <ul className="list">
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{new Date(review.weekStart).toLocaleDateString()}</strong>
                {review.commitments ? ` · ${review.commitments}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
