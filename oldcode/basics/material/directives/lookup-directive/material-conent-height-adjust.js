(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialContentHeightAdjust', [
		function () {
			return {
				restrict: 'A',
				link: function (scope, element) {
					var destroyed = false,
						hasScrollBar = null,
						parent = element.parent();

					if (!parent.length) {
						return;
					}

					scope.$on('$destroy', function () {
						destroyed = true;
					});

					(function adjust() {
						if (destroyed) {
							return;
						}

						var htmlElement = parent[0];
						var scroll = htmlElement.scrollWidth > htmlElement.clientWidth;

						if (hasScrollBar === null || hasScrollBar !== scroll) {
							hasScrollBar = scroll;

							var height = parent.height();

							if (hasScrollBar) {
								height -= 17;
							}

							element.height(height);
						}

						requestAnimationFrame(adjust);
					})();
				}
			};
		}
	]);

})(angular);