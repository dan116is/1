export default function LoginPage() {
  return (
    <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">כניסה למערכת</h2>
      <p className="text-sm text-slate-600">התחבר כדי לצפות במשלוחים שלך ולקבל התראות חכמות.</p>
      <form className="grid gap-4" action="/api/auth/login" method="post">
        <label className="grid gap-2 text-sm">
          אימייל / שם משתמש
          <input
            name="email"
            className="rounded-xl border border-slate-200 px-4 py-2"
            placeholder="demo@itam23.local"
            required
          />
        </label>
        <label className="grid gap-2 text-sm">
          סיסמה
          <input
            type="password"
            name="password"
            className="rounded-xl border border-slate-200 px-4 py-2"
            placeholder="itam23"
            required
          />
        </label>
        <button className="rounded-xl bg-brand-700 px-4 py-2 text-white">כניסה</button>
      </form>
      <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
        משתמש דמו: demo@itam23.local | סיסמה: itam23
      </div>
    </section>
  );
}
