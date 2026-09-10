import { Link } from "react-router-dom";

export default function FeatureCard({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="flex min-h-[190px] flex-col gap-3.5 rounded-lg border border-border bg-surface p-8 no-underline shadow-sm transition-colors hover:border-border-strong hover:bg-surface-raised"
    >
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-sm bg-accent/10 text-accent-ink">
        {icon}
      </span>
      <span className="text-[19px] font-semibold text-ink">{title}</span>
      <p className="flex-1 text-sm text-ink-soft">{description}</p>
      <span className="text-[13px] font-medium text-accent-ink">Open →</span>
    </Link>
  );
}
