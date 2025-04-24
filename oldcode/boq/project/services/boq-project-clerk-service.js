(function () {
	/* global globals */
	'use strict';
	let boqProjectModule = angular.module('boq.project');

	/**
	 * @ngdoc controller
	 * @name boqProjectClerkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  boq project clerk entity.
	 **/

	boqProjectModule.factory('boqProjectClerkLayoutService', ['platformUIConfigInitService', 'boqProjectContainerInformationService', 'boqMainTranslationService', 'platformUIStandardConfigService', 'platformSchemaService',
		function(platformUIConfigInitService, boqProjectContainerInformationService, boqMainTranslationService, platformUIStandardConfigService, platformSchemaService) {
			var layout = boqProjectContainerInformationService.getBoqProjectClerkLayout();

			var domainSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'BoqHeader2ClerkDto'});

			return new platformUIStandardConfigService(layout, domainSchema.properties, boqMainTranslationService);
		}
	]);


	/**
	 * @ngdoc service
	 * @name boqProjectClerkValidationService
	 * @description provides validation methods for boq project clerk entities
	 */

	boqProjectModule.factory('boqProjectClerkValidationService', ['platformValidationServiceFactory', 'boqProjectClerkDataService',
		function(platformValidationServiceFactory, boqProjectClerkDataService) {
			let schema = { moduleSubModule:'Boq.Main', typeName:'BoqHeader2ClerkDto' };

			var ValidationServiceProvider = function() {
				var self = this;
				platformValidationServiceFactory.addValidationServiceInterface(schema, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(schema)
				}, self, boqProjectClerkDataService);
			};

			return new ValidationServiceProvider();
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqProjectClerkDataService
	 * @description pprovides methods to access, create and update boq project clerk entities
	 */

	boqProjectModule.factory('boqProjectClerkDataService', ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'boqProjectService',
		function(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, boqProjectService) {
			var self = this;
			const baseUrl = globals.webApiBaseUrl + 'boq/project/clerk/';
			var boqProjectClerkServiceOption = {
				flatLeafItem: {
					module: boqProjectModule,
					serviceName: 'boqProjectClerkDataService',
					entityNameTranslationID: 'cloud.common.entityClerk',
					httpCreate: {route: baseUrl, endCreate: 'create'},
					httpRead: {
						route: baseUrl, endRead: 'listByParent',
						initReadData: function initReadData(readData) {
							var selected = boqProjectService.getSelected();
							var boqHeaderFK = selected && selected.BoqHeader ? selected.BoqHeader.Id : -1;
							readData.filter = '?boqHeaderId='+boqHeaderFK;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = boqProjectService.getSelected();
								creationData.Id = selected && selected.BoqHeader ? selected.BoqHeader.Id : -1;
								return creationData;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'BoqHeader2Clerks', parentService: boqProjectService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createService(boqProjectClerkServiceOption, self);
			serviceContainer.data.Initialised = true;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'boqProjectClerkValidationService'
			}, {typeName: 'BoqHeader2ClerkDto', moduleSubModule: 'Boq.Main'})); // Entity and DTO added in boq.main and not in boq.project
			return serviceContainer.service;
		}
	]);

})();
