/**
 * Created by Chisom on 17.08.2019.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name controllingActualsCompanyYearLookupDataService
     * @function
     *
     * @description
     * controllingActualsCompanyYearLookupDataService is the data service for all company year related functionality.
     */
	angular.module('basics.lookupdata')
		.factory('controllingActualsCompanyYearLookupDataService',
			['platformLookupDataServiceFactory',  'basicsLookupdataConfigGenerator',

				function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

					basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingActualsCompanyYearLookupDataService', {
						valMember: 'Id',
						dispMember: 'TradingYear',
						uuid: 'da794b30be1548aebb157f8965f87071',
						columns:[
							{
								id: 'TradingYear',
								field: 'TradingYear',
								name: 'Trading Year',
								width: 80,
								name$tr$: 'basics.company.entityTradingYear'
							},
							{
								id: 'StartDate',
								field: 'StartDate',
								name: 'Start Date',
								formatter: 'dateutc',
								width: 80,
								name$tr$: 'basics.company.entityStartDate'
							},
							{
								id: 'EndDate',
								field: 'EndDate',
								name: 'End Date',
								formatter: 'dateutc',
								width: 80,
								name$tr$: 'basics.company.entityEndDate'
							}
						],
					});

					var companyYearLookupDataServiceConfig = {
						httpRead: {route: globals.webApiBaseUrl + 'basics/company/year/', endPointRead: 'listbycompanyid'},
						filterParam: 'companyFk',
						prepareFilter: function(item)
						{
							return '?companyId=' + item.CompanyFk;
						}
					};

					return platformLookupDataServiceFactory.createInstance(companyYearLookupDataServiceConfig).service;
				}]);
})(angular);
