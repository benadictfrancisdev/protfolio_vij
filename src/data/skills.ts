export interface SkillGroup {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    items: ['Python', 'Java', 'C', 'C++'],
  },
  {
    title: 'Artificial Intelligence',
    items: [
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'Generative AI',
      'LLMs',
      'Transfer Learning',
      'CNN',
      'NLP',
    ],
  },
  {
    title: 'Frameworks & Tools',
    items: ['TensorFlow', 'Keras', 'PyTorch', 'Flask', 'OpenCV'],
  },
  {
    title: 'Core Concepts',
    items: [
      'Object Detection',
      'Image Classification',
      'Data Preprocessing',
      'Neural Networks',
    ],
  },
]

export interface Specialization {
  index: string
  title: string
  description: string
  tech: string[]
}

export const specializations: Specialization[] = [
  {
    index: '01',
    title: 'Artificial Intelligence & Machine Learning',
    description:
      'Designing and training machine learning models that turn structured and unstructured data into reliable predictions.',
    tech: ['Machine Learning', 'Transfer Learning', 'TensorFlow', 'Keras'],
  },
  {
    index: '02',
    title: 'Deep Learning & Neural Networks',
    description:
      'Building and evaluating neural network architectures, from CNNs to modern deep learning pipelines.',
    tech: ['Deep Learning', 'CNN', 'Neural Networks', 'PyTorch'],
  },
  {
    index: '03',
    title: 'Computer Vision & Image Processing',
    description:
      'Applying computer vision to classification, detection and image analysis problems using OpenCV and deep models.',
    tech: ['Computer Vision', 'OpenCV', 'Object Detection', 'Image Classification'],
  },
  {
    index: '04',
    title: 'Generative AI & Large Language Models',
    description:
      'Exploring generative models and LLM-driven applications to build intelligent, assistive systems.',
    tech: ['Generative AI', 'LLMs', 'NLP'],
  },
]

export const strengths = [
  'Problem Solving',
  'Communication',
  'Team Collaboration',
  'Fast Learner',
  'Analytical Thinking',
]

export const interests = [
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Computer Vision',
  'Generative AI',
  'Large Language Models',
  'Healthcare AI',
]
