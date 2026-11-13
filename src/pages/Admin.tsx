import { useEffect, useState, type FormEvent } from "react";
import { trpc } from "@/providers/trpc";
import { MESSAGE_TOPICS, parseYouTubeId } from "@/lib/site";

/* The team back office. English only on purpose: it is a tool for the church
   office, not a visitor surface. Everything here writes straight to the
   database behind the admin cookie session. */

type Tab = "messages" | "events" | "ministries" | "leaders" | "inbox";

function readFileAsBase64(file: File) {
  return new Promise<{ filename: string; mime: string; dataBase64: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve({ filename: file.name, mime: file.type, dataBase64: result.slice(comma + 1) });
    };
    reader.readAsDataURL(file);
  });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("messages");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const refreshAuth = () =>
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d?.authed)))
      .catch(() => setAuthed(false));

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const resp = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (resp.ok) {
      setPassword("");
      setAuthed(true);
    } else {
      const d = await resp.json().catch(() => ({}));
      setError(d?.error ?? "Sign in failed");
    }
  };

  if (authed === null) return null;

  if (!authed) {
    return (
      <section className="page-hero">
        <div className="shell" style={{ maxWidth: "26rem" }}>
          <span className="minititle">Church office</span>
          <h1 className="display-2" style={{ marginTop: "1rem" }}>
            Team sign in
          </h1>
          <form onSubmit={login} style={{ marginTop: "1.8rem", display: "grid", gap: "1.2rem" }}>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </Field>
            {error ? <p className="adm-error">{error}</p> : null}
            <button type="submit" className="btn">
              Sign in
            </button>
          </form>
        </div>
      </section>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "messages", label: "Messages" },
    { id: "events", label: "Events" },
    { id: "ministries", label: "Ministries" },
    { id: "leaders", label: "Leaders" },
    { id: "inbox", label: "Inbox" },
  ];

  return (
    <section className="section--tight" style={{ paddingTop: "clamp(7rem, 12vw, 9rem)" }}>
      <div className="shell">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h1 className="display-2">Church office</h1>
          <button
            type="button"
            className="event-filter"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              setAuthed(false);
            }}
          >
            Sign out
          </button>
        </div>
        <div className="event-filters" style={{ marginTop: "1.6rem" }} role="group" aria-label="Sections">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              className={`event-filter${tab === tb.id ? " is-active" : ""}`}
              aria-pressed={tab === tb.id}
              onClick={() => setTab(tb.id)}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "2.4rem" }}>
          {tab === "messages" ? <MessagesTab /> : null}
          {tab === "events" ? <EventsTab /> : null}
          {tab === "ministries" ? <MinistriesTab /> : null}
          {tab === "leaders" ? <LeadersTab /> : null}
          {tab === "inbox" ? <InboxTab /> : null}
        </div>
      </div>
    </section>
  );
}

/* ---------- messages ---------- */

