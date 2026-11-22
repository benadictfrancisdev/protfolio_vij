export type ProjectVisual = 'medical' | 'detection' | 'sensor' | 'security'

export interface Project {
  id: string
  index: string
  title: string
  category: string
  summary: string
  problem: string
  solution: string
  approach: string[]
  outcomes: string[]
  tech: string[]
  visual: ProjectVisual
  github?: string
}

export const projects: Project[] = [
  {
    id: 'ovarian-cancer',
    index: '01',
    title: 'AI-Based Ovarian Cancer Detection and Classification',
    category: 'Healthcare AI · Computer Vision',
    summary:
      'A five-class histopathological image classification system built with MobileNetV2 transfer learning and served through a Flask web application.',
    problem:
      'Histopathological image analysis is time-consuming and depends on expert interpretation. Classifying ovarian tissue images across multiple categories consistently is challenging.',
    solution:
      'A MobileNetV2-based transfer learning model that classifies histopathological images into five classes, supported by preprocessing, augmentation and normalization pipelines to improve accuracy and generalization.',
    approach: [
      'Transfer learning with MobileNetV2',
      'Image preprocessing, augmentation and normalization',
      'Five-class histopathological classification pipeline',
      'Flask web application for real-time image upload and prediction',
    ],
    outcomes: [
      'Five-class histopathological image classification system',
      'Improved accuracy and generalization through augmentation and normalization',
      'Deployed Flask application enabling real-time upload and prediction',
    ],
    tech: ['Python', 'TensorFlow', 'Keras', 'MobileNetV2', 'Flask', 'OpenCV'],
    visual: 'medical',
    github: 'https://github.com/vijetha7777/ovarian-cancer-detection',
  },
  {
    id: 'object-detection',
    index: '02',
    title: 'Object Detection: Single-Stage vs. Two-Stage Deep Learning Models',
    category: 'Computer Vision · Deep Learning',
    summary:
      'A comparative study benchmarking single-stage and two-stage object detection architectures on standard datasets.',
    problem:
      'Object detection models trade accuracy against inference speed. Choosing the right architecture requires an empirical comparison across both dimensions.',
    solution:
      'Implemented and benchmarked single-stage and two-stage detection architectures on standard datasets, comparing detection accuracy and inference speed to identify optimal trade-offs.',
    approach: [
      'Implemented single-stage detection architectures',
      'Implemented two-stage detection architectures',
      'Benchmarked both families on standard datasets',
      'Compared detection accuracy against inference speed',
    ],
    outcomes: [
      'Empirical comparison of single-stage vs. two-stage detectors',
      'Identified accuracy–latency trade-offs',
      'Benchmark results across standard datasets',
    ],
    tech: ['Python', 'Deep Learning', 'Computer Vision'],
    visual: 'detection',
    github: 'https://github.com/vijetha7777/Object-detection-using-single-and-two-phase-detector',
  },
  {
    id: 'sensor-anomaly',
    index: '03',
    title: 'Industrial Sensor Anomaly Detection Using Generative AI',
    category: 'Generative AI · Predictive Maintenance',
    summary:
      'A generative-AI-based anomaly detection model that flags abnormal machine behavior for predictive maintenance.',
    problem:
      'Industrial machines produce multivariate sensor streams where abnormal behavior is rare and hard to label, making conventional supervised detection difficult.',
    solution:
      'A generative-AI-based anomaly detection model with preprocessing and anomaly-scoring pipelines to analyse multivariate industrial sensor datasets.',
    approach: [
      'Generative AI anomaly detection model',
      'Preprocessing pipeline for multivariate sensor data',
      'Anomaly-scoring pipeline',
      'Predictive maintenance flagging',
    ],
    outcomes: [
      'Model that flags abnormal machine behavior',
      'Preprocessing and anomaly-scoring pipelines for multivariate sensor datasets',
      'Predictive maintenance signal generation',
    ],
    tech: ['Python', 'Generative AI'],
    visual: 'sensor',
  },
  {
    id: 'zero-day-assistant',
    index: '04',
    title: 'Zero-Day Vulnerability Knowledge Assistant',
    category: 'Cybersecurity · Applied AI',
    summary:
      'An AI-powered assistant that delivers zero-day vulnerability information and mitigation guidance through an interactive Flask interface.',
    problem:
      'Zero-day vulnerabilities are difficult to track and understand quickly. End users need accessible, real-time guidance on risks and mitigation.',
    solution:
      'An AI-powered assistant paired with an interactive Flask-based UI for real-time cybersecurity Q&A, delivering vulnerability information and mitigation guidance.',
    approach: [
      'AI-powered knowledge assistant',
      'Zero-day vulnerability information retrieval',
      'Mitigation guidance generation',
      'Interactive Flask-based UI for real-time Q&A',
    ],
    outcomes: [
      'Assistant delivering zero-day vulnerability information',
      'Mitigation guidance for end users',
      'Interactive Flask UI for real-time cybersecurity Q&A',
    ],
    tech: ['Python', 'Flask', 'AI'],
    visual: 'security',
    github: 'https://github.com/vijetha7777/Zero-Day-Vulnerability-Assistant',
  },
]
