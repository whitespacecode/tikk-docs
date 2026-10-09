// What a confirmed booking looks like in the host's own calendar. The text
// mirrors tikk/lang/en/calendar_events.php — update both together.
export const CalendarEventPreview = () => {
  const [variant, setVariant] = useState("one");

  // A date a few days out, so the example always reads as an upcoming booking.
  const date = useMemo(() => {
    const upcoming = new Date();
    upcoming.setDate(upcoming.getDate() + 5);

    return {
      short: upcoming.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
      long: upcoming.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    };
  }, []);

  const hourHeight = 56;
  const hours = ["09:00", "10:00", "11:00", "12:00"];

  const variants = {
    one: {
      title: "Jane Doe: Intro call",
      time: "10:00 – 10:30",
      minutes: 30,
      lines: [
        "Event details:",
        "Invitee: Jane Doe",
        "Invitee email: jane@example.com",
        "Notes: I'd like to talk about pricing.",
        "Meeting link: https://meet.jit.si/tikk-8f3k2",
      ],
    },
    group: {
      title: "Group Workshop",
      time: "10:00 – 11:00",
      minutes: 60,
      lines: ["Event details:", "Meeting link: https://meet.jit.si/tikk-8f3k2"],
    },
  };

  const event = variants[variant];
  const manage =
    "Should you need to cancel or reschedule this booking, we recommend you use the cancel and reschedule feature from your Tikk dashboard:";

  const tab = (key, label) => (
    <button
      type="button"
      onClick={() => setVariant(key)}
      className={
        "rounded-md px-3 py-1 text-xs font-medium transition-colors " +
        (variant === key
          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 inline-flex gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
        {tab("one", "1:1 booking")}
        {tab("group", "Group session")}
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        {/* The event in a day column */}
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:col-span-2">
          <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {date.short}
          </div>
          <div
            className="relative"
            style={{ height: hourHeight * (hours.length - 1) }}
          >
            {hours.map((hour, index) => (
              <div
                key={hour}
                className="absolute inset-x-0 flex items-start gap-2"
                style={{ top: index * hourHeight }}
              >
                <span className="-mt-2 w-9 shrink-0 text-[10px] text-zinc-400">
                  {hour}
                </span>
                <span className="flex-1 border-t border-zinc-100 dark:border-zinc-800" />
              </div>
            ))}
            <div
              className="absolute right-0 overflow-hidden rounded-md border-l-4 border-emerald-500 bg-emerald-100 px-2 py-1 dark:bg-emerald-900/50"
              style={{
                left: 44,
                top: hourHeight + 1,
                height: (hourHeight * event.minutes) / 60 - 2,
              }}
            >
              <div className="truncate text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                {event.title}
              </div>
              <div className="truncate text-[10px] text-emerald-800 dark:text-emerald-200">
                {event.time}
              </div>
            </div>
          </div>
        </div>

        {/* The event opened */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:col-span-3">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm bg-emerald-500" />
            <div className="min-w-0">
              <div className="text-base font-semibold text-zinc-900 dark:text-white">
                {event.title}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {date.long} · {event.time}
              </div>
            </div>
          </div>
          <div className="mt-4 break-words border-t border-zinc-100 pt-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
            {event.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
            <div className="mt-4">{manage}</div>
            <div className="text-emerald-700 dark:text-emerald-400">
              https://app.tikk.chat/calendar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
