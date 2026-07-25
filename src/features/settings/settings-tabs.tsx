"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProfileForm } from "@/features/settings/profile-form"
import { OrganizationForm } from "@/features/settings/organization-form"
import { ConnectionsSettings } from "@/features/settings/connections-settings"
import { cn } from "@/lib/utils"

type TabKey = "perfil" | "organizacao" | "conexoes"

const TABS: { key: TabKey; label: string }[] = [
  { key: "perfil", label: "Perfil" },
  { key: "organizacao", label: "Organização" },
  { key: "conexoes", label: "Conexões" },
]

const isTabKey = (value: string | null): value is TabKey =>
  value === "perfil" || value === "organizacao" || value === "conexoes"

export const SettingsTabs = () => {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState<TabKey>(isTabKey(tabFromUrl) ? tabFromUrl : "perfil")

  const tabButtons = TABS.map(tab => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={cn(
        "shrink-0 select-none whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all",
        activeTab === tab.key
          ? "bg-card text-foreground shadow-ambient"
          : "text-secondary-foreground opacity-60"
      )}
    >
      {tab.label}
    </button>
  ))

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-secondary p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabButtons}
      </div>
      {activeTab === "perfil" && <ProfileForm />}
      {activeTab === "organizacao" && <OrganizationForm />}
      {activeTab === "conexoes" && <ConnectionsSettings />}
    </div>
  )
}
