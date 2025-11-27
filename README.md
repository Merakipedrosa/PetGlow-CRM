# 🐾 PetGlow CRM

A modern, feature-rich CRM system designed specifically for pet shops and pet care businesses. Built with React, Vite, and Supabase.

![PetGlow CRM](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green.svg)

## ✨ Features

### 📊 Dashboard
- Real-time statistics and metrics
- Total pets, active bookings, and check-ins
- Recent pets list with live status updates
- Beautiful glassmorphism design

### 🐾 Pet Passport
- Complete pet profile management (CRUD)
- Pet registration with photos
- Cuteness level tracker
- Custom badges and traits
- Status tracking (Active/Checked In)

### 🏨 Hotel & Daycare
- Interactive Kanban board with drag & drop
- 5 workflow stages: Check-In → Playtime → Nap Time → Grooming → Ready for Pickup
- Available pets section
- Create bookings by dragging pets to columns
- Delete bookings with confirmation
- Real-time status updates

### 🩺 Health Tracker
- Medical history timeline
- Multiple record types: Vaccines 💉, Checkups 🩺, Medications 💊, Surgeries 🏥
- Next appointment reminders
- Notes and detailed information
- Pet-specific health records

### 🔐 Authentication
- Secure login/signup with Supabase Auth
- Email verification (optional)
- User profiles with additional data (full name, birth date, CPF)
- Auto-login after registration
- Session management

## 🚀 Tech Stack

- **Frontend**: React 19.2.0 + Vite
- **Styling**: Vanilla CSS with Dark Glassmorphism theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Fonts**: Google Fonts (Outfit)
- **Drag & Drop**: Native HTML5 API

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Merakipedrosa/PetGlow-CRM.git
cd PetGlow-CRM
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `src/supabaseClient.js` with your credentials:
   ```javascript
   const SUPABASE_URL = 'your-project-url'
   const SUPABASE_ANON_KEY = 'your-anon-key'
   ```

4. **Setup Database**
   - Run the SQL scripts in your Supabase SQL Editor:
     - `db_setup.sql` - Creates initial tables
     - `update_profiles.sql` - Adds user profile fields
     - `health_records_setup.sql` - Creates health records table

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### Tables
- **pets** - Pet profiles and information
- **bookings** - Hotel/Daycare reservations
- **profiles** - User profiles (linked to auth.users)
- **health_records** - Medical history and appointments

### Row Level Security (RLS)
All tables have RLS enabled with policies for authenticated users.

## 🎨 Design System

The app features a premium **Dark Glassmorphism** theme with:
- CSS custom properties for easy theming
- Smooth animations and transitions
- Responsive layout
- Gradient accents
- Glass-panel effects

## 📱 Pages

1. **Dashboard** - Overview and statistics
2. **Pet Passport** - Pet management
3. **Hotel & Daycare** - Booking management
4. **Health Tracker** - Medical records
5. **Login/Signup** - Authentication

## 🔧 Configuration

### Disable Email Confirmation (Development)
In Supabase Dashboard:
1. Go to Authentication → Settings
2. Disable "Enable email confirmations"

### Environment Variables
Create a `.env` file (optional):
```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Merakipedrosa**
- GitHub: [@Merakipedrosa](https://github.com/Merakipedrosa)

## 🙏 Acknowledgments

- Built with ❤️ using React and Supabase
- Design inspired by modern glassmorphism trends
- Icons: Emoji-based for simplicity

---

**PetGlow CRM** - Making pet care management beautiful and efficient! 🐶💜
