export const metadata = {
  title: "Canvasser",
  description: "Instructure Canvas LMS Teacher Utilities",
};

export default function RootLayout({ children }) {
  const style = { margin: 0 };
  return (
    <html lang="en">
      <body style={style}>{children}</body>
    </html>
  );
}
