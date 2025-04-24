/**
 * Created by Joshi on 11.05.2015.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estLineItemRefLookupDataService
	 * @function
	 *
	 * @description
	 * estLineItemRefLookupDataService is the data service for all line item reference related functionality.
	 */
	angular.module('estimate.main').factory('estLineItemRefLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			let estMainLineItemLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endPointRead: 'getlineitemslist'},
				filterParam: 'estHeaderFk'
			};
			return platformLookupDataServiceFactory.createInstance(estMainLineItemLookupDataServiceConfig).service;
		}]);
})(angular);
