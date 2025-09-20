# Retailer Panel - Management Dashboard

A comprehensive retailer management web application built with Next.js, React, TypeScript, and Redux Toolkit. This application demonstrates advanced web development skills including authentication, inventory management, delivery assignment, and analytics dashboard with real-time data visualization.

## 🚀 Features

### Authentication System
- **Login Flow**: Clean login form with email/password validation and "Remember Me" functionality
- **Multi-step Signup**: 4-step registration process with email verification
- **Email Verification**: Mock OTP system with resend functionality
- **Business Details**: Complete business information collection with file upload
- **Session Management**: Persistent login with Redux Persist

### Dashboard & Analytics
- **KPI Cards**: Total orders, monthly income, active products, pending deliveries
- **Recent Orders**: Table with pagination and order details
- **Revenue Charts**: Monthly revenue visualization (ready for recharts integration)
- **Order Status Distribution**: Visual breakdown of order statuses
- **Top Selling Products**: Best performing products list
- **Quick Actions**: Navigation shortcuts for common tasks

### Inventory Management
- **Product Listing**: Search, filter, and sort functionality
- **CRUD Operations**: Create, read, update, and delete products
- **Stock Management**: Track stock levels with low stock alerts
- **Bulk Operations**: Mass actions for product management
- **Image Upload**: Drag & drop file upload with validation
- **Category Management**: Organize products by categories

### Order Management
- **Order Tracking**: View and manage customer orders
- **Status Updates**: Update order status through workflow
- **Order Details**: Complete order information with customer data
- **Search & Filter**: Find orders by various criteria
- **Pagination**: Handle large order datasets efficiently

### Delivery Management
- **Agent Assignment**: Assign orders to delivery personnel
- **Delivery Tracking**: Monitor orders out for delivery
- **Agent Management**: View available delivery agents
- **Route Optimization**: Delivery route suggestions (UI ready)
- **Status Updates**: Track delivery progress

### Settings & Configuration
- **Profile Management**: Update personal information
- **Business Settings**: Manage business details and preferences
- **Security**: Password change functionality
- **Notifications**: Configure notification preferences

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library

### State Management
- **Redux Toolkit**: Modern Redux with RTK Query
- **Redux Saga**: Side effect management
- **Redux Persist**: State persistence

### Form Handling
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Form validation resolvers

### Additional Libraries
- **React Dropzone**: File upload with drag & drop
- **Recharts**: Data visualization (ready for integration)
- **React Icons**: Icon library
- **date-fns**: Date manipulation
- **clsx**: Conditional className utility

## 📦 Installation

### Prerequisites
- Node.js 18+ (LTS version recommended)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-poc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

### Login Credentials
- **Email**: `retailer@example.com`
- **Password**: `RetailerPass123`

### Email Verification
- **OTP**: `123456` (hardcoded for demo)

## 📱 Usage

### Authentication Flow
1. **Login**: Use the demo credentials to sign in
2. **Signup**: Complete the 4-step registration process
   - Step 1: Basic information (name, email, password)
   - Step 2: Email verification (use OTP: 123456)
   - Step 3: Business details (name, address, category, image upload)
   - Step 4: Success confirmation

### Dashboard
- View key performance indicators
- Monitor recent orders
- Access quick actions
- Review analytics and charts

### Inventory Management
- Add new products with image upload
- Search and filter products
- Update stock levels
- Manage product categories
- Bulk operations for efficiency

### Order Management
- View all customer orders
- Update order status
- Track order progress
- Search and filter orders

### Delivery Management
- Assign orders to delivery agents
- Track deliveries in progress
- Monitor agent availability
- Update delivery status

## 🏗️ Project Structure

This application follows a **feature-based architecture** for better scalability and maintainability:

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── inventory/         # Inventory management
│   ├── orders/            # Order management (refactored)
│   ├── deliveries/        # Delivery management
│   └── settings/          # Settings page
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── orders/            # Orders management feature
│   │   ├── components/    # Order-specific components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Redux slice
│   │   ├── types/         # TypeScript types
│   │   ├── pages/         # Feature pages
│   │   └── __tests__/     # Feature tests
│   ├── inventory/         # Inventory management feature
│   └── deliveries/        # Delivery management feature
├── shared/                # Shared utilities and components
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Basic UI components
│   │   ├── data-display/ # Tables, charts, pagination
│   │   ├── feedback/     # Loading, error states
│   │   └── layout/       # Layout components
│   ├── services/          # Shared services
│   │   └── error-handler.ts # Centralized error handling
│   └── utils/             # Utility functions
│       ├── formatting.ts  # Date, currency formatting
│       └── validation.ts  # Form validation utilities
├── components/            # Legacy components (to be migrated)
├── store/                 # Redux store configuration
├── types/                 # Global TypeScript types
└── constants/             # Application constants
```

## 🏛️ Architecture Benefits

### Feature-Based Architecture
- **Isolation**: Features can be developed independently without affecting others
- **Reusability**: Shared components and utilities are available across features
- **Maintainability**: Clear boundaries and responsibilities make code easier to maintain
- **Scalability**: Easy to add new features without affecting existing ones
- **Testing**: Each feature can be tested in isolation

### Production-Ready Features
- **Error Handling**: Comprehensive error boundaries and centralized error management
- **Performance**: Code splitting, lazy loading, and optimization strategies
- **Security**: Input validation, sanitization, and security best practices
- **Type Safety**: Full TypeScript implementation with strict typing
- **Testing**: Comprehensive testing setup with unit and integration tests

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Components
- Built with shadcn/ui for consistency
- Responsive design with mobile-first approach
- Accessible components with proper ARIA labels
- Dark mode support (ready for implementation)

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage
- `npm run type-check`: Run TypeScript check

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- SOLID principles implementation
- Clean architecture patterns

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 Performance

### Optimizations
- Code splitting with Next.js
- Lazy loading for components
- Image optimization
- Bundle size optimization
- Caching strategies

### Metrics
- Lighthouse score: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Individual functions and components
- **Integration Tests**: Feature interactions
- **Coverage**: 70% minimum coverage requirement
- **Feature Tests**: Each feature has its own test suite

### Testing Tools
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **MSW**: API mocking for integration tests
- **Coverage**: Comprehensive coverage reporting

## 🔒 Security

### Implemented Features
- Input validation and sanitization
- XSS protection
- CSRF protection considerations
- Secure file upload handling
- Authentication state management

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Future Enhancements

### Planned Features
- Real-time notifications with WebSocket
- Advanced analytics with more chart types
- Multi-language support
- Mobile app with React Native
- API integration with real backend
- Advanced reporting features
- Inventory forecasting
- Customer management system

### Technical Improvements
- GraphQL API integration
- Server-side rendering optimization
- Progressive Web App features
- Advanced caching strategies
- Microservices architecture
- Container deployment with Docker

---

**Built with ❤️ using modern web technologies**