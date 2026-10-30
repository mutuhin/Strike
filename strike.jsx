import { useState, useEffect } from "react";
import strikeLogo from "./assets/strike-logo.jpg";
import strikeMark from "./assets/strike-mark.jpg";

const F  = "Arial, sans-serif";
const FH = "'Anton', Arial Black, sans-serif";

const C = {
  bgDeep:      "#3C0A0A",
  bg:          "#5C1010",
  surface:     "#6E1818",
  surfaceHigh: "#7D2222",
  border:      "rgba(255,200,190,0.14)",
  borderMid:   "rgba(255,200,190,0.28)",
  text:        "#FAF0EE",
  muted:       "#C4A0A0",
  faint:       "#9A7070",
  cream:       "#EDD8C8",
  green:       "#5BE89A",
  red:         "#FF8080",
  gold:        "#FFDDAA",
};

const inp = {
  fontFamily: F, width: "100%", padding: "11px 14px",
  border: `1px solid ${C.borderMid}`, fontSize: 14, fontWeight: 600,
  boxSizing: "border-box", outline: "none",
  background: C.bgDeep, color: C.text, borderRadius: 6,
};

function Input(props)    { return <input    {...props} style={{ ...inp, ...props.style }} />; }
function Sel({ children, ...r }) { return <select {...r} style={{ ...inp, cursor:"pointer" }}>{children}</select>; }

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily:F, fontSize:10, fontWeight:700, color:C.faint, letterSpacing:2, marginBottom:7, textTransform:"uppercase" }}>{label}</div>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(20,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300 }}>
      <div className="modal-panel" style={{ background:`linear-gradient(165deg, ${C.surfaceHigh}, #5A1212)`, border:"1px solid rgba(255,180,170,0.12)", borderRadius:14, padding:28, width:460, maxWidth:"92vw", maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontFamily:FH, fontSize:18, color:C.cream, letterSpacing:1, textTransform:"uppercase" }}>{title}</span>
          <button onClick={onClose} style={{ background:C.surfaceHigh, border:`1px solid ${C.border}`, borderRadius:6, width:32, height:32, cursor:"pointer", color:C.muted, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel }) {
  return (
    <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
      <button type="button" onClick={onCancel} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 20px", borderRadius:7, cursor:"pointer", background:"transparent", color:C.muted, border:`1px solid ${C.borderMid}` }}>Cancel</button>
      <button type="button" onClick={onConfirm} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 20px", borderRadius:7, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>{confirmLabel}</button>
    </div>
  );
}

// STRIKE "S" mark. The image has a black background; screen blend drops it on the dark UI.
function StrikeMark({ size = 20, opacity = 1 }) {
  return <img src={strikeMark} alt="" aria-hidden="true" style={{ height:size, width:"auto", opacity, mixBlendMode:"screen", flexShrink:0, display:"block" }} />;
}

// "Field" shape from the STRIKE logo: a box with notched-in (concave) corners,
// filled, with the logo's faint dotted outline. Sits behind the parent's content.
const FIELD_R = 9;
function FieldShape({ fill, line, r = FIELD_R }) {
  const corners = ["top left", "top right", "bottom left", "bottom right"];
  const mask = corners.map(pos => `radial-gradient(circle at ${pos}, transparent ${r - 2}px, #000 ${r - 1.5}px) ${pos} / 51% 51% no-repeat`).join(", ");
  const edge = { position:"absolute", borderColor:line, borderStyle:"dotted", borderWidth:0 };
  return (
    <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:-1, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", inset:0, background:fill, WebkitMask:mask, mask }} />
      <div style={{ ...edge, top:0, left:r, right:r, height:0, borderTopWidth:1.5 }} />
      <div style={{ ...edge, bottom:0, left:r, right:r, height:0, borderBottomWidth:1.5 }} />
      <div style={{ ...edge, left:0, top:r, bottom:r, width:0, borderLeftWidth:1.5 }} />
      <div style={{ ...edge, right:0, top:r, bottom:r, width:0, borderRightWidth:1.5 }} />
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => (
        <div key={`${x}${y}`} style={{ ...edge, width:r * 2, height:r * 2, borderRadius:"50%", borderWidth:1.5, left: x ? `calc(100% - ${r}px)` : -r, top: y ? `calc(100% - ${r}px)` : -r }} />
      ))}
    </div>
  );
}

