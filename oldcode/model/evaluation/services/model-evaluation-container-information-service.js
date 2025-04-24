/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var modelEvaluationModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	modelEvaluationModule.factory('modelEvaluationContainerInformationService', ['_', '$injector',
		function (_, $injector) {

			var service = {};

			/* jshint -W074 */ // There is no complexity, try harder J.S.Hint
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '0fe1504979b947e68234ecd04c799af8': // modelEvaluationRulesetListController
						config.layout = $injector.get('modelEvaluationRulesetConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'modelEvaluationRulesetConfigurationService';
						config.dataServiceName = 'modelEvaluationRulesetDataService';
						config.validationServiceName = 'modelEvaluationRulesetValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '2189edcf60884fceb7a062c5774c3698': // modelEvaluationRulesetDetailController
						config = $injector.get('modelEvaluationRulesetConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'modelEvaluationRulesetConfigurationService';
						config.dataServiceName = 'modelEvaluationRulesetDataService';
						config.validationServiceName = 'modelEvaluationRulesetValidationService';
						break;

					case '63e957df0af245a19f9608ac9beced3b': // modelEvaluationRulesetListController (non-master)
						config = _.clone(service.getContainerInfoByGuid('0fe1504979b947e68234ecd04c799af8'));
						break;
					case '5488706fc0b047cc94029e502ecd2bfe': // modelEvaluationRulesetDetailController (non-master)
						config = _.clone(service.getContainerInfoByGuid('2189edcf60884fceb7a062c5774c3698'));
						break;

					case 'f1be1ca07e074f74a92e5bdde74af0b1': // modelEvaluationRuleset2ModuleListController
						config.layout = $injector.get('modelEvaluationRuleset2ModuleConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'modelEvaluationRuleset2ModuleConfigurationService';
						config.dataServiceName = 'modelEvaluationRuleset2ModuleDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '34a949c6c1b24e8d9e7101e3546abe56': // modelEvaluationRuleset2ModuleDetailController
						config = $injector.get('modelEvaluationRuleset2ModuleConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'modelEvaluationRuleset2ModuleConfigurationService';
						config.dataServiceName = 'modelEvaluationRuleset2ModuleDataService';
						config.validationServiceName = null;
						break;

					case '3e58fcde812847c89942f3d365dc2d9b': // modelEvaluationRuleListController
						createRuleContainerConfig(config, true, true);
						break;
					case 'ac2d8e9322e941278dc95068d8a9c5eb': // modelEvaluationRuleDetailController
						createRuleContainerConfig(config, false, true);
						break;

					case '3a0e7703abd140febba420db01e72c88': // modelEvaluationRuleListController (non-master)
						createRuleContainerConfig(config, true, false);
						break;
					case '5a4d078143764838ac5d8e7dcfa5ca9b': // modelEvaluationRuleDetailController (non-master)
						createRuleContainerConfig(config, false, false);
						break;
				}

				return config;
			};

			function createRuleContainerConfig(config, list, master) {
				var cfgService = $injector.get('modelEvaluationRuleConfigurationService');
				config.layout = list ? cfgService.getStandardConfigForListView() : cfgService.getStandardConfigForDetailView();
				config.ContainerType = list ? 'Grid' : 'Detail';
				if (master) {
					config.standardConfigurationService = (function generateMasterService () {
						function includeField(fieldId) {
							switch (fieldId) {
								case 'isdisabled':
								case 'origin':
									return false;
							}
							return true;
						}

						var svcWrapper = {};
						Object.keys(cfgService).forEach(function generateMasterServiceMember (propName) {
							var val = cfgService[propName];
							if (_.isFunction(val)) {
								switch (propName) {
									case 'getStandardConfigForListView':
										svcWrapper.getStandardConfigForListView = function () {
											var result = _.cloneDeep(cfgService.getStandardConfigForListView());
											result.columns = _.filter(result.columns, function (c) {
												return includeField(c.id);
											});
											return result;
										};
										break;
									case 'getStandardConfigForDetailView':
										svcWrapper.getStandardConfigForDetailView = function () {
											var result = _.cloneDeep(cfgService.getStandardConfigForDetailView());
											result.rows = _.filter(result.rows, function (r) {
												return includeField(r.rid);
											});
											return result;
										};
										break;
									default:
										(function () {
											var fnName = propName;
											svcWrapper[fnName] = function () {
												return cfgService[fnName].apply(cfgService, arguments);
											};
										})();
										break;
								}
							} else {
								svcWrapper[propName] = val;
							}
						});

						return svcWrapper;
					})();
				} else {
					config.standardConfigurationService = 'modelEvaluationRuleConfigurationService';
				}
				config.dataServiceName = 'modelEvaluationRuleDataService';
				config.validationServiceName = 'modelEvaluationRuleValidationService';
				if (list) {
					config.listConfig = {
						initCalled: false,
						grouping: true,
						idProperty: 'compoundId'
					};
				}
			}

			return service;
		}
	]);
})(angular);
