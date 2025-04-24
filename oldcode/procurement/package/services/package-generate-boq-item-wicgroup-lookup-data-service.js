/**
 * Created by clv on 10/18/2017.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular, globals */

	var modulename = 'procurement.package';
	angular.module(modulename).factory('packageGenerateBoqItemWicGroupLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

			var packageGenerateBoqItemWicGroupLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/wic/group/', endPointRead: 'lookupbypackageid'},
				filterParam: 'packageId',
				prepareFilter: function(pkId){
					return '?packageId='+pkId;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['group'])],
				tree: {parentProp: 'WicGroupFk', childProp: 'WicGroups'}
			};

			return platformLookupDataServiceFactory.createInstance(packageGenerateBoqItemWicGroupLookupDataServiceConfig).service;
		}]);
})();