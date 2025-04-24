/**
 * Created by reimer on 24.10.2016.
 */

(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.txinterface';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('procurementTxInterfaceActivityStreamController', [
		'$scope',
		'$q',
		'$sce',
		'$http',
		function ($scope,
			$q,
			$sce,
			$http) {

			$scope.path = globals.appBaseUrl;

			$scope.iFrameSrc = null;

			var init = function () {

				$http.get(globals.webApiBaseUrl + 'procurement/txinterface/activitystreamurl').then(function (response) {
					$scope.iFrameSrc = $sce.trustAsUrl(response.data);
				});

			};
			init();

			// un-register on destroy
			$scope.$on('$destroy', function () {
			});
		}
	]);
})();