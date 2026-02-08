import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מעקב מכולות - איתם 23",
  description: "מערכת חיזוי וניהול משלוחים חכמה"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen font-sans">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-brand-700">מעקב מכולות - איתם 23</h1>
              <p className="text-sm text-slate-600">
                מתי זה אצלי, ומה עלול להשתבש בדרך? כל המידע, ההקשר והחיזוי במקום אחד.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm font-medium text-brand-700">
              <a className="rounded-full bg-brand-50 px-4 py-2" href="/dashboard">המשלוחים שלי</a>
              <a className="rounded-full bg-brand-50 px-4 py-2" href="/shipments/new">הוספת משלוח</a>
              <a className="rounded-full bg-brand-50 px-4 py-2" href="/portfolio">מצב כלל המשלוחים</a>
              <a className="rounded-full bg-brand-50 px-4 py-2" href="/map">מפת מסלול</a>
              <a className="rounded-full bg-brand-50 px-4 py-2" href="/login">כניסה</a>
            </nav>
          </header>
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
