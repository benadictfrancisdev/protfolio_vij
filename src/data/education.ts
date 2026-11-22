export interface EducationEntry {
  degree: string
  institution: string
  period: string
  grade: string
  note: string
}

export const education: EducationEntry[] = [
  {
    degree: 'M.Tech in Computer Science Engineering',
    institution: 'Bangalore Institute of Technology (VTU)',
    period: '2025 — 2027',
    grade: 'CGPA 9.61',
    note: 'Present · Specializing in Artificial Intelligence, Machine Learning, Deep Learning and Computer Vision.',
  },
  {
    degree: 'B.E. in Computer Science Engineering',
    institution: 'C. Byregowda Institute of Technology',
    period: 'Graduated 2025',
    grade: 'CGPA 9.0',
    note: 'Bachelor of Engineering in Computer Science Engineering.',
  },
]

export interface Certification {
  title: string
  issuer: string
}

export const certifications: Certification[] = [
  { title: 'Artificial Intelligence & Machine Learning', issuer: 'Infosys Springboard' },
  { title: 'Software Engineering', issuer: 'Infosys Springboard' },
  { title: 'Java Full Stack Development', issuer: 'KodNest' },
  { title: 'Web Development', issuer: 'Edutainer' },
]