// Football mouse cursor: a shaded 3D ball with red speed streaks. The ringed
// version (glowing STRIKE-red ring) shows over clickable elements.
function footballCursor(ring) {
  const cx = 18, cy = 18, r = 11.5;
  const pent = (x, y, size, rot) => Array.from({ length:5 }, (_, k) => {
    const a = rot + k * 2 * Math.PI / 5;
    return [x + size * Math.cos(a), y + size * Math.sin(a)];
  });
  const pts = list => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const angles = Array.from({ length:5 }, (_, k) => -Math.PI / 2 + k * 2 * Math.PI / 5);
  const center = pent(cx, cy, 3.9, -Math.PI / 2);
  const patches = angles.map(a => pent(cx + 12 * Math.cos(a), cy + 12 * Math.sin(a), 3.6, a + Math.PI));
  // Seams: centre panel → outer panels, and between neighbouring outer panels
  const seams = angles.map((a, i) => [center[i], [cx + 8.4 * Math.cos(a), cy + 8.4 * Math.sin(a)]]);
  patches.forEach((patch, i) => {
    const next = patches[(i + 1) % 5];
    let best = null;
    patch.forEach(p1 => next.forEach(p2 => {
      const d = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
      if (!best || d < best.d) best = { d, p1, p2 };
    }));
    seams.push([best.p1, best.p2]);
  });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
    <defs>
      <radialGradient id='shade' cx='0.36' cy='0.32' r='0.75'><stop offset='0' stop-color='#FFFFFF'/><stop offset='0.55' stop-color='#ECECEC'/><stop offset='1' stop-color='#A9A9A9'/></radialGradient>
      <linearGradient id='panel' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3A3A3A'/><stop offset='1' stop-color='#050505'/></linearGradient>
      <linearGradient id='trail' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='12' y2='12'><stop offset='0' stop-color='#FF3B3B' stop-opacity='0'/><stop offset='1' stop-color='#FF3B3B'/></linearGradient>
      <clipPath id='ball'><circle cx='${cx}' cy='${cy}' r='${r}'/></clipPath>
      <filter id='glow' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='1.2'/></filter>
    </defs>
    <g stroke='url(#trail)' stroke-linecap='round' fill='none'>
      <line x1='0.5' y1='5.5' x2='8.5' y2='13.5' stroke-width='2.2'/>
      <line x1='4' y1='1.5' x2='11.5' y2='9' stroke-width='1.6'/>
      <line x1='0.5' y1='12.5' x2='6.5' y2='18.5' stroke-width='1.2'/>
    </g>
    <ellipse cx='19' cy='30.4' rx='7.5' ry='1.3' fill='#000' opacity='0.35'/>
    ${ring ? `<circle cx='${cx}' cy='${cy}' r='13.4' fill='none' stroke='#FF4D4D' stroke-width='2.4' filter='url(#glow)' opacity='0.9'/><circle cx='${cx}' cy='${cy}' r='13.4' fill='none' stroke='#FF8A8A' stroke-width='1.1'/>` : ""}
    <circle cx='${cx}' cy='${cy}' r='${r}' fill='url(#shade)'/>
    <g clip-path='url(#ball)'>
      <g stroke='#1C1C1C' stroke-width='0.9' stroke-linecap='round'>${seams.map(([a, b]) => `<line x1='${a[0].toFixed(2)}' y1='${a[1].toFixed(2)}' x2='${b[0].toFixed(2)}' y2='${b[1].toFixed(2)}'/>`).join("")}</g>
      <g fill='url(#panel)' stroke='#000' stroke-width='0.5' stroke-linejoin='round'>
        <polygon points='${pts(center)}'/>${patches.map(patch => `<polygon points='${pts(patch)}'/>`).join("")}
      </g>
      <circle cx='${cx}' cy='${cy}' r='${r}' fill='none' stroke='#000' stroke-opacity='0.16' stroke-width='2.2'/>
      <ellipse cx='14' cy='12.5' rx='4.2' ry='2.6' fill='#FFF' opacity='0.55' transform='rotate(-30 14 12.5)'/>
    </g>
    <circle cx='${cx}' cy='${cy}' r='${r}' fill='none' stroke='#120303' stroke-width='1.2'/>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${cx} ${cy}`;
}

const EMPLOYEES = [
  { id:1, name:"Masum",  role:"Manager" },
  { id:2, name:"Rubel",  role:"Staff" },
  { id:3, name:"Shohan", role:"Staff" },
];

const SCHEDULE_TIMES = [
  { id:0, time:"06:00", end:"07:30", label:"6:00 AM - 7:30 AM", period:"Day", price:2800 },
  { id:1, time:"07:30", end:"09:00", label:"7:30 AM - 9:00 AM", period:"Day", price:2500 },
  { id:2, time:"09:00", end:"10:30", label:"9:00 AM - 10:30 AM", period:"Day", price:2500 },
  { id:3, time:"10:30", end:"12:00", label:"10:30 AM - 12:00 PM", period:"Day", price:2500 },
  { id:4, time:"12:00", end:"13:30", label:"12:00 PM - 1:30 PM", period:"Day", price:2500 },
  { id:5, time:"13:30", end:"15:00", label:"1:30 PM - 3:00 PM", period:"Day", price:2500 },
  { id:6, time:"15:00", end:"16:30", label:"3:00 PM - 4:30 PM", period:"Day", price:2500 },
  { id:7, time:"16:30", end:"18:00", label:"4:30 PM - 6:00 PM", period:"Day", price:2800 },
  { id:8, time:"18:00", end:"19:30", label:"6:00 PM - 7:30 PM", period:"Evening", price:3199 },
  { id:9, time:"19:30", end:"21:00", label:"7:30 PM - 9:00 PM", period:"Evening", price:3199 },
  { id:10, time:"21:00", end:"22:30", label:"9:00 PM - 10:30 PM", period:"Evening", price:3199 },
  { id:11, time:"22:30", end:"00:00", label:"10:30 PM - 12:00 AM", period:"Evening", price:3199 },
  { id:12, time:"00:00", end:"01:30", label:"12:00 AM - 1:30 AM", period:"Night", price:3199 },
  { id:13, time:"01:30", end:"03:00", label:"1:30 AM - 3:00 AM", period:"Night", price:3199 },
  { id:14, time:"03:00", end:"04:30", label:"3:00 AM - 4:30 AM", period:"Night", price:3199 },
  { id:15, time:"04:30", end:"06:00", label:"4:30 AM - 6:00 AM", period:"Night", price:3199 },
];

const SCHEDULE_WEEKS = ["2026-11-10", "2026-11-17", "2026-11-24", "2026-12-01"];
// Seed bookings from the workbook (real customers) live in seed.local.json, which is
// git-ignored so customer names and numbers never reach the public repo or live site.
const localSeed = import.meta.glob("./seed.local.json", { eager:true, import:"default" });
const INITIAL_SCHEDULE = Object.values(localSeed)[0] ?? {};

function getDateKey(weekStart, offset) {
  const date = new Date(`${weekStart}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateLabel(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`);
  return `${date.toLocaleDateString("en-US", { month:"short" })} ${date.getDate()}`;
}

// Demo "today": matches the calendar's highlighted Nov 10. Switch to new Date() when going live.
const APP_NOW = new Date(2026, 10, 10, 12, 0);

const normPhone = (phone = "") => phone.replace(/\D/g, "").replace(/^88/, "");

// Night slots (12 AM – 6 AM) belong to the night after the booking date.
function slotStartTime(dateKey, slot) {
  const start = new Date(`${dateKey}T${slot.time}:00`);
  if (slot.period === "Night") start.setDate(start.getDate() + 1);
  return start;
}

function initialBookingsFromSchedule(schedule) {
  return Object.entries(schedule).filter(([, slot]) => slot.status !== "Available").map(([key, slot], index) => {
    const [date, slotId] = key.split(/-(?=\d+$)/);
    const timeSlot = SCHEDULE_TIMES[Number(slotId)];
    return {
      id:`BK${String(index + 1).padStart(3, "0")}`,
      customer:slot.customer || "",
      phone:slot.phone || "",
      slot:`${timeSlot.time}–${timeSlot.end}`,
      date:dateLabel(date),
      price:timeSlot.price,
      advance:0,
      paid:0,
      due:timeSlot.price,
      emp:"—",
      status:slot.status.toLowerCase(),
    };
  });
}

// ── Receipt ───────────────────────────────────────────
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
const formatIssued = (date) => date.toLocaleString("en-US", { day:"numeric", month:"short", year:"numeric", hour:"numeric", minute:"2-digit" });

function Receipt({ receipt }) {
  const row = { display:"flex", justifyContent:"space-between", gap:12, fontFamily:F, fontSize:12, color:C.muted, padding:"3px 0" };
  return (
    <div style={{ background:C.bgDeep, borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, padding:"14px 18px", background:"#000" }}>
        <img src={strikeLogo} alt="STRIKE" style={{ height:30, width:"auto", display:"block" }} />
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:FH, fontSize:13, color:C.cream, letterSpacing:1.5, textTransform:"uppercase" }}>Booking Receipt</div>
          <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:2 }}>{receipt.id}</div>
        </div>
      </div>
      <div style={{ padding:"14px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, color:C.green, fontFamily:F, fontSize:12, fontWeight:700, marginBottom:12 }}>✓ Payment received · Booking confirmed</div>
        <div style={row}><span>Name</span><strong style={{ color:"#FFFFFF" }}>{receipt.name}</strong></div>
        <div style={row}><span>Phone</span><strong style={{ color:"#FFFFFF" }}>{receipt.phone}</strong></div>
        <div style={row}><span>Payment method</span><strong style={{ color:"#FFFFFF" }}>{receipt.payment}</strong></div>
        <div style={row}><span>Issued</span><strong style={{ color:"#FFFFFF" }}>{formatIssued(receipt.issued)}</strong></div>
        <div style={{ margin:"12px 0", borderTop:`1px dashed ${C.borderMid}` }} />
        {receipt.items.map((item, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"6px 0" }}>
            <div>
              <div style={{ fontFamily:FH, fontSize:13, color:"#FFFFFF", letterSpacing:0.3 }}>{item.date}</div>
              <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:2 }}>{item.time} · {item.period}</div>
            </div>
            <div style={{ fontFamily:FH, fontSize:13, color:C.cream }}>৳{item.price.toLocaleString()}</div>
          </div>
        ))}
        <div style={{ margin:"12px 0", borderTop:`1px dashed ${C.borderMid}` }} />
        <div style={row}><span>Total ({receipt.items.length} slot{receipt.items.length === 1 ? "" : "s"})</span><strong style={{ color:"#FFFFFF" }}>৳{receipt.total.toLocaleString()}</strong></div>
        <div style={row}><span>Advance paid</span><strong style={{ color:C.green }}>৳{receipt.advance.toLocaleString()}</strong></div>
        <div style={{ ...row, color:C.gold }}><span>Due at the ground</span><strong>৳{receipt.due.toLocaleString()}</strong></div>
        <div style={{ fontFamily:F, fontSize:10, color:C.faint, marginTop:12, lineHeight:1.5 }}>Show this receipt at the ground. Keep your receipt number for any questions.</div>
      </div>
    </div>
  );
}

// Opens a print-ready copy of the receipt (print, or "Save as PDF").
// Returns false when the browser or host page blocks the new window.
function printReceipt(receipt) {
  let win = null;
  try { win = window.open("", "_blank", "width=480,height=720"); } catch {}
  if (!win) return false;
  const logo = new URL(strikeLogo, window.location.href).href;
  const line = (label, value, cls = "") => `<div class="row ${cls}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  const taka = (n) => `৳${n.toLocaleString()}`;
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>STRIKE Receipt ${escapeHtml(receipt.id)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #2A0A0A; margin: 0; padding: 24px; background: #fff; }
      .card { max-width: 420px; margin: 0 auto; border: 1px solid #E5D3CC; border-radius: 12px; overflow: hidden; }
      .head { background: #000; color: #EDD8C8; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; }
      .head img { height: 30px; display: block; }
      .head .t { text-align: right; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; }
      .head .id { font-size: 11px; color: #C4A0A0; letter-spacing: 0; margin-top: 2px; }
      .body { padding: 16px 18px; }
      .ok { color: #1B8A4C; font-weight: 700; font-size: 13px; margin-bottom: 12px; }
      .row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; padding: 3px 0; color: #6B4A4A; }
      .row strong { color: #2A0A0A; }
      .due, .due strong { color: #A15C00; }
      hr { border: 0; border-top: 1px dashed #D9C2B8; margin: 12px 0; }
      .slot { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
      .slot small { display: block; color: #8A6A6A; margin-top: 2px; }
      .note { font-size: 11px; color: #8A6A6A; margin-top: 12px; line-height: 1.5; }
      @media print { body { padding: 0; } .card { border: none; } }
    </style></head><body><div class="card">
      <div class="head"><img src="${logo}" alt="STRIKE"><div class="t">Booking Receipt<div class="id">${escapeHtml(receipt.id)}</div></div></div>
      <div class="body">
        <div class="ok">✓ Payment received · Booking confirmed</div>
        ${line("Name", receipt.name)}${line("Phone", receipt.phone)}${line("Payment method", receipt.payment)}${line("Issued", formatIssued(receipt.issued))}
        <hr>
        ${receipt.items.map(item => `<div class="slot"><div><strong>${escapeHtml(item.date)}</strong><small>${escapeHtml(item.time)} · ${escapeHtml(item.period)}</small></div><strong>${taka(item.price)}</strong></div>`).join("")}
        <hr>
        ${line(`Total (${receipt.items.length} slot${receipt.items.length === 1 ? "" : "s"})`, taka(receipt.total))}${line("Advance paid", taka(receipt.advance))}${line("Due at the ground", taka(receipt.due), "due")}
        <div class="note">Show this receipt at the ground. Keep your receipt number for any questions.</div>
      </div></div>
      <script>window.onload = () => { window.focus(); window.print(); };<\/script>
    </body></html>`);
  win.document.close();
  return true;
}

// ── Dashboard ──────────────────────────────────────────
// Visitors only see open slots and can select several (across days) to book at once;
// the admin sees every slot.
function Dashboard({ scheduleRecords, onScheduleChange, isAdmin }) {
  const [selectedDay, setSelectedDay] = useState(10);
  const [cart,        setCart]        = useState([]); // [{ day, slotId }]
  const [receipt,     setReceipt]     = useState(null);
  const [printBlocked, setPrintBlocked] = useState(false);
  const [bookModal,   setBookModal]   = useState(null);
  const [bookingForm, setBookingForm] = useState({ name:"", phone:"", payment:"bKash", slotId:null, emp:EMPLOYEES[0].name });
  const [bookingNotice, setBookingNotice] = useState("");
  const [bookingError,  setBookingError]  = useState("");

  const dateKeyFor    = (day) => `2026-11-${String(day).padStart(2, "0")}`;
  const fullDateLabel = (day) => `${new Date(2026, 10, day).toLocaleDateString("en-US", { weekday:"long" })}, Nov ${day}`;
  const getStatus     = (day, sid) => scheduleRecords[`${dateKeyFor(day)}-${sid}`]?.status || "Available";
  const openSlotsFor  = (day) => SCHEDULE_TIMES.filter(ts => getStatus(day, ts.id) === "Available");

  // Calendar grid — Monday first
  const offset = (new Date(2026, 10, 1).getDay() + 6) % 7;
  const allCells = Array(offset).fill(null).concat(Array.from({ length: 30 }, (_, i) => i + 1));
  const rem = allCells.length % 7;
  const cells = rem === 0 ? allCells : allCells.concat(Array(7 - rem).fill(null));
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const dayBooked = (d) => !d ? 0 : Array.from({ length: 16 }, (_, i) => getStatus(d, i)).filter(s => s !== "Available").length;

  // Selected day data
  const selFull = fullDateLabel(selectedDay);
  const allSelSlots = SCHEDULE_TIMES.map(ts => ({
    ...ts,
    ...(scheduleRecords[`${dateKeyFor(selectedDay)}-${ts.id}`] || {}),
    status: getStatus(selectedDay, ts.id) === "Available" ? "available" : "booked",
  }));
  const selSlots    = isAdmin ? allSelSlots : allSelSlots.filter(s => s.status === "available");
  const openCount   = allSelSlots.filter(s => s.status === "available").length;
  const bookedCount = allSelSlots.length - openCount;

  const PERIOD_COLOR = { Night:"rgba(255,220,100,0.6)", Day:"rgba(130,220,255,0.6)", Evening:"rgba(200,140,255,0.6)" };

  // Selected slots, kept while the visitor moves between dates
  const inCart     = (day, sid) => cart.some(c => c.day === day && c.slotId === sid);
  const toggleCart = (day, sid) => setCart(cur => cur.some(c => c.day === day && c.slotId === sid) ? cur.filter(c => !(c.day === day && c.slotId === sid)) : [...cur, { day, slotId:sid }]);
  const cartItems   = cart.map(c => ({ ...c, slot:SCHEDULE_TIMES[c.slotId] })).sort((a, b) => a.day - b.day || a.slotId - b.slotId);
  const cartTotal   = cartItems.reduce((sum, c) => sum + c.slot.price, 0);
  const cartAdvance = cartItems.length * 500;

  // Visitors: date click → slot picker ("pick") → checkout for all selected slots ("checkout").
  // Admin: "Book Now" on a slot → single booking form ("book").
  const openSlotPicker = (day) => { setBookingNotice(""); setBookingError(""); setBookModal({ day, mode:"pick" }); };
  const openCheckout   = () => { setReceipt(null); setPrintBlocked(false); setBookingError(""); setBookModal({ mode:"checkout" }); };
  const openBooking = (day, slot) => {
    setBookingForm({ name:"", phone:"", payment:"bKash", slotId:slot.id, emp:EMPLOYEES[0].name });
    setBookingNotice(""); setBookingError("");
    setBookModal({ day, mode:"book" });
  };
  const openCollect = (slot) => { setBookingNotice(""); setBookingError(""); setBookModal({ day:selectedDay, mode:"collect", slot }); };

  const isPick         = bookModal?.mode === "pick";
  const isCheckout     = bookModal?.mode === "checkout";
  const isCollect      = bookModal?.mode === "collect";
  const modalSlot      = !bookModal || isPick || isCheckout ? null : isCollect ? bookModal.slot : SCHEDULE_TIMES[bookingForm.slotId];
  const modalOpenSlots = isPick ? openSlotsFor(bookModal.day) : [];

  const confirmCheckout = () => {
    const name = bookingForm.name.trim(), phone = bookingForm.phone.trim();
    if (cartItems.length === 0) { setBookingError("Please select at least one slot."); return; }
    if (!name || !phone) { setBookingError("Please enter your name and phone number."); return; }
    const taken = cartItems.filter(c => getStatus(c.day, c.slotId) !== "Available");
    if (taken.length) {
      setCart(cur => cur.filter(c => getStatus(c.day, c.slotId) === "Available"));
      setBookingError(`${taken.length} of your slots ${taken.length === 1 ? "was" : "were"} just taken and removed. Please check the list and confirm again.`);
      return;
    }
    const receiptId = `STR-${Date.now().toString(36).toUpperCase()}`;
    cartItems.forEach(c => onScheduleChange(dateKeyFor(c.day), c.slotId, { status:"Booked", customer:name, phone, advance:500, paid:500, due:c.slot.price - 500, payType:bookingForm.payment, emp:"Online", receiptId }));
    setReceipt({
      id: receiptId, issued: new Date(), name, phone, payment: bookingForm.payment,
      items: cartItems.map(c => ({ date: fullDateLabel(c.day), time: c.slot.label, period: c.slot.period, price: c.slot.price })),
      total: cartTotal, advance: cartAdvance, due: cartTotal - cartAdvance,
    });
    setCart([]);
    // Don't leave this customer's details in the form for the next person
    setBookingForm(f => ({ ...f, name:"", phone:"" }));
  };

  const confirmBooking = () => {
    const name = bookingForm.name.trim(), phone = bookingForm.phone.trim();
    if (!name || !phone) { setBookingError("Please enter your name and phone number."); return; }
    if (getStatus(bookModal.day, modalSlot.id) !== "Available") { setBookingError("This slot was just taken. Please choose another time."); return; }
    const due = modalSlot.price - 500;
    onScheduleChange(dateKeyFor(bookModal.day), modalSlot.id, { status:"Booked", customer:name, phone, advance:500, paid:500, due, payType:bookingForm.payment, emp: isAdmin ? bookingForm.emp : "Online" });
    setBookingNotice(`Booking confirmed for ${name} · ${modalSlot.label}, ${fullDateLabel(bookModal.day)}. Advance ৳500 via ${bookingForm.payment} · ৳${due.toLocaleString()} due at the ground.`);
  };

  return (
    <div>
      {/* Header */}
      <div className="dash-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:18, flexWrap:"wrap" }}>
          {/* Logo has a black background; screen blend drops it so only the mark shows */}
          <img src={strikeLogo} alt="STRIKE" style={{ height:"clamp(36px, 5vw, 52px)", width:"auto", mixBlendMode:"screen", display:"block" }} />
        </div>
        <div className="price-cards" style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[["6–7:30 AM · 4:30–6 PM", "৳2,800", C.cream], ["7:30 AM – 4:30 PM", "৳2,500", C.cream], ["6 PM – 6 AM", "৳3,199", C.gold]].map(([lbl, price, col]) => (
            <div key={lbl} className="price-card" style={{ background:`linear-gradient(160deg, ${C.surfaceHigh}, #561212)`, border:"1px solid rgba(255,180,170,0.1)", borderRadius:10, padding:"8px 16px", textAlign:"right", boxShadow:"0 10px 26px rgba(20,0,0,0.35), inset 0 1px 0 rgba(255,220,210,0.08)" }}>
              <div className="pc-label" style={{ fontFamily:F, fontSize:9, color:C.faint, letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>{lbl}</div>
              <div className="pc-price" style={{ fontFamily:FH, fontSize:19, color:col, textShadow:"0 0 16px rgba(255,190,150,0.35)" }}>{price}</div>
            </div>
          ))}
        </div>
      </div>


      {/* Two-panel */}
      <div className="dashboard-panels" style={{ display:"grid", gridTemplateColumns: isAdmin ? "minmax(0, 1.2fr) minmax(0, 1fr)" : "minmax(0, 1fr)", gap:18, alignItems:"start" }}>

        {/* Left: Calendar */}
        <div style={{ background:"linear-gradient(160deg, rgba(122,32,32,0.92), rgba(80,16,16,0.94))", border:"1px solid rgba(255,180,170,0.08)", borderRadius:14, padding:"14px 18px", position:"relative", overflow:"hidden", boxShadow:"0 24px 60px rgba(20,0,0,0.45), inset 0 1px 0 rgba(255,220,210,0.07)" }}>
          <img src={strikeLogo} alt="" aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", width:"85%", transform:"translate(-50%, -50%)", opacity:0.035, mixBlendMode:"screen", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:FH, fontSize:17, color:"#FFFFFF", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>November 2026</div>

          {/* Day names */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"clamp(4px, 1vw, 10px)", marginBottom:8 }}>
            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
              <div key={d} style={{ fontFamily:F, fontSize:"clamp(11px, 1vw, 13px)", fontWeight:700, color:C.muted, textAlign:"center", letterSpacing:"0.12em", textTransform:"uppercase", whiteSpace:"nowrap", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                <span className="wd-full">{d}</span><span className="wd-short">{d.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((wk, wi) => (
            <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"clamp(4px, 1vw, 10px)", marginBottom:"clamp(4px, 0.9vh, 8px)" }}>
              {wk.map((day, di) => {
                if (!day) return <div key={di} />;
                const isSel    = day === selectedDay;
                const isToday  = day === 10;
                const booked   = dayBooked(day);
                const picked   = cart.filter(c => c.day === day).length;
                return (
                  <div key={di} className={`cal-day${isSel ? " is-sel" : ""}`} onClick={() => { setSelectedDay(day); if (!isAdmin) openSlotPicker(day); }} style={{
                    position:"relative", zIndex:0, padding:"clamp(7px, 1.3vh, 13px) 2px clamp(6px, 1vh, 10px)", textAlign:"center", cursor:"pointer",
                  }}>
                    <FieldShape
                      fill={isSel ? `linear-gradient(180deg, #F6E6DA, ${C.cream})` : isToday ? "rgba(237,216,200,0.12)" : "linear-gradient(180deg, rgba(74,13,13,0.72), rgba(46,7,7,0.72))"}
                      line={isSel ? "rgba(160,20,30,0.6)" : isToday ? "rgba(237,216,200,0.55)" : "rgba(255,110,110,0.45)"}
                    />
                    {picked > 0 && <div style={{ position:"absolute", top:-6, right:-6, minWidth:20, height:20, padding:"0 5px", borderRadius:10, background:C.green, color:C.bgDeep, fontFamily:F, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 6px rgba(0,0,0,0.35)" }}>{picked}</div>}
                    <div style={{ fontFamily:FH, fontSize:"clamp(21px, min(2.8vw, 4vh), 34px)", color: isSel ? C.bgDeep : "#FFFFFF", lineHeight:1 }}>{day}</div>
                    <div style={{ marginTop:6, display:"flex", justifyContent:"center", gap:4, minHeight:7 }}>
                      {isAdmin && booked > 0 && <div style={{ width:7, height:7, borderRadius:"50%", background:C.red, opacity:0.75 }} />}
                      {booked < 16 && <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, opacity:0.75 }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:"flex", gap:16 }}>
            {(isAdmin ? [[C.green,"Open"],[C.red,"Booked"]] : [[C.green,"Slots available · tap dates to select slots"]]).map(([col,lbl]) => (
              <div key={lbl} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:col }} />
                <span style={{ fontFamily:F, fontSize:10, color:C.faint, letterSpacing:1, textTransform:"uppercase" }}>{lbl}</span>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Right: Slot cards — admin only; visitors pick slots from the date popup */}
        {isAdmin && (
        <div>
          {/* Date header */}
          <div className="date-header" style={{ background:C.surface, borderRadius:12, padding:"18px 22px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:FH, fontSize:22, color:"#FFFFFF", letterSpacing:0.5 }}>{selFull}</div>
              <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:4, letterSpacing:1, textTransform:"uppercase" }}>{isAdmin ? "16 slots · 1h 30m each · synced with Schedule" : "Available slots · 1h 30m each"}</div>
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {(isAdmin ? [[openCount, C.green,"Open"],[bookedCount, C.red,"Booked"]] : [[openCount, C.green,"Open"]]).map(([n,col,lbl]) => (
                <div key={lbl} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:FH, fontSize:28, color:col }}>{n}</div>
                  <div style={{ fontFamily:F, fontSize:9, color:C.faint, letterSpacing:1.5, textTransform:"uppercase" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {selSlots.length === 0 && (
            <div style={{ background:C.surface, borderRadius:12, padding:24, color:C.muted, fontSize:13 }}>No slots available on this date. Please pick another day.</div>
          )}

          {/* Slot cards by period */}
          {["Day","Evening","Night"].map(period => {
            const pSlots = selSlots.filter(s => s.period === period);
            if (pSlots.length === 0) return null;
            const range = SCHEDULE_TIMES.filter(s => s.period === period);
            return (
              <div key={period} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:PERIOD_COLOR[period] }} />
                  <span style={{ fontFamily:FH, fontSize:11, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>{period}</span>
                  <div style={{ flex:1, height:1, background:C.border }} />
                  <span style={{ fontFamily:F, fontSize:10, color:C.faint }}>{range[0].time} – {range[range.length-1].end}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {pSlots.map(sl => {
                    const isOpen = sl.status === "available";
                    return (
                      <div key={sl.id} className="slot-card" style={{ background:C.surface, borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:16, borderLeft:`4px solid ${isOpen ? C.green : C.red}` }}>
                        <div style={{ minWidth:108 }}>
                          <div style={{ fontFamily:FH, fontSize:16, color:"#FFFFFF", letterSpacing:0.3 }}>{sl.time}</div>
                          <div style={{ fontFamily:F, fontSize:9, color:C.faint, marginTop:2 }}>– {sl.end}</div>
                        </div>
                        <div style={{ minWidth:80, textAlign:"right" }}>
                          <div style={{ fontFamily:FH, fontSize:17, color:"#FFFFFF" }}>৳{sl.price.toLocaleString()}</div>
                          <div style={{ fontFamily:F, fontSize:9, color:C.faint, letterSpacing:1, textTransform:"uppercase" }}>per slot</div>
                        </div>
                        <div style={{ flex:1 }}>
                          {isOpen ? (
                            <span style={{ fontFamily:F, fontSize:11, fontWeight:700, color:C.green, letterSpacing:1, textTransform:"uppercase" }}>● Available</span>
                          ) : (
                            <div>
                              <div style={{ fontFamily:F, fontSize:12, color:C.red, fontWeight:700 }}>{sl.customer}</div>
                              <div style={{ fontFamily:F, fontSize:9, color:C.faint, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>● Booked{sl.phone ? ` · ${sl.phone}` : ""}</div>
                              {sl.due > 0 && <div style={{ fontFamily:F, fontSize:10, color:C.gold, marginTop:4, fontWeight:700 }}>Due ৳{sl.due.toLocaleString()}</div>}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => isOpen ? openBooking(selectedDay, sl) : openCollect(sl)}
                          style={{ fontFamily:FH, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", padding:"9px 18px", borderRadius:8, cursor:"pointer", flexShrink:0, background: isOpen ? C.cream : "transparent", color: isOpen ? C.bgDeep : C.red, border: isOpen ? "none" : `1px solid ${C.red}` }}
                        >
                          {isOpen ? "Book Now" : "Collect"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Selection bar */}
      {!isAdmin && cartItems.length > 0 && (
        <div className="cart-bar" style={{ position:"sticky", bottom:0, marginTop:16, background:C.bgDeep, border:`1px solid ${C.borderMid}`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", boxShadow:"0 -8px 30px rgba(20,0,0,0.45)", zIndex:5 }}>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ fontFamily:FH, fontSize:18, color:"#FFFFFF", letterSpacing:0.5 }}>{cartItems.length} slot{cartItems.length === 1 ? "" : "s"} selected</div>
            <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:3 }}>Total ৳{cartTotal.toLocaleString()} · {new Set(cartItems.map(c => c.day)).size} day{new Set(cartItems.map(c => c.day)).size === 1 ? "" : "s"}</div>
          </div>
          <button onClick={() => setCart([])} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"10px 16px", borderRadius:8, cursor:"pointer", background:"transparent", color:C.muted, border:`1px solid ${C.borderMid}` }}>Clear</button>
          <button onClick={openCheckout} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"10px 20px", borderRadius:8, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>Continue →</button>
        </div>
      )}

      {/* Modal */}
      {isPick && (
        <Modal title="Select Slots" onClose={() => setBookModal(null)}>
          <div style={{ fontFamily:FH, fontSize:20, color:"#FFFFFF", letterSpacing:0.5 }}>{fullDateLabel(bookModal.day)}</div>
          <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:4, marginBottom:18, letterSpacing:1, textTransform:"uppercase" }}>{modalOpenSlots.length} open · 1h 30m each · tap slots to select, then pick more dates or continue</div>
          {modalOpenSlots.length === 0 && (
            <div style={{ background:C.bgDeep, borderRadius:10, padding:20, color:C.muted, fontSize:13 }}>No slots available on this date. Please pick another day.</div>
          )}
          {["Day","Evening","Night"].map(period => {
            const pSlots = modalOpenSlots.filter(s => s.period === period);
            if (pSlots.length === 0) return null;
            return (
              <div key={period} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:PERIOD_COLOR[period] }} />
                  <span style={{ fontFamily:FH, fontSize:11, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>{period}</span>
                  <div style={{ flex:1, height:1, background:C.border }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {pSlots.map(sl => {
                    const picked = inCart(bookModal.day, sl.id);
                    return (
                      <button key={sl.id} aria-pressed={picked} onClick={() => toggleCart(bookModal.day, sl.id)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, width:"100%", padding:"12px 16px", borderRadius:9, cursor:"pointer", background: picked ? "rgba(91,232,154,0.14)" : C.bgDeep, border:`1px solid ${picked ? C.green : C.border}`, borderLeft:`4px solid ${C.green}`, textAlign:"left" }}>
                        <span style={{ fontFamily:FH, fontSize:15, color:"#FFFFFF", letterSpacing:0.3 }}>{sl.label}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontFamily:FH, fontSize:15, color:C.cream }}>৳{sl.price.toLocaleString()}</span>
                          <span style={{ width:22, height:22, borderRadius:6, border:`2px solid ${picked ? C.green : C.borderMid}`, background: picked ? C.green : "transparent", color:C.bgDeep, fontSize:14, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{picked ? "✓" : ""}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginTop:8, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
            <div style={{ flex:1, minWidth:140, fontFamily:F, fontSize:12, color:C.muted }}>{cartItems.length} selected in total · ৳{cartTotal.toLocaleString()}</div>
            <button type="button" onClick={() => setBookModal(null)} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 16px", borderRadius:7, cursor:"pointer", background:"transparent", color:C.muted, border:`1px solid ${C.borderMid}` }}>Pick another date</button>
            <button type="button" disabled={cartItems.length === 0} onClick={openCheckout} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 18px", borderRadius:7, cursor: cartItems.length ? "pointer" : "not-allowed", opacity: cartItems.length ? 1 : 0.45, background:C.cream, color:C.bgDeep, border:"none" }}>Continue ({cartItems.length})</button>
          </div>
        </Modal>
      )}

      {isCheckout && (
        <Modal title={receipt ? "Booking Confirmed" : "Confirm Booking"} onClose={() => { setReceipt(null); setBookModal(null); }}>
          {receipt ? (
            <div>
              <Receipt receipt={receipt} />
              {printBlocked && <div style={{ marginTop:12, background:"rgba(255,221,170,0.08)", border:`1px solid ${C.gold}`, borderRadius:7, padding:"10px 12px", color:C.gold, fontSize:12, lineHeight:1.5 }}>Printing isn't available on this page. Take a screenshot of the receipt to keep it.</div>}
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10, flexWrap:"wrap", marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                <button type="button" onClick={() => { setReceipt(null); setBookModal(null); }} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 20px", borderRadius:7, cursor:"pointer", background:"transparent", color:C.muted, border:`1px solid ${C.borderMid}` }}>Done</button>
                <button type="button" onClick={() => setPrintBlocked(!printReceipt(receipt))} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 20px", borderRadius:7, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>Print / Save PDF</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ background:C.bgDeep, borderRadius:10, padding:"6px 16px", marginBottom:14 }}>
                {cartItems.length === 0 && <div style={{ color:C.muted, fontSize:13, padding:"12px 0" }}>No slots selected.</div>}
                {cartItems.map(c => (
                  <div key={`${c.day}-${c.slotId}`} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:FH, fontSize:14, color:"#FFFFFF", letterSpacing:0.3 }}>{fullDateLabel(c.day)}</div>
                      <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:2 }}>{c.slot.label} · {c.slot.period}</div>
                    </div>
                    <div style={{ fontFamily:FH, fontSize:14, color:C.cream }}>৳{c.slot.price.toLocaleString()}</div>
                    <button type="button" title="Remove slot" onClick={() => toggleCart(c.day, c.slotId)} style={{ background:"transparent", border:`1px solid ${C.borderMid}`, color:C.red, borderRadius:6, width:28, height:28, cursor:"pointer", flexShrink:0 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gap:6, fontFamily:F, fontSize:12, color:C.muted, marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}><span>Total ({cartItems.length} slot{cartItems.length === 1 ? "" : "s"})</span><strong style={{ color:"#FFFFFF" }}>৳{cartTotal.toLocaleString()}</strong></div>
                <div style={{ display:"flex", justifyContent:"space-between" }}><span>Advance now (৳500 per slot)</span><strong style={{ color:C.cream }}>৳{cartAdvance.toLocaleString()}</strong></div>
                <div style={{ display:"flex", justifyContent:"space-between", color:C.gold }}><span>Remaining at the ground</span><strong>৳{(cartTotal - cartAdvance).toLocaleString()}</strong></div>
              </div>
              <Field label="Your Name"><Input value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name:e.target.value })} placeholder="Full name" /></Field>
              <Field label="Phone Number"><Input type="tel" value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone:e.target.value })} placeholder="01XXXXXXXXX" /></Field>
              <Field label="Payment Method">
                <Sel value={bookingForm.payment} onChange={e => setBookingForm({ ...bookingForm, payment:e.target.value })}><option>bKash</option><option>Bank</option></Sel>
              </Field>
              {bookingError && <div style={{ color:C.red, fontSize:11, marginBottom:12 }}>{bookingError}</div>}
              <ModalFooter onCancel={() => setBookModal(null)} onConfirm={confirmCheckout} confirmLabel={`Confirm ${cartItems.length} Booking${cartItems.length === 1 ? "" : "s"}`} />
            </div>
          )}
        </Modal>
      )}

      {bookModal && modalSlot && (
        <Modal title={isCollect ? "Collect Payment" : "Book Slot"} onClose={() => setBookModal(null)}>
          <div style={{ background:C.bgDeep, borderRadius:10, padding:"18px 20px", marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:FH, fontSize:22, color:"#FFFFFF", letterSpacing:0.5 }}>{modalSlot.time} – {modalSlot.end}</div>
              <div style={{ fontFamily:F, fontSize:11, color:C.faint, marginTop:5, letterSpacing:1.5, textTransform:"uppercase" }}>{fullDateLabel(bookModal.day)} · {modalSlot.period} · 1h 30m</div>
              {isCollect && (
                <div style={{ fontFamily:F, fontSize:12, color:C.red, marginTop:10, fontWeight:700 }}>⚠ {modalSlot.customer} — collecting payment</div>
              )}
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:FH, fontSize:36, color:"#FFFFFF", lineHeight:1, letterSpacing:-0.5 }}>৳{modalSlot.price.toLocaleString()}</div>
              <div style={{ fontFamily:F, fontSize:9, color:C.faint, letterSpacing:2, textTransform:"uppercase", marginTop:5 }}>{modalSlot.period} Rate</div>
            </div>
          </div>

          {bookingNotice ? (
            <div>
              <div style={{ background:"rgba(91,232,154,0.1)", border:`1px solid ${C.green}`, borderRadius:7, padding:"12px 14px", color:C.green, fontSize:12, lineHeight:1.5 }}>{bookingNotice}</div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                <button onClick={() => setBookModal(null)} style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"9px 20px", borderRadius:7, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>Done</button>
              </div>
            </div>
          ) : isCollect ? (
            <div>
              <Field label="Customer"><Input value={modalSlot.customer || ""} readOnly style={{ opacity:0.6 }} /></Field>
              <Field label="Amount (৳)"><Input type="number" placeholder="0" /></Field>
              <Field label="Payment Method">
                <Sel value={bookingForm.payment} onChange={e => setBookingForm({ ...bookingForm, payment:e.target.value })}><option>bKash</option><option>Bank</option></Sel>
              </Field>
              <Field label="Received By">
                <Sel value={bookingForm.emp} onChange={e => setBookingForm({ ...bookingForm, emp:e.target.value })}>{EMPLOYEES.map(e => <option key={e.id}>{e.name}</option>)}</Sel>
              </Field>
              <ModalFooter onCancel={() => setBookModal(null)} onConfirm={() => setBookModal(null)} confirmLabel="Record Payment" />
            </div>
          ) : (
            <div>
              <Field label="Your Name"><Input value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name:e.target.value })} placeholder="Full name" /></Field>
              <Field label="Phone Number"><Input type="tel" value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone:e.target.value })} placeholder="01XXXXXXXXX" /></Field>
              <Field label="Advance (৳)"><Input type="number" value={500} readOnly style={{ opacity:0.7 }} /></Field>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:-7, marginBottom:16, fontFamily:F, fontSize:12, color:C.gold }}><span>Remaining after advance</span><strong>৳{(modalSlot.price - 500).toLocaleString()}</strong></div>
              <Field label="Payment Method">
                <Sel value={bookingForm.payment} onChange={e => setBookingForm({ ...bookingForm, payment:e.target.value })}><option>bKash</option><option>Bank</option></Sel>
              </Field>
              {isAdmin && (
                <Field label="Received By">
                  <Sel value={bookingForm.emp} onChange={e => setBookingForm({ ...bookingForm, emp:e.target.value })}>{EMPLOYEES.map(e => <option key={e.id}>{e.name}</option>)}</Sel>
                </Field>
              )}
              {bookingError && <div style={{ color:C.red, fontSize:11, marginBottom:12 }}>{bookingError}</div>}
              <ModalFooter onCancel={() => setBookModal(null)} onConfirm={confirmBooking} confirmLabel="Confirm Booking" />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── My Bookings (customer view) ────────────────────────
// Customers find their bookings by the phone number they booked with.
function MyBookings({ scheduleRecords, onNavigate }) {
  // Always starts blank and is never saved, so one customer's number never shows for the next
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState("");
  const phoneKey = normPhone(phone);
  const money = value => `৳${value.toLocaleString()}`;

  const mine = !phoneKey ? [] : Object.entries(scheduleRecords)
    .filter(([, record]) => record.status !== "Available" && normPhone(record.phone) === phoneKey)
    .map(([recordKey, record]) => {
      const [date, slotId] = recordKey.split(/-(?=\d+$)/);
      const slot = SCHEDULE_TIMES[Number(slotId)];
      const start = slotStartTime(date, slot);
      const played = start.getTime() + 90 * 60000 <= APP_NOW.getTime();
      const paid = Number(record.paid ?? record.advance ?? 0);
      const due = record.closed ? 0 : Number(record.due ?? Math.max(0, slot.price - paid));
      return { recordKey, date, slot, start, played, status:record.status, paid, due, receiptId:record.receiptId };
    })
    .sort((a, b) => a.start - b.start);
  const upcoming = mine.filter(b => !b.played);
  const played   = mine.filter(b => b.played);
  const totalPaid = mine.reduce((sum, b) => sum + b.paid, 0);
  const totalDue  = mine.reduce((sum, b) => sum + b.due, 0);

  const lookup = () => setPhone(phoneInput);

  const row = b => {
    const chip = b.played ? ["Played", C.faint] : b.status === "Hold" ? ["On hold", C.gold] : ["Upcoming", C.green];
    return (
      <div key={b.recordKey} className="booking-row" style={{ background:C.surface, borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16, borderLeft:`4px solid ${chip[1]}`, opacity: b.played ? 0.75 : 1 }}>
        <div style={{ minWidth:120 }}>
          <div style={{ fontFamily:FH, fontSize:16, color:"#FFFFFF", letterSpacing:0.3 }}>{new Date(`${b.date}T12:00:00`).toLocaleDateString("en-US", { weekday:"short" })}, {dateLabel(b.date)}</div>
          <div style={{ fontFamily:F, fontSize:10, color:C.faint, marginTop:3, letterSpacing:1, textTransform:"uppercase" }}>{b.slot.period}</div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:F, fontSize:14, fontWeight:700, color:"#FFFFFF" }}>{b.slot.label}</div>
          <div style={{ fontFamily:F, fontSize:11, color:chip[1], marginTop:3, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>● {chip[0]}</div>
          {b.receiptId && <div style={{ fontFamily:F, fontSize:10, color:C.faint, marginTop:3 }}>Receipt {b.receiptId}</div>}
        </div>
        <div style={{ textAlign:"right", minWidth:110 }}>
          <div style={{ fontFamily:FH, fontSize:17, color:"#FFFFFF" }}>{money(b.slot.price)}</div>
          <div style={{ fontFamily:F, fontSize:10, color: b.due > 0 ? C.gold : C.green, marginTop:3, fontWeight:700 }}>{b.due > 0 ? `Paid ${money(b.paid)} · Due ${money(b.due)}` : "Fully paid"}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontFamily:FH, fontSize:28, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>My Bookings</div>
      <div style={{ fontFamily:F, fontSize:12, color:C.muted, marginBottom:20 }}>Enter the phone number you booked with to see all your slots.</div>

      <form onSubmit={e => { e.preventDefault(); lookup(); }} style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24, maxWidth:460 }}>
        <div style={{ flex:1, minWidth:200 }}><Input type="tel" name="lookup-phone" autoComplete="off" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="01XXXXXXXXX" aria-label="Phone number" /></div>
        <button type="submit" style={{ fontFamily:FH, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"10px 20px", borderRadius:7, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>Show my bookings</button>
      </form>

      {phoneKey && mine.length === 0 && (
        <div style={{ background:C.surface, borderRadius:12, padding:24, color:C.muted, fontSize:13 }}>
          No bookings found for {phone}.{" "}
          <button type="button" onClick={() => onNavigate("dashboard")} style={{ background:"none", border:"none", padding:0, color:C.cream, fontWeight:700, cursor:"pointer", textDecoration:"underline", fontSize:13 }}>Book a slot</button>
        </div>
      )}

      {mine.length > 0 && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10, marginBottom:24 }}>
            {[["Total booked", mine.length, "#FFFFFF"], ["Played", played.length, C.cream], ["Left to play", upcoming.length, C.green], ["Paid", money(totalPaid), C.cream], ["Due", money(totalDue), C.gold]].map(([label, value, color]) => (
              <div key={label} style={{ background:C.surface, borderRadius:12, padding:"16px 18px" }}>
                <div style={{ fontFamily:F, fontSize:10, color:C.faint, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</div>
                <div style={{ fontFamily:FH, fontSize:26, color, marginTop:6 }}>{value}</div>
              </div>
            ))}
          </div>

          {[["Upcoming", upcoming], ["Played", played]].map(([title, list]) => list.length > 0 && (
            <div key={title} style={{ marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontFamily:FH, fontSize:13, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>{title} · {list.length}</span>
                <div style={{ flex:1, height:1, background:C.border }} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{list.map(row)}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Editable weekly schedule ──────────────────────────
function Schedule({ scheduleRecords, onScheduleChange }) {
  const [weekStart, setWeekStart] = useState(SCHEDULE_WEEKS[0]);
  const weekDates = Array.from({ length:7 }, (_, index) => getDateKey(weekStart, index));
  const bookedCount = weekDates.reduce((total, date) => total + SCHEDULE_TIMES.filter(slot => scheduleRecords[`${date}-${slot.id}`]?.status === "Booked").length, 0);
  const holdCount = weekDates.reduce((total, date) => total + SCHEDULE_TIMES.filter(slot => scheduleRecords[`${date}-${slot.id}`]?.status === "Hold").length, 0);
  const updateCell = (date, slotId, updates) => {
    const key = `${date}-${slotId}`;
    const current = scheduleRecords[key] || { status:"Available", customer:"", phone:"" };
    const next = { ...current, ...updates };
    if (next.status === "Available") { next.customer = ""; next.phone = ""; }
    onScheduleChange(date, slotId, next);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:FH, fontSize:28, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase" }}>Weekly Schedule</div>
          <div style={{ fontFamily:F, fontSize:12, color:C.muted, marginTop:6 }}>Edit a slot here and the Dashboard and Bookings update automatically. Changes save in this browser.</div>
        </div>
        <Sel value={weekStart} onChange={event => setWeekStart(event.target.value)} style={{ width:210 }}>
          {SCHEDULE_WEEKS.map((start, index) => <option key={start} value={start}>Week {index + 1} · {dateLabel(start)}</option>)}
        </Sel>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        {[["Booked", bookedCount, C.red], ["On hold", holdCount, C.gold], ["Available", 112 - bookedCount - holdCount, C.green]].map(([label, count, color]) => (
          <div key={label} style={{ background:C.surface, borderRadius:9, padding:"10px 15px", minWidth:118 }}>
            <div style={{ color:C.faint, fontSize:9, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</div>
            <div style={{ color, fontFamily:FH, fontSize:20, marginTop:4 }}>{count}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX:"auto", background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
        <table style={{ borderCollapse:"collapse", width:"100%", minWidth:1220, tableLayout:"fixed" }}>
          <thead>
            <tr>
              <th style={{ width:170, padding:12, textAlign:"left", color:C.cream, fontFamily:FH, fontSize:12, letterSpacing:1, borderBottom:`1px solid ${C.border}`, position:"sticky", left:0, background:C.bgDeep, zIndex:2 }}>TIME SLOT</th>
              {weekDates.map(date => <th key={date} style={{ padding:"11px 8px", textAlign:"center", color:C.cream, fontFamily:FH, fontSize:12, letterSpacing:0.6, borderBottom:`1px solid ${C.border}`, background:C.bgDeep }}>
                {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday:"short" }).toUpperCase()}<div style={{ color:C.faint, fontFamily:F, fontSize:10, marginTop:4 }}>{dateLabel(date)}</div>
              </th>)}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE_TIMES.map(slot => <tr key={slot.id}>
              <th style={{ padding:"10px 12px", textAlign:"left", color:C.text, fontFamily:F, fontSize:11, fontWeight:700, borderBottom:`1px solid ${C.border}`, position:"sticky", left:0, background:C.surface, zIndex:1 }}>
                {slot.label}<div style={{ color:C.faint, fontSize:9, marginTop:4 }}>{slot.period} · ৳{slot.price.toLocaleString()}</div>
              </th>
              {weekDates.map(date => {
                const record = scheduleRecords[`${date}-${slot.id}`] || { status:"Available", customer:"", phone:"" };
                const statusColor = record.status === "Booked" ? C.red : record.status === "Hold" ? C.gold : C.green;
                return <td key={date} style={{ padding:6, verticalAlign:"top", borderBottom:`1px solid ${C.border}`, borderLeft:`1px solid ${C.border}` }}>
                  <select aria-label={`${dateLabel(date)} ${slot.label} status`} value={record.status} onChange={event => updateCell(date, slot.id, { status:event.target.value })} style={{ width:"100%", padding:"7px 6px", borderRadius:6, border:`1px solid ${C.borderMid}`, background:C.bgDeep, color:statusColor, fontSize:10, fontWeight:700 }}>
                    <option>Available</option><option>Booked</option><option>Hold</option>
                  </select>
                  {record.status !== "Available" && <Input aria-label={`${dateLabel(date)} ${slot.label} booked by`} value={record.customer || ""} onChange={event => updateCell(date, slot.id, { customer:event.target.value })} placeholder="Booked by" style={{ padding:"7px 8px", marginTop:5, fontSize:10 }} />}
                  {record.status !== "Available" && <Input aria-label={`${dateLabel(date)} ${slot.label} phone`} value={record.phone || ""} onChange={event => updateCell(date, slot.id, { phone:event.target.value })} placeholder="Phone (optional)" style={{ padding:"7px 8px", marginTop:5, fontSize:10 }} />}
                </td>;
              })}
            </tr>)}
          </tbody>
        </table>
      </div>
      <div style={{ color:C.faint, fontSize:10, marginTop:10 }}>The workbook’s four weekly tabs are represented here. New edits are saved locally and remain after refreshing this browser.</div>
    </div>
  );
}

// ── Live Slots ─────────────────────────────────────────
function LiveSlots({ scheduleRecords, onScheduleChange }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", slot:"06:00–07:30 — ৳2,200", payment:"bKash" });
  const [notice, setNotice] = useState("");
  const dateKey = "2026-11-10";
  const filtered = SCHEDULE_TIMES.map(slot => {
    const record = scheduleRecords[`${dateKey}-${slot.id}`] || {};
    return { ...slot, ...record, status:record.status || "Available" };
  }).filter(slot => slot.status === "Available");

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div style={{ fontFamily:FH, fontSize:28, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase" }}>Live Slots</div>
        <button onClick={() => { setNotice(""); setForm({ name:"", phone:"", slot:"06:00–07:30 — ৳2,200", payment:"bKash" }); setModal(true); }} style={{ fontFamily:FH, fontSize:13, letterSpacing:1.5, textTransform:"uppercase", padding:"10px 22px", borderRadius:8, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>+ New Booking</button>
      </div>

      <div style={{ fontFamily:F, fontSize:12, color:C.muted, marginBottom:20, padding:"11px 16px", background:C.surface, borderLeft:`3px solid ${C.green}`, borderRadius:6 }}>Available slots this week · {filtered.length} open</div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(sl => {
          const isOpen = sl.status === "Available";
          return (
            <div key={sl.id} className="live-slot-card" style={{ background:C.surface, borderRadius:12, padding:"18px 22px", display:"flex", alignItems:"center", gap:20, borderLeft:`5px solid ${isOpen ? C.green : C.red}` }}>
              <div style={{ minWidth:130 }}>
                <div style={{ fontFamily:FH, fontSize:16, color:"#FFFFFF", letterSpacing:0.5 }}>{sl.time}</div>
                <div style={{ fontFamily:F, fontSize:10, color:C.faint, marginTop:3, letterSpacing:1, textTransform:"uppercase" }}>1h 30m</div>
              </div>
              {isOpen ? (
                <div style={{ flex:1 }}>
                  <span style={{ fontFamily:F, fontSize:12, fontWeight:700, color:C.green, letterSpacing:1, textTransform:"uppercase" }}>● Available</span>
                </div>
              ) : (
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:F, fontSize:14, fontWeight:700, color:"#FFFFFF" }}>{sl.customer}</div>
                  <div style={{ fontFamily:F, fontSize:11, color:C.muted, marginTop:2 }}>Advance: ৳{sl.advance.toLocaleString()} · Due: ৳{sl.due.toLocaleString()} · {sl.emp}</div>
                </div>
              )}
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:FH, fontSize:20, color:"#FFFFFF" }}>৳{sl.price.toLocaleString()}</div>
                <div style={{ fontFamily:F, fontSize:9, color:C.faint, textTransform:"uppercase", letterSpacing:1 }}>{isOpen ? "Day Rate" : "Advance"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title="New Booking" onClose={() => setModal(false)}>
          <Field label="Customer Name"><Input value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} placeholder="Full name" /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone:e.target.value })} placeholder="01XXXXXXXXX" /></Field>
          <Field label="Time Slot">
            <Sel value={form.slot} onChange={e => setForm({ ...form, slot:e.target.value })}>
              {[["06:00–07:30","2,200"],["07:30–09:00","2,200"],["09:00–10:30","2,200"],["18:00–19:30","3,000"],["19:30–21:00","3,000"],["21:00–22:30","3,000"]].map(([t,p]) => (
                <option key={t}>{t} — ৳{p}</option>
              ))}
            </Sel>
          </Field>
          <Field label="Advance (৳)"><Input type="number" value="500" readOnly style={{ opacity:0.7 }} /></Field>
          <Field label="Payment">
            <Sel value={form.payment} onChange={e => setForm({ ...form, payment:e.target.value })}><option>bKash</option><option>Bank</option></Sel>
          </Field>
          <Field label="Received By"><Sel>{EMPLOYEES.map(e => <option key={e.id}>{e.name}</option>)}</Sel></Field>
          {notice && <div style={{ color:C.red, fontSize:11, marginBottom:12 }}>{notice}</div>}
          <ModalFooter onCancel={() => setModal(false)} onConfirm={() => {
            if (!form.name.trim() || !form.phone.trim()) { setNotice("Customer name and phone are required."); return; }
            const price = form.slot.includes("3,000") ? 3000 : 2200;
            const [slotRange] = form.slot.split(" — ");
            const slotStart = slotRange.split("–")[0];
            const selectedSlot = SCHEDULE_TIMES.find(item => item.time === slotStart);
            if (!selectedSlot) { setNotice("Please choose a valid time slot."); return; }
            onScheduleChange(dateKey, selectedSlot.id, { status:"Booked", customer:form.name.trim(), phone:form.phone.trim(), advance:500, paid:500, due:price - 500, payType:form.payment, emp:"Masum" });
            setModal(false);
          }} confirmLabel="Confirm Booking" />
        </Modal>
      )}
    </div>
  );
}

// ── Bookings ───────────────────────────────────────────
function Bookings({ bookings = [], onUpdateBooking }) {
  const [paymentModal, setPaymentModal] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dealClosed, setDealClosed] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Nov 10");
  const selectedBookings = bookings.filter(bk => bk.date === selectedDate);

  return (
    <div>
      <div style={{ fontFamily:FH, fontSize:28, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Bookings</div>
      <div style={{ fontFamily:F, fontSize:12, color:C.gold, marginBottom:22, padding:"10px 16px", background:"rgba(255,221,170,0.08)", borderLeft:`3px solid ${C.gold}`, borderRadius:6 }}>
        Edit the actual amount received and close the slot deal when payment is complete.
      </div>

      <div className="bookings-layout" style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:18, alignItems:"start" }}>
        <div style={{ background:C.surface, borderRadius:14, padding:20 }}>
          <div style={{ fontFamily:FH, fontSize:17, color:"#FFFFFF", marginBottom:16, textTransform:"uppercase" }}>November 2026</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>{["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <div key={d} style={{ fontSize:9, color:C.faint, textAlign:"center" }}>{d}</div>)}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {Array.from({ length:42 }, (_, i) => { const offset = (new Date(2026, 10, 1).getDay() + 6) % 7; const value = i - offset + 1; const day = value >= 1 && value <= 30 ? value : null; const label = day ? `Nov ${day}` : null; const count = bookings.filter(b => b.date === label).length; return <div key={i} onClick={() => label && setSelectedDate(label)} style={{ minHeight:39, borderRadius:7, padding:"5px 2px", textAlign:"center", cursor:label ? "pointer" : "default", background:selectedDate === label ? C.cream : "transparent", color:selectedDate === label ? C.bgDeep : "#FFFFFF" }}>{day && <><div style={{ fontFamily:FH, fontSize:12 }}>{day}</div>{count > 0 && <div style={{ color:selectedDate === label ? C.bgDeep : C.red, fontSize:9, marginTop:3 }}>{count} due</div>}</>}</div>; })}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}><div style={{ fontFamily:FH, fontSize:18, color:"#FFFFFF" }}>{selectedDate} PAYMENT HISTORY</div><div style={{ fontFamily:F, fontSize:11, color:C.gold }}>{selectedBookings.length} booking{selectedBookings.length === 1 ? "" : "s"}</div></div>
          {selectedBookings.length === 0 && <div style={{ background:C.surface, borderRadius:12, padding:24, color:C.muted, fontSize:13 }}>No bookings on this date.</div>}
          {selectedBookings.map(bk => (
          <div key={bk.id} className="booking-row" style={{ background:C.surface, borderRadius:12, padding:"18px 22px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ minWidth:70 }}>
              <div style={{ fontFamily:FH, fontSize:12, color:C.faint, letterSpacing:1 }}>{bk.id}</div>
              <div style={{ fontFamily:F, fontSize:10, color:C.faint, marginTop:2 }}>{bk.date}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:F, fontSize:15, fontWeight:700, color:"#FFFFFF" }}>{bk.customer}</div>
              <div style={{ fontFamily:F, fontSize:11, color:C.muted, marginTop:2 }}>{bk.phone} · {bk.slot} · via {bk.emp}</div>
              <div style={{ fontFamily:F, fontSize:10, color:C.faint, marginTop:5 }}>Paid ৳{(bk.paid ?? bk.advance).toLocaleString()} · {bk.due > 0 ? `৳${bk.due.toLocaleString()} still due` : "No payment due"}</div>
            </div>
            <div style={{ textAlign:"right", minWidth:120 }}>
              <div style={{ fontFamily:FH, fontSize:18, color:"#FFFFFF" }}>৳{bk.price.toLocaleString()}</div>
              <div style={{ fontFamily:F, fontSize:10, color: bk.due > 0 ? C.red : C.green, marginTop:2, fontWeight:700 }}>
                {bk.closed ? "Deal Closed" : bk.due > 0 ? `Due ৳${bk.due.toLocaleString()}` : "Fully Paid"}
              </div>
            </div>
            <button onClick={() => { setPaidAmount(bk.paid ?? bk.advance); setDealClosed(Boolean(bk.closed)); setPaymentModal(bk); }} style={{ fontFamily:FH, fontSize:11, letterSpacing:1, textTransform:"uppercase", padding:"8px 16px", borderRadius:7, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none", flexShrink:0 }}>
              Edit Payment
            </button>
          </div>
          ))}
        </div>
      </div>

      {paymentModal && (
        <Modal title="Edit Payment & Close Deal" onClose={() => setPaymentModal(null)}>
          <div style={{ background:C.bgDeep, borderRadius:10, padding:"16px 18px", marginBottom:20 }}>
            <div style={{ fontFamily:FH, fontSize:16, color:"#FFFFFF" }}>{paymentModal.customer}</div>
            <div style={{ fontFamily:F, fontSize:12, color:C.faint, marginTop:4 }}>{paymentModal.phone} · {paymentModal.slot} · Total ৳{paymentModal.price.toLocaleString()}</div>
          </div>
          <Field label="Amount Paid (৳)">
            <Input type="number" min="0" max={paymentModal.price} value={paidAmount} onChange={e => setPaidAmount(Math.max(0, Math.min(paymentModal.price, Number(e.target.value) || 0)))} />
          </Field>
          <div style={{ display:"flex", justifyContent:"space-between", color:C.gold, fontSize:12, marginBottom:16 }}><span>Remaining due</span><strong>৳{Math.max(0, paymentModal.price - paidAmount).toLocaleString()}</strong></div>
          <label style={{ display:"flex", alignItems:"center", gap:10, color:C.text, fontSize:13, marginBottom:12, cursor:"pointer" }}><input type="checkbox" checked={dealClosed} onChange={e => setDealClosed(e.target.checked)} /> Slot deal closed</label>
          <ModalFooter
            onCancel={() => setPaymentModal(null)}
            onConfirm={() => { onUpdateBooking(paymentModal.id, { paid:paidAmount, due:Math.max(0, paymentModal.price - paidAmount), closed:dealClosed }); setPaymentModal(null); }}
            confirmLabel="Save Payment"
          />
        </Modal>
      )}
    </div>
  );
}

// ── Earnings ──────────────────────────────────────────
function Earnings({ bookings = [] }) {
  const [salaryRows, setSalaryRows] = useState([{ id:1, employee:"Masum", amount:0 }]);
  const [nextSalaryId, setNextSalaryId] = useState(2);
  const getPeriod = slot => {
    const hour = Number(slot.slice(0, 2));
    if (hour >= 6 && hour < 18) return "Day";
    if (hour >= 18) return "Evening";
    return "Night";
  };
  const periodStats = ["Day", "Evening", "Night"].map(period => ({
    period,
    sold: bookings.filter(bk => getPeriod(bk.slot) === period).length,
    total: bookings.filter(bk => getPeriod(bk.slot) === period).reduce((sum, bk) => sum + bk.price, 0),
  }));
  const bookingMoney = bookings.reduce((sum, bk) => sum + (bk.advance || 0), 0);
  const closedMoney = bookings.reduce((sum, bk) => sum + Math.max(0, (bk.paid ?? bk.advance) - (bk.advance || 0)), 0);
  const collected = bookings.reduce((sum, bk) => sum + (bk.paid ?? bk.advance), 0);
  const discount = bookings.reduce((sum, bk) => sum + (bk.closed ? Math.max(0, bk.price - (bk.paid ?? bk.advance)) : 0), 0);
  const slotValue = bookings.reduce((sum, bk) => sum + bk.price, 0);
  const salaries = salaryRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const net = collected - salaries;
  const money = value => `৳${value.toLocaleString()}`;

  return (
    <div>
      <div style={{ fontFamily:FH, fontSize:28, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Earnings</div>
      <div style={{ fontFamily:F, fontSize:12, color:C.muted, marginBottom:22 }}>Revenue is calculated from booking advances, payments collected after slot closure, discounts given on closed deals, and employee salary costs.</div>

      <div className="earnings-summary" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {[["Total slot value", slotValue, C.cream], ["Money collected", collected, C.green], ["We gave discount", discount, C.red], ["After salaries", net, C.gold]].map(([label, value, color]) => (
          <div key={label} style={{ background:C.surface, borderRadius:12, padding:"18px 20px" }}><div style={{ fontFamily:F, fontSize:10, color:C.faint, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</div><div style={{ fontFamily:FH, fontSize:25, color, marginTop:8 }}>{money(value)}</div></div>
        ))}
      </div>

      <div className="earnings-columns" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, alignItems:"start" }}>
        <div style={{ background:C.surface, borderRadius:14, padding:22 }}>
          <div style={{ fontFamily:FH, fontSize:18, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>Slots Sold</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {periodStats.map(stat => <div key={stat.period} style={{ background:C.bgDeep, borderRadius:9, padding:"14px 12px" }}><div style={{ color:C.muted, fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>{stat.period} slots</div><div style={{ color:"#FFFFFF", fontFamily:FH, fontSize:28, marginTop:4 }}>{stat.sold}</div><div style={{ color:C.faint, fontSize:11, marginTop:2 }}>{money(stat.total)} value</div></div>)}
          </div>
          <div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${C.border}`, display:"grid", gap:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12 }}><span>Booking money / advance</span><strong style={{ color:C.cream }}>{money(bookingMoney)}</strong></div>
            <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12 }}><span>After slot closed</span><strong style={{ color:C.green }}>{money(closedMoney)}</strong></div>
            <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12 }}><span>All customer payments</span><strong style={{ color:"#FFFFFF" }}>{money(collected)}</strong></div>
            <div style={{ display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12 }}><span>We gave discount</span><strong style={{ color:C.red }}>{money(discount)}</strong></div>
          </div>
        </div>

        <div style={{ background:C.surface, borderRadius:14, padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}><div style={{ fontFamily:FH, fontSize:18, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase" }}>Employee Salaries</div><button onClick={() => { setSalaryRows([...salaryRows, { id:nextSalaryId, employee:"Masum", amount:0 }]); setNextSalaryId(nextSalaryId + 1); }} style={{ fontFamily:FH, fontSize:10, letterSpacing:1, padding:"8px 12px", borderRadius:6, cursor:"pointer", background:C.cream, color:C.bgDeep, border:"none" }}>+ Add Payment</button></div>
          {salaryRows.map(row => <div key={row.id} className="salary-row" style={{ display:"grid", gridTemplateColumns:"1fr 120px 32px", gap:8, marginBottom:8 }}><Sel value={row.employee} onChange={e => setSalaryRows(salaryRows.map(item => item.id === row.id ? { ...item, employee:e.target.value } : item))}>{EMPLOYEES.map(employee => <option key={employee.id}>{employee.name}</option>)}</Sel><Input type="number" min="0" value={row.amount} onChange={e => setSalaryRows(salaryRows.map(item => item.id === row.id ? { ...item, amount:e.target.value } : item))} placeholder="Amount" /><button onClick={() => setSalaryRows(salaryRows.filter(item => item.id !== row.id))} title="Remove salary payment" style={{ background:"transparent", border:`1px solid ${C.borderMid}`, color:C.red, borderRadius:6, cursor:"pointer" }}>×</button></div>)}
          <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12 }}><span>Total salary cost</span><strong style={{ color:C.red }}>{money(salaries)}</strong></div>
          <div style={{ marginTop:10, display:"flex", justifyContent:"space-between", color:C.muted, fontSize:12 }}><span>Net earnings after salary</span><strong style={{ color:C.green }}>{money(net)}</strong></div>
        </div>
      </div>
    </div>
  );
}

// ── Nav & Pages ────────────────────────────────────────
const NAV   = [
  { id:"dashboard", label:"Dashboard" },
  { id:"schedule",  label:"Schedule"  },
  { id:"bookings",  label:"Bookings"  },
  { id:"earnings",  label:"Earnings"  },
];
const VISITOR_NAV = [
  { id:"dashboard",  label:"Book your slot" },
  { id:"mybookings", label:"My Bookings" },
];
const PAGES = { dashboard: Dashboard, schedule: Schedule, bookings: Bookings, earnings: Earnings, mybookings: MyBookings };

// Change this. It ships inside the page code, so it only keeps casual visitors out of the admin screens.
const ADMIN_PASSWORD = "strike2026";

// Admin panel is parked: available only on `npm run dev` (your machine), never on the live site.
// Set to true to bring the Admin Login button back everywhere.
const ADMIN_ENABLED = import.meta.env.DEV;

function readSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// ── App shell ──────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [scheduleRecords, setScheduleRecords] = useState(() => readSavedData("strikeSchedule", INITIAL_SCHEDULE));
  const [bookings, setBookings] = useState(() => readSavedData("strikeBookings", initialBookingsFromSchedule(INITIAL_SCHEDULE)));
  const [isAdmin, setIsAdmin] = useState(() => { if (!ADMIN_ENABLED) return false; try { return sessionStorage.getItem("strikeAdmin") === "yes"; } catch { return false; } });
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navItems = isAdmin ? NAV : VISITOR_NAV;
  const currentPage = navItems.some(n => n.id === page) ? page : "dashboard";
  const Page = PAGES[currentPage];

  const login = () => {
    if (loginPassword !== ADMIN_PASSWORD) { setLoginError("Wrong password."); return; }
    setIsAdmin(true);
    try { sessionStorage.setItem("strikeAdmin", "yes"); } catch {}
    setLoginOpen(false); setLoginPassword(""); setLoginError("");
  };
  const logout = () => {
    setIsAdmin(false);
    setPage("dashboard");
    try { sessionStorage.removeItem("strikeAdmin"); } catch {}
  };

  const updateSchedule = (date, slotId, updates) => {
    const key = `${date}-${slotId}`;
    const slot = SCHEDULE_TIMES[slotId];
    const dateText = dateLabel(date);
    setScheduleRecords(current => {
      const next = { ...current };
      if (updates.status === "Available") delete next[key];
      else next[key] = updates;
      return next;
    });
    setBookings(current => {
      const index = current.findIndex(booking => booking.date === dateText && booking.slot.startsWith(slot.time));
      if (updates.status === "Available") return index < 0 ? current : current.filter((_, itemIndex) => itemIndex !== index);
      const previous = index < 0 ? {} : current[index];
      const paid = Number(updates.paid ?? updates.advance ?? previous.paid ?? previous.advance ?? 0);
      const advance = Number(updates.advance ?? previous.advance ?? 0);
      const booking = {
        ...previous,
        id:previous.id || `BK${Date.now()}${String(slotId).padStart(2, "0")}${date.slice(-2)}`,
        customer:updates.customer ?? previous.customer ?? "",
        phone:updates.phone ?? previous.phone ?? "",
        slot:`${slot.time}–${slot.end}`,
        date:dateText,
        price:slot.price,
        advance,
        paid,
        due:Number(updates.due ?? Math.max(0, slot.price - paid)),
        emp:updates.emp ?? previous.emp ?? "—",
        status:updates.status.toLowerCase(),
      };
      return index < 0 ? [...current, booking] : current.map((item, itemIndex) => itemIndex === index ? booking : item);
    });
  };

  const updateBooking = (id, updates) => {
    const booking = bookings.find(item => item.id === id);
    setBookings(current => current.map(item => item.id === id ? { ...item, ...updates } : item));
    if (!booking) return;
    const [month, day] = booking.date.split(" ");
    const monthNumber = String(new Date(`${month} 1, 2026`).getMonth() + 1).padStart(2, "0");
    const date = `2026-${monthNumber}-${day.padStart(2, "0")}`;
    const slot = SCHEDULE_TIMES.find(item => item.time === booking.slot.slice(0, 5));
    if (!slot) return;
    const key = `${date}-${slot.id}`;
    setScheduleRecords(current => current[key] ? { ...current, [key]: { ...current[key], ...updates } } : current);
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Anton&display=swap";
    document.head.appendChild(link);
    const mobileStyles = document.createElement("style");
    mobileStyles.textContent = `
      * { box-sizing: border-box; }
      html, body, .app-root, .app-root * { cursor: ${footballCursor(false)}, auto; }
      .app-root input, .app-root textarea { cursor: text !important; }
      .app-root button:not(:disabled), .app-root select, .app-root label, .app-root input[type=checkbox], .app-root [style*="cursor: pointer"] { cursor: ${footballCursor(true)}, pointer !important; }
      .cal-day { transition: transform 0.15s ease, filter 0.15s ease; }
      .cal-day.is-sel { filter: drop-shadow(0 0 12px rgba(237,216,200,0.4)); }
      @media (hover: hover) { .cal-day:hover { transform: translateY(-2px); filter: drop-shadow(0 6px 12px rgba(255,70,70,0.4)); } }
      .wd-short { display: none; }
      @media (max-width: 860px) { .wd-full { display: none; } .wd-short { display: inline; } }
      body { margin: 0; }
      @media (max-width: 700px) {
        .app-root { height: 100dvh !important; }
        .app-main { width: 100%; }
        .app-content { padding: 10px 14px !important; }
        .dash-header { gap: 8px !important; margin-bottom: 10px !important; }
        .modal-panel { width: calc(100vw - 24px) !important; padding: 20px !important; max-height: 90dvh !important; }
        .dashboard-panels, .bookings-layout, .earnings-columns { grid-template-columns: 1fr !important; }
        .earnings-summary { grid-template-columns: repeat(2, 1fr) !important; }
        .slot-card { flex-wrap: wrap !important; gap: 10px !important; }
        .slot-card > div:nth-child(1) { min-width: 92px !important; }
        .slot-card > div:nth-child(2) { min-width: 68px !important; }
        .slot-card > div:nth-child(3) { flex: 1 1 calc(100% - 175px) !important; }
        .slot-card > button { margin-left: auto; }
        .live-slot-card, .booking-row { flex-wrap: wrap !important; gap: 10px !important; padding: 14px !important; }
        .live-slot-card > div, .booking-row > div { min-width: 0 !important; }
        .live-slot-card > div:nth-child(2), .booking-row > div:nth-child(2) { flex: 1 1 calc(100% - 100px) !important; }
        .live-slot-card > div:last-child, .booking-row > div:nth-last-child(2) { margin-left: auto; }
        .booking-row > button { flex: 1 1 100%; }
        .date-header { flex-wrap: wrap !important; gap: 12px; }
        .date-header > div:last-child { margin-left: auto; }
        .salary-row { grid-template-columns: 1fr 100px 32px !important; }
        .admin-id { display: none !important; }
        .price-cards { width: 100%; flex-wrap: nowrap !important; gap: 6px !important; }
        .price-card { flex: 1 1 0; min-width: 0; padding: 5px 6px !important; text-align: center !important; }
        .price-card .pc-label { font-size: 8px !important; letter-spacing: 0.5px !important; margin-bottom: 3px !important; line-height: 1.3; }
        .price-card .pc-price { font-size: 16px !important; }
      }
      @media (max-width: 420px) {
        .earnings-summary { grid-template-columns: 1fr !important; }
        .slot-card > div:nth-child(3) { flex-basis: 100% !important; }
        .live-slot-card > div:last-child { flex-basis: 100%; text-align: left !important; }
      }
    `;
    document.head.appendChild(mobileStyles);
  }, []);

  useEffect(() => {
    try { localStorage.removeItem("strikeMyPhone"); } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("strikeSchedule", JSON.stringify(scheduleRecords));
      localStorage.setItem("strikeBookings", JSON.stringify(bookings));
    } catch (error) {
      console.error("Could not save booking data in this browser.", error);
    }
  }, [scheduleRecords, bookings]);

  return (
    <div className="app-root" style={{ fontFamily:F, display:"flex", height:"100vh", background:`radial-gradient(1100px 520px at 12% -8%, rgba(255,90,90,0.18), transparent 62%), radial-gradient(900px 520px at 105% 108%, rgba(255,70,70,0.12), transparent 60%), linear-gradient(180deg, ${C.bg} 0%, #420C0C 100%)`, overflow:"hidden" }}>

      {/* Main */}
      <div className="app-main" style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        {/* Topbar */}
        <div style={{ position:"relative", zIndex:3, height:48, background:"linear-gradient(180deg, rgba(36,5,5,0.96), rgba(50,8,8,0.92))", boxShadow:"0 8px 24px rgba(15,0,0,0.35)", display:"flex", alignItems:"center", padding:"0 26px", gap:16, flexShrink:0 }}>
          <div aria-hidden="true" style={{ position:"absolute", left:0, right:0, bottom:0, height:1, background:"linear-gradient(90deg, transparent, rgba(255,95,95,0.75) 50%, transparent)", boxShadow:"0 0 12px rgba(255,80,80,0.55)" }} />
          <StrikeMark size={28} opacity={0.95} />
          <span style={{ fontFamily:FH, fontSize:"clamp(15px, 2vw, 20px)", color:"#FFFFFF", letterSpacing:1.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>
            {currentPage === "dashboard" ? "Book your slot" : navItems.find(n => n.id === currentPage)?.label}
          </span>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14 }}>
            {isAdmin ? (
              <>
                <div className="admin-id" style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:FH, fontSize:14, color:"#FFFFFF", letterSpacing:1, textTransform:"uppercase" }}>Super Admin</div>
                  <div style={{ fontFamily:F, fontSize:10, color:C.faint, letterSpacing:1, textTransform:"uppercase" }}>Nov 10, 2026</div>
                </div>
                <div style={{ width:38, height:38, background:C.cream, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FH, fontSize:14, color:C.bgDeep, letterSpacing:1 }}>SA</div>
                <button onClick={logout} style={{ fontFamily:FH, fontSize:11, letterSpacing:1, textTransform:"uppercase", padding:"6px 12px", whiteSpace:"nowrap", borderRadius:7, cursor:"pointer", background:"transparent", color:C.muted, border:`1px solid ${C.borderMid}` }}>Log out</button>
              </>
            ) : ADMIN_ENABLED && (
              <button onClick={() => { setLoginPassword(""); setLoginError(""); setLoginOpen(true); }} style={{ fontFamily:FH, fontSize:11, letterSpacing:1, textTransform:"uppercase", padding:"6px 12px", whiteSpace:"nowrap", borderRadius:7, cursor:"pointer", background:"transparent", color:C.muted, border:`1px solid ${C.borderMid}` }}>Admin Login</button>
            )}
          </div>
        </div>

        {navItems.length > 1 && (
          <div style={{ display:"flex", gap:6, padding:"6px 26px", background:"rgba(30,4,4,0.35)", borderBottom:`1px solid ${C.border}`, overflowX:"auto", flexShrink:0 }}>
            {navItems.map(n => {
              const active = currentPage === n.id;
              return (
                <button key={n.id} onClick={() => setPage(n.id)} style={{ fontFamily:FH, fontSize:11, letterSpacing:1, textTransform:"uppercase", padding:"5px 12px", borderRadius:7, cursor:"pointer", whiteSpace:"nowrap", background: active ? `linear-gradient(180deg, ${C.surfaceHigh}, #5E1414)` : "transparent", color: active ? "#FFFFFF" : C.faint, border:`1px solid ${active ? "rgba(255,150,150,0.3)" : "transparent"}`, boxShadow: active ? "0 4px 14px rgba(255,60,60,0.25)" : "none" }}>{n.label}</button>
              );
            })}
          </div>
        )}

        {loginOpen && (
          <Modal title="Admin Login" onClose={() => setLoginOpen(false)}>
            <form onSubmit={e => { e.preventDefault(); login(); }}>
              <Field label="Password"><Input type="password" autoFocus value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }} /></Field>
              {loginError && <div style={{ color:C.red, fontSize:11, marginBottom:12 }}>{loginError}</div>}
              <ModalFooter onCancel={() => setLoginOpen(false)} onConfirm={login} confirmLabel="Log in" />
            </form>
          </Modal>
        )}

        {/* Content */}
        <div className="app-content" style={{ flex:1, overflowY:"auto", padding:"18px 26px", background:"transparent" }}>
          <Page
            bookings={bookings}
            scheduleRecords={scheduleRecords}
            onScheduleChange={updateSchedule}
            onUpdateBooking={updateBooking}
            onNavigate={setPage}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
