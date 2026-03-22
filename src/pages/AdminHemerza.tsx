import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Download, FileText, Eye, ChevronDown, ChevronUp, Search, LogOut } from "lucide-react";

const ADMIN_PASSWORD = "hemerza2026";

interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  payment_method: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  instagram: string | null;
  email: string | null;
  created_at: string;
  orders: Order[];
}

const AdminHemerza = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const db = supabase as any;

    const { data: custData } = await db.from("customers").select("*").order("created_at", { ascending: false });
    const { data: ordersData } = await db.from("orders").select("*").order("created_at", { ascending: false });
    const { data: itemsData } = await db.from("order_items").select("*");

    if (!custData || !ordersData) { setLoading(false); return; }

    const itemsByOrder: Record<string, OrderItem[]> = {};
    (itemsData || []).forEach((item: any) => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    });

    const ordersByCustomer: Record<string, Order[]> = {};
    ordersData.forEach((o: any) => {
      if (!ordersByCustomer[o.customer_id]) ordersByCustomer[o.customer_id] = [];
      ordersByCustomer[o.customer_id].push({ ...o, items: itemsByOrder[o.id] || [] });
    });

    // Only customers with at least one order
    const result: Customer[] = custData
      .filter((c: any) => ordersByCustomer[c.id]?.length > 0)
      .map((c: any) => ({ ...c, orders: ordersByCustomer[c.id] || [] }));

    setCustomers(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.id.slice(0, 8).includes(search.toLowerCase())
  );

  const buildInvoiceText = (c: Customer, o: Order) => {
    const lines = [
      `═══════════════════════════════════`,
      `        FACTURA HEMERZA`,
      `═══════════════════════════════════`,
      `ID Cliente: ${c.id.slice(0, 8).toUpperCase()}`,
      `Nombre: ${c.name}`,
      `Teléfono: ${c.phone}`,
      c.instagram ? `Instagram: @${c.instagram}` : null,
      c.email ? `Email: ${c.email}` : null,
      ``,
      `Pedido: ${o.order_number}`,
      `Fecha: ${new Date(o.created_at).toLocaleDateString("es-PA")}`,
      `Método de pago: ${o.payment_method}`,
      `Estado: ${o.status}`,
      `───────────────────────────────────`,
      ...o.items.map((it, i) => `${i + 1}. ${it.product_name} | ${it.size} | x${it.quantity} | $${it.price * it.quantity}`),
      `───────────────────────────────────`,
      `TOTAL: $${o.total} USD`,
      `═══════════════════════════════════`,
    ];
    return lines.filter(Boolean).join("\n");
  };

  const downloadTxt = (c: Customer) => {
    const text = c.orders.map(o => buildInvoiceText(c, o)).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cliente-${c.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadAllTxt = () => {
    const text = filtered.map(c => c.orders.map(o => buildInvoiceText(c, o)).join("\n\n")).join("\n\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hemerza-clientes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadPdf = (c: Customer) => {
    const text = c.orders.map(o => buildInvoiceText(c, o)).join("\n\n");
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Cliente ${c.id.slice(0, 8)}</title><style>body{font-family:monospace;white-space:pre-wrap;padding:2rem;font-size:13px}@media print{body{padding:0}}</style></head><body>${text.replace(/\n/g, "<br>")}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  const downloadAllPdf = () => {
    const text = filtered.map(c => c.orders.map(o => buildInvoiceText(c, o)).join("\n\n")).join("\n\n\n");
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>HEMERZA Clientes</title><style>body{font-family:monospace;white-space:pre-wrap;padding:2rem;font-size:12px}@media print{body{padding:0}}</style></head><body>${text.replace(/\n/g, "<br>")}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <div className="flex flex-col items-center gap-2">
            <Lock className="h-8 w-8 text-amber-500" />
            <h1 className="font-serif text-lg font-bold text-white">Admin HEMERZA</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            placeholder="Contraseña"
            className={`w-full rounded-lg border bg-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition ${error ? "border-red-500" : "border-neutral-700 focus:border-amber-500"}`}
            autoFocus
          />
          {error && <p className="text-center text-xs text-red-400">Contraseña incorrecta</p>}
          <button type="submit" className="w-full rounded-lg bg-amber-600 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 active:scale-95">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ── Admin dashboard ──
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 py-3 backdrop-blur-sm sm:px-8">
        <h1 className="font-serif text-lg font-bold">
          <span className="text-amber-500">HEMERZA</span> Admin
        </h1>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-400">
            {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
          </span>
          <button onClick={() => setAuthenticated(false)} className="rounded-lg p-2 text-neutral-500 hover:text-white transition" title="Salir">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono o ID..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-amber-600"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={downloadAllTxt} className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-amber-600 hover:text-white active:scale-95">
              <FileText className="h-3.5 w-3.5" /> TXT
            </button>
            <button onClick={downloadAllPdf} className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 active:scale-95">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
        </div>

        {/* Customer list */}
        {loading ? (
          <div className="py-20 text-center text-neutral-500">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            {search ? "Sin resultados" : "No hay clientes con compras aún"}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => {
              const isOpen = expandedCustomer === c.id;
              const totalSpent = c.orders.reduce((s, o) => s + Number(o.total), 0);
              return (
                <div key={c.id} className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                  {/* Row */}
                  <button
                    onClick={() => setExpandedCustomer(isOpen ? null : c.id)}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-neutral-800/50 sm:px-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-600/20 text-xs font-bold text-amber-500">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-neutral-500">ID: {c.id.slice(0, 8).toUpperCase()} · {c.phone}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-amber-400">${totalSpent}</p>
                      <p className="text-[10px] text-neutral-500">{c.orders.length} pedido{c.orders.length !== 1 ? "s" : ""}</p>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-500" /> : <ChevronDown className="h-4 w-4 text-neutral-500" />}
                  </button>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="border-t border-neutral-800 px-4 py-4 sm:px-6">
                      <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-neutral-400">
                        {c.instagram && <p>IG: @{c.instagram}</p>}
                        {c.email && <p>Email: {c.email}</p>}
                        <p>Registro: {new Date(c.created_at).toLocaleDateString("es-PA")}</p>
                      </div>

                      {c.orders.map(o => (
                        <div key={o.id} className="mb-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-amber-400">{o.order_number}</span>
                              <span className="ml-2 text-[10px] text-neutral-500">{new Date(o.created_at).toLocaleDateString("es-PA")}</span>
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.status === "pendiente" || o.status === "pendiente_entrega" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                              {o.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {o.items.map(it => (
                              <div key={it.id} className="flex justify-between text-xs">
                                <span className="text-neutral-300">{it.product_name} ({it.size}) x{it.quantity}</span>
                                <span className="text-neutral-400">${it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex items-center justify-between border-t border-neutral-800 pt-2">
                            <span className="text-xs text-neutral-500">Pago: {o.payment_method}</span>
                            <span className="text-sm font-bold text-white">${o.total}</span>
                          </div>
                        </div>
                      ))}

                      <div className="mt-3 flex gap-2">
                        <button onClick={() => downloadTxt(c)} className="flex items-center gap-1 rounded-md border border-neutral-700 px-2.5 py-1.5 text-[10px] text-neutral-400 hover:text-white transition active:scale-95">
                          <FileText className="h-3 w-3" /> TXT
                        </button>
                        <button onClick={() => downloadPdf(c)} className="flex items-center gap-1 rounded-md border border-neutral-700 px-2.5 py-1.5 text-[10px] text-neutral-400 hover:text-white transition active:scale-95">
                          <Eye className="h-3 w-3" /> PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHemerza;
