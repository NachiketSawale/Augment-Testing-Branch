/**
 * Created by bh on 06.09.2018.
 */

(function (angular) {
	/* global $ */ 
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainBaseBoqReferenceInput', boqMainBaseBoqReferenceInput);

	boqMainBaseBoqReferenceInput.$inject = ['_', '$compile', '$templateCache', '$translate', 'platformObjectHelper', 'platformRuntimeDataService', 'basicsLookupdataPopupService', 'basicsLookupdataLookupViewService', 'platformRuntimeDataService'];

	function boqMainBaseBoqReferenceInput(_, $compile, $templateCache, $translate, platformObjectHelper, platformRuntimeDataService, basicsLookupdataPopupService, basicsLookupdataLookupViewService) {
		return {
			restrict: 'A',
			require: '^ngModel',
			scope: false,
			link: function (scope, elem, attrs, ngModelCtrl) {

				var inGrid = !_.isUndefined(attrs.grid);
				var config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				var options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};

				var popupOptions = {
					showPopup: true,
					popupOptions: {
						controller: 'procurementCommonGridPopupController'
					},
					popupLookupConfig: {
						version: 1,
						lookupType: 'baseboqreference',
						// valueMember: 'Id',
						displayMember: 'Reference',
						uuid: 'a048602c12884b4da08f0eed8f740be7',
						title: {name: $translate.instant('boq.main.reference')},
						columns: [
							{
								id: 'reference',
								field: 'Reference',
								name: 'Reference',
								toolTip: 'Reference',
								name$tr$: 'boq.main.Reference',
								formatter: 'description',
								width: 150
							},
							{
								id: 'briefinfo',
								formatter: 'translation',
								editor: 'translation',
								field: 'BriefInfo',
								name: 'Brief Info',
								toolTip: 'Brief Info',
								name$tr$: 'boq.main.BriefInfo',
								width: 150
							},
							{
								id: 'quantity',
								field: 'Quantity',
								name: 'Quantity',
								toolTip: 'Quantity',
								formatter: 'quantity',
								name$tr$: 'cloud.common.entityQuantity',
								width: 90
							},
							{
								id: 'basUomFk',
								field: 'BasUomFk',
								name: 'BasUomFk',
								toolTip: 'QuantityUoM',
								name$tr$: 'cloud.common.entityUoM',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'uom',
									displayMember: 'Unit'
								},
								width: 50
							},
							{
								id: 'price',
								field: 'Price',
								name: 'Price',
								toolTip: 'Unit Rate',
								formatter: 'money',
								name$tr$: 'boq.main.Price',
								width: 100
							}
						],
						lookupRequest: function (entity) {
							if (entity && options.boqMainService) {
								return options.boqMainService.getSiblingBaseBoqItemsOfSelectedItem(entity).then(function (result) {
									return {data: result}; // The underlying logic expects the result of a http call which usually has this structure.
								});
							}
							return null;
						}
					}
				};

				var popupHelper = null;
				var popupInstance = null;
				var customPopupOptions = angular.copy(popupOptions);

				if (!inGrid) {
					// create binding when used outside of grid, in grid readonly is handled in slickgrid internally
					if (config.readonly) {
						attrs.readonly = 'true';
					} else {
						// lookup of readonly in __rt$data in form; provided by row definition in form-content
						if (scope.$eval(attrs.config + '.rt$readonly')) {
							attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
						}
					}
				}

				var groupTemplate = '<div class="input-group">$$directive$$</div>';
				var buttonGroupTemplate = '<span class="input-group-btn">' +
					'<button class="btn btn-default control-icons ico-down @@btnCssClass@@" data-ng-click="togglePopup($event)" @@btnPlaceholder@@></button>' +
					'</span>';
				var template = null;
				var inputTemplate = '<div data-domain-control data-domain=' + options.inputDomain + '@@placeholder@@></div>';

				template = groupTemplate.replace(/\$\$directive\$\$/g, inputTemplate + buttonGroupTemplate);
				template = template.replace(/@@btnCssClass@@/g, inGrid ? '' : 'input-sm')
					.replace(/@@btnPlaceholder@@/g, !attrs.readonly ? '' : 'data-ng-hide="' + attrs.readonly + '"');

				var placeholder = [
					!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
					!attrs.config ? '' : ' data-config="' + attrs.config + '"',
					' data-ng-model="' + (attrs.model || attrs.ngModel) + '"',
					!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
					!attrs.readonly ? '' : ' data-readonly="' + attrs.readonly + '"',
					!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
					!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
					!attrs.dirty ? '' : ' data-dirty="true"',
					!attrs.grid ? '' : ' data-grid="true"'
				].join('');

				template = template
					.replace(/@@placeholder@@/g, placeholder);

				basicsLookupdataLookupViewService.config('lookup-edit', customPopupOptions.popupLookupConfig);

				scope.options = options;
				scope.settings = customPopupOptions.popupLookupConfig;

				scope.settings.getFilterValue = function getFilterValue() {
					if (scope.entity) {
						return scope.entity;
					}

					return null;
				};

				scope.editModeHandler = {
					getSelectedRowId: function () {
						return null;
					}
				};

				scope.canSelect = function canSelect(selectedItem) {
					return selectedItem;
				};

				scope.togglePopup = function (event) {
					if (!popupHelper) {
						popupHelper = basicsLookupdataPopupService.getToggleHelper();
					}

					var defaultPopupOptions = {
						scope: scope,
						template: $templateCache.get('grid-popup-lookup.html'),
						footerTemplate: $templateCache.get('lookup-popup-footer.html'),
						controller: '',
						focusedElement: $(event.target),
						width: 400,
						height: 320,
						showLastSize: true
					};

					var popupOptions = $.extend(true, defaultPopupOptions, customPopupOptions.popupOptions);

					popupInstance = popupHelper.toggle(popupOptions);
					if (popupInstance && popupInstance.result) {
						popupInstance.result.then(function (result) {
							if (result && result.isOk && result.value) {
								var field = config.model || config.field;
								var modelValue = result.value[field];
								var entity = scope.$eval(attrs.entity) || scope.entity;

								if (!inGrid) {
									result = {valid: true};
									var setValueNow = true;
									if (angular.isFunction(config.validator)) {
										if (entity && _.get(entity, field, modelValue) !== modelValue) {
											result = platformRuntimeDataService.applyValidationResult(config.validator(entity, modelValue, field), entity, field);
										} else {
											setValueNow = false;
										}
									}

									if (result.valid && angular.isFunction(config.asyncValidator)) {
										if (result.valid && entity && _.get(entity, field, modelValue) !== modelValue) {
											setValueNow = false;
											config.asyncValidator(entity, modelValue, field)
												.then(function (asyncResult) {
													platformRuntimeDataService.applyValidationResult(asyncResult, entity, field);
													platformObjectHelper.setValue(entity, field, modelValue);
													if (config && config.onPropertyChanged) { // TODO chi: add by cici
														config.onPropertyChanged();
													}
													if (options && options.onValueApplied) {
														options.onValueApplied(entity, field, options.boqMainService);
													}
												}, function () {
													platformObjectHelper.setValue(entity, field, modelValue);
													if (config && config.onPropertyChanged) { // TODO chi: add by cici
														config.onPropertyChanged();
													}
													if (options && options.onValueApplied) {
														options.onValueApplied(entity, field, options.boqMainService);
													}
												});
										} else {
											setValueNow = false;
										}
									}

									if (setValueNow) {
										platformObjectHelper.setValue(entity, field, modelValue);
										if (config && config.onPropertyChanged) { // TODO chi: add by cici
											config.onPropertyChanged();
										}
										if (options && options.onValueApplied) {
											options.onValueApplied(entity, field, options.boqMainService);
										}
									}

								} else {
									if (ngModelCtrl.$viewValue !== modelValue) {
										ngModelCtrl.$setViewValue(modelValue);
										ngModelCtrl.$commitViewValue();
									}
								}
							}
						});
					}
				};

				var content = $compile(template)(scope);

				elem.replaceWith(content);
			}
		};
	}
})(angular);