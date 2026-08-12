import "./Toast.css";

function Toast({
  message,
  type,
  show,
  actionLabel,
  onAction,
}) {
  if (!show) return null;

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === "error" ? "⚠" : "✅"}
      </span>

      <div className="toast-content">
        <h4>
          {type === "error" ? "Oops!" : "Success"}
        </h4>

        <p>{message}</p>

        {actionLabel && onAction && (
          <button
            type="button"
            className="toast-action"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;