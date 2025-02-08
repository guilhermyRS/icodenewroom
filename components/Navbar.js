"use client"
import { useState } from "react"
import Link from "next/link"
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <nav className="bg-gray-200 fixed top-0 left-0 right-0 z-50 lg:hidden">
      <div className="px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                ICODENEWroom
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-gray-300">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              href="/"
              className="block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-300 hover:text-primary transition-colors"
            >
              Início
            </Link>
            <div>
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-300 hover:text-primary transition-colors"
              >
                Painel
                <FaChevronDown className={`h-4 w-4 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} />
              </button>
              {isPanelOpen && (
                <div className="pl-6 space-y-1">
                  <Link
                    href="/dashboard/salas"
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-300 hover:text-primary transition-colors"
                  >
                    Gerenciar Salas
                  </Link>
                  <Link
                    href="/dashboard/reservas"
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-300 hover:text-primary transition-colors"
                  >
                    Gerenciar Reservas
                  </Link>
                  <Link
                    href="/dashboard/relatorios"
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-300 hover:text-primary transition-colors"
                  >
                    Relatórios
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/entrar"
              className="block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-300 hover:text-primary transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}