/**
 * WAP Games - Unified Phone & OTP Authentication Modal System
 * Provides 2-Step Phone & 4-Digit OTP verification with Auto-signup & 50 Welcome Tokens.
 */

(function () {
  let activeCallback = null;
  let countdownInterval = null;
  let currentTargetPhone = '';

  const modalHtml = `
  <div id="loginModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
    <div class="relative w-full max-w-md bg-slate-950 border-4 border-arcadeCyan shadow-[8px_8px_0px_rgba(0,240,255,0.4)] p-6 font-retro selection:bg-arcadeCyan selection:text-black">
      
      <!-- Close button -->
      <button type="button" onclick="window.closeLoginModal()" class="absolute top-3 right-3 text-slate-400 hover:text-white p-1.5 text-sm bg-slate-900 border border-slate-700 hover:border-arcadePink transition" title="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Header Title -->
      <div class="text-center mb-5">
        <div class="inline-block px-3 py-1 bg-arcadePink text-white text-[10px] sm:text-xs font-bold shadow-[2px_2px_0px_#9f1239] mb-2">
          <i class="fa-solid fa-gamepad mr-1"></i> PRESS 1P START
        </div>
        <h3 class="text-xl sm:text-2xl font-black text-white tracking-wide">PLAYER AUTHENTICATION</h3>
        <p class="text-xs text-slate-400 font-sans mt-1">
          ফোন নম্বর ও ওটিপি (OTP) দিয়ে এক ক্লিকে লগইন করুন। নতুন গেমাররা পাবেন <strong class="text-arcadeYellow font-retro">৫০ ফ্রি টোকেন কয়েন</strong>!
        </p>
      </div>

      <!-- Alert Toast Inside Modal -->
      <div id="modalAlert" class="hidden mb-4 p-3 text-xs font-sans border-2"></div>

      <!-- Step 1: Phone Input Screen -->
      <div id="modalStepPhone" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">MOBILE NUMBER (মোবাইল নম্বর)</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 text-xs font-mono select-none">
              <span>🇧🇩 +88</span>
            </div>
            <input type="tel" id="modalPhoneInput" maxlength="11" placeholder="01711002233"
                   class="w-full pl-20 pr-4 py-3 bg-slate-900 border-2 border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-arcadeCyan font-mono">
          </div>
          <p class="text-[10px] text-slate-400 mt-1 font-sans">GP, Robi, Banglalink, Teletalk বা Airtel এর ১১ ডিজিট নম্বর লিখুন</p>
        </div>

        <button type="button" onclick="window.handleModalSendOtp()" id="btnModalSendOtp" class="btn-arcade-cyan w-full py-3 text-xs sm:text-sm font-black tracking-wider flex items-center justify-center gap-2">
          <span>GET OTP CODE (ওটিপি পাঠান)</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>

        <!-- Quick 1-Click Test Numbers -->
        <div class="pt-3 border-t border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase text-center mb-2">QUICK TEST PLAYERS (১-ক্লিক)</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button type="button" onclick="window.fillModalTestPhone('01711002233')" class="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left hover:border-arcadeCyan transition">
              <div class="text-arcadeCyan font-bold text-[11px]">Tanvir (2D Pro)</div>
              <div class="text-[10px] text-slate-400 font-mono">01711002233</div>
            </button>
            <button type="button" onclick="window.fillModalTestPhone('01822334455')" class="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left hover:border-arcadePink transition">
              <div class="text-arcadePink font-bold text-[11px]">Sabbir (VIP Pass)</div>
              <div class="text-[10px] text-slate-400 font-mono">01822334455</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: OTP Verification Screen -->
      <div id="modalStepOtp" class="space-y-4 hidden">
        <!-- Simulated OTP Notice Box -->
        <div id="otpSimulatorNotice" class="p-3 bg-arcadeYellow/10 border-2 border-arcadeYellow text-arcadeYellow text-xs font-sans">
          <div class="font-bold font-retro text-[10px] sm:text-[11px] flex items-center justify-between gap-1.5 mb-1 text-white">
            <span class="flex items-center gap-1"><i class="fa-solid fa-comment-sms text-arcadeYellow"></i> SMS OTP SIMULATOR:</span>
            <span class="text-[10px] text-arcadeGreen font-mono">LIVE READY</span>
          </div>
          <div class="flex items-center justify-between gap-2 mt-1">
            <span class="text-slate-200">আপনার ওটিপি কোড:</span>
            <button type="button" onclick="window.autoFillOtpFromNotice()" title="Click to auto-fill" class="font-mono text-base font-black text-slate-950 bg-arcadeYellow px-2.5 py-0.5 border border-yellow-300 hover:bg-yellow-300 cursor-pointer flex items-center gap-1 shadow-[2px_2px_0px_#000]">
              <span id="displayOtpCode">----</span>
              <i class="fa-solid fa-copy text-[10px]"></i>
            </button>
          </div>
          <div class="text-[10px] text-slate-400 mt-1 font-sans">টেস্টিং সার্বজনীন কোড: <strong class="text-white font-mono">1234</strong> (অথবা উপরের কোডে ক্লিক করুন)</div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-slate-300">ENTER 4-DIGIT OTP</label>
            <span class="text-xs text-arcadeCyan font-mono" id="targetPhoneDisplay">017XXXXXXXX</span>
          </div>

          <!-- 4 Separate Digit Boxes -->
          <div class="flex justify-center gap-2 sm:gap-3 my-2" id="otpBoxesContainer">
            <input type="text" inputmode="numeric" maxlength="1" id="otpDigit1" class="w-12 h-14 bg-slate-900 border-2 border-slate-700 text-center text-2xl font-bold font-mono text-arcadeCyan focus:outline-none focus:border-arcadeCyan" oninput="window.otpDigitInput(1)" onkeydown="window.otpDigitKeydown(event, 1)">
            <input type="text" inputmode="numeric" maxlength="1" id="otpDigit2" class="w-12 h-14 bg-slate-900 border-2 border-slate-700 text-center text-2xl font-bold font-mono text-arcadeCyan focus:outline-none focus:border-arcadeCyan" oninput="window.otpDigitInput(2)" onkeydown="window.otpDigitKeydown(event, 2)">
            <input type="text" inputmode="numeric" maxlength="1" id="otpDigit3" class="w-12 h-14 bg-slate-900 border-2 border-slate-700 text-center text-2xl font-bold font-mono text-arcadeCyan focus:outline-none focus:border-arcadeCyan" oninput="window.otpDigitInput(3)" onkeydown="window.otpDigitKeydown(event, 3)">
            <input type="text" inputmode="numeric" maxlength="1" id="otpDigit4" class="w-12 h-14 bg-slate-900 border-2 border-slate-700 text-center text-2xl font-bold font-mono text-arcadeCyan focus:outline-none focus:border-arcadeCyan" oninput="window.otpDigitInput(4)" onkeydown="window.otpDigitKeydown(event, 4)">
          </div>

          <div class="flex items-center justify-between text-xs mt-2 font-sans">
            <span class="text-slate-400" id="otpTimerText">Resend in <strong class="text-white font-mono" id="otpCountdown">45s</strong></span>
            <button type="button" id="btnResendOtp" onclick="window.handleModalResendOtp()" class="text-arcadeCyan hover:underline font-bold disabled:opacity-40 disabled:cursor-not-allowed" disabled>
              Resend OTP
            </button>
          </div>
        </div>

        <!-- Optional Gamer Name for New Players -->
        <div id="newPlayerNameField" class="hidden pt-2 border-t border-slate-800">
          <label class="block text-xs font-bold text-arcadeYellow mb-1">CHOOSE GAMER NAME (গেমার নাম)</label>
          <input type="text" id="modalGamerName" placeholder="e.g. CyberNinja"
                 class="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-arcadeCyan font-retro">
          <p class="text-[10px] text-arcadeGreen mt-1 font-sans">🎉 নতুন সাইন আপে সাথে সাথে পাবেন ৫০ টোকেন বোনাস!</p>
        </div>

        <button type="button" onclick="window.handleModalVerifyOtp()" id="btnModalVerifyOtp" class="btn-arcade-pink w-full py-3 text-xs sm:text-sm font-black tracking-wider flex items-center justify-center gap-2">
          <i class="fa-solid fa-circle-check"></i>
          <span>VERIFY & ENTER ARCADE</span>
        </button>

        <div class="text-center pt-1">
          <button type="button" onclick="window.backToPhoneStep()" class="text-[11px] text-slate-400 hover:text-white underline">
            ← Change Mobile Number
          </button>
        </div>
      </div>

    </div>
  </div>
  `;

  function ensureModalMounted() {
    if (!document.getElementById('loginModal')) {
      const div = document.createElement('div');
      div.innerHTML = modalHtml;
      document.body.appendChild(div.firstElementChild);

      // Listen for paste on OTP digits container
      const container = document.getElementById('otpBoxesContainer');
      if (container) {
        container.addEventListener('paste', (e) => {
          e.preventDefault();
          const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
          if (pasted && /^\d{4}$/.test(pasted)) {
            for (let i = 1; i <= 4; i++) {
              document.getElementById('otpDigit' + i).value = pasted[i - 1];
            }
            window.handleModalVerifyOtp();
          }
        });
      }
    }
  }

  function showModalAlert(message, type = 'error') {
    const el = document.getElementById('modalAlert');
    if (!el) return;
    el.classList.remove('hidden', 'bg-red-950', 'text-red-300', 'border-red-600', 'bg-emerald-950', 'text-emerald-300', 'border-emerald-600');
    if (type === 'error') {
      el.classList.add('bg-red-950', 'text-red-300', 'border-red-600');
    } else {
      el.classList.add('bg-emerald-950', 'text-emerald-300', 'border-emerald-600');
    }
    el.innerText = message;
  }

  function hideModalAlert() {
    const el = document.getElementById('modalAlert');
    if (el) el.classList.add('hidden');
  }

  window.openLoginModal = function (callback = null) {
    ensureModalMounted();
    activeCallback = callback;
    hideModalAlert();

    const user = window.wapDB ? window.wapDB.getCurrentUser() : null;
    if (user) {
      if (confirm(`You are currently logged in as ${user.name} (${user.tokens || 0}🪙).\n\nDo you want to switch account or log out?`)) {
        window.wapDB.logout();
        if (typeof renderNavUser === 'function') renderNavUser();
        if (typeof renderUserData === 'function') renderUserData();
      } else {
        return;
      }
    }

    // Reset step
    document.getElementById('modalStepPhone').classList.remove('hidden');
    document.getElementById('modalStepOtp').classList.add('hidden');
    document.getElementById('modalPhoneInput').value = '';
    document.getElementById('newPlayerNameField').classList.add('hidden');

    const modal = document.getElementById('loginModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
      document.getElementById('modalPhoneInput').focus();
    }, 100);
  };

  window.closeLoginModal = function () {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  window.fillModalTestPhone = function (phone) {
    const inp = document.getElementById('modalPhoneInput');
    if (inp) {
      inp.value = phone;
      window.handleModalSendOtp();
    }
  };

  window.backToPhoneStep = function () {
    hideModalAlert();
    document.getElementById('modalStepPhone').classList.remove('hidden');
    document.getElementById('modalStepOtp').classList.add('hidden');
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    document.getElementById('modalPhoneInput').focus();
  };

  window.handleModalSendOtp = function () {
    hideModalAlert();
    const phoneInput = document.getElementById('modalPhoneInput');
    const phone = phoneInput.value.trim();

    if (!window.wapDB) {
      showModalAlert('Database store unavailable. Please reload the page.');
      return;
    }

    const res = window.wapDB.sendOtp(phone);
    if (!res.success) {
      showModalAlert(res.message, 'error');
      return;
    }

    currentTargetPhone = res.phone;
    document.getElementById('targetPhoneDisplay').innerText = res.phone;
    document.getElementById('displayOtpCode').innerText = res.otp;

    // Show or hide new player name field
    const nameField = document.getElementById('newPlayerNameField');
    if (res.isExisting) {
      nameField.classList.add('hidden');
    } else {
      nameField.classList.remove('hidden');
    }

    // Switch step
    document.getElementById('modalStepPhone').classList.add('hidden');
    document.getElementById('modalStepOtp').classList.remove('hidden');

    // Clear OTP digit inputs
    for (let i = 1; i <= 4; i++) {
      const box = document.getElementById('otpDigit' + i);
      if (box) box.value = '';
    }

    // Focus 1st digit box
    setTimeout(() => {
      const d1 = document.getElementById('otpDigit1');
      if (d1) d1.focus();
    }, 100);

    // Start 45s countdown
    startOtpCountdown(45);
  };

  window.handleModalResendOtp = function () {
    if (!currentTargetPhone) return;
    const res = window.wapDB.sendOtp(currentTargetPhone);
    if (res.success) {
      document.getElementById('displayOtpCode').innerText = res.otp;
      showModalAlert(`নতুন ওটিপি কোড পাঠানো হয়েছে: ${res.otp}`, 'success');
      startOtpCountdown(45);
    }
  };

  function startOtpCountdown(seconds) {
    if (countdownInterval) clearInterval(countdownInterval);
    let remaining = seconds;
    const countdownEl = document.getElementById('otpCountdown');
    const resendBtn = document.getElementById('btnResendOtp');
    const timerText = document.getElementById('otpTimerText');

    resendBtn.disabled = true;
    timerText.style.display = 'inline';
    countdownEl.innerText = `${remaining}s`;

    countdownInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        resendBtn.disabled = false;
        timerText.style.display = 'none';
      } else {
        countdownEl.innerText = `${remaining}s`;
      }
    }, 1000);
  }

  window.autoFillOtpFromNotice = function () {
    const code = document.getElementById('displayOtpCode').innerText.trim();
    if (code && code !== '----') {
      for (let i = 1; i <= 4; i++) {
        const box = document.getElementById('otpDigit' + i);
        if (box) box.value = code[i - 1] || '';
      }
      setTimeout(() => {
        window.handleModalVerifyOtp();
      }, 200);
    }
  };

  window.otpDigitInput = function (index) {
    const cur = document.getElementById('otpDigit' + index);
    if (cur.value.length >= 1) {
      cur.value = cur.value.slice(-1);
      if (index < 4) {
        const next = document.getElementById('otpDigit' + (index + 1));
        if (next) next.focus();
      } else {
        // Automatically submit if 4th digit entered
        setTimeout(() => {
          window.handleModalVerifyOtp();
        }, 150);
      }
    }
  };

  window.otpDigitKeydown = function (e, index) {
    if (e.key === 'Backspace') {
      const cur = document.getElementById('otpDigit' + index);
      if (!cur.value && index > 1) {
        const prev = document.getElementById('otpDigit' + (index - 1));
        if (prev) {
          prev.focus();
          prev.value = '';
        }
      }
    } else if (e.key === 'Enter') {
      window.handleModalVerifyOtp();
    }
  };

  window.handleModalVerifyOtp = function () {
    hideModalAlert();
    let otp = '';
    for (let i = 1; i <= 4; i++) {
      const box = document.getElementById('otpDigit' + i);
      if (box) otp += box.value.trim();
    }

    if (otp.length < 4) {
      showModalAlert('দয়া করে ৪-ডিজিটের পূর্ণ OTP কোড দিন।', 'error');
      return;
    }

    const gamerName = (document.getElementById('modalGamerName')?.value || '').trim();
    const res = window.wapDB.verifyOtp(currentTargetPhone, otp, gamerName);

    if (!res.success) {
      showModalAlert(res.message, 'error');
      return;
    }

    // Success!
    showModalAlert(res.message, 'success');

    setTimeout(() => {
      window.closeLoginModal();

      // Trigger reactive UI re-renders if available
      if (typeof window.renderNavUser === 'function') {
        window.renderNavUser();
      }
      if (typeof window.renderUserData === 'function') {
        window.renderUserData();
      }
      if (typeof window.checkUserAndGame === 'function') {
        window.checkUserAndGame();
      }
      if (typeof window.renderProfile === 'function') {
        window.currentUser = res.player;
        window.renderProfile();
      }

      // Execute custom callback if passed
      if (typeof activeCallback === 'function') {
        activeCallback(res.player);
        activeCallback = null;
      }
    }, 600);
  };

  // Mount modal when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureModalMounted);
  } else {
    ensureModalMounted();
  }
})();
