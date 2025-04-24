/*
 * $Id: basics-workflow-filter-chain-utilities-service.js 532930 2019-02-08 08:54:36Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsWorkflowFilterChainUtilitiesService
	 * @function
	 *
	 * @description
	 * Utility routines for workflow action editors related to filter chains.
	 */
	/* jshint -W072 */ // many parameters because of dependency injectionbasicsCommonDataDictionaryOperatorService
	angular.module('basics.workflow').factory('basicsWorkflowFilterChainUtilitiesService', ['_',
		'basicsWorkflowActionEditorService', 'basicsCommonDataDictionaryOperatorService',
		'basicsCommonRuleEditorService', '$q', '$log',
		function (_, basicsWorkflowActionEditorService, basicsCommonDataDictionaryOperatorService,
		          basicsCommonRuleEditorService, $q, $log) {
			var service = {};

			service.initializeFilterChainAction = function (scope, config) {
				var actualConfig = _.assign({
					filterChainParam: 'FilterChain',
					filterChainProperty: 'filterChain',
					actionPath: 'action',
					inputPath: 'input',
					outputPath: 'output'
				}, _.isObject(config) ? config : {});

				var inputObj = _.get(scope, actualConfig.inputPath);
				if (!_.isObject(inputObj)) {
					inputObj = {};
					_.set(scope, actualConfig.inputPath, inputObj);
				}

				var outputObj = _.get(scope, actualConfig.outputPath);
				if (!_.isObject(outputObj)) {
					outputObj = {};
					_.set(scope, actualConfig.outputPath, outputObj);
				}

				var action = _.get(scope, actualConfig.actionPath);
				inputObj[actualConfig.filterChainProperty] = basicsWorkflowActionEditorService.getEditorInput(actualConfig.filterChainParam, action).value;
				outputObj[actualConfig.filterChainProperty] = basicsWorkflowActionEditorService.getEditorOutput(actualConfig.filterChainParam, action).value;

				scope.$watch((_.isEmpty(actualConfig.inputPath) ? '' : (actualConfig.inputPath + '.')) + actualConfig.filterChainProperty, function inputChainUpdated(newValue, oldValue) {
					if (newValue !== oldValue) {
						basicsWorkflowActionEditorService.setEditorInput(newValue, actualConfig.filterChainParam, action);

						basicsWorkflowActionEditorService.updateEditorOutputFromInput(oldValue, newValue, outputObj, actualConfig.filterChainProperty);
					}
				});
				scope.$watch((_.isEmpty(actualConfig.outputPath) ? '' : (actualConfig.outputPath + '.')) + actualConfig.filterChainProperty, function outputChainUpdated(newValue, oldValue) {
					if (newValue !== oldValue) {
						basicsWorkflowActionEditorService.setEditorOutput(newValue, actualConfig.filterChainParam, action);
					}
				});
			};

			service.createFilterByExpressionActionEditorDirective = function (focusTableName) {
				return {
					restrict: 'A',
					templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/basics-workflow-filter-chain-by-expr-action-editor.html',
					compile: function () {
						function createRuleEditorConfig() {
							var ruleEditorConfig = {
								AvailableProperties: [],
								AvailableOperators: [],
								RuleOperatorType: 2
							};

							var filterDataPromises = {
								operatorInfos: basicsCommonDataDictionaryOperatorService.getOperators()
							};

							return $q.all(filterDataPromises).then(function (data) {
								ruleEditorConfig.AvailableOperators = data.operatorInfos;

								return ruleEditorConfig;
							});
						}

						return {
							pre: function (scope) {
								var exprParam = 'Expression';

								service.initializeFilterChainAction(scope, {});

								var mgr = scope.ruleEditorManager = basicsCommonRuleEditorService.createManager({
									useDataDictionary: true,
									serverSideEvaluation: true,
									focusTableName: focusTableName
								});

								$q.all({
									ruleEditorConfig: createRuleEditorConfig(),
									managerPreparation: mgr.prepare()
								}).then(function (cfg) {
									mgr.setConfig(cfg.ruleEditorConfig);

									scope.$evalAsync(function () {
										_.assign(scope.input, {
											expression: (function initializeExpression() {
												var rawValue = basicsWorkflowActionEditorService.getEditorInput(exprParam, scope.action).value;
												if (_.isString(rawValue) && !_.isEmpty(rawValue)) {
													try {
														var result = JSON.parse(rawValue);
														if (_.isObject(result)) {
															return result;
														}
													} catch (ex) {
														$log.error(ex);
													}
												}
												return [];
											})()
										});

										mgr.registerRuleChanged(function processExpressionChanged() {
											basicsWorkflowActionEditorService.setEditorInput(JSON.stringify(scope.input.expression), exprParam, scope.action);
										});
									});
								});

								scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

								//accordion
								scope.inputOpen = true;
								scope.outputOpen = true;
							}
						};
					}
				};
			};

			return service;
		}]);
})();
