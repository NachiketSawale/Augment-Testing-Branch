/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkForWicDataService
	 * @description pprovides methods to access, create and update basics clerk forWic entities
	 */
	myModule.service('basicsClerkForWicDataService', BasicsClerkForWicDataService);

	BasicsClerkForWicDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsClerkMainService'];

	function BasicsClerkForWicDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsClerkMainService) {
		var self = this;
		var basicsClerkForWicServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsClerkForWicDataService',
				entityNameTranslationID: 'basicsClerkForWicEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/clerk/forwic/',
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
					leaf: {itemName: 'ClerksForWic', parentService: basicsClerkMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsClerkForWicServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
