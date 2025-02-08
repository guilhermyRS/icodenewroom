"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaChalkboardTeacher, FaSignInAlt, FaChevronDown } from "react-icons/fa"

export default function Sidebar() {
  const pathname = usePathname()
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const menuItems = [
    { name: "Início", icon: FaHome, path: "/" },
    { name: "Entrar", icon: FaSignInAlt, path: "/entrar" },
  ]

  const panelItems = [
    { name: "Gerenciar Salas", path: "/dashboard/salas" },
    { name: "Gerenciar Reservas", path: "/dashboard/reservas" },
    { name: "Relatórios", path: "/dashboard/relatorios" },
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-primary text-2xl font-semibold">ICODENEWroom</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.path
                        ? "bg-gray-300 text-primary"
                        : "text-gray-600 hover:bg-gray-300 hover:text-primary"
                    }`}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-6 w-6" />
                    {item.name}
                  </Link>
                )
              })}
              <div>
                <button
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                    pathname.startsWith('/dashboard/')
                      ? "bg-gray-300 text-primary"
                      : "text-gray-600 hover:bg-gray-300 hover:text-primary"
                  }`}
                >
                  <div className="flex items-center">
                    <FaChalkboardTeacher className="mr-3 flex-shrink-0 h-6 w-6" />
                    Painel
                  </div>
                  <FaChevronDown className={`h-4 w-4 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPanelOpen && (
                  <div className="pl-11 space-y-1 mt-1">
                    {panelItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`block py-2 px-3 rounded-md text-sm font-medium ${
                          pathname === item.path
                            ? "bg-gray-300 text-primary"
                            : "text-gray-600 hover:bg-gray-300 hover:text-primary"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}