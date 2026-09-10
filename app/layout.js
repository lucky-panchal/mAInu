import "./globals.css";

export const metadata = {
  title: "mAInu",
  description: "mAInu app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
