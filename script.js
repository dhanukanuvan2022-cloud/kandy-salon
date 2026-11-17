/* ===== EDIT THESE DETAILS ===== */
const CONFIG = {
  whatsapp: "94766691125",           // WhatsApp number, country code first, no + or 0 (0766 691 125 -> 94766691125)
  phones: ["0812 121 221", "0766 691 125", "0769 661 125", "0777 851 341"], // numbers from the signboard - please verify
  facebook: "https://www.facebook.com/kkandysalon",
  mapsLink: "https://maps.app.goo.gl/8ox2HJeyP2fJKVFq8",
  lat: 7.275984, lng: 80.6136972,
  hoursText: "Open daily · call to confirm opening hours",
  openHour: 9, closeHour: 19, slotMinutes: 60   // booking time slots
};

/* Paste real Google Maps reviews here, e.g.
   { name: "Customer Name", stars: 5, text: "Review text..." }  */
const REVIEWS = [
  // { name: "Customer Name", stars: 5, text: "Paste a real review from Google Maps here." },
];
/* ================================= */

const $ = id => document.getElementById(id);

// Gallery
const grid = $("grid");
for (let i = 1; i <= 18; i++) {
  const n = String(i).padStart(2, "0");
  const img = new Image();
  img.src = `img/g${n}.jpg`; img.loading = "lazy"; img.alt = "Kandy Salon hair work " + i;
  img.onclick = () => { const lb = $("lb"); lb.firstElementChild.src = img.src; lb.classList.add("on"); };
  grid.appendChild(img);
}

// Reviews (shows only real reviews you add; otherwise a Google Maps prompt)
const box = $("revBox");
if (REVIEWS.length) {
  box.innerHTML = REVIEWS.map(r => `<article class="card rv"><div class="stars">${"★".repeat(r.stars || 5)}</div><p>${r.text}</p><b>– ${r.name}</b></article>`).join("");
} else {
  box.innerHTML = `<article class="card rv" style="grid-column:1/-1;text-align:center"><div class="stars">★★★★★</div><p>See what our customers say about Kandy Salon on Google Maps.</p></article>`;
}
$("allRev").href = CONFIG.mapsLink;

// Contact + links
$("phones").innerHTML = CONFIG.phones.map(p => `<a href="tel:${p.replace(/\s/g, "")}">${p}</a>`).join(" · ");
$("hours").textContent = CONFIG.hoursText;
$("dir").href = $("map2").href = CONFIG.mapsLink;
$("fb").href = $("fb2").href = CONFIG.facebook;
$("map").src = `https://maps.google.com/maps?q=${CONFIG.lat},${CONFIG.lng}&z=16&output=embed`;
$("waFloat").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hello Kandy Salon, I'd like to make an appointment.")}`;
$("yr").textContent = new Date().getFullYear();

// Booking form
const dateEl = $("date"), timeEl = $("time");
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
dateEl.min = iso(new Date());

const fmt = m => { const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0"); return `${(h % 12) || 12}:${mm} ${h < 12 ? "AM" : "PM"}`; };
function fillTimes() {
  const now = new Date(), today = dateEl.value === iso(now);
  let html = `<option value="">Choose a time…</option>`;
  for (let m = CONFIG.openHour * 60; m < CONFIG.closeHour * 60; m += CONFIG.slotMinutes) {
    if (today && m <= now.getHours() * 60 + now.getMinutes()) continue;
    html += `<option>${fmt(m)}</option>`;
  }
  timeEl.innerHTML = html;
}
dateEl.addEventListener("change", fillTimes); fillTimes();

$("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("name").value.trim(), service = $("service").value, date = dateEl.value, time = timeEl.value;
  if (!name || !service || !date || !time) { $("err").textContent = "Please fill in your name, service, date and time."; return; }
  $("err").textContent = "";
  const nice = new Date(date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const notes = $("notes").value.trim();
  const msg = `Hello Kandy Salon! I'd like to book an appointment.\n\n` +
    `Name: ${name}\nService: ${service}\nDate: ${nice}\nTime: ${time}` + (notes ? `\nNotes: ${notes}` : "") +
    `\n\nPlease confirm. Thank you!`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
});

document.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("open")));
