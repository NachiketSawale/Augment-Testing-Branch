/*
 * $Id: basics-common-rule-operand-editor.js 584709 2020-04-27 11:12:50Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.common.directive:basicsCommonRuleOperandEditor
	 * @element div
	 * @restrict A
	 * @description Represents an editor for values in the rule editor.
	 */
	angular.module('basics.common').directive('basicsCommonRuleOperandEditor', ['basicsCommonRuleEditorService', '_', 'globals', '$translate',
		function (basicsCommonRuleEditorService, _, globals, $translate) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + '/basics.common/templates/matrixSettingsDialog/rule-editor-operand-template.html',
				replace: false,
				scope: {
					operand: '=', // operand declaration
					ruleEditorManager: '=', // rule editor manager
					model: '=', // operand data object
					entity: '=', // condition entity,
					editable: '=' // indicates whether the entity should be editable
				},
				compile: function () {
					return {
						pre: function (scope) {
							const operandPath = 'Operands[' + scope.operand.Index + ']';
							if (!_.isObject(_.get(scope.entity, operandPath))) {
								_.set(scope.entity, operandPath, {});
							}

							if (scope.model &&
								scope.model.DynamicValue &&
								(!scope.entity.Operands[1].DynamicValue || scope.operand.Index === 1 && !scope.operand.allowDynamicRangeExpression)) {
								scope.model = {};
							}
							let valueContainer = _.isObject(scope.model) ? scope.model : {};
							if (_.isArray(_.get(scope, 'model.Values'))) {
								valueContainer = _.isObject(scope.model.Values[0]) ? scope.model.Values[0] : {};
							}
							if (!_.isNil(valueContainer.Literal)) {
								const altType = scope.ruleEditorManager.getLiteralOperandDataType(valueContainer);
								if (!_.isNil(altType) && altType.DisplayDomainFk !== scope.operand.DisplaydomainFk) {
									scope.valueKind = {
										type: 'literal' + altType.DisplayDomainFk,
										altDisplayDomain: altType.DisplayDomainFk
									};
								} else {
									scope.valueKind = {
										type: 'literal',
									};
								}
							} else if (!_.isNil(valueContainer.NamedProperty) || !_.isNil(valueContainer.DdProperty)) {
								scope.valueKind = {
									type: 'fieldRef'
								};
							} else if (!_.isNil(valueContainer.EnvironmentExpression)) {
								scope.valueKind = {
									type: 'envExpr',
									options: {
										kind: scope.model.EnvironmentExpression.kind,
										id: scope.model.EnvironmentExpression.id,
										isRange: scope.ruleEditorManager.isExpressionRange(scope.model.EnvironmentExpression.kind, scope.model.EnvironmentExpression.id)
									}
								};
							} else if (!_.isNil(valueContainer.DynamicValue)) {
								scope.variableRangeLoaded = false;
								let optionsObj = {
									Parameters: [
										{
											Literal: {
												Integer: scope.model.DynamicValue.Parameters[0].Literal.Integer
											}
										}
									],
									Transformation: scope.model.DynamicValue.Transformation
								};
								switch (scope.operand.Index) {
									case 1:
										scope.valueKind = {
											type: 'dynamicRangeExpr',
											options: optionsObj,
											editable: true,
											isVariableRange: true
										};
										break;
									case 2:
										scope.valueKind = {
											type: 'dynamicRangeExprRangeUnits',
											isVariableRangeUnits: true,
											options: optionsObj,
											editable: false
										};
										break;
									case 3:
										scope.valueKind = {
											type: 'dynamicRangeExprRanges',
											isVariableRangeBounds: true,
											options: optionsObj,
											editable: false
										};
										break;
									default:
										break;
								}

							}

							scope.getUiType = function () {
								if (scope.altDisplayDomain) {
									return basicsCommonRuleEditorService.getUiTypeByDisplayDomainId(scope.altDisplayDomain);
								} else {
									return scope.operand.inputDomainOverload || basicsCommonRuleEditorService.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk);
								}
							};

							scope.allowLiteral = function () {
								const uiType = scope.getUiType();
								return scope.operand.allowLiteral && (uiType !== 'reference') && (uiType !== 'relationset');
							};

							scope.allowFieldRef = function () {
								return scope.operand.allowFieldRef;
							};

							scope.allowEnvironmentExpression = function () {
								return scope.operand.allowEnvironmentExpression;
							};

							scope.allowRangeExpression = function () {
								return scope.operand.allowRangeExpression;
							};

							scope.allowDynamicRangeExpression = function () {
								return !!scope.operand.allowDynamicRangeExpression;
							};

							scope.retrieveEnvironmentExpressions = function () {
								return scope.ruleEditorManager.getExpressionsForType(scope.getUiType(), scope.operand.TargetKind, scope.operand.TargetId, scope.allowRangeExpression());
							};
							scope.retrieveCompatibleTypes = function () {
								return scope.ruleEditorManager.getCompatibleDataTypes(scope.operand.inputDomainOverload || basicsCommonRuleEditorService.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk));
							};
						},
						post: function (scope, elem) {

							function getValueKindType() {
								if (scope.valueKind) {
									return scope.valueKind.type;
								} else {
									return null;
								}
							}

							function updateDynamicRangeOperands(operands, index, newValue) {
								const nextOperand = scope.entity.Operands[index];
								const rangesOp = scope.entity.Operands[index + 1];
								nextOperand.transform = {
									model: newValue,
									valueKind: {
										type: 'dynamicRangeExprRangeUnits',
										isVariableRangeUnits: true,
										options: {
											Parameters: [
												{
													Literal: {
														Integer: nextOperand.DynamicValue ? nextOperand.DynamicValue.Parameters[0].Literal.Integer : 1
													}
												}
											],
											Transformation: scope.entity.Operands[index].DynamicValue ? scope.entity.Operands[index].DynamicValue.Transformation : scope.model.DynamicValue.Transformation
										}
									},
									editable: false,
									isVariableRangeUnits: true
								};
								nextOperand.store = false;
								rangesOp.transform = {
									model: newValue,
									valueKind: {
										type: 'dynamicRangeExprRanges',
										isVariableRangeBounds: true,
										options: {
											Parameters: [
												{
													Literal: {
														Integer: rangesOp.DynamicValue ? rangesOp.DynamicValue.Parameters[0].Literal.Integer : -1
													}
												}
											],
											Transformation: scope.entity.Operands[index].DynamicValue ? scope.entity.Operands[index].DynamicValue.Transformation : scope.model.DynamicValue.Transformation
										}
									},
									editable: false,
									isVariableRangeBounds: true
								};

								rangesOp.store = false;

							}

							elem.addClass('rule-operand-editor');

							scope.$watch('valueKind', function processOperandValueKindChanged(newValue, oldValue) {
								if ((newValue && newValue.options &&
									newValue.options.isRange && !scope.allowRangeExpression()) ||
									newValue.isVariableRangeUnits || newValue.isVariableRangeBounds) {
									scope.editable = false;
								}

								scope.entity.countOfAddedParams = scope.operand.countOfAddedParams;
								scope.altDisplayDomain = newValue ? newValue.altDisplayDomain : undefined;

								let newData = null;

								if (scope.operand.IsSet) {
									newData = {
										Values: _.get(scope.model, 'Values')
									};
								} else {
									const dataPath = newValue ? getDataPathForValueKind(newValue.type) : null;
									if (dataPath) {
										newData = {};
										let dataObj = _.get(scope.model, dataPath);
										if (_.isObject(newValue.options)) {
											dataObj = _.assign(dataObj || {}, newValue.options);
										}
										_.set(newData, dataPath, dataObj);
									}
								}

								if (newData) {
									if (_.isObject(scope.model)) {
										Object.keys(scope.model).forEach(function (key) {
											delete scope.model[key];
										});
									} else {
										scope.model = {};
									}
									_.assign(scope.model, newData);
									// range section
									if (newValue) {
										const isVariableRange = newValue.isVariableRangeUnits || newValue.isVariableRange || newValue.isVariableRangeBounds;
										const isOldValueVariableRange = oldValue.isVariableRangeUnits || oldValue.isVariableRange || oldValue.isVariableRangeBounds;
										scope.entity.hideRangeOp = !isVariableRange;
										const index = scope.operand.Index + 1;
										if (scope.entity.Operands.length > index) {
											// set operator after own to readOnly
											const nextOperand = scope.entity.Operands[index];
											if (newValue.isRange) {
												nextOperand.transform = {
													model: newData,
													valueKind: newValue,
													editable: false
												};
												nextOperand.store = oldValue ? !oldValue.isRange && !oldValue.isVariableRange: true;
											} else if (newValue.isVariableRange) {
												if (!scope.variableRangeLoaded || !isOldValueVariableRange && scope.entity.Operands[1].DynamicValue) {
													scope.variableRangeLoaded = true;
													updateDynamicRangeOperands(scope.entity.Operands, index, newValue);
												}
											} else if (newValue.isVariableRangeUnits) {
												// do nothing
											} else if (oldValue.isRange || oldValue.isVariableRange) {
												nextOperand.restore = true;
											}
										}
									}
								}

								if (angular.equals(newValue, oldValue)) {
									return;
								}

								scope.ruleEditorManager.notifyRuleChanged();
							}, true);

							scope.$watch('model', function processOperandValueChanged(newValue, oldValue) {
								if (angular.equals(newValue, oldValue)) {
									return;
								}

								if (newValue && newValue.transform) {
									const transform = _.cloneDeep(newValue.transform);
									_.unset(scope.model, 'transform');
									if (newValue.store) {
										_.unset(scope.model, 'store');
										scope.restore = {};
										_.forEach(transform, function (v, k) {
											_.set(scope.restore, k, scope[k]);
										});
									}
									_.assign(scope, transform);
								} else if (newValue && newValue.restore) {
									scope.restore = scope.restore || {
										model: {},
										valueKind: {
											type: 'literal'
										},
										editable: true
									};
									_.assign(scope, scope.restore);
									_.unset(scope.model, 'restore');
								}

								scope.ruleEditorManager.notifyRuleChanged();
							}, true);

							function getDataPathForValueKind(valueKind) {
								switch (valueKind) {
									case 'fieldRef':
										return scope.ruleEditorManager.getPropertyOperandDataPath();
									case 'literal':
										return scope.ruleEditorManager
											.getLiteralOperandDataPath(scope.ruleEditorManager
												.getUiTypeByDisplayDomainId(scope.altDisplayDomain || scope.operand.DisplaydomainFk));
									case 'envExpr':
										return scope.ruleEditorManager.getEnvExprOperandDataPath();
									case 'dynamicRangeExpr':
										return scope.ruleEditorManager.getDynamicRangeOperandDataPath();
									case 'dynamicRangeExprRangeUnits':
										return scope.ruleEditorManager.getDynamicRangeOperandDataPath();
									case 'dynamicRangeExprRanges':
										return scope.ruleEditorManager.getDynamicRangeOperandDataPath();
									default:
										return null;
								}
							}

							scope.getDataPath = function () {
								return getDataPathForValueKind(getValueKindType());
							};

							scope.createDataPathAccessor = function () {
								return function getSetOperandData(operandValue) {
									const dataPath = scope.getDataPath();
									if (arguments.length <= 0) {
										return _.get(scope.model, dataPath);
									} else {
										_.set(scope.model, dataPath, operandValue);
									}
								};
							};

							scope.isLiteralOperand = function () {
								if (getValueKindType() === 'literal') {
									const uiType = scope.ruleEditorManager.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk);
									return (uiType !== 'lookup') && (uiType !== 'reference') && (uiType !== 'relationset');
								} else {
									return false;
								}
							};

							scope.isFieldRefOperand = function () {
								return getValueKindType() === 'fieldRef';
							};

							scope.isLookupOperand = function () {
								return (getValueKindType() === 'literal') &&
									(scope.ruleEditorManager.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk) === 'lookup') &&
									!scope.operand.IsSet &&
									!scope.ruleEditorManager.managesEnumValues();
							};

							scope.isManagedLookupOperand = function () {
								return (getValueKindType() === 'literal') &&
									(scope.ruleEditorManager.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk) === 'lookup') &&
									!scope.operand.IsSet &&
									scope.ruleEditorManager.managesEnumValues();
							};

							scope.isDynamicRangeExpression = function () {
								return getValueKindType() === 'dynamicRangeExpr';
							};

							scope.isDynamicRangeExpressionRangeUnits = function () {
								return getValueKindType() === 'dynamicRangeExprRangeUnits';
							};

							scope.isDynamicRangeExpressionRanges = function () {
								return getValueKindType() === 'dynamicRangeExprRanges';
							};

							scope.transformationChanged = function (entity, model) {
								const currentTransformation = entity.Operands[3].DynamicValue.Transformation;
								entity.Operands.forEach((op, index) => {
									if (index > 0 && model.DynamicValue) {
										op.DynamicValue.Transformation = currentTransformation;
									}
								});
							};

							scope.onRangesChanged = function (valueType, entity, model) {
								if (model && model.DynamicValue) {

									scope.entity.Operands.forEach((op, index) => {
										if(op.DynamicValue && op.DynamicValue.Parameters && _.isInteger(op.DynamicValue.Parameters[0].Literal.Integer)) {
											if (valueType === 'p' && index === 1) {
												op.DynamicValue.Parameters[0].Literal.Integer = -1 * Math.abs(op.DynamicValue.Parameters[0].Literal.Integer);
											}
											if (valueType === 'f' && index === 2) {
												op.DynamicValue.Parameters[0].Literal.Integer = Math.abs(op.DynamicValue.Parameters[0].Literal.Integer);
											}
										}
									});
								}

								return true;
							};

							scope.unitSelectorOptions = function () {
								return {
									displayMember: 'Description',
									valueMember: 'Id',
									activeValue: '1',
									items: scope.ruleEditorManager.getEnumValuesForRanges()
								};
							};


							scope.getManagedLookupSelectorOptions = function () {
								return {
									displayMember: 'Name',
									valueMember: 'Id',
									items: _.isNil(scope.operand.TargetId) ? [] : scope.ruleEditorManager.getEnumValues(scope.operand.TargetKind, scope.operand.TargetId),
									displayedItems: _.isNil(scope.operand.TargetId) ? [] : scope.ruleEditorManager.getEnumValues(scope.operand.TargetKind, scope.operand.TargetId, true)
								};
							};

							scope.isLookupSetOperand = function () {
								return (getValueKindType() === 'literal') &&
									(scope.ruleEditorManager.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk) === 'lookup') &&
									scope.operand.IsSet;
							};

							scope.isEnvironmentExpression = function () {
								return getValueKindType() === 'envExpr';
							};

							scope.getEnvironmentExpressionDisplayName = function () {
								if (scope.isEnvironmentExpression()) {
									return scope.ruleEditorManager.getExpressionName(scope.valueKind.options.kind, scope.valueKind.options.id);
								} else {
									return '';
								}
							};

							scope.getDynamicRangeExpressionDisplayName = function () {
								if (scope.isDynamicRangeExpression()) {
									return $translate.instant('basics.common.ruleEditor.dynamicValueLabel');
								} else {
									return '';
								}
							};


							scope.createSchemaGraphProvider = function () {
								return scope.ruleEditorManager.createSchemaGraphProvider({
									uiTypeId: scope.ruleEditorManager.getUiTypeByDisplayDomainId(scope.operand.DisplaydomainFk),
									targetId: scope.operand.TargetId
								});
							};

							scope.getLookupConfig = function () {
								return scope.ruleEditorManager.determineLookupColumn(scope.operand.firstOperand);
							};

							scope.getDataPathAccessor = function () {
								const path = scope.getDataPath();
								if (arguments.length <= 0 && scope.model) {
									return _.get(scope.model, path);
								} else {
									if (!_.isObject(scope.model)) {
										scope.model = {};
									}
									_.set(scope.model, path, arguments[0]);
								}
							};
						}
					};
				}
			};
		}]);
})(angular);
