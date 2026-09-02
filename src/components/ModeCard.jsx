/**
 * ModeCard — a reusable card component for mode selection.
 *
 * Props (values passed in from the parent component):
 *   icon     — the emoji shown at the top (e.g. "👴")
 *   title    — the card heading (e.g. "Patient Mode")
 *   desc     — a short description shown below the title
 *   theme    — "patient" or "caregiver" — controls the colour scheme
 *   onClick  — a function to call when the card is clicked
 *
 * In React, "props" are how you pass data into a component,
 * just like passing arguments into a function.
 */
function ModeCard({ icon, title, desc, theme, onClick }) {
  return (
    /*
     * We use a <button> so the card is accessible by keyboard
     * (Tab to focus, Enter/Space to click).
     * The className is built dynamically so we can apply
     * different hover colours per theme via CSS.
     */
    <button
      className={`mode-card mode-card--${theme}`}
      onClick={onClick}
      /* aria-label gives screen readers a better description */
      aria-label={`Select ${title}`}
    >
      {/* Big emoji icon */}
      <span className="mode-card__icon" aria-hidden="true">
        {icon}
      </span>

      {/* Card title */}
      <h2 className="mode-card__title">{title}</h2>

      {/* Card description */}
      <p className="mode-card__desc">{desc}</p>

      {/* Call-to-action button */}
      <span className="mode-card__btn">Enter →</span>
    </button>
  );
}

/*
 * "export default" makes this component importable in other files.
 * Without this line, other files can't use ModeCard.
 */
export default ModeCard;
