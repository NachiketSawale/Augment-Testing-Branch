( function () {
	'use strict';
	angular.module('qto.main').directive('qtoMainSpecificationViewer', [function () {
		return {
			restrict: 'A',
			scope: {
				entity: '='
			},
			templateUrl: window.location.pathname + 'qto.main/templates/qto-main-specification.html',
			// if use formula control,don't need this lin
			link: function () {
			}
		};
	}]);
})();

