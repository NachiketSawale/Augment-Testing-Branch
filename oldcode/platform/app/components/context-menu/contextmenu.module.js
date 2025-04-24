(function () {
	'use strict';

	/**
	 * @ngdoc module
	 * @name contextMenu
	 * @description
	 * This module contains the contextMenu directive. This directive is used as an attribute
	 * on elements.
	 *
	 * @param {array} contextmenu Content for the menu:
	 *                            [
	 *                              ['Info',        function() { $window.alert('Info');}],
	 *                              ['Add New Row', function() { $window.alert('Add New Row');}]
	 *                            ]
	 */
	angular
		.module('contextMenu', [])
		.directive('contextMenu', contextMenu);

	contextMenu.$inject = [
		'$document'
	];

	function contextMenu($document) {
		var directive = {
			restrict: 'A',
			controller: ['$scope', '$element', '$attrs', contextMenuController],
			controllerAs: 'vm',
			link: linkFn
		};
		return directive;

		function contextMenuController($scope, $element, $attrs) {
			/* jshint validthis: true */
			var vm = this;

			vm.createContextMenu = function (scope, event, options) {
				var $ = angular.element;
				$(event.currentTarget).addClass('context');
				var menu = $('<div>');
				menu.addClass('dropdown clearfix');
				var list = $('<ul>');
				list.addClass('dropdown-menu');
				list.attr({'role': 'menu'});
				list.css({
					display: 'block',
					position: 'absolute',
					left: event.pageX + 'px',
					top: event.pageY + 'px'
				});
				angular.forEach(options, function (value, key) {
					var listItem = $('<li>');
					if (!value) {
						listItem.addClass('divider');
					} else {
						var link = $('<a>');
						link.attr({'tabindex': -1});
						link.attr({'role': 'menuitem', 'href': '#'});
						link.text(value[0]);
						listItem.append(link);
						listItem.on('click', function () {
							// scope.$apply(function() {
							value[1].call(scope, scope);
							// });
						});
					}
					list.append(listItem);
				});
				menu.append(list);

				menu.css({
					width: '100%',
					height: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 9999
				});
				$($document).find('body').append(menu);
				menu.on('click', function (e) {
					$(event.currentTarget).removeClass('context');
					menu.remove();
				}).on('contextmenu', function (event) {
					$(event.currentTarget).removeClass('context');
					event.preventDefault();
					menu.remove();
				});
			};
		}

		function linkFn(iScope, iElement, iAttrs) {
			console.log(iScope);
			console.log(iAttrs);
			iElement.on('contextmenu', function (event) {
				iScope.$apply(function () {
					event.preventDefault();
					var options = iScope.$eval(iAttrs.contextMenu);
					if (Object.prototype.toString.call(options) !== '[object Array]') {
						throw new Error(iAttrs.contextMenu + ' is not an array');
					}
					iScope.vm.createContextMenu(iScope, event, options);
				});
			});
			iScope.$on('$destroy', function () {
			});
			iElement.on('$destroy', function () {
				angular.element('li').off('click');
				angular.element('ul').off('click');
				iElement.off('contextmenu');
			});
		}
	}
})();
