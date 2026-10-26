import SignupForm from './SignupForm'

export default function App() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12 text-slate-900">
      <h1 className="text-2xl font-bold">Newsletter sign-up</h1>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SignupForm />
      </div>
    </main>
  )
}
