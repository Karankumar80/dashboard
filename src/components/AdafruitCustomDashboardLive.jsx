import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------- helpers ----------
const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

// ---------- Real-time Graph Component ----------
function RealtimeGraph({ data, label, color, unit, isDark }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get min and max values for scaling
        const values = data.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue || 1;

        // Draw grid
        ctx.strokeStyle = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw gradient area
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, `${color}00`);

        ctx.beginPath();
        ctx.moveTo(0, height);

        data.forEach((point, index) => {
            const x = (width / (data.length - 1)) * index;
            const y = height - ((point.value - minValue) / range) * height;
            
            if (index === 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        data.forEach((point, index) => {
            const x = (width / (data.length - 1)) * index;
            const y = height - ((point.value - minValue) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw points
        data.forEach((point, index) => {
            const x = (width / (data.length - 1)) * index;
            const y = height - ((point.value - minValue) / range) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = isDark ? '#1f2937' : '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw current value
        if (data.length > 0) {
            const lastValue = data[data.length - 1].value;
            ctx.font = 'bold 14px system-ui';
            ctx.fillStyle = isDark ? '#ffffff' : '#111827';
            ctx.textAlign = 'right';
            ctx.fillText(`${lastValue.toFixed(1)} ${unit}`, width - 10, 20);
        }

    }, [data, color, unit, isDark]);

    return (
        <div className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{label}</div>
            <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-32 md:h-40"
                style={{ imageRendering: 'crisp-edges' }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Last 20 readings
            </div>
        </div>
    );
}

// ---------- Theme Toggle Component ----------
function ThemeToggle({ isDark, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
            }`}
        >
            <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isDark ? 'translate-x-8' : 'translate-x-1'
                }`}
            >
                {isDark ? '🌙' : '☀️'}
            </div>
        </button>
    );
}

// ---------- Glass Card Component ----------
function GlassCard({ children, className = "", gradient = false }) {
    return (
        <div 
            className={`backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl ${className}`}
            style={{
                animation: 'fadeInUp 0.6s ease-out'
            }}
        >
            {children}
        </div>
    );
}

// ---------- Metric Card Component ----------
function MetricCard({ icon, label, value, unit, color = "blue", progress = null }) {
    const colorClasses = {
        red: "text-red-500 bg-red-500/10 dark:bg-red-500/20",
        blue: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
        orange: "text-orange-500 bg-orange-500/10 dark:bg-orange-500/20",
        purple: "text-purple-500 bg-purple-500/10 dark:bg-purple-500/20",
        green: "text-green-500 bg-green-500/10 dark:bg-green-500/20",
    };

    const progressColors = {
        red: "bg-gradient-to-r from-red-400 to-red-600",
        blue: "bg-gradient-to-r from-blue-400 to-blue-600",
        orange: "bg-gradient-to-r from-orange-400 to-orange-600",
        purple: "bg-gradient-to-r from-purple-400 to-purple-600",
        green: "bg-gradient-to-r from-green-400 to-green-600",
    };

    return (
        <GlassCard className="p-6">
            <div className="flex flex-col items-center justify-center h-full">
                <div className={`w-16 h-16 rounded-2xl ${colorClasses[color]} flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110`}>
                    {icon}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
                    {value}
                </div>
                {unit && <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{unit}</div>}
                <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">{label}</div>
                {progress !== null && (
                    <div className="w-full mt-4">
                        <div className="h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColors[color]}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">{progress}%</div>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

// ---------- Enhanced Map Component ----------
function MapBox({ lat, lon, distance, speed, isDark }) {
    const ref = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        let mapInstance;
        (async () => {
            try {
                if (!ref.current) return;
                const mod = await import("leaflet");
                const L = mod.default || mod;
                if (!document.querySelector("#leaflet-css")) {
                    const link = document.createElement("link");
                    link.id = "leaflet-css";
                    link.rel = "stylesheet";
                    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                    document.head.appendChild(link);
                }

                if (mapRef.current) {
                    mapRef.current.remove();
                }

                mapInstance = L.map(ref.current).setView([lat || 13.0827, lon || 80.2707], lat && lon ? 13 : 2);
                
                const tileUrl = isDark 
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
                
                L.tileLayer(tileUrl, {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(mapInstance);

                if (lat && lon) {
                    if (markerRef.current) {
                        mapInstance.removeLayer(markerRef.current);
                    }
                    const customIcon = L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="
              width: 24px;
              height: 24px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              animation: pulse 2s infinite;
            "></div>
            <style>
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.7; }
              }
            </style>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });
                    markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapInstance);
                    mapInstance.setView([lat, lon], 13);
                }

                mapRef.current = mapInstance;
            } catch (e) {
                console.error("Leaflet init failed:", e);
            }
        })();
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [lat, lon, isDark]);

    return (
        <div className="relative">
            <div ref={ref} className="rounded-3xl overflow-hidden shadow-2xl" style={{ height: '400px' }} />
            {(distance !== null || speed !== null) && (
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
                    {distance !== null && (
                        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl px-4 py-3 shadow-xl border border-white/30 dark:border-gray-700/30">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Distance</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{distance}</div>
                        </div>
                    )}
                    {speed !== null && (
                        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl px-4 py-3 shadow-xl border border-white/30 dark:border-gray-700/30">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Speed</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{speed}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ---------- 3D Animated Icons ----------
const HeartIcon = () => (
    <div className="relative w-8 h-8 animate-heartbeat" style={{
        animation: 'heartbeat 1.5s ease-in-out infinite'
    }}>
        <svg className="w-full h-full drop-shadow-lg" fill="url(#heartGradient)" viewBox="0 0 24 24" style={{
            filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4))',
            transform: 'perspective(400px) rotateX(10deg)'
        }}>
            <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ef4444', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    </div>
);

const ThermometerIcon = () => (
    <div className="relative w-8 h-8" style={{
        animation: 'float 3s ease-in-out infinite'
    }}>
        <svg className="w-full h-full drop-shadow-lg" fill="url(#thermGradient)" viewBox="0 0 24 24" style={{
            filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.4))',
            transform: 'perspective(400px) rotateY(15deg)'
        }}>
            <defs>
                <linearGradient id="thermGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#f97316', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ea580c', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-full blur-xl"></div>
    </div>
);

const OxygenIcon = () => (
    <div className="relative w-8 h-8" style={{
        animation: 'spin 8s linear infinite'
    }}>
        <svg className="w-full h-full drop-shadow-lg" fill="url(#oxygenGradient)" viewBox="0 0 24 24" style={{
            filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))',
            transform: 'perspective(400px) rotateX(-10deg)'
        }}>
            <defs>
                <linearGradient id="oxygenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" />
            <path fill="white" d="M12 6v6l4 2" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl"></div>
    </div>
);

const StepsIcon = () => (
    <div className="relative w-8 h-8" style={{
        animation: 'bounce 2s ease-in-out infinite'
    }}>
        <svg className="w-full h-full drop-shadow-lg" fill="url(#stepsGradient)" viewBox="0 0 24 24" style={{
            filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.4))',
            transform: 'perspective(400px) rotateY(-15deg)'
        }}>
            <defs>
                <linearGradient id="stepsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#a855f7', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#9333ea', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M14.5 2.5c-.8 0-1.5.7-1.5 1.5v2h-2v-2c0-.8-.7-1.5-1.5-1.5S8 3.2 8 4v2H6v-2c0-.8-.7-1.5-1.5-1.5S3 3.2 3 4v16h2V10h2v10h2V8h2v12h2V6h2v14h2V4c0-.8-.7-1.5-1.5-1.5z" />
        </svg>
    </div>
);

const CaloriesIcon = () => (
    <div className="relative w-8 h-8" style={{
        animation: 'flicker 2s ease-in-out infinite'
    }}>
        <svg className="w-full h-full drop-shadow-lg" fill="url(#caloriesGradient)" viewBox="0 0 24 24" style={{
            filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.5))',
            transform: 'perspective(400px) rotateX(10deg)'
        }}>
            <defs>
                <linearGradient id="caloriesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#fb923c', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#f97316', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ea580c', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent rounded-full blur-xl animate-pulse"></div>
    </div>
);

