"use client"

import Image from "next/image"
import Link from "next/link"
import { LogOut, Megaphone, Plus } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Header = () => {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/">
          <Image
            src="/triAnuncios.png"
            alt="TriAnuncios"
            width={180}
            height={40}
            className="h-32 w-auto"
            priority
          />
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Button className="rounded-full gap-2" asChild>
              <Link href="/anuncios/criar">
                <Plus className="size-4" />
                Criar Anúncio
              </Link>
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="size-9 cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex items-center gap-3 py-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.organization_name}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/anuncios" className="cursor-pointer gap-2">
                  <Megaphone className="size-4" />
                  Meus Anúncios
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={signOut}
              >
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        ) : (
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
