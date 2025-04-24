/**
 * Created by reimer on 14.09.2016.
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
	angular.module(moduleName).factory('procurementTxInterfaceBidderService', [
		'$q',
		'$http',
		function ($q, $http) {

			var _data = null;      // cached object list

			var service = {};

			service.loadData = function(rfqHeaderFk) {

				var deffered = $q.defer();

				var param =  {};
				param.filter = '';
				param.Value = rfqHeaderFk;

				$http.post(globals.webApiBaseUrl + 'procurement/rfq/businesspartner/list', param)
					.then(function (response) {
						_data = [];
						angular.forEach(response.data.Main, function (item) {
							if (item.PrcCommunicationChannelFk === 4) {
								_data.push(item.BusinessPartnerFk);
							}
						});
						deffered.resolve();
					});

				return deffered.promise;
			};
			
			service.getIdsWithCommunicationChannel4 = function() {
				return _data;
			};


			return service;

		}
	]);
})(angular);
