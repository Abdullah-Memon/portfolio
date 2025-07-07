import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
})

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().default(false),
  skills: z.string().optional(),
})

export const educationSchema = z.object({
  institute: z.string().min(1, 'Institute is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().default(false),
})
