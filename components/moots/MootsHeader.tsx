export default function MootsHeader() {
  return (
    <div className="mutuals-header">
      <div className="mutuals-header-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img1.picmix.com/output/stamp/normal/1/6/4/3/2763461_c4a5d.png"
          alt=""
        />
      </div>

      <div className="mutuals-header-content">
        <div className="mutuals-header-top">
          <span className="mutuals-header-label">moots!!</span>
          <div className="mutuals-header-line"></div>
        </div>

        <p className="mutuals-header-message">
          the people I&apos;ve met, made things with, and kept close along the way. some are
          collaborators, some are just friends who put up with my rambling — all of them made the
          internet a little less lonely.
        </p>
      </div>
    </div>
  );
}