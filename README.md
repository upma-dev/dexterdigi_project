# Cut2Cut Backend

A full-stack MERN (MongoDB, Express, React, Node.js) application with role-based access control, news management, and dynamic sidebar functionality.

## 🏢 Project Overview

This project was developed as part of an internship program. It includes comprehensive backend and admin panel features for content management with role-based permissions.

### Key Features Developed During Internship

- **News Section** - Full-featured news management system with:
  - Article creation with rich content editor
  - Category and sub-category organization
  - Tags and searchable metadata
  - Featured and breaking news support
  - Scheduled publishing
  - SEO optimization (title, description, keywords)
  - Media gallery support
  - Multiple status workflow (draft, review, scheduled, published, archived)
  - View counts and engagement metrics

- **Sidebar Management** - Dynamic sidebar with:
  - Main menu and submenu structure
  - Custom styling options
  - Dynamic content loading based on user roles

- **Role-Based Access Controller (RBAC)** - Complete with:
  - Multiple user roles
  - Granular permission management
  - Role-based menu access
  - Admin role management

- **Advertisement Section** - Banner and advertisement management

- **Profile Section** - User and admin profile management

### Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend (Admin Panel)**: React.js
- **Authentication**: JWT tokens with bcrypt password hashing

## 🏗️ Project Structure

```
dex_s/
├── Admin/                    # React Admin Panel
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context for state management
│   │   ├── jsx/            # JSX components and pages
│   │   ├── services/       # API service calls
│   │   └── store/          # State management
│   └── build/
│
├── server/                   # Node.js/Express Backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── validations/        # Input validation
│   └── uploads/            # File uploads directory
│
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

## 📚 API Endpoints

### News Management
- `POST /api/news` - Create new news article
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get news by ID
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article
- `PATCH /api/news/:id/status` - Change news status

### Sidebar Menu
- `GET /api/sidebar` - Get all sidebar menus
- `PUT /api/sidebar/count` - Update menu count

### Roles & Permissions
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## 🔧 CRUD Operations Learned

During this internship, I gained hands-on experience with:

- **Create** - Adding new records to database
- **Read** - Retrieving and displaying data
- **Update** - Modifying existing records
- **Delete** - Removing records

These CRUD operations were implemented across:
- News articles management
- User and admin management
- Role and permission management
- Advertisement management
- Sidebar menu configuration

## 💼 Websites Worked On

1. **Wewagad** - [Description: One of the projects worked on during internship]
2. **Cut2Cut** - [Description: Primary project with full feature implementation]

## 📝 License

This project is developed as part of an internship project.

## 👤 Author

Upma Mishra
Intern Developer

## 🙏 Acknowledgments

- Thanks to the internship mentor/team for guidance
- Learning opportunity to work on real-world applications
- Exposure to MERN stack development

---

*This README was created to document the internship project work completed during the training period.*
