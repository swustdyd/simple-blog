export type ServiceType = {
	apiService: {
		searchApis: Function,
		/** 根据api的id获取api信息 */
		getApiById: (id: number) => {},
		saveOrUpdateApi: Function,
		saveOrUpdateApis: Function
	},
	articleService: {
		searchArticles: Function,
		getArticleById: Function,
		saveOrUpdateArticle: Function,
		deleteArticleById: Function
	},
	articleTagService: {
		getArticleTagById: Function,
		getArticleTagByArticleId: Function,
		deleteArticleTagByArticleId: Function,
		saveOrUpdateArticleTag: Function,
		saveOrUpdateArticleTags: Function
	},
	menuService: {
		searchMenus: Function,
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
		saveOrUpdateRole: Function,
		saveOrUpdateRoles: Function
	},
	tagService: {
		searchTags: Function,
		getTagById: Function,
		saveOrUpdateTag: Function,
		saveOrUpdateTags: Function
	},
	userService: {
		searchUsers: Function,
		getUserById: Function,
		saveOrUpdateUser: Function,
		saveOrUpdateUsers: Function
	}
}