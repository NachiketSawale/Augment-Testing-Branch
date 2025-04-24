(function (angular, Slider) {
	'use strict';

	angular.module('platform').directive('platformSliderHandler', handler);

	handler.$inject = ['moment', '_', 'platformDomainService', '$translate', '$timeout'];

	function handler(moment, _, platformDomainService, $translate, $timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) {
				var inGrid = !_.isUndefined(attrs.grid);
				var config = inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null) || {};
				var options = inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null)) || {};
				var settings = initializeOptions(options);
				var slider = new Slider(elem[0], settings);

				slider.on('slideStop', function (newValue) {
					if (!newValue) {
						if (ctrl.$viewValue !== null) {
							ctrl.$setViewValue(null);
						}
					} else {
						var viewValue = newValue;
						if (viewValue !== ctrl.$viewValue) {
							ctrl.$setViewValue(viewValue);
						}
					}
				});

				// tooltip css
				angular.element(slider.getElement()).find('.tooltip').css({
					width: 'initial',
					background: 'initial',
					border: 'initial'
				});
				slider.relayout();

				function initializeOptions(options) {
					var defaults = {
						tooltip_split: true,
						tooltip: 'never',
						range: false,
						ticks: [0, 100]
					};
					defaults = $.extend(defaults, options);
					return defaults;
				}

				// add formatter to enable setting
				// remove formatter added by angular :-(
				if (ctrl.$formatters.length) {
					ctrl.$formatters.pop();
				}

				ctrl.$formatters.push(function (modelValue) {
					if (modelValue) {
						slider.setValue(modelValue);
					}
					return modelValue;
				});

			}
		};
	}

})(angular, Slider);