(function (angular) {
	'use strict';
	var myModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkRoleDefaultValueDataService
	 * @description pprovides methods to access, create and update basics clerk RoleDefaultValue entities
	 */
	myModule.service('basicsClerkRoleDefaultValueDataService', BasicsClerkRoleDefaultValueDataService);

	BasicsClerkRoleDefaultValueDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsClerkMainService'];

	function BasicsClerkRoleDefaultValueDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsClerkMainService) {
		var self = this;
		var basicsClerkRoleDefaultValueServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsClerkRoleDefaultValueDataService',
				entityNameTranslationID: 'basicsClerkRoleDefaultValueEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/clerk/roledefaultvalue/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsClerkMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = basicsClerkMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ClerkRoleDefaultValues', parentService: basicsClerkMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsClerkRoleDefaultValueServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
