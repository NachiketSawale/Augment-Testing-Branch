/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.clerk');

	/**
	 * @ngdoc service
	 * @name basicsClerkForScheduleDataService
	 * @description pprovides methods to access, create and update basics clerk forSchedule entities
	 */
	myModule.service('basicsClerkForScheduleDataService', BasicsClerkForScheduleDataService);

	BasicsClerkForScheduleDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsClerkMainService'];

	function BasicsClerkForScheduleDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsClerkMainService) {
		var self = this;
		var basicsClerkForScheduleServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsClerkForScheduleDataService',
				entityNameTranslationID: 'basicsClerkForScheduleEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/clerk/forschedule/',
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
					leaf: {itemName: 'ClerksForSchedule', parentService: basicsClerkMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsClerkForScheduleServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
