"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import type { ParkingSlot } from "@/lib/parking-lot-type";

interface InteractiveSvgMapProps {
  mapSvgUrl: string;
  slots: ParkingSlot[];
}

interface ParsedSlot {
  elementId: string;
  slotNumber: string;
  vehicleType: string;
  slotData?: ParkingSlot;
}

interface Tooltip {
  visible: boolean;
  x: number;
  y: number;
  slot?: ParsedSlot;
  status?: string;
}

export function InteractiveSvgMap({
  mapSvgUrl,
  slots,
}: InteractiveSvgMapProps) {
  const [rawSvg, setRawSvg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Giữ nguyên biến quản lý slot như yêu cầu
  const [parsedSlots, setParsedSlots] = useState<ParsedSlot[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip>({
    visible: false,
    x: 0,
    y: 0,
  });

  // 1. Fetch và Parse dữ liệu thô (Chỉ chạy khi URL hoặc dữ liệu slots thay đổi)
  useEffect(() => {
    const loadSvg = async () => {
      try {
        setLoading(true);
        const response = await fetch(mapSvgUrl);
        if (!response.ok) throw new Error("Failed to fetch SVG");
        let text = await response.text();

        // Làm sạch tag XML nếu có
        text = text.replace(/<\?xml.*\?>/g, "").trim();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");
        if (!svgElement) throw new Error("Invalid SVG content");

        const originalWidth = svgElement.getAttribute("width");
        const originalHeight = svgElement.getAttribute("height");
        const viewBox = svgElement.getAttribute("viewBox");

        if (!viewBox && originalWidth && originalHeight) {
          svgElement.setAttribute(
            "viewBox",
            `0 0 ${originalWidth.replace("px", "")} ${originalHeight.replace("px", "")}`,
          );
        }

        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        svgElement.style.width = "100%";
        svgElement.style.height = "100%";
        svgElement.style.maxWidth = "100%";
        svgElement.style.maxHeight = "100%";

        const updatedText = svgElement.outerHTML;

        // Trích xuất dữ liệu slots để quản lý trong state parsedSlots
        const slotPattern = /^slot-([^-]+)-([^-]+)$/;
        const elements = svgDoc.querySelectorAll('[id*="slot"]');
        const extracted: ParsedSlot[] = [];

        elements.forEach((el) => {
          const match = el.id.match(slotPattern);
          if (match) {
            const [, slotNumber, vehicleType] = match;
            extracted.push({
              elementId: el.id,
              slotNumber,
              vehicleType,
              slotData: slots.find((s) => s.slot_number === slotNumber),
            });
          }
        });

        setParsedSlots(extracted);
        setRawSvg(updatedText);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading map");
      } finally {
        setLoading(false);
      }
    };
    loadSvg();
  }, [mapSvgUrl, slots]);

  // 2. Logic xử lý Parser: Biến thẻ ID slot thành Component có Logic React
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs?.id) {
        const id = domNode.attribs.id;
        const slot = parsedSlots.find((s) => s.elementId === id);

        if (slot) {
          return (
            <SlotTag
              key={id}
              tagName={domNode.name}
              attribs={domNode.attribs}
              slot={slot}
              onHover={setTooltip}
            />
          );
        }
      }
    },
  };

  const renderedSvg = useMemo(() => {
    if (!rawSvg) return null;
    return parse(rawSvg, parserOptions);
  }, [rawSvg, parsedSlots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải sơ đồ bãi xe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-semibold">Không thể tải sơ đồ</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md overflow-auto flex justify-center items-center h-[400px]">
        <div className="w-full h-full">{renderedSvg}</div>
      </div>

      {/* Tooltip giữ nguyên cấu trúc UI */}
      {tooltip.visible && tooltip.slot && (
        <div
          className="fixed bg-slate-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg border border-white/20 pointer-events-none z-50"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold">{tooltip.slot.slotNumber}</div>
          <div className="text-xs text-gray-300">
            {tooltip.slot.vehicleType}
          </div>
          <div className="text-xs text-green-400">{tooltip.status}</div>
        </div>
      )}

      {/* Slot Count Info - GIỮ NGUYÊN */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-md">
          <p className="text-xs text-muted-foreground">Total Slots</p>
          <p className="text-lg font-semibold">{parsedSlots.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-md">
          <p className="text-xs text-muted-foreground">Available</p>
          <p className="text-lg font-semibold text-emerald-400">
            {
              parsedSlots.filter((s) => s.slotData && !s.slotData.is_occupied)
                .length
            }
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-md">
          <p className="text-xs text-muted-foreground">Occupied</p>
          <p className="text-lg font-semibold text-rose-400">
            {
              parsedSlots.filter((s) => s.slotData && s.slotData.is_occupied)
                .length
            }
          </p>
        </div>
      </div>
    </div>
  );
}

function SlotTag({ tagName, attribs, slot, onHover }: any) {
  const Tag = tagName;
  const slotInfo = slot.slotData;

  // 1. Tính toán màu sắc bằng Logic React (Next-way)
  let fillColor = "#e2e8f0";
  let statusText = "Available";

  if (slotInfo?.is_occupied) {
    // Ưu tiên 1: Có người đỗ (is_occupied = true)
    fillColor = "#3b82f6"; // Màu Xanh dương (Blue-500)
    statusText = "Occupied";
  } else if (slotInfo?.is_look_up) {
    // Ưu tiên 2: Rào chắn đóng (is_look_up = true và không có người đỗ)
    fillColor = "#ef4444"; // Màu Đỏ (Red-500)
    statusText = "Locked";
  }

  // 2. Xử lý Hover
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onHover({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      slot,
      status: statusText,
    });
  };

  const handleMouseLeave = () => {
    onHover((prev: any) => ({ ...prev, visible: false }));
  };

  // Tính toán tọa độ tâm để đặt chữ (Dựa trên attribs của SVG)
  const x = parseFloat(attribs.x || 0) + parseFloat(attribs.width || 0) / 2;
  const y = parseFloat(attribs.y || 0) + parseFloat(attribs.height || 0) / 2;

  return (
    <g
      className="cursor-pointer transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hình khối của Slot */}
      <Tag
        {...attribs}
        fill={fillColor}
        className="hover:brightness-110"
      />

      {/* Hiển thị Slot Number ở giữa */}
      <text
        x={x}
        y={slotInfo?.is_vip ? y - 4 : y} // Nếu có chữ VIP thì đẩy số lên một chút
        textAnchor="middle"
        alignmentBaseline="middle"
        className="select-none pointer-events-none fill-slate-700 font-bold"
        style={{ fontSize: "10px" }}
      >
        {slot.slotNumber}
      </text>
    </g>
  );
}
