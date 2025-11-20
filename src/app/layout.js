
import "./globals.css";
import { AuthProvider } from "../app/context/AuthContext";

export const metadata = {
  title: "Mentoroid",
  description: "Your app description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );

}