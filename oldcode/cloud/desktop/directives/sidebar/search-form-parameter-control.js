(function (angular) {
	'use strict';

	function cloudDesktopSearchFormControl($compile, $templateCache) {
		return {
			restrict: 'A',
			scope: {
				parameters: '=',
				bulkManager: '='
			},
			template: $templateCache.get('sidebar-search-form-control')
		};
	}

	cloudDesktopSearchFormControl.$inject = ['$compile', '$templateCache'];
	angular.module('cloud.desktop').directive('cloudDesktopSearchFormControl', cloudDesktopSearchFormControl);

	function cloudDesktopSearchFormParameterControl($compile, $templateCache) {
		return {
			restrict: 'A',
			scope: {
				parameter: '=',
				bulkManager: '=',
				uiOptions: '='
			},
			template: $templateCache.get('sidebar-search-form-parameter-control')
		};
	}

	cloudDesktopSearchFormParameterControl.$inject = ['$compile', '$templateCache', '_', 'moment'];
	angular.module('cloud.desktop').directive('cloudDesktopSearchFormParameterControl', cloudDesktopSearchFormParameterControl);

	function cloudDesktopSearchFormInputControl($compile, $templateCache, _, moment, $q, $translate) {
		return {
			restrict: 'A',
			scope: {
				parameter: '=',
				bulkManager: '=',
				value: '=',
				uiOptions: '='
			},
			template: $templateCache.get('sidebar-search-form-input-control'),
			link: function (scope) {

				scope.valueReady = false;

				scope.localConfig = {};
				scope.uiOptions = scope.uiOptions || scope.parameter.uiOptions;

				if(scope.value.mode === 'dynamicRangeExpr') {
					scope.uiOptions = {
						literal: 'dropdown'
					};
					if (!scope.value.type) {
						scope.uiOptions.dynamicRangeExpr = 'dropdown';
					} else  {
						scope.uiOptions.envExpr = 'dropdown';
					}
				}

				var modelPath = getModelPath(scope.value.mode);
				var outstandingRequests = [];

				// mode section

				scope.localConfig.tabs = {
					literal: false,
					envExpr: false,
					lookup: false,
					dynamicRangeExpr: false
				};
				scope.localConfig.singleTab = (_.size(scope.uiOptions) <= 1);

				function setTabs(mode) {
					scope.localConfig.tabs = _.mapValues(scope.localConfig.tabs, function () {
						return false;
					});
					if (_.has(scope.uiOptions, mode)) {
						scope.localConfig.tabs[mode] = true;
					} else {
						var key = _.keys(scope.uiOptions)[0];
						if (key) {
							scope.localConfig.tabs[key] = true;
						}
					}
				}

				function initialise(promises) {
					if (_.isUndefined(promises) || (_.isArray(promises) && _.isEmpty(promises))) {
						promises = [$q.when(true)];
					}
					$q.all(promises).then(function () {
						// set ready
						scope.valueReady = true;

						setTabs(scope.value.mode);
						switch (scope.value.mode) {
							case 'envExpr':
								var envExpr = _.get(scope.value.model, modelPath);
								if (envExpr) {
									var exprDef = findEnvironmentExpression(getIdForEnvironmentExpression(envExpr.kind, envExpr.id));
									if (exprDef) {
										scope.onSelectExpression(exprDef);
									}
								}
								break;
							case 'lookup':
								if (scope.uiOptions.lookup === 'multiSelect') {
									var lookups = _.map(scope.value.model.Values, modelPath);
									scope.localConfig.selLookup = lookups;
								} else {
									var lookupId = _.get(scope.value.model, modelPath);
									var lookup = _.find(scope.bulkManager.getEnumValues(scope.parameter.target.kind, scope.parameter.target.id), {Id: lookupId});
									if (lookup) {
										scope.onSelectLookup(lookup);
									}
								}
						}
						// set model if not set
						if (_.isEmpty(scope.value.model)) {
							scope.getDataPathAccessor(null);
						}
						// set description
						setModelDescription();
						validateModel();
					});
				}

				var cachedValues = {};

				scope.onSwitchMode = function (mode) {
					scope.value.mode = mode;
					// reset model if required
					if (modelPath !== getModelPath(mode)) {
						cachedValues[modelPath] = scope.value.model;
						scope.value.model = cachedValues[getModelPath(mode)] || {};
						if(modelPath === 'DynamicValue') {
							cachedValues[scope.parameter.values[1].type] = scope.parameter.values[1].model;
							scope.parameter.values[1].model = _.cloneDeep(cachedValues[getModelPath(mode)]) || {};
							scope.parameter.values[1].mode = mode;
						}
						if(getModelPath(mode) === 'DynamicValue') {
							scope.parameter.values[1].model = cachedValues[scope.parameter.values[1].type];
							scope.parameter.values[1].mode = mode;
						}
						modelPath = getModelPath(mode);
						setRange(false);
					}
					initialise();
				};

				// mode section end

				// model section

				scope.getDataPathAccessor = function () {
					if (arguments.length <= 0 && scope.value.model) {
						return _.get(scope.value.model, modelPath);
					} else {
						if (!_.isObject(scope.value.model)) {
							scope.value.model = {};
						}
						if (_.isArray(arguments[0])) {
							scope.value.model.Values = [];
							_.forEach(arguments[0], function (val) {
								var newVal = {};
								_.set(newVal, modelPath, val);
								scope.value.model.Values.push(newVal);
							});
						} else {
							_.set(scope.value.model, modelPath, arguments[0]);
						}
						// additionally, reset description!
						setModelDescription();
						// check if model is invalid
						validateModel(arguments[0]);
					}
				};

				function getModel() {
					// if multiple selection
					if (_.has(scope.value.model, 'Values')) {
						return _.map(scope.value.model.Values, modelPath);
					} else {
						return _.get(scope.value.model, modelPath);
					}
				}

				function getModelPath(mode) {
					var accessPath;
					switch (mode) {
						case 'literal':
						case 'lookup':
							accessPath = scope.bulkManager.getLiteralOperandDataPath(scope.parameter.domain);
							break;
						case 'envExpr':
							accessPath = scope.bulkManager.getEnvExprOperandDataPath();
							break;
						case 'dynamicRangeExpr':
							accessPath = scope.bulkManager.getDynamicRangeOperandDataPath();
					}
					return accessPath;
				}

				function validateModel(model) {
					model = !_.isUndefined(model) ? model : getModel();
					// undefined values, empty strings and empty arrays
					scope.value.valid =
						!_.isUndefined(model) && !_.isNull(model) && !_.isNaN(model) &&
						(!_.isString(model) || model.length > 0) &&
						(!_.isArray(model) || model.length > 0);
				}

				// model section end

				// description section

				function setModelDescription() {
					var model = getModel();
					if (!model) {
						return;
					}

					let valueType = scope.value.type;
					switch (scope.value.mode) {
						case 'literal':
							switch (scope.parameter.domain) {
								case 'date':
									scope.value.description = moment.isMoment(model) ? model.format('L') : 'invalid';
									break;
								default:
									scope.value.description = model.toString(); // string, int, float
									break;
							}
							break;
						case 'envExpr':
							var envExpr = findEnvironmentExpression(getIdForEnvironmentExpression(model.kind, model.id));
							scope.value.description = envExpr ? envExpr.label : 'invalid';
							break;
						case 'lookup':
							if (_.isArray(model)) {
								var selectedLookups = _.map(_.filter(scope.lookupOptions.items, function (lookup) {
									return model.includes(lookup.Id);
								}), 'Name');
								scope.value.description = selectedLookups.join(', ');
							} else {
								scope.value.description = _.find(scope.lookupOptions.items, {Id: model});
							}
							break;
						case 'dynamicRangeExpr':
							if (valueType === 'dynamicRangeExprRangeUnits') {
								scope.value.description = scope.bulkManager.getEnumValuesForRanges().find(option => option.Id === model.Transformation).Description;
							} else {
								scope.value.description = model.Parameters[0].Literal.Integer.toString();
							}
							break;
					}
					// if all descriptions are set
					var allDescriptions = _.every(scope.parameter.values, function (val) {
						return _.isString(val.description) || val.hidden;
					});
					if (allDescriptions) {
						if (scope.parameter.values[0] && scope.parameter.values[0].model.DynamicValue) {
							setDynamicRangeDescription();
						} else {
							setParameterModelDescription();
						}
					}
				}

				function setDynamicRangeDescription() {
					let pastRange, futureRange, pastRangeUnitDesc, futureRangeUnitDesc, currentRangeUnit;
					_.forEach(scope.parameter.values, function (val, index) {
						switch (index) {
							case 0:
								pastRange = val.model.DynamicValue.Parameters[0].Literal.Integer;
								break;
							case 1:
								futureRange = val.model.DynamicValue.Parameters[0].Literal.Integer;
								break;
							case 2:
								currentRangeUnit = scope.bulkManager.getEnumValuesForRanges().find(option => option.Id === val.model.DynamicValue.Transformation);

								pastRangeUnitDesc = futureRangeUnitDesc = getVariableRangeUnitDescription(currentRangeUnit, false).toString();
								if (pastRange === -1) {
									pastRangeUnitDesc = getVariableRangeUnitDescription(currentRangeUnit, true);
								}
								if (futureRange === 1) {
									futureRangeUnitDesc = getVariableRangeUnitDescription(currentRangeUnit, true);
								}
								break;
						}
					});
					getVariableRangePreviewString(pastRange, pastRangeUnitDesc, futureRange, futureRangeUnitDesc);
					scope.parameter.valueDescriptionEdit = `[${pastRange}/+${futureRange} ${currentRangeUnit.Description}]`;
				}

				function getVariableRangeUnitDescription(currentRangeUnit, singular) {
					let currentRangeUnitDesc;
					switch (currentRangeUnit.Id) {
						case 1:
							if (singular) {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.hour');
							} else {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.hours');
							}
							break;
						case 2:
							if (singular) {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.day');
							} else {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.days');
							}
							break;
						case 3:
							if (singular) {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.week');
							} else {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.weeks');
							}
							break;
						case 4:
							if (singular) {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.month');
							} else {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.months');
							}
							break;
						case 5:
							if (singular) {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.year');
							} else {
								currentRangeUnitDesc = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.years');
							}
							break;
					}
					return currentRangeUnitDesc;
				}

				function getVariableRangePreviewString(pastRange, pastRangeUnit, futureRange, futureRangeUnit) {
					scope.parameter.valueDescription = $translate.instant('cloud.desktop.searchFormWizard.step2.variableRangeExpr.descriptionVariableRangeTemplate');
					scope.parameter.valueDescription = scope.parameter.valueDescription
						.replace('${0}', (Math.abs(pastRange)).toString())
						.replace('${1}', (pastRangeUnit.toLowerCase()).toString())
						.replace('${2}', (futureRange).toString())
						.replace('${3}', (futureRangeUnit.toLowerCase()).toString());
				}

				function setParameterModelDescription() {
					var modelList = [];
					_.forEach(scope.parameter.values, function (val) {
						if (!val.hidden || (val.hidden && val.type && val.type.DynamicValue)) {
							modelList.push(val.description);
						}
					});
					scope.parameter.valueDescription = scope.parameter.valueDescriptionEdit = '[ ' + modelList.join(' - ') + ' ]';
				}

				scope.unitSelectorOptions = function () {
					return {
						displayMember: 'Description',
						valueMember: 'Id',
						activeValue: '1',
						items: scope.bulkManager.getEnumValuesForRanges()
					};
				};

				scope.onRangesChanged = (valueType, model) => {
					scope.parameter.values.forEach((op, index) => {
						if(op.model.DynamicValue && op.model.DynamicValue.Parameters && _.isInteger(op.model.DynamicValue.Parameters[0].Literal.Integer)) {
							if (valueType === 'p') {
								if (index === 0) {
									op.model.DynamicValue.Parameters[0].Literal.Integer = -1 * Math.abs(op.model.DynamicValue.Parameters[0].Literal.Integer);
									op.description = op.model.DynamicValue.Parameters[0].Literal.Integer.toString();
									setDynamicRangeDescription();
								}
								if (index === 2) {
									op.model.DynamicValue.Parameters[0].Literal.Integer = scope.parameter.values[0].model.DynamicValue.Parameters[0].Literal.Integer;
								}
							}
							if (valueType === 'f' && index === 1) {
								op.model.DynamicValue.Parameters[0].Literal.Integer = Math.abs(op.model.DynamicValue.Parameters[0].Literal.Integer);
								op.description = op.model.DynamicValue.Parameters[0].Literal.Integer.toString();
								setDynamicRangeDescription();
							}
						}
					});

				};

				scope.transformationChanged = () => {
					let transformationOp = scope.parameter.values[0];
					const currentTransformation = transformationOp.model.DynamicValue.Transformation;
					transformationOp.model.type = 'dynamicRangeExprRangeUnits';
					scope.parameter.values[2].description = scope.bulkManager.getEnumValuesForRanges().find(option => option.Id === transformationOp.model.DynamicValue.Transformation).Description;
					scope.parameter.values.forEach((op, index) => {
						if (index > 0 && scope.parameter.values[0].model.DynamicValue) {
							op.model.DynamicValue.Transformation = currentTransformation;
						}
					});
					setDynamicRangeDescription();
				};

				// description section end

				// literal section

				scope.inlineCalendarOptions = {
					showClear: false,
					showTodayButton: false,
					disablePopup: true
				};

				// literal section end

				// envExpr section

				scope.localConfig.selExpr = {};

				function setRange(active) {
					_.forEach(scope.parameter.values, function (val) {
						if (val.upperBound) {
							val.hidden = active;
						}
						if(val.type === 'dynamicRangeExprRangeUnits' || val.upperBound && scope.localConfig.tabs.dynamicRangeExpr === true) {
							val.hidden = true;
						}
					});
				}

				scope.onSelectExpression = function (expression) {
					scope.localConfig.selExpr = expression;
					var exprModel = {
						kind: expression.kind,
						id: expression.id
					};
					if (scope.value.lowerBound) {
						setRange(expression.isRange);
					}
					scope.getDataPathAccessor(exprModel);
				};

				function getIdForEnvironmentExpression(kind, id) {
					return 'ee[' + kind + ']' + id;
				}

				function findEnvironmentExpression(identifier) {
					return _.find(scope.getEnvironmentExpressions(), {identifier: identifier});
				}

				scope.getEnvironmentExpressions = function () {
					var allowRange = scope.value.lowerBound || false;
					return _.map(scope.bulkManager.getExpressionsForType(scope.parameter.domain, scope.parameter.target.kind, scope.parameter.target.id, allowRange), function (expr) {
						return {
							identifier: getIdForEnvironmentExpression(expr.Kind, expr.Id),
							id: expr.Id,
							kind: expr.Kind,
							label: expr.Name,
							isRange: expr.IsRange
						};
					});
				};

				scope.environmentExpressionOptions = {
					displayMember: 'label',
					valueMember: 'identifier',
					onSelect: scope.onSelectExpression,
					items: scope.getEnvironmentExpressions(),
					modelIsObject: true
				};

				// envExpr section end

				// lookup section

				scope.localConfig.selLookup = {};

				function loadEnum() {
					return scope.bulkManager.loadEnumValues(scope.parameter.target.kind, scope.parameter.target.id).then(function () {
						scope.lookupOptions.items = scope.bulkManager.getEnumValues(scope.parameter.target.kind, scope.parameter.target.id);
					});
				}

				scope.onMultiSelectLookup = function (redundantScope, lookups) {
					scope.localConfig.selLookup = lookups;
					var dataSet = _.map(lookups, function (l) {
						return parseInt(l);
					});
					scope.getDataPathAccessor(dataSet);
				};

				scope.onSelectLookup = function (lookup) {
					scope.localConfig.selLookup = lookup;
					scope.getDataPathAccessor(lookup.Id);
				};

				scope.lookupOptions = {
					items: scope.bulkManager.getEnumValues(scope.parameter.target.kind, scope.parameter.target.id), // not working yet!!
					valueMember: 'Id',
					displayMember: 'Name',
					onSelect: scope.onSelectLookup,
					modelIsObject: true
				};

				if (scope.value.mode === 'lookup' && _.isEmpty(scope.lookupOptions.items)) {
					outstandingRequests.push(loadEnum());
				}

				// lookup section end

				initialise(outstandingRequests);
			}
		};
	}

	cloudDesktopSearchFormInputControl.$inject = ['$compile', '$templateCache', '_', 'moment', '$q', '$translate'];
	angular.module('cloud.desktop').directive('cloudDesktopSearchFormInputControl', cloudDesktopSearchFormInputControl);

})(angular);