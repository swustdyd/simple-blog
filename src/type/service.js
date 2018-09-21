import {SearchOptions, PageResult} from './index.js'

export type ServiceType = {

	/** 后台Api服务 */
	apiService: {

		/** 搜索后台Api, 目前支持的搜索条件为 name：api名，roleId：角色名称，path：api的访问路径 
		 * @param options 搜索条件
		 * @returns 搜索结果
		 */
		searchApis: (options: SearchOptions) => Promise<PageResult>,

		/** 根据api的id获取api信息 
		 * @param id api的id
		 * @returns api的数据库实体数据
		 */
		getApiById: (id: number) => Promise<Object>,

		/** 保存或者修改api信息，有id则更新，无id则新增 
		 * @param api api的数据
		 * @returns 更新或者修改后的api数据
		 */
		saveOrUpdateApi: (api: Object) => Promise<Object>,

		/** 批量保存或者修改api信息，有id则更新，无id则新增 
		 * @param apis api数组
		 * @returns 更新或者修改后的api数据
		 */
		saveOrUpdateApis: (apis: [Object]) => Promise<[Object]>
	},

	/** 菜单service */
	menuService: {

		/** 搜索菜单, 目前支持的搜索条件为 name：菜单名，roleId：角色名称，parentMenu：父级菜单的id 
		 * @param options 搜索条件
		 * @returns 搜索结果
		 */
		searchMenus: (options: SearchOptions) => Promise<PageResult>,

		/** 根据id获取菜单信息 
		 * @param id 菜单id
		 * @returns 菜单数据
		 */
		getMenuById: (id: number) => Promise<Object>,

		/** 新增或者修改菜单信息，有id则更新，无id则新增 
		 * @param menu 菜单数据
		 * @returns 更新或者修改后的菜单数据
		 */
		saveOrUpdateMenu: (menu: Object) => Promise<Object>,

		/** 批量新增或者修改菜单信息，有id则更新，无id则新增 
		 * @param menus 菜单信息的数组
		 * @returns 更新或者修改后的菜单数据
		 */
		saveOrUpdateMenus: (menus: [Object]) => Promise<[Object]>
	},

	roleAndApiService: {

		/** 根据id获取RoleAndApi 
		 * @param id RoleAndApi的id
		 * @returns RoleAndApi数据
		 */
		getRoleAndApiById: (id: number) => Promise<Object>,

		/** 保存或者修改RoleAndApi，有id则更新，无id则新增 
		 * @param roleAndApi RoleAndApi的数据
		 * @returns 保存后的RoleAndApi数据
		 */
		saveOrUpdateRoleAndApi: (roleAndApi: Object) => Promise<Object>,

		/** 批量保存或者修改RoleAndApi，有id则更新，无id则新增 
		 * @param roleAndApis RoleAndApi的数据
		 * @returns 保存后的RoleAndApi数据
		 */
		saveOrUpdateRoleAndApis: (roleAndApis: [Object]) => Promise<Object>,

		/** 根据角色id删除RoleAndApi 
		 * @param roleId 角色id
		 * @returns 
		 */
		deleteRoleAndApiByRoleId: (roleId: number) => Promise<void>
	},

	roleAndMenuService: {

		/** 根据id获取roleAndMenu 
		 * @param roleAndMenus roleAndMenu的id
		 * @returns roleAndMenu数据
		 */
		getRoleAndMenuById: (roleAndMenus: number) => Promise<Object>,

		/** 保存或者修改roleAndMenu，有id则更新，无id则新增 
		 * @param roleAndMenu roleAndMenu的数据
		 * @returns 保存后的roleAndMenu数据
		 */
		saveOrUpdateRoleAndMenu: (roleAndMenu: Object) => Promise<Object>,

		/** 批量保存或者修改roleAndMenu，有id则更新，无id则新增 
		 * @param roleAndMenus roleAndMenu的数据
		 * @returns 保存后的roleAndMenu数据
		 */
		saveOrUpdateRoleAndMenus: (roleAndMenus: [Object]) => Promise<[Object]>,

		/** 根据角色id删除RoleAndMenu 
		 * @param roleId 角色id
		 * @returns 
		 */
		deleteRoleAndMenusByRoleId: (roleId: number) => Promise<void>
	},

	roleService: {

		/** 搜索角色信息 
		 * @param options 搜索条件
		 * @returns 搜索的结果
		 */
		searchRoles: (options: SearchOptions) => Promise<PageResult>,

		/** 根据id获取角色信息 
		 * @param id 角色id
		 * @returns 角色数据
		 */
		getRoleById: (id: number) => Promise<Object>,

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

		/** 搜索用户信息 
		 * @param options 搜索条件
		 * @returns 搜索的结果
		 */
		searchUsers: (options: SearchOptions) => Promise<PageResult>,

		/** 根据id获取用户信息 
		 * @param id 用户id
		 * @returns 用户数据
		 */
		getUserById: (id: number) => Promise<Object>,

		/** 保存或者修改用户信息 
		 * @param user 用户信息数组
		 * @returns 存储后的用户信息
		 */
		saveOrUpdateUser: (user: Object) => Promise<Object>,

		/** 批量保存或者修改用户信息 
		 * @param users 用户信息数组
		 * @returns 存储后的用户信息
		 */
		saveOrUpdateUsers: (users: [Object]) => Promise<[Object]>
	}
}