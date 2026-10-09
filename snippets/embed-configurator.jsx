// Build an embed snippet and see it on a site. The generated code mirrors
// tikk/resources/js/components/share/ShareEmbed*.vue and the rendering mirrors
// resources/js/embed/embed.ts (button sizes, label contrast, Free-plan icon).
// Update both together.
export const EmbedConfigurator = () => {
  const [type, setType] = useState("inline");
  const [username, setUsername] = useState("yourname");
  const [linkStyle, setLinkStyle] = useState("button");
  const [text, setText] = useState("Schedule a meeting");
  const [color, setColor] = useState("#DBCAEF");
  const [icon, setIcon] = useState("tikk");
  const [position, setPosition] = useState("bottomRight");
  const [minimal, setMinimal] = useState(false);
  const [plan, setPlan] = useState("pro");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Free always shows the Tikk icon; the loader checks the plan on Tikk's side.
  const effectiveIcon = plan === "free" ? "tikk" : icon;
  const isButton = type === "button-floating" || (type === "button-link" && linkStyle === "button");

  // Same contrast rule as the loader: dark label on light colours.
  const labelColor = (() => {
    const hex = color.replace("#", "");
    if (hex.length !== 6) {
      return "#ffffff";
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff";
  })();

  const code = (() => {
    const lines = [
      '<script src="https://embed.tikk.chat"',
      '  async="true"',
      '  data-domain="' + (username || "yourname") + '"',
    ];
    if (type !== "inline") {
      lines.push('  data-type="' + type + '"');
      if (text) {
        lines.push('  data-buttontext="' + text + '"');
      }
      if (effectiveIcon !== "none") {
        lines.push('  data-buttonicon="' + effectiveIcon + '"');
      }
      if (type === "button-floating") {
        lines.push('  data-buttonposition="' + position + '"');
      }
      if (isButton) {
        lines.push('  data-buttoncolor="' + color + '"');
      }
    }
    if (minimal) {
      lines.push('  data-content="minimal"');
    }
    lines[lines.length - 1] += "></script>";

    return lines.join("\n");
  })();

  const copy = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  const pills = (options, value, onChange, disabled) => (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={
            "rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
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

  const control = (name, input) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        {name}
      </span>
      {input}
    </label>
  );

  const inputClass =
    "w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

  const iconGlyph = (name) => {
    if (name === "none") {
      return null;
    }
    if (name === "tikk") {
      return (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 shrink-0"
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: "url(/images/logo-icon2.svg)",
            maskImage: "url(/images/logo-icon2.svg)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      );
    }

    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {name === "calendar" ? (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </>
        )}
      </svg>
    );
  };

  // A small stand-in for the booking page inside the widget.
  const bookingPage = (
    <div className="flex overflow-hidden rounded-2xl border border-black/5 bg-white text-left text-black">
      {!minimal && (
        <div className="w-28 shrink-0 border-r border-black/5 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">
            S
          </div>
          <div className="mt-2 text-xs font-bold">Sam</div>
          <div className="text-[10px] text-black/40">Business coach</div>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-full rounded bg-black/5" />
            <div className="h-1.5 w-4/5 rounded bg-black/5" />
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1 p-3">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-black/30">
          What would you like to book?
        </div>
        {["Intro call", "Coaching session"].map((name, index) => (
          <div
            key={name}
            className={
              "mb-1.5 rounded-xl border px-2.5 py-2 text-[11px] font-semibold " +
              (index === 0 ? "border-black/20" : "border-black/5 bg-zinc-50")
            }
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );

  const solidButton = (floating) => (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={
        "inline-flex items-center gap-1.5 font-semibold " +
        (floating
          ? "h-10 rounded-full px-4 text-xs shadow-md"
          : "rounded-md px-4 py-2 text-xs")
      }
      style={{ backgroundColor: color, color: labelColor }}
    >
      {iconGlyph(effectiveIcon)}
      {text || "Schedule a meeting"}
    </button>
  );

  const corner = {
    bottomRight: "bottom-3 right-3",
    bottomLeft: "bottom-3 left-3",
    topRight: "top-10 right-3",
    topLeft: "top-10 left-3",
  }[position];

  const lineBlock = (widths) => (
    <div className="space-y-1.5">
      {widths.map((width, index) => (
        <div key={index} className="h-2 rounded bg-zinc-200" style={{ width }} />
      ))}
    </div>
  );

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {pills(
          [
            { label: "Inline embed", value: "inline" },
            { label: "Inline link", value: "button-link" },
            { label: "Floating button", value: "button-floating" },
          ],
          type,
          (value) => {
            setType(value);
            setOpen(false);
          },
        )}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {control(
          "Username",
          <input className={inputClass} value={username} onChange={(event) => setUsername(event.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))} />,
        )}
        {type !== "inline" &&
          control(
            "Button text",
            <input className={inputClass} value={text} onChange={(event) => setText(event.target.value.replace(/"/g, ""))} />,
          )}
        {type === "button-link" &&
          control(
            "Style",
            pills(
              [
                { label: "Button", value: "button" },
                { label: "Text link", value: "text" },
              ],
              linkStyle,
              setLinkStyle,
            ),
          )}
        {isButton &&
          control(
            "Colour",
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value.toUpperCase())}
                className="h-8 w-10 cursor-pointer rounded border border-zinc-200 bg-white p-0.5 dark:border-zinc-700"
              />
              <span className="font-mono text-xs text-zinc-500">{color}</span>
            </div>,
          )}
        {type === "button-floating" &&
          control(
            "Corner",
            pills(
              [
                { label: "↖", value: "topLeft" },
                { label: "↗", value: "topRight" },
                { label: "↙", value: "bottomLeft" },
                { label: "↘", value: "bottomRight" },
              ],
              position,
              setPosition,
            ),
          )}
        {type !== "inline" &&
          control(
            "Icon",
            <div className="flex flex-wrap items-center gap-2">
              {pills(
                [
                  { label: "None", value: "none" },
                  { label: "Tikk", value: "tikk" },
                  { label: "Calendar", value: "calendar" },
                  { label: "Clock", value: "clock" },
                ],
                effectiveIcon,
                setIcon,
                plan === "free",
              )}
            </div>,
          )}
        {type !== "inline" &&
          control(
            "Your plan",
            pills(
              [
                { label: "Pro", value: "pro" },
                { label: "Free", value: "free" },
              ],
              plan,
              setPlan,
            ),
          )}
        <label className="flex items-center gap-2 self-end pb-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          <input type="checkbox" checked={minimal} onChange={(event) => setMinimal(event.target.checked)} />
          Hide the host panel
        </label>
      </div>

      {/* The host's site with the widget on it */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
        <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
          <span className="ml-2 rounded bg-white px-2 py-0.5 text-[10px] text-zinc-400">
            yoursite.com
          </span>
        </div>
        <div className="relative min-h-[16rem] p-5 text-zinc-800">
          <div className="mb-3 text-sm font-bold">Work with me</div>
          {lineBlock(["90%", "75%"])}

          {type === "inline" && <div className="mt-4">{bookingPage}</div>}

          {type === "button-link" && (
            <div className="mt-4 text-sm">
              <span className="text-zinc-500">Ready to talk? </span>
              {linkStyle === "button" ? (
                solidButton(false)
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1.5 underline"
                >
                  {iconGlyph(effectiveIcon)}
                  {text || "Schedule a meeting"}
                </button>
              )}
            </div>
          )}

          {type !== "inline" && <div className="mt-4">{lineBlock(["85%", "60%", "70%"])}</div>}

          {type === "button-floating" && (
            <div className={"absolute " + corner}>{solidButton(true)}</div>
          )}

          {open && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setOpen(false)}
            >
              <div className="relative w-full max-w-sm" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm text-zinc-700 shadow"
                >
                  ×
                </button>
                {bookingPage}
              </div>
            </div>
          )}
        </div>
      </div>

      {type !== "inline" && (
        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Click the {type === "button-link" ? "link" : "button"} to open the pop-up.
          {plan === "free" && " On Free, the Tikk icon is always shown."}
        </div>
      )}

      <div className="relative mt-4 overflow-hidden rounded-xl bg-zinc-900 dark:bg-zinc-950">
        <button
          type="button"
          onClick={copy}
          className="absolute right-2 top-2 rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-zinc-200 hover:bg-white/20"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <pre className="overflow-x-auto p-4 pr-16 text-xs leading-5 text-zinc-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
