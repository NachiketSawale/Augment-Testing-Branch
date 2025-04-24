/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkForPackageDataService
	 * @description pprovides methods to access, create and update basics clerk forPackage entities
	 */
	myModule.service('basicsClerkForPackageDataService', BasicsClerkForPackageDataService);

	BasicsClerkForPackageDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsClerkMainService'];

	function BasicsClerkForPackageDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsClerkMainService) {
		var self = this;
		var basicsClerkForPackageServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsClerkForPackageDataService',
				entityNameTranslationID: 'basicsClerkForPackageEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/clerk/forpackage/',
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
					leaf: {itemName: 'ClerksForPackage', parentService: basicsClerkMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsClerkForPackageServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
