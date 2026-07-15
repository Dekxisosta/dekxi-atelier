export default function BlogHeader() {
  return (
    <div className="blog-header">
      <div className="blog-header-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img1.picmix.com/output/stamp/normal/1/6/4/3/2763461_c4a5d.png"
          alt=""
        />
      </div>

      <div className="blog-header-content">
        <div className="blog-header-top">
          <span className="blog-header-label">blog log!!</span>
          <div className="blog-header-line"></div>
        </div>

        <p className="blog-header-message">
          {/* your blog description text goes here */}
        </p>
      </div>
    </div>
  );
}