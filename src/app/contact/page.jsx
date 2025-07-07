'use client'
import { useState } from 'react'
import { Container, Card, Input, Textarea, Button } from '@/components/ui'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const loadingToast = toast.loading('Sending message...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        toast.success('Message sent successfully! I\'ll get back to you soon.', { id: loadingToast })
      } else {
        if (data.details) {
          // Handle validation errors
          const validationErrors = {}
          data.details.forEach(error => {
            validationErrors[error.path[0]] = error.message
          })
          setErrors(validationErrors)
          toast.error('Please fix the validation errors and try again.', { id: loadingToast })
        } else {
          setErrors({ general: data.error || 'Failed to send message' })
          toast.error(data.error || 'Failed to send message', { id: loadingToast })
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
      toast.error('Network error. Please try again.', { id: loadingToast })
    }

    setLoading(false)
  }

  return (
    <>
      {/* Hero Section */}
      
      <div className="bg-primary-dynamic pt-20 pb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 bg-violet-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-500/10 rounded-full animate-float animate-delay-200"></div>
        </div>
        
        <Container className="py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6 heading-primary animate-fade-in-down">Get In Touch</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Have a project in mind? Let&apos;s discuss how we can work together to create something amazing.
            </p>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="animate-fade-in-left animate-delay-300">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-shimmer">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 hover-scale transition-transform duration-200 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center animate-pulse">
                      <i className="fas fa-envelope text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">abdullah.memon@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-phone text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-600">San Francisco, CA</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Follow Me</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Send Message</h2>
                
                {success && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}

                {errors.general && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="Your name"
                    />
                    <Input
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    placeholder="Project discussion"
                  />

                  <Textarea
                    label="Message *"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    rows={5}
                    placeholder="Tell me about your project..."
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
