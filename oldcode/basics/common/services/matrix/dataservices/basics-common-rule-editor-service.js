/*
 * $Id: basics-common-rule-editor-service.js 634180 2021-04-27 06:50:16Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	angular.module('basics.common').factory('basicsCommonRuleEditorService', [
		'_', '$http', '$q',
		'basicsLookupdataLookupFilterService', 'BasicsCommonDateProcessor', 'BasicsCommonBooleanProcessor',
		'BasicsCommonIntegerProcessor', 'BasicsCommonTranslationProcessor', 'platformObjectHelper',
		'platformSchemaService', '$injector', 'BasicsCommonDecimalProcessor', 'basicsCommonOperatorFunctionsService',
		'$translate', 'cloudDesktopPinningContextService', 'platformModuleInfoService',
		'basicsCommonDdSchemaGraphService', 'PlatformMessenger', 'basicsCommonDataDictionaryTypeService',
		'basicsCommonClientsideSchemaGraphService', 'basicsCommonDataDictionaryEnvExprService', '$timeout', 'basicsCommonDdContextProviderService', 'globals',
		'basicsCommonDataDictionaryRangeUnitService',
		function (
			_, $http, $q, filterService, DateProcessor, BooleanProcessor, IntegerProcessor, TranslationProcessor,
			objectHelper, platformSchemaService, $injector, DecimalProcessor, operatorFunctions, $translate,
			pinningContextService, moduleInfoService, basicsCommonDdSchemaGraphService, PlatformMessenger,
			basicsCommonDataDictionaryTypeService, basicsCommonClientsideSchemaGraphService,
			basicsCommonDataDictionaryEnvExprService, $timeout, basicsCommonDdContextProviderService, globals,
			basicsCommonDataDictionaryRangeUnitService) {

			const service = {};

			const managerInstanceProperty = '_ruleEditorInstance';

			function getEnumCacheKey(enumKind, enumId) {
				return '[' + (_.isNil(enumKind) ? '' : enumKind) + ']' + enumId;
			}

			function retrieveEnumData(enumKind, enumId) {
				return $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/enum', {
					params: {
						enumKind: _.isString(enumKind) ? enumKind : '',
						enumId: enumId
					}
				});
			}

			function RuleEditorManager() {
			}

			service.createManager = function (mgrConfig) {
				const actualMgrConfig = _.assign({
					useDataDictionary: false,
					serverSideEvaluation: false,
					focusTableName: null,
					moduleName: null,
					onlyShowActiveEntities: false
				}, _.isObject(mgrConfig) ? mgrConfig : {});

				if (actualMgrConfig.useDataDictionary) {
					if (!_.isString(actualMgrConfig.focusTableName) && !_.isString(actualMgrConfig.moduleName)) {
						throw new Error('Neither focus table nor module name specified.');
					}
				}

				const manager = new RuleEditorManager();

				const internalState = {
					onRuleChanged: new PlatformMessenger(),
					focusTableName: actualMgrConfig.focusTableName || '',
					moduleName: actualMgrConfig.moduleName,
					contextProvider: basicsCommonDdContextProviderService.createContextProvider({
						ruleEditorManager: manager
					}),
					onlyShowActiveEntities: actualMgrConfig.onlyShowActiveEntities
				};

				const data = {
					RuleDefinitionsToSave: [],
					RuleDefinitionsToDelete: [],
					AvailableProperties: [],
					RuleDefinitions: [],
					Operators: [],
					RuleOperatorType: 2, // 2 -> CompareRules, 4 -> ChangeRules
					AffectedEntities: [],
					onDataLoaded: new PlatformMessenger(),
					cachedFieldInfos: {},
					cachedEnumValues: {}
				};

				function getColumnById(columnNameOrObject) {
					if (columnNameOrObject) {
						let columnName;
						if (actualMgrConfig.serverSideEvaluation) {
							columnName = _.isObject(columnNameOrObject) ? columnNameOrObject.id : columnNameOrObject;
							if (objectHelper.isSet(columnName)) {
								return _.find(data.AvailableProperties, function (prop) {
									return columnName === prop.id;
								});
							}
						} else {

							if (_.isObject(columnNameOrObject)) {
								if (columnNameOrObject.simpleName) {
									columnName = columnNameOrObject.simpleName;
								} else {
									columnName = columnNameOrObject.field;
								}
							} else {
								columnName = columnNameOrObject;
							}

							if (objectHelper.isSet(columnName)) {
								return _.find(data.AvailableProperties, function (prop) {
									let columnCanBeUsed;
									if (data.RuleOperatorType === 4) {
										columnCanBeUsed = (columnName.toLowerCase() === prop.field.toLowerCase() || prop.id && (columnName.toLowerCase() === prop.id.toLowerCase())) && prop.editor !== null;
									} else {
										columnCanBeUsed = (columnName.toLowerCase() === prop.field.toLowerCase() || prop.id && (columnName.toLowerCase() === prop.id.toLowerCase()));
									}
									return columnCanBeUsed;
								});
							}
						}
					}
				}

				function getOperatorOfCondition(conditionEntity) {
					const domain = getFirstOperandDomain(conditionEntity);
					// dynamic domain would cause an exception, and no solution for dynamic domain currently, so just exclude it
					if (domain && domain !== 'dynamic') {
						const domainId = manager.getDisplayDomainIdByUiType(domain);
						if (domainId) {
							return _.find(data.Operators, function (op) {
								return (op.Id === conditionEntity.OperatorFk) && ((op.DisplaydomainFk === domainId) ||
									((op.DisplaydomainFk === 0) && true));
							});
						}
					}
					return null;
				}

				function getDtoPropDomain(column) {
					const col = getColumnById(column);
					if (col) {
						return _.isString(col.formatter) ? col.formatter : col.editor;
					}
				}

				function getFirstOperandDomain(conditionEntity) {
					const propIdentifier = _.get(conditionEntity, manager.getPropertyOperandPath(0));
					if (!_.isNil(propIdentifier)) {
						if (actualMgrConfig.useDataDictionary) {
							const propInfo = data.cachedFieldInfos[propIdentifier];
							if (!_.isNil(propInfo) && !_.isNil(propInfo.value)) {
								return propInfo.value.UiTypeId;
							}
						} else {
							return getDtoPropDomain(propIdentifier);
						}
					} else {
						return null;
					}
				}

				function filterOperators(conditionEntity, operatorItem) {
					const domain = getFirstOperandDomain(conditionEntity);
					// dynamic domain would cause an exception, and no solution for dynamic domain currently, so just exclude it
					if (domain && domain !== 'dynamic') {
						return (operatorItem.DisplaydomainFk === manager.getDisplayDomainIdByUiType(domain)) ||
							((operatorItem.DisplaydomainFk === 0) && true);
					}
					return false;
				}

				function processIncoming(item, validationService) {
					let processor;
					const fields = [
						manager.getLiteralOperandPath(item, 1),
						manager.getLiteralOperandPath(item, 2),
						manager.getPropertyOperandPath(2)
					];

					switch (manager.determineDomain(item)) {
						case'percent':
						case'lookup':
						case'integer':
							processor = new IntegerProcessor(fields);
							break;

						case'number':
						case 'factor':
						case 'money':
						case'quantity':
						case'decimal':
							processor = new DecimalProcessor(fields);
							break;

						case'date':
						case'datetime':
						case'dateutc':
						case'datetimeutc':
							processor = new DateProcessor(fields);
							break;

						case'string':
							break;

						case'boolean':
							processor = new BooleanProcessor(fields);
							break;
						case'translation':
							processor = new TranslationProcessor(fields);
							break;
						case 'default':
							break;
					}
					if (processor) {
						processor.processItem(item);
					}
					return validateRule(item, validationService);
				}

				function revertMoment(item) {
					if (item && _.isArray(item.Operands)) {
						for (let i = 1; i < item.Operands.length; i++) {
							const literalPath = manager.getLiteralOperandPath(item, i);
							new DateProcessor([literalPath]).revertProcessItem(item);
						}
					}
				}

				function removeDescriptionInfoObject(item) {
					if (item && _.isArray(item.Operands)) {
						for (let i = 1; i < item.Operands.length; i++) {
							const literalPath = manager.getLiteralOperandPath(item, i);
							const literal = _.get(item, literalPath);
							if (objectHelper.isSet(literal) && _.isObject(literal) && literal.Translated) {
								_.set(item, literalPath, literal.Translated);
							}
						}
					}
				}

				function cloneDeepWithMoment(list) {
					return _.cloneDeep(list, function customizer(value) {
						if (value) {
							if (value._isAMomentObject) {
								// clone moment object
								return value.clone();
							}
							if (value.constructor === RuleEditorManager) {
								return null;
							}
						}
					});
				}

				function removeEmptyArrays(arrayOfArrays) {
					return _.remove(arrayOfArrays, function (arr) {
						return _.isEmpty(arr);
					});
				}

				// creates an array if necessary
				function safePush(groupData, item) {
					if (_.isArray(groupData.Children)) {
						groupData.Children.push(item);
					} else {
						groupData.Children = [item];
					}
				}

				function deleteItem(item, list) {
					let parent;
					let searchList = list;
					if (actualMgrConfig.serverSideEvaluation) {
						parent = manager.findParent(list, item);
						if (parent) {
							searchList = parent.Children;
						} else {
							// if there is no parent: don't delete the parent condition?
							searchList = [];
						}
					} else if (_.isNumber(item.ConditionFk)) {
						parent = manager.findParent(list, item.ConditionFk);
						if (parent && !_.isEmpty(parent.Children)) {
							searchList = parent.Children;
						}
					}
					addDeletedItem(item);

					_.remove(searchList, function (child) {
						// all newly created items have an id with -1, so compare by generated $$hashKey
						return child === item;
					});

				}

				function deleteRecursive(children) {
					_.each(children, function (child) {
						addDeletedItem(child);

						if (!_.isEmpty(child.Children)) {
							deleteRecursive(child.Children);
							child.Children = [];
						}
					});
				}

				function addDeletedItem(item) {
					if (item && item.Version > 0) {
						data.RuleDefinitionsToDelete.push(cloneDeepWithMoment(item));
					}
				}

				function sanatizeContextRecursive(children, removedContext) {
					_.each(children, function (child) {

						_.each(child.Operands, function (operand) {
							// get property node
							const property = _.get(operand, manager.getPropertyOperandDataPath());
							if (property && property.includes('*')) {
								const sanitizedPath = internalState.contextProvider.normalizePath(property, removedContext);
								_.set(operand, manager.getPropertyOperandDataPath(), sanitizedPath);
							}
						});

						if (!_.isEmpty(child.Children)) {
							sanatizeContextRecursive(child.Children, removedContext);
						}
					});
				}

				function setFilteredEnumData(enumValuesInfo) {
					const setFilteredData = (enumValInfo) => {
						if (_.isNil(enumValInfo.filteredValues)) {
							enumValInfo.filteredValues = [];
						}
						enumValInfo.filteredValues.length = 0;
						// depending on mode: remove or add filtered items
						let addedEntities = _.filter(enumValInfo.values, (v) => {
							// filter all not yet present and all according to setting
							return !_.some(enumValInfo.filteredValues, {id: v.id}) && (!internalState.onlyShowActiveEntities || v.IsActive === true);
						});
						enumValInfo.filteredValues.push(...addedEntities);
					};
					if (!_.isNil(enumValuesInfo)) {
						setFilteredData(enumValuesInfo);
					} else {
						_.forEach(data.cachedEnumValues, setFilteredData);
					}
				}

				_.assign(manager, {
					prepare: function () {
						if (actualMgrConfig.useDataDictionary) {
							return $q.all([
								basicsCommonDataDictionaryTypeService.prepareTypes(),
								basicsCommonDataDictionaryEnvExprService.prepareExpressions(),
								basicsCommonDataDictionaryRangeUnitService.prepareRangeUnits()
							]);
						} else {
							return $q.resolve();
						}
					},
					getOperatorItemOfCondition: function getOperatorItemOfCondition(operatorEntity) {
						return getOperatorOfCondition(operatorEntity);
					},
					setConfig: function setConfig(config) {
						data.AvailableProperties = config.AvailableProperties;
						data.Operators = config.AvailableOperators;
						data.RuleOperatorType = config.RuleOperatorType || 2;
						data.AffectedEntities = config.AffectedEntities;
						data.RuleDefinitions = config.RuleDefinitions ? config.RuleDefinitions : [];
					},
					getConfig: function getConfig() {
						return data;
					},
					getOperators: function (conditionEntity) {
						const propIdentifier = _.get(conditionEntity, manager.getPropertyOperandPath(0));
						if (!_.isNil(propIdentifier)) {
							const propInfo = data.cachedFieldInfos[propIdentifier];
							if (!_.isNil(propInfo) && !_.isNil(propInfo.value)) {
								let colIsNullAble = true;
								if (!actualMgrConfig.serverSideEvaluation) {
									// check if lookup is nullable
									const accessor = this.getPropertyOperandPath(0);
									const operand = _.get(conditionEntity, accessor);
									const col = manager.getColumnByIdentifier(operand);
									if (col) {
										colIsNullAble = !col.required;
									} else {
										return;
									}
								}

								const propInfoUiType = manager.getDisplayDomainIdByUiType(propInfo.value.UiTypeId);
								let operators = _.filter(data.Operators, function (opItem) {
									// a instance is initiated with an RuleOperatorType
									return (opItem.ConditionTypeFk === data.RuleOperatorType) &&
										((opItem.DisplaydomainFk === propInfoUiType) || (opItem.OnlyForNullable && propInfo.value.IsNullable));
								});

								if (!actualMgrConfig.serverSideEvaluation) {
									operators = _.filter(operators, function (opItem) {
										const operatorRequiresNullAble = operatorFunctions.getOperatorItemById(opItem.Id).nullAbleRequired || false;
										if (operatorRequiresNullAble === true && colIsNullAble === false) {
											return false;
										}
										if (operatorRequiresNullAble === false || colIsNullAble === true) {
											return true;
										}
									});
								}

								return operators;
							}
						}
						const resultArray = [];
						resultArray.isFallback = true;
						return resultArray;
					},
					getGroupOperators: function () {
						return _.filter(data.Operators, function (opItem) {
							return opItem.ConditionTypeFk === 1;
						});
					},
					getFields: function getFields(content, columns) {

						data.AvailableProperties = columns;
						const fields = [
							'PropertyIdentifier11',
							'PropertyIdentifier12',
							'PropertyIdentifier13',
							'PropertyIdentifier21',
							'PropertyIdentifier22',
							'PropertyIdentifier23',
							'PropertyIdentifier31',
							'PropertyIdentifier32',
							'PropertyIdentifier33'];

						const cols = [];

						_.each(fields, function (field) {
							const defaultColumn = {
								Columnname: '',
								Id: undefined,
								Field: field,
								IsEmpty: true,
								DtoProperty: null,
								Domain: null
							};
							const col = getColumnById(content[field]);
							if (objectHelper.isSet(col)) {
								defaultColumn.formatterOptions = col.formatterOptions;
								defaultColumn.Columnname = col.field;
								defaultColumn.Id = col.id;
								defaultColumn.DtoProperty = col.field;
								defaultColumn.Domain = col.formatter;
								if (col.doesDependOn) {
									defaultColumn.doesDependOn = col.doesDependOn;
								}
								cols.push(defaultColumn);

							} else {
								cols.push(defaultColumn);
							}
						});

						const fieldObjects = {};
						let row = 1;
						let colIndex = 1;
						_.each(cols, function (col) {
							fieldObjects['field' + row + colIndex] = {
								model: col.DtoProperty,
								domain: col.Domain,
								name: col.DtoProperty,
								formatterOptions: col.formatterOptions,
								doesDependOn: col.doesDependOn
							};
							colIndex++;
							if (colIndex > 3) {
								row++;
								colIndex = 1;
							}
						});
						return fieldObjects;
					},
					getDtoPropName: function getDtoPropName(columnId) {
						if (columnId) {
							const col = getColumnById(columnId);
							if (col) {
								return col.field;
							}
						}
					},
					getDtoPropDomain: getDtoPropDomain,
					// used by bulkEditor
					checkColumn: function checkColumn(column) {
						if (column && column.editor) {
							// / when there is no filterId, it is not possible to determine a filter for this lookupColumn
							if (column.editor === 'lookup') {
								let filterId;
								if (!_.isEmpty(column.pinningContextFilter)) {
									const pinningItem = pinningContextService.getPinningItem(column.pinningContextFilter[0]);
									filterId = pinningItem ? pinningItem.id : null;
									if (column.editorOptions && column.editorOptions.lookupOptions && _.isFunction(column.editorOptions.lookupOptions.filter) && !filterId && !column.editorOptions.lookupOptions.filter()) {
										return false;
									}
								} else {
									return true;
								}
								// check all types of filterVariants

							}

							return (_.isObject(column) && !_.isNil(column.formatter)) && column.editor !== 'directive';
						}
						return false;
					},
					getDisplayDomainIdByUiType: function getDisplayDomainIdByUiType(uiType) {
						if (actualMgrConfig.useDataDictionary) {
							const result = basicsCommonDataDictionaryTypeService.uiTypeIdToDisplayDomainFk(uiType);
							if (_.isNumber(result)) {
								return result;
							}
						} else {
							switch (uiType) {
								case'number':
								case'quantity':
								case 'factor':
								case 'money':
								case 'exchangerate':
								case'decimal':
								case'percent':
								case 'convert':
									return 6;

								case'integer':
									return 5;

								// case'datetime':
								case'dateutc':
								case'date':
									return 2;

								case'datetime':
								case'datetimeutc':
									return 3;

								case 'time':
								case 'timeutc':
									return 4;

								case'code':
								case'string':
								case'description':
								case'remark':
								case 'remarkString':
								case'comment':
								case'text':
								case 'multicode':
									return 1;

								case'translation':
									return 17;

								case'boolean':
									return 14;

								case 'lookup':
								case 'directive':
									return 10;
								case'email':
									return 16;
								case'color':
									return 20;
								case 'imageselect':
									return 21;
								case 'reference':
								case 'relationset':
									return 22;
							}
						}
						throw new Error('Unknown Domain ' + uiType);
					},
					getUiTypeByDisplayDomainId: function getUiTypeByDisplayDomainId(domainId) {
						if (actualMgrConfig.useDataDictionary) {
							const result = basicsCommonDataDictionaryTypeService.displayDomainFkToUiTypeId(domainId);
							if (_.isString(result)) {
								return result;
							}
						} else {
							switch (domainId) {
								case 6:
									return 'decimal';
								case 5:
									return 'integer';
								case 2:
									return 'dateutc';
								case 1 :
									return 'description';
								case 3:
									return 'datetime';
								case 4:
									return 'timeutc';
								case 10:
									return 'lookup';
								case 14 :
									return 'boolean';
								case 16:
									return 'email';
								case 17:
									return 'translation';
								case 20 :
									return 'color';
								case 21:
									return 'imageselect';
								case 22:
									// return 'relationset';
									return 'reference';
							}
						}
						throw new Error('Unknown Domain ' + domainId);
					},
					getTotalOperandCount: function (condition) {
						if (objectHelper.isSet(condition)) {
							const prop = _.get(condition, this.getPropertyOperandPath(0));
							if (objectHelper.isSet(prop)) {
								const firstOperand = data.cachedFieldInfos[prop];
								const op = getOperatorOfCondition(condition);
								if (op && firstOperand && firstOperand.value) {
									if (op.ignoreClientFunctions) {
										return op.Parameters ? op.Parameters.length : 1;
									} else {
										const opItem = operatorFunctions.getOperatorItemById(condition.OperatorFk);
										return opItem.parameters.length;
									}
								}
							}
						}
						return 1;
					},
					getOtherOperands: function (condition) {
						if (objectHelper.isSet(condition)) {
							const prop = _.get(condition, this.getPropertyOperandPath(0));
							if (objectHelper.isSet(prop)) {
								const firstOperand = data.cachedFieldInfos[prop];
								const op = getOperatorOfCondition(condition);

								if (op && firstOperand && firstOperand.value) {
									if (op.ignoreClientFunctions) {
										if (op.Parameters && (op.Parameters.length > 0)) {
											return _.map(op.Parameters.slice(1), function (prm, index) {
												const resultPrm = _.clone(prm);
												resultPrm.Id = prop + '/' + op.Id + '/' + (index + 1);
												resultPrm.Index = index + 1;
												switch (resultPrm.DisplaydomainFk) {
													case 3:
														resultPrm.inputDomainOverload = firstOperand.value.UiTypeId;
														break;
													case 10:
													case 22:
														resultPrm.TargetKind = firstOperand.value.TargetKind;
														resultPrm.TargetId = firstOperand.value.TargetId;
														break;
												}
												return resultPrm;
											});
										}
									} else {
										const column = manager.getColumnByIdentifier(prop);
										const opItem = operatorFunctions.getOperatorItemById(condition.OperatorFk);

										const prmDomain = (opItem.inputDomain) ? opItem.inputDomain : getDtoPropDomain(prop);
										const prmDomainFk = manager.getDisplayDomainIdByUiType(prmDomain);

										return _.map(opItem.parameters.slice(1), function (p, i) {
											const desc = opItem.placeholder[p];
											const mappedObject = {
												Id: p,
												Index: i + 1,
												DescriptionInfo: {
													Description: desc ? desc : 'p' + (i + 1),
													Translated: desc ? desc : 'Parameter ' + (i + 1)
												},
												DisplaydomainFk: prmDomainFk,
												firstOperand: prop,
												options: {ignoreEntityEval: prmDomain === 'translation'},
												allowLiteral: !!_.startsWith(p, 'CompareValue'),
												allowFieldRef: !!_.startsWith(p, 'CompareProperty'),
												allowDynamicRangeExpression: !!_.startsWith(p, 'DynamicValue'),
												inputDomainOverload: (opItem.inputDomain) ? opItem.inputDomain : null
											};
											if (column && column.editorOptions) {
												_.extend(mappedObject.options, column.editorOptions);
											}
											return mappedObject;
										});
									}
								}
							}
							const resultArray = [];
							resultArray.isFallback = true;
							return resultArray;
						}
					},
					determineDomain: function determineDomain(condition, operandIndex) {
						if (objectHelper.isSet(condition)) {
							const prop = _.get(condition, this.getPropertyOperandPath(0));
							if (objectHelper.isSet(prop)) {
								const op = getOperatorOfCondition(condition);

								if (op) {
									if (op.ignoreClientFunctions) {
										if (op.Parameters && (op.Parameters.length > operandIndex)) {
											return this.getUiTypeByDisplayDomainId(op.Parameters[operandIndex].DisplaydomainFk);
										}
									} else {
										const opItem = operatorFunctions.getOperatorItemById(condition.OperatorFk);
										return (opItem.inputDomain) ? opItem.inputDomain : getDtoPropDomain(prop);
									}
									throw new Error('Failed to determine operator input domain.');
								}
							}
						}
					},
					determineLookupColumn: function determineLookupColumn(conditionEntity) {
						const propIdentifier = _.isString(conditionEntity) ? conditionEntity : '';
						const col = _.find(data.AvailableProperties, function (prop) {
							const columnName = _.isObject(prop) ? (actualMgrConfig.serverSideEvaluation ? prop.id : prop.field.toLowerCase()) : prop.toLowerCase();
							const alternativeColumnName = _.isObject(prop) ? prop.id : prop.field.toLowerCase();
							return (columnName === propIdentifier.toLowerCase() || alternativeColumnName === propIdentifier.toLowerCase()) && _.isString(prop.editor);
						});
						if (col && col.editorOptions && col.editorOptions.lookupOptions) {
							col.editorOptions.lookupOptions.placeholder = $translate.instant('platform.bulkEditor.chooseItem');
							col.placeholder = col.editorOptions.lookupOptions.placeholder;
						}

						let filterId;
						if (!_.isEmpty(col.pinningContextFilter)) {
							const pinningItem = pinningContextService.getPinningItem(col.pinningContextFilter[0]);
							filterId = pinningItem ? pinningItem.id : null;
						}
						// check all types of filterVariants
						if (col.editorOptions && col.editorOptions.lookupOptions && _.isFunction(col.editorOptions.lookupOptions.filter) && filterId) {
							const originFilterFn = col.editorOptions.lookupOptions.filter;
							// warp the original and  take values from pinningContext
							col.editorOptions.lookupOptions.filter = function bulkEditorLookupFilter() {
								const result = originFilterFn();
								if (result && Object.prototype.hasOwnProperty.call(result, 'PKey1')) {
									result.PKey1 = filterId;
									return result;
								}
							};
						}

						return col;
					},
					hasToShow: function hasToShow(rule, fieldName) {
						const op = this.getOperatorItemOfCondition(rule);
						if (op && op.ignoreClientFunctions) {
							if (op.Parameters) {
								return _.some(op.Parameters, function (p) {
									return p.Id === fieldName;
								});
							}
						} else {
							const params = operatorFunctions.getParamNamesByFunctionId(rule.OperatorFk);

							return _.includes(params, fieldName);
						}

						throw new Error('Unable to determine operand visibility.');
					},
					getPlaceHolder: function getPlaceHolder(rule, fieldName) {
						const op = this.getOperatorItemOfCondition(rule);

						if (op) {
							if (op.ignoreClientFunctions) {
								return '';
							}
						}

						const operatorObject = operatorFunctions.getOperatorItemById(rule.OperatorFk);
						return operatorObject.placeholder[fieldName];
					},
					validateRule: function validateRule(item, validationService) {
						const propertyIdentifier = _.get(item, this.getPropertyOperandPath(0));
						const defer = $q.defer();
						// check if the property can be used in this case
						if (propertyIdentifier) {
							const col = getColumnById(propertyIdentifier);
							// when a col does not have bulkSupport, the rule becomes in invalid
							if (col && _.isObject(col)) {
								item.valid = col.bulkSupport;
							}
							if (validationService && _.isFunction(validationService.validateBulkRule)) {
								const value = _.get(item, this.getLiteralOperandPath(item, 1));
								validationService.validateBulkRule(value, col.field).then(function (result) {
									if (_.isBoolean(result)) {
										item.valid = result;
									}
									defer.resolve(result);
								});
							} else {
								defer.resolve(col && col.bulkSupport);
							}
							return defer.promise;
						}
						return $q.when();
					},
					getMissingPinningContext: function getMissingPinningContext(item) {
						if (item) {
							const propertyIdentifier = _.get(item, this.getPropertyOperandPath(0));
							if (item && propertyIdentifier) {
								const col = getColumnById(propertyIdentifier);
								if (col && !_.isEmpty(col.pinningContextFilter)) {
									const missingModulePinningContextName = moduleInfoService.getI18NName(col.pinningContextFilter[0]);
									return $translate.instant('platform.bulkEditor.missingPContext', {'p1': missingModulePinningContextName});
								}
							}
						}
					},
					// process the outgoing rules
					processOutgoingRules: function processOutgoingRules(ArrayOfRulesArray) {
						_.each(ArrayOfRulesArray, function (RulesArray) {
							_.each(RulesArray, function (rule) {
								revertMoment(rule);
								removeDescriptionInfoObject(rule);
								if (objectHelper.isSet(rule.Children) && !_.isEmpty(rule.Children)) {
									processOutgoingRules([rule.Children]);
								}
							});
						});
					},
					// process the incomming rules
					processIncomingRules: function processIncomingRules(RulesArray, validationService, promiseListParam) {
						const promiseList = _.isArray(promiseListParam) ? promiseListParam : [];
						_.each(RulesArray, function (rule) {
							promiseList.push(processIncoming(rule, validationService));
							if (objectHelper.isSet(rule.Children) && !_.isEmpty(rule.Children)) {
								processIncomingRules(rule.Children, validationService, promiseList);
							}
						});
						return $q.all(promiseList);
					},
					getRulesData: function getRulesData() {

						if (!_.isEmpty(data.RuleDefinitionsToSave) || !_.isEmpty(data.RuleDefinitionsToDelete)) {

							const toDelete = cloneDeepWithMoment(data.RuleDefinitionsToDelete);
							const toSave = cloneDeepWithMoment(data.RuleDefinitionsToSave);
							removeEmptyArrays(toSave);
							// processOutgoingRules(toDelete);
							processOutgoingRules(toSave);

							return {
								RuleDefinitionsToSave: toSave,
								RuleDefinitionsToDelete: toDelete
							};
						}
					},
					clearRulesData: function clearRulesData() {
						data.RuleDefinitionsToSave = [];
						data.RuleDefinitionsToDelete = [];
						data.AffectedEntities = [];
						data.AvailableProperties = [];
						data.RuleDefinitions = [];
						data.Operators = [];
						data.RuleOperatorType = 2;
						data.AffectedEntities = [];
						data.ConfigName = '';
					},
					creationCondition: function creationCondition(group, conditionType, fakeCreate) {
						// if there is no ConditionFkTop the group is the root
						const conditionFkTop = group.ConditionFktop ? group.ConditionFktop : group.Id;
						// if there is no ParentId the group is the root
						const parentId = group.Id ? group.Id : null;

						const that = this;

						return $http({
							url: globals.webApiBaseUrl + 'basics/common/matrix/createCondition',
							method: 'get',
							params: {
								mainItemId: conditionFkTop,
								parentId: parentId,
								conditionType: conditionType,
								fakeCreate: actualMgrConfig.serverSideEvaluation || fakeCreate
							}
						}).then(function (result) {
							result.data[managerInstanceProperty] = that;
							const defaultOperator = _.find(data.Operators, function (op) {
								return op.ConditionTypeFk === conditionType;
							});
							if (defaultOperator) {
								result.data.OperatorFk = defaultOperator.Id;
							}

							safePush(group, result.data);

							return result.data;
						});
					},
					findParent: function findParent(items, parentId) {
						if (items) {
							// this for loop cannot be replace by lodash each because the return value of the inner function is not the return value of the outer function
							for (let i = 0; i < items.length; i++) {
								if (_.isObject(parentId)) {
									if (!_.isEmpty(items[i].Children) && items[i].Children.includes(parentId)) {
										return items[i];
									}
								} else {
									if (items[i].Id === parentId) {
										return items[i];
									}
								}
								const found = this.findParent(items[i].Children, parentId);
								if (found) {
									return found;
								}
							}
						}
					},
					remove: function remove(item, list) {
						switch (item.ConditiontypeFk) {
							// groups
							case 1:
								// first clear the children then delete the group itself
								if (_.isEmpty(item.Children)) {
									deleteItem(item, list);
								} else {
									deleteRecursive(item.Children);
									item.Children = null;
								}
								break;
							// rules & changesRules
							case 2 :
							case 4 :
								deleteItem(item, list);
								break;
						}
					},
					saveRuleDefinition: function saveRuleDefinition(newRuleList) {
						const found = this.getRuleTreeByTopFk(newRuleList[0].Id);
						if (!_.isEmpty(found)) {
							_.remove(data.RuleDefinitionsToSave, function (ruleArray) {
								if (!_.isEmpty(ruleArray)) {
									return ruleArray[0].Id === found[0].Id;
								} else {
									return true;
								}
							});
						}
						data.RuleDefinitionsToSave.push(newRuleList);
					},
					getRuleTreeByTopFk: function getRuleTreeByTopFk(topFk, searchList) {

						const list = searchList || data.RuleDefinitionsToSave;
						if (_.isEmpty(list)) {
							return null;
						}
						return _.find(list,
							function (rules) {
								// check the root elements
								if (!_.isEmpty(rules[0])) {
									return rules[0].Id === topFk;
								}
							});
					},
					getRuleDefinitionByTopFk: function getRuleDefinitionByTopFk(topFk) {
						const defer = $q.defer();
						const found = this.getRuleTreeByTopFk(topFk);
						if (!objectHelper.isSet(found)) {
							$http({
								url: globals.webApiBaseUrl + 'basics/common/matrix/getRulesTree',
								method: 'GET',
								params: {topFk: topFk}
							}).then(function (result) {
								const items = result.data;
								processIncomingRules(items);
								defer.resolve(items);
							});
						} else {
							defer.resolve(found);
						}
						return defer.promise;
					},
					getOperatorByType: function getOperatorByType(typeId) {
						return $http({
							url: globals.webApiBaseUrl + 'basics/common/matrix/getOperators',
							method: 'GET',
							params: {typeId: typeId}
						}).then(function (result) {
							return result.data;
						});
					},
					isEditorLess: function isEditorLess(conditionItem) {
						let result = false;
						if (this.determineDomain(conditionItem) === 'boolean') {
							result = true;
						}

						if (conditionItem.OperatorFk) {
							const op = this.getOperatorItemOfCondition(conditionItem);
							if (op && op.ignoreClientFunctions) {
								if (op.Parameters) {
									if (op.Parameters.length === 1) {
										result = true;
									}
								}
							} else {
								const opFunc = operatorFunctions.getOperatorItemById(conditionItem.OperatorFk);
								if (opFunc.parameters.length === 1 && opFunc.parameters[0] === 'PropertyIdentifier') {
									result = true;
								}
							}
						}
						return result;
					},
					checkChildren: function checkChildren(childrenList) {
						const propertyIdentifierPath = this.getPropertyOperandPath(0);
						return _.some(childrenList, function checkChildren(child) {
							return _.get(child, propertyIdentifierPath) && child.OperatorFk && child.valid !== false;
						});
					},
					getColumnDisplayName: function getColumnDisplayName(columnAsStringOrObject) {
						const col = getColumnById(columnAsStringOrObject);
						if (col && col.userLabelName) {
							return col.userLabelName;
						}
						if (col && col.name$tr$) {
							return $translate.instant(col.name$tr$, col.name$tr$param$);
						}
						return col ? col.name : '';
					},
					getColumnByIdentifier: function getColumnByIdentifier(columnAsStringOrObject) {
						return getColumnById(columnAsStringOrObject);
					},
					filterDisplayDomain: function (operatorItem, conditionEntity) {
						return filterOperators(conditionEntity, operatorItem) && operatorItem.ConditionTypeFk === data.RuleOperatorType;
					},
					filterAttribute: function (attribute, condition) {
						const domainId = getDtoPropDomain(attribute.Id);
						const attributeDomain = this.getDisplayDomainIdByUiType(domainId);
						let propertyIdentifier;

						const conditionPropertyIdentifier = _.get(condition, this.getPropertyOperandPath(0));
						if (conditionPropertyIdentifier) {
							propertyIdentifier = getColumnById(conditionPropertyIdentifier);
							const domainId1 = getDtoPropDomain(propertyIdentifier);
							const propDomain = this.getDisplayDomainIdByUiType(domainId1);

							return propDomain === attributeDomain;
						}
						return true;
					},
					getPropertyOperandDataPath: function () {
						if (actualMgrConfig.useDataDictionary) {
							return 'DdProperty.Path';
						} else {
							return 'NamedProperty.FieldName';
						}
					},
					getPropertyOperandPath: function (operandIndex) {
						return 'Operands[' + operandIndex + '].' + this.getPropertyOperandDataPath();
					},
					getLiteralOperandDataPath: function (uiType) {
						let result = 'Literal.';
						if (actualMgrConfig.serverSideEvaluation) {
							result += basicsCommonDataDictionaryTypeService.getDataPathForUiType(uiType);
						} else {
							// type irrelevant for client-side evaluation
							// using String as catch-all type that is also available in server-side DTO
							result += 'String';
						}
						return result;
					},
					getLiteralOperandDataType: function (object) {
						if (_.has(object, 'Literal')) {
							if (actualMgrConfig.serverSideEvaluation) {
								return basicsCommonDataDictionaryTypeService.getFilterTypeByDataPath(object.Literal);
							} else {
								// irrelevant for client side evaluation for now
								return null;
							}
						} else {
							return null;
						}
					},
					getLiteralOperandPath: function (condition, operandIndex) {
						return 'Operands[' + operandIndex + '].' + this.getLiteralOperandDataPath(this.determineDomain(condition, operandIndex));
					},
					getEnvExprOperandDataPath: function () {
						if (actualMgrConfig.serverSideEvaluation) {
							return 'EnvironmentExpression';
						} else {
							throw new Error('Not supported in client-side evaluation');
						}
					},
					getDynamicRangeOperandDataPath: function () {
						if (actualMgrConfig.serverSideEvaluation) {
							return 'DynamicValue';
						} else {
							throw new Error('Not supported in client-side evaluation');
						}
					},
					connectConditionEntity: function (conditionEntity) {
						conditionEntity[managerInstanceProperty] = this;
					},
					createSchemaGraphProvider: function (config) {
						if (actualMgrConfig.useDataDictionary) {
							return new basicsCommonDdSchemaGraphService.DdSchemaGraphProvider(_.assign(_.isObject(config) ? config : {}, {
								focusTableName: internalState.focusTableName,
								moduleName: internalState.moduleName,
								contextProvider: internalState.contextProvider
							}));
						} else {
							if (_.isObject(config)) {
								config.manager = manager;
							} else {
								config = {
									manager: manager
								};
							}
							return new basicsCommonClientsideSchemaGraphService.ClientsideGraphProviver(config);
						}
					},
					registerDataLoaded: function (handler) {
						data.onDataLoaded.register(handler);
					},
					unregisterDataLoaded: function (handler) {
						data.onDataLoaded.unregister(handler);
					},
					registerRuleChanged: function (handler) {
						internalState.onRuleChanged.register(handler);
					},
					unregisterRuleChanged: function (handler) {
						internalState.onRuleChanged.unregister(handler);
					},
					notifyRuleChanged: function () {
						internalState.onRuleChanged.fire();
					},
					registerContextChanged: function (handler) {
						internalState.contextProvider.onContextChanged.register(handler);
					},
					unregisterContextChanged: function (handler) {
						internalState.contextProvider.onContextChanged.unregister(handler);
					},
					isFirstOperandReady: function (conditionEntity) {
						const propIdentifier = _.get(conditionEntity, manager.getPropertyOperandPath(0));
						if (!_.isNil(propIdentifier)) {
							const propInfo = data.cachedFieldInfos[propIdentifier];
							if (propInfo && propInfo.value) {
								return true;
							}
						}
						return false;
					},
					firstOperandChanged: function (conditionEntity) {
						let propIdentifier = _.get(conditionEntity, manager.getPropertyOperandPath(0));
						let subentityCache;
						if (!_.isNil(propIdentifier)) {
							if (_.includes(propIdentifier, '*')) {
								subentityCache = propIdentifier;
								propIdentifier = internalState.contextProvider.normalizePath(propIdentifier);
							}
							let propInfo = data.cachedFieldInfos[propIdentifier];
							if (propInfo) {
								if (!_.isNil(propInfo.value)) {
									if (subentityCache) {
										data.cachedFieldInfos[subentityCache] = _.cloneDeep(propInfo);
									}
									return $timeout();
								}
							} else {
								propInfo = data.cachedFieldInfos[propIdentifier] = {};
							}

							if (actualMgrConfig.useDataDictionary) {
								propInfo.promise = $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/field', {
									params: {
										path: propIdentifier
									}
								}).then(function (response) {
									const propInfoData = response.data;
									const additionalDataPromise = (function retrieveAdditionalData() {
										if (propInfoData.UiTypeId === 'lookup') {
											const enumKey = getEnumCacheKey(propInfoData.TargetKind, propInfoData.TargetId);
											let enumValuesInfo = data.cachedEnumValues[enumKey];
											if (!enumValuesInfo) {
												enumValuesInfo = data.cachedEnumValues[enumKey] = {};
											}

											if (!_.isArray(enumValuesInfo.values)) {
												if (!enumValuesInfo.promise) {
													enumValuesInfo.promise = retrieveEnumData(propInfoData.TargetKind, propInfoData.TargetId).then(function (response) {
														enumValuesInfo.values = response.data;
														setFilteredEnumData(enumValuesInfo);
													});
												}
												return enumValuesInfo.promise;
											}
										}
									})();

									return $q.when(additionalDataPromise).then(function () {
										propInfo.value = propInfoData;
										if (subentityCache) {
											data.cachedFieldInfos[subentityCache] = _.cloneDeep(propInfo);
										}
										data.onDataLoaded.fire();
									});
								});

								return propInfo.promise;
							} else {
								propInfo.value = {UiTypeId: manager.getDtoPropDomain(propIdentifier)};
								return $timeout();
							}
						}
					},
					loadEnumValues: function (enumKind, enumId) {
						const enumKey = getEnumCacheKey(enumKind, enumId);
						let enumValuesInfo = data.cachedEnumValues[enumKey];
						if (!enumValuesInfo) {
							enumValuesInfo = data.cachedEnumValues[enumKey] = {};
							return retrieveEnumData(enumKind, enumId).then(function (response) {
								enumValuesInfo.values = response.data;
								// always set filtered values
								setFilteredEnumData(enumValuesInfo);
								return true;
							});
						} else {
							return $q.when(true);
						}
					},
					managesEnumValues: function () {
						return !!actualMgrConfig.useDataDictionary;
					},
					getEnumValues: function (enumKind, enumId, filtered = false) {
						if (actualMgrConfig.useDataDictionary) {
							const enumValuesInfo = data.cachedEnumValues[getEnumCacheKey(enumKind, enumId)];
							if (enumValuesInfo && _.isArray(enumValuesInfo.filteredValues)) {
								return filtered ? enumValuesInfo.filteredValues : enumValuesInfo.values;
							} else {
								return [];
							}
						} else {
							throw new Error('Unsupported mode.');
						}
					},
					getEnumValuesForRanges: function () {
						return basicsCommonDataDictionaryRangeUnitService.getRangeUnits();
					},
					areUiTypesCompatible: function (type1, type2) {
						if (actualMgrConfig.useDataDictionary) {
							return basicsCommonDataDictionaryTypeService.areUiTypesCompatible(type1, type2);
						} else {
							return type1 === type2;
						}//
					},
					getCompatibleDataTypes: function (uiType) {
						if (actualMgrConfig.useDataDictionary) {
							return basicsCommonDataDictionaryTypeService.getCompatibleDataTypes(uiType);
						} else {
							return [];
						}
					},
					getExpressionsForType: function (uiTypeId, targetKind, targetId, allowRange) {
						if (actualMgrConfig.useDataDictionary) {
							return basicsCommonDataDictionaryEnvExprService.getExpressionsForType(uiTypeId, targetKind, targetId, allowRange);
						} else {
							return [];
						}
					},
					getExpressionName: function (kind, id) {
						if (actualMgrConfig.useDataDictionary) {
							return basicsCommonDataDictionaryEnvExprService.getExpressionName(kind, id);
						} else {
							return null;
						}
					},
					isExpressionRange: function (kind, id) {
						if (actualMgrConfig.useDataDictionary) {
							return basicsCommonDataDictionaryEnvExprService.isExpressionRange(kind, id);
						} else {
							return null;
						}
					},
					adaptForRule: function (rule) {
						const dynFields = _.get(rule, 'ReadOnlyContextInfo.DynamicDdPathFields');
						if (_.isArray(dynFields)) {
							const loadedFields = {};
							dynFields.forEach(function (g) {
								loadedFields[g.Key] = g.Items;
							});
							internalState.contextProvider.addDynamicFields(loadedFields, false);
						}
					},
					setRuleContext: function (condition, fromExternal, overwrite) {
						if (_.isNil(condition.Context)) {
							condition.Context = {};
						}
						if (!Array.isArray(condition.Context.SubEntities)) {
							condition.Context.SubEntities = [];
						}
						if (!Array.isArray(condition.Context.AliasExpressions)) {
							condition.Context.AliasExpressions = [];
						}

						const subentityConditions = _.filter(condition.Context.SubEntities, function (condition) {
							return _.has(condition, manager.getIndexOperandDataPath()) ?
								_.get(condition, manager.getIndexOperandDataPath()).includes('*') : false;
						});

						function getSubentityFromProperties(condition) {
							return {
								id: _.get(condition, manager.getIndexOperandDataPath()),
								path: _.get(condition, manager.getPropertyOperandDataPath()),
								name: _.get(condition, manager.getNameOperandDataPath())
							};
						}

						function setSubentityProperties(condition, subentity) {
							_.set(condition, manager.getIndexOperandDataPath(), subentity.id);
							_.set(condition, manager.getPropertyOperandDataPath(), subentity.path);
							_.set(condition, manager.getNameOperandDataPath(), subentity.name);
						}

						// if not overwrite: provider -> condition.Context
						if (!fromExternal) {
							// get items
							const providedSubentities = internalState.contextProvider.retrieveEntities();
							const providedAliasExpressions = internalState.contextProvider.retrieveAliasExpressions();
							// if not overwrite: sanitize
							if (!overwrite) {
								// delete subentities not present
								const removedSubentityDtos = _.remove(condition.Context.SubEntities, function (sc) {
									const subentityId = _.get(sc, manager.getIndexOperandDataPath());
									return subentityId.includes('*') &&
										!_.find(providedSubentities, {id: subentityId});
								});
								const removedSubentities = _.map(removedSubentityDtos, function (dto) {
									return {
										id: _.get(dto, manager.getIndexOperandDataPath()),
										path: _.get(dto, manager.getPropertyOperandDataPath())
									};
								});
								sanatizeContextRecursive([condition], removedSubentities);
								// add/update context entities
								_.forEach(providedSubentities, function (subentity) {
									// is present?
									let subentityCondition = _.find(condition.Context.SubEntities, function (sc) {
										const subentityId = _.get(sc, manager.getIndexOperandDataPath());
										return subentityId === subentity.id;
									});
									if (_.isUndefined(subentityCondition)) {
										// create!
										subentityCondition = {};
										condition.Context.SubEntities.push(subentityCondition);
									}
									setSubentityProperties(subentityCondition, subentity);
								});

								let idx = 0;
								for (let providedAliasExpr of providedAliasExpressions) {
									let destItem = _.find(condition.Context.AliasExpressions, {id: `@${idx}`});
									if (!destItem) {
										destItem = {};
										condition.Context.AliasExpressions.push(destItem);
									}
									destItem.ParentPath = providedAliasExpr.parentPath;
									destItem.Parameters = providedAliasExpr.parameters;
									destItem.PathSegment = providedAliasExpr.pathSegment;

									idx++;
								}
							} else {
								// delete all Context entities
								condition.Context.SubEntities = [];
								_.forEach(providedSubentities, function (subentity) {
									const subentityCondition = {};
									condition.Context.SubEntities.push(subentityCondition);
									setSubentityProperties(subentityCondition, subentity);
								});

								condition.Context.AliasExpressions = [];
								for (let providedAliasExpr of providedAliasExpressions) {
									condition.Context.AliasExpressions.push({
										ParentPath: providedAliasExpr.parentPath,
										Parameters: _.map(providedAliasExpr.parameters, function (/* prm, idx */) {
											return {
												Literal: providedAliasExpr.Literal,
												DdProperty: providedAliasExpr.DdProperty,
												EnvironmentExpression: providedAliasExpr.EnvironmentExpression,
												Index: 'a'
											};
										}),
										PathSegment: providedAliasExpr.pathSegment
									});
								}
							}
						}
						// if from external: condition.Context -> provider
						else {
							if (!overwrite) {
								// if not overwrite: sanitize
								const subentityIds = _.map(internalState.contextProvider.retrieveEntities(), 'id');
								const currentContextIds = _.map(subentityConditions, manager.getIndexOperandDataPath());
								const removedSubentityIds = _.difference(subentityIds, currentContextIds);
								const removedContextSubentities = internalState.contextProvider.removeEntities(removedSubentityIds);
								sanatizeContextRecursive([condition], removedContextSubentities);
							} else {
								// if not overwrite: no need to merge
								internalState.contextProvider.removeEntities();
								const subentities = _.map(subentityConditions, getSubentityFromProperties);
								internalState.contextProvider.addEntities(subentities);

								internalState.contextProvider.removeAliasExpressions();
								for (let ae of condition.Context.AliasExpressions) {
									internalState.contextProvider.addAliasExpression(ae.ParentPath, ae.PathSegment, ae.Parameters);
								}
							}
						}
					},
					getContextEntityDisplayName: function (entity) {
						const contextEntity = internalState.contextProvider.retrieveEntities(entity.id);
						return contextEntity ? contextEntity.displayName : '';
					},
					getNameOperandDataPath: function () {
						if (actualMgrConfig.useDataDictionary) {
							return 'Name';
						} else {
							return null;
						}
					},
					getIndexOperandDataPath: function () {
						if (actualMgrConfig.useDataDictionary) {
							return 'Index';
						} else {
							return null;
						}
					},
					getColorInfo: function (entity) {
						let propertyPath;
						if (_.has(entity, this.getPropertyOperandPath(0))) {
							propertyPath = _.get(entity, this.getPropertyOperandPath(0));
						} else {
							propertyPath = _.get(entity, this.getIndexOperandDataPath());
						}
						if (!_.isNil(propertyPath)) {
							return basicsCommonDdContextProviderService.getColorInfoByPropertyPath(propertyPath);
						} else {
							return undefined;
						}
					},
					setShowActiveEntities: function (value) {
						internalState.onlyShowActiveEntities = value;
						// set filtered data according to current value
						setFilteredEnumData();
						return internalState.onlyShowActiveEntities;
					}
				});

				return manager;
			};

			const defaultManager = service.createManager();

			service.getDefaultManager = function (isReadOnly) {

				if (isReadOnly === true || isReadOnly === false) {
					defaultManager.readOnly = isReadOnly;
				}
				return defaultManager;
			};

			service.getOperatorItemOfCondition = function (conditionEntity) {
				return defaultManager.getOperatorItemOfCondition(conditionEntity);
			};

			function setConfig(config) {
				defaultManager.setConfig(config);
			}

			function getConfig() {
				return defaultManager.getConfig();
			}

			function getFields(content, columns) {
				return defaultManager.getFields(content, columns);
			}

			function getDtoPropName(columnId) {
				return defaultManager.getDtoPropName(columnId);
			}

			function getPropDomain(columnId) {
				return defaultManager.getDtoPropDomain(columnId);
			}

			function checkColumn(column) {
				return defaultManager.checkColumn(column);
			}

			const filters = [
				{
					key: 'display-domain-filter',
					fn: function (operatorItem, conditionEntity) {
						const mgr = service.getInstance(conditionEntity);
						return mgr.filterDisplayDomain(operatorItem, conditionEntity);
					}
				},
				{
					key: 'condition-type-filter',
					fn: function (operatorItem) {
						// Only Group Operators
						return operatorItem.ConditionTypeFk === 1;
					}
				},
				{
					key: 'column-domain-filter',
					fn: function (attribute, condition) {
						const mgr = service.getInstance(condition);
						return mgr.filterAttribute(attribute, condition);
					}
				}
			];

			filterService.registerFilter(filters);

			// summarize
			service.getDisplayDomainIdByUiType = function (UiType) {
				return defaultManager.getDisplayDomainIdByUiType(UiType);
			};

			service.getUiTypeByDisplayDomainId = function (DomainId) {
				return defaultManager.getUiTypeByDisplayDomainId(DomainId);
			};

			service.determineDomain = function (condition, operandIndex) {
				return defaultManager.determineDomain(condition, operandIndex);
			};

			service.determineLookupColumn = function determineLookupColumn(conditionEntity) {
				return defaultManager.determineLookupColumn(conditionEntity);
			};

			service.getColumnById = function getColumnById(columnNameOrObject) {
				return defaultManager.getColumnById(columnNameOrObject);
			};

			service.hasToShow = function (rule, fieldName) {
				return defaultManager.hasToShow(rule, fieldName);
			};

			service.getPlaceHolder = function (rule, fieldName) {
				return defaultManager.getPlaceHolder(rule, fieldName);
			};

			function validateRule(item, validationService) {
				return defaultManager.validateRule(item, validationService);
			}

			function getMissingPinningContext(item) {
				return defaultManager.getMissingPinningContext(item);
			}

			// process the outgoing rules
			function processOutgoingRules(ArrayOfRulesArray) {
				return defaultManager.processOutgoingRules(ArrayOfRulesArray);
			}

			// process the incoming rules
			function processIncomingRules(RulesArray, validationService) {
				return defaultManager.processIncomingRules(RulesArray, validationService);
			}

			service.processIncomingRules = processIncomingRules;

			service.getRulesData = function getRulesData() {
				return defaultManager.getRulesData();
			};

			service.clearRulesData = function clearRulesData() {
				defaultManager.clearRulesData();
			};

			service.creationCondition = function creationCondition(group, conditionType, fakeCreate) {
				return defaultManager.creationCondition(group, conditionType, fakeCreate);
			};

			service.findParent = function findParent(items, parentId) {
				return defaultManager.findParent(items, parentId);
			};

			service.remove = function remove(item, list) {
				defaultManager.remove(item, list);
			};

			service.saveRuleDefinition = function saveRuleDefinition(newRuleList) {
				return defaultManager.saveRuleDefinition(newRuleList);
			};

			service.getRuleTreeByTopFk = function getRuleTreeByTopFk(topFk, searchList) {
				return defaultManager.getRuleTreeByTopFk(topFk, searchList);
			};

			service.getRuleDefinitionByTopFk = function getRuleDefinitionByTopFk(topFk) {
				return defaultManager.getRuleDefinitionByTopFk(topFk);
			};

			service.getOperatorByType = function getOperatorByType(typeId) {
				return defaultManager.getOperatorByType(typeId);
			};

			function isEditorLess(conditionItem) {
				return defaultManager.isEditorLess(conditionItem);
			}

			function checkChildren(childrenList) {
				return defaultManager.checkChildren(childrenList);
			}

			function getColumnDisplayName(columnAsStringOrObject) {
				return defaultManager.getColumnDisplayName(columnAsStringOrObject);
			}

			service.getFields = getFields;
			service.getDtoPropName = getDtoPropName;
			service.getDtoPropDomain = getPropDomain;
			service.checkColumn = checkColumn;
			service.setConfig = setConfig;
			service.getConfig = getConfig;
			service.isEditorLess = isEditorLess;
			service.checkChildren = checkChildren;
			service.processOutgoingRules = processOutgoingRules;
			service.validateRule = validateRule;
			service.getMissingPinningContext = getMissingPinningContext;
			service.getColumnDisplayName = getColumnDisplayName;

			service.getInstance = function getInstance(conditionEntity) {
				if (conditionEntity && conditionEntity[managerInstanceProperty]) {
					return conditionEntity[managerInstanceProperty];
				}
				return defaultManager;
			};

			return service;
		}
	]);
})(angular);
