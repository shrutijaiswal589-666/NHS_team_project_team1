"use client";
import React, { useEffect } from "react";

export default function RegionalTrend() {
  useEffect(() => {
    // Dynamically load Tailwind CDN and custom config for this specific page
    const scriptId = "tailwind-cdn-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
      script.async = true;
      script.onload = () => {
        if (window.tailwind) {
          window.tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "surface-variant": "#d7e4f0",
                  "secondary-fixed": "#dfe3e4",
                  "on-primary-fixed-variant": "#00468c",
                  "secondary-fixed-dim": "#c3c7c8",
                  "on-surface": "#111d25",
                  "inverse-primary": "#a9c7ff",
                  "error": "#ba1a1a",
                  "on-background": "#111d25",
                  "tertiary-fixed": "#ffdbcb",
                  "primary-fixed": "#d6e3ff",
                  "on-tertiary": "#ffffff",
                  "on-tertiary-fixed": "#341100",
                  "secondary": "#5a5f60",
                  "surface": "#f6faff",
                  "primary": "#00478d",
                  "on-secondary": "#ffffff",
                  "surface-container-high": "#ddeaf6",
                  "on-secondary-container": "#5f6364",
                  "surface-container-low": "#ebf5ff",
                  "surface-container-lowest": "#ffffff",
                  "on-error": "#ffffff",
                  "error-container": "#ffdad6",
                  "primary-container": "#005eb8",
                  "surface-container": "#e3effc",
                  "surface-bright": "#f6faff",
                  "tertiary-container": "#9f4300",
                  "on-primary": "#ffffff",
                  "on-tertiary-container": "#ffcfb9",
                  "on-primary-fixed": "#001b3d",
                  "inverse-surface": "#26323b",
                  "on-tertiary-fixed-variant": "#793100",
                  "secondary-container": "#dce0e1",
                  "on-primary-container": "#c8daff",
                  "inverse-on-surface": "#e6f2ff",
                  "tertiary": "#793100",
                  "on-secondary-fixed": "#181c1d",
                  "background": "#f6faff",
                  "surface-dim": "#cfdce8",
                  "on-surface-variant": "#424752",
                  "on-error-container": "#93000a",
                  "outline-variant": "#c2c6d4",
                  "outline": "#727783",
                  "tertiary-fixed-dim": "#ffb691",
                  "surface-tint": "#005db6",
                  "surface-container-highest": "#d7e4f0",
                  "primary-fixed-dim": "#a9c7ff",
                  "on-secondary-fixed-variant": "#434849"
                },
                borderRadius: {
                  DEFAULT: "0.25rem",
                  lg: "0.5rem",
                  xl: "0.75rem",
                  full: "9999px"
                },
                spacing: {
                  sm: "8px",
                  base: "4px",
                  xs: "4px",
                  "margin-mobile": "16px",
                  "margin-desktop": "48px",
                  gutter: "24px",
                  md: "16px",
                  lg: "24px",
                  xl: "32px"
                },
                fontFamily: {
                  "headline-sm": ["Public Sans"],
                  "body-sm": ["Public Sans"],
                  "label-sm": ["Public Sans"],
                  "body-md": ["Public Sans"],
                  "headline-xl": ["Public Sans"],
                  "body-lg": ["Public Sans"],
                  "headline-md": ["Public Sans"],
                  "headline-lg-mobile": ["Public Sans"],
                  "headline-lg": ["Public Sans"],
                  "data-display": ["Public Sans"],
                  "label-md": ["Public Sans"]
                },
                fontSize: {
                  "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
                  "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
                  "label-sm": ["12px", { lineHeight: "14px", fontWeight: "600" }],
                  "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                  "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
                  "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                  "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                  "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
                  "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
                  "data-display": ["48px", { lineHeight: "48px", fontWeight: "700" }],
                  "label-md": ["14px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }]
                }
              }
            }
          };
        }
      };
      document.head.appendChild(script);
    }

    // Load necessary fonts
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }, []);

  return (
    // The "fixed inset-0 z-[100]" trick overlays this full-screen app right over top of our old layout!
    <div 
      className="fixed inset-0 z-[100] bg-background text-on-surface font-body-md h-screen overflow-hidden flex flex-col md:flex-row antialiased"
      style={{ backgroundColor: "#f6faff" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* Ambient shadow for level 1 cards */
        .card-shadow { box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05); }
        .gauge-bg { background: linear-gradient(to right, #005eb8 84%, #ebf5ff 84%); }
        .doughnut-chart {
            background: conic-gradient(
                #00478d 0% 40%, 
                #005eb8 40% 75%, 
                #5a5f60 75% 90%, 
                #c3c7c8 90% 100%
            );
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .doughnut-hole {
            background-color: #ffffff;
            border-radius: 50%;
            width: 70%;
            height: 70%;
        }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        .animated-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 1.5s ease-out forwards;
        }
      `}} />

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden md:flex flex-col h-full py-lg px-md gap-sm bg-surface-container-low w-64 border-r border-surface-variant flex-shrink-0 z-20">
        <div className="flex items-center gap-sm mb-lg px-sm">
          <img alt="NHS Trust Logo" className="w-10 h-10 rounded-sm object-cover bg-white" data-alt="NHS Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8gTdY4Eh_QYtsrD5-kozs9poCQZWP3BjoK2QTuIHXT5isUW_JcsT5P3GIoiVnf6hGzSwx0qV6jJuIL5VuJHUby_ty-Wu81CWhIiN5ACWAbAYrfz_OXUc4z5Gu-FaAc1PQM274uar5Z4XBOO5Y8XtcWZZewqq4CB5XdBy9yGlzU0-54n5i48daxgVC7ViJdaxoLx9H_wOsywM525SYPuhHHrTnK6KiS_42O58ZrOQPw5Ct6g4jTK5t-g" />
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">NHS England</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">National Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-base">
          <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-secondary-container transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
            <span className="font-label-md text-label-md">Overview</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-secondary-container transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>drive_file_rename_outline</span>
            <span className="font-label-md text-label-md">Capacity</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-secondary-container transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>groups</span>
            <span className="font-label-md text-label-md">Staffing</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-secondary-container transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>timer</span>
            <span className="font-label-md text-label-md">A&amp;E Wait Times</span>
          </a>
          <a className="flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container font-bold rounded-lg scale-95 transition-transform" href="#">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
            <span className="font-label-md text-label-md">Regional Trends</span>
          </a>
        </nav>

        <div className="flex flex-col gap-md mt-auto pt-lg border-t border-surface-variant">
          <button className="w-full flex items-center justify-center gap-sm bg-primary text-on-primary h-[44px] rounded font-label-md text-label-md hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <div className="flex flex-col gap-base">
            <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-secondary-container transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span className="font-label-sm text-label-sm">Support</span>
            </a>
            <a className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-secondary-container transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="font-label-sm text-label-sm">System Status</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex justify-between items-center w-full px-margin-desktop h-[72px] shadow-sm bg-surface z-10 flex-shrink-0">
          <div className="md:hidden font-headline-md text-headline-md font-bold text-primary">NHS Decision Support</div>
          <nav className="hidden md:flex items-center h-full gap-xl">
            <a className="h-full flex items-center text-secondary font-label-md text-label-md hover:text-primary-container transition-colors" href="#">Dashboard</a>
            <a className="h-full flex items-center text-secondary font-label-md text-label-md hover:text-primary-container transition-colors" href="#">Analytics</a>
            <a className="h-full flex items-center text-primary border-b-2 border-primary pb-1 font-label-md text-label-md opacity-80 transition-opacity" href="#">Regional</a>
            <a className="h-full flex items-center text-secondary font-label-md text-label-md hover:text-primary-container transition-colors" href="#">Resources</a>
          </nav>
          <div className="flex items-center gap-md">
            <button className="text-secondary hover:text-primary-container transition-colors p-sm rounded-full hover:bg-surface-variant">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
            </button>
            <button className="text-secondary hover:text-primary-container transition-colors p-sm rounded-full hover:bg-surface-variant">
              <span className="material-symbols-outlined text-[24px]">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant overflow-hidden ml-sm">
              <img alt="Clinician Profile" className="w-full h-full object-cover" data-alt="Clinician" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEKciy_pffUbGlaeuP_mhfOhIJDE5g2L2I-sl8HHZrnHUyBaADjCPtGKnLTw0bTaUqCvi_ptFqwdUZ45iQafTxTorcvFmZDgJhq55gSe9GjRupBOvthAICJ-eEkZPguDPJ-fwzrGtmrPRGsWa_b4D_6Y-YNh7PyiE4K0O6hJnF0c2dFpgv0PupMKLhnmSKmHGg8JzhtEyWQuvI5VZlcT3KTXRjCKrE9_vo4VymsG4Uz4bd6oKsOIobWg" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-margin-desktop py-lg pb-xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-gutter">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col gap-sm">
              <nav className="flex items-center gap-sm text-secondary font-label-sm text-label-sm">
                <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <a className="hover:text-primary transition-colors" href="#">Regional</a>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-on-surface font-semibold">North West</span>
              </nav>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-md">
                  <h1 className="font-headline-xl text-headline-xl text-on-surface">North West Regional Detail</h1>
                  <div className="flex items-center gap-2 bg-error/10 text-error px-3 py-1 rounded-full border border-error/20">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    <span className="font-label-sm text-label-sm">Live</span>
                  </div>
                </div>
                <button className="flex items-center gap-sm bg-surface-container-lowest border border-primary text-primary h-[44px] px-lg rounded font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">ios_share</span>
                  Export Data
                </button>
              </div>
            </div>

            {/* KPI Row */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              <div className="bg-surface-container-lowest rounded-lg p-md card-shadow border border-surface-variant/50 flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-secondary">Active Bed Capacity</span>
                  <span className="material-symbols-outlined text-tertiary">hotel</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-data-display text-data-display text-on-surface">84<span className="text-headline-md">%</span></div>
                  <div className="bg-tertiary/10 text-tertiary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Warning
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full gauge-bg w-[84%]"></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-md card-shadow border border-surface-variant/50 flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-secondary">Staffing Levels</span>
                  <span className="material-symbols-outlined text-primary">group</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-data-display text-data-display text-on-surface">92<span className="text-headline-md">%</span></div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Normal
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary w-[92%] rounded-full"></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-md card-shadow border border-surface-variant/50 flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-secondary">Avg. A&amp;E Wait</span>
                  <span className="material-symbols-outlined text-error">pace</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-data-display text-data-display text-on-surface">4.2<span className="text-headline-md text-secondary ml-1">hrs</span></div>
                  <div className="bg-error/10 text-error px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span> Critical
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-error w-full rounded-full"></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-md card-shadow border border-surface-variant/50 flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <span className="font-label-md text-label-md text-secondary">Referral to Treatment (RTT)</span>
                  <span className="material-symbols-outlined text-primary">event_note</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="font-data-display text-data-display text-on-surface">14.2<span className="text-headline-md text-secondary ml-1">wks</span></div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_down</span> Improving
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden flex">
                  <div className="h-full bg-primary w-[40%] rounded-l-full"></div>
                  <div className="h-full bg-surface-variant w-[60%] rounded-r-full"></div>
                </div>
              </div>
            </section>

            {/* Main Content Grid */}
            <section className="grid grid-cols-12 gap-gutter">
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-lg card-shadow border border-surface-variant/50 flex flex-col overflow-hidden">
                <div className="p-lg border-b border-surface-variant flex justify-between items-center bg-surface/30">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Sub-Regional Performance</h3>
                  <button className="text-primary font-label-sm text-label-sm hover:underline">View All Locations</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-variant bg-surface/10">
                        <th className="py-sm px-lg font-label-md text-label-md text-secondary font-semibold">Area</th>
                        <th className="py-sm px-lg font-label-md text-label-md text-secondary font-semibold">Beds Available</th>
                        <th className="py-sm px-lg font-label-md text-label-md text-secondary font-semibold">Wait Times</th>
                        <th className="py-sm px-lg font-label-md text-label-md text-secondary font-semibold text-right">Staffing Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-surface-variant/50 hover:bg-surface-container-low transition-colors min-h-[56px] group">
                        <td className="py-md px-lg font-body-md text-on-surface font-medium group-hover:text-primary transition-colors">Greater Manchester</td>
                        <td className="py-md px-lg font-body-md text-on-surface">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden"><div className="w-[12%] h-full bg-error"></div></div>
                            <span className="text-error font-semibold">12%</span>
                          </div>
                        </td>
                        <td className="py-md px-lg font-body-md text-on-surface">4.8 hrs <span className="material-symbols-outlined text-[16px] text-error align-middle">arrow_upward</span></td>
                        <td className="py-md px-lg text-right">
                          <span className="inline-block bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-sm text-label-sm">Strained</span>
                        </td>
                      </tr>
                      <tr className="border-b border-surface-variant/50 hover:bg-surface-container-low transition-colors min-h-[56px] group">
                        <td className="py-md px-lg font-body-md text-on-surface font-medium group-hover:text-primary transition-colors">Merseyside</td>
                        <td className="py-md px-lg font-body-md text-on-surface">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden"><div className="w-[18%] h-full bg-tertiary"></div></div>
                            <span className="text-tertiary font-semibold">18%</span>
                          </div>
                        </td>
                        <td className="py-md px-lg font-body-md text-on-surface">3.9 hrs <span className="material-symbols-outlined text-[16px] text-primary align-middle">arrow_downward</span></td>
                        <td className="py-md px-lg text-right">
                          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm">Optimal</span>
                        </td>
                      </tr>
                      <tr className="border-b border-surface-variant/50 hover:bg-surface-container-low transition-colors min-h-[56px] group">
                        <td className="py-md px-lg font-body-md text-on-surface font-medium group-hover:text-primary transition-colors">Cheshire</td>
                        <td className="py-md px-lg font-body-md text-on-surface">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden"><div className="w-[24%] h-full bg-primary"></div></div>
                            <span className="text-primary font-semibold">24%</span>
                          </div>
                        </td>
                        <td className="py-md px-lg font-body-md text-on-surface">3.2 hrs <span className="material-symbols-outlined text-[16px] text-secondary align-middle">horizontal_rule</span></td>
                        <td className="py-md px-lg text-right">
                          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm">Optimal</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors min-h-[56px] group">
                        <td className="py-md px-lg font-body-md text-on-surface font-medium group-hover:text-primary transition-colors">Lancashire</td>
                        <td className="py-md px-lg font-body-md text-on-surface">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden"><div className="w-[15%] h-full bg-tertiary"></div></div>
                            <span className="text-tertiary font-semibold">15%</span>
                          </div>
                        </td>
                        <td className="py-md px-lg font-body-md text-on-surface">4.1 hrs <span className="material-symbols-outlined text-[16px] text-error align-middle">arrow_upward</span></td>
                        <td className="py-md px-lg text-right">
                          <span className="inline-block bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-sm text-label-sm">Strained</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-lg card-shadow border border-surface-variant/50 p-lg flex flex-col">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Staffing Composition</h3>
                  <button className="text-secondary hover:text-primary"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="w-48 h-48 doughnut-chart shadow-inner relative">
                    <div className="doughnut-hole flex flex-col items-center justify-center shadow-sm">
                      <span className="font-headline-xl text-headline-xl text-on-surface">4.2k</span>
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Total Staff</span>
                    </div>
                  </div>
                </div>
                <div className="mt-lg flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#00478d]"></span>
                      <span className="font-body-sm text-body-sm text-on-surface">Nurses</span>
                    </div>
                    <span className="font-label-md text-label-md font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#005eb8]"></span>
                      <span className="font-body-sm text-body-sm text-on-surface">Doctors</span>
                    </div>
                    <span className="font-label-md text-label-md font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#5a5f60]"></span>
                      <span className="font-body-sm text-body-sm text-on-surface">Allied Health</span>
                    </div>
                    <span className="font-label-md text-label-md font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#c3c7c8]"></span>
                      <span className="font-body-sm text-body-sm text-on-surface">Admin</span>
                    </div>
                    <span className="font-label-md text-label-md font-semibold">10%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Section - Historical Trends */}
            <section className="bg-surface-container-lowest rounded-lg card-shadow border border-surface-variant/50 p-lg">
              <div className="flex justify-between items-center mb-lg">
                <h3 className="font-headline-md text-headline-md text-on-surface">Historical Wait Time Trends (6 Months)</h3>
                <div className="flex gap-2">
                  <select className="bg-surface border border-outline-variant text-on-surface text-label-sm font-label-sm rounded px-3 py-1.5 focus:ring-primary focus:border-primary">
                    <option>A&amp;E Wait Times</option>
                    <option>RTT Over 18 Weeks</option>
                  </select>
                </div>
              </div>
              <div className="w-full h-64 relative mt-md">
                {/* Abstract Area Chart Representation using valid JSX SVG */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                  <line stroke="#d7e4f0" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
                  <line stroke="#d7e4f0" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100" />
                  <line stroke="#d7e4f0" strokeDasharray="4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
                  <line stroke="#d7e4f0" strokeWidth="1" x1="0" x2="1000" y1="200" y2="200" />
                  
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#005eb8" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#005eb8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  <path d="M0,180 C150,160 250,190 400,140 C550,90 650,110 800,60 C900,20 1000,40 1000,40 L1000,200 L0,200 Z" fill="url(#areaGradient)" />
                  <path className="animated-line" d="M0,180 C150,160 250,190 400,140 C550,90 650,110 800,60 C900,20 1000,40 1000,40" fill="none" stroke="#005eb8" strokeWidth="3" />
                  
                  <circle cx="400" cy="140" fill="#ffffff" r="4" stroke="#005eb8" strokeWidth="2" />
                  <circle cx="800" cy="60" fill="#ffffff" r="4" stroke="#005eb8" strokeWidth="2" />
                </svg>
                
                <div className="flex justify-between w-full mt-2 font-label-sm text-label-sm text-secondary">
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-xl border-t border-outline-variant py-md flex justify-between items-center w-full">
            <div className="font-label-md text-label-md font-bold text-primary">
              © 2024 NHS England - Decision Support System v2.1.0
            </div>
            <div className="flex gap-lg">
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Accessibility</a>
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Terms of Use</a>
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Contact Support</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}