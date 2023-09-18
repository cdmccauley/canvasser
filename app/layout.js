import Provider from "./provider";
export const metadata = {
  title: "Canvasser",
  description: "Instructure Canvas LMS Teacher Utilities",
};

export default function RootLayout({ children }) {
  const style = { backgroundColor: "#555", color: "#FFF" };
  // provide nextauth session to client
  return (
    <html lang="en">
      <body style={style}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
