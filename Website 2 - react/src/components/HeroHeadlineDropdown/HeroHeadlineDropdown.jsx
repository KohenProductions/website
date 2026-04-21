import './HeroHeadlineDropdown.css';

/**
 * Inline trigger + menu for hero headline “want?▾”.
 * Children = existing word span (letters); keeps layout inline with headline.
 */
export function HeroHeadlineDropdownTrigger({ children, items }) {
  return (
    <span className="hero-dd">
      {children}
      <span className="hero-dd-caret" aria-hidden>
        ▾
      </span>
      <ul className="hero-dd-menu" role="menu" aria-label="Browse categories">
        {items.map(item => (
          <li key={item.href} role="none">
            <a href={item.href} role="menuitem" className="hero-dd-item">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </span>
  );
}
