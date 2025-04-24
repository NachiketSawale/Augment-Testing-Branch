/**
 * Created by wui on 5/29/2015.
 */

(function (angular) {
	'use strict';
	/* instruction in WiKi: https://apps-int.itwo40.eu/wiki/itwo40/wiki/1217 */

	angular.module('basics.common').directive('basicsCommonWhiteBoard', ['$compile',
		function ($compile) {
			return {
				restrict: 'A',
				scope: {
					show: '=',
					info: '=',
					options: '=',
					css: '='
				},
				link: function(scope, elem) {
					angular.element(elem).parent().addClass('relative-container');

					function getHTMLContent() {
						let htmlMarkup = '<div class="text-left" data-ng-bind-html="info"></div>';

						if(scope.options) {
							if(Object.prototype.hasOwnProperty.call(scope.options, 'directive')) {
								htmlMarkup = scope.options.directive;
							}
							else if(Object.prototype.hasOwnProperty.call(scope.options, 'templateUrl')) {
								htmlMarkup = '<div data-ng-include="options.templateUrl"></div>';
							}
						}

						return htmlMarkup;
					}

					function createHTMLMarkup() {
						let content = `<div data-ng-show="show" data-ng-class="css" class="container-overlay" >
											${getHTMLContent()}
											</div></div>`;

						elem.append($compile(content)(scope));
					}

					function watchfn() {
						elem.empty();
						createHTMLMarkup();
					}

					scope.$watch('options', watchfn);
				}
			};
		}
	]);
})(angular);
