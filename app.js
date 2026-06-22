/* =========================================================
   SoulSensei lead form -> Google Sheet
   ---------------------------------------------------------
   1. Deploy google-apps-script.gs as a Web App (see README.md)
   2. Paste the deployment /exec URL below.
   ========================================================= */
var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyqIRJSbufUEhcczdDGCJM7EjZRVGkwBm2o6xIFEaeGcA5tVCih4Op8BbVb6Tqv3grwUA/exec";

(function () {
  var form = document.getElementById("leadForm");
  if (!form) return;

  var btn = document.getElementById("submitBtn");

  function setInvalid(name, invalid) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (wrap) wrap.classList.toggle("invalid", invalid);
  }

  function validate(data) {
    var ok = true;
    if (!data.name || data.name.trim().length < 2) { setInvalid("name", true); ok = false; }
    else setInvalid("name", false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setInvalid("email", true); ok = false; }
    else setInvalid("email", false);

    var digits = (data.phone || "").replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) { setInvalid("phone", true); ok = false; }
    else setInvalid("phone", false);

    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim()
    };

    if (!validate(data)) return;

    btn.disabled = true;
    var originalLabel = btn.textContent;
    btn.textContent = "Reserving…";

    var payload = new FormData();
    payload.append("name", data.name);
    payload.append("email", data.email);
    payload.append("phone", data.phone);
    payload.append("source", "free-workshops-form");

    var done = function () { window.location.href = "thankyou.html"; };

    if (!SHEET_ENDPOINT || SHEET_ENDPOINT.indexOf("PASTE_YOUR") === 0) {
      // Endpoint not configured yet — log and continue so the flow is testable.
      console.warn("SHEET_ENDPOINT is not set in app.js. Skipping save.", data);
      done();
      return;
    }

    // Simple request (FormData -> no preflight). no-cors avoids Apps Script
    // redirect/CORS read issues; the row is still written server-side.
    fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: payload })
      .then(done)
      .catch(function (err) {
        console.error("Submit failed:", err);
        btn.disabled = false;
        btn.textContent = originalLabel;
        alert("Something went wrong. Please try again.");
      });
  });
})();
