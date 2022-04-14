const routes = [{
        path: "/",
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( /**webpackChunkName: "login"*/ '../views/Login'),
    },
    {
        path: '/inicio',
        name: 'inicio',
        meta: {
            requiresAuth: true,
        },
        component: () => import( /**webpackChunkName: "inicio"*/ '../views/Inicio'),
    },
    {
        path: '/categorias',
        name: 'categorias',
        meta: {
            requiresAuth: true,
        },
        component: () => import('@/views/catalogos/Categorias')
    },
    {
        path: '/productos',
        name: 'productos',
        meta: {
            requiresAuth: true,
        },
        component: () => import('@/views/catalogos/Productos')
    },
    {
        path: '/miperfil',
        name: 'miperfil',
        meta: {
            requiresAuth: true,
        },
        component: () => import('@/views/procesos/MiPerfil')
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import( /**webpackChunkName: "NoPageFound"*/ '../views/NoPageFound')
    },
];

export default routes;