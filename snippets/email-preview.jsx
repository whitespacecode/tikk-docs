// The booking emails as they arrive. Text mirrors tikk/lang/en/mail.php (the
// booker emails' default wording is under `templates`) and the layouts in
// tikk/resources/views/emails/requests/*.blade.php and
// tikk/resources/views/vendor/mail/html/*. Colours mirror
// tikk/app/Support/MailPalette.php. Update them together. Fee amounts are
// left as placeholders on purpose.
export const EmailPreview = ({ email, initialAudience = "host" }) => {
  const [audience, setAudience] = useState(initialAudience);
  const [selected, setSelected] = useState({ host: "newRequest", booker: "accepted" });
  const [plan, setPlan] = useState("free");

  const host = { name: "Sam", initials: "S", title: "Career coach" };
  const booker = { name: "Jane Doe", first: "Jane", email: "jane@example.com" };
  const service = "Intro call";
  // What the booker typed when booking. Host emails quote it and use it in the subject.
  const topic = "I'd like to talk about pricing.";

  // Dates the way the emails print them.
  const dates = useMemo(() => {
    const make = (daysAhead, hours) => {
      const day = new Date();
      day.setDate(day.getDate() + daysAhead);
      day.setHours(hours, 0, 0, 0);
      return day;
    };
    const weekday = (day) => day.toLocaleDateString("en-GB", { weekday: "long" });
    const month = (day) => day.toLocaleDateString("en-GB", { month: "long" });
    const time = (day) => String(day.getHours()).padStart(2, "0") + ":00";

    const describe = (day) => ({
      month: day.toLocaleDateString("en-GB", { month: "short" }).replace(".", "").toUpperCase(),
      day: String(day.getDate()),
      when: weekday(day) + " at " + time(day),
      date: weekday(day) + " " + day.getDate() + " " + month(day),
      full: weekday(day) + " " + day.getDate() + " " + month(day) + " " + day.getFullYear() + ", " + time(day),
      time: time(day),
    });

    return {
      upcoming: describe(make(5, 10)),
      moved: describe(make(7, 14)),
      tomorrow: describe(make(1, 10)),
    };
  }, []);

  // With Hide Tikk branding (Pro), emails take the colour of the host's booking
  // page; this is one example.
  const palettes = {
    tikk: { accent: "#18181b", accentInk: "#fafafa", accentMuted: "#a1a1aa", tint: "#e4e4e7", tintInk: "#18181b" },
    pro: { accent: "#4f46e5", accentInk: "#ffffff", accentMuted: "#d3d1f9", tint: "#eae9fc", tintInk: "#4f46e5" },
  };

  // Each email is its template's blocks in order. In text, a string is text,
  // { b } is bold, { br } a line break and { placeholder } a value we leave out.
  const p = (...parts) => ({ p: parts });
  const ticket = (at, options = {}) => ({ ticket: at, ...options });
  const details = (rows, total) => ({ details: rows, total });
  const quote = (label, text) => ({ quote: label, text });
  const button = (label) => ({ button: label });
  const note = (text) => ({ note: text });
  const manage = { manage: true };
  const join = button("Join Video Meeting");
  const withBooker = "30 minutes · with " + booker.name;
  const withHost = "30 minutes · with " + host.name;
  const hiHost = { br: "Hi " + host.name + "," };

  const emails = {
    newRequest: {
      audience: "host",
      label: "New request",
      when: "With manual approval, when someone requests a time",
      subject: "New Meeting Request from " + booker.name,
      status: "New request",
      title: "New Meeting Request",
      blocks: [
        p(hiHost, "You have a new meeting request!"),
        ticket(dates.upcoming, { meta: withBooker }),
        details([["From", booker.name + " (" + booker.email + ")"]]),
        quote("Topic", topic),
        p("Head to your dashboard to accept or decline this request."),
        button("View Dashboard"),
      ],
    },
    booked: {
      audience: "host",
      label: "New booking",
      when: "When a booking is confirmed",
      subject: "New Meeting Booked: " + topic,
      status: "Confirmed",
      title: "New Meeting Booked",
      attachment: true,
      blocks: [
        p(hiHost, "A new meeting has been confirmed on your schedule."),
        ticket(dates.upcoming, { meta: withBooker }),
        details([["From", booker.name + " (" + booker.email + ")"]]),
        quote("Topic", topic),
        join,
        note("A calendar file (.ics) is attached — open it to add this booking to your calendar."),
      ],
    },
    reminderHost: {
      audience: "host",
      label: "Reminder",
      when: "24 hours before the meeting",
      subject: "Reminder: Meeting Tomorrow — " + topic,
      status: "Tomorrow",
      title: "Your meeting is tomorrow",
      blocks: [
        p(hiHost, "Just a heads-up. You have a meeting scheduled for tomorrow."),
        ticket(dates.tomorrow, { meta: withBooker }),
        details([["With", booker.name + " (" + booker.email + ")"]]),
        quote("Topic", topic),
        join,
      ],
    },
    rescheduledByBooker: {
      audience: "host",
      label: "Booker rescheduled",
      when: "When a booker moves their booking from the link in their email",
      subject: "Booking rescheduled by " + booker.name + ": " + topic,
      status: "Rescheduled",
      title: "Booking rescheduled",
      attachment: true,
      blocks: [
        p(hiHost, { b: booker.name }, " moved their booking to a new time."),
        ticket(dates.moved, { meta: withBooker }),
        details([["Previous time", dates.upcoming.full]]),
        note("An updated calendar file (.ics) is attached — open it to update this booking in your calendar."),
      ],
    },
    cancelledByBooker: {
      audience: "host",
      label: "Booker cancelled",
      when: "When a booker cancels from the link in their email",
      subject: "Booking cancelled by " + booker.name + ": " + topic,
      status: "Cancelled",
      title: "Booking cancelled",
      blocks: [
        p(hiHost, { b: booker.name }, " cancelled their booking."),
        ticket(dates.upcoming, { meta: withBooker, struck: true }),
        quote("Their message", "Sorry, something came up at work. I'll book again next month."),
      ],
    },
    accepted: {
      audience: "booker",
      label: "Confirmation",
      when: "When the booking is confirmed",
      rewordable: true,
      subject: "Confirmed: " + service + " with " + host.name,
      status: "Confirmed",
      title: "Meeting Confirmed!",
      attachment: true,
      blocks: [
        p("Hi " + booker.first + ","),
        p("Thanks for booking! Your " + service + " is confirmed, and I'm looking forward to talking with you."),
        ticket(dates.upcoming, { meta: withHost }),
        join,
        note("A calendar file (.ics) is attached — open it to add this booking to your calendar."),
        manage,
      ],
    },
    paymentRequired: {
      audience: "booker",
      label: "Payment required",
      when: "When you accept a request for a paid service",
      subject: "Action Required: Complete Payment for Your Meeting with " + host.name,
      status: "Payment due",
      title: "Payment Required",
      blocks: [
        p({ br: "Hi " + booker.name + "," }, { b: host.name }, " has accepted your request, but payment is required to finalize the booking."),
        ticket(dates.upcoming, { meta: withHost }),
        details(
          [
            ["Booking Price", "€60,00"],
            ["Transaction Fee", { placeholder: "fee" }],
          ],
          [["Total", { placeholder: "total" }]],
        ),
        p("Please verify and complete the payment to secure your time slot."),
        button("Complete Payment"),
        note("If you do not complete the payment, the request may be cancelled."),
      ],
    },
    declined: {
      audience: "booker",
      label: "Decline",
      when: "When you decline, or a request expires unanswered",
      rewordable: true,
      subject: "About your " + service + " request",
      status: "Declined",
      title: "Meeting Request Update",
      blocks: [
        p("Hi " + booker.first + ","),
        p("Thanks for your request. Unfortunately I can't make " + dates.upcoming.date + " at " + dates.upcoming.time + " work. Feel free to pick another time."),
        ticket(dates.upcoming, { meta: withHost, struck: true }),
      ],
    },
    rescheduled: {
      audience: "booker",
      label: "New time",
      when: "When you move the booking",
      rewordable: true,
      subject: "New time for your " + service,
      status: "Rescheduled",
      title: "Meeting Rescheduled",
      attachment: true,
      blocks: [
        p("Hi " + booker.first + ","),
        p("I've moved our " + service + " to a new time. You'll find the details below, and I hope it still suits you."),
        ticket(dates.moved, { meta: withHost }),
        details([["Previous time", dates.upcoming.full]]),
        p("The meeting link remains the same:"),
        join,
        note("An updated calendar file (.ics) is attached — open it to update this booking in your calendar."),
        manage,
      ],
    },
    cancelled: {
      audience: "booker",
      label: "Cancellation",
      when: "When you cancel, with the message you wrote",
      rewordable: true,
      subject: "Cancelled: " + service,
      status: "Cancelled",
      title: "Meeting Cancelled",
      blocks: [
        p("Hi " + booker.first + ","),
        p("I'm sorry, but I've had to cancel our " + service + "."),
        ticket(dates.upcoming, { meta: withHost, struck: true }),
        quote("Message from the host", "Something came up, sorry! Could you pick a time next week?"),
      ],
    },
    reminderBooker: {
      audience: "booker",
      label: "Reminder",
      when: "24 hours before the meeting, unless you switched it off for the service",
      rewordable: true,
      subject: "Reminder: " + service + " tomorrow at " + dates.tomorrow.time,
      status: "Tomorrow",
      title: "Your meeting is tomorrow",
      blocks: [
        p("Hi " + booker.first + ","),
        p("Just a quick reminder that our " + service + " is tomorrow at " + dates.tomorrow.time + ". See you then!"),
        ticket(dates.tomorrow, { meta: withHost }),
        join,
        manage,
      ],
    },
  };

  const key = email || selected[audience];
  const current = emails[key];
  const isBooker = current.audience === "booker";
  // Only bookers of a Pro host who hides Tikk branding see the host's name and
  // colours; everything else is tikk's.
  const isPro = isBooker && plan === "pro";
  const palette = isPro ? palettes.pro : palettes.tikk;

  const text = (parts) =>
    parts.map((part, index) => {
      if (typeof part === "string") {
        return <span key={index}>{part}</span>;
      }
      if (part.br) {
        return (
          <span key={index}>
            {part.br}
            <br />
          </span>
        );
      }
      if (part.b) {
        return (
          <strong key={index} className="font-bold text-zinc-900">
            {part.b}
          </strong>
        );
      }
      return (
        <span key={index} className="rounded bg-zinc-200 px-1 font-mono text-[11px] text-zinc-500">
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
    if (item.ticket) {
      const at = item.ticket;
      return (
        <div key={index} className="mb-5 mt-1 flex items-center rounded-2xl p-4" style={{ backgroundColor: palette.accent }}>
          <div className="w-16 shrink-0 rounded-xl bg-zinc-50 pb-2 pt-1.5 text-center">
            <div className="text-[10px] font-bold tracking-wider text-zinc-600">{at.month}</div>
            <div className="text-2xl font-extrabold leading-7 text-zinc-900">{at.day}</div>
          </div>
          <div className="min-w-0 pl-4">
            <div className="truncate text-xs" style={{ color: palette.accentMuted }}>
              {service}
            </div>
            <div
              className={"mt-0.5 text-base font-extrabold" + (item.struck ? " line-through" : "")}
              style={{ color: palette.accentInk }}
            >
              {at.when}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: palette.accentMuted }}>
              {item.meta}
            </div>
          </div>
        </div>
      );
    }
    if (item.details) {
      return (
        <div key={index} className="mb-5 mt-1 rounded-2xl bg-zinc-100 px-4 py-2.5 text-[13px]">
          {item.details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 py-1">
              <span className="text-zinc-600">{label}</span>
              <span className="break-words text-right font-semibold text-zinc-900">{cell(value)}</span>
            </div>
          ))}
          {(item.total || []).map(([label, value]) => (
            <div key={label} className="mt-1.5 flex justify-between gap-3 border-t border-zinc-200 pt-2 font-extrabold text-zinc-900">
              <span>{label}</span>
              <span>{cell(value)}</span>
            </div>
          ))}
        </div>
      );
    }
    if (item.quote) {
      return (
        <div key={index} className="mb-5 mt-1 rounded-2xl bg-zinc-100 px-4 py-3">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-zinc-600">{item.quote}</div>
          <div className="text-zinc-700">{item.text}</div>
        </div>
      );
    }
    if (item.button) {
      return (
        <div
          key={index}
          className="mb-5 mt-1 rounded-xl px-5 py-3 text-center text-[15px] font-bold"
          style={{ backgroundColor: palette.tint, color: palette.tintInk }}
        >
          {item.button} →
        </div>
      );
    }
    if (item.note) {
      return (
        <p key={index} className="mb-4 text-zinc-600">
          {item.note}
        </p>
      );
    }
    if (item.manage) {
      return (
        <p key={index} className="mb-4 text-zinc-600">
          Plans changed? <span className="font-bold text-zinc-900 underline">Reschedule</span>
          {" · "}
          <span className="font-bold text-zinc-900 underline">Cancel booking</span>
        </p>
      );
    }
    return (
      <p key={index} className="mb-4">
        {text(item.p)}
      </p>
    );
  };

  const caption = current.when.charAt(0).toLowerCase() + current.when.slice(1);

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
                  { label: "Tikk branding", value: "free" },
                  { label: "Your branding (Pro)", value: "pro" },
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
            Sent {caption}.
            {current.rewordable && " On Pro you can reword it per service."}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
        {/* Mail client header */}
        <div className="border-b border-zinc-100 px-4 py-3 text-xs text-zinc-500">
          <div className="text-sm font-semibold text-zinc-900">{current.subject}</div>
          <div className="mt-1">
            <span className="text-zinc-400">To</span> {isBooker ? booker.email : "you"}
          </div>
          {current.attachment && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="12" height="11" rx="1.5" />
                <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
              </svg>
              meeting.ics
            </div>
          )}
        </div>

        {/* The email itself */}
        <div className="bg-[#e9e9ec] px-2 py-5 sm:px-6">
          <div className="mx-auto max-w-md overflow-hidden rounded-3xl break-words text-sm leading-6 text-zinc-700">
            <div className="bg-[#fbfbfb] px-6 pb-4 pt-6">
              <div className="flex items-center justify-between gap-3">
                {isPro ? (
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
                      style={{ backgroundColor: palette.accent, color: palette.accentInk }}
                    >
                      {host.initials}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block font-extrabold text-zinc-900">{host.name}</span>
                      <span className="block text-xs text-zinc-600">{host.title}</span>
                    </span>
                  </div>
                ) : (
                  <img src="/images/logo.svg" alt="Tikk" className="h-7 w-auto" />
                )}
                <span
                  className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: palette.tint, color: palette.tintInk }}
                >
                  {current.status}
                </span>
              </div>

              <div className="mb-3 mt-7 text-[26px] font-extrabold leading-8 tracking-tight text-zinc-900">
                {current.title}
              </div>

              {current.blocks.map(block)}

              <p className="mb-2">
                Thanks,
                <br />
                {isBooker ? host.name : "Tikk"}
              </p>
            </div>

            {isBooker && !isPro && (
              <div className="flex items-center justify-between gap-3 bg-zinc-900 px-6 py-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Made with tikk</div>
                  <div className="mt-1 text-[15px] font-bold leading-5 text-zinc-50">Get your own booking page for free.</div>
                </div>
                <span className="shrink-0 whitespace-nowrap rounded-full bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-900">
                  Start free →
                </span>
              </div>
            )}

            <div className="bg-[#f1f1f3] px-6 pb-7 pt-6 text-xs text-zinc-600">
              <img src="/images/logo.svg" alt="Tikk" className="h-5 w-auto" />
              <div className="mt-2 text-base font-bold text-zinc-900">Scheduling made simple.</div>
              {!isBooker && <div className="mt-2 text-[13px]">Need help? Just reply to this email. We're here to help!</div>}
              <div className="mt-5 font-semibold text-zinc-700">
                Terms and Conditions · Privacy Policy{!isBooker && " · Notification preferences"}
              </div>
              <div className="mt-3">© {new Date().getFullYear()} Tikk. All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
