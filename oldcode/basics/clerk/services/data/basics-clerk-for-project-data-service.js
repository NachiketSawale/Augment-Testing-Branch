/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkForProjectDataService
	 * @description pprovides methods to access, create and update basics clerk forProject entities
	 */
	myModule.service('basicsClerkForProjectDataService', BasicsClerkForProjectDataService);

	BasicsClerkForProjectDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsClerkMainService'];

	function BasicsClerkForProjectDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsClerkMainService) {
		var self = this;
		var basicsClerkForProjectServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsClerkForProjectDataService',
				entityNameTranslationID: 'basicsClerkForProjectEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/clerk/forproject/',
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
					leaf: {itemName: 'ClerksForProject', parentService: basicsClerkMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsClerkForProjectServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
