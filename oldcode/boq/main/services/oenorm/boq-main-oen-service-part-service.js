
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqMainOenServicePartControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenServicePartControllerService', ['platformGridControllerService', 'boqMainOenService', 'boqMainOenServicePartDataService', 'boqMainOenServicePartUiService', 'boqMainOenServicePartValidationService',
		function(platformGridControllerService, boqMainOenService, boqMainOenServicePartDataService, boqMainOenServicePartUiService, boqMainOenServicePartValidationService) {
			return {
				getInstance: function(scope, boqMainService) {
					var dataService = boqMainOenServicePartDataService.getInstance(boqMainService);
					var validationService = boqMainOenServicePartValidationService.getInstance(dataService);
					platformGridControllerService.initListController(scope, boqMainOenServicePartUiService, dataService, validationService, {});

					boqMainOenService.tryDisableContainer(scope, boqMainService, false, true);
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenServicePartDataService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenServicePartDataService', ['platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'boqMainOenLvHeaderDataService', 'boqMainOenServicePartValidationService',
		function(platformDataServiceFactory, basicsCommonMandatoryProcessor, boqMainOenLvHeaderDataService, boqMainOenServicePartValidationService) {
			return {
				getInstance: function(boqMainService) {
					var service;
					const oenServicePartScheme = { typeName: 'OenServicePartDto', moduleSubModule: 'Boq.Main' };
					const lvHeaderDataService = boqMainOenLvHeaderDataService.getInstance(boqMainService);

					service = _.find(lvHeaderDataService.getChildServices(), function(childService) { return 'boqMainOenServicePartDataService'===childService.getServiceName(); });
					if (service) {
						return service;
					}

					var serviceOption = {
						flatLeafItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenServicePartDataService',
							entityRole: { leaf: { itemName: 'OenServicePart', parentService: lvHeaderDataService } },
							httpCreate: { route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endCreate: 'createservicepart' },
							httpRead: {
								route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endRead: 'listservicepart',
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
						validationService: boqMainOenServicePartValidationService.getInstance(serviceContainer.service)
					}, oenServicePartScheme ));

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
	 * @name boqMainOenServicePartUiService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainOenServicePartUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService) {

			function setMaxLength(length) {
				return {
					'grid': {
						'maxLength': length
					}
				};
			}

			const layout = {
				fid: 'boq.main.oen.servicePart',
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
					nr: { regex: '^[1-9][0-9]$'},
					description: setMaxLength(60)
				}
			};

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'OenServicePartDto',moduleSubModule: 'Boq.Main'});
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
	 * @name boqMainOenServicePartValidationService
	 * @description provides validation methods for boq main oen service part entities
	 */
	angular.module(moduleName).factory('boqMainOenServicePartValidationService', ['platformValidationServiceFactory',
		function (platformValidationServiceFactory) {

			var ValidationServiceProvider = function (boqMainOenServicePartService) {
				var self = this;
				var oenServicePartScheme = {typeName: 'OenServicePartDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(oenServicePartScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(oenServicePartScheme), uniques: ['Nr']
				}, self, boqMainOenServicePartService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(boqMainOenServicePartService) {
				latestCreatedValidationService = new ValidationServiceProvider(boqMainOenServicePartService);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);
})();

