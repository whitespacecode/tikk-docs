// The location dropdown on a service, as a host sees it. It only lists the
// video tools that work for you, with your default on top. Copy and grouping
// mirror tikk/resources/js/components/ui/location-picker/LocationPicker.vue,
// tints mirror tikk/resources/js/composables/useAppCatalog.ts — update together.
export const LocationPickerPreview = ({ initialSetup = "google" }) => {
  const [setupKey, setSetupKey] = useState(initialSetup);
  const [selected, setSelected] = useState("default");

  const tools = {
    jitsi: { name: "Jitsi", letter: "J", tint: "#e1edf9" },
    meet: { name: "Google Meet", letter: "G", tint: "#e6f4ea" },
    whereby: {
      name: "Whereby",
      letter: "W",
      tint: "#fbdcd6",
      room: "https://whereby.com/joeri",
    },
  };

  // What the dropdown lists depends on what you've set up. The first tool
  // is the one your default video tool resolves to.
  const setups = {
    none: { label: "No calendar", tools: ["jitsi"] },
    google: { label: "Google calendar", tools: ["meet", "jitsi"] },
    whereby: { label: "Whereby installed", tools: ["jitsi", "whereby"] },
  };

  const setup = setups[setupKey];
  const defaultTool = setup.tools[0];

  const chooseSetup = (key) => {
    setSetupKey(key);
    setSelected("default");
  };

  // The default item stands for "follow my default video tool".
  const selectedTool = selected === "default" ? defaultTool : selected;
  const isToolSelected = selectedTool in tools;
  const current = isToolSelected
    ? {
        ...tools[selectedTool],
        label:
          tools[selectedTool].name +
          (selected === "default" ? " (default)" : ""),
        group: "Conferencing",
      }
    : selected === "in_person"
      ? { label: "In-Person Meeting", group: "In person", icon: "pin" }
      : { label: "No Location", group: "Other", icon: "none" };

  const badge = (tool, size) => (
    <span
      className={
        "flex shrink-0 items-center justify-center rounded-md font-bold text-zinc-900 " +
        size
      }
      style={{ backgroundColor: tool.tint }}
    >
      {tool.letter}
    </span>
  );

  const plainIcon = (kind, size) => (
    <span
      className={
        "flex shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 " +
        size
      }
    >
      {kind === "pin" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )}
    </span>
  );

  const check = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 shrink-0">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  const item = (key, isSelected, icon, label) => (
    <button
      key={key}
      type="button"
      onClick={() => setSelected(key)}
      className={
        "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 " +
        (isSelected ? "bg-zinc-100 dark:bg-zinc-800" : "")
      }
    >
      {icon}
      <span className="flex-1 truncate text-zinc-900 dark:text-zinc-100">{label}</span>
      {isSelected && check}
    </button>
  );

  const groupLabel = (text) => (
    <p className="px-2 pb-1 pt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">{text}</p>
  );

  const separator = <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />;

  const tab = (active, onClick, label) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={
        "rounded-md px-3 py-1 text-xs font-medium transition-colors " +
        (active
          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200")
      }
    >
      {label}
    </button>
  );

  const field =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Your setup:</span>
        <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
          {Object.entries(setups).map(([key, item]) =>
            tab(setupKey === key, () => chooseSetup(key), item.label),
          )}
        </div>
      </div>

      <div className="mx-auto max-w-md space-y-2">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Booking Location</p>

        {/* The dropdown's button: what this service uses now */}
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          {isToolSelected ? badge(current, "h-9 w-9 text-sm") : plainIcon(current.icon, "h-9 w-9")}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{current.label}</p>
            <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{current.group}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 rotate-180 text-zinc-400">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {/* The open menu */}
        <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-md dark:border-zinc-700 dark:bg-zinc-950">
          {groupLabel("Conferencing")}
          {setup.tools.map((key, index) =>
            index === 0
              ? item("default", selected === "default", badge(tools[key], "h-5 w-5 text-[11px]"), `${tools[key].name} (default)`)
              : item(key, selected === key, badge(tools[key], "h-5 w-5 text-[11px]"), tools[key].name),
          )}
          <div className="flex items-center gap-2.5 px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 p-0.5">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
            Add a video app
          </div>
          {separator}
          {groupLabel("In person")}
          {item("in_person", selected === "in_person", plainIcon("pin", "h-5 w-5"), "In-Person Meeting")}
          {separator}
          {groupLabel("Other")}
          {item("none", selected === "none", plainIcon("none", "h-5 w-5"), "No Location")}
        </div>

        {/* What shows under the dropdown for the choice */}
        {selected === "whereby" && (
          <div className="space-y-1.5 pt-2">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Room link</p>
            <div className={field}>{tools.whereby.room}</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Filled in with the room Whereby was installed with. Change it to give this service a room of its own.
            </p>
          </div>
        )}
        {selected === "in_person" && (
          <div className="space-y-1.5 pt-2">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Location</p>
            <div className={field + " text-zinc-400 dark:text-zinc-500"}>e.g. Keizerslaan 20, 1000 Brussels</div>
          </div>
        )}
        {selected === "default" && (
          <p className="pt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Follows your default video tool, so changing it in Settings changes it here too.
          </p>
        )}
      </div>
    </div>
  );
};
