export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  address: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalStudents: number;
  studentsPerClass: Array<{ class: string; count: number }>;
  genderRatio: Array<{ gender: string; count: number }>;
}

export interface AuditLog {
  id: string;
  user: string;
  actionType: string;
  timestamp: string;
  changes: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}