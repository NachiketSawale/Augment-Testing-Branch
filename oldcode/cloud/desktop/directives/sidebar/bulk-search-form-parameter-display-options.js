(function (angular) {
	'use strict';

	function cloudDesktopBulkSearchFormParameterDisplayOptions($templateCache, $compile, _, $translate, $timeout, cloudDesktopSidebarSearchFormService, platformCustomTranslateService) {
		return {
			restrict: 'A',
			scope: {
				entity: '='
			},
			compile: function () {

				return {
					pre: function (scope, elem) {

						// Parameter Creation Section

						function getOutputList() {
							var checkedItem = [];

							angular.forEach(scope.entity.conditionGroups, function (item) {
								angular.forEach(item.operands, function (value) {
									if (value.checked) {
										checkForDynamicValue(value.values);
										checkedItem.push(value);
									}
								});
							});

							return checkedItem;
						}

						function checkForDynamicValue(values){
							if (values.length > 2 && !values[0].model.DynamicValue) {
								values.pop();
							}
						}

						function createParameterList(selectedItems) {
							var parameterList = [];
							angular.forEach(selectedItems, function (item) {

								if (scope.entity.edit && scope.entity.bulkPaths && _.includes(scope.entity.bulkPaths, item.accessPath)) {
									var existingParameter = _.find(parameterList, function (pl) {
										return _.includes(pl.priorConditions, item.accessPath);
									});
									// check if parameter is already push and only add path
									if (existingParameter) {
										existingParameter.assignedConditions.push(item);
									}
									// push existing parameter
									else {
										let foundParameter = _.find(scope.entity.formDef.filterDef.parameters, function (param) {
											return _.includes(param.bulkPaths, item.accessPath);
										});
										var newParameter = {
											label: foundParameter.label,
											label$tr$: foundParameter.label$tr$,
											domain: foundParameter.domain,
											target: foundParameter.target,
											parameterCount: foundParameter.values.length,
											values: foundParameter.values,
											active: foundParameter.active,
											dropDownOptions: {
												displayMember: 'fieldName',
												valueMember: 'fieldName',
												watchItems: true
											},
											showLabel: foundParameter.showLabel,
											showSearchTerm: foundParameter.showSearchTerm,
											previousUi: foundParameter.uiOptions,

										};
										newParameter.priorConditions = _.cloneDeep(foundParameter.bulkPaths);
										newParameter.assignedConditions = [item];
										parameterList.push(newParameter);
									}
								} else {
									let foundParameter = {};
									if(!scope.entity.formDef.filterDef.parameters) {
										foundParameter.active = true;
									} else {
										foundParameter = _.find(scope.entity.formDef.filterDef.parameters, function (param) {
											return _.includes(param.bulkPaths, item.accessPath);
										});
									}
									var newParam = {
										label: item.fieldName + ' - ' + item.operator,
										domain: item.domain,
										target: item.target,
										parameterCount: item.parameterCount,
										values: item.values,
										active: foundParameter.active,
										assignedConditions: [item],
										dropDownOptions: {
											displayMember: 'fieldName',
											valueMember: 'fieldName',
											watchItems: true
										},
										operator: item.operator,
										stringLiteral: item.stringLiteral,
										showLabel: true,
										showSearchTerm: false,
										isSet: item.isSet // temporary property to determin ui options
									};
									parameterList.push(newParam);
									// set item to assigned
									item.assigned = true;
								}
							});
							scope.entity.itemsAssigned = true;
							return parameterList;
						}

						function buildParameters() {
							scope.entity.output = getOutputList();
							scope.entity.formParameters = createParameterList(scope.entity.output);
						}

						buildParameters();

						// Parameter Creation Section End

						scope.descriptionNoSearchCriteria = $translate.instant('cloud.desktop.searchFormWizard.step2.descriptionNoSearchCriteria');

						buildIt();

						function buildIt() {
							// create options for customtranslate
							extendFormParameters(scope.entity.formParameters);
							removeUnusedParameters(scope.entity.formParameters);
							buildOptionsForCustomTranslation();
							var template = $templateCache.get('sidebar-bulk-search-form-wizard-step3');
							elem.append($compile(template)(scope));
						}

						function extendFormParameters(parameters) {
							_.forEach(parameters, function (parameter, index) {
								parameter.bulkPaths = _.map(parameter.assignedConditions, function (condition) {
									return condition.accessPath;
								});
								parameter.onDisplayChanged = function () {
									parameter.uiOptions = createDisplayOption(parameter.displayTemplate);
									setPreview(parameter, index);
									if (_.every(parameter.displayTemplate, {active: false})) {
										parameter.showSearchTerm = false;
									}
								};

								parameter.onActiveValueChanged = function (templateParameter) {
									parameter.active = templateParameter.active;
								};

								parameter.onDisplayModeChanged = function (mode, value) {
									var displaySection = _.find(parameter.displayTemplate, {id: mode});
									if (displaySection) {
										displaySection.value = value;
									}
									parameter.onDisplayChanged();
								};

								parameter.getModes = function () {
									return _.filter(parameter.displayTemplate, function (modeTemplate) {
										return modeTemplate.options && modeTemplate.options.length > 1;
									});
								};

								parameter.inputMode = 'literal';
								parameter.changeInputMode = function (mode) {
									parameter.inputMode = mode;
								};
								parameter.displayTemplate = getDisplayTemplate(parameter, parameter.previousUi);
								parameter.uiOptions = createDisplayOption(parameter.displayTemplate);
								parameter.displayOptions = getModeOptions(parameter.displayTemplate);

								parameter.watchValues = scope.$watch(function () {
									return parameter.values;
								}, function (newVal) {
									setDisplayTemplate(parameter.displayTemplate, newVal);
									parameter.onDisplayChanged();
								}, true);

								$timeout(parameter.onDisplayChanged);
							});
						}

						// auxiliary methods

						function setPreview(parameter, index) {
							var id = '.' + scope.entity.searchFormDefinitionInfo.id + 'prev' + index;
							var previewTemplate;

							if (!parameter.showSearchTerm) {
								previewTemplate = '<div data-ng-if="!item.showSearchTerm && item.values.length > 0" class="alert alert-warning">' +
									'<div>{{"cloud.desktop.searchform.default" | translate}} </div>' +
									'<div>{{item.valueDescriptionEdit}} </div>' +
									'</div>';
							} else {
								previewTemplate = '<div data-ng-if="item.active && item.showSearchTerm" cloud-desktop-search-form-parameter-control data-parameter="item" data-bulk-manager="manager"></div>';
							}
							previewTemplate = $templateCache.get('sidebar-search-form-control');
							var childScope = scope.$new();
							childScope.parameters = [cloneParameter(parameter)];
							childScope.bulkManager = scope.entity.bulkManager;
							elem.find(id).empty().append($compile(previewTemplate)(childScope));

							disableInlineRadioInput(isActive(parameter.values, 'dynamicRangeExpr') && parameter.showSearchTerm);
						}

						function cloneParameter(parameter) {
							var includedProp = ['label', 'label$tr$', 'showLabel', 'values', 'showSearchTerm', 'active', 'domain', 'uiOptions', 'valueDescription', 'target', 'onActiveValueChanged'];
							var clone = _.pickBy(_.cloneDeep(parameter), function (v, k) {
								return _.some(includedProp, function (x) {
									return _.includes(k, x);
								});
							});
							return clone;
						}

						function removeUnusedParameters(parameters) {
							_.remove(parameters, function (parameter) {
								return _.isEmpty(parameter.assignedConditions);
							});
						}

						function getModeOptions(template) {
							var result = {};
							_.forEach(template, function (mode) {
								var defaultInputMode = mode.value === 'multiSelect' ? 'multiSelect' : 'dropdown';
								_.assign(result, _.fromPairs([[mode.id, defaultInputMode]]));
							});
							return result;
						}

						function createDisplayOption(template) {
							var result = {};
							_.forEach(template, function (mode) {
								if (mode.active) {
									_.assign(result, _.fromPairs([[mode.id, mode.value]]));
								}
							});
							return result;
						}

						function getDisplayTemplate(parameter, currentOptions) {
							var result = [];
							if (parameter.domain !== 'lookup') {
								// literal section
								var literalOptions = {
									id: 'literal',
									label: 'cloud.desktop.searchFormWizard.step4.literalDisplayLabel',
									active: !_.has(currentOptions, 'literal') ? isActive(parameter.values, 'literal') : true,
									editable: !isActive(parameter.values, 'literal'),
									value: _.get(currentOptions, 'literal') || 'dropdown',
									options: [
										{
											label: 'cloud.desktop.searchFormWizard.step4.dropdownLabel',
											value: 'dropdown'
										}
									]
								};
								switch (parameter.domain) {
									case 'date':
									case 'select':
										literalOptions.options.push({
											label: 'cloud.desktop.searchFormWizard.step4.inlineLabel',
											value: 'inline'
										});
										break;
									default:
										break;
								}
								result.push(literalOptions);

								// variable section
								if (!_.isEmpty(scope.entity.bulkManager.getExpressionsForType(parameter.domain, parameter.target.kind, parameter.target.id))) {
									var variableOptions = {
										id: 'envExpr',
										label: 'cloud.desktop.searchFormWizard.step4.variableDisplayLabel',
										active: !_.has(currentOptions, 'literal') ? isActive(parameter.values, 'envExpr') : true,
										editable: !isActive(parameter.values, 'envExpr'),
										value: _.get(currentOptions, 'envExpr') || 'inline',
										options: [
											{
												label: 'cloud.desktop.searchFormWizard.step4.dropdownLabel',
												value: 'dropdown'
											},
											{
												label: 'cloud.desktop.searchFormWizard.step4.inlineLabel',
												value: 'inline'
											}
										]
									};
									if(isActive(parameter.values, 'dynamicRangeExpr')) {
										variableOptions.value = 'dropdown';
									}
									result.push(variableOptions);
								}
							} else {
								var lookupOptions = {
									id: 'lookup',
									label: 'cloud.desktop.searchFormWizard.step4.literalDisplayLabel',
									active: !_.has(currentOptions, 'lookup') ? isActive(parameter.values, 'lookup') : true,
									editable: !isActive(parameter.values, 'lookup'),
									value: _.get(currentOptions, 'lookup') || 'dropdown',
									options: []
								};
								if (!parameter.isSet && lookupOptions.value !== 'multiSelect') {
									lookupOptions.options = [
										{
											label: 'cloud.desktop.searchFormWizard.step4.dropdownLabel',
											value: 'dropdown'
										},
										{
											label: 'cloud.desktop.searchFormWizard.step4.inlineLabel',
											value: 'inline'
										}
									];
								} else {
									lookupOptions.options = [
										{
											label: 'cloud.desktop.searchFormWizard.step4.multiSelectLabel',
											value: 'multiSelect'
										}
									];
									lookupOptions.value = 'multiSelect';
								}
								result.push(lookupOptions);
							}

							return result;
						}

						function setDisplayTemplate(template, values) {
							_.forEach(template, function (tempSection) {
								if (isActive(values, tempSection.id)) {
									tempSection.active = true;
									tempSection.editable = false;
								} else {
									if(_.findIndex(values, val => val.mode === 'dynamicRangeExpr') !== -1){
										tempSection.active =  true;
									}
									tempSection.editable = true;
									tempSection.disabled = false;
								}
							});
						}

						function disableInlineRadioInput(bool) {
							if(_.isBoolean(bool)){
								let radioInputFields = $('.inputRadioSearchForm');
								if (radioInputFields.length === 0) {
									$timeout(function () {
										radioInputFields = $('.inputRadioSearchForm');
										toggleInlineRadioInput(bool, radioInputFields);
									}, 0);
								} else {
									toggleInlineRadioInput(bool, radioInputFields);
								}
							}

							function toggleInlineRadioInput(value, inputFields) {
								if(inputFields.length > 0) {
									if (value) {
										inputFields.first().prop('checked', true);
									}
									inputFields.get().filter(o => o.value === 'inline')[0].disabled = bool;
								}

							}
						}

						function isActive(values, mode) {
							return _.some(values, function (val) {
								return val.mode === mode && !val.hidden;
							});
						}

						function buildOptionsForCustomTranslation() {
							angular.forEach(scope.entity.formParameters, function (item, index) {
								scope['option' + index] = {
									section: cloudDesktopSidebarSearchFormService.getSectionName(),
									name: 'label',
									id: scope.entity.searchFormDefinitionInfo.id,
									structure: index.toString(),
									// token: scope.entity.searchFormDefinitionInfo.id + '.' + item.referenzItem.search_form_items.sortOrder,
									onTranslationChanged: function (info) {
										scope.entity.formParameters[index].label = info.newValue; // jshint ignore:line
										scope.entity.formParameters[index].onDisplayChanged();
									},
									onInitiated: function (info) {
										platformCustomTranslateService.control.setValue(platformCustomTranslateService.createTranslationKey(scope['option' + index]), scope.entity.formParameters[index].label);
									},
								};

							});
						}

					}
				};
			}
		};
	}

	cloudDesktopBulkSearchFormParameterDisplayOptions.$inject = ['$templateCache', '$compile', '_', '$translate', '$timeout', 'cloudDesktopSidebarSearchFormService', 'platformCustomTranslateService'];

	angular.module('cloud.desktop').directive('cloudDesktopBulkSearchFormParameterDisplayOptions', cloudDesktopBulkSearchFormParameterDisplayOptions);
})(angular);