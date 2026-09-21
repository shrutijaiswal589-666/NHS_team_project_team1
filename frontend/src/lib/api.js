export async function checkBackendHealth() {
    try {
        const response = await fetch("http://localhost:8000/health");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch from backend:", error);
        return { 
            status: "error", 
            message: "Failed to connect! Is the Python server running?" 
        };
    }
}

export async function checkDatabaseConnection() {
    try {
        const response = await fetch("http://localhost:8000/api/db-stats");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch DB stats:", error);
        return { 
            status: "error", 
            message: "Could not reach backend to check database." 
        };
    }
}

export async function getGPKpis(months = 12) {
    try {
        const response = await fetch(`http://localhost:8000/api/gp-kpis?months=${months}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch GP KPIs:", error);
        return null;
    }
}

export async function getGPModes(months = 12) {
    try {
        const response = await fetch(`http://localhost:8000/api/gp-modes?months=${months}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch GP Modes:", error);
        return null;
    }
}

export async function getGPRegions(months = 12, search = "") {
    try {
        console.log(`📡 Sending to Backend -> Months: ${months}, Search: "${search}"`);
        const response = await fetch(`http://localhost:8000/api/gp-regions?months=${months}&search=${encodeURIComponent(search)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch GP Regions:", error);
        return null;
    }
}