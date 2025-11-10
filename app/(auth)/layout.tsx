// app/(auth)/layout.tsx
import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      <main>{children}</main>
    </div>
  );
}
