/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var modelEvaluationModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationEnhancedRuleEditorService
	 * @function
	 * @requires $http, $q, _, basicsCommonRuleEditorService, basicsCommonDataDictionaryOperatorService
	 *
	 * @description
	 * Defines the enhanced model evaluation rule editor.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	modelEvaluationModule.factory('modelEvaluationEnhancedRuleEditorService', ['$http', '$q', '$injector', '_',
		'basicsCommonRuleEditorService', 'basicsCommonDataDictionaryOperatorService',
		function ($http, $q, $injector, _, basicsCommonRuleEditorService, basicsCommonDataDictionaryOperatorService) {
			var service = {};

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

			service.getDefinition = function () {
				function enrichEntity(manager, ruleEntity) {
					function enrichConditions(conditions) {
						conditions.forEach(function (c) {
							manager.connectConditionEntity(c);
							if (_.isArray(c.Children)) {
								enrichConditions(c.Children);
							}
						});
					}

					if (ruleEntity.enhancedRuleDefinition) {
						enrichConditions(ruleEntity.enhancedRuleDefinition);
					}
				}

				return {
					id: 'enhanced',
					iconClass: 'ico-rule-editor-enhanced',
					html: function (info) {
						return '<div data-basics-common-rule-editor data-hierarchy="true" data-rule-editor-manager="ruleEditorManager" data-rule-definition="' + info.entityPath + '.enhancedRuleDefinition" class="filler" data-editable="!isRuleEditorReadOnly"></div>';
					},
					name$tr$: 'model.evaluation.enhancedRule',
					prepareMode: function (info) {
						var entityObj = _.get(info.scope, info.entityPath);
						if (!entityObj.enhancedRuleDefinition) {
							entityObj.enhancedRuleDefinition = [];
						}

						var editorInfo = {};

						if (!info.scope.ruleEditorManager) {
							info.scope.editable = !!info.editable;

							var mgr = basicsCommonRuleEditorService.createManager({
								useDataDictionary: true,
								serverSideEvaluation: true,
								focusTableName: 'MDL_OBJECT'
							});

							mgr.registerRuleChanged(function processRuleChanged () {
								info.fireValueChanged();
							});

							info.scope.ruleEditorManager = mgr;
							return $q.all({
								ruleEditorConfig: createRuleEditorConfig(),
								managerPreparation: mgr.prepare()
							}).then(function (cfg) {
								mgr.setConfig(cfg.ruleEditorConfig);
								if (entityObj) {
									enrichEntity(mgr, entityObj);
								}
								return editorInfo;
							});
						} else {
							return $q.when(editorInfo);
						}
					},
					updateSelection: function (info) {
						if (info.editorInstanceData.removeWatch) {
							info.editorInstanceData.removeWatch();
							info.editorInstanceData.removeWatch = null;
						}

						var entityObj = _.get(info.scope, info.entityPath);

						info.scope.editable = !!info.editable;

						if (entityObj) {
							info.editorInstanceData.removeWatch = info.scope.$watch(info.entityPath + '.enhancedRuleDefinition', function (newValue, oldValue) {
								if (!angular.equals(newValue, oldValue)) {
									info.fireValueChanged();
								}
							}, true);
							enrichEntity(info.scope.ruleEditorManager, entityObj);
						}

					},
					finalizeMode: function (info) {
						if (info.editorInstanceData.removeWatch) {
							info.editorInstanceData.removeWatch();
							info.editorInstanceData.removeWatch = null;
						}
					},
					cleanEntity: function (entity) {
						delete entity.enhancedRuleDefinition;
					},
					entityUsesMode: function (entity) {
						return !_.isNil(entity.enhancedRuleDefinition) ? 1 : 0;
					},
					getCustomToolItems: function (info) {
						return [{
							id: 'rulesFromTaggedPropKeys',
							type: 'item',
							iconClass: 'control-icons ico-ctrl-label',
							caption$tr$: 'model.evaluation.createRulesFromTaggedPropKeys',
							fn: function () {
								createRulesFromTaggedPropertyKeys(info);
							}
						}];
					}
				};
			};

			var modelAdministrationPropertyKeyTagSelectorDialogService;

			function createRulesFromTaggedPropertyKeys(info) {
				if (!modelAdministrationPropertyKeyTagSelectorDialogService) {
					modelAdministrationPropertyKeyTagSelectorDialogService = $injector.get('modelAdministrationPropertyKeyTagSelectorDialogService');
				}

				return modelAdministrationPropertyKeyTagSelectorDialogService.showDialog({
					acceptEmptySelection: false
				}).then(function (selTagIds) {
					var ruleEntity = _.get(info.scope, info.entityPath);
					if (_.isObject(ruleEntity)) {
						return $http.post(globals.webApiBaseUrl + 'model/evaluation/rule/createtaggedpropkeyconditions', {
							TagIds: selTagIds,
							CreateEnclosingGroup: _.isEmpty(ruleEntity.enhancedRuleDefinition) || !_.isEmpty(ruleEntity.enhancedRuleDefinition[0].Children)
						}).then(function (response) {
							if (_.isEmpty(ruleEntity.enhancedRuleDefinition)) {
								ruleEntity.enhancedRuleDefinition = response.data;
							} else {
								if (!_.isArray(ruleEntity.enhancedRuleDefinition[0].Children)) {
									ruleEntity.enhancedRuleDefinition[0].Children = [];
								}
								ruleEntity.enhancedRuleDefinition[0].Children.push.apply(ruleEntity.enhancedRuleDefinition[0].Children, response.data);
							}
							return true;
						});
					} else {
						throw new Error('No rule entity found.');
					}
				}, function () {
					return false;
				});
			}

			return service;
		}]);
})(angular);
