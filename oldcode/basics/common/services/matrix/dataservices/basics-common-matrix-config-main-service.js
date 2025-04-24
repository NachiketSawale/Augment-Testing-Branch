(function (angular) {
	/* global globals */
	'use strict';
	const serviceName = 'basicsCommonMatrixConfigMainService';
	const moduleName = 'basics.common';
	const common = angular.module(moduleName);
	common.factory(serviceName, ['$http', '_', 'platformDataServiceFactory', '$q', 'basicsCommonRuleEditorService',
		function ($http, _, platformDataServiceFactory, $q, ruleService) {
			let creationDataFunc = _.noop;
			let readDataFunc = _.noop;
			const factoryOptions = {
				module: moduleName,
				flatRootItem: {
					serviceName: serviceName,
					module: common,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/common/matrix/',
						endRead: 'getMatrixConfiguration',
						endUpdate: 'saveMatrixConfiguration',
						endCreate: 'create',
						usePostForRead: true,
						initReadData: function (data) {
							readDataFunc(data);
						}
					},
					dataProcessor: [],
					actions: {delete: true, create: 'flat'},
					entityRole: {
						root: {
							rootForModule: 'basics.common.no-root',
							itemName: 'MatrixConfigurationCompleteDto',
							module: moduleName,
							parentFilter: 'matrixId'
						}
					},
					presenter: {
						list: {
							initCreationData: function (data) {
								creationDataFunc(data);
							}
						}
					},
					modification: false
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			const service = serviceContainer.service;
			serviceContainer.data.showHeaderAfterSelectionChanged = false;

			service.setCreationDataFunc = function (func) {
				creationDataFunc = func;
			};

			service.setReadDataFunc = function (func) {
				readDataFunc = func;
			};

			service.copy = function copy() {
				const readDate = readDataFunc();
				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/common/matrix/copyconfiguration',
					data: readDate
				}).then(function (result) {
					return result.data;
				});
			};

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				if (!updateData.MainItemId && !_.isEmpty(service.getList())) {
					updateData.MainItemId = service.getList()[0].Id;
				}

				const rulesData = ruleService.getRulesData();

				if (rulesData) {
					if (!_.isEmpty(rulesData.RuleDefinitionsToSave)) {
						updateData.RuleDefinitionsToSave = rulesData.RuleDefinitionsToSave;
						updateData.EntitiesCount = updateData.EntitiesCount + _.size(rulesData.RuleDefinitionsToSave);
					}
					if (!_.isEmpty(rulesData.RuleDefinitionsToDelete)) {
						updateData.RuleDefinitionsToDelete = rulesData.RuleDefinitionsToDelete;
						updateData.EntitiesCount = updateData.EntitiesCount + _.size(rulesData.RuleDefinitionsToDelete);
					}
					// clear the rules anyway
					ruleService.clearRulesData();
				}
			};

			service.saveRuleDefinition = function saveRuleDefinition(list) {
				ruleService.saveRuleDefinition(list);
			};

			service.getRuleDefinitionByTopFk = function getRuleDefinitionByTopFk(topFk) {
				return ruleService.getRuleDefinitionByTopFk(topFk);
			};

			service.getFields = function getFields(content, columns, schema) {
				return ruleService.getFields(content, columns, schema);
			};

			return service;

		}]);
})(angular);
