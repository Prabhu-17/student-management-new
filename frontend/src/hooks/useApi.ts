import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Student,
  Analytics,
  AuditLog,
  PaginatedResponse,
  AuthResponse,
} from '@/types'

// ------------------- Auth API hooks -------------------
export const useLogin = () => {
  return useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      const response = await api.post('/api/auth/login', credentials)
      return response.data
    },
  })
}

export const useRegister = () => {
  return useMutation<
    AuthResponse,
    Error,
    { name: string; email: string; password: string; role: string }
  >({
    mutationFn: async (userData) => {
      const response = await api.post('/api/auth/register', userData)
      return response.data
    },
  })
}

// ------------------- Students API hooks -------------------
export function useStudents(params: {
  page: number
  limit: number
  search?: string
  className?: string
  gender?: string
}) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: async () => {
      const { data } = await api.get('/api/students', { params })

      // backend returns: { success, message, data: { items, totalPages, ... } }
      const students = data?.data?.items ?? []
      const totalPages = data?.data?.totalPages ?? 1

      // normalize _id → id
      return {
        data: students.map((s: any) => ({ ...s, id: s._id })),
        totalPages,
      }
    },
  })
}

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/students/${id}`)
      return { ...data.data, id: data.data._id }
    },
    enabled: !!id,
  })
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation<Student, Error, FormData>({
    mutationFn: async (studentData) => {
      const { data } = await api.post('/api/students', studentData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { ...data.data, id: data.data._id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation<Student, Error, { id: string; data: FormData }>({
    mutationFn: async ({ id, data: formData }) => {
      const { data } = await api.put(`/api/students/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return { ...data.data, id: data.data._id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/api/students/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

// ------------------- Analytics API hooks -------------------
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get<Analytics>('/api/analytics')
      return data
    },
  })
}

// ------------------- Audit Logs API hooks -------------------
export const useAuditLogs = (params: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: async () => {
      const { data } = await api.get('/api/logs', { params })

      return {
        logs: data?.data?.items ?? [],
        totalPages: data?.data?.totalPages ?? 1,
        total: data?.data?.total ?? 0,
        page: data?.data?.page ?? 1,
      }
    },
  })
}

// ------------------- Excel Export/Import hooks -------------------
export const useExportStudents = () => {
  return useMutation<Blob, Error>({
    mutationFn: async () => {
      const { data } = await api.get('/api/students/export/xlsx/all', {
        responseType: 'blob',
      })
      return data
    },
  })
}

export const useImportStudents = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await api.post('/api/students/import/xlsx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}
