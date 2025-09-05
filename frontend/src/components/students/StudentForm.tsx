import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Student } from '@/types'
import { Upload, Loader2 } from 'lucide-react'

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  className: z.string().min(1, 'Class is required'), // ✅ match backend
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

type StudentForm = z.infer<typeof studentSchema>

interface StudentFormProps {
  student?: Student
  onSubmit: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export const StudentFormComponent: React.FC<StudentFormProps> = ({
  student,
  onSubmit,
  isLoading = false,
}) => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    student?.profilePhoto || null
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
  })

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        className: student.className,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split('T')[0]
          : '',
        address: student.address,
      })
      if (student.gender) {
        setValue('gender', student.gender)
      }
    }
  }, [student, reset, setValue])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFormSubmit = async (data: StudentForm) => {
    const formData = new FormData()

    // ✅ match backend fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto) // backend middleware handles this
    }
    
    await onSubmit(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{student ? 'Edit Student' : 'Add New Student'}</CardTitle>
        <CardDescription>
          {student
            ? 'Update student information'
            : 'Fill in the details to add a new student'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={previewUrl || undefined} />
              <AvatarFallback>
                <Upload className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('profilePhoto')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1234567890"
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="className">Class</Label>
              <Input
                id="className"
                placeholder="Class 10A"
                {...register('className')}
                className={errors.className ? 'border-destructive' : ''}
              />
              {errors.className && (
                <p className="text-sm text-destructive">
                  {errors.className.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                defaultValue={student?.gender}
                onValueChange={(value) =>
                  setValue('gender', value as 'male' | 'female')
                }
              >
                <SelectTrigger
                  className={errors.gender ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                className={errors.dateOfBirth ? 'border-destructive' : ''}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="123 Main St, City, State"
              {...register('address')}
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {student ? 'Updating...' : 'Creating...'}
              </>
            ) : student ? (
              'Update Student'
            ) : (
              'Create Student'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
