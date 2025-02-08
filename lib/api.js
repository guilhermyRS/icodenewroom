import { supabase } from './supabase'

export const api = {
  // Buscar todas as salas
  async getRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(room => ({
      ...room,
      dias_semana: Array.isArray(room.dias_semana) ? room.dias_semana : [],
      status: Boolean(room.status)
    })) || []
  },

  // Criar uma sala
  async createRoom(roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{
        ...roomData,
        dias_semana: Array.isArray(roomData.dias_semana) ? roomData.dias_semana : [],
        status: Boolean(roomData.status)
      }])
      .select()

    if (error) throw error
    return data?.[0]
  },

  // Atualizar uma sala
  async updateRoom(id, roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .update({
        ...roomData,
        dias_semana: Array.isArray(roomData.dias_semana) ? roomData.dias_semana : [],
        status: Boolean(roomData.status),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data?.[0]
  },

  // Atualizar status da sala
  async updateRoomStatus(id, status) {
    const { error } = await supabase
      .from('rooms')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  },

  // Deletar uma sala
  async deleteRoom(id) {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}