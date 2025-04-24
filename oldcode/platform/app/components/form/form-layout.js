/**
 * @ngdoc directive
 * @name platform.directive:platformGridLayout
 * @element
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Add responsive grid layout to html form
 * Base on the contextual selector in css, we can select which css class in html active just change the css
 * class in it's parent html node.
 *
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-grid-layout>
 <div class = 'md-3 xs-12 pull-left'/>
 <div class = 'md-9 xs-12 pull-left'/>
 </div>
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	// size constants.
	var XSSIZE = 350, SMSIZE = 500, MDSIZE = 600;

	angular.module('platform').directive('platformFormLayout', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			scope: false,
			replace: false,
			link: function (scopeRef, elemRef) {
				var scope = scopeRef;
				var element = elemRef;
				var size = element.width();
				var updateLayout = function updateLayoutFunc() {
					if (element !== null) {
						if (size !== element.width()) {
							size = element.width();
							scope.$emit('resize', {el: element, width: size});
						}

						element.removeClass('platform-xs');
						element.removeClass('platform-sm');
						element.removeClass('platform-md');
						element.removeClass('platform-lg');
						if (size < XSSIZE) {
							element.addClass('platform-xs');
						} else if (size < SMSIZE) {
							element.addClass('platform-sm');
						} else if (size < MDSIZE) {
							element.addClass('platform-md');
						} else {
							element.addClass('platform-lg');
						}
					}
				};
				var updateLayoutByTimeout = function updateLayoutByTimeoutFunc() {
					setTimeout(updateLayout, 100);
				};

				angular.element('body').on('mouseup', updateLayoutByTimeout);

				$timeout(updateLayout);

				var unregister = [];

				unregister.push(scope.$on('updateGridLayout', function () {
					updateLayout();
				}));

				unregister.push(scope.$on('$destroy', function () {
					angular.element('body').off('mouseup', updateLayoutByTimeout);

					_.over(unregister)();
					unregister = null;

					updateLayout = _.noop();
					updateLayoutByTimeout = _.noop();

					scope = null;
					element = null;
				}));
			}
		};
	}]);
})(angular);