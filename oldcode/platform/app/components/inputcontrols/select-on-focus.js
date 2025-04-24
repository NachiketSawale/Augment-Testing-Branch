/*
 * $Id: select-on-focus.js 590054 2020-06-08 15:20:29Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformSelectOnFocus', platformSelectOnFocus);

	platformSelectOnFocus.$inject = [];

	function platformSelectOnFocus() {
		return {
			restrict: 'A',
			require: '^ngModel',
			scope: false,
			link: function (scope, element) {
				function onFocus() {
					this.select();
					if(element && element[0]) {
						if(element[0].form) {
							let input = element[0].form.getElementsByTagName('input');
							for (let i = 0; i < input.length; i++) {
								input[i].classList.remove('active');
							}
						}
						element[0].classList.add('active');
					}
				}

				element.on('focus', onFocus);

				var unregister = scope.$on('$destroy', function () {
					unregister();
					element.off('focus', onFocus);
				});
			}
		};
	}
})(angular);