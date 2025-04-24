/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	// TODO: move to file
	angular.module(moduleName).factory('controllingControllingunittemplateValidationService',
		['globals', 'platformDataValidationService', 'controllingControllingunittemplateDataService',
			function (globals, platformDataValidationService, controllingControllingunittemplateDataService) {

				var service = {};

				service.validateCode = function validateCode(entity, value) {
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', controllingControllingunittemplateDataService.getList(), service, controllingControllingunittemplateDataService);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
					return platformDataValidationService.asyncValidateIsUnique(globals.webApiBaseUrl + 'controlling/controllingunittemplate/isuniquecode', entity, model, value, service, controllingControllingunittemplateDataService);
				};

				return service;
			}]);

	// TODO: move to file
	angular.module(moduleName).factory('controllingControllingunittemplateUnitValidationService',
		['_', '$q', '$http', 'globals', 'platformDataValidationService', 'controllingControllingunittemplateUnitDataService', 'controllingStructureDynamicAssignmentsService',
			function (_, $q, $http, globals, platformDataValidationService, controllingControllingunittemplateUnitDataService, controllingStructureDynamicAssignmentsService) {

				var service = {};

				service.validateCode = function validateCode(entity, value) {
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', controllingControllingunittemplateUnitDataService.getList(), service, controllingControllingunittemplateUnitDataService);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
					var defer = $q.defer();
					var id = entity.Id || 0;
					var templateId = entity.ControltemplateFk || 0;
					$http.get(globals.webApiBaseUrl + 'controlling/controllingunittemplate/unit/isuniquecode' + '?id=' + id + '&&' + model + '=' + value + '&&templateId=' + templateId).then(function (result) {
						if (!result.data) {
							defer.resolve(self.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || { object: model.toLowerCase() }));
						} else {
							defer.resolve(true);
						}
					});
					return defer.promise;
				};

				service.validateUomFk = function validateUomFk(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				};

				// create ["Assignment01", "Assignment02", ... "Assignment10"]
				var assignmentFields = _.map(_.range(1, 11), function (i) {return 'Assignment' + _.padStart(i, 2, 0);});
				_.each(assignmentFields, function (assignmentField) {
					service['validate' + assignmentField] = function (curUnit, assignmentValue) {
						controllingStructureDynamicAssignmentsService.validateAssignment(assignmentField, assignmentValue, curUnit);
					};
				});

				return service;
			}]);

	/**
	 * @ngdoc service
	 * @name controllingControllingunittemplateContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('controllingControllingunittemplateContainerInformationService', ['_', '$injector',
		function (_, $injector) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '201b468b575042a090e366d830c5a60d': // controllingControllingunittemplateListController
						config.layout = $injector.get('controllingControllingunittemplateConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingControllingunittemplateConfigurationService';
						config.dataServiceName = 'controllingControllingunittemplateDataService';
						config.validationServiceName = 'controllingControllingunittemplateValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'a16785bd94a8441f9f4e6fb5798a7112': // controllingControllingunittemplateDetailController
						config.layout = $injector.get('controllingControllingunittemplateConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'controllingControllingunittemplateConfigurationService';
						config.dataServiceName = 'controllingControllingunittemplateDataService';
						config.validationServiceName = 'controllingControllingunittemplateValidationService';
						break;
					case '0f64dd41abe541a5ba4470f605373b2c': // controllingControllingunittemplateUnitListController
						config.layout = $injector.get('controllingControllingunittemplateUnitConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingControllingunittemplateUnitConfigurationService';
						config.dataServiceName = 'controllingControllingunittemplateUnitDataService';
						config.validationServiceName = 'controllingControllingunittemplateUnitValidationService';

						// dynamic assignment column names
						$injector.get('controllingStructureDynamicAssignmentsService').setAssignmentColumnNames(_.get(config, 'layout.columns'));

						config.listConfig = {
							initCalled: false,
							parentProp: 'ControltemplateUnitFk',
							childProp: 'ControltemplateUnitChildren',
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							grouping: true
						};
						break;
						// TODO: detail container
						// TODO: with detail container handle also assignments! (see code snippet below)
						// dynamic assignment row names
						// $injector.get('controllingStructureDynamicAssignmentsService').setAssignmentLabels(_.get(config, 'layout.rows'));

					case 'a3aaf163058647c0872d13d0d2cd1c3d': // controllingControllingunittemplateGroupListController
						config.layout = $injector.get('controllingControllingunittemplateGroupConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingControllingunittemplateGroupConfigurationService';
						config.dataServiceName = 'controllingControllingunittemplateGroupDataService';
						config.validationServiceName = null; // TODO:
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'e062e5cb80894fd8abf2949ab1c164bb': // controllingControllingunittemplateGroupDetailController
						config.layout = $injector.get('controllingControllingunittemplateGroupConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'controllingControllingunittemplateGroupConfigurationService';
						config.dataServiceName = 'controllingControllingunittemplateGroupDataService';
						config.validationServiceName = null; // TODO:
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);