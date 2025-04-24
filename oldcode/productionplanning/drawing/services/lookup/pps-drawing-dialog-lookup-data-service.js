/**
 * Created by zwz on 10/15/2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingDialogLookupDataService
	 * @function
	 *
	 * @description
	 * productionplanningDrawingDialogLookupDataService is the data service for drawing look ups
	 */
	angular.module('logistic.job').factory('productionplanningDrawingDialogLookupDataService', Service);
	Service.$inject = ['lookupFilterDialogDataService'];
	function Service(lookupFilterDialogDataService) {
		var config = {};
		return lookupFilterDialogDataService.createInstance(config);
	}

})(angular);
