// A booking in your Inbox that you move along by hand: the badge it shows and
// the emails each step sends. Mirrors tikk/app/Services/BookingService.php,
// MolliePaymentService.php, RequestController.php (update, reschedule, cancel),
// AutoDeclineExpiredRequests.php, the row and badges in RequestRow.vue and the
// subjects in lang/en/mail.php. Webhook names come from
// app/Support/WebhookEvents.php. Update both together.
export const BookingLifecycle = ({
  initialPaid = false,
  initialManual = false,
  events = false,
}) => {
  const [paid, setPaid] = useState(initialPaid);
  const [manual, setManual] = useState(initialManual);
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState([]);
  const [reminded, setReminded] = useState(false);

  // Inline colours: the RequestRow.vue badge classes, as hex.
  const badges = {
    pending: { label: "Pending", background: "#ffedd5", color: "#c2410c" },
    awaiting: { label: "Awaiting Payment", background: "#fef9c3", color: "#a16207" },
    accepted: { label: "Accepted", background: "#dcfce7", color: "#15803d" },
    declined: { label: "Declined", background: "#f4f4f5", color: "#71717a" },
    cancelled: { label: "Cancelled", background: "#f4f4f5", color: "#71717a" },
  };

  const slot = {
    pending: "Slot still open to others",
    awaiting: "Slot held for the booker",
    accepted: "On your calendar",
    declined: "Nothing booked",
    cancelled: "Slot open again",
  };

  // The topic is what the booker typed in Additional Notes, not the service.
  const topic = "I'd like to talk about pricing.";

  const mail = {
    newRequest: { to: "You", subject: "New Meeting Request from Jane Doe" },
    confirmed: { to: "Jane", subject: "Request Accepted: Meeting confirmed with Sam" },
    booked: { to: "You", subject: "New Meeting Booked: " + topic },
    declined: { to: "Jane", subject: "Meeting Request Update from Sam" },
    paymentRequired: {
      to: "Jane",
      subject: "Action Required: Complete Payment for Your Meeting with Sam",
    },
    receiptHost: { to: "You", subject: "Payment Received: €60,00 from \"Jane Doe\"" },
    receiptBooker: { to: "Jane", subject: "Payment Confirmation: €… for \"" + topic + "\"" },
    rescheduled: { to: "Jane", subject: "Meeting Rescheduled: " + topic },
    cancelled: { to: "Jane", subject: "Meeting Cancelled: " + topic },
    reminder: { to: "Both", subject: "Reminder: Meeting Tomorrow — " + topic },
  };

  const confirm = paid
    ? [mail.receiptBooker, mail.receiptHost, mail.confirmed, mail.booked]
    : [mail.confirmed, mail.booked];

  // What you can do from each status, and where it leads.
  const actions = {
    start: [
      manual
        ? { label: "Jane requests a time", to: "pending", mails: [mail.newRequest], event: "booking.requested" }
        : paid
          ? { label: "Jane books and goes to checkout", to: "awaiting", mails: [] }
          : { label: "Jane books", to: "accepted", mails: confirm, event: "booking.confirmed" },
    ],
    pending: [
      paid
        ? { label: "You accept", to: "awaiting", mails: [mail.paymentRequired] }
        : { label: "You accept", to: "accepted", mails: confirm, event: "booking.confirmed" },
      { label: "You decline", to: "declined", mails: [mail.declined], event: "booking.declined" },
      { label: "The slot time passes", to: "declined", mails: [mail.declined], event: "booking.declined" },
    ],
    awaiting: [
      { label: "Jane pays", to: "accepted", mails: confirm, event: "booking.confirmed" },
      { label: "Payment fails", to: "cancelled", mails: [], event: "booking.cancelled" },
    ],
    accepted: [
      !reminded && { label: "A day before", to: "accepted", mails: [mail.reminder], reminder: true },
      { label: "You reschedule", to: "accepted", mails: [mail.rescheduled], event: "booking.rescheduled" },
      paid
        ? null
        : { label: "You cancel", to: "cancelled", mails: [mail.cancelled], event: "booking.cancelled" },
    ].filter(Boolean),
  };

  const available = actions[status || "start"] || [];

  const run = (action) => {
    setStatus(action.to);
    setLog(log.concat([action]));
    if (action.reminder) {
      setReminded(true);
    }
  };

  const restart = () => {
    setStatus(null);
    setLog([]);
    setReminded(false);
  };

  const reset = (apply) => (value) => {
    apply(value);
    restart();
  };

  const toggle = (options, value, onChange) => (
    <div className="inline-flex gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onChange(option.value)}
          className={
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors " +
            (value === option.value
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200")
          }
        >
          {option.label}
          {option.pro && (
            <span className="rounded bg-emerald-100 px-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              Pro
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const date = useMemo(() => {
    const upcoming = new Date();
    upcoming.setDate(upcoming.getDate() + 5);

    return upcoming.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap gap-2">
        {toggle(
          [
            { label: "Free service", value: false },
            { label: "Paid service", value: true },
          ],
          paid,
          reset(setPaid),
        )}
        {toggle(
          [
            { label: "Instant", value: false },
            { label: "Manual approval", value: true, pro: true },
          ],
          manual,
          reset(setManual),
        )}
      </div>

      {/* The Inbox, light like the real one */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-2 text-black dark:border-zinc-800">
        {status ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[11px] font-semibold text-zinc-500">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 truncate">
                <span className="truncate text-sm font-semibold text-black/80">Jane Doe</span>
                <span className="hidden text-black/20 sm:inline">·</span>
                <span className="hidden truncate text-sm text-black/40 sm:inline">"{topic}"</span>
              </div>
              <div className="truncate text-xs text-black/40">{slot[status]}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-xs text-black/30 sm:inline">30min</span>
              {paid && <span className="hidden text-xs font-medium text-black/50 sm:inline">€60,00</span>}
              <span
                className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider"
                style={{ backgroundColor: badges[status].background, color: badges[status].color }}
              >
                {badges[status].label}
              </span>
              <span className="hidden text-xs text-black/30 sm:inline">{date}</span>
            </div>
          </div>
        ) : (
          <div className="px-2 py-3.5 text-center text-xs text-black/30">
            Nothing in your Inbox yet
          </div>
        )}
      </div>

      {/* What to do next */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {available.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => run(action)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            {action.label} →
          </button>
        ))}
        {available.length === 0 && (
          <span className="text-xs text-zinc-400">That's the end of this booking.</span>
        )}
        {log.length > 0 && (
          <button
            type="button"
            onClick={restart}
            className="ml-auto text-xs text-zinc-400 underline hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Start over
          </button>
        )}
      </div>

      {/* What has happened so far */}
      {log.length > 0 && (
        <ol className="mt-4 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-700">
          {log.map((entry, index) => (
            <li key={index} className="text-xs">
              <div className="flex flex-wrap items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                {entry.label}
                {events && entry.event && (
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-normal text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {entry.event}
                  </code>
                )}
              </div>
              {entry.mails.length === 0 && (
                <div className="mt-0.5 text-zinc-400">No email</div>
              )}
              {entry.mails.map((item) => (
                <div key={item.subject} className="mt-0.5 flex gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="shrink-0">✉</span>
                  <span className="w-9 shrink-0 font-medium">{item.to}</span>
                  <span className="min-w-0 break-words">{item.subject}</span>
                </div>
              ))}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
