import "./RecentPrompts.css";

function RecentPrompts({
  prompts,
  onReuse,
  onDelete
}) {

  if (prompts.length === 0) {

    return (

      <div className="recent-prompts">

        <h2>Recent Prompts</h2>

        <div className="empty-history">

          <h3>No prompts yet</h3>

          <p>
            Generate your first AI image to see it here.
          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="recent-prompts">

      <h2>Recent Prompts</h2>

      {

        prompts.map((item) => (

          <div
            className="recent-card"
            key={item.id}
          >

            <img
              src={item.image}
              alt="Prompt"
              className="recent-image"
            />

            <div className="recent-info">

              <h3>

                {item.prompt}

              </h3>

              <p>

                {item.style} • {item.ratio}

              </p>

            </div>

            <div className="recent-actions">

              <button
                className="reuse-btn"
                onClick={() => onReuse(item.prompt)}
              >

                Reuse Prompt

              </button>

              <button
                className="delete-btn"
                onClick={() => onDelete(item.id)}
              >

                🗑

              </button>

            </div>

          </div>

        ))

      }

    </div>

  );

}

export default RecentPrompts;