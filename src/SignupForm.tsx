import { useState } from 'react'
// FIX 0 (import): import { useState, type FormEvent } from 'react'

// FIX 1 (helper): one reusable, high-contrast focus ring for every control.
// const focusRing = 'outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
// WHY: focus-visible shows the ring for keyboard users only (not on mouse click); ring-offset-2 adds a white gap so it
// stands out against any background. outline-hidden (unlike outline-none) still shows in Windows High Contrast mode.

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [updates, setUpdates] = useState(false)
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)

  function submit() {
    // FIX 0: function submit(e: FormEvent) {
    //          e.preventDefault()
    // WHY: stops the browser reloading the page when the real <form> submits.
    const nErr = name.trim() ? '' : 'Name is required.'
    const eErr = /^\S+@\S+\.\S+$/.test(email) ? '' : 'Enter a valid email address, e.g. name@example.com.'
    setNameError(nErr)
    setEmailError(eErr)
    setSent(!nErr && !eErr)
  }

  return (
    // FLAW 0: a plain <div>, not a <form>. Pressing Return inside a field does nothing.
    <div className="space-y-5">
      {/* FIX 0: <form noValidate className="space-y-5" onSubmit={submit}>
          WHY: a real <form> plus a type="submit" button means Return in any field submits.
          noValidate turns off the browser's own popups so our accessible messages are used instead.
          (Remember to change the closing </div> at the bottom to </form>.) */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          {/* FLAW 1a: a <div> that only looks like a label. The input has no accessible name. */}
          <div className="block text-sm font-medium">Name</div>
          {/* FIX 1a: <label htmlFor="name" className="block text-sm font-medium">Name</label>
              WHY: htmlFor links the label to the input's id. Screen readers announce "Name, edit text",
              and clicking the label focuses the field. */}

          {/* FLAW 1b: outline-none deletes the browser's focus indicator. Keyboard users can't see where they are. */}
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* FIX 1b + 4: <input
                id="name"
                aria-invalid={nameError ? true : undefined}
                aria-describedby="name-error"
                className={`mt-1 w-full rounded-md border border-slate-300 px-3 py-2 ${focusRing}`}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              WHY: the focus ring replaces outline-none. aria-invalid makes the screen reader say "invalid entry";
              aria-describedby points at the error's id, so the message is read whenever the field gets focus. */}

          {/* FLAW 4: just red text. Not linked to the input and never announced. */}
          <p className="mt-1 text-sm text-red-600">{nameError}</p>
          {/* FIX 4: <p id="name-error" aria-live="polite" className="mt-1 text-sm text-red-600">{nameError}</p>
              WHY: id is the target of aria-describedby; aria-live="polite" announces the text as soon as it changes.
              Keep the <p> always rendered so only its text changes, otherwise the announcement can be missed. */}
        </div>

        <div>
          {/* FLAW 1a: same fake label. */}
          <div className="block text-sm font-medium">Email</div>
          {/* FIX 1a: <label htmlFor="email" className="block text-sm font-medium">Email</label> */}

          {/* FLAW 1b: no focus ring, no error wiring. */}
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* FIX 1b + 4: <input
                id="email"
                type="email"
                aria-invalid={emailError ? true : undefined}
                aria-describedby="email-error"
                className={`mt-1 w-full rounded-md border border-slate-300 px-3 py-2 ${focusRing}`}
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              /> */}

          {/* FLAW 4: silent error. */}
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
          {/* FIX 4: <p id="email-error" aria-live="polite" className="mt-1 text-sm text-red-600">{emailError}</p> */}
        </div>
      </div>

      {/* FLAW 2: a div "checkbox". No focus, no role, no checked state. Tab skips it, Space does nothing. */}
      <div className="flex cursor-pointer items-center gap-2" onClick={() => setUpdates(!updates)}>
        <div className={`h-5 w-5 rounded border border-slate-400 ${updates ? 'bg-indigo-600' : 'bg-white'}`} />
        <span>Send me product updates</span>
      </div>
      {/* FIX 2: <label className="flex w-fit items-center gap-2">
                   <input type="checkbox" className={`h-5 w-5 accent-indigo-600 ${focusRing}`} checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
                   Send me product updates
                 </label>
          WHY: a native checkbox is focusable, toggles with Space and announces "checked / not checked" for free.
          Wrapping it in <label> gives it a name and keeps the text clickable. */}

      {/* FLAW 3: a div "button". Not in the Tab order, and Return/Space do nothing. Keyboard users can't submit. */}
      <div className="inline-block cursor-pointer rounded-md bg-indigo-600 px-4 py-2 font-medium text-white" onClick={submit}>
        Subscribe
      </div>
      {/* FIX 3: <button type="submit" className={`rounded-md bg-indigo-600 px-4 py-2 font-medium text-white ${focusRing}`}>Subscribe</button>
          WHY: a native <button> is focusable and works with Return and Space. type="submit" fires the form's onSubmit,
          so Return inside any field submits too. */}

      {/* FLAW 5: the success message isn't in a live region either. */}
      <p className="text-sm text-green-700">{sent && 'Thanks! You are subscribed.'}</p>
      {/* FIX 5: <p role="status" aria-live="polite" className="text-sm text-green-700">{sent && 'Thanks! You are subscribed.'}</p>
          WHY: screen readers announce the confirmation without moving focus. */}
    </div>
  )
}
