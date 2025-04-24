/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkForEstimateDataService
	 * @description pprovides methods to access, create and update basics clerk for estimate entities
	 */
	myModule.service('basicsClerkForEstimateDataService', BasicsClerkForEstimateDataService);

	BasicsClerkForEstimateDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsClerkMainService'];

	function BasicsClerkForEstimateDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsClerkMainService) {
		var self = this;
		var basicsClerkForEstimateServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsClerkForEstimateDataService',
				entityNameTranslationID: 'basicsClerkForEstimateEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/clerk/forestimate/',
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
					leaf: {itemName: 'ClerksForEstimate', parentService: basicsClerkMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsClerkForEstimateServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
