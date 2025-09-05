import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { StudentFormComponent } from '@/components/students/StudentForm';
import { useStudent, useUpdateStudent } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const EditStudent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updateStudentMutation = useUpdateStudent();

  const { data: student, isLoading } = useStudent(id!);

  const handleSubmit = async (data: FormData) => {
    try {
      await updateStudentMutation.mutateAsync({ id: id!, data });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      navigate('/students');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update student",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Student not found</h1>
            <Button onClick={() => navigate('/students')} className="mt-4">
              Back to Students
            </Button>
          </div>
        </div>
      </Layout>
    );
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
            <h1 className="text-3xl font-bold">Edit Student</h1>
            <p className="text-muted-foreground">Update student information</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StudentFormComponent
            student={student}
            onSubmit={handleSubmit}
            isLoading={updateStudentMutation.isPending}
          />
        </motion.div>
      </div>
    </Layout>
  );
};