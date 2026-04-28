"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { signUpAction } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Mail, Lock, User, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useFormStatus } from "react-dom"

function SignUpSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-sm transition-all duration-200"
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size="sm" className="text-accent-foreground [&_svg]:text-current" />
          <span>Registrando...</span>
        </span>
      ) : (
        <>
          Crear cuenta
          <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
        </>
      )}
    </Button>
  )
}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, null)

  useEffect(() => {
    if (state && "success" in state) {
      toast.success(
        "Cuenta creada. Revisa tu email para confirmar el registro.",
        { duration: 6000 }
      )
    }
  }, [state])

  const errorMessage = state && "error" in state ? state.error : ""

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-navy flex-col justify-between p-12 xl:p-16 text-navy-foreground">
        <div>
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl xl:text-3xl font-bold text-accent tracking-wide">
              CHIVANA
            </span>
            <span className="block text-[10px] xl:text-xs tracking-[0.25em] uppercase text-navy-foreground/70 mt-1">
              Real Estate
            </span>
          </Link>
        </div>
        <div className="space-y-6">
          <div className="h-px w-16 bg-accent/60" />
          <p className="font-serif text-lg xl:text-xl text-navy-foreground/90 max-w-xs leading-relaxed">
            Crea tu cuenta para acceder al panel de administración de Chivana.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-sm space-y-10">
          <div className="lg:hidden text-center">
            <Link href="/">
              <span className="font-serif text-xl font-bold text-accent tracking-wide">
                CHIVANA
              </span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-0.5">
                Real Estate
              </span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Crear cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Introduce tus datos para registrarte.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nombre
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className="pl-10 h-12 bg-transparent border-b border-input rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  className="pl-10 h-12 bg-transparent border-b border-input rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="pl-10 h-12 bg-transparent border-b border-input rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent transition-colors"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-destructive" role="alert">
                {errorMessage}
              </p>
            )}

            <SignUpSubmitButton />
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-accent hover:underline underline-offset-4"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
