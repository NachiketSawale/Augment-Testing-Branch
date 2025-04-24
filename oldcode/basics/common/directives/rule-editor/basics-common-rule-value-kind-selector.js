/*
 * $Id: basics-common-rule-value-kind-selector.js 581126 2020-03-30 14:17:39Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.common.directive:basicsCommonRuleValueKindSelector
	 * @element div
	 * @restrict A
	 * @description Provides a button with a dropdown menu to select a value kind for the rule editor.
	 */
	angular.module('basics.common').directive('basicsCommonRuleValueKindSelector', ['_', '$translate',
		'platformMenuListUtilitiesService',
		function (_, $translate, platformMenuListUtilitiesService) {
			return {
				restrict: 'A',
				template: '<div data-platform-menu-list data-list="buttons"></div>',
				replace: false,
				scope: {
					domainType: '=',
					refEntityId: '=',
					allowFieldRef: '=',
					allowLiteral: '=',
					allowEnvironmentExpression: '=',
					allowDynamicRangeExpression: '=',
					retrieveEnvironmentExpressions: '=',
					retrieveCompatibleTypes: '=',
					model: '='
				},
				link: function (scope, elem) {
					elem.addClass('rule-operand-kind-selector');

					var actualConfig = {
						allowFieldRef: _.isNil(scope.allowFieldRef) ? true : scope.allowFieldRef,
						allowLiteral: _.isNil(scope.allowLiteral) ? false : scope.allowLiteral,
						allowEnvironmentExpression: _.isNil(scope.allowEnvironmentExpression) ? false : scope.allowEnvironmentExpression,
						allowDynamicRangeExpression: _.isNil(scope.allowDynamicRangeExpression) ? false : scope.allowDynamicRangeExpression
					};

					var initialValue = scope.model;

					var availableOptions = [];

					if (actualConfig.allowLiteral) {
						availableOptions.push({
							id: 'literal',
							caption: $translate.instant('basics.common.ruleEditor.literal'),
							group: 'default'
						});
						if (_.isNil(initialValue)) {
							initialValue = {
								type: 'literal'
							};
						}
						_.forEach(scope.retrieveCompatibleTypes(), function (dt) {
							availableOptions.push(
								{
									id: 'literal' + dt.DisplayDomainFk,
									caption: $translate.instant('basics.common.ruleEditor.literal') + ' (' + _.upperFirst(dt.FilterType) + ')',
									group: 'default'
								}
							);
						});

					}

					if (actualConfig.allowFieldRef) {
						availableOptions.push({
							id: 'fieldRef',
							caption: $translate.instant('basics.common.ruleEditor.fieldReference'),
							group: 'default'
						});
						if (_.isNil(initialValue)) {
							initialValue = {
								type: 'fieldRef'
							};
						}
					}

					if (actualConfig.allowDynamicRangeExpression) {
						availableOptions.push({
							id: 'dynamicRangeExpr',
							caption: $translate.instant('basics.common.ruleEditor.dynamicValueLabel'),
							group: 'default'
						});
					}

					function getIdForEnvironmentExpression(kind, id) {
						return 'ee[' + kind + ']' + id;
					}

					var availableEnvironmentExpressions = actualConfig.allowEnvironmentExpression ? _.map(scope.retrieveEnvironmentExpressions(), function (ee) {
						return {
							caption: ee.Name,
							id: getIdForEnvironmentExpression(ee.Kind, ee.Id),
							isRange: ee.IsRange,
							group: 'envExpr'
						};
					}) : [];

					if (availableOptions.length + availableEnvironmentExpressions.length > 1) {
						var selector = platformMenuListUtilitiesService.createFlatItems({
							asRadio: true,
							dropdown: true,
							itemFactory: function (item) {
								return {
									caption: item.caption,
									id: item.id,
									group: item.group
								};
							},
							iconClass: 'control-icons ico-input-mode',
							title: $translate.instant('basics.common.ruleEditor.operandKind'),
							items: _.concat(availableOptions, availableEnvironmentExpressions),
							separateCategoryProperty: 'group'
						});

						scope.buttons = {
							showImages: true,
							showTitles: false,
							cssClass: 'tools',
							items: [selector.menuItem]
						};

						selector.registerSelectionChanged(function () {
							var selItemId = selector.getSelection();

							if (_.isString(selItemId)) {
								var envExprParts = selItemId.match(/^ee\[(.*)\]([0-9]+)$/);
								var expr = _.find(availableEnvironmentExpressions, {id: selItemId});
								if (_.isArray(envExprParts)) {
									scope.model = {
										type: 'envExpr',
										options: {
											kind: envExprParts[1],
											id: parseInt(envExprParts[2])
										},
										isRange: expr ? expr.isRange : false
									};
								} else if (selItemId.startsWith('literal')) {
									var literalParts = selItemId.match(/^literal([0-9]+)*/);
									scope.model = {
										type: 'literal',
										altDisplayDomain: !_.isNil(literalParts[1]) ? _.toInteger(literalParts[1]) : undefined
									};
								} else if (selItemId.startsWith('dynamicRangeExpr')) {

									scope.model = {
										type: 'dynamicRangeExpr', // dynamicRangeParts[0]
										options: {
											Parameters: [
												{
													Literal: {
														Integer: scope.model && scope.model.options && scope.model.options.Parameters ? scope.model.options.Parameters[0].Literal.Integer : -1
													}
												}
											],
											Transformation: scope.model && scope.model.options && scope.model.options.Transformation ? scope.model.options.Transformation : 2
										},
										editable: true,
										isVariableRange: true
									};
								} else {
									scope.model = {
										type: selItemId
									};
								}
							} else {
								scope.model = null;
							}
						});

						selector.setSelection((function () {
							if (_.isObject(initialValue) && (initialValue.type === 'envExpr')) {
								return getIdForEnvironmentExpression(initialValue.options.kind, initialValue.options.id);
							} else {
								return initialValue.type;
							}
						})());
					} else {
						scope.buttons = null;
						if (_.isNil(scope.model)) {
							scope.model = initialValue;
						}
					}
				}
			};
		}]);
})();
