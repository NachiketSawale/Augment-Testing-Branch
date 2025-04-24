/**
 * @ngdoc directive
 * @name platform.directive:platformPreventAutofill
 * @restrict A
 * @priority default value
 * @description
 * Prevents the autofill from beeing executed in input control.
 *
 * @example
 * <input type="text" data-platform-prevent-autofill data-prevent="true"></input>;
 */
((angular => {
	'use strict';

	let modulename = 'platform';
	let directiveName = 'platformPreventAutofill';

	angular.module(modulename).directive(directiveName, directiveFn);

	directiveFn.$inject = [];

	function directiveFn() {
		return ({
			restrict: 'A',
			scope: {
				prevent: '<?'
			},
			link: function (scope, element) {
				if (angular.isUndefined(scope.prevent) || scope.prevent) {
					element.attr('readonly', true);
					element.attr('onfocus', 'if (this.hasAttribute("readonly")) { this.removeAttribute("readonly"); this.blur(); this.focus(); }');
				}
			}
		});
	}
})(angular));
