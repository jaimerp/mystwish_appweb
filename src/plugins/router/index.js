import { createRouter, createWebHistory } from '@ionic/vue-router';
import { getLocalData, setLocalData } from '@/utils/localdata'

const isAuthenticated = async() => {
  let authenticated = await getLocalData('authToken')
  return authenticated == null ? false : true;
};
const introViewed = async() => {
  return await getLocalData('intro');
};
const hasLang = async() => {
  return await getLocalData('lang');
};

const pages = require.context('@/pages', true, /\.vue$/);

// Auto-router: Carga todos los componentes dentro de la carpeta "pages"
const autoRoutes = pages.keys().map((file) => {
  const name = file.replace('./', '').replace('.vue', '').toLowerCase();
  const path = name === 'index' ? '/' : `/${name}`;
  const component = pages(file).default;

  // Excluir rutas que pertenezcan a /app/*
  if (path.startsWith('/app')) return null;

  return { path, component };
}).filter(Boolean);

pages.keys().forEach((file) => {
  const name = file.replace('./', '').replace('.vue', '').toLowerCase(); // Nombre de la ruta
  const path = name === 'index' ? '/' : `/${name}`; // '/' para 'index.vue'
  const component = pages(file).default; // Carga el componente dinámicamente

  autoRoutes.push({
    path,
    component,
  });
});

// Rutas adicionales que no se generan automáticamente
const additionalRoutes = [
  // {
  //   path: '/auth/login',
  //   component: () => import('@/pages/auth/login.vue'), // Página de login
  // },
];
const routesTabs = [
  {
    path: '/app',
    component: () => import('@/pages/index.vue'), // Componente raíz de tabs
    children: [
      {
        path: 'fans',
        component: () => import('@/views/Fans.vue'), // Vista de Fans
      },
      {
        path: 'secrets',
        component: () => import('@/views/Secrets.vue'), // Vista de Secrets
      },
      {
        path: 'matchs',
        component: () => import('@/views/Matchs.vue'), // Vista de Matchs
      },
      {
        path: 'account',
        component: () => import('@/views/Account.vue'), // Vista de Account
      },
    ],
  },
  {
    path: '/',
    redirect: '/app/fans', // Redirige a la tab inicial
  },
];
// Combinar rutas dinámicas con rutas adicionales
const routes = [...routesTabs, ...additionalRoutes, ...autoRoutes];

// Crear el router
const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL || '/'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthRoute = to.path.startsWith('/auth/');
  const lang = await getLocalData('lang');
  const intro = await getLocalData('intro');
  const token = await getLocalData('authToken');

  if (to.path === '/lang') {
    next(); // siempre dejar pasar a /lang
    return;
  }

  if (!lang) {
    next('/lang');
    return;
  }
  if (!token || token === 'null' || token === 'undefined') {
    // NO está logueado
    if (isAuthRoute) {
      // puede seguir navegando dentro de /auth/*
      if (to.path === '/auth/intro' && intro) {
        next('/auth/login');
      } else {
        next();
      }
    } else {
      // No puede acceder a rutas protegidas sin login
      if (!intro) {
        next('/auth/intro');
      } else {
        next('/auth/login');
      }
    }
  } else {
    // SÍ está logueado
    if (isAuthRoute) {
      next('/'); // Evita volver al login
    } else {
      next();
    }
  }
});

export default router;