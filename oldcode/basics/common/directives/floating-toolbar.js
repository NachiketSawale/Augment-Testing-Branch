/**
 * Created by ong on 2/2/2022.
 */

(function () {
	'use strict';

	angular.module('basics.common').directive('basicsCommonFloatingToolbar', floatingToolbarDirective);

	floatingToolbarDirective.$inject = ['$', '_', 'basicsLookupdataPopupService', '$compile', '$timeout'];

	function floatingToolbarDirective($, _, basicsLookupdataPopupService, $compile, $timeout) {
		return {
			restrict: 'A',
			scope: {
				items: '=',
				options: '=',
				container: '='
			},
			link: function (scope, elem) {

				let position = (scope.options && scope.options.position) ? scope.options.position : 'bottom-right';
				let verticalScroll =  (scope.options && scope.options.verticalScroll) ? ' v-scroll' : '';
				let horizontalScroll =  (scope.options && scope.options.horizontalScroll) ? '  h-scroll' : '';

				let content = [];
				content += '<div class="toolbar-overlay ' + position + verticalScroll + horizontalScroll + '">';
				content += '<div data-platform-menu-list data-list="listDeclaration"></div>';
				// content += '<button class="tlb-icons ico-content-switch"/>';
				content += '</div>';
				elem.append($compile(content)(scope));

				let instance;

				scope.$watch('items', function() {
					scope.listDeclaration = {
						showImages: false,
						showTitles: false,
						cssClass: 'tools', // the css class tools is necessary for toolbars
						items: [
							{
								type: 'dropdown-btn',
								icoClass: 'tlb-icons ico-content-switch',
								cssClass: 'tlb-icons ico-content-switch',
								list: {
									showImages: false,
									cssClass: (position === 'bottom-right' || position === 'top-right') ? 'dropdown-menu-left' : 'dropdown-menu-right',
									items: scope.items
								}
							}
						]
					};
				});

				if (scope.options && scope.options.transparent) {
					elem.css('opacity', '0');
					elem.on('mouseleave', function () {
						if (!instance || (instance && instance.isClosed)) {
							elem.css('opacity', '0');
						}
					});

					elem.on('mouseenter', function () {
						elem.css('opacity', '1');
					});
				}
			}
		};
	}
})();
