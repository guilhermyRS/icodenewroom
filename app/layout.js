import "./globals.css"
import Sidebar from "@/components/Sidebar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const metadata = {
  title: "Sistema de Gerenciamento de Salas",
  description: "Gerencie salas de aula de forma eficiente",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  )
}

