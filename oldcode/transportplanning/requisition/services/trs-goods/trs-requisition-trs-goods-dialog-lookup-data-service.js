/**
 * Created by lav on 02/24/2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingDialogLookupDataService
	 * @function
	 *
	 * @description
	 * trsRequisitionTrsGoodsDialogLookupDataService is the data service for drawing look ups
	 */
	angular.module('logistic.job').factory('trsRequisitionTrsGoodsDialogLookupDataService', Service);
	Service.$inject = ['lookupFilterDialogDataService'];
	function Service(lookupFilterDialogDataService) {
		var config = {};
		return lookupFilterDialogDataService.createInstance(config);
	}

})(angular);
