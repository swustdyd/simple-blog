export const DEFAULT_PAGESIZE = 30;

export const PASSWORD_MD5_KEY = 'blog_233333';

export const TOKEN_SECRET = 'blog_manage';

export const DEFAULT_ROLD_ID = 1;

export const DEFAULT_USER_NAME = 'dyd';

export const DEFAULT_USER_ID = -1000;

export const DEFAULT_USER_PASSWORD = 'dyd123456';

export const NORMAL_ROLE_ID = 1;

export const ADMIN_ROLE_ID = 1;

export const SUPERADMIN_ROLE_ID = 1;

export const DEFAULT_MENUS = [
    {
        name: '文章管理',
        icon: 'file-text',
        path: 'article',
        children: [
            {
                name: '文章统计',
                path: 'chart'
            },
            {
                name: '文章列表',
                path: 'list'
            },
            {
                name: '标签设置',
                path: 'tag'
            }
        ]
    },
    {
        name: '系统设置',
        icon: 'setting',
        path: 'system',
        children: [
            {
                name: '角色设置',
                path: 'role'
            },
            {
                name: '用户列表',
                path: 'user-list'
            }
        ]
    },
    {
        name: '我的',
        icon: 'user',
        path: 'user',
        children: [
            {
                name: '个人中心',
                path: 'detail'
            }
        ]
    }
];