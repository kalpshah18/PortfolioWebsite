export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavLink {
  name: string;
  href: string;
  isExternal?: boolean;
}

export interface PersonalInfo {
  name: string;
  logoName: string;
  logoIcon: string;
  roleGreeting: string;
  headlineRole: string;
  subRole: string;
  profileImage: string;
  resumeUrl: string;
  resumeButtonText?: string;
  contactButtonText?: string;
}

export interface ExperienceItem {
  role: string;
  duration: string;
}

export interface ExperienceCard {
  title: string;
  icon: string;
  iconLink?: string;
  items: ExperienceItem[];
}

export interface EducationItem {
  degree: string;
  duration: string;
}

export interface EducationCard {
  title: string;
  icon: string;
  iconLink?: string;
  items: EducationItem[];
}

export interface AboutSection {
  subtitle: string;
  title: string;
  aboutImage: string;
  aboutCaption?: string;
  experienceCard: ExperienceCard;
  educationCard: EducationCard;
  bioParagraphs: string[];
}

export interface ProjectButton {
  label: string;
  url: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  buttons: ProjectButton[];
}

export interface ProjectsSection {
  subtitle: string;
  title: string;
  projects: ProjectItem[];
}

export interface PosterItem {
  title: string;
  subtitle: string;
  image: string;
  buttonLabel: string;
  url: string;
}

export interface PostersSection {
  subtitle: string;
  title: string;
  posters: PosterItem[];
}

export interface PORItem {
  title: string;
  organization: string;
  details?: string[];
}

export interface PORGroup {
  items: PORItem[];
}

export interface PORsSection {
  subtitle: string;
  title: string;
  groups: PORGroup[];
}

export interface ContactSection {
  subtitle: string;
  title: string;
  email: string;
  linkedin: {
    label: string;
    url: string;
  };
}

export interface PortfolioData {
  meta: {
    title: string;
    description: string;
    favicon: string;
  };
  navLinks: NavLink[];
  personal: PersonalInfo;
  socials: SocialLink[];
  about: AboutSection;
  projects: ProjectsSection;
  posters: PostersSection;
  pors: PORsSection;
  contact: ContactSection;
  footer: {
    copyright: string;
  };
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}
