// Adsterra Ads (Apne real keys daal dena)
const adKeys = {
  header: 'YOUR_HEADER_KEY',
  footer: 'YOUR_FOOTER_KEY',
  normal1: 'YOUR_NORMAL1_KEY',
  normal2: 'YOUR_NORMAL2_KEY'
};

function loadAd(id, key) {
  if (!key.includes('YOUR_')) return;
  const s = document.createElement('script');
  s.src = `//www.profitabledisplayformat.com/${key}/invoke.js`;
  document.getElementById(id).appendChild(s);
}
window.onload = () => {
  loadAd('header-ad', adKeys.header);
  loadAd('footer-ad', adKeys.footer);
  loadAd('normal-ad-1', adKeys.normal1);
  loadAd('normal-ad-2', adKeys.normal2);
};

async function checkProject() {
  const url = document.getElementById("url").value.trim();
  const result = document.getElementById("result");
  const loading = document.getElementById("loading");
  result.style.display = "none";
  loading.classList.remove("hidden");

  if (!url || !url.includes('vercel.app')) {
    showResult("Galat URL! Vercel link daalo → https://project.vercel.app", "error");
    loading.classList.add("hidden");
    return;
  }

  try {
    const res = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url));
    if (res.status === 200) {
      showResult(`Site LIVE hai (200 OK)

Agar phir bhi kaam nahi kar rahi to mobile pe neeche "Console" button dabao → sab errors khud dekh lo!

Common Problems:
• .env variables Vercel mein add nahi kiye
• API route fail ho raha (404/500)
• CORS block kar raha
• JavaScript error aa raha (red color mein dikhega)`, "success");
    } else {
      showResult(`Site DOWN hai! Status: ${res.status}

Possible Reasons:
• Build fail ho gaya
• Project delete ho gaya
• Wrong URL daala`, "error");
    }
  } catch (err) {
    showResult(`Network/CORS issue hai

Mobile pe "Console" button dabao → Network tab mein failed requests dekh lo`, "error");
  }
  loading.classList.add("hidden");
}

function showResult(text, type) {
  const div = document.getElementById("result");
  div.textContent = text;
  div.className = type;
  div.style.display = "block";
}
