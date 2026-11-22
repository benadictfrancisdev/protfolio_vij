import { PORTRAIT_SRC } from '@/data/portrait'

export interface HeroIdentity {
  id: string
  label: string
  headline: string
  /** Short form for very narrow viewports */
  headlineShort?: string
  tag: string
  description: string
  /** Optional alternate genuine photo for dimensional transition */
  image: string
}

/** Resume-supported identity states for scroll-scrubbed hero */
export const heroIdentities: HeroIdentity[] = [
  {
    id: 'aiml',
    label: "HI, I'M VIJETHA",
    headline: 'AI / ML ENGINEER',
    headlineShort: 'AI / ML',
    tag: '// INTELLIGENT SOLUTIONS',
    description:
      'Building intelligent solutions through Artificial Intelligence, Machine Learning and Computer Vision.',
    image: PORTRAIT_SRC,
  },
  {
    id: 'cv',
    label: "HI, I'M VIJETHA",
    headline: 'COMPUTER VISION',
    headlineShort: 'VISION',
    tag: '// DEEP LEARNING SYSTEMS',
    description:
      'Designing vision pipelines with OpenCV, CNNs and transfer learning for real-world perception tasks.',
    image: PORTRAIT_SRC,
  },
  {
    id: 'genai',
    label: "HI, I'M VIJETHA",
    headline: 'GENERATIVE AI',
    headlineShort: 'GEN AI',
    tag: '// APPLIED AI APPLICATIONS',
    description:
      'Building generative AI applications spanning diagnostics support, anomaly detection and knowledge assistants.',
    image: PORTRAIT_SRC,
  },
  {
    id: 'systems',
    label: "HI, I'M VIJETHA",
    headline: 'INTELLIGENT SYSTEMS',
    headlineShort: 'SYSTEMS',
    tag: '// END-TO-END AI APPS',
    description:
      'Turning research ideas into deployable AI systems with TensorFlow, Keras, Flask and rigorous validation.',
    image: PORTRAIT_SRC,
  },
]
