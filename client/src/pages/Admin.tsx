import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getGoogleLoginUrl, getLoginUrl, isOAuthEnabled } from "@/const";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, X, Upload, Loader2, ShieldAlert, LogOut, Package, Eye, LockKeyhole
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Perfume } from "../../../drizzle/schema";

const categoryLabels: Record<string, string> = { women: "Women", men: "Men", unisex: "Unisex" };
const typeLabels: Record<string, string> = { arabic: "Arabic", designer: "Designer" };

interface PerfumeFormData {
  name: string;
  description: string;
  price: string;
  category: "women" | "men" | "unisex";
  type: "arabic" | "designer";
  imageUrl: string;
  imageKey: string;
  inStock: number;
  isNewArrival: number;
}

const emptyForm: PerfumeFormData = {
  name: "",
  description: "",
  price: "",
  category: "women",
  type: "arabic",
  imageUrl: "",
  imageKey: "",
  inStock: 1,
  isNewArrival: 0,
};

function PerfumeFormDialog({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<PerfumeFormData>;
  onSave: (data: PerfumeFormData) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<PerfumeFormData>({ ...emptyForm, ...initial });
  const [imagePreview, setImagePreview] = useState<string>(initial?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadImage = trpc.perfumes.uploadImage.useMutation();

  const set = (k: keyof PerfumeFormData, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onerror = () => {
      toast.error("Image upload failed");
      setUploading(false);
    };
    reader.onload = async (ev) => {
      try {
        const dataUrl = ev.target?.result as string;
        setImagePreview(dataUrl);
        const result = await uploadImage.mutateAsync({
          filename: file.name,
          contentType: file.type,
          dataUrl,
        });
        setForm((f) => ({ ...f, imageUrl: result.url, imageKey: result.key }));
        setImagePreview(result.url);
        toast.success("Image uploaded");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Image upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { toast.error("Valid price is required"); return; }
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {initial?.name ? "Edit Perfume" : "Add New Perfume"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Image upload */}
          <div className="space-y-2">
            <Label className="text-xs tracking-wide uppercase font-sans">Product Image</Label>
            <div
              className="relative w-full aspect-[3/2] rounded-lg border-2 border-dashed border-[var(--border)] overflow-hidden cursor-pointer hover:border-[var(--gold)] transition-colors flex items-center justify-center bg-muted"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8 opacity-40" />
                  <span className="text-xs font-sans">Click to upload image</span>
                  <span className="text-xs font-sans opacity-60">JPG, PNG, WEBP · Max 5 MB</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs tracking-wide uppercase font-sans">Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Oud Al Layl" required />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="desc" className="text-xs tracking-wide uppercase font-sans">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Fragrance notes, story..." rows={3} />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-xs tracking-wide uppercase font-sans">Price (KSH) *</Label>
            <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" required />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs tracking-wide uppercase font-sans">Category *</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v as "women" | "men" | "unisex")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs tracking-wide uppercase font-sans">Type *</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v as "arabic" | "designer")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wide uppercase font-sans">Stock Status</Label>
            <Select value={String(form.inStock)} onValueChange={(v) => set("inStock", parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">In Stock</SelectItem>
                <SelectItem value="0">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New Arrival */}
          <div className="space-y-1.5">
            <Label className="text-xs tracking-wide uppercase font-sans">Mark as New Arrival</Label>
            <Select value={String(form.isNewArrival)} onValueChange={(v) => set("isNewArrival", parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Regular</SelectItem>
                <SelectItem value="1">New Arrival</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || uploading} style={{ background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))", color: "white" }}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {initial?.name ? "Save Changes" : "Add Perfume"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Admin() {
  const loginUrl = getLoginUrl();
  const googleLoginUrl = getGoogleLoginUrl();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { data: authProviders } = trpc.auth.providers.useQuery();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editPerfume, setEditPerfume] = useState<Perfume | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState<"all" | "women" | "men" | "unisex">("all");

  const utils = trpc.useUtils();
  const { data: perfumes, isLoading: loadingPerfumes } = trpc.perfumes.list.useQuery();

  const createMutation = trpc.perfumes.create.useMutation({
    onSuccess: () => { utils.perfumes.list.invalidate(); setAddOpen(false); toast.success("Perfume added!"); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.perfumes.update.useMutation({
    onSuccess: () => { utils.perfumes.list.invalidate(); setEditPerfume(null); toast.success("Perfume updated!"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.perfumes.delete.useMutation({
    onSuccess: () => { utils.perfumes.list.invalidate(); setDeleteId(null); toast.success("Perfume deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const localLoginMutation = trpc.auth.loginLocal.useMutation({
    onSuccess: async () => {
      toast.success("Admin signed in");
      await utils.auth.me.fetch();
      setPassword("");
      window.location.href = "/admin";
    },
    onError: (e) => toast.error(e.message),
  });

  // Auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <ShieldAlert className="w-12 h-12 opacity-40" style={{ color: "var(--gold)" }} />
        <h1 className="text-2xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Admin Access Required
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Please sign in with your admin account to manage the Lumina Glow catalog.
        </p>
        {authProviders?.googleEnabled ? (
          <a
            href={googleLoginUrl}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm tracking-widest uppercase font-sans font-medium"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))", color: "white" }}
          >
            Sign In With Google
          </a>
        ) : null}
        {authProviders?.localAdminEnabled ? (
          <Card className="w-full max-w-md border-[var(--border)] bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
                <LockKeyhole className="w-5 h-5" style={{ color: "var(--gold)" }} />
              </div>
              <CardTitle className="font-serif text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Local Admin Login
              </CardTitle>
              <CardDescription>
                Sign in with the admin username and password configured on the server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await localLoginMutation.mutateAsync({ username, password });
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="admin-username" className="text-xs tracking-wide uppercase font-sans">
                    Username
                  </Label>
                  <Input
                    id="admin-username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    placeholder="Admin username"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-password" className="text-xs tracking-wide uppercase font-sans">
                    Password
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Admin password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={localLoginMutation.isPending || !username.trim() || !password}
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))", color: "white" }}
                >
                  {localLoginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : isOAuthEnabled && loginUrl ? (
          <a
            href={loginUrl}
            className="px-8 py-3 rounded-full text-sm tracking-widest uppercase font-sans font-medium"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))", color: "white" }}
          >
            Sign In
          </a>
        ) : (
          <div className="text-sm text-muted-foreground text-center max-w-xs">
            Admin sign-in is currently unavailable. Configure OAuth or set `ADMIN_USERNAME` and `ADMIN_PASSWORD` on the server.
          </div>
        )}
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <ShieldAlert className="w-12 h-12 opacity-40 text-destructive" />
        <h1 className="text-2xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Access Denied
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Your account does not have admin privileges. Please contact the store owner.
        </p>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Back to Store
        </Button>
      </div>
    );
  }

  const filtered = (perfumes || []).filter((p) => filterCat === "all" || p.category === filterCat);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur-md"
      >
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-lg font-serif font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)" }}>
                LUMINA GLOW
              </span>
              <span className="ml-2 text-xs tracking-widest uppercase font-sans text-muted-foreground">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View Store
            </a>
            <span className="hidden sm:block text-xs font-sans text-muted-foreground">
              {user.name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => { logout(); window.location.href = '/'; }} className="gap-1.5 text-xs">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Perfumes", value: perfumes?.length ?? 0, icon: Package },
            { label: "Women", value: perfumes?.filter((p) => p.category === "women").length ?? 0, icon: () => <span className="text-lg">🌸</span> },
            { label: "Men", value: perfumes?.filter((p) => p.category === "men").length ?? 0, icon: () => <span className="text-lg">🌿</span> },
            { label: "Unisex", value: perfumes?.filter((p) => p.category === "unisex").length ?? 0, icon: () => <span className="text-lg">✨</span> },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "oklch(0.93 0.03 75)" }}>
                <stat.icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p className="text-2xl font-serif font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{stat.value}</p>
                <p className="text-xs font-sans text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Manage Perfumes
            </h1>
            <p className="text-xs font-sans text-muted-foreground mt-0.5">
              Add, edit, or remove products from your catalog
            </p>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="gap-2"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.50 0.10 65))", color: "white" }}
          >
            <Plus className="w-4 h-4" />
            Add Perfume
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-card w-fit mb-6">
          {(["all", "women", "men", "unisex"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-sans font-medium transition-all duration-200"
              style={
                filterCat === cat
                  ? { background: "var(--foreground)", color: "var(--background)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {cat === "all" ? "All" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Product Table */}
        {loadingPerfumes ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="w-10 h-10 mb-4 opacity-30" style={{ color: "var(--gold)" }} />
            <p className="text-lg font-serif font-light text-muted-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No perfumes yet
            </p>
            <p className="text-sm font-sans text-muted-foreground mt-1">Click "Add Perfume" to get started.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-[var(--border)] overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]" style={{ background: "var(--muted)" }}>
                    <th className="text-left px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Image</th>
                    <th className="text-left px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Price</th>
                    <th className="text-left px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Stock</th>
                    <th className="text-right px-4 py-3 text-xs tracking-widest uppercase font-sans font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={p.imageUrl || `https://placehold.co/48x48/f5f0e8/c9a96e?text=${encodeURIComponent(p.name[0])}`}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-serif font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</p>
                        {p.description && (
                          <p className="text-xs text-muted-foreground font-sans line-clamp-1 mt-0.5">{p.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-sans font-medium px-2 py-1 rounded-full bg-muted">
                          {categoryLabels[p.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-sans font-medium px-2 py-1 rounded-full" style={{ background: "oklch(0.93 0.03 75)", color: "var(--gold-dark, oklch(0.45 0.10 65))" }}>
                          {typeLabels[p.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.isNewArrival === 1 && (
                          <span className="text-xs font-sans font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                            New Arrival
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-serif font-semibold" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>
                          KSH {parseFloat(String(p.price)).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-sans px-2 py-1 rounded-full ${p.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditPerfume(p)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(p.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="bg-card rounded-xl border border-[var(--border)] p-4 flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={p.imageUrl || `https://placehold.co/64x64/f5f0e8/c9a96e?text=${encodeURIComponent(p.name[0])}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-sans text-muted-foreground">{categoryLabels[p.category]}</span>
                      <span className="text-xs font-sans text-muted-foreground">·</span>
                      <span className="text-xs font-sans text-muted-foreground">{typeLabels[p.type]}</span>
                    </div>
                    <p className="text-sm font-serif font-semibold mt-1" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>
                      KSH {parseFloat(String(p.price)).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => setEditPerfume(p)} className="h-8 w-8 p-0">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="h-8 w-8 p-0 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Dialog */}
      <PerfumeFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(data) => createMutation.mutate(data)}
        isSaving={createMutation.isPending}
      />

      {/* Edit Dialog */}
      {editPerfume && (
        <PerfumeFormDialog
          open={!!editPerfume}
          onClose={() => setEditPerfume(null)}
          initial={{
            name: editPerfume.name,
            description: editPerfume.description || "",
            price: String(editPerfume.price),
            category: editPerfume.category,
            type: editPerfume.type,
            imageUrl: editPerfume.imageUrl || "",
            imageKey: editPerfume.imageKey || "",
            inStock: editPerfume.inStock,
            isNewArrival: editPerfume.isNewArrival,
          }}
          onSave={(data) => updateMutation.mutate({ id: editPerfume.id, data })}
          isSaving={updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Delete Perfume?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans">
              This action cannot be undone. The perfume will be permanently removed from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
