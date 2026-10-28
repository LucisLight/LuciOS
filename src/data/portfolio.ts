export type ColorVisionMode = 'standard' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

export const colorVisionOptions: { value: ColorVisionMode; label: string }[] = [
  { value: 'standard', label: 'Standard colors' },
  { value: 'protanopia', label: 'Protanopia (red)' },
  { value: 'deuteranopia', label: 'Deuteranopia (green)' },
  { value: 'tritanopia', label: 'Tritanopia (blue-yellow)' },
  { value: 'achromatopsia', label: 'Achromatopsia (monochrome)' },
]

export type Project = {
  id: string
  eyebrow: string
  title: string
  summary: string
  role: string
  decisions: string[]
  outcome: string
  technologies: string[]
  evidenceUrl?: string
  evidenceLabel: string
}

export const projects: Project[] = [
  {
    id: 'corvusdesk',
    eyebrow: 'Full-stack application',
    title: 'CorvusDesk',
    summary:
      'A local service-request tracking system that helps support teams create, assign, update, close, reopen, sort, and review tickets across their full lifecycle.',
    role:
      'Full-stack developer on the CorvusDesk development team, working across the React interface, Spring Boot services, MongoDB data, and ticket workflow.',
    decisions: [
      'Separated the React frontend from a Spring Boot REST backend.',
      'Added clearance-based visibility for Admin, Manager, Network, Phone, and General owners.',
      'Preserved comments and request history so closed and reopened tickets retain context.',
    ],
    outcome:
      'The working build supports owner management, ticket creation, search, filtering, sorting, comments, history, closure, deletion, and reopening. The project strengthened my understanding of full-stack state, access rules, testing, and maintainable component boundaries.',
    technologies: ['Java', 'Spring Boot', 'React', 'MongoDB', 'JavaScript', 'Jest'],
    evidenceUrl: 'https://github.com/LucisLight/CorvusDesk',
    evidenceLabel: 'View CorvusDesk source and documentation',
  },
  {
    id: 'battleship',
    eyebrow: 'Collaborative Java project',
    title: 'Battleship Game',
    summary:
      'A console-based player-versus-computer Battleship game with fleet setup, coordinate validation, randomized computer behavior, alternating turns, and win detection.',
    role:
      'Collaborative Java developer and one of three listed authors. I contributed to a shared gameplay class that coordinates setup, ship placement, turns, board display, hit detection, and victory logic.',
    decisions: [
      'Used coordinate validation to keep player input inside a 10-by-10 board.',
      'Prevented ships from overlapping or extending beyond the board during placement.',
      'Kept the opponent fleet hidden while still displaying hits and misses after each turn.',
    ],
    outcome:
      'The result is a playable command-line game with manual fleet placement and randomized AI placement and targeting. It reinforced collaborative coding, object-oriented design, input validation, and breaking a game loop into testable responsibilities.',
    technologies: ['Java', 'Object-oriented design', 'Collections', 'Input validation'],
    evidenceUrl: 'https://github.com/LucisLight/Battleship-Game',
    evidenceLabel: 'View the Battleship repository',
  },
  {
    id: 'lucios',
    eyebrow: 'Portfolio experience',
    title: 'LuciOS',
    summary:
      'This portfolio is designed as an original mechanical-futurist operating system: steampunk structure, pastel-pink holograms, pixel details, and direct access to professional evidence.',
    role:
      'Designer, content owner, and frontend developer. I defined the interaction concept, requirements, accessibility priorities, project architecture, and visual direction before building the React experience.',
    decisions: [
      'Kept a conventional portfolio path so the presentation never blocks the content.',
      'Built the app rail and window manager from reusable components so every module shares the same interaction rules.',
      'Designed motion as progressive enhancement with reduced-motion and mobile fallbacks.',
    ],
    outcome:
      'The submission edition establishes a responsive, accessible portfolio and a reusable design system with an interactive startup sequence, shared draggable-window system, and pixel-shadow hand that carries applications through a mechanical intake machine. The machine now ejects each window through its side funnel, while Vault mounts verified professional evidence. Future releases can deepen the remaining applications, terminal valve, and project media without rewriting the professional content.',
    technologies: ['React', 'TypeScript', 'Vite', 'CSS', 'Accessible HTML'],
    evidenceLabel: 'You are viewing the working project',
  },
]

export const skillGroups = [
  {
    title: 'Systems & support',
    items: ['Active Directory', 'Windows 7–11', 'Linux administration', 'Office 365', 'Hardware repair', 'Imaging & deployment'],
  },
  {
    title: 'Networking & security',
    items: ['Network troubleshooting', 'Firewall fundamentals', 'Infrastructure planning', 'Linux security', 'Device administration', 'Technical escalation'],
  },
  {
    title: 'Development',
    items: ['Java', 'JavaScript', 'React', 'Spring Boot', 'MongoDB', 'HTML & CSS', 'Git & GitHub'],
  },
  {
    title: 'Professional practice',
    items: ['Ticket lifecycle management', 'Documentation', 'Customer support', 'Team leadership', 'Inventory control', 'Process improvement'],
  },
]

export const certifications = [
  'CompTIA A+',
  'CompTIA Network+',
  'CompTIA Security+',
  'CompTIA Linux+',
  'CompTIA CySA+',
  'Microsoft Networking, Cloud & Security Fundamentals',
]
