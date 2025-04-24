/* global globals */
/**
 * Created by sprotte on 09.06.2016.
 */
/**
 *
 * @ngdoc service
 * @name scheduling.main.schedulingMainChartprintLookupService
 * @function
 * @requires platformSchemaService
 *
 * @description
 * #ChartprintLookupService
 * Provides data for the chartprint property lookup control. The module needs to be loaded first before using this lookup.
 */
/* jshint -W072 */ // many parameters because of dependency injection
angular.module('scheduling.main').factory('schedulingMainChartprintLookupService', ['$q', '$injector', 'platformSchemaService', 'platformLookupDataServiceFactory',
	function ($q, $injector, schemaservice, servicefactory) {
		'use strict';
		var readData =  { PKey1: null };

		var service = servicefactory.createInstance({
			httpRead: { route: globals.webApiBaseUrl + 'basics/customize/chartprint/', endPointRead: 'list', usePostForRead: true },
			dataAlreadyLoaded: false,
			filterParam: readData,
			prepareFilter: function prepareFilter(item) {
				readData.PKey1 = item;
				return readData;
			}
		}).service;

		return service;
	}]);