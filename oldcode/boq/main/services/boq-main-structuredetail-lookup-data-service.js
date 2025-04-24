/**
 * Created by xia on 4/13/2018.
 */
(function () {
	/* global globals */
	'use strict';

	angular.module('boq.main').factory('boqMainStructureDetailLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {

			var boqMainStructureDetailLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getboqstructuredetails4boqheader'},
				filterParam: 'boqHeaderId',
				prepareFilter: function prepareFilter(boqHeaderId) {
					return '?headerId=' + boqHeaderId;
				}
			};

			return platformLookupDataServiceFactory.createInstance(boqMainStructureDetailLookupDataServiceConfig).service;
		}]);
})();