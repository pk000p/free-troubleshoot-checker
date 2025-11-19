// Adsterra Ads Configuration (Apne real keys replace karo)
const adConfigs = {
  header: { key: 'YOUR_HEADER_AD_KEY_HERE', format: 'iframe', height: 90, width: 728 }, // Sticky Header
  footer: { key: 'YOUR_FOOTER_AD_KEY_HERE', format: 'iframe', height: 90, width: 728 }, // Sticky Footer
  normal1: { key: 'YOUR_NORMAL_AD1_KEY_HERE', format: 'iframe', height: 250, width: 300 }, // Normal 1
  normal2: { key: 'YOUR_NORMAL_AD2_KEY_HERE', format: 'iframe', height: 250, width: 300 }  // Normal 2
};

// Function to load Adsterra Ad
function loadAd(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container || container.firstChild) return; // Avoid duplicates

  const conf = document.createElement('script');
  const script = document.createElement('script');
  
  conf.innerHTML = `var ${containerId}Options = ${JSON.stringify(config)};`;
  script.type = 'text/javascript';
  script.src = `//www.profitabledisplayformat.com/${config.key}/invoke.js`; // Adsterra endpoint (standard)
  
  container.appendChild(conf);
  container.appendChild(script);
}

// Load all ads on page load
document.addEventListener('DOMContentLoaded', function() {
  loadAd('header-ad', adConfigs.header);
  loadAd('footer-ad', adConfigs.footer);
  loadAd('normal-ad-1', adConfigs.normal1);
  loadAd('normal-ad-2', adConfigs.normal2);
});

// Original checkProject function (same as before)
async function checkProject() {
  const url = document.getElementById("url").value.trim();
  const result = document.getElementById("result");
  const loading = document.getElementById("loading");
  result.innerHTML = "";
  loading.classList.remove("hidden");

  if (!url) {
    showResult("Error: URL daal bhai!", "error");
    return;
  }

  try {
    // 1. Site live hai ya nahi?
    const res = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url), {
      method: "GET",
      headers: { "Accept": "text/html" }
    });

    if (res.status === 200) {
      showResult("Site live hai (200 OK)", "success");

      // 2. Vercel project name nikaal lo
      const domain = new URL(url).hostname;
      let projectName = domain.split('.')[0];

      // Agar vercel.app nahi hai to custom domain ho sakta hai
      if (!domain.includes("vercel.app")) {
        showResult("Warning: Custom domain detect hua. Logs ke liye Vercel URL chahiye (ex: project.vercel.app)", "warning");
      }

      // 3. Vercel logs try karo (public deployments ke liye kaam karta hai)
      const logUrl = `https://${projectName}.vercel.app/api/logs`;
      const logRes = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(logUrl));
      
      if (logRes.ok) {
        const logs = await logRes.text();
        if (logs.includes("Error") || logs.includes("Failed")) {
          showResult("Deployment Logs:\n\n" + logs.substring(0, 1000), "error");
        } else {
          showResult("Build successful lag rahi hai!\n\nAgar phir bhi kaam nahi kar rahi to:\n• Console kholo (F12)\n• .env variables check karo\n• API routes sahi hain?", "success");
        }
      } else {
        // Alternative: Common issues
        showResult(`Common Problems:\n
1. .env file Vercel mein add nahi kiya
2. Build command galat hai (ex: npm run build nahi chal raha)
3. API route mein error aa raha (console check karo)
4. CORS issue (backend allow nahi kar raha)

Mobile se console dekhne ke liye:
Chrome → Menu → Developer Tools → Remote Debugging use karo`, "warning");
      }

    } else {
      showResult(`Site down hai! Status: ${res.status}\n\nPossible Reasons:
• Build fail hua
• Project delete ho gaya
• Wrong URL daala`, "error");
    }
  } catch (err) {
    showResult("Kuch network issue hai ya CORS block kar raha hai.\n\nTip: Mobile Chrome mein 'vconsole' extension use karo logs dekhne ke liye", "error");
  }

  loading.classList.add("hidden");
}

function showResult(text, type) {
  const div = document.getElementById("result");
  div.textContent = text;
  div.className = type;
  div.style.display = "block";
}
