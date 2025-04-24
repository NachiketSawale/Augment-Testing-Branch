(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqMainOenZzDataService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenZzDataService', ['platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'boqMainOenLvHeaderDataService', 'boqMainOenZzValidationService',
		function(platformDataServiceFactory, basicsCommonMandatoryProcessor, boqMainOenLvHeaderDataService, boqMainOenZzValidationService) {
			return {
				getInstance: function(boqMainService) {
					var service;
					const oenZzScheme = {typeName: 'OenZzDto', moduleSubModule: 'Boq.Main'};
					const lvHeaderDataService = boqMainOenLvHeaderDataService.getInstance(boqMainService);

					service = _.find(lvHeaderDataService.getChildServices(), function(childService) { return 'boqMainOenZzDataService'===childService.getServiceName(); });
					if (service) {
						return service;
					}

					var serviceOption = {
						flatNodeItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenZzDataService',
							entityRole: {node: {itemName: 'OenZz', parentService: lvHeaderDataService}},
							httpCreate: {route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endCreate: 'createzz'},
							httpRead: {
								route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endRead: 'listzz',
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
						validationService: boqMainOenZzValidationService.getInstance(serviceContainer.service)
					}, oenZzScheme ));

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
	 * @name boqMainOenZzControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenZzControllerService', ['platformGridControllerService', 'boqMainOenService', 'boqMainOenZzDataService', 'boqMainOenZzUiService', 'boqMainOenZzValidationService',
		function(platformGridControllerService, boqMainOenService, boqMainOenZzDataService, boqMainOenZzUiService, boqMainOenZzValidationService) {
			return {
				getInstance: function(scope, boqMainService) {
					var dataService = boqMainOenZzDataService.getInstance(boqMainService);
					var validationService = boqMainOenZzValidationService.getInstance(dataService);
					platformGridControllerService.initListController(scope, boqMainOenZzUiService, dataService, validationService, {});

					boqMainOenService.tryDisableContainer(scope, boqMainService, false, true);
				}
			};
		}
	]);


	/**
	 * @ngdoc service
	 * @name boqMainOenZzUiService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainOenZzUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService) {

			function setMaxLength(length) {
				return {
					'grid': {
						'maxLength': length
					}
				};
			}

			const layout = {
				fid: 'boq.main.oen.Zz',
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
					nr: setMaxLength(2),
					description: setMaxLength(60)
				}
			};

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'OenZzDto',moduleSubModule: 'Boq.Main'});
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
	 * @name boqMainOenZzValidationService
	 * @description provides validation methods for boq main oen zz entities
	 */
	angular.module(moduleName).factory('boqMainOenZzValidationService', ['platformValidationServiceFactory',
		function (platformValidationServiceFactory) {

			var ValidationServiceProvider = function (boqMainOenZzService) {
				var self = this;
				var oenZzScheme = {typeName: 'OenZzDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(oenZzScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(oenZzScheme), uniques: ['Nr']
				}, self, boqMainOenZzService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(boqMainOenZzService) {
				latestCreatedValidationService = new ValidationServiceProvider(boqMainOenZzService);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);
})();

