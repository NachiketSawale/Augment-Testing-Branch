(function (angular) {
	'use strict';

	function cloudDesktopBulkSearchFormDisplayOptions($templateCache, $compile, _, $translate, cloudDesktopSidebarSearchFormService, platformCustomTranslateService) {
		return {
			restrict: 'A',
			scope: {
				entity: '='
			},
			compile: function () {

				return {
					pre: function (scope, elem) {
						scope.descriptionNoSearchCriteria = $translate.instant('cloud.desktop.searchFormWizard.step2.descriptionNoSearchCriteria');

						function getOutputList() {
							var checkedItem = [];

							angular.forEach(scope.entity.conditionGroups, function (item) {
								angular.forEach(item.operands, function (value) {
									if (value.checked) {
										checkedItem.push(value);
									}
								});
							});

							return checkedItem;
						}

						function createParameterList(selectedItems) {
							var parameterList = [];
							angular.forEach(selectedItems, function (item) {

								if (scope.entity.edit && scope.entity.bulkPaths && _.includes(scope.entity.bulkPaths, item.accessPath)) {
									var existingParameter = _.find(parameterList, function (pl) {
										return _.includes(pl.priorConditions, item);
									});
									// check if parameter is already push and only add path
									if (existingParameter) {
										existingParameter.assignedConditions.push(item);
									}
									// push existing parameter
									else {
										var foundParameter = _.find(scope.entity.filterDef.filterDef.parameters, function (param) {
											return _.includes(param.bulkPaths, item.accessPath);
										});
										var newParameter = {
											label: foundParameter.label,
											label$tr$: foundParameter.label$tr$,
											domain: foundParameter.domain,
											parameterCount: foundParameter.values.length,
											values: foundParameter.values,
											dropDownOptions: {
												displayMember: 'fieldName',
												valueMember: 'fieldName',
												watchItems: true
											}
										};
										newParameter.priorConditions = _.cloneDeep(existingParameter.assignedConditions);
										newParameter.assignedConditions = [item];
										parameterList.push(newParameter);
									}
								} else {
									var newParam = {
										label: item.fieldName,
										domain: item.domain,
										parameterCount: item.parameterCount,
										values: item.values,
										assignedConditions: [item],
										dropDownOptions: {
											displayMember: 'fieldName',
											valueMember: 'fieldName',
											watchItems: true
										},
										onSelectCondition: function () {
											var condition = _.find(scope.entity.output, {fieldName: this.selected});
											this.assignedConditions.push(condition);
											condition.assigned = true;
											updateAvailableItems();
											this.selected = null;
										},
										onRemoveCondition: function (condition) {
											_.remove(this.assignedConditions, {fieldName: condition.fieldName});
											condition.assigned = false;
											updateAvailableItems();
										}
									};
									parameterList.push(newParam);
									// set item to assigned
									item.assigned = true;
								}
							});
							scope.entity.itemsAssigned = true;
							return parameterList;
						}

						function setCustomEntryfileds(items, boolean) {
							items.showSearchterm = boolean;
							items.showLabel = boolean;
							items.showOperator = false;
						}

						scope.setSelectStatus = function (index) {
							// index is the position in scope.output-array
							scope.selectedItem = index;
						};

						function updateAvailableItems() {
							_.forEach(scope.entity.formParameters, function (param) {
								param.dropDownOptions.items = _.filter(scope.entity.output, function (condition) {
									return !condition.assigned && condition.domain === param.domain && condition.parameterCount === param.parameterCount;
								});
							});
							scope.entity.itemsAssigned = !_.some(scope.entity.output, {assigned: false});
						}

						buildIt();

						function buildIt() {
							scope.entity.output = getOutputList();
							scope.entity.formParameters = createParameterList(scope.entity.output);

							// create options for customtranslate
							buildOptionsForCustomTranslation();

							var template = $templateCache.get('sidebar-bulk-search-form-wizard-step2');

							elem.append($compile(template)(scope));
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

	cloudDesktopBulkSearchFormDisplayOptions.$inject = ['$templateCache', '$compile', '_', '$translate', 'cloudDesktopSidebarSearchFormService', 'platformCustomTranslateService'];

	angular.module('cloud.desktop').directive('cloudDesktopBulkSearchFormDisplayOptions', cloudDesktopBulkSearchFormDisplayOptions);
})(angular);