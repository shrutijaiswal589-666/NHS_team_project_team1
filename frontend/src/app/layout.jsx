import TailwindSetup from '../components/TailwindSetup';
import SearchBar from '../components/Searchbar/page';
import './globals.css';

export const metadata = {
  title: "NHS Capacity & Wait Time Decision Support System",
  description: "Dashboard interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>

      <body className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
        <TailwindSetup />

        {}
        <header className="bg-surface shadow-sm sticky top-0 z-50">
          <div className="flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto h-16">
            <div className="flex items-center gap-md">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">NHS Decision Support</span>
              <div className="hidden md:flex ml-lg gap-sm items-end h-full">
                <a className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1" href="/">Dashboard</a>
                <a className="font-label-md text-label-md text-secondary hover:text-primary-container transition-colors pb-1" href="#">Analytics</a>
                <a className="font-label-md text-label-md text-secondary hover:text-primary-container transition-colors pb-1" href="/regional">Regional</a>
                <a className="font-label-md text-label-md text-secondary hover:text-primary-container transition-colors pb-1" href="#">Resources</a>
              </div>
            </div>
            
            <div className="flex items-center gap-md">
              {/* Inserted the Interactive Search Bar Here */}
              <SearchBar />
              <button aria-label="Notifications" className="p-2 text-secondary hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button aria-label="Settings" className="p-2 text-secondary hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <img alt="Clinician Profile" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_E6oaflFo0jnnmB-MrKeKQfl_gQzYPCWCrX0SWXpmKSvb8eENygeUR_eEx8YK_P3wpFWpO6d8vsT3QNZ9pH12OEBZPzs_zJWrTPWAdTIhENaPyZtOAkL3KgsUdtmpWl8kZ0jaLI7_Bv51LALBpop0q3jGCOrf1AjAVCUSDBK_Rajcb2W6vWafQiUT7QYeldo59hGAPxX_FEpE8d0c3XAM9IDtwVkaGkBrGy2RFnfMKzcSaEYFkSo_qQ" />
            </div>
          </div>
        </header>

        {}
        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <aside className="hidden md:flex flex-col h-[calc(100vh-64px)] w-64 bg-surface-container-low py-lg px-md gap-sm sticky top-16 border-r border-outline-variant">
            <div className="flex items-center gap-3 mb-md px-2">
              <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                NHS
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary">NHS England</h2>
                <p className="font-label-sm text-label-sm text-secondary">National Dashboard</p>
              </div>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
              <a className="flex items-center gap-3 px-3 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg transition-transform scale-95 font-label-md text-label-md" href="/">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                Overview
              </a>
              <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-secondary-container transition-all rounded-lg font-label-md text-label-md" href="#">
                <span className="material-symbols-outlined">drive_file_rename_outline</span>
                Capacity
              </a>
              <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-secondary-container transition-all rounded-lg font-label-md text-label-md" href="#">
                <span className="material-symbols-outlined">groups</span>
                Staffing
              </a>
              <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-secondary-container transition-all rounded-lg font-label-md text-label-md" href="#">
                <span className="material-symbols-outlined">timer</span>
                A&amp;E Wait Times
              </a>
              <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-secondary-container transition-all rounded-lg font-label-md text-label-md" href="/regional">
                <span className="material-symbols-outlined">map</span>
                Regional Trends
              </a>
            </nav>
            <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant">
              <button className="w-full py-2 px-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors text-center border border-primary">
                Export Report
              </button>
              <div className="flex gap-2 justify-between px-2 mt-2">
                <a className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" href="#">
                  <span className="material-symbols-outlined text-sm">help</span> Support
                </a>
                <a className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" href="#">
                  <span className="material-symbols-outlined text-sm">check_circle</span> System Status
                </a>
              </div>
            </div>
          </aside>

          <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto w-full">
            {children}
          </main>
        </div>

        {}
        <footer className="bg-background border-t border-outline-variant mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-md max-w-7xl mx-auto gap-4">
            <div className="font-label-md text-label-md font-bold text-primary">
              © 2024 NHS England - Decision Support System v2.1.0
            </div>
            <div className="flex items-center gap-4">
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Accessibility</a>
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Terms of Use</a>
              <a className="font-label-sm text-label-sm text-secondary hover:text-primary underline transition-all duration-200" href="#">Contact Support</a>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low px-3 py-1 rounded-full border border-surface-dim font-label-sm text-label-sm text-secondary">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" style={{ backgroundColor: '#10b981' }}></span>
                Backend: Connected
              </div>
              <div className="w-px h-3 bg-outline-variant"></div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" style={{ backgroundColor: '#10b981' }}></span>
                Database: Live
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
