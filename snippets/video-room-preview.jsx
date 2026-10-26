// What a booker sees for each video tool: the confirmation with the room in
// it, on the tool's own colour. Tints and sample rooms mirror
// tikk/resources/js/composables/useAppCatalog.ts — update both together.
export const VideoRoomPreview = ({ initialTool = "whereby" }) => {
  const [toolKey, setToolKey] = useState(initialTool);
  const [serviceKey, setServiceKey] = useState("intro");

  const tools = {
    whereby: {
      name: "Whereby",
      letter: "W",
      tint: "#fbdcd6",
      ownRoom: true,
      headline: "Guests click one link and they are in the room.",
      body: "No app, no account. Your room link goes into every confirmation and reminder for the services you pick.",
      rooms: { intro: "whereby.com/joeri", deep: "whereby.com/joeri-coaching" },
    },
    zoom: {
      name: "Zoom",
      letter: "Z",
      tint: "#e2ebff",
      ownRoom: true,
      headline: "Meet in the Zoom room you already use.",
      body: "Paste your personal meeting link once. Every booking for the services you pick gets it.",
      rooms: { intro: "zoom.us/j/4815162342", deep: "zoom.us/j/1123581321" },
    },
    meet: {
      name: "Google Meet",
      letter: "G",
      tint: "#e6f4ea",
      ownRoom: false,
      headline: "A new Meet room is made with every booking.",
      body: "Created together with the event in your Google calendar. You and your guest always join the same link.",
      rooms: { intro: "meet.google.com/abc-mnop-xyz", deep: "meet.google.com/qrs-tuvw-kyz" },
    },
    jitsi: {
      name: "Jitsi",
      letter: "J",
      tint: "#e1edf9",
      ownRoom: false,
      headline: "A free room, with no account needed.",
      body: "Every booking gets its own meet.jit.si room, or add a room of your own on any Jitsi server.",
      rooms: { intro: "meet.jit.si/tikk-8f3k2", deep: "meet.jit.si/tikk-q7m1d" },
    },
  };

  const services = {
    intro: { name: "Intro call", time: "10:00–10:30" },
    deep: { name: "Coaching session", time: "14:00–15:00" },
  };

  const tool = tools[toolKey];
  const service = services[serviceKey];

  // An own-room tool: the coaching session has a room of its own, the intro
  // call uses the default. Per-booking tools make a new room every time.
  const roomNote = tool.ownRoom
    ? serviceKey === "deep"
      ? "Its own room"
      : "Default room"
    : "New room for this booking";

  // A date a few days out, so the example always reads as an upcoming booking.
  const day = useMemo(() => {
    const upcoming = new Date();
    upcoming.setDate(upcoming.getDate() + 5);

    return upcoming.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }, []);

  const tab = (active, onClick, label) => (
    <button
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

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
          {Object.entries(tools).map(([key, item]) =>
            tab(toolKey === key, () => setToolKey(key), item.name),
          )}
        </div>
        <div className="inline-flex gap-1 rounded-lg bg-zinc-200/70 p-1 dark:bg-zinc-800">
          {Object.entries(services).map(([key, item]) =>
            tab(serviceKey === key, () => setServiceKey(key), item.name),
          )}
        </div>
      </div>

      <div
        className="grid items-center gap-6 rounded-2xl p-6 text-zinc-900 sm:grid-cols-5 sm:p-8"
        style={{ backgroundColor: tool.tint }}
      >
        <div className="space-y-3 sm:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
            {tool.ownRoom ? "Your own room" : "New room per booking"}
          </p>
          <p className="text-xl font-bold leading-snug">{tool.headline}</p>
          <p className="text-sm leading-relaxed text-zinc-700">{tool.body}</p>
        </div>

        <div
          className="flex flex-col gap-3 rounded-xl bg-white p-4 sm:col-span-2"
          style={{ transform: "rotate(1.5deg)", boxShadow: "0 10px 30px -12px rgba(0,0,0,.25)" }}
        >
          <p className="text-xs text-zinc-500">Booking confirmed</p>
          <p className="-mt-1.5 truncate font-semibold">{service.name}</p>
          <p className="text-[13px] text-zinc-600">
            {day} · {service.time}
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold"
              style={{ backgroundColor: tool.tint }}
            >
              {tool.letter}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px]">{tool.rooms[serviceKey]}</span>
            <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white">Join</span>
          </div>
          <p className="text-[11px] text-zinc-500">{roomNote}</p>
        </div>
      </div>
    </div>
  );
};
