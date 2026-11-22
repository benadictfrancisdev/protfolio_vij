export type HeroVisual = 'portrait' | 'vision' | 'neural' | 'generative'

export interface HeroSlide {
  id: string
  index: string
  heading: string
  specialization: string
  description: string
  tech: string[]
  detail: string
  visual: HeroVisual
  image?: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'ai',
    index: '01',
    heading: 'ARTIFICIAL INTELLIGENCE',
    specialization: 'Machine Learning · Practical AI Systems',
    description:
      'Exploring intelligent systems through machine learning, deep learning and practical AI applications.',
    tech: ['Python', 'TensorFlow', 'Keras', 'Machine Learning'],
    detail: 'M.Tech CSE · Bangalore Institute of Technology (VTU)',
    visual: 'portrait',
    image: '/images/vijetha-headshot.jpg',
  },
  {
    id: 'cv',
    index: '02',
    heading: 'COMPUTER VISION',
    specialization: 'Classification · Detection · Imaging',
    description:
      'Developing image classification and object detection solutions through computer vision and deep learning.',
    tech: ['OpenCV', 'CNN', 'Image Classification', 'Object Detection'],
    detail: 'Projects in histopathology classification and detector benchmarking',
    visual: 'vision',
  },
  {
    id: 'dl',
    index: '03',
    heading: 'DEEP LEARNING',
    specialization: 'Neural Networks · Transfer Learning',
    description:
      'Building and experimenting with neural network architectures and transfer learning approaches.',
    tech: ['Deep Learning', 'MobileNetV2', 'TensorFlow', 'Transfer Learning'],
    detail: 'End-to-end models from preprocessing to Flask deployment',
    visual: 'neural',
  },
  {
    id: 'genai',
    index: '04',
    heading: 'GENERATIVE AI',
    specialization: 'LLMs · Anomaly Detection · Assistive Systems',
    description:
      'Exploring intelligent applications for industrial anomaly detection and cybersecurity assistance.',
    tech: ['Generative AI', 'LLMs', 'Python', 'Flask'],
    detail: 'Sensor anomaly detection and zero-day knowledge assistant',
    visual: 'generative',
  },
]
