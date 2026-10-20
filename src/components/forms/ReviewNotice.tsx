/**
 * Shown above a form on review deployments with no email provider: the form
 * works and shows its states, but nothing is delivered, so a reviewer must
 * not mistake a test submission for a real enquiry.
 */
export function ReviewNotice() {
  return (
    <p role="note" className="measure border-l-4 border-kraft-400 bg-kraft-200 px-4 py-3 text-spec text-ink">
      <span className="font-semibold">Review copy:</span> this form works, but it is not connected to email yet. Test
      submissions are not delivered to anyone. To reach us, use WhatsApp, phone or email.
    </p>
  )
}
