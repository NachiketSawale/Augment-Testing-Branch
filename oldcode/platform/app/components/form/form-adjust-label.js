/**
 * @ngdoc directive
 * @name platform.directive:platformAdjustLabelWidth
 * @element platformForm
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Set all the labels(.platform-form-label) in same width in a form.
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-adjust-label-width>
 form groups and rows
 </div>
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformFormAdjustLabel', platformFormAdjustLabel);

	platformFormAdjustLabel.$inject = ['$timeout', '_'];

	function platformFormAdjustLabel($timeout, _) {
		return {
			restrict: 'A',
			scope: false,
			link: function ($scope, $element) {
				var scope = $scope;
				var element = $element;

				// get max label width
				var getMaxLabelWidth = function getMaxLabelWidth() {
					function getMaxLabelWidthByElement(panel) {
						var label = panel.find('.platform-form-label')[0];

						return angular.element(label).width();
					}

					var panels = element.find('.panel-collapse');
					var maxWidth = 0;
					var labelWidth = 0;

					if (panels.length > 0) {
						for (var i = 0; i < panels.length; i++) {
							var panel = angular.element(panels[i]);

							// Calculate the all the panels including the hidden ones
							var previousCss = panel.attr('style');

							panel.css({
								position: 'absolute',
								visibility: 'hidden',
								display: 'block'
							});

							labelWidth = getMaxLabelWidthByElement(panel);

							if (labelWidth > maxWidth) {
								maxWidth = labelWidth;
							}

							panel.attr('style', previousCss ? previousCss : '');
						}
					} else {
						maxWidth = getMaxLabelWidthByElement(element);
					}

					return maxWidth;
				};

				var setMaxLabelWidth = function setMaxLabelWidth(element, width) {
					var panels = element.find('.panel-collapse');
					var label = '';

					if (panels.length > 0) {
						for (var i = 0; i < panels.length; i++) {
							var panel = angular.element(panels[i]);

							label = panel.find('.platform-form-label');
							label.css('min-width', width + 'px');
						}
					} else {
						label = element.find('.platform-form-label');
						label.css('min-width', width + 'px');
					}
				};

				// set all the label's width same as to the max width in form
				var adjustLabelWidth = function () {
					var labelWidth = getMaxLabelWidth();

					setMaxLabelWidth(element, labelWidth);
					element.find('.platform-form-label:empty').remove();
				};

				$timeout(function () {
					adjustLabelWidth();
				});

				var unregister = [];

				unregister.push(scope.$on('form-config-updated-rendered', function () {
					adjustLabelWidth();
				}));

				unregister.push(scope.$on('$destroy', function () {
					_.over(unregister)();
					scope = element = unregister = null;
				}));
			}
		};
	}
})(angular);