(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurement.ticketsystem.procurementTicketsystemSearchDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide ticketsystem data
	 */
	angular.module('procurement.ticketsystem').factory('procurementTicketsystemSearchDataService',
		['basicsMaterialSearchServiceFactory','procurementTicketsystemCartDataService',
			function (basicsMaterialSearchServiceFactory,cartService) {

				var service = basicsMaterialSearchServiceFactory.create();
				// add service extend here:
				var search = service.search;
				service.search = function () {
					return search().then(
						function (res) {
							cartService.updateCarStatus(res.items,cartService.cartList);
						}
					);
				};
				return service;
			}]);
})(angular);