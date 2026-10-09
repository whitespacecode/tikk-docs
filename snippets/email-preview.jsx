// The booking emails as they arrive. Text mirrors tikk/lang/en/mail.php and
// the layouts in tikk/resources/views/emails/requests/*.blade.php — update
// both together. Fee amounts are left as placeholders on purpose.
export const EmailPreview = ({ email, initialAudience = "host" }) => {
  const [audience, setAudience] = useState(initialAudience);
  const [selected, setSelected] = useState({ host: "newRequest", booker: "accepted" });
  const [plan, setPlan] = useState("free");

  // Dates as the emails print them: "Wednesday, October 14, 2026 at 10:00".
  const dates = useMemo(() => {
    const format = (daysAhead, time) => {
      const day = new Date();
      day.setDate(day.getDate() + daysAhead);

      return (
        day.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
        " at " +
        time
      );
    };

    return {
      upcoming: format(5, "10:00"),
      moved: format(7, "14:00"),
      tomorrow: format(1, "10:00"),
    };
  }, []);

  // The topic is what the booker typed in Additional Notes, not the service.
  const topic = "I'd like to talk about pricing.";
  const from = "Jane Doe (jane@example.com)";
  const ics = "meeting.ics";

  // Each email is its template's blocks in order. In text, a string is text,
  // { b } is bold and { placeholder } is a value we leave out.
  const lines = (rows) => ({ lines: rows });
  const p = (...parts) => ({ p: parts });
  const button = (label) => ({ button: label });
  const joinButton = button("Join Video Meeting");
  const icsNote = p("A calendar file (.ics) is attached — open it to add this booking to your calendar.");

  const emails = {
    newRequest: {
      audience: "host",
      label: "New request",
      when: "With manual approval, when someone requests a time",
      subject: "New Meeting Request from Jane Doe",
      title: "New Meeting Request",
      greeting: "Hi Sam,",
      blocks: [
        p("You have a new meeting request!"),
        lines([
          ["Topic", topic],
          ["From", from],
          ["When", dates.upcoming],
          ["Duration", "30 minutes"],
        ]),
        p("Head to your dashboard to accept or decline this request."),
        button("View Dashboard"),
      ],
    },
    booked: {
      audience: "host",
      label: "New booking",
      when: "When a booking is confirmed",
      subject: "New Meeting Booked: " + topic,
      title: "New Meeting Booked",
      greeting: "Hi Sam,",
      attachment: ics,
      blocks: [
        p("A new meeting has been confirmed on your schedule."),
        lines([
          ["Topic", topic],
          ["From", from],
          ["When", dates.upcoming],
          ["Duration", "30 minutes"],
        ]),
        joinButton,
        icsNote,
      ],
    },
    reminderHost: {
      audience: "host",
      label: "Reminder",
      when: "24 hours before the meeting",
      subject: "Reminder: Meeting Tomorrow — " + topic,
      title: "Your meeting is tomorrow",
      greeting: "Hi Sam,",
      blocks: [
        p("Just a heads-up. You have a meeting scheduled for tomorrow."),
        lines([
          ["Topic", topic],
          ["With", from],
          ["When", dates.tomorrow],
          ["Duration", "30 minutes"],
        ]),
        joinButton,
      ],
    },
    accepted: {
      audience: "booker",
      label: "Confirmed",
      when: "When the booking is confirmed",
      subject: "Request Accepted: Meeting confirmed with Sam",
      title: "Meeting Confirmed!",
      greeting: "Hi Jane Doe,",
      attachment: ics,
      blocks: [
        p({ b: "Sam" }, " has accepted your request."),
        lines([
          ["Topic", topic],
          ["When", dates.upcoming],
          ["Duration", "30 minutes"],
        ]),
        joinButton,
        icsNote,
      ],
    },
    paymentRequired: {
      audience: "booker",
      label: "Payment required",
      when: "When you accept a request for a paid service",
      subject: "Action Required: Complete Payment for Your Meeting with Sam",
      title: "Payment Required",
      greeting: "Hi Jane Doe,",
      blocks: [
        p({ b: "Sam" }, " has accepted your request, but payment is required to finalize the booking."),
        lines([
          ["Request", topic],
          ["Duration", "30 minutes"],
        ]),
        {
          table: "Payment Breakdown",
          rows: [
            ["Booking Price", "€60,00"],
            ["Transaction Fee", { placeholder: "fee" }],
            [{ b: "Total" }, { placeholder: "total" }],
          ],
        },
        p("Please verify and complete the payment to secure your time slot."),
        button("Complete Payment"),
        p("If you do not complete the payment, the request may be cancelled."),
      ],
    },
    declined: {
      audience: "booker",
      label: "Declined",
      when: "When you decline, or a request expires unanswered",
      subject: "Meeting Request Update from Sam",
      title: "Meeting Request Update",
      greeting: "Hi Jane Doe,",
      blocks: [
        p("Unfortunately, ", { b: "Sam" }, " was unable to accommodate your meeting request at this time."),
        {
          table: "Detail",
          rows: [
            [{ b: "Topic" }, topic],
            [{ b: "Duration" }, "30 minutes"],
            [{ b: "Requested for" }, dates.upcoming],
          ],
        },
        p("Feel free to reach out again with an alternative time."),
      ],
    },
    rescheduled: {
      audience: "booker",
      label: "Rescheduled",
      when: "When you move the booking",
      subject: "Meeting Rescheduled: " + topic,
      title: "Meeting Rescheduled",
      greeting: "Hi Jane Doe,",
      attachment: ics,
      blocks: [
        p({ b: "Sam" }, " has rescheduled your meeting."),
        lines([
          ["Topic", topic],
          ["Previous time", dates.upcoming],
          ["New time", dates.moved],
          ["Duration", "30 minutes"],
        ]),
        p("The meeting link remains the same:"),
        joinButton,
        p("An updated calendar file (.ics) is attached — open it to update this booking in your calendar."),
      ],
    },
    cancelled: {
      audience: "booker",
      label: "Cancelled",
      when: "When you cancel, with the message you wrote",
      subject: "Meeting Cancelled: " + topic,
      title: "Meeting Cancelled",
      greeting: "Hi Jane Doe,",
      blocks: [
        p({ b: "Sam" }, " has cancelled your meeting."),
        {
          table: "Detail",
          rows: [
            [{ b: "Topic" }, topic],
            [{ b: "Duration" }, "30 minutes"],
            [{ b: "Was scheduled for" }, dates.upcoming],
          ],
        },
        p({ b: "Message from the host" }),
        { p: ["Something came up, sorry! Could you pick a time next week?"], tight: true },
      ],
    },
    reminderBooker: {
      audience: "booker",
      label: "Reminder",
      when: "24 hours before the meeting",
      subject: "Reminder: Meeting Tomorrow — " + topic,
      title: "Your meeting is tomorrow",
      greeting: "Hi Jane Doe,",
      blocks: [
        p("Just a heads-up. Your meeting with ", { b: "Sam" }, " is scheduled for tomorrow."),
        lines([
          ["Topic", topic],
          ["When", dates.tomorrow],
          ["Duration", "30 minutes"],
        ]),
        joinButton,
      ],
    },
  };

  const key = email || selected[audience];
  const current = emails[key];
  const isBooker = current.audience === "booker";

  const text = (parts) =>
    parts.map((part, index) => {
      if (typeof part === "string") {
        return <span key={index}>{part}</span>;
      }
      if (part.b) {
        return (
          <strong key={index} className="font-semibold text-zinc-900">
            {part.b}
          </strong>
        );
      }
      return (
        <span
          key={index}
          className="rounded bg-zinc-100 px-1 font-mono text-[11px] text-zinc-500"
        >
          {part.placeholder}
        </span>
      );
    });

  const cell = (value) => text(Array.isArray(value) ? value : [value]);

  const pills = (options, value, onChange) => (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={
            "rounded-md px-3 py-1 text-xs font-medium transition-colors " +
            (value === option.value
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200")
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const block = (item, index) => {
    if (item.lines) {
      return (
        <div key={index} className="mt-4">
          {item.lines.map(([label, value]) => (
            <div key={label}>
              <strong className="font-semibold text-zinc-900">{label}:</strong>{" "}
              {value}
            </div>
          ))}
        </div>
      );
    }
    if (item.table) {
      return (
        <table key={index} className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="pb-1 text-left font-semibold text-zinc-900">
                {item.table}
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {item.rows.map(([label, value], row) => (
              <tr key={row} className="border-b border-zinc-100 last:border-0">
                <td className="py-1 pr-3 align-top">{cell(label)}</td>
                <td className="py-1 text-right">{cell(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (item.button) {
      return (
        <div key={index} className="my-5 text-center">
          <span className="inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">
            {item.button}
          </span>
        </div>
      );
    }
    return (
      <p key={index} className={item.tight ? "" : "mt-4"}>
        {text(item.p)}
      </p>
    );
  };

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {!email && (
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {pills(
              [
                { label: "Emails to you", value: "host" },
                { label: "Emails to the booker", value: "booker" },
              ],
              audience,
              setAudience,
            )}
            {audience === "booker" &&
              pills(
                [
                  { label: "On Free", value: "free" },
                  { label: "On Pro", value: "pro" },
                ],
                plan,
                setPlan,
              )}
          </div>
          {pills(
            Object.keys(emails)
              .filter((name) => emails[name].audience === audience)
              .map((name) => ({ label: emails[name].label, value: name })),
            selected[audience],
            (value) => setSelected({ ...selected, [audience]: value }),
          )}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Sent {current.when.charAt(0).toLowerCase() + current.when.slice(1)}.
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
        {/* Mail client header */}
        <div className="border-b border-zinc-100 px-4 py-3 text-xs text-zinc-500">
          <div className="text-sm font-semibold text-zinc-900">
            {current.subject}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="text-zinc-400">From</span> Tikk
            </span>
            <span>
              <span className="text-zinc-400">To</span>{" "}
              {isBooker ? "jane@example.com" : "you"}
            </span>
          </div>
          {current.attachment && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600">
              <svg
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="3" width="12" height="11" rx="1.5" />
                <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
              </svg>
              {current.attachment}
            </div>
          )}
        </div>

        {/* Message body, laid out like the Laravel mail template */}
        <div className="bg-zinc-50 px-3 py-5 sm:px-6">
          <img
            src="/images/logo.svg"
            alt="Tikk"
            className="mx-auto mb-4 h-8 w-auto"
          />
          <div className="mx-auto max-w-md break-words rounded-lg bg-white px-5 py-6 text-sm leading-6 text-zinc-700 shadow-sm ring-1 ring-zinc-100">
            <div className="text-lg font-bold text-zinc-900">{current.title}</div>
            <p className="mt-4">{current.greeting}</p>
            {current.blocks.map(block)}

            <p className="mt-4">
              Thanks,
              <br />
              Tikk
            </p>

            {isBooker && plan === "free" && (
              <div className="mt-6 border-t border-zinc-200 pt-4 text-center text-xs text-zinc-400">
                Sent with tikk — scheduling made simple
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
