export default function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">ברוכים הבאים למערכת איתם 23</h2>
      <p className="mt-2 text-sm text-slate-600">
        התחילו בניהול המשלוחים שלכם, זיהוי חריגות וחיזוי זמן הגעה מתקדם.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a className="rounded-xl bg-brand-700 px-4 py-2 text-white" href="/dashboard">
          מעבר לדשבורד
        </a>
        <a className="rounded-xl border border-brand-700 px-4 py-2 text-brand-700" href="/shipments/new">
          הוספת משלוח חדש
        </a>
      </div>
    </section>
  );
}
