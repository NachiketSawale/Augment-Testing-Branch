(function (angular) {
	'use strict';

	function cloudDesktopSearchFormConditions($templateCache, moment, _, basicsCommonRuleEditorService) {
		return {
			restrict: 'A',
			template: $templateCache.get('sidebar-bulk-search-form-wizard-step1'),
			scope: {
				entity: '='

			},
			link: function (scope) {
				var promises = [];
				var bulkManager = scope.entity.bulkManager;
				var schemaGraphProvider = bulkManager.createSchemaGraphProvider();

				// recursive, analyses a group
				function forQueryDescriptionDirectiveBulk(obj, originalPath) {
					if (!_.isNil(_.get(obj, 'Children'))) {

						var groupOperator = _.find(bulkManager.getGroupOperators(), {Id: obj.OperatorFk}); // get group operators
						var selector = groupOperator ? groupOperator.DescriptionInfo.Description : null;

						var conditionGroup = {
							operands: [],
							selector: selector
						};

						angular.forEach(obj.Children, function (child, index) {
							var path = originalPath ? (originalPath + '.' + index) : index.toString();
							// check if child is a group
							if (!_.isNil(_.get(child, 'Children')) && child.Children.length > 0) {
								forQueryDescriptionDirectiveBulk(child, path);
							} else {
								// get properties from operators
								var formParameter = getObjectForProcessData(child, path);
								conditionGroup.operands.push(formParameter);
							}
						});

						scope.entity.conditionGroups.push(conditionGroup);
					}
				}

				function getObjectForProcessData(condition, path) {
					var _toReturn = {};

					if (condition.hasOwnProperty('Operands')) {

						// field is first!
						// path of firset operand

						var fieldInfoPromise = bulkManager.firstOperandChanged(condition).then(function () {
							// add field to
							var operator = bulkManager.getOperatorItemOfCondition(condition);

							// if domainFk is 0-> domain does not matter
							var displayDomain = operator.DisplaydomainFk > 0 ? basicsCommonRuleEditorService.getUiTypeByDisplayDomainId(operator.DisplaydomainFk) : null; // important!!

							var operandInformation = _.head(bulkManager.getOtherOperands(condition)) || null;

							var operands = processOperands(condition, displayDomain, operandInformation);

							if (_.some(operator.Parameters, {allowRangeExpression: true})) {
								processRangeParameters(operands, operator);
							}

							var additionalProperties = {
								stringLiteral: operands.names,
								values: operands.values,
								operator: operator.DescriptionInfo.Translated || operator.DescriptionInfo.Description,
								parameterCount: (condition.Operands.length - 1),
								domain: displayDomain,
								target: operandInformation ? getTarget(operandInformation) : {},
								isSet: _.some(operator.Parameters, {IsSet: true})
							};
							_.merge(_toReturn, additionalProperties);
						});
						promises.push(fieldInfoPromise);

						// add name to promises
						var displayNamePromise = schemaGraphProvider.getDisplayNameForItem(_.get(condition, bulkManager.getPropertyOperandPath(0))).then(function (name) {
							_toReturn.fieldName = name.short || name.long || 'unresolved';
						});
						promises.push(displayNamePromise);

						// get paths of field, rest is for default values!
						_toReturn = {
							checked: _.includes(scope.entity.bulkPaths, path) ? true : false,
							isInvalid: isInvalid(condition),
							selected: false, // need for step2. If selected -> set active-class,
							accessPath: path
						};
					}

					return _toReturn;
				}

				function processRangeParameters(operands, operator) {
					_.forEach(_.tail(operator.Parameters), function (param, index) {
						if (param.allowRangeExpression) {
							_.set(operands.values[index], 'lowerBound', true);
						}
						if (index < operands.values.length) {
							_.set(operands.values[index + 1], 'upperBound', true);
						}
					});
				}

				function getTarget(information) {
					var result = {};
					if (information.TargetId) {
						result.id = information.TargetId;
						result.kind = information.TargetKind || '';
					}
					return result;
				}

				function getEnumIndex(path) {
					var kind = path.substring(0, 1);
					var id = path.substring(1, path.length);
					return {
						kind: kind,
						id: parseInt(id)
					};
				}

				function processOperands(condition, displayDomain, info) {
					var values = [];
					var names = [];
					var prop = _.head(condition.Operands);
					var operands = _.tail(condition.Operands);

					if(operands.length > 0 && !operands[0].DynamicValue){
						operands.splice(2, 1);
					}

					_.forEach(operands, function (op, index) {
						// add value
						var valueObject = {
							model: op
						};
						// add name
						if (displayDomain === 'lookup') {
							valueObject.mode = 'lookup';

							// not solved!!!
							var enumId = info ? info.TargetId : null;
							var enumKind = info ? info.TargetKind : '';

							// is characteristic (special for now)
							var characteristics = [];
							var path = bulkManager.getLiteralOperandDataPath(displayDomain);
							if (_.has(op, path)) {
								characteristics.push(_.get(op, path));
							} else if (_.has(op, 'Values')) {
								characteristics = _.map(op.Values, path);
							}
							var enumList = bulkManager.getEnumValues(enumKind, enumId);
							_.forEach(characteristics, function (chr) {
								var enumValue = _.find(enumList, {Id: chr});
								names.push(enumValue.Name);
							});
						}
						// is literal
						else if (_.has(op, bulkManager.getLiteralOperandDataPath(displayDomain))) {
							valueObject.mode = 'literal';
							// switch for different data types to print
							var literal = _.get(op, bulkManager.getLiteralOperandDataPath(displayDomain));
							if(literal !== undefined && literal !== null ){
								switch (displayDomain) {

									case 'dateutc':
									case 'datetimeutc':
										names.push(literal.format('YYYY-MM-DD'));
										break;
									case 'lookup': // currently broken!
										// get
										break;
									default:
										names.push(literal);
										break;
								}
							}
						}
						// is field
						else if (_.has(op, bulkManager.getPropertyOperandDataPath())) {
							valueObject.mode = 'property';
							var property = _.get(op, bulkManager.getPropertyOperandDataPath());

							names.push(property);
						}
						// is environment expression
						else if (_.has(op, bulkManager.getEnvExprOperandDataPath())) {
							valueObject.mode = 'envExpr';
							var ee = _.get(op, bulkManager.getEnvExprOperandDataPath());
							names.push(bulkManager.getExpressionName(ee.kind, ee.id));
						}

						// is dynamic value expression
						else if (_.has(op, bulkManager.getDynamicRangeOperandDataPath())) {
							valueObject.mode = 'dynamicRangeExpr';
							switch (index) {
								case 0:
									names.push(valueObject.model.DynamicValue.Parameters[0].Literal.Integer.toString());
									break;
								case 1:
									names.push(valueObject.model.DynamicValue.Parameters[0].Literal.Integer.toString());
									valueObject.hidden = true;
									valueObject.type = 'dynamicRangeExprFuture';
									break;
								case 2:
									names.push(bulkManager.getEnumValuesForRanges().find(option => option.Id === valueObject.model.DynamicValue.Transformation).Description);
									valueObject.hidden = true;
									valueObject.type = 'dynamicRangeExprRangeUnits';
									break;
							}
						}

						// if model of value is empty -> set default mode
						if (_.isEmpty(valueObject.model)) {
							valueObject.mode = 'literal';
						}

						// add valueObj
						values.push(valueObject);
					});
					var result = {
						names: values.find(v => v.mode === 'dynamicRangeExpr') ? `${names[0]}/+${names[1]} ${names[2]}`: names.join(' - '),
						values: values
					};
					return result;
				}

				function isInvalid(condition) {
					// return any not value or reference expression!
					// bulkManager.determineDomain(condition, index) === 'lookup' ||
					var parameters = _.tail(condition.Operands);
					return _.some(parameters, function (operand, index) {
						return bulkManager.determineDomain(condition, index) === 'reference' ||
							_.has(operand, bulkManager.getPropertyOperandDataPath());
					});
				}

				function getConditionGroups() {
					/*
						Two way to call this wizard:
							1.) from enhanced search -> create new searchform
							2.) from form search -> edit searchform --> cope.entity.edit = true
					 */

					if (scope.entity.conditionGroups.length < 1 || scope.entity.selectedFormChanged) {
						scope.entity.conditionGroups = [];

						// need later for the save process
						if (scope.entity.edit) {
							// scope.entity.searchFormDefinitionInfo.filterDef = scope.entity.filterDef.filterDef.enhancedFilter;
							_.forEach(scope.entity.formDef.filterDef.parameters, function (param) {
								scope.entity.bulkPaths = _.concat(scope.entity.bulkPaths, param.bulkPaths);
							});
						}
						forQueryDescriptionDirectiveBulk(scope.entity.formDef.filterDef.enhancedFilter[0]);
					}
				}

				getConditionGroups();

				scope.isChanged = function (item, event) {
					item.checked = event.target.checked;
				};
			}
		};
	}

	cloudDesktopSearchFormConditions.$inject = ['$templateCache', 'moment', '_', 'basicsCommonRuleEditorService'];

	angular.module('cloud.desktop').directive('cloudDesktopSearchFormConditions', cloudDesktopSearchFormConditions);

})(angular);