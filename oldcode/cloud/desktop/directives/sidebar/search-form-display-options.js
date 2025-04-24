(function (angular) {
	'use strict';

	function cloudDesktopSearchFormDisplayOptions($templateCache, $compile, _, $translate, cloudDesktopSidebarSearchFormService, platformCustomTranslateService) {
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

							angular.forEach(scope.entity.criterionItems, function (item) {
								angular.forEach(item.operands, function (value) {
									if (value.referenzItem.search_form_items.checked) { // jshint ignore:line
										// set showSearcterm to false, if exist only label and operator.
										if (value.referenzItem.search_form_items.showSearchTermContainer) {
											value.referenzItem.search_form_items.showSearchterm = false;
										}

										checkedItem.push(value);
									}
								});
							});

							return _.orderBy(checkedItem, ['referenzItem.search_form_items.sortOrder'], ['asc']);
						}

						scope.setSelectStatus = function (index) {
							// index is the position in scope.output-array
							scope.selectedItem = index;
						};

						buildIt();

						function buildIt() {
							scope.output = getOutputList();

							// create options for customtranslate
							buildOptionsForCustomTranslation();

							var template = $templateCache.get('sidebar-search-form-wizard-step2');

							elem.append($compile(template)(scope));
						}

						function buildOptionsForCustomTranslation() {
							angular.forEach(scope.output, function (item, index) {
								scope['option' + index] = {
									section: cloudDesktopSidebarSearchFormService.getSectionName(),
									name: 'label',
									id: scope.entity.searchFormDefinitionInfo.id,
									structure: index.toString(),
									// token: scope.entity.searchFormDefinitionInfo.id + '.' + item.referenzItem.search_form_items.sortOrder,
									onTranslationChanged: function (info) {
										scope.output[index].referenzItem.search_form_items.label = info.newValue; // jshint ignore:line
									},
									onInitiated: function (info) {
										platformCustomTranslateService.control.setValue(platformCustomTranslateService.createTranslationKey(scope['option' + index]), scope.output[index].referenzItem.search_form_items.label);
									},
								};

							});
						}
					}
				};
			}
		};
	}

	cloudDesktopSearchFormDisplayOptions.$inject = ['$templateCache', '$compile', '_', '$translate', 'cloudDesktopSidebarSearchFormService', 'platformCustomTranslateService'];

	angular.module('cloud.desktop').directive('cloudDesktopSearchFormDisplayOptions', cloudDesktopSearchFormDisplayOptions);
})(angular);
