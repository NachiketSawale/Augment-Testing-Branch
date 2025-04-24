(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainTimekeepingClerkService
	 * @function
	 *
	 * @description
	 * projectMainTimekeepingClerkService is the data service for all timekeeping2clerk related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainTimekeepingClerkDataService', ['_', '$http', '$q', '$log', 'globals', 'projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'projectMainConstantValues','projectClerkReadOnlyProcessor',

		function (_, $http, $q, $log, globals, projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, projectMainConstantValues,projectClerkReadOnlyProcessor) {
			var clerkServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectMainTimekeepingClerkService',
					entityNameTranslationID: 'project.main.entityTimekeepingClerk',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'Timekeeping2ClerkDto',
						moduleSubModule: 'Project.Main',
					}), projectClerkReadOnlyProcessor],
					httpCreate: {route: globals.webApiBaseUrl + 'project/main/timekeeping2clerk/'},
					httpRead: {route: globals.webApiBaseUrl + 'project/main/timekeeping2clerk/', endRead: 'listbyparent'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedItem = projectMainService.getSelected();
								creationData.Id = selectedItem.Id;
								delete creationData.MainItemId;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'Timekeeping2Clerks',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(clerkServiceInfo);
			container.data.Initialised = true;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'projectMainTimekeepingClerkValidationService'
			}, projectMainConstantValues.schemes.timekeeping2Clerk));

			return container.service;

		}]);
})(angular);
