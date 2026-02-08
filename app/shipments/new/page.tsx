export default function NewShipmentPage() {
  return (
    <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">הוספת משלוח חדש</h2>
      <p className="text-sm text-slate-600">יש להזין לפחות מספר שטר מטען או מספר מכולה.</p>
      <form className="grid gap-4" action="/api/shipments" method="post">
        <label className="grid gap-2 text-sm">
          מספר שטר מטען (BL)
          <input
            name="blNumber"
            className="rounded-xl border border-slate-200 px-4 py-2"
            placeholder="לדוגמה: BL-789456123"
          />
        </label>
        <label className="grid gap-2 text-sm">
          מספר מכולה (אופציונלי)
          <input
            name="containerNumber"
            className="rounded-xl border border-slate-200 px-4 py-2"
            placeholder="TGHU1234567"
          />
        </label>
        <label className="grid gap-2 text-sm">
          חברת ספנות
          <select name="carrier" className="rounded-xl border border-slate-200 px-4 py-2">
            <option>COSCO</option>
            <option>MSC</option>
            <option>Maersk</option>
            <option>Hapag-Lloyd</option>
            <option>אחר</option>
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            נמל יציאה (אופציונלי)
            <input name="originPort" className="rounded-xl border border-slate-200 px-4 py-2" />
          </label>
          <label className="grid gap-2 text-sm">
            נמל יעד (אופציונלי)
            <input name="destinationPort" className="rounded-xl border border-slate-200 px-4 py-2" />
          </label>
        </div>
        <button className="rounded-xl bg-brand-700 px-4 py-2 text-white">בדוק והוסף</button>
        <p className="text-xs text-slate-500">
          אם אין API זמין לחברת הספנות, ניתן להזין אירועים ידנית או לספק Webhook מסוכן השילוח.
        </p>
      </form>
    </section>
  );
}
