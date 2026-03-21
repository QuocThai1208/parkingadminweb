import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md">
        <div className="w-full backdrop-blur-sm bg-card/40 border border-border rounded-2xl p-8 shadow-2xl shadow-black/20">
          <LoginForm />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Hệ thống quản lý bãi đậu xe thông minh</p>
          <p className="mt-1 text-xs">© 2026 Smart Parking System</p>
        </div>
      </div>
    </main>
  )
}
