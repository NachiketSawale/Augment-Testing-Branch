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
	clerkModule.factory('basicsClerkAbsenceProxyService', ['globals', 'basicsClerkAbsenceService', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',

		function (globals, basicsClerkAbsenceService, platformDataServiceFactory, mandatoryProcessor) {

			var factoryOptions = {
				flatLeafItem: {
					module: clerkModule,
					serviceName: 'basicsClerkAbsenceProxyService',
					entityNameTranslationID: 'basics.clerk.entityAbsenceProxy',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/clerk/absenceproxy/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsClerkAbsenceService.getSelected();
							readData.PKey1 = selected.Id;
							readData.PKey2 = selected.ClerkFk;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsClerkAbsenceService.getSelected();
								creationData.PKey1 = selected.Id;
								creationData.PKey2 = selected.ClerkFk;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'ClerkAbsenceProxies', parentService: basicsClerkAbsenceService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'ClerkAbsenceProxyDto',
				moduleSubModule: 'Basics.Clerk',
				validationService: 'basicsClerkAbsenceProxyValidationService'
			});

			var service = serviceContainer.service;

			service.loadListForOwnClerk = function loadListForOwnClerk(){
				var origin = serviceContainer.data.endRead;
				serviceContainer.data.endRead = 'GetLastProxies';
				try {
					return service.loadSubItemList().then(function (result) {
						serviceContainer.data.endRead = origin;
						return result;
					}, function () {
						serviceContainer.data.endRead = origin;
					});
				} catch (e) {
					serviceContainer.data.endRead = origin;
				}
			};

			serviceContainer.data.doesRequireLoadAlways = true;
			return serviceContainer.service;

		}]);
})(angular);
