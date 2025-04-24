/**
 * Created by jim on 2/13/2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonTotalDataService
	 * @function
	 * @requires procurementCommonDataServiceFactory,basicsCommonReadDataInterceptor, $q, procurementContractTotalHttpService
	 *
	 * description data service of total container
	 */
	angular.module('procurement.common').factory('procurementCommonItemQuantityValidationFlagService',
		[
			function () {

				return {
					itemId:null,
					validateOrNot:true,
					sellUnit:null,
					minQuantity:null
				};
			}
		]);

})(angular);
