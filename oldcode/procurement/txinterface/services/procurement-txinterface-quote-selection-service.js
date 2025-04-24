/**
 * Created by reimer on 10.10.2016.
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
	angular.module(moduleName).factory('procurementTxInterfaceQuoteSelectionService', [
		'$q',
		'$http',
		function ($q, $http) {

			var data = null;      // cached object list

			var service = {};

			service.loadData = function(rfqHeaderFk) {

				var deffered = $q.defer();

				$http.get(globals.webApiBaseUrl + 'procurement/txinterface/listquotes?rfqHeaderFk=' + rfqHeaderFk)
					.then(function (response) {

						// add id and checkbox
						var row = 0;
						angular.forEach(response.data, function (item) {
							item.Checked = false;
							item.id = ++row;
						});

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
