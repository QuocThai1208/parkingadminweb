"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Car } from "lucide-react";
import apiAxios from "@/config/api/apiAxios";
import { ENDPOINTS } from "@/config/api/endpoints";
import { useUserStore } from "@/src/stores/useUserStore";
import { toast } from "sonner";
import { useAppRouter } from "@/src/router/userAppRouter";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const {goToDashBoard} = useAppRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    // Demo validation
    if (!username) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsLoading(true);
      const res = await apiAxios.post(ENDPOINTS.AUTH.LOGIN, {username, password})
      if(!["ADMIN", "STAFF", "MANAGE"].includes(res.data?.user?.role)) {
        toast.success("Chỉ có nhân viên mới có thể truy cập.")
        return
      }
      localStorage.setItem("refresh", res.data?.refresh)
      localStorage.setItem("authToken", res.data?.access)
      setUser(res.data?.user)
      goToDashBoard()
    }catch(e){
      console.log("error at handleSubmit", e)
      toast.success("Mật khẩu hoặc tài khoản không đúng.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm">
      <div className="space-y-2 text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Đăng Nhập Hệ Thống
        </h1>
        <p className="text-muted-foreground">Quản lý bãi đậu xe thông minh</p>
      </div>

      <div className="mb-4">
        <div className="mb-2">Tên Đăng Nhập</div>
        <Input
          id="username"
          type="text"
          placeholder="Nhập tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="bg-secondary text-foreground placeholder:text-muted-foreground border-border"
          required
        />
        {error.username && (
          <div className="text-red-400 text-xs">{error.username}</div>
        )}
      </div>

      <div className="mb-4">
        <div className="mb-2">Mật Khẩu</div>
        <Input
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="bg-secondary text-foreground placeholder:text-muted-foreground border-border"
          required
        />
        {error.password && (
          <div className="text-red-400 text-xs">{error.password}</div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-medium"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </div>
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground pt-2">
        <p>
          Demo: Username:{" "}
          <span className="font-mono text-foreground">admin</span>
        </p>
        <p>
          Demo: Password:{" "}
          <span className="font-mono text-foreground">admin</span>
        </p>
      </div>
    </form>
  );
}
