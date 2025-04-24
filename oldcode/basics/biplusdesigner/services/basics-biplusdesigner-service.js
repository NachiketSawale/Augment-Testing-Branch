((angular) => {
	'use strict';

	var moduleName = 'basics.biplusdesigner';

	/**
	 * @ngdoc service
	 * @name basicsBiPlusDesignerService
	 * @function
	 *
	 * @description
	 * basicsBiPlusDesignerService is the main data service for all BiPlusDesigner related functionality.
	 */
	angular.module(moduleName).factory('basicsBiPlusDesignerService', basicsBiPlusDesignerService);

	basicsBiPlusDesignerService.$inject = ['platformDataServiceFactory'];

	function basicsBiPlusDesignerService(platformDataServiceFactory) {
		const sidebarSearchOptions = {
			serviceName: 'basicsBiPlusDesignerService',
			moduleName: moduleName,  // required for filter initialization
			pattern: '',
			pageSize: 500,
			includeNonActiveItems: false,
			showOptions: true,
			showProjectContext: false,
			withExecutionHints: false
		};

		const serviceOption = {
			flatRootItem: {
				module: angular.module(moduleName),
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard/',
					endRead: 'filter',
					usePostForRead: true
				},
				presenter: {
					list: {}
				},
				dataProcessor: [],
				actions: {},
				entityRole: {
					root: {
						descField: 'DescriptionInfo.Translated',
						itemName: 'Dashboard',
						moduleName: 'cloud.desktop.moduleDescriptionNameBIPlusDesigner',
						addToLastObject: true,
						lastObjectModuleName: moduleName
					}
				},
				translation: {
					uid: 'basicsBiPlusDesignerService',
					title: 'basics.biplusdesigner.dashboardContainerTitle',
					columns: [{
						header: 'cloud.common.entityName',
						field: 'NameInfo'
					}, {
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
					}]
				},
				entitySelection: {},
				sidebarSearch: {options: sidebarSearchOptions}
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		return serviceContainer.service;
	}
})(angular);