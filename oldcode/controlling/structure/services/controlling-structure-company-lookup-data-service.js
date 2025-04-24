/**
 * Created by janas on 09.11.2020.
 */

(function (angular) {


	'use strict';

	// TODO: move or replace by more general lookup?
	/**
	 * @ngdoc service
	 * @name controllingStructureCompanyLookupDataService
	 * @function
	 *
	 * @description
	 * controllingStructureCompanyLookupDataService is the data service for company lookup in sales bid
	 */
	angular.module('controlling.structure').factory('controllingStructureCompanyLookupDataService',
		['globals', '_', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'ServiceDataProcessArraysExtension', 'basicsCompanyImageProcessor',
			function (globals, _, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, ServiceDataProcessArraysExtension, basicsCompanyImageProcessor) {
				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingStructureCompanyLookupDataService', {
					valMember: 'Id',
					dispMember: 'CompanyName',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'CompanyName',
							field: 'CompanyName',
							name: 'CompanyName',
							formatter: 'description',
							name$tr$: 'cloud.common.entityCompanyName'
						}
					],
					uuid: 'ac0f8f88195a4ce8aa275c97ade033f5'
				});

				var lookupDataServiceConfig = {
					httpRead: {route: globals.webApiBaseUrl + 'basics/company/', endPointRead: 'tree'},
					filterParam: 'startId', // 'companyId' // TODO:
					prepareFilter: function (filterObj) {
						if (_.isObject(filterObj)) {
							return '?includeStart=' + (filterObj.includeStart || 'true') + '&depth=' + (filterObj.depth || '7');
						} else {
							return '?&includeStart=true';
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
					tree: {parentProp: 'CompanyFk', childProp: 'Companies'}
				};

				return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
			}]);
})(angular);
