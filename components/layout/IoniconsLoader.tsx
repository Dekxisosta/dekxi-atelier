import Script from "next/script";

export default function IoniconsLoader() {
  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
        strategy="afterInteractive"
      />
      <Script
        noModule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
        strategy="afterInteractive"
      />
    </>
  );
}