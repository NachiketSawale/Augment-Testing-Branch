( function () {
	'use strict';
	angular.module('qto.main').directive('qtoMainImageViewer',
		['qtoMainDetailGridValidationService', function (validationService) {

			return {
				restrict: 'A',
				scope: {
					entity: '='
				},
				templateUrl: window.location.pathname + 'qto.main/templates/qto-main-image.html',
				// if use formula control,don't need this lin
				link: function (scope) {
					var unWatchEntity = scope.$watch('entity', function (newId, oldId) {
						if (newId !== oldId && scope.entity) {
							validationService.getFormulaImage(scope.entity, scope.entity.QtoFormulaFk);
						}
					});

					scope.$on('$destroy', function () {
						unWatchEntity();
					});
				}
			};
		}]);
})();