export default function AdafruitCustomDashboardLive({
    wsUrl = "",
    feeds = { mpu6050: "mpu-data", tmp117: "temp-data", max30102: "max-data", gps: "gps-data" },
}) {
    const [latest, setLatest] = useState({});
    const [wsConnected, setWsConnected] = useState(false);
    const [prevCoords, setPrevCoords] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isDark, setIsDark] = useState(false);
    const [sensorHistory, setSensorHistory] = useState({
        mpu6050: [],
        max30102: [],
        temp: [],
        heartRate: [],
        spO2: []
    });

    // Apply dark mode class to document
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Enhanced WebSocket for real-time updates
    useEffect(() => {
        const target =
            wsUrl ||
            (typeof window !== "undefined"
                ? window.location.protocol.replace("http", "ws") +
                "//" +
                window.location.host +
                "/ws/aio"
                : "");
        if (!target) return;
        let alive = true;
        let ws;
        let timer;
        const connect = () => {
            ws = new WebSocket(target);
            ws.onopen = () => {
                setWsConnected(true);
                console.log("WebSocket connected for real-time updates");
            };
            ws.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data);
                    if (msg && msg.feed) {
                        const created_at = msg.created_at || new Date().toISOString();
                        console.log('WebSocket message received:', msg.feed, msg.value);
                        setLatest((prev) => {
                            const prevData = prev[msg.feed];
                            const prevTs = prevData?.created_at;
                            const prevValue = prevData?.value;

                            const isNewer = !prevTs || new Date(created_at) > new Date(prevTs);
                            const valueChanged = prevValue !== String(msg.value);

                            if (isNewer || valueChanged) {
                                console.log('Updating feed:', msg.feed, 'with value:', msg.value, '(was:', prevValue, ')');
                                setLastUpdate(new Date());
                                return { ...prev, [msg.feed]: { value: msg.value, created_at } };
                            }
                            return prev;
                        });
                    }
                } catch (err) {
                    console.error('WebSocket message error:', err);
                }
            };
            ws.onclose = () => {
                setWsConnected(false);
                if (alive) {
                    timer = setTimeout(connect, 2000);
                }
            };
            ws.onerror = () => {
                setWsConnected(false);
                ws.close();
            };
        };
        connect();
        return () => {
            alive = false;
            clearTimeout(timer);
            ws && ws.close();
        };
    }, [wsUrl]);

    // Initial fetch on mount
    useEffect(() => {
        let aborted = false;
        const feedKeys = Object.values(feeds);
        const fetchOne = async (key) => {
            try {
                const res = await fetch(`/api/aio/feed/${encodeURIComponent(key)}/latest`);
                if (!res.ok) return;
                const arr = await res.json();
                const item = Array.isArray(arr) ? arr[0] : null;
                if (!item || aborted) return;
                setLatest((prev) => {
                    const prevTs = prev[key]?.created_at;
                    if (!prevTs || new Date(item.created_at) > new Date(prevTs)) {
                        setLastUpdate(new Date());
                        return { ...prev, [key]: { value: item.value, created_at: item.created_at } };
                    }
                    return prev;
                });
            } catch (e) {
                console.error(`Error fetching ${key}:`, e);
            }
        };
        feedKeys.forEach(fetchOne);
        return () => {
            aborted = true;
        };
    }, [feeds]);

    // Automatic polling fallback
    useEffect(() => {
        const feedKeys = Object.values(feeds);
        let aborted = false;

        const pollAll = async () => {
            if (aborted) return;
            console.log('Polling all feeds...');
            for (const key of feedKeys) {
                try {
                    const res = await fetch(`/api/aio/feed/${encodeURIComponent(key)}/latest`);
                    if (!res.ok) {
                        console.warn(`Poll failed for ${key}:`, res.status);
                        continue;
                    }
                    const arr = await res.json();
                    const item = Array.isArray(arr) ? arr[0] : null;
                    if (!item || aborted) continue;

                    setLatest((prev) => {
                        const prevData = prev[key];
                        const prevTs = prevData?.created_at;
                        const prevValue = prevData?.value;

                        const isNewer = !prevTs || new Date(item.created_at) > new Date(prevTs);
                        const valueChanged = prevValue !== String(item.value);

                        if (isNewer || valueChanged) {
                            console.log(`Poll update: ${key} = ${item.value} (was: ${prevValue})`);
                            setLastUpdate(new Date());
                            return { ...prev, [key]: { value: item.value, created_at: item.created_at } };
                        }
                        return prev;
                    });
                } catch (e) {
                    console.error(`Poll error for ${key}:`, e);
                }
            }
        };

        pollAll();
        const interval = setInterval(pollAll, 3000);

        return () => {
            aborted = true;
            clearInterval(interval);
        };
    }, [feeds]);

    // Parse sensor data
    const tempValue = useMemo(() => {
        const v = latest[feeds.tmp117]?.value;
        return v != null ? Number(v) : null;
    }, [latest, feeds]);

    const tempFahrenheit = useMemo(() => {
        if (tempValue === null) return null;
        return (tempValue * 9 / 5) + 32 + 2.7;
    }, [tempValue]);

    const maxData = useMemo(() => {
        const v = latest[feeds.max30102]?.value;
        if (!v) return { heartRate: null, spO2: null, heartRateProgress: null, spO2Progress: null };
        const str = String(v).trim();

        let heartRate = null;
        let spO2 = null;

        const parts = str.split(/[,\s]+/).filter(Boolean).map(Number);
        if (parts.length >= 2 && parts.every(n => Number.isFinite(n))) {
            heartRate = Math.round(parts[0]);
            spO2 = Math.round(parts[1]);
        } else {
            try {
                const json = JSON.parse(str);
                heartRate = json.heartRate || json.heart || json.bpm || null;
                spO2 = json.spO2 || json.spo2 || json.oxygen || null;
            } catch { }
        }

        let heartRateProgress = null;
        if (heartRate !== null) {
            heartRate = Math.max(60, Math.min(120, Math.round(heartRate)));
            heartRateProgress = Math.round(((heartRate - 60) / (120 - 60)) * 100);
        }

        let spO2Progress = null;
        if (spO2 !== null) {
            spO2 = Math.max(90, Math.min(100, Math.round(spO2)));
            spO2Progress = Math.round(((spO2 - 90) / (100 - 90)) * 100);
        }

        return {
            heartRate: heartRate,
            spO2: spO2,
            heartRateProgress: heartRateProgress,
            spO2Progress: spO2Progress,
        };
    }, [latest, feeds]);

    const coords = useMemo(() => {
        const v = latest[feeds.gps]?.value;
        if (!v) return { lat: null, lon: null, ts: null };

        let lat = null, lon = null;
        const str = String(v).trim();

        try {
            const json = JSON.parse(str);
            lat = parseFloat(json.lat || json.latitude || json.Lat || json.Latitude);
            lon = parseFloat(json.lon || json.longitude || json.Lon || json.Longitude);
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                return { lat, lon, ts: latest[feeds.gps]?.created_at };
            }
        } catch { }

        const parts = str.split(/[,\s]+/).filter(Boolean);
        if (parts.length >= 2) {
            lat = parseFloat(parts[0]);
            lon = parseFloat(parts[1]);
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                return { lat, lon, ts: latest[feeds.gps]?.created_at };
            }
        }

        return { lat: null, lon: null, ts: latest[feeds.gps]?.created_at };
    }, [latest, feeds]);

    const { distance, speed } = useMemo(() => {
        if (!coords.lat || !coords.lon) return { distance: null, speed: null };

        if (prevCoords && prevCoords.lat && prevCoords.lon) {
            const R = 6371;
            const dLat = ((coords.lat - prevCoords.lat) * Math.PI) / 180;
            const dLon = ((coords.lon - prevCoords.lon) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((prevCoords.lat * Math.PI) / 180) *
                Math.cos((coords.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const dist = R * c;

            let speedKmh = null;
            if (prevCoords.ts && coords.ts) {
                const timeDiff = (new Date(coords.ts) - new Date(prevCoords.ts)) / 1000 / 3600;
                if (timeDiff > 0) {
                    speedKmh = dist / timeDiff;
                }
            }

            return {
                distance: dist < 0.1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(2)} km`,
                speed: speedKmh ? `${speedKmh.toFixed(1)} km/h` : null,
            };
        }

        return { distance: null, speed: null };
    }, [coords, prevCoords]);

    useEffect(() => {
        if (coords.lat && coords.lon) {
            setPrevCoords(coords);
        }
    }, [coords.lat, coords.lon]);

    const mpuData = useMemo(() => {
        const v = latest[feeds.mpu6050]?.value;
        if (!v) return { steps: null, calories: null };
        const str = String(v).trim();
        const parts = str.split(/[,\s]+/).filter(Boolean).map(Number);
        if (parts.length >= 2 && parts.every(n => Number.isFinite(n))) {
            const steps = Math.abs(Math.round(parts[0] * 100 + parts[1] * 50));
            const calories = Math.round(steps * 0.04);
            return { steps, calories };
        }
        return { steps: null, calories: null };
    }, [latest, feeds]);

    // Update sensor history for graphs
    useEffect(() => {
        const now = new Date().getTime();
        
        if (tempFahrenheit !== null) {
            setSensorHistory(prev => ({
                ...prev,
                temp: [...prev.temp, { time: now, value: tempFahrenheit }].slice(-20)
            }));
        }

        if (maxData.heartRate !== null) {
            setSensorHistory(prev => ({
                ...prev,
                heartRate: [...prev.heartRate, { time: now, value: maxData.heartRate }].slice(-20)
            }));
        }
        if (maxData.spO2 !== null) {
            setSensorHistory(prev => ({
                ...prev,
                spO2: [...prev.spO2, { time: now, value: maxData.spO2 }].slice(-20)
            }));
        }
    }, [tempFahrenheit, maxData.heartRate, maxData.spO2]);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes heartbeat {
                    0%, 100% {
                        transform: perspective(400px) rotateX(10deg) scale(1);
                    }
                    25% {
                        transform: perspective(400px) rotateX(10deg) scale(1.15);
                    }
                    50% {
                        transform: perspective(400px) rotateX(10deg) scale(1);
                    }
                    75% {
                        transform: perspective(400px) rotateX(10deg) scale(1.05);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: perspective(400px) rotateY(15deg) translateY(0px);
                    }
                    50% {
                        transform: perspective(400px) rotateY(15deg) translateY(-10px);
                    }
                }
                
                @keyframes flicker {
                    0%, 100% {
                        opacity: 1;
                        transform: perspective(400px) rotateX(10deg) scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: perspective(400px) rotateX(10deg) scale(1.1);
                    }
                }
                
                html {
                    scroll-behavior: smooth;
                }
                
                * {
                    scroll-behavior: smooth;
                }
            `}</style>

            <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/30 shadow-xl transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://trackleo.com/assets/navigation-icon.webp"
                                alt="Logo"
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-lg transform transition-transform duration-300 hover:scale-110"
                            />
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Trackleo
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                {lastUpdate.toLocaleTimeString()}
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${wsConnected ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                                <span className="text-xs font-medium">
                                    {wsConnected ? 'Live' : 'Polling'}
                                </span>
                            </div>
                            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <GlassCard>
                    <div className="p-4 sm:p-6">
                        <div className="mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                Location Tracking
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
                                {coords.lat && coords.lon
                                    ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)} • ${fmtTime(coords.ts)}`
                                    : "Waiting for GPS data..."}
                            </p>
                        </div>
                        <MapBox lat={coords.lat} lon={coords.lon} distance={distance} speed={speed} isDark={isDark} />
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard
                        icon={<HeartIcon />}
                        label="Heart Rate"
                        value={maxData.heartRate ?? "—"}
                        unit="BPM (60-120)"
                        color="red"
                        progress={maxData.heartRateProgress}
                    />
                    <MetricCard
                        icon={<OxygenIcon />}
                        label="SpO2"
                        value={maxData.spO2 ? `${maxData.spO2}%` : "—"}
                        unit="Oxygen (90-100%)"
                        color="blue"
                        progress={maxData.spO2Progress}
                    />
                    <MetricCard
                        icon={<ThermometerIcon />}
                        label="Temperature"
                        value={tempFahrenheit ? `${tempFahrenheit.toFixed(1)}°F` : "—"}
                        unit="Body Temp"
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCard
                        icon={<StepsIcon />}
                        label="Steps Today"
                        value={mpuData.steps ? mpuData.steps.toLocaleString() : "—"}
                        unit="Daily Goal: 10,000"
                        color="purple"
                        progress={mpuData.steps ? Math.min(100, Math.round((mpuData.steps / 10000) * 100)) : null}
                    />
                    <MetricCard
                        icon={<CaloriesIcon />}
                        label="Calories Burned"
                        value={mpuData.calories ?? "—"}
                        unit="Daily Goal: 600"
                        color="orange"
                        progress={mpuData.calories ? Math.min(100, Math.round((mpuData.calories / 600) * 100)) : null}
                    />
                </div>

                <GlassCard>
                    <div className="p-4 sm:p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Real-time Sensor Trends</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <RealtimeGraph
                                data={sensorHistory.heartRate}
                                label="Heart Rate Trend"
                                color="#ef4444"
                                unit="BPM"
                                isDark={isDark}
                            />
                            <RealtimeGraph
                                data={sensorHistory.spO2}
                                label="SpO2 Trend"
                                color="#3b82f6"
                                unit="%"
                                isDark={isDark}
                            />
                            <RealtimeGraph
                                data={sensorHistory.temp}
                                label="Temperature Trend"
                                color="#f97316"
                                unit="°F"
                                isDark={isDark}
                            />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="p-4 sm:p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Raw Sensor Data</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">MPU6050 Data</div>
                                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                                    {latest[feeds.mpu6050]?.value || "Waiting…"}
                                </pre>
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    Updated: {fmtTime(latest[feeds.mpu6050]?.created_at)}
                                </div>
                            </div>
                            <div className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">MAX30102 Data</div>
                                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
                                    {latest[feeds.max30102]?.value || "Waiting…"}
                                </pre>
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    Updated: {fmtTime(latest[feeds.max30102]?.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
