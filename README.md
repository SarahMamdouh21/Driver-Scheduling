
# Driver-Scheduling
=======
# 🚛 Driver Scheduling Dashboard

A professional, modern web application built with Angular 17 for managing driver schedules and route assignments. This application provides a comprehensive solution for fleet management with real-time updates, intuitive user interface, and responsive design.

## 🚀 Live Demo

- **Live Application**: [Deploy on Vercel](https://driverscheduling89-git-main-sarahs-projects-39d05a88.vercel.app?_vercel_share=OlBohUMp5k0tCPTAqIYBXbAmwbUGbuS0)
- **GitHub Repository**: [View Source Code](https://github.com/SarahMamdouh21/Driver-Scheduling.git)

## ✨ Features

### Core Features
- **Driver Management**: Add, view, and manage driver information with availability status
- **Route Management**: Create and assign routes with detailed information
- **Real-time Dashboard**: Monitor driver availability and route assignments
- **Assignment System**: Assign routes to available drivers with vehicle type matching
- **Status Tracking**: Track route status (unassigned, assigned, in-progress, completed)

### Bonus Features
- **📅 Calendar View**: Visualize schedules and driver availability by date
- **🔍 Search & Filter**: Advanced search and filtering for drivers and routes
- **📱 Responsive Design**: Fully responsive design that works on all devices
- **🎨 Modern UI**: Professional, clean interface with smooth animations
- **⚡ Real-time Updates**: Live updates when assignments change

## 🛠️ Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **Language**: TypeScript
- **Styling**: SCSS with modern CSS features
- **State Management**: RxJS Observables with BehaviorSubject
- **Routing**: Angular Router with lazy loading
- **Icons**: Emoji-based icons for better visual appeal
- **Responsive**: CSS Grid and Flexbox

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher)
- **Angular CLI** (version 17 or higher)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/scheduling-dashboard.git
cd scheduling-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
ng serve
```

The application will be available at `http://localhost:4200`

### 4. Build for Production

```bash
ng build --configuration production
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Main dashboard component
│   │   ├── driver-form/         # Driver registration form
│   │   ├── route-form/          # Route creation form
│   │   ├── calendar-view/       # Calendar visualization
│   │   └── navigation/          # Navigation component
│   ├── models/                  # TypeScript interfaces
│   │   ├── driver.model.ts
│   │   ├── route.model.ts
│   │   └── index.ts
│   ├── services/                # Data management
│   │   └── scheduling.service.ts
│   ├── app.component.*          # Root component
│   ├── app.routes.ts            # Application routes
│   └── app.config.ts            # App configuration
├── assets/                      # Static assets
├── styles.scss                  # Global styles
└── index.html                   # Main HTML file
```

## 🎯 Key Components

### Dashboard Component
- Displays statistics cards with key metrics
- Shows routes with assignment status
- Lists drivers with availability toggle
- Real-time search and filtering
- Route assignment functionality

### Driver Form Component
- Comprehensive driver registration
- Form validation with error messages
- Vehicle type selection
- Experience tracking
- Success feedback

### Route Form Component
- Route creation with detailed information
- Priority and vehicle type selection
- Date/time scheduling
- Distance and duration tracking
- Description field

### Calendar View Component
- Monthly calendar visualization
- Route scheduling by date
- Driver availability display
- Color-coded status indicators
- Navigation controls

## 🔧 Configuration

### Environment Setup
The application uses mock data stored in the `SchedulingService`. For production use, you can:

1. Replace the mock data with API calls
2. Add environment configuration files
3. Implement proper error handling
4. Add authentication/authorization

### Customization
- **Colors**: Modify the color scheme in `styles.scss`
- **Data**: Update mock data in `scheduling.service.ts`
- **Validation**: Adjust form validation rules in components
- **Styling**: Customize component styles in respective `.scss` files

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all components visible
- **Tablet**: Adapted layout with collapsible sections
- **Mobile**: Touch-friendly interface with mobile navigation

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Build the application**:
   ```bash
   ng build --configuration production
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Configure build settings** in Vercel:
   - Build Command: `ng build --configuration production`
   - Output Directory: `dist/scheduling-dashboard`
   - Install Command: `npm install`

### Alternative Deployment Options

- **Netlify**: Similar process with `ng build` and deploy to `dist/scheduling-dashboard`
- **GitHub Pages**: Use Angular CLI's built-in GitHub Pages deployment
- **AWS S3**: Upload the built files to an S3 bucket with static hosting

## 🧪 Testing

Run the test suite:

```bash
ng test
```

Run end-to-end tests:

```bash
ng e2e
```

## 📊 Data Model

### Driver Model
```typescript
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  isAvailable: boolean;
  assignedRoutes: string[];
  experience: number;
  vehicleType: 'sedan' | 'suv' | 'van' | 'truck';
  rating: number;
  joinDate: Date;
}
```

### Route Model
```typescript
interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  status: 'unassigned' | 'assigned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  scheduledDate: Date;
  vehicleType: 'Heavy Truck' | 'Delivery Van' | 'Refrigerated Truck' | 'Box Truck' | 'Flatbed Truck' | 'Pickup Truck;
  description?: string;
  createdAt: Date;
}
```

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: Charts and reports for fleet performance
- **Driver Tracking**: GPS integration for real-time location
- **Route Optimization**: AI-powered route planning
- **Mobile App**: React Native or Flutter mobile application
- **Multi-tenant Support**: Support for multiple companies
- **API Integration**: RESTful API with backend services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Angular team for the amazing framework
- Vercel for seamless deployment
- The open-source community for inspiration and tools

---

**Note**: This is a demonstration project for the DRB Internship Frontend Task. The application showcases modern Angular development practices, responsive design, and professional UI/UX implementation.
master
