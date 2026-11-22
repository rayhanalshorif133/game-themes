/**
 * WAP Games Admin Console - Unified Navigation & Layout Engine
 * Ensures synchronized categorized sidebar navigation across all admin pages.
 */

(function () {
  const MENU_SECTIONS = [
    {
      title: 'OVERVIEW',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high', href: 'index.html', color: 'text-arcadeCyan' }
      ]
    },
    {
      title: 'GAME CENTER',
      items: [
        { key: 'games', label: 'Games Management', icon: 'fa-gamepad', href: 'games.html', color: 'text-arcadeGreen' },
        { key: 'scores-audit', label: 'Scores Audit', icon: 'fa-shield-virus', href: 'scores-audit.html', color: 'text-arcadeYellow' },
        { key: 'play-activity', label: 'Play Activity', icon: 'fa-wave-square', href: 'play-activity.html', color: 'text-arcadeCyan' },
        { key: 'feedback', label: 'Player Feedbacks', icon: 'fa-comments', href: 'feedback.html', color: 'text-arcadePink' }
      ]
    },
    {
      title: 'TOURNAMENTS',
      items: [
        { key: 'campaigns', label: 'Campaigns', icon: 'fa-trophy', href: 'tournaments.html', color: 'text-arcadeYellow' },
        { key: 'live-leaderboard', label: 'Live Leaderboard', icon: 'fa-ranking-star', href: 'live-leaderboard.html', color: 'text-arcadePink' },
        { key: 'winner-payments', label: 'Winner Payments', icon: 'fa-money-bill-transfer', href: 'winner-payments.html', color: 'text-arcadeGreen' }
      ]
    },
    {
      title: 'USERS & FINANCE',
      items: [
        { key: 'users-roles', label: 'Users & Roles', icon: 'fa-user-shield', href: 'users-roles.html', color: 'text-arcadeCyan' },
        { key: 'revenue-expense', label: 'Revenue & Expense', icon: 'fa-chart-pie', href: 'revenue-expense.html', color: 'text-arcadeYellow' },
        { key: 'subscriptions', label: 'Subscriptions', icon: 'fa-credit-card', href: 'subscriptions.html', color: 'text-pink-400' },
        { key: 'carrier-charges', label: 'Carrier Charge Logs', icon: 'fa-sim-card', href: 'carrier-charges.html', color: 'text-arcadeGreen' }
      ]
    },
    {
      title: 'TRAFFIC',
      items: [
        { key: 'traffic-logs', label: 'Traffic Logs', icon: 'fa-chart-line', href: 'traffic-logs.html', color: 'text-arcadeCyan' }
      ]
    },
    {
      title: 'MARKETING',
      items: [
        { key: 'sms-campaigns', label: 'SMS Campaigns', icon: 'fa-bullhorn', href: 'sms.html', color: 'text-arcadePink' },
        { key: 'numbers-groups', label: 'Numbers / Groups', icon: 'fa-address-book', href: 'numbers-groups.html', color: 'text-arcadeYellow' },
        { key: 'user-tracking', label: 'User Tracking', icon: 'fa-crosshairs', href: 'user-tracking.html', color: 'text-arcadeGreen' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { key: 'settings', label: 'System Settings', icon: 'fa-sliders', href: 'settings.html', color: 'text-slate-300' }
      ]
    }
  ];

  window.initAdminNavigation = function (activeKey) {
    // Generate sidebar navigation markup
    let navHtml = '';
    MENU_SECTIONS.forEach(sec => {
      navHtml += `
        <div class="pt-3 first:pt-0">
          <div class="px-3 pb-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-retro">${sec.title}</div>
          <div class="space-y-0.5">
      `;

      sec.items.forEach(item => {
        const isActive = (item.key === activeKey);
        const activeClass = isActive
          ? 'btn-arcade-cyan text-slate-950 font-bold shadow-[2px_2px_0px_#0284c7]'
          : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800';

        navHtml += `
          <a href="${item.href}" class="flex items-center gap-2.5 px-3 py-2 text-xs transition font-retro ${activeClass}">
            <i class="fa-solid ${item.icon} w-4 text-center ${isActive ? 'text-slate-950' : item.color}"></i>
            <span>${item.label}</span>
          </a>
        `;
      });

      navHtml += `
          </div>
        </div>
      `;
    });

    // Inject into desktop sidebar if element exists
    const desktopNav = document.getElementById('adminSidebarNav');
    if (desktopNav) {
      desktopNav.innerHTML = navHtml;
    }

    // Inject into mobile drawer if exists
    const mobileNav = document.getElementById('adminMobileNav');
    if (mobileNav) {
      mobileNav.innerHTML = navHtml;
    }
  };

  window.toggleMobileSidebar = function () {
    const overlay = document.getElementById('mobileSidebarOverlay');
    const drawer = document.getElementById('mobileSidebar');
    if (overlay && drawer) {
      const isHidden = overlay.classList.contains('hidden');
      if (isHidden) {
        overlay.classList.remove('hidden');
        drawer.classList.remove('-translate-x-full');
      } else {
        overlay.classList.add('hidden');
        drawer.classList.add('-translate-x-full');
      }
    }
  };

  // Auto initialize on DOM load if active page attribute is set
  document.addEventListener('DOMContentLoaded', () => {
    const activePage = document.body.getAttribute('data-admin-page');
    if (activePage) {
      window.initAdminNavigation(activePage);
    }
  });
})();
