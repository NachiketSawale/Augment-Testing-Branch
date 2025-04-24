(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqMainOenAkzDataService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenAkzDataService', ['platformDataServiceFactory', 'boqMainOenLvHeaderDataService', 'boqMainOenAkzValidationService', 'basicsCommonMandatoryProcessor',
		function(platformDataServiceFactory, boqMainOenLvHeaderDataService, boqMainOenAkzValidationService, basicsCommonMandatoryProcessor) {
			return {
				getInstance: function(boqMainService) {
					var service;
					var oenAkzScheme = {typeName: 'OenAkzDto', moduleSubModule: 'Boq.Main'};
					const lvHeaderDataService = boqMainOenLvHeaderDataService.getInstance(boqMainService);

					var serviceOption = {
						flatLeafItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenAkzDataService',
							entityRole: {leaf: {itemName: 'OenAkz', parentService: lvHeaderDataService}},
							httpCreate: {route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endCreate: 'createakz'},
							httpRead: {
								route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endRead: 'listakz',
								initReadData: function (readData) {
									var lvHeaderItem = lvHeaderDataService.getSelected();
									readData.filter = '?lvHeaderId=' + lvHeaderItem.Id;
								}
							},
							dataProcessor: [],
							actions: {
								delete: true,
								create: 'flat'
							},
							presenter: {
								list: {
									initCreationData: initCreationData
								}
							},
						}
					};

					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

					serviceContainer.data.Initialised = true;
					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
						mustValidateFields: true,
						validationService: boqMainOenAkzValidationService.getInstance(serviceContainer.service)
					}, oenAkzScheme ));

					service = serviceContainer.service;

					function initCreationData(creationData) {
						creationData.Id = lvHeaderDataService.getSelected().Id;
						return creationData;
					}

					return service;
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenAkzControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenAkzControllerService', ['platformGridControllerService', 'boqMainOenService', 'boqMainOenAkzDataService', 'boqMainOenAkzUiService', 'boqMainOenAkzValidationService',
		function(platformGridControllerService, boqMainOenService, boqMainOenAkzDataService, boqMainOenAkzUiService, boqMainOenAkzValidationService) {
			return {
				getInstance: function(scope, boqMainService) {
					var dataService = boqMainOenAkzDataService.getInstance(boqMainService);
					var validationService = boqMainOenAkzValidationService.getInstance(dataService);
					platformGridControllerService.initListController(scope, boqMainOenAkzUiService, dataService, validationService, {});

					boqMainOenService.tryDisableContainer(scope, boqMainService, false, true);
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenAkzUiService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainOenAkzUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService) {

			function setMaxLength(length) {
				return {
					'grid': {
						'maxLength': length
					}
				};
			}

			const layout = {
				fid: 'boq.main.oen.Akz',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['nr', 'description']
					}
				],
				overloads: {
					nr: setMaxLength(30),
					description: setMaxLength(60)
				}
			};

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'OenAkzDto',moduleSubModule: 'Boq.Main'});
			if (schema) {
				boqMainOenTranslationService.register(schema);
				schema = schema.properties;
				schema.AccessRightDescriptorName = {domain: 'description'};
			}

			return new platformUIStandardConfigService(layout, schema, boqMainTranslationService);
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenAkzValidationService
	 * @description provides validation methods for boq main oen akz entities
	 */
	angular.module(moduleName).factory('boqMainOenAkzValidationService', ['platformValidationServiceFactory',
		function (platformValidationServiceFactory) {

			var ValidationServiceProvider = function (boqMainOenAkzService) {
				var self = this;
				var oenAkzScheme = {typeName: 'OenAkzDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(oenAkzScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(oenAkzScheme), uniques: ['Nr']
				}, self, boqMainOenAkzService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(boqMainOenAkzService) {
				latestCreatedValidationService = new ValidationServiceProvider(boqMainOenAkzService);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);
})();

