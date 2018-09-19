import {SearchOptions, PageResult} from './index.js'

export type ServiceType = {

	/** 后台Api服务 */
	apiService: {

		/** 搜索后台Api 
		 * @param options 搜索条件
		 * @returns 搜索结果
		 */
		searchApis: (options: SearchOptions) => Promise<PageResult>,

		/** 根据api的id获取api信息 
		 * @param id api的id
		 * @returns 
		 */
		getApiById: (id: number) => void,

		saveOrUpdateApi: Function,

		saveOrUpdateApis: Function
	},

	/** 菜单service */
	menuService: {

		/** 搜索菜单 
		 * @param options 搜索条件
		 * @returns 搜索结果
		 */
		searchMenus: (options: SearchOptions) => Promise<PageResult>,

		getMenuById: Function,

		saveOrUpdateMenu: Function,

		saveOrUpdateMenus: Function
	},

	roleAndApiService: {

		getRoleAndApiById: Function,

		saveOrUpdateRoleAndApi: Function,

		saveOrUpdateRoleAndApis: Function,

		deleteRoleAndApiByRoleId: Function
	},

	roleAndMenuService: {

		getRoleAndMenuById: Function,

		saveOrUpdateRoleAndMenu: Function,

		saveOrUpdateRoleAndMenus: Function,

		deleteRoleAndMenusByRoleId: Function
	},

	roleService: {

		searchRoles: Function,

		getRoleById: Function,

		/** 保存或者修改角色信息 
		 * @param role 角色信息，有该id则为更新，无该id则新增
		 * @param roleAndMenus 该角色拥有的菜单浏览权限
		 * @param roleAndApis 该角色拥有的后台Api访问权限
		 * @returns 存储后的角色信息
		 */
		saveOrUpdateRole: (role: Object, roleAndMenus: [Object], roleAndApis: [Object]) => Promise<Object>,

		/** 批量保存或者修改角色信息 
		 * @param roles 角色信息数组
		 * @returns 存储后的角色信息
		 */
		saveOrUpdateRoles: (roles: [Object]) => Promise<[Object]>
	},

	userService: {

		searchUsers: Function,

		getUserById: Function,

		saveOrUpdateUser: Function,

		saveOrUpdateUsers: Function
	}
}