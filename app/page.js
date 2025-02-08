"use client"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import RoomCard from "@/components/RoomCard"
import RoomDetailsModal from "@/components/RoomDetailsModal"
import Navbar from "@/components/Navbar"
import { createClient } from '@supabase/supabase-js'
import { FaFilter, FaClock } from "react-icons/fa"

// Inicialize o cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [filters, setFilters] = useState({
    diaSemana: "",
    turno: "",
    salaAula: "",
  })
  const [uniqueTurnos, setUniqueTurnos] = useState([])
  const [uniqueSalas, setUniqueSalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedWeather, setSelectedWeather] = useState("clear")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Função para obter o turno atual
  const getCurrentTurno = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return "Matutino"
    if (hour >= 12 && hour < 18) return "Vespertino"
    return "Noturno"
  }

  // Função para obter o dia da semana atual
  const getCurrentDayOfWeek = () => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    return days[new Date().getDay()]
  }

  useEffect(() => {
    fetchRooms()
    setTimeBasedFilters() // Define os filtros iniciais baseados no horário atual
  }, [])

  // Função para atualizar os filtros baseados no horário
  const setTimeBasedFilters = () => {
    setFilters(prev => ({
      ...prev,
      diaSemana: getCurrentDayOfWeek(),
      turno: getCurrentTurno()
    }))
  }

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setRooms(data || [])

      const turnos = [...new Set(data.map((room) => room.turno))]
      const salas = [...new Set(data.map((room) => room.sala_aula))]

      setUniqueTurnos(turnos)
      setUniqueSalas(salas)
    } catch (error) {
      console.error("Erro detalhado:", error)
      setError("Erro ao carregar as salas. Tente novamente.")
      toast.error("Falha ao carregar as salas")
    } finally {
      setLoading(false)
    }
  }

  const handleRoomClick = (room, weather) => {
    setSelectedRoom(room)
    setSelectedWeather(weather)
    setIsModalOpen(true)
  }

  const filteredRooms = rooms.filter((room) => {
    const diasSemana = Array.isArray(room.dias_semana) ? room.dias_semana : []
    return (
      (!filters.diaSemana || diasSemana.includes(filters.diaSemana)) &&
      (!filters.turno || room.turno === filters.turno) &&
      (!filters.salaAula || room.sala_aula === filters.salaAula)
    )
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando salas...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchRooms} 
              className="btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Salas Disponíveis</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaFilter className="mr-2 text-primary" />
              Filtros
            </h2>
            <button
              onClick={setTimeBasedFilters}
              className="btn-secondary flex items-center text-sm"
              title="Usar horário atual"
            >
              <FaClock className="mr-2" />
              Usar horário atual
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.diaSemana}
              onChange={(e) => setFilters({ ...filters, diaSemana: e.target.value })}
              className="input-field"
            >
              <option value="">Todos os dias</option>
              <option value="Segunda">Segunda</option>
              <option value="Terça">Terça</option>
              <option value="Quarta">Quarta</option>
              <option value="Quinta">Quinta</option>
              <option value="Sexta">Sexta</option>
              <option value="Sábado">Sábado</option>
            </select>

            <select
              value={filters.turno}
              onChange={(e) => setFilters({ ...filters, turno: e.target.value })}
              className="input-field"
            >
              <option value="">Todos os turnos</option>
              {uniqueTurnos.map((turno) => (
                <option key={turno} value={turno}>
                  {turno}
                </option>
              ))}
            </select>

            <select
              value={filters.salaAula}
              onChange={(e) => setFilters({ ...filters, salaAula: e.target.value })}
              className="input-field"
            >
              <option value="">Todas as salas</option>
              {uniqueSalas.map((sala) => (
                <option key={sala} value={sala}>
                  {sala}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({
                  diaSemana: "",
                  turno: "",
                  salaAula: "",
                })
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhuma sala encontrada com os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={handleRoomClick}
              />
            ))}
          </div>
        )}
      </div>

      <RoomDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
        weather={selectedWeather}
      />
    </>
  )
}