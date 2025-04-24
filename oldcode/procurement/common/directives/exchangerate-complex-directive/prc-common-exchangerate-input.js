/**
 * Created by chi on 5/4/2018.
 */

// eslint-disable-next-line no-redeclare
/* global angular,$ */
(function(angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('procurementCommonExchangerateInput', procurementCommonExchangerateInput);

	procurementCommonExchangerateInput.$inject = ['_', '$q', '$compile', '$templateCache', 'platformDomainService', 'procurementCommonExchangeratePopupOption',
		'platformObjectHelper', 'basicsLookupdataPopupService', 'basicsLookupdataLookupViewService', 'platformDomainControlService', 'platformRuntimeDataService'];

	function procurementCommonExchangerateInput(_, $q, $compile, $templateCache, platformDomainService, procurementCommonExchangeratePopupOption,
		platformObjectHelper, basicsLookupdataPopupService, basicsLookupdataLookupViewService, platformDomainControlService, platformRuntimeDataService) {
		return {
			restrict: 'A',
			require: '^ngModel',
			scope: false,
			link: function (scope, elem, attrs, ngModelCtrl) {
				var popupHelper = null;
				var popupInstance = null;
				var customPopupOptions = procurementCommonExchangeratePopupOption.getOptions();
				var inGrid = !_.isUndefined(attrs.grid);
				var config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				var options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};

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
				var inputTemplate = '<div data-domain-control data-domain="exchangerate" @@placeholder@@></div>';

				template = groupTemplate.replace(/\$\$directive\$\$/g, inputTemplate + buttonGroupTemplate);
				template = template.replace(/@@btnCssClass@@/g, inGrid ? '' : 'input-sm')
					.replace(/@@btnPlaceholder@@/g, !attrs.readonly ? '' : 'data-ng-hide="' + attrs.readonly + '"');

				var placeholder = [
					!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"', !attrs.config ? '' : ' data-config="' + attrs.config + '"', ' data-ng-model="' + (attrs.model || attrs.ngModel) + '"', !attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"', !attrs.readonly ? '' : ' data-readonly="' + attrs.readonly + '"', !attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"', !attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"', !attrs.dirty ? '' : ' data-dirty="true"', !attrs.grid ? '' : ' data-grid="true"'
				].join('');

				template = template
					.replace(/@@placeholder@@/g, placeholder);

				basicsLookupdataLookupViewService.config('lookup-edit', customPopupOptions.popupLookupConfig);

				scope.options = options;
				scope.settings = customPopupOptions.popupLookupConfig;

				scope.settings.getFilterValue = function getFilterValue() {
					if (scope.entity) {
						return {
							projectFk: scope.entity.ProjectFk,
							currencyForeignFk: scope.entity.CurrencyFk || scope.entity.BasCurrencyFk,
							companyFk: scope.entity.CompanyFk
						};
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
								var modelValue = result.value[customPopupOptions.popupLookupConfig.referencedForeignKey];
								var entity = scope.$eval(attrs.entity) || scope.entity;
								var field = config.model || config.field;

								if (!inGrid) {
									result = {valid: true};
									var setValueNow = true;
									if (angular.isFunction(config.validator)) {
										entity = scope.$eval(attrs.entity) || scope.entity;
										field = config.model || config.field;

										if (entity && _.get(entity, field, modelValue) !== modelValue) {
											result = platformRuntimeDataService.applyValidationResult(config.validator(entity, modelValue, field), entity, field);
										}
										else {
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
												}, function () {
													platformObjectHelper.setValue(entity, field, modelValue);
													if (config && config.onPropertyChanged) { // TODO chi: add by cici
														config.onPropertyChanged();
													}
												});
										}
										else {
											setValueNow = false;
										}
									}

									if (setValueNow) {
										platformObjectHelper.setValue(entity, field, modelValue);
										if (config && config.onPropertyChanged) { // TODO chi: add by cici
											config.onPropertyChanged();
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