import slugify from 'slugify'

export const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

// Export slugify directly for use in other components
export { slugify }

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatMonthYear = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const parseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch {
    return []
  }
}

export const stringifyJSON = (data) => {
  return JSON.stringify(data)
}
