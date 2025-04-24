/**
 * Created by wui on 10/26/2016.
 */

/* global Slider */
(function(angular, Slider){
	'use strict';

	angular.module('basics.material').directive('basicsMaterialMaterialPriceSlider',['$timeout',
		function($timeout) {
			return {
				restrict: 'A',
				template: '<input type="text" style="width: 100%;" />',
				require: 'ngModel',
				scope: {
					change: '&'
				},
				link: function ($scope, $element, $attr, ngModelCtrl) {
					var defaults = {'tooltip_split': true, 'tooltip': 'always'};
					var slider, cancelTimeout, _modelValue;

					ngModelCtrl.$render = function () {
						_modelValue = angular.copy(ngModelCtrl.$viewValue);
						if (slider) {
							slider.setValue(ngModelCtrl.$viewValue);
						}
					};

					// refresh slider as soon as options changed.
					var unwatchOptions = $scope.$parent.$watch($attr.options, function (options) {
						if (slider) {
							slider.destroy();
						}
						bootstrapSlider(options, _modelValue);
					});

					// re-layout slider as soon as it is visible.
					var unwatchNgShow = $scope.$parent.$watch($attr.ngShow, function (show) {
						if (show === true) {
							cancelTimeout = $timeout(function () {
								if (slider) {
									slider.relayout();
								}
								unwatchNgShow();
								unwatchNgShow = null;
								cancelTimeout = null;
							});
						}
					});

					// clear resource
					$scope.$on('$destroy', function () {
						unwatchOptions();
						if (unwatchNgShow) {
							unwatchNgShow();
						}
						if (cancelTimeout) {
							cancelTimeout();
						}
						if (slider) {
							slider.destroy();
						}
					});

					function bootstrapSlider(options, value) {
						if(options) {
							var input = $element.find('input');
							var settings = $.extend({}, defaults, options, {
								ticks: [options.min, options.max],
								'ticks_labels': [options.min.toString(), options.max.toString()],
								step: options.step
							});

							slider = new Slider(input[0], settings);
							slider.on('slideStop', function (newValue) {
								if (ngModelCtrl.$viewValue !== newValue) {
									ngModelCtrl.$viewValue = newValue;
									ngModelCtrl.$setViewValue(newValue);
									ngModelCtrl.$commitViewValue();
									if (angular.isFunction($scope.change)) {
										$scope.change();
									}
								}
							});
							slider.setValue(value);

							// tooltip css
							angular.element(slider.getElement()).find('.tooltip').css({
								width: 'initial',
								background: 'initial',
								border: 'initial'
							});
							slider.relayout();

							return slider;
						}
					}
				}
			};
		}
	]);

})(angular, Slider);