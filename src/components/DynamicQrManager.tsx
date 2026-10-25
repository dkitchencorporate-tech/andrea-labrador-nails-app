import React, { useState, useEffect, useRef } from 'react';
import { QREncoder } from '../utils/qrEncoder';
import {
  QrCode,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Plus,
  Eye,
  Smartphone,
  Globe,
  TrendingUp,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface DynamicQrItem {
  id: string;
  code: string;
  tenant_id: string;
  label: string;
  target_url: string;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export interface ScanEvent {
  id: number;
  code: string;
  tenant_id: string;
  scanned_at: string;
  device_type: string;
  country: string;
}

interface DynamicQrManagerProps {
  tenantSlug: 'capra-studio' | 'andrea-nails' | 'all';
  tenantName: string;
  onClose?: () => void;
}

export const DynamicQrManager: React.FC<DynamicQrManagerProps> = ({
  tenantSlug,
  tenantName,
  onClose,
}) => {
  const [qrList, setQrList] = useState<DynamicQrItem[]>([]);
  const [recentScans, setRecentScans] = useState<ScanEvent[]>([]);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [scansToday, setScansToday] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedQr, setSelectedQr] = useState<DynamicQrItem | null>(null);

  // Edit target state
  const [editingQr, setEditingQr] = useState<DynamicQrItem | null>(null);
  const [editTargetInput, setEditTargetInput] = useState<string>('');
  const [editLabelInput, setEditLabelInput] = useState<string>('');
  const [isSavingTarget, setIsSavingTarget] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Create new QR state
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [newTarget, setNewTarget] = useState<string>('');
  const [createError, setCreateError] = useState<string>('');

  // Custom styling state for the QR Vector Studio
  const [fgColor, setFgColor] = useState<string>(
    tenantSlug === 'capra-studio' ? '#B5838D' : '#1F1417'
  );
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [centerBadgeText, setCenterBadgeText] = useState<string>(
    tenantSlug === 'capra-studio' ? 'CAPRA' : 'VANESEV'
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch data from /api/qr
  const fetchQrData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/qr?tenant=${tenantSlug}`);
      if (res.ok) {
        const data = await res.json();
        setQrList(data.qrCodes || []);
        setRecentScans(data.recentScans || []);
        setTotalScans(data.totalScans || 0);
        setScansToday(data.scansToday || 0);
        if (data.qrCodes && data.qrCodes.length > 0 && !selectedQr) {
          setSelectedQr(data.qrCodes[0]);
        }
      }
    } catch (e) {
      console.error('Error loading QR data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQrData();
  }, [tenantSlug]);

  // Generate SVG string
  const getSelectedQrUrl = () => {
    if (!selectedQr) return 'https://vanesev.com';
    return `https://vanesev.com/r/${selectedQr.code}`;
  };

  const qrSvgString = React.useMemo(() => {
    try {
      const url = getSelectedQrUrl();
      const matrix = QREncoder.generateMatrix(url);
      return QREncoder.toSVG(matrix, {
        fgColor,
        bgColor,
        centerText: centerBadgeText.trim() ? centerBadgeText.trim() : undefined,
      });
    } catch (err) {
      console.error('Error generating QR SVG:', err);
      return '';
    }
  }, [selectedQr, fgColor, bgColor, centerBadgeText]);

  // Copy short link to clipboard
  const handleCopyLink = (code: string) => {
    const full = `https://vanesev.com/r/${code}`;
    navigator.clipboard.writeText(full);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Open Edit Modal
  const handleOpenEdit = (qr: DynamicQrItem) => {
    setEditingQr(qr);
    setEditTargetInput(qr.target_url);
    setEditLabelInput(qr.label);
    setSaveSuccessMsg('');
  };

  // Save new target destination (Instant update in DB without changing physical print)
  const handleSaveTarget = async () => {
    if (!editingQr || !editTargetInput.trim()) return;
    setIsSavingTarget(true);
    setSaveSuccessMsg('');

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_target',
          code: editingQr.code,
          targetUrl: editTargetInput.trim(),
          label: editLabelInput.trim() || editingQr.label,
        }),
      });

      if (res.ok) {
        setSaveSuccessMsg('¡Destino actualizado en vivo! El QR físico impreso sigue siendo el mismo.');
        await fetchQrData();
        setTimeout(() => {
          setEditingQr(null);
          setSaveSuccessMsg('');
        }, 1800);
      } else {
        const err = await res.json();
        alert(`Error al guardar: ${err.error || 'Intente nuevamente'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al actualizar destino');
    } finally {
      setIsSavingTarget(false);
    }
  };

  // Create new QR Code
  const handleCreateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTarget.trim()) {
      setCreateError('Por favor complete el código y la URL de destino');
      return;
    }

    const cleanCode = newCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const tenant = tenantSlug === 'all' ? 'capra-studio' : tenantSlug;

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          code: cleanCode,
          tenantId: tenant,
          label: newLabel.trim() || cleanCode,
          targetUrl: newTarget.trim(),
        }),
      });

      if (res.ok) {
        setIsCreatingNew(false);
        setNewCode('');
        setNewLabel('');
        setNewTarget('');
        setCreateError('');
        await fetchQrData();
      } else {
        const data = await res.json();
        setCreateError(data.error || 'Error al crear código');
      }
    } catch (err) {
      console.error(err);
      setCreateError('Error al conectar con la base de datos');
    }
  };

  // Download High-Resolution 300 DPI PNG
  const handleDownloadPng = () => {
    if (!selectedQr || !qrSvgString) return;

    const img = new Image();
    const svgBlob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      // High-resolution 1800x1800 px for crisp 300 DPI physical prints
      canvas.width = 1800;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1800, 1800);
        ctx.drawImage(img, 0, 0, 1800, 1800);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qr-vanesev-${selectedQr.code}-300dpi.png`;
        link.href = pngUrl;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Download Vector SVG
  const handleDownloadSvg = () => {
    if (!selectedQr || !qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-vanesev-${selectedQr.code}-vectorial.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0B0D11] text-white rounded-2xl border border-white/10 shadow-2xl p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C158] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tecnología QR Dinámico VANESEV
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Motor de Códigos QR Dinámicos & Analítica
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl">
            {tenantName} · El código físico se imprime <strong className="text-white">una sola vez</strong>. El destino se cambia en tiempo real desde este panel y cada escaneo se registra al instante.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQrData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Refrescar métricas"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d4b069] text-[#0B0D11] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-[#C5A059]/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo QR Dinámico</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-white/50 text-xs font-semibold mb-1">
            <span>Escaneos Hoy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{scansToday}</div>
          <p className="text-[11px] text-emerald-400 mt-1">Registrados en tiempo real</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-white/50 text-xs font-semibold mb-1">
            <span>Total Escaneos Histórico</span>
            <Smartphone className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="text-3xl font-black text-white">{totalScans}</div>
          <p className="text-[11px] text-white/40 mt-1">Acumulado en todos los códigos</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-white/50 text-xs font-semibold mb-1">
            <span>Códigos Dinámicos Activos</span>
            <QrCode className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{qrList.length}</div>
          <p className="text-[11px] text-white/40 mt-1">Listos con redirección 302</p>
        </div>
      </div>

      {/* Main Studio: Left QR Preview & Customizer, Right Codes List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Vector Studio (5 cols) */}
        <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              Estudio Vectorial de Impresión
            </h3>
            {selectedQr && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#E5C158] font-mono">
                /r/{selectedQr.code}
              </span>
            )}
          </div>

          {/* Live SVG Preview Box */}
          <div className="relative aspect-square max-w-[280px] mx-auto p-4 rounded-2xl bg-white shadow-2xl flex items-center justify-center">
            {qrSvgString ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: qrSvgString }}
              />
            ) : (
              <div className="text-neutral-400 text-xs">Cargando matriz QR...</div>
            )}
          </div>

          {/* Color Palettes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 block">
              Paleta de Color de Autor:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFgColor('#B5838D');
                  setBgColor('#FFFFFF');
                  setCenterBadgeText('CAPRA');
                }}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                  fgColor === '#B5838D' ? 'border-[#B5838D] bg-[#B5838D]/20 text-white' : 'border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#B5838D]" />
                <span>Capra Velvet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFgColor('#C5A059');
                  setBgColor('#0B0D11');
                  setCenterBadgeText('GOLD');
                }}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                  fgColor === '#C5A059' ? 'border-[#C5A059] bg-[#C5A059]/20 text-white' : 'border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#C5A059]" />
                <span>Oro Dark</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFgColor('#1F1417');
                  setBgColor('#FFFFFF');
                  setCenterBadgeText('VN');
                }}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                  fgColor === '#1F1417' ? 'border-white bg-white/20 text-white' : 'border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#1F1417]" />
                <span>Editorial</span>
              </button>
            </div>
          </div>

          {/* Monogram Badge text */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Monograma Central (Nivel de Corrección H - 30%):
            </label>
            <input
              type="text"
              value={centerBadgeText}
              maxLength={6}
              onChange={(e) => setCenterBadgeText(e.target.value.toUpperCase())}
              placeholder="Ej: CAPRA, AL, VIP"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Export / Download Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownloadPng}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-[#0B0D11] hover:bg-neutral-200 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PNG Alta Resolución (300 DPI)</span>
            </button>

            <button
              onClick={handleDownloadSvg}
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Descargar SVG Vectorial (Imprenta / Acrílico)</span>
            </button>

            {selectedQr && (
              <a
                href={`https://vanesev.com/r/${selectedQr.code}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 rounded-xl border border-white/15 hover:border-white/30 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition text-center"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Probar Redirección en Vivo (/r/{selectedQr.code})</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic QR List & Real-time Destination Editing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#C5A059]" />
              Códigos Activos ({qrList.length})
            </h3>
            <span className="text-xs text-white/50">
              Selecciona uno para visualizar o editar su destino
            </span>
          </div>

          {qrList.length === 0 && !isLoading ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-white/50 text-sm">
              No hay códigos registrados todavía. Haz clic en "Nuevo QR Dinámico".
            </div>
          ) : (
            <div className="space-y-3">
              {qrList.map((qr) => {
                const isSelected = selectedQr?.code === qr.code;
                return (
                  <div
                    key={qr.code}
                    onClick={() => setSelectedQr(qr)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#C5A059]/10 border-[#C5A059]/50 shadow-md shadow-[#C5A059]/10'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{qr.label}</span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-[#E5C158]">
                          vanesev.com/r/{qr.code}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                          {qr.scan_count} escaneos
                        </span>
                      </div>
                      <div className="text-xs text-white/60 flex items-center gap-1.5">
                        <span className="text-white/40">Destino actual:</span>
                        <span className="font-mono text-white/80 truncate max-w-[260px]">
                          {qr.target_url}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(qr.code);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer text-xs flex items-center gap-1"
                        title="Copiar enlace corto"
                      >
                        {copiedCode === qr.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(qr);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#d4b069] text-[#0B0D11] font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Cambiar Destino</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Live Scans Feed */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white/70 tracking-wider uppercase flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Últimos Escaneos en Tiempo Real
            </h4>
            {recentScans.length === 0 ? (
              <p className="text-xs text-white/40 italic">
                Aún no hay escaneos registrados hoy. Escanea tu QR de prueba con el móvil para ver la fila aparecer aquí.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                      <th className="py-2">Código</th>
                      <th className="py-2">Dispositivo</th>
                      <th className="py-2">País</th>
                      <th className="py-2 text-right">Fecha / Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentScans.slice(0, 8).map((scan) => (
                      <tr key={scan.id} className="text-white/80">
                        <td className="py-2 font-mono text-[#E5C158]">/r/{scan.code}</td>
                        <td className="py-2 capitalize">{scan.device_type || 'Móvil'}</td>
                        <td className="py-2">{scan.country || 'VE / Global'}</td>
                        <td className="py-2 text-right text-white/50">
                          {new Date(scan.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Edit Dynamic Destination (The core feature) */}
      {editingQr && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141A] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#C5A059]" />
                  Cambiar Destino del QR Dinámico
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Código: <strong className="text-[#E5C158] font-mono">/r/{editingQr.code}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingQr(null)}
                className="text-white/50 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C158] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Cero Re-impresión Física
                </p>
                <p className="text-[11px] text-white/80">
                  Cualquier persona que escanee el código impreso en tu salón, cartas o flyers irá de inmediato a esta nueva dirección.
                </p>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  Nombre descriptivo del código:
                </label>
                <input
                  type="text"
                  value={editLabelInput}
                  onChange={(e) => setEditLabelInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  URL de Destino Dinámico (donde aterriza el cliente):
                </label>
                <input
                  type="text"
                  value={editTargetInput}
                  onChange={(e) => setEditTargetInput(e.target.value)}
                  placeholder="Ej: /capra-studio, /capra-studio#promociones, o link externo"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#C5A059]"
                />
                <p className="text-[11px] text-white/40 mt-1">
                  Puedes ingresar rutas relativas (ej: <code className="text-white">/capra-studio#servicios</code>) o enlaces completos (ej: WhatsApp, Instagram).
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingQr(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveTarget}
                disabled={isSavingTarget}
                className="px-5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d4b069] text-[#0B0D11] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg transition"
              >
                {isSavingTarget ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando en Neon DB...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Guardar Destino Instantáneo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Dynamic QR */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateQr}
            className="bg-[#12141A] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#C5A059]" />
                  Crear Nuevo Código QR Dinámico
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Genera una URL corta propia protegida con analítica de escaneos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-white/50 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  Identificador corto (Slug para vanesev.com/r/...):
                </label>
                <div className="flex items-center bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white">
                  <span className="text-white/40 select-none">vanesev.com/r/</span>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="ej: promo-noviembre, flyer-mesa"
                    className="w-full bg-transparent focus:outline-none text-white font-mono pl-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  Nombre descriptivo / Etiqueta:
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="ej: Cartel de Entrada, Mesa 4, Campaña Black Friday"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  URL Inicial de Destino:
                </label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="ej: /capra-studio, /capra-studio#servicios"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono placeholder-white/30 focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d4b069] text-[#0B0D11] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg transition"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Crear Código</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
