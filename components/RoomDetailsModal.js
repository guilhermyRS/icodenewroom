"use client"
import { FaTimes, FaCalendar, FaSun, FaCloud, FaMoon, FaMapMarkerAlt, FaUserTie, FaBook, FaClock, FaBuilding } from "react-icons/fa"

export default function RoomDetailsModal({ isOpen, onClose, room, weather }) {
  if (!isOpen || !room) return null

  const getWeatherIcon = () => {
    switch (weather) {
      case "clear":
        return <FaSun className="text-yellow-500 text-xl" />
      case "cloudy":
        return <FaCloud className="text-gray-500 text-xl" />
      case "night":
        return <FaMoon className="text-indigo-500 text-xl" />
      default:
        return null
    }
  }

  const getTurnoColor = (turno) => {
    // Cores baseadas no clima e turno
    const weatherColors = {
      clear: {
        "Matutino": "bg-yellow-400", // Sol da manhã (amarelo vibrante)
        "Vespertino": "bg-orange-500", // Sol da tarde (laranja)
        "Noturno": "bg-indigo-700"  // Noite clara (azul escuro)
      },
      cloudy: {
        "Matutino": "bg-blue-300",   // Manhã nublada (azul claro)
        "Vespertino": "bg-gray-400",   // Tarde nublada (cinza)
        "Noturno": "bg-gray-700"    // Noite nublada (cinza escuro)
      },
      night: {
        "Matutino": "bg-indigo-400", // Amanhecer (índigo claro)
        "Vespertino": "bg-indigo-600", // Entardecer (índigo médio)
        "Noturno": "bg-indigo-900"  // Noite profunda (índigo escuro)
      }
    }

    return weatherColors[weather]?.[turno] || "bg-gray-500"
  }

  const getTurnoTextColor = (turno) => {
    // Cores de texto baseadas no clima e turno
    const textColors = {
      clear: {
        "Matutino": "text-yellow-600",
        "Vespertino": "text-orange-600",
        "Noturno": "text-indigo-600"
      },
      cloudy: {
        "Matutino": "text-blue-600",
        "Vespertino": "text-gray-600",
        "Noturno": "text-gray-800"
      },
      night: {
        "Matutino": "text-indigo-400",
        "Vespertino": "text-indigo-600",
        "Noturno": "text-indigo-800"
      }
    }

    return textColors[weather]?.[turno] || "text-gray-600"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header com cor dinâmica baseada no turno/clima */}
        <div className={`${getTurnoColor(room.turno)} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaBuilding className="text-3xl" />
              {room.sala_aula}
            </h2>
            <div className="flex items-center space-x-2">
              {getWeatherIcon()}
              <span className="text-white font-medium">{room.turno}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Status</span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              room.status 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {room.status ? "Aberto" : "Fechado"}
            </span>
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaBook className={`mt-1 ${getTurnoTextColor(room.turno)}`} />
                <div>
                  <p className="text-sm text-gray-500">Disciplina</p>
                  <p className="font-medium">{room.disciplina}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaUserTie className={`mt-1 ${getTurnoTextColor(room.turno)}`} />
                <div>
                  <p className="text-sm text-gray-500">Professor</p>
                  <p className="font-medium">{room.docente}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className={`mt-1 ${getTurnoTextColor(room.turno)}`} />
                <div>
                  <p className="text-sm text-gray-500">Unidade</p>
                  <p className="font-medium">{room.unidade}</p>
                </div>
              </div>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaBook className={`mt-1 ${getTurnoTextColor(room.turno)}`} />
                <div>
                  <p className="text-sm text-gray-500">Curso</p>
                  <p className="font-medium">{room.curso}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaClock className={`mt-1 ${getTurnoTextColor(room.turno)}`} />
                <div>
                  <p className="text-sm text-gray-500">Período</p>
                  <p className="font-medium">{room.periodo}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaCalendar className={`mt-1 ${getTurnoTextColor(room.turno)}`} />
                <div>
                  <p className="text-sm text-gray-500">Dias da Semana</p>
                  <p className="font-medium">
                    {Array.isArray(room.dias_semana) 
                      ? room.dias_semana.join(", ") 
                      : room.dias_semana}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${getTurnoColor(room.turno)} hover:opacity-90`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}