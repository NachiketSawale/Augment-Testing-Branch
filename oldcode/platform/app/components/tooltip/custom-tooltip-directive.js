(function () {
	'use strict';

	angular.module('platform').directive('customTooltip', customTooltip);
	customTooltip.$inject = ['tooltipService', 'platformTranslateService'];

	function customTooltip(tooltipService, platformTranslateService) {
		return {
			restrict: 'AE',
			scope: {
				version: '='
			},
			link: function (scope, element, attr) {

				let tooltip = scope.$eval(attr.customTooltip);

				scope.$watch('version', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						tooltip = scope.$eval(attr.customTooltip);
					}
				});

				if (!_.isEmpty(tooltip)) {
					let mouseoverInPopupContainer = tooltipService.getExistUrls();
					let delayMouseOver = mouseoverInPopupContainer ? 300 : 0;
					let delayMouseleave = mouseoverInPopupContainer ? 100 : 0;

					element.on('mouseover', function (event) {
						setTimeout(function () {
							tooltipService.closePopup = true;
							showPopup(event);
						}, delayMouseOver, false);
					});

					element.on('mouseleave', function () {
						setTimeout(function () {
							if (tooltipService.closePopup) {
								tooltipService.hidePopup();
							}

						}, delayMouseleave, false);
					});
				}

				function getDefaultOptions(event) {
					return {
						scope: scope,
						focusedElement: angular.element(event.currentTarget)
					};
				}

				function showPopup(event) {
					loadTranslations(tooltip);
					scope.options = angular.extend({}, getDefaultOptions(event), tooltip || {});
					tooltipService.showPopup(scope.options);
				}

				function loadTranslations(fields) {
					// load translation ids and convert result to object
					platformTranslateService.translateObject(fields, undefined, {recursive: true});
				}
			}
		};
	}

})();
