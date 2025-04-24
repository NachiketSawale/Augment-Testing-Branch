(function (angular) {
	'use strict';

	function cloudDesktopBulkSearchFormParameterDisplaySequenceOptions($templateCache, $compile, _, $translate, $timeout, cloudDesktopSidebarSearchFormService, platformCustomTranslateService) {
		return {
			restrict: 'A',
			scope: {
				entity: '='
			},
			compile: function () {

				return {
					pre: function (scope, elem) {
						// Parameter Creation Section End
						scope.descriptionNoSearchCriteria = $translate.instant('cloud.desktop.searchFormWizard.step2.descriptionNoSearchCriteria');

						buildIt();

						function buildIt() {
							let template = $templateCache.get('sidebar-bulk-search-form-wizard-step4');
							elem.append($compile(template)(scope));
						}
					},
					post: function (scope) {
						scope.removeOptionByUUID = function (optionToRemove) {

							if (optionToRemove) {
								scope.removeView(getItem(optionToRemove.selected));
							}

							_.remove(scope.optionsList, function (option) {
								return option.uuid === optionToRemove.uuid;
							});
						};
						createOptionsListFromParameter(scope);

						function createOptionsListFromParameter(scope) {
							scope.optionsList =	[];
							let optionObj =  {
								'displayMember': 'label',
								'valueMember': 'uuid',
								'selected': '',
								'showDragZone': true,
								'showSearchfield': false,
								'description': 'label',
								'items': [

								],
								'uuid': 'assignedConditions[0].accessPath'
						  };
							scope.entity.formParameters.forEach((formParameter, index) => {
								let newOption = Object.assign({}, optionObj);
								newOption.selected = formParameter.label;
								newOption.description = formParameter.label;
								newOption.uuid = formParameter.assignedConditions[0].accessPath;
								newOption.relatedFormParameter = scope.entity.formParameters[index];
								newOption.relatedOutputObj = scope.entity.output[index];

								scope.optionsList.push(newOption);
							});
						}

						scope.dropHandler = {
							accept: function (sourceItemHandleScope) {
								return sourceItemHandleScope.itemScope.opt && sourceItemHandleScope.itemScope.opt.selected;
							}
						};

						var unregister = [];

						unregister.push(scope.$watch('optionsList', function (newList, oldList) {
							// noinspection JSUnresolvedVariable
							if (oldList.length !== newList.length) {
								// noinspection JSUnresolvedVariable
								if (newList.length > oldList.length) {
									scope.entity.formParameters = newList.map(x => x.relatedFormParameter);
								}
							}
						}, true));

						scope.additionalCss = 'e2e-content-value-';

						function getItem(value) {
							var _toReturn = null;

							angular.forEach(scope.optionsList, function (option) {
								for (var i = 0; i < option.items.length; i++) {
									if (option.items[i][option.valueMember] === value) {
										_toReturn = option.items[i];
									}
								}
							});
							return _toReturn;
						}

						unregister.push(scope.$on('$destroy', function () {
							scope.optionsList = [];

							_.over(unregister)();
							unregister = null;
						}));

					}
				};
			}
		};
	}

	cloudDesktopBulkSearchFormParameterDisplaySequenceOptions.$inject = ['$templateCache', '$compile', '_', '$translate', '$timeout', 'cloudDesktopSidebarSearchFormService', 'platformCustomTranslateService'];

	angular.module('cloud.desktop').directive('cloudDesktopBulkSearchFormParameterDisplaySequenceOptions', cloudDesktopBulkSearchFormParameterDisplaySequenceOptions);
})(angular);