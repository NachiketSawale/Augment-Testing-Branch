/**
 * Created by Frank Baedeker on 14.01.2015
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectLocationMainService
	 * @function
	 *
	 * @description
	 * projectLocationMainService is the data service for all location related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectClerkService', ['$http', '$q', '$log', 'projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'projectMainConstantValues','projectClerkReadOnlyProcessor',

		function ($http, $q, $log, projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, projectMainConstantValues,projectClerkReadOnlyProcessor) {
			var clerkServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectClerkService',
					entityNameTranslationID: 'basics.clerk.listClerkAuthTitle',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'Project2ClerkDto',
						moduleSubModule: 'Project.Main',
					}), projectClerkReadOnlyProcessor],
					httpCreate: {route: globals.webApiBaseUrl + 'project/main/project2clerk/'},
					httpRead: {route: globals.webApiBaseUrl + 'project/main/project2clerk/', endRead: 'listByProject'},
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
							itemName: 'Clerks',
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
				validationService: 'projectMainClerkValidationService'
			}, projectMainConstantValues.schemes.project2Clerk));

			return container.service;

		}]);
})(angular);
