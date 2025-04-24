/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'basics.costcodes';

	/* global globals */

	/**
	 * @ngdoc service
	 * @name basicsCostCodesLookupService
	 * @function
	 *
	 * @description
	 * basicsCostCodesLookupService provides all lookup data for costcodes module
	 */
	angular.module(moduleName).factory('basicsCostCodesLookupService', ['$http', 'basicsLookupdataLookupDescriptorService', function ($http, basicsLookupdataLookupDescriptorService) {

		// Object presenting the service
		let service = {};

		// private code
		let costCodeTypes = [];

		// get list of cost code types
		service.getCostCodeTypes = function () {
			return costCodeTypes;
		};

		// costcodes service calls
		service.loadLookupData = function(){
			basicsLookupdataLookupDescriptorService.loadData(['prcstructure']);

			$http.get(globals.webApiBaseUrl + 'basics/costcodes/getcostcodetype'
			).then(function(response) {
				costCodeTypes = response.data.CostCodeType;
			}
			);
		};
		
		service.loadCostCodeTypeAsync = function loadCostCodeTypeAsync() {
			return $http.get(globals.webApiBaseUrl + 'basics/costcodes/getcostcodetype');
		};

		// General stuff
		service.reload = function(){
			service.loadLookupData();
		};

		// Load the costcodes lookup data
		service.loadLookupData();

		return service;
	}]);
})();
