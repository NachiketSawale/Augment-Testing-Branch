(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';
	var itemModule = angular.module(moduleName);

	itemModule.factory('productionplanningCommonHeaderClerkDataServiceFactory', ClerkDataService);

	ClerkDataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'platformDataServiceProcessDatesBySchemeExtension'];

	function ClerkDataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor, platformDataServiceProcessDatesBySchemeExtension) {

		var serviceFactroy = {};

		serviceFactroy.getService = function(headerDataService) {

			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'Header2ClerkDto',
					moduleSubModule: 'ProductionPlanning.Header'
				}
			);

			var serviceInfo = {
				flatLeafItem: {
					module: itemModule,
					serviceName: 'productionplanningCommonHeaderClerkDataService',
					entityNameTranslationID: 'productionplanning.common.entityHeaderClerk',
					httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/header/header2clerk/'},
					dataProcessor: [dateProcessor],
					entityRole: {
						leaf: {
							itemName: 'Header2Clerk',
							parentService: headerDataService,
							parentFilter: 'headerFk'
						}
					},
					presenter: {
						list: {
							initCreationData: function (creationData) {
								creationData.Id = headerDataService.getSelected().Id;
							}
						}
					}
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Header2ClerkDto',
				moduleSubModule: 'ProductionPlanning.Header',
				validationService: 'productionplanningCommonHeaderClerkValidationService'
			});

			return container.service;
		};

		return serviceFactroy;
	}
})(angular);