function MessagesTab() {
  const utils = trpc.useUtils();
  const list = trpc.admin.messages.list.useQuery();
  const upload = trpc.admin.upload.useMutation();
  const create = trpc.admin.messages.create.useMutation({ onSuccess: () => utils.admin.messages.list.invalidate() });
  const update = trpc.admin.messages.update.useMutation({ onSuccess: () => utils.admin.messages.invalidate() });
  const remove = trpc.admin.messages.remove.useMutation({ onSuccess: () => utils.admin.messages.invalidate() });

  const empty = {
    title: "",
    description: "",
    speaker: "",
    scripture: "",
    series: "",
    preachedAt: new Date().toISOString().slice(0, 10),
    topics: [] as string[],
    youtubeLink: "",
    audioMediaId: null as number | null,
    audioName: "",
    featured: false,
    messageOfMonth: false,
  };
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setNote("");
    const payload = {
      title: form.title,
      description: form.description || null,
      speaker: form.speaker || null,
      scripture: form.scripture || null,
      series: form.series || null,
      preachedAt: new Date(form.preachedAt + "T12:00:00Z").toISOString(),
      topics: form.topics,
      youtubeId: form.youtubeLink ? parseYouTubeId(form.youtubeLink) : null,
      audioMediaId: form.audioMediaId,
      featured: form.featured,
      messageOfMonth: form.messageOfMonth,
    };
    if (form.youtubeLink && !payload.youtubeId) {
      setNote("That YouTube link does not look right. Paste the full watch link or the video id.");
      return;
    }
    try {
      if (editId) {
        await update.mutateAsync({ id: editId, data: payload });
        setNote("Message updated.");
      } else {
        await create.mutateAsync(payload);
        setNote("Message added.");
      }
      setForm(empty);
      setEditId(null);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="adm-grid">
      <div>
        <h2 className="display-3">{editId ? "Edit message" : "Add a message"}</h2>
        <form onSubmit={submit} className="adm-form">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="YouTube link or video id">
            <input
              value={form.youtubeLink}
              onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Field>
          <Field label={form.audioName ? `Audio uploaded · ${form.audioName}` : "Or upload an audio file"}>
            <input
              type="file"
              accept="audio/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setNote("Uploading audio...");
                try {
                  const payload = await readFileAsBase64(f);
                  const res = await upload.mutateAsync(payload);
                  setForm({ ...form, audioMediaId: res.id, audioName: f.name });
                  setNote("Audio uploaded.");
                } catch (err) {
                  setNote(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
          </Field>
          <div className="adm-pair">
            <Field label="Speaker">
              <input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} />
            </Field>
            <Field label="Date preached">
              <input
                type="date"
                value={form.preachedAt}
                onChange={(e) => setForm({ ...form, preachedAt: e.target.value })}
                required
              />
            </Field>
          </div>
          <div className="adm-pair">
            <Field label="Scripture">
              <input value={form.scripture} onChange={(e) => setForm({ ...form, scripture: e.target.value })} />
            </Field>
            <Field label="Series">
              <input value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="adm-field">
            <span>Needs this message speaks to</span>
            <div className="event-filters">
              {MESSAGE_TOPICS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`event-filter${form.topics.includes(id) ? " is-active" : ""}`}
                  onClick={() =>
                    setForm({
                      ...form,
                      topics: form.topics.includes(id)
                        ? form.topics.filter((x) => x !== id)
                        : [...form.topics, id],
                    })
                  }
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
          <label className="adm-check">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <span>Featured message</span>
          </label>
          <label className="adm-check">
            <input
              type="checkbox"
              checked={form.messageOfMonth}
              onChange={(e) => setForm({ ...form, messageOfMonth: e.target.checked })}
            />
            <span>Message of the month</span>
          </label>
          {note ? <p className="adm-note">{note}</p> : null}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn" disabled={create.isPending || update.isPending}>
              {editId ? "Save changes" : "Add message"}
            </button>
            {editId ? (
              <button
                type="button"
                className="event-filter"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div>
        <h2 className="display-3">Library</h2>
        <ul className="adm-list">
          {(list.data ?? []).map((m) => (
            <li key={m.id}>
              <div>
                <strong>{m.title}</strong>
                <span>
                  {new Date(m.preachedAt).toLocaleDateString("en-GB")}
                  {m.speaker ? ` · ${m.speaker}` : ""}
                  {m.messageOfMonth ? " · message of the month" : m.featured ? " · featured" : ""}
                </span>
              </div>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    setEditId(m.id);
                    setForm({
                      title: m.title,
                      description: m.description ?? "",
                      speaker: m.speaker ?? "",
                      scripture: m.scripture ?? "",
                      series: m.series ?? "",
                      preachedAt: new Date(m.preachedAt).toISOString().slice(0, 10),
                      topics: m.topics ?? [],
                      youtubeLink: m.youtubeId ?? "",
                      audioMediaId: m.audioMediaId ?? null,
                      audioName: m.audioMediaId ? "current audio" : "",
                      featured: m.featured,
                      messageOfMonth: m.messageOfMonth,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    if (window.confirm(`Remove "${m.title}"?`)) remove.mutate({ id: m.id });
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- events ---------- */

function EventsTab() {
  const utils = trpc.useUtils();
  const list = trpc.admin.events.list.useQuery();
  const create = trpc.admin.events.create.useMutation({ onSuccess: () => utils.admin.events.list.invalidate() });
  const update = trpc.admin.events.update.useMutation({ onSuccess: () => utils.admin.events.invalidate() });
  const remove = trpc.admin.events.remove.useMutation({ onSuccess: () => utils.admin.events.invalidate() });

  const empty = {
    title: "",
    description: "",
    startsAt: "",
    frequency: "weekly" as "daily" | "weekly" | "monthly",
    cadence: "",
    location: "",
    streamUrl: "",
  };
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      description: form.description || null,
      cadence: form.cadence || null,
      location: form.location || null,
      streamUrl: form.streamUrl || null,
      startsAt: new Date(form.startsAt).toISOString(),
    };
    if (editId) {
      await update.mutateAsync({ id: editId, data: payload });
      setEditId(null);
    } else {
      await create.mutateAsync(payload);
    }
    setForm(empty);
  };

  return (
    <div className="adm-grid">
      <div>
        <h2 className="display-3">{editId ? "Edit event" : "Add an event"}</h2>
        <form onSubmit={submit} className="adm-form">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Date and time">
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              required
            />
          </Field>
          <div className="adm-pair">
            <Field label="Rhythm">
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value as any })}
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
          </div>
          <Field label="Cadence note (for example: Every Wednesday · 19:00)">
            <input value={form.cadence} onChange={(e) => setForm({ ...form, cadence: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn">
              {editId ? "Save changes" : "Add event"}
            </button>
            {editId ? (
              <button
                type="button"
                className="event-filter"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div>
        <h2 className="display-3">Calendar</h2>
        <ul className="adm-list">
          {(list.data ?? []).map((ev) => (
            <li key={ev.id}>
              <div>
                <strong>{ev.title}</strong>
                <span>{new Date(ev.startsAt).toLocaleString("en-GB")}</span>
              </div>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    setEditId(ev.id);
                    const d = new Date(ev.startsAt);
                    const pad = (n: number) => String(n).padStart(2, "0");
                    setForm({
                      title: ev.title,
                      description: ev.description ?? "",
                      startsAt: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
                      frequency: ev.frequency,
                      cadence: ev.cadence ?? "",
                      location: ev.location ?? "",
                      streamUrl: ev.streamUrl ?? "",
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    if (window.confirm(`Remove "${ev.title}"?`)) remove.mutate({ id: ev.id });
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- ministries ---------- */

function MinistriesTab() {
  const utils = trpc.useUtils();
  const list = trpc.admin.ministries.list.useQuery();
  const upload = trpc.admin.upload.useMutation();
  const create = trpc.admin.ministries.create.useMutation({ onSuccess: () => utils.admin.ministries.list.invalidate() });
  const update = trpc.admin.ministries.update.useMutation({ onSuccess: () => utils.admin.ministries.invalidate() });
  const remove = trpc.admin.ministries.remove.useMutation({ onSuccess: () => utils.admin.ministries.invalidate() });

  const empty = { name: "", summary: "", body: "", photoMediaId: null as number | null, photoName: "" };
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [editSlug, setEditSlug] = useState("");
  const [note, setNote] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setNote("");
    const slug = editId
      ? editSlug
      : form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, "-") || "ministry";
    const payload = {
      name: form.name,
      slug,
      summary: form.summary || null,
      body: form.body || null,
      photoMediaId: form.photoMediaId,
      sortOrder: 0,
    };
    try {
      if (editId) {
        await update.mutateAsync({ id: editId, data: payload });
        setNote("Ministry updated.");
        setEditId(null);
      } else {
        await create.mutateAsync(payload);
        setNote("Ministry added.");
      }
      setForm(empty);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="adm-grid">
      <div>
        <h2 className="display-3">{editId ? "Edit ministry" : "Add a ministry"}</h2>
        <form onSubmit={submit} className="adm-form">
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="One line summary">
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </Field>
          <Field label="Full description">
            <textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </Field>
          <Field label={form.photoName ? `Photo uploaded · ${form.photoName}` : "Photograph"}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setNote("Uploading photo...");
                try {
                  const payload = await readFileAsBase64(f);
                  const res = await upload.mutateAsync(payload);
                  setForm({ ...form, photoMediaId: res.id, photoName: f.name });
                  setNote("Photo uploaded.");
                } catch (err) {
                  setNote(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
          </Field>
          {note ? <p className="adm-note">{note}</p> : null}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn">
              {editId ? "Save changes" : "Add ministry"}
            </button>
            {editId ? (
              <button
                type="button"
                className="event-filter"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div>
        <h2 className="display-3">Ministries</h2>
        <ul className="adm-list">
          {(list.data ?? []).map((m) => (
            <li key={m.id}>
              <div>
                <strong>{m.name}</strong>
                <span>{m.summary ?? ""}</span>
              </div>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    setEditId(m.id);
                    setEditSlug(m.slug);
                    setForm({
                      name: m.name,
                      summary: m.summary ?? "",
                      body: m.body ?? "",
                      photoMediaId: m.photoMediaId ?? null,
                      photoName: m.photoMediaId ? "current photo" : "",
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    if (window.confirm(`Remove "${m.name}"?`)) remove.mutate({ id: m.id });
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- leaders ---------- */

function LeadersTab() {
  const utils = trpc.useUtils();
  const list = trpc.admin.leaders.list.useQuery();
  const upload = trpc.admin.upload.useMutation();
  const create = trpc.admin.leaders.create.useMutation({ onSuccess: () => utils.admin.leaders.list.invalidate() });
  const update = trpc.admin.leaders.update.useMutation({ onSuccess: () => utils.admin.leaders.invalidate() });
  const remove = trpc.admin.leaders.remove.useMutation({ onSuccess: () => utils.admin.leaders.invalidate() });

  const empty = { name: "", role: "", bio: "", photoMediaId: null as number | null, photoName: "" };
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setNote("");
    const payload = {
      name: form.name,
      role: form.role || null,
      bio: form.bio || null,
      photoMediaId: form.photoMediaId,
      sortOrder: 0,
    };
    try {
      if (editId) {
        await update.mutateAsync({ id: editId, data: payload });
        setEditId(null);
      } else {
        await create.mutateAsync(payload);
      }
      setForm(empty);
      setNote("Saved.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="adm-grid">
      <div>
        <h2 className="display-3">{editId ? "Edit leader" : "Add a leader"}</h2>
        <form onSubmit={submit} className="adm-form">
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Role (for example: Senior Pastor)">
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </Field>
          <Field label="Short bio">
            <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </Field>
          <Field label={form.photoName ? `Photo uploaded · ${form.photoName}` : "Photograph"}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setNote("Uploading photo...");
                try {
                  const payload = await readFileAsBase64(f);
                  const res = await upload.mutateAsync(payload);
                  setForm({ ...form, photoMediaId: res.id, photoName: f.name });
                  setNote("Photo uploaded.");
                } catch (err) {
                  setNote(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
          </Field>
          {note ? <p className="adm-note">{note}</p> : null}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn">
              {editId ? "Save changes" : "Add leader"}
            </button>
            {editId ? (
              <button
                type="button"
                className="event-filter"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div>
        <h2 className="display-3">Leadership</h2>
        <ul className="adm-list">
          {(list.data ?? []).map((l) => (
            <li key={l.id}>
              <div>
                <strong>{l.name}</strong>
                <span>{l.role ?? ""}</span>
              </div>
              <div className="adm-row-actions">
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    setEditId(l.id);
                    setForm({
                      name: l.name,
                      role: l.role ?? "",
                      bio: l.bio ?? "",
                      photoMediaId: l.photoMediaId ?? null,
                      photoName: l.photoMediaId ? "current photo" : "",
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="event-filter"
                  onClick={() => {
                    if (window.confirm(`Remove "${l.name}"?`)) remove.mutate({ id: l.id });
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- inbox ---------- */

function InboxTab() {
  const contacts = trpc.admin.inbox.contacts.useQuery();
  const prayers = trpc.admin.inbox.prayers.useQuery();
  const giving = trpc.admin.inbox.giving.useQuery();

  return (
    <div style={{ display: "grid", gap: "3rem" }}>
      <section>
        <h2 className="display-3">Contact messages</h2>
        <ul className="adm-list">
          {(contacts.data ?? []).map((c) => (
            <li key={c.id}>
              <div>
                <strong>
                  {c.name} · {c.topic}
                </strong>
                <span>
                  {c.email} · {new Date(c.createdAt).toLocaleString("en-GB")}
                </span>
                <p className="adm-body">{c.message}</p>
              </div>
            </li>
          ))}
          {contacts.data?.length === 0 ? <li>No messages yet.</li> : null}
        </ul>
      </section>
      <section>
        <h2 className="display-3">Prayer requests</h2>
        <ul className="adm-list">
          {(prayers.data ?? []).map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.name || "Anonymous"}</strong>
                <span>
                  {p.contact || "no contact given"} · {new Date(p.createdAt).toLocaleString("en-GB")}
                </span>
                <p className="adm-body">{p.message}</p>
              </div>
            </li>
          ))}
          {prayers.data?.length === 0 ? <li>No prayer requests yet.</li> : null}
        </ul>
      </section>
      <section>
        <h2 className="display-3">Giving records</h2>
        <ul className="adm-list">
          {(giving.data ?? []).map((g) => (
            <li key={g.id}>
              <div>
                <strong>
                  {g.reference} · GBP {(g.amountPence / 100).toFixed(2)} · {g.fund}
                </strong>
                <span>
                  {g.name} · {g.email} · {g.status}
                  {g.monthly ? " · monthly" : ""}
                  {g.giftAid ? " · gift aid" : ""} · {new Date(g.createdAt).toLocaleString("en-GB")}
                </span>
              </div>
            </li>
          ))}
          {giving.data?.length === 0 ? <li>No giving records yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
