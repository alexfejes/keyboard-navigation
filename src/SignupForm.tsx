import { useState, type SubmitEvent } from 'react'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [updates, setUpdates] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e?: SubmitEvent<HTMLFormElement>) {
    e?.preventDefault()
    const err = /^\S+@\S+\.\S+$/.test(email) ? '' : 'Enter a valid email, e.g. name@example.com.'
    setError(err)
    setSent(!err)
  }

  return (
    <form noValidate onSubmit={submit}>
      {/* FLAW 1a: a fake label. FIX — WHY: htmlFor gives the input its accessible name. */}
      <div>Email</div>
      {/* <label htmlFor="email">Email</label> */}

      {/* FLAW 1b: outline none hides focus. FIX — WHY: keep the focus ring; aria links the error to the input. */}
      <input style={{ outline: 'none' }} value={email} onChange={(e) => setEmail(e.target.value)} />
      {/* <input id="email" type="email" aria-invalid={!!error} aria-describedby="email-error" value={email} onChange={(e) => setEmail(e.target.value)} /> */}

      {/* FLAW 2: silent error. FIX — WHY: aria-live announces it when the text changes. */}
      <p className="error">{error}</p>
      {/* <p id="email-error" aria-live="polite" className="error">{error}</p> */}

      {/* FLAW 3: a div "checkbox", Tab skips it. FIX — WHY: a native checkbox is focusable and announces its state. */}
      <div onClick={() => setUpdates(!updates)}>{updates ? '☑' : '☐'} Send me updates</div>
      {/* <label><input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} />Send me updates</label> */}

      {/* FLAW 4: a div "button", not focusable. FIX — WHY: a real button works with Tab, Return and Space. */}
      <div className="btn" onClick={() => submit()}>Subscribe</div>
      {/* <button>Subscribe</button> */}

      {/* FLAW 5: success isn't announced. FIX — WHY: role="status" reads it out without moving focus. */}
      <p className="ok">{sent && 'Thanks! You are subscribed.'}</p>
      {/* <p role="status" className="ok">{sent && 'Thanks! You are subscribed.'}</p> */}
    </form>
  )
}
