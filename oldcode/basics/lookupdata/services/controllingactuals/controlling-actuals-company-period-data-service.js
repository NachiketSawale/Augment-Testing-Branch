/**
 * Created by Chisom on 06.09.2019.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name controllingActualsCompanyPeriodLookupDataService
     * @function
     *
     * @description
     * controllingActualsCompanyPeriodLookupDataService is the data service for all company year related functionality.
     */
	angular.module('basics.lookupdata')
		.factory('controllingActualsCompanyPeriodLookupDataService',
			['platformLookupDataServiceFactory',  'basicsLookupdataConfigGenerator',

				function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

					basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingActualsCompanyPeriodLookupDataService', {
						valMember: 'Id',
						dispMember: 'TradingPeriod',

						columns:[
							{
								id: 'TradingPeriod',
								field: 'TradingPeriod',
								name: 'Trading Period',
								width: 80,
								name$tr$: 'controlling.actuals.entityTradingPeriod'
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
						uuid: 'b179f0c4695940da8c88802122ce5a04'
					});

					var companyPeriodLookupDataServiceConfig = {
						httpRead: {route: globals.webApiBaseUrl + 'basics/company/periods/', endPointRead: 'list'},
						filterParam: 'companyYearFk',
						prepareFilter: function(item)
						{
							return '?mainItemId=' + item.CompanyYearFk;
						}
					};

					return platformLookupDataServiceFactory.createInstance(companyPeriodLookupDataServiceConfig).service;
				}]);
})(angular);
