(function () {
	'use strict';

	angular.module('basics.material').directive('inputEnter', ['keyCodes',
		function (keyCodes) {
			return {
				restrict: 'A',
				scope: {
					inputEnter: '&'
				},
				link: function (scope, element) {
					element.on('keydown', function (e) {
						if (e.keyCode === keyCodes.ENTER) {
							scope.$apply(function () {
								scope.inputEnter();
							});
						}
					});

					// Clean up the event listener when the scope is destroyed
					scope.$on('$destroy', function () {
						element.off('keydown');
					});
				}
			};
		}
	]);
})();