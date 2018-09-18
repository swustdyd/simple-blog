export const DEFAULT_PAGESIZE = 30;

export const PASSWORD_MD5_KEY = 'blog_233333';

export const TOKEN_SECRET = 'blog_manage';

export const DEFAULT_ROLD_ID = 1;

export const DEFAULT_USER_NAME = 'hiddenuser';

export const DEFAULT_USER_ID = -1000;

export const DEFAULT_USER_PASSWORD = 'hiddenuser123456';

export const NORMAL_ROLE_ID = 1;

export const ADMIN_ROLE_ID = 2;

export const SUPERADMIN_ROLE_ID = 3;

export const DEFAULT_MENUS = [
    {
        'id':1, 
        'path':'system', 
        'name':'系统设置', 
        'icon':'setting', 
        'parentMenu':0,
        'orderNo':0
    }, 
    {
        'id':4, 'path':'role', 'name':'角色设置', 'icon':null, 'parentMenu':1, 'orderNo':0
    }, 
    {
        'id':6, 'path':'menu', 'name':'菜单设置', 'icon':null, 'parentMenu':1, 'orderNo':1
    }, 
    {
        'id':5, 'path':'userList', 'name':'用户列表', 'icon':null, 'parentMenu':1, 'orderNo':2
    }
]