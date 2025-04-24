(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).service('remarkOpenPopupService', [
		'_',
		'basicsLookupdataPopupService',
		function (_,
			basicsLookupdataPopupService) {

			var service = {};
			var popupToggle = basicsLookupdataPopupService.getToggleHelper();
			service.openPopup = function openPopup(e, scope) {
				// noinspection JSCheckFunctionSignatures
				var popupOptions = {
					id: 'remarkPopup',
					templateUrl: globals.appBaseUrl + '/procurement.pricecomparison/partials/remark-open-popup-view.html',
					title: 'remark',
					showLastSize: true,
					controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
					width: 200,
					height: 120,
					focusedElement: angular.element(e.target.parentElement),
					relatedTarget: angular.element(e.target),
					scope: scope.$new()
				};
				popupToggle.toggle(popupOptions);

				function controller($scope) {
					$scope.obj = {
						value: $scope.value
					};
					$scope.$on('$destroy', function () {
						if ($scope.$close) {
							$scope.$close();
						}
					});
				}
			};
			return service;
		}]);

})(angular);