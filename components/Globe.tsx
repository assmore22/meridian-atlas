"use client";

import { useEffect, useRef, useState } from "react";
import { STATUS_COLOR } from "@/lib/genlayer/types";
import type { Observation } from "@/lib/genlayer/types";

const CESIUM_VER = "1.123";
const BASE = `https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VER}/Build/Cesium/`;

declare global { interface Window { Cesium?: any; CESIUM_BASE_URL?: string; } }

function loadCesium(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Cesium) return resolve(window.Cesium);
    window.CESIUM_BASE_URL = BASE;
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = BASE + "Widgets/widgets.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = BASE + "Cesium.js"; s.async = true;
    s.onload = () => resolve(window.Cesium);
    s.onerror = () => reject(new Error("Cesium CDN failed"));
    document.head.appendChild(s);
  });
}

export function Globe({ observations, onSelect, height = 460 }: { observations: Observation[]; onSelect?: (id: number) => void; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let viewer: any = null; let disposed = false;
    loadCesium().then((Cesium) => {
      if (disposed || !ref.current) return;
      try { Cesium.Ion.defaultAccessToken = undefined; } catch {}
      viewer = new Cesium.Viewer(ref.current, {
        imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" }),
        baseLayerPicker: false, geocoder: false, homeButton: false, sceneModePicker: false,
        navigationHelpButton: false, animation: false, timeline: false, fullscreenButton: false,
        infoBox: false, selectionIndicator: false, creditContainer: document.createElement("div"),
      });
      viewer.scene.globe.enableLighting = false;
      viewerRef.current = viewer;
      observations.forEach((o) => {
        const lat = parseFloat(o.lat), lng = parseFloat(o.lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return;
        viewer.entities.add({
          id: String(o.id),
          position: Cesium.Cartesian3.fromDegrees(lng, lat),
          point: { pixelSize: 12, color: Cesium.Color.fromCssColorString(STATUS_COLOR[o.status]), outlineColor: Cesium.Color.WHITE, outlineWidth: 2 },
          label: { text: o.label, font: "13px sans-serif", pixelOffset: new Cesium.Cartesian2(0, -18), fillColor: Cesium.Color.fromCssColorString("#1A1F23"), showBackground: true, backgroundColor: Cesium.Color.fromCssColorString("#F7F3E8"), scale: 0.8 },
        });
      });
      if (observations.length) viewer.zoomTo(viewer.entities);
      if (onSelect) {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: any) => {
          const picked = viewer.scene.pick(click.position);
          if (picked && picked.id && picked.id.id != null) onSelect(Number(picked.id.id));
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    }).catch(() => setFailed(true));
    return () => { disposed = true; try { viewer && viewer.destroy(); } catch {} };
  }, [observations, onSelect]);

  if (failed) {
    return (
      <div style={{ height }} className="grid place-items-center hair bg-paper" role="img" aria-label="World map (unavailable)">
        <p className="label">Globe unavailable - see the list below.</p>
      </div>
    );
  }
  return <div ref={ref} style={{ height }} className="w-full overflow-hidden hair" role="img" aria-label="Interactive globe of recorded observations" />;
}
