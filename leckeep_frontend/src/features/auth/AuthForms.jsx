import { useState } from "react";
import { BookOpen, Eye, EyeOff, FileText, Lock, User } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { apiFetch } from "../../lib/apiClient";

const AuthForms = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: {
          username: formData.username.trim(),
          password: formData.password,
        },
      });

      if (data?.token && data?.userId) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        if (isLogin) onLoginSuccess?.();
        else onRegisterSuccess?.();
      } else {
        setError("Authentication response did not include a token and user ID.");
      }
    } catch (err) {
      console.error("Auth error details:", err);
      setError(err.message || "Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden min-h-[680px] flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_18rem),radial-gradient(circle_at_80%_70%,white,transparent_16rem)]" />
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <BookOpen size={28} />
            </div>
            <h1 className="mt-8 max-w-lg text-5xl font-extrabold leading-tight tracking-tight">
              Keep every note, document, and study resource organized in one secure workspace.
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/80">
              LecKeep helps you manage personal notes, uploaded files, subjects, and shared folders without losing track of important study material.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
              <FileText className="mb-4" size={24} />
              <p className="text-sm font-semibold">Structured note library</p>
              <p className="mt-1 text-xs text-primary-foreground/70">Organize files by subject, semester, and folder.</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
              <Lock className="mb-4" size={24} />
              <p className="text-sm font-semibold">Secure account access</p>
              <p className="mt-1 text-xs text-primary-foreground/70">Sign in to keep your workspace private and available.</p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Badge variant="secondary">LecKeep</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isLogin
                  ? "Access your notes, documents, subjects, and shared folders."
                  : "Set up a secure workspace for your notes and study documents."}
              </p>
            </div>
          </div>

          <Card className="border-border/80 p-6 shadow-none">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-semibold">Username</span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold">Password</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {!isLogin && (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Confirm password</span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}

              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                  ? "Sign in"
                  : "Create account"}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Do not have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin((prev) => !prev);
                setError("");
                setFormData({ username: "", password: "", confirmPassword: "" });
              }}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};

export default AuthForms;
