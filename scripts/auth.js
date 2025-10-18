(function () {
  const conf = window.__AUTH_CONF__ || {};
  const SALT_HEX = conf.saltHex;
  const ITER = conf.iterations || 200000;
  const DERIVED_B64 = conf.derivedB64;
  const enc = new TextEncoder();

  function hexToBytes(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
  }

  async function deriveB64(username, password) {
    const secret = `${username}:${password}`;
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(secret), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: hexToBytes(SALT_HEX), iterations: ITER, hash: "SHA-256" },
      keyMaterial,
      256
    );
    const hashBytes = new Uint8Array(bits);
    let bin = "";
    hashBytes.forEach(b => bin += String.fromCharCode(b));
    return btoa(bin);
  }

  function now() { return Date.now(); }
  function createRememberToken() {
    const exp = now() + 1000 * 60 * 60 * 24 * 14;
    return btoa(JSON.stringify({ exp }));
  }
  function readRememberToken() {
    try {
      const tok = localStorage.getItem("auth.remember"); if (!tok) return false;
      const { exp } = JSON.parse(atob(tok)); return exp > now();
    } catch (e) { return false; }
  }
  function setSession() { sessionStorage.setItem("auth.session", "ok"); }
  function clearSession() { sessionStorage.removeItem("auth.session"); localStorage.removeItem("auth.remember"); }
  function hasSession() { return sessionStorage.getItem("auth.session") === "ok" || readRememberToken(); }

  window.Auth = {
    hasSession, clearSession,
    async login({ username, password, remember }) {
      const b64 = await deriveB64((username || "").trim(), password || "");
      if (b64 !== DERIVED_B64) return { ok: false, reason: "Ungültige Anmeldedaten." };
      setSession();
      if (remember) localStorage.setItem("auth.remember", createRememberToken());
      return { ok: true };
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("loginOverlay");
    const app = document.getElementById("app");
    const splash = document.getElementById("splash");
    const userEl = document.getElementById("loginUser");
    const passEl = document.getElementById("loginPass");
    const btn = document.getElementById("loginBtn");
    const rem = document.getElementById("rememberMe");
    const err = document.getElementById("loginError");

    async function unlockApp() {
      overlay.classList.remove("active");
      document.body.classList.remove("auth-locked");
      app.classList.add("ready");
      app.setAttribute("aria-hidden", "false");
      if (splash) {
        splash.classList.add("active");
        setTimeout(() => splash.classList.remove("active"), 2800);
      }
      if (typeof loadDashboard === "function") loadDashboard();
    }

    if (window.Auth.hasSession()) { unlockApp(); return; }
    setTimeout(() => userEl?.focus(), 0);

    async function doLogin() {
      err.textContent = ""; btn.disabled = true;
      try {
        const { ok, reason } = await window.Auth.login({ username: userEl.value, password: passEl.value, remember: rem.checked });
        if (!ok) { err.textContent = reason || "Login fehlgeschlagen."; btn.disabled = false; return; }
        await unlockApp();
      } catch (e) {
        err.textContent = "Es gab ein Problem. Bitte erneut versuchen."; btn.disabled = false;
      }
    }
    btn?.addEventListener("click", doLogin);
    passEl?.addEventListener("keydown", ev => { if (ev.key === "Enter") doLogin(); });
  });
})();
