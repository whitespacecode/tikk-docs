// What a visitor clicks through on your booking page. Text mirrors the
// publicProfile strings in tikk/resources/js/locales/en.json, the steps in
// resources/js/components/PublicProfile/*.vue and pages/Payment/Success.vue.
// Update both together. Fee amounts are left as placeholders on purpose.
export const BookingFlowPreview = ({ initialManual = false }) => {
  const [manual, setManual] = useState(initialManual);
  const [step, setStep] = useState("service");
  const [serviceKey, setServiceKey] = useState(null);
  const [slot, setSlot] = useState(null);

  const services = {
    intro: {
      title: "Intro call",
      description: "A first chat to see if we're a good fit.",
      duration: 30,
      popular: true,
      slots: ["09:00", "09:30", "10:00", "11:30", "14:00", "14:30"],
    },
    coaching: {
      title: "Coaching session",
      description: "A full session on the goal you bring.",
      duration: 60,
      price: "€60",
      gross: "60.00",
      slots: ["09:00", "10:00", "14:00", "15:00"],
    },
  };

  const service = serviceKey ? services[serviceKey] : null;
  const paid = Boolean(service && service.price);

  // A month view starting today; weekdays from tomorrow on are open.
  const calendar = useMemo(() => {
    const today = new Date();
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const offset = (first.getDay() + 6) % 7;
    const days = [];

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    // Late in the month there may be no weekday left, so open them all.
    const weekdayLeft = Array.from(
      { length: daysInMonth - today.getDate() },
      (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1).getDay(),
    ).some((weekday) => weekday !== 0 && weekday !== 6);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const weekday = date.getDay();
      days.push({
        day,
        date,
        open:
          (day > today.getDate() || !weekdayLeft) &&
          weekday !== 0 &&
          weekday !== 6,
      });
    }

    return {
      label: today.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      days,
    };
  }, []);

  const firstOpen = calendar.days.find((day) => day && day.open);
  const [selectedDay, setSelectedDay] = useState(firstOpen ? firstOpen.day : null);
  const selectedDate = calendar.days.find((day) => day && day.day === selectedDay);

  const when =
    selectedDate && slot
      ? selectedDate.date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }) +
        " at " +
        slot
      : "";

  const flow = ["service", "time", "details"]
    .concat(paid && !manual ? ["checkout"] : [])
    .concat(["done"]);
  const labels = {
    service: "Service",
    time: "Time",
    details: "Details",
    checkout: "Payment",
    done: "Done",
  };

  const restart = () => {
    setStep("service");
    setServiceKey(null);
    setSlot(null);
  };

  const pills = (options, value, onChange) => (
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

  const placeholder = (name, onDark) => (
    <span
      className={
        "rounded px-1 font-mono text-[11px] font-normal " +
        (onDark ? "bg-white/20" : "bg-black/5")
      }
    >
      {name}
    </span>
  );

  const label = (text) => (
    <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-black/30">
      {text}
    </div>
  );

  const field = (name, value, tall) => (
    <div>
      {label(name)}
      <div
        className={
          "w-full rounded-xl border border-black/5 bg-black/[0.02] px-4 py-3 text-sm font-medium text-black " +
          (tall ? "min-h-[4.5rem]" : "")
        }
      >
        {value}
      </div>
    </div>
  );

  const details = (rows) => (
    <div className="mx-auto mt-6 max-w-sm rounded-xl border border-black/5 bg-black/[0.02] px-5 py-4 text-left text-sm">
      {rows.map(([name, value], index) => (
        <div key={name} className={"flex justify-between gap-3 " + (index ? "mt-2" : "")}>
          <span className="text-black/40">{name}</span>
          <span className="text-right font-medium">{value}</span>
        </div>
      ))}
    </div>
  );

  const check = (
    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  const topic = "I'd like to talk about pricing.";

  const screens = {
    service: (
      <div>
        {label("What would you like to book?")}
        <div className="space-y-3">
          {Object.keys(services).map((key) => {
            const item = services[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setServiceKey(key);
                  setSlot(null);
                  setStep("time");
                }}
                className={
                  "w-full rounded-2xl border p-4 text-left transition-all hover:border-black/15 hover:bg-white hover:shadow-sm " +
                  (item.popular ? "border-black/20 bg-white" : "border-black/5 bg-zinc-50")
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{item.title}</span>
                  {item.popular && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: "#fef3c7", color: "#b45309" }}
                    >
                      ★ Popular
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-black/45">{item.description}</div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/50">
                    Video meeting
                  </span>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/50">
                    {item.duration}m
                  </span>
                  {item.price && (
                    <span className="ml-auto text-sm font-semibold text-black/60">
                      {item.price}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    ),

    time: service && (
      <div>
        <div className="mb-3 text-sm font-semibold">{calendar.label}</div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="pb-1 font-medium text-black/30">
              {day}
            </div>
          ))}
          {calendar.days.map((day, index) =>
            day ? (
              <button
                key={index}
                type="button"
                disabled={!day.open}
                onClick={() => setSelectedDay(day.day)}
                className={
                  "rounded-lg py-1.5 text-xs " +
                  (day.day === selectedDay
                    ? "bg-black font-semibold text-white"
                    : day.open
                      ? "bg-black/5 font-semibold text-black/70 hover:bg-black/10"
                      : "text-black/20")
                }
              >
                {day.day}
              </button>
            ) : (
              <span key={index} />
            ),
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {service.slots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => {
                setSlot(time);
                setStep("details");
              }}
              className="rounded-lg bg-black/[0.03] px-2 py-2.5 text-xs font-semibold text-black/60 transition-all hover:bg-black hover:text-white"
            >
              {time}
            </button>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-black/35">
          All times are shown in Brussels time
        </div>
      </div>
    ),

    details: service && (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setStep("time")}
          className="text-xs text-black/45 hover:text-black"
        >
          ← Choose another timeslot
        </button>
        {field("Your name", "Jane Doe")}
        {field("Email address", "jane@example.com")}
        {field("Additional Notes", topic, true)}

        {paid && !manual && (
          <div className="space-y-1.5 rounded-xl bg-black/[0.02] p-4 text-[13px]">
            <div className="flex justify-between text-black/50">
              <span>Session ({service.duration} min)</span>
              <span className="font-medium">€{service.gross}</span>
            </div>
            <div className="flex justify-between text-black/35">
              <span>Transaction fee</span>
              {placeholder("fee")}
            </div>
            <div className="flex justify-between border-t border-black/5 pt-1.5 font-bold text-black/70">
              <span>Total</span>
              {placeholder("total")}
            </div>
          </div>
        )}

        <div>
          <p className="mb-1.5 text-[13px] text-black/35">
            By proceeding, you agree to Tikk.chat's <u>Terms</u> and <u>Privacy Policy</u>.
          </p>
          <button
            type="button"
            onClick={() => setStep(paid && !manual ? "checkout" : "done")}
            className="w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white"
          >
            {manual
              ? "Submit Request"
              : paid
                ? <>Confirm &amp; Pay — €{placeholder("total", true)}</>
                : "Confirm Booking"}
          </button>
          <p className="mt-3 text-center text-[11px] font-medium text-black/25">
            {manual
              ? "Requests are manually reviewed by Sam."
              : paid
                ? "You will be redirected to the payment page."
                : "Your booking will be confirmed immediately."}
          </p>
        </div>
      </div>
    ),

    checkout: (
      <div className="py-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-black/30">
          Payment page
        </div>
        <div className="mx-auto mt-4 max-w-xs space-y-2">
          {["iDEAL", "Bancontact", "Card"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setStep("done")}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium hover:border-black/30"
            >
              {method}
            </button>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-black/35">
          Pick a method to pay.
        </div>
      </div>
    ),

    done: service && (
      <div className="py-6 text-center">
        {check}
        <div className="mb-1.5 text-lg font-bold">
          {manual ? "Booking requested" : paid ? "Payment Successful!" : "Booking confirmed"}
        </div>
        <p className="mx-auto max-w-xs text-sm text-black/50">
          {manual
            ? "Your request has been sent!"
            : paid
              ? <>Your meeting request is now confirmed. We've sent a calendar invitation to <b className="text-black">jane@example.com</b>.</>
              : "Your booking has been confirmed!"}
        </p>
        {details([
          ["Topic", topic],
          ["When", when],
          ["Duration", service.duration + " min"],
        ])}
        {!paid && (
          <div className="flex flex-col items-center gap-2">
            <div className="mb-1 text-xs font-medium text-black/30">
              Add to your calendar
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Google", "Outlook", "Other (.ics)"].map((name) => (
                <span
                  key={name}
                  className="rounded-lg border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-black/70 shadow-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
        {manual && paid && (
          <p className="mx-auto mt-5 max-w-xs text-xs text-black/40">
            Once Sam accepts, Jane gets an email with a link to pay.
          </p>
        )}
      </div>
    ),
  };

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {pills(
          [
            { label: "Instant booking", value: false },
            { label: "Manual approval", value: true, pro: true },
          ],
          manual,
          (value) => {
            setManual(value);
            restart();
          },
        )}
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-zinc-400">
          {flow.map((name, index) => (
            <span key={name} className="flex items-center gap-1">
              {index > 0 && <span>›</span>}
              <span
                className={
                  name === step
                    ? "font-semibold text-zinc-900 dark:text-white"
                    : ""
                }
              >
                {labels[name]}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* The booking page, which is always light like the real one */}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white text-black shadow-sm sm:flex">
        <div className="shrink-0 border-b border-black/5 p-5 sm:w-56 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-3 sm:flex-col sm:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-base font-bold text-zinc-600">
              S
            </div>
            <div>
              <div className="text-base font-bold">Sam</div>
              <div className="text-sm font-medium text-black/40">Business coach</div>
            </div>
          </div>
          {service && (
            <div className="mt-4 rounded-xl bg-black/[0.03] px-3.5 py-3">
              <div className="text-[13px] font-semibold text-black/70">{service.title}</div>
              <div className="mt-0.5 text-[11px] text-black/35">
                {service.duration} min{service.price ? " · " + service.price : ""}
              </div>
            </div>
          )}
          {slot && (
            <div className="mt-3 text-[13px] font-semibold text-black/80">{when}</div>
          )}
        </div>

        <div className="min-w-0 flex-1 p-5">
          {screens[step]}
          {step !== "service" && (
            <button
              type="button"
              onClick={restart}
              className="mt-4 text-[11px] text-black/30 underline hover:text-black"
            >
              Start over
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
