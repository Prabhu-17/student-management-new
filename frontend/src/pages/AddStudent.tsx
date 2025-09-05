import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { StudentFormComponent } from '@/components/students/StudentForm'
import { useCreateStudent } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// Define the shape of student data that matches backend validators
type StudentInput = {
  name: string
  email?: string
  phone?: string
  className: string
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  address?: string
}

export const AddStudent: React.FC = () => {
  const navigate = useNavigate()
  const createStudentMutation = useCreateStudent()

  const handleSubmit = async (data: StudentInput) => {
    try {
      await createStudentMutation.mutateAsync(data)
      toast({
        title: 'Success',
        description: 'Student created successfully',
      })
      navigate('/students')
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to create student',
        variant: 'destructive',
      })
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/students')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Student</h1>
            <p className="text-muted-foreground">Create a new student record</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StudentFormComponent
            onSubmit={handleSubmit}
            isLoading={createStudentMutation.isPending}
          />
        </motion.div>
      </div>
    </Layout>
  )
}
