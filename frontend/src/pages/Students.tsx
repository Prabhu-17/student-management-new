import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { StudentTable } from '@/components/students/StudentTable'
import { StudentDialog } from '@/components/students/StudentDialog'
import { useAuth } from '@/contexts/AuthContext'
import {
  useStudents,
  useDeleteStudent,
  useExportStudents,
  useImportStudents,
} from '@/hooks/useApi'
import { Student } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Download,
  Upload,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { saveAs } from 'file-saver'

export const Students: React.FC = () => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const limit = 10

  const {
    data: studentsData,
    isLoading,
    refetch,
  } = useStudents({
    page,
    limit,
    search: search || undefined,
    className: classFilter || undefined, // ✅ fixed key
  })

  const deleteStudentMutation = useDeleteStudent()
  const exportStudentsMutation = useExportStudents()
  const importStudentsMutation = useImportStudents()

  // ✅ ensure always array
  const students: Student[] = Array.isArray(studentsData?.data)
    ? studentsData!.data
    : []
  const totalPages = studentsData?.totalPages || 1

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleClassFilter = (value: string) => {
    if (value === 'all') {
      setClassFilter(null)
    } else {
      setClassFilter(value || null)
    }
    setPage(1)
  }

  const handleView = (student: Student) => {
    setSelectedStudent(student)
  }

  const handleEdit = (student: Student) => {
    navigate(`/students/edit/${student.id}`)
  }

  const handleDelete = async (studentId: string) => {
    try {
      await deleteStudentMutation.mutateAsync(studentId)
      setStudentToDelete(null)
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      })
      refetch()
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to delete student',
        variant: 'destructive',
      })
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportStudentsMutation.mutateAsync()
      saveAs(blob, 'students.xlsx')
      toast({
        title: 'Success',
        description: 'Students exported successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to export students',
        variant: 'destructive',
      })
    }
  }

  const handleImport = async (file: File) => {
    try {
      await importStudentsMutation.mutateAsync(file)
      toast({
        title: 'Success',
        description: 'Students imported successfully',
      })
      refetch()
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to import students',
        variant: 'destructive',
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImport(file)
      event.target.value = ''
    }
  }

  // ✅ safe unique classes
  const uniqueClasses = Array.isArray(students)
    ? [...new Set(students.map((s) => s.className))].filter(Boolean)
    : []

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Manage student records</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={exportStudentsMutation.isPending}
              >
                {exportStudentsMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importStudentsMutation.isPending}
              >
                {importStudentsMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Import Excel
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button onClick={() => navigate('/students/add')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select
                  value={classFilter ?? 'all'}
                  onValueChange={handleClassFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {uniqueClasses.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardContent className="p-0">
              <StudentTable
                students={students}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={(id) => setStudentToDelete(id)}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>

        {/* Student Details Dialog */}
        <StudentDialog
          student={selectedStudent}
          open={!!selectedStudent}
          onOpenChange={(open) => !open && setSelectedStudent(null)}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!studentToDelete}
          onOpenChange={() => setStudentToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                student record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => studentToDelete && handleDelete(studentToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  )
}
