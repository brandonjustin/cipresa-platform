export type UserRole = 'student' | 'instructor' | 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo?: string;
  category: CourseCategory;
  instructor: Instructor;
  price: number;
  salePrice?: number;
  currency: string;
  duration: string;
  totalLessons: number;
  totalHours: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  language: string;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  featured: boolean;
  popular: boolean;
  isPublished: boolean;
  tags: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  count: number;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  courseId: string;
  sectionId: string;
  title: string;
  slug: string;
  description: string;
  videoUrl?: string;
  videoDuration: string;
  order: number;
  isPreview: boolean;
  isFree: boolean;
  resources: LessonResource[];
  createdAt: string;
}

export interface LessonResource {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image' | 'link';
  size?: string;
}

export interface Instructor {
  id: string;
  userId: string;
  fullName: string;
  avatar: string;
  title: string;
  bio: string;
  expertise: string[];
  totalCourses: number;
  totalStudents: number;
  totalReviews: number;
  rating: number;
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: ProductCategory;
  price: number;
  salePrice?: number;
  currency: string;
  stock: number;
  unit: string;
  variants: ProductVariant[];
  featured: boolean;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  tags: string[];
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  count: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Plant {
  id: string;
  scientificName: string;
  commonName: string;
  slug: string;
  images: string[];
  category: PlantCategory;
  description: string;
  climate: string[];
  soilType: string[];
  waterRequirement: 'low' | 'medium' | 'high';
  sunlight: 'full' | 'partial' | 'shade';
  growthDuration: string;
  harvestTime: string;
  estimatedYield: string;
  regionCompatibility: string[];
  diseaseRisks: string[];
  nutritionalBenefits: string[];
  marketValue: string;
  exportPotential: boolean;
  price: number;
  currency: string;
  availability: boolean;
  isPublished: boolean;
  relatedCourses: string[];
  createdAt: string;
}

export interface PlantCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress?: Address;
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  type: 'course' | 'product';
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId: string;
  targetType: 'course' | 'product';
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  currentLesson?: string;
  enrolledAt: string;
  completedAt?: string;
  certificateId?: string;
}

export interface Entitlement {
  id: string;
  userId: string;
  courseId: string;
  source: 'purchase' | 'free' | 'admin_grant';
  grantedAt: string;
  revokedAt?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  courses: LearningPathCourse[];
}

export interface LearningPathCourse {
  course: Course;
  order: number;
  isRequired: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  issuedAt: string;
  certificateUrl: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar?: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured: boolean;
  isPublished: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

export interface Analytics {
  totalUsers: number;
  totalCourses: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalStudents: number;
  totalEnrollments: number;
  recentOrders: Order[];
  popularCourses: Course[];
  revenueByMonth: { month: string; revenue: number }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  type: 'workshop' | 'webinar' | 'conference' | 'training';
  registrationLink?: string;
  price?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  socialLinks: SocialLinks;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface CartItem {
  id: string;
  type: 'course' | 'product';
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  type: 'course' | 'product' | 'plant';
  itemId: string;
  addedAt: string;
}
