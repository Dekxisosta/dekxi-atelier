type UnderConstructionProps = {
  label?: string;
  message?: string;
};

export default function UnderConstruction({
  label = "under construction",
  message = "this page is still being wired up — check back soon.",
}: UnderConstructionProps) {
  return (
    <div className="uc-panel">
      <ion-icon name="construct-outline" className="uc-icon"></ion-icon>
      <span className="uc-label">{label}</span>
      <p className="uc-message">{message}</p>
    </div>
  );
}