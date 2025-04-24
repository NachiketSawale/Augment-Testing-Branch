(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqMainOenZzVariantDataService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenZzVariantDataService', ['platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'boqMainOenZzDataService', 'boqMainOenZzVariantValidationService',
		function(platformDataServiceFactory, basicsCommonMandatoryProcessor, boqMainOenZzDataService, boqMainOenZzVariantValidationService) {
			return {
				getInstance: function(boqMainService) {
					var service;
					var oenZzScheme = {typeName: 'OenZzVariantDto', moduleSubModule: 'Boq.Main'};
					const zzDataService = boqMainOenZzDataService.getInstance(boqMainService);

					var serviceOption = {
						flatLeafItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenZzVariantDataService',
							entityRole: {leaf: {itemName: 'OenZzVariant', parentService: zzDataService}},
							httpCreate: {route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endCreate: 'createzzvariant'},
							httpRead: {
								route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endRead: 'listzzvariant',
								initReadData: function (readData) {
									var zzItem = zzDataService.getSelected();
									readData.filter = '?zzId=' + zzItem.Id;
								}
							},
							dataProcessor: [],
							actions: {
								delete: true,
								create: 'flat',
								canCreateCallBackFunc: function () {
									var oenZZ = zzDataService.getSelected();
									return _.isObject(oenZZ);
								}
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
						validationService: boqMainOenZzVariantValidationService.getInstance(serviceContainer.service)
					}, oenZzScheme ));

					service = serviceContainer.service;

					function initCreationData(creationData) {
						creationData.Id = zzDataService.getSelected().Id;
						return creationData;
					}

					return service;
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenZzVariantControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenZzVariantControllerService', ['platformGridControllerService', 'boqMainOenService', 'boqMainOenZzVariantDataService', 'boqMainOenZzVariantUiService', 'boqMainOenZzVariantValidationService',
		function(platformGridControllerService, boqMainOenService, boqMainOenZzVariantDataService, boqMainOenZzVariantUiService, boqMainOenZzVariantValidationService) {
			return {
				getInstance: function(scope, boqMainService) {
					var dataService = boqMainOenZzVariantDataService.getInstance(boqMainService);
					var validationService = boqMainOenZzVariantValidationService.getInstance(dataService);
					platformGridControllerService.initListController(scope, boqMainOenZzVariantUiService, dataService, validationService, {});

					boqMainOenService.tryDisableContainer(scope, boqMainService, false, true);
				}
			};
		}
	]);


	/**
	 * @ngdoc service
	 * @name boqMainOenZzVariantUiService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainOenZzVariantUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService) {

			function setMaxLength(length) {
				return {
					'grid': {
						'maxLength': length
					}
				};
			}

			const layout = {
				fid: 'boq.main.oen.ZzVariant',
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
					nr: {regex: '^[0-9]$'}, // Todo BH: Limitation to one digit words, but behavior of editor has issue -> backspace not working properly
					description: setMaxLength(60)
				}
			};

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'OenZzVariantDto',moduleSubModule: 'Boq.Main'});
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
	 * @name boqMainOenZzVariantValidationService
	 * @description provides validation methods for boq main oen zz variant entities
	 */
	angular.module(moduleName).factory('boqMainOenZzVariantValidationService', ['platformValidationServiceFactory',
		function (platformValidationServiceFactory) {

			var ValidationServiceProvider = function (boqMainOenZzVariantService) {
				var self = this;
				var oenZzVariantScheme = {typeName: 'OenZzVariantDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(oenZzVariantScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(oenZzVariantScheme), uniques: ['Nr']
				}, self, boqMainOenZzVariantService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(boqMainOenZzVariantService) {
				latestCreatedValidationService = new ValidationServiceProvider(boqMainOenZzVariantService);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);
})();

