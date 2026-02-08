# 🏥 Clinique CMC-UA - Frontend

> Interface web moderne et intuitive pour la gestion complète d'une clinique médicale. Développée avec React, cette application offre une expérience utilisateur fluide pour gérer patients, consultations, analyses et opérations.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Composants Principaux](#composants-principaux)
- [Authentification](#authentification)
- [Build & Déploiement](#build--déploiement)
- [Contribuer](#contribuer)

---

## 🎯 Vue d'ensemble

Application web frontend complète pour la gestion d'une clinique médicale, développée avec React et Vite. L'interface offre des dashboards spécialisés par rôle et une gestion complète des opérations cliniques.

### Points Clés

- 🎨 Interface moderne avec Tailwind CSS
- 🔐 Authentification JWT avec gestion de rôles
- 📱 Design responsive (mobile, tablette, desktop)
- ⚡ Performance optimisée avec Vite
- 🔄 Gestion d'état avec Context API
- 📊 Dashboards personnalisés par rôle

---

## ✨ Fonctionnalités

### 🔐 Authentification & Autorisation

- Connexion sécurisée avec JWT
- Gestion multi-rôles (Admin, Médecin, Secrétaire, Laborantin, Comptable)
- Changement de rôle dynamique pour utilisateurs multi-rôles
- Session persistante avec localStorage
- Déconnexion automatique en cas d'expiration du token

### 👥 Gestion des Patients

- Création et édition de dossiers patients
- Recherche et filtrage avancés
- Vue détaillée avec historique complet
- Affichage des consultations, analyses et opérations
- Numérotation automatique (PAT-2025-XXXX)

### 🏥 Consultations & Visites

- Création de visites avec paiement intégré
- Gestion des signes vitaux
- Suivi du statut (en attente, en consultation, terminé)
- Dashboard médecin avec visites du jour
- Prise en charge des urgences

### 💊 Prescriptions Médicales

- Création d'ordonnances détaillées
- Gestion des médicaments (posologie, durée, instructions)
- Validation par médecin
- Liaison automatique au dossier patient

### 🔬 Analyses Médicales

- Prescription d'analyses (laboratoire & imagerie)
- Dashboard laborantin avec workflow complet
- Upload de fichiers PDF/Word pour résultats
- Téléchargement sécurisé des résultats
- Validation par médecin
- Gestion des priorités (Normal, Urgent)

### ⚕️ Opérations Chirurgicales

- Programmation d'opérations
- Gestion du paiement avant intervention
- Dashboard chirurgien
- Rapports pré/post-opératoires
- Suivi du statut (en attente, programmée, en cours, terminée)

### 💰 Gestion Financière

- Paiements avec système de réductions
- Gestion des dettes et versements
- Historique des paiements
- Statistiques financières
- Support espèces et mobile money

### 🏪 Administration

- Gestion des utilisateurs
- Gestion des spécialités médicales
- Attribution des permissions
- Activation/désactivation des comptes

---

## 🏗️ Architecture

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/         # Images, logos, ressources
│   ├── components/     # Composants réutilisables
│   │   ├── AdminDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── LabDashboard.jsx
│   │   ├── Patients.jsx
│   │   ├── Users.jsx
│   │   ├── Specialities.jsx
│   │   └── ...
│   ├── context/        # Gestion d'état globale
│   │   └── AuthContext.jsx
│   ├── utils/          # Utilitaires
│   │   └── axios.js    # Configuration Axios
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── .env                # Variables d'environnement
├── .gitignore
├── package.json
├── vite.config.js      # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind
└── README.md
```

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Backend API** démarré ([voir repository backend](https://github.com/ImaneBacar/CMC-UA_Backend))

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/ImaneBacar/CMC-UA_Frontend
cd CMC-UA_Frontend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
cp .env.example .env

# 4. Configurer l'URL de l'API
nano .env

# 5. Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

---

## ⚙️ Configuration

### Variables d'Environnement (`.env`)

```env
# URL de l'API backend
VITE_API_URL=http://localhost:5000/api

# Environnement
VITE_ENV=development
```

### Configuration Axios (`src/utils/axios.js`)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentRole");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

---

## 📖 Utilisation

### Démarrer le Serveur de Développement

```bash
# Mode développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### Se Connecter

1. Accéder à **http://localhost:5173**
2. Utiliser les identifiants fournis par l'administrateur
3. Le système redirige automatiquement vers le dashboard approprié selon le rôle

### Comptes de Test

```
Admin:
Email: admin@clinique.com
Mot de passe: Admin@2025

Médecin:
Email: medecin@clinique.com
Mot de passe: Medecin@2025

Secrétaire:
Email: secretaire@clinique.com
Mot de passe: Secretaire@2025

Laborantin:
Email: labo@clinique.com
Mot de passe: Labo@2025
```

---

## 📁 Structure du Projet

### Composants Principaux

#### **AdminDashboard.jsx**

- Vue d'ensemble des statistiques
- Cartes de synthèse (utilisateurs, patients, visites, recettes)
- Actions rapides

#### **DoctorDashboard.jsx**

- Liste des visites du jour
- Consultations en attente
- Accès rapide aux prescriptions et analyses

#### **LabDashboard.jsx**

- Analyses en attente
- Analyses en cours
- Analyses terminées aujourd'hui
- Upload de résultats PDF/Word

#### **Patients.jsx**

- Liste complète des patients
- Recherche et filtrage
- Création/édition de dossiers
- Vue détaillée avec historique

#### **Users.jsx**

- Gestion des utilisateurs
- Attribution des rôles et spécialités
- Activation/désactivation de comptes

#### **Specialities.jsx**

- Gestion des spécialités médicales
- Création/modification/désactivation

---

## 🔐 Authentification

### AuthContext (`src/context/AuthContext.jsx`)

```javascript
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      setUser(response.data);

      if (response.data.role && response.data.role.length > 0) {
        const savedRole = localStorage.getItem("currentRole");
        setCurrentRole(savedRole || response.data.role[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur récupération profil:", error);
      logout();
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      setToken(token);
      localStorage.setItem("token", token);
      setUser(user);

      if (user.role && user.role.length > 0) {
        setCurrentRole(user.role[0]);
        localStorage.setItem("currentRole", user.role[0]);
      }

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrentRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentRole");
  };

  const switchRole = (newRole) => {
    if (user?.role?.includes(newRole)) {
      setCurrentRole(newRole);
      localStorage.setItem("currentRole", newRole);
      return true;
    }
    return false;
  };

  const value = {
    user,
    token,
    loading,
    currentRole,
    isAuthenticated: !!user,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

## 🎨 Design System

### Tailwind CSS

Le projet utilise Tailwind CSS pour un design moderne et responsive.

**Configuration (`tailwind.config.js`)** :

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
      },
    },
  },
  plugins: [],
};
```

### Composants UI

- **Cartes** : `bg-white rounded-xl shadow-sm border`
- **Boutons** : `bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700`
- **Inputs** : `border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600`
- **Badges** : `px-2 py-1 rounded-full text-xs`

---

## 📦 Build & Déploiement

### Build pour Production

```bash
# Créer le build
npm run build

# Le dossier dist/ contient les fichiers optimisés
```

### Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Déploiement sur Netlify

```bash
# Build
npm run build

# Uploader le dossier dist/ sur Netlify
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name clinique-alkamar.com;
    root /var/www/clinique-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

---

## 🛠️ Technologies Utilisées

- **Framework :** React 18.x
- **Build Tool :** Vite 5.x
- **Styling :** Tailwind CSS 3.x
- **HTTP Client :** Axios
- **Routing :** React Router DOM (recommandé)
- **Icons :** React Icons
- **State Management :** Context API
- **Forms :** React Hook Form (recommandé)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Guidelines

- Suivre les conventions React et Tailwind
- Tester sur mobile, tablette et desktop
- Ajouter des commentaires pour le code complexe
- Mettre à jour la documentation

---

## 📝 Roadmap

### Version 1.1

- [ ] React Router pour navigation SPA
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Notifications toast (react-toastify)
- [ ] Skeleton loaders
- [ ] Pagination optimisée

### Version 1.2

- [ ] Dark mode
- [ ] Export PDF des dossiers
- [ ] Graphiques avancés (Chart.js)
- [ ] PWA (Progressive Web App)
- [ ] Mode offline

---

## 📄 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Équipe

- **Développeur Frontend :** Imane Bacar
- **Designer UI/UX :** Imane Bacar
- **Contact :** imanebacar@outlook.fr

---

## 📞 Support

Pour toute question ou problème :

- **Email :** imanebacar@outlook.fr
- **Issues :** [GitHub Issues](https://github.com/ImaneBacar/CMC-UA_Frontend/issues)
- **Backend :** [CMC-UA_Backend](https://github.com/ImaneBacar/CMC-UA_Backend)

---

<div align="center">

**Fait avec ❤️ pour la Clinique CMC-UA**

[⬆ Retour en haut](#-clinique-CMC-UA---frontend)

</div>
