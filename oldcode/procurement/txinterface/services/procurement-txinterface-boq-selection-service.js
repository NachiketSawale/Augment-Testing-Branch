/**
 * Created by reimer on 01.09.2016.
 */

(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.txinterface';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('procurementTxInterfaceBoqSelectionService', [
		'$q',
		'$http',
		function ($q, $http) {

			var data = null;      // cached object list

			var service = {};

			service.loadData = function(rfqHeaderFk) {

				var deffered = $q.defer();

				$http.get(globals.webApiBaseUrl + 'procurement/txinterface/list?rfqHeaderFk=' + rfqHeaderFk)
					.then(function (response) {
						data = response.data;
						deffered.resolve();
					});

				return deffered.promise;
			};

			service.getList = function() {
				return data;
			};

			return service;

		}
	]);
})(angular);
