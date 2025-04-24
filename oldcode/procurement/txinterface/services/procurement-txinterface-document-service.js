/**
 * Created by reimer on 15.09.2016.
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
	angular.module(moduleName).factory('procurementTxInterfaceDocumentService', [
		'$q',
		'$http',
		function ($q, $http) {

			var _data = null;      // cached object list

			var service = {};

			service.loadData = function(prcHeaderFks) {

				var deffered = $q.defer();

				// $http.post(globals.webApiBaseUrl + 'procurement/common/prcdocument/listbyids?PrcHeaderFks=' + prcHeaderFks)
				$http.post(globals.webApiBaseUrl + 'procurement/common/prcdocument/listbyids', prcHeaderFks)
					.then(function (response) {
						_data = response.data;
						deffered.resolve();
					});

				return deffered.promise;
			};

			service.getList = function() {
				return _data;
			};

			return service;

		}
	]);
})(angular);
