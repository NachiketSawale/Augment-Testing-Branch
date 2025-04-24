/**
 * Created by baf and balkanci on 08.10.2014.
 */
(function () {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsClerkAbsenceService
	 * @function
	 *
	 * @description
	 * basicsClerkAbsenceService is the data service for all clerk related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'basics.clerk';
	var clerkModule = angular.module(moduleName);
	clerkModule.factory('basicsClerkAbsenceService', ['globals', 'basicsClerkMainService', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension',

		function (globals, basicsClerkMainService, platformDataServiceFactory, ServiceDataProcessDatesExtension) {

			var factoryOptions = {
				flatNodeItem: {
					module: clerkModule,
					serviceName: 'basicsClerkAbsenceService',
					entityNameTranslationID: 'basics.clerk.entityAbsence',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/clerk/absence/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsClerkMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsClerkMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						node: {itemName: 'Absences', parentService: basicsClerkMainService}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['AbsenceFrom', 'AbsenceTo'])]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.doesRequireLoadAlways = true;
			return serviceContainer.service;

		}]);
})(angular);
