/**
 * Created by Chisom on 06.09.2019.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name controllingActualsLookupDataService
     * @function
     *
     * @description
     * controllingActualsLookupDataService is the data service for all company year related functionality.
     */
	angular.module('basics.lookupdata')
		.factory('controllingActualsLookupDataService',
			['platformLookupDataServiceFactory',  'basicsLookupdataConfigGenerator',

				function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

					basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingActualsCompanyPeriodLookupDataService', {
						valMember: 'Id',
						dispMember: 'Code',

						columns:[
                        	{
                        		id: 'Code',
				                  field: 'Code',
				                  name: 'Code',
				                  formatter: 'code',
				                  width: '100',
				                  name$tr$: 'cloud.common.entityCode'
			                  },
							{
								id: 'CommentText',
								field: 'CommentText',
								name: 'Comment',
								formatter: 'comment',
								width: 80,
								name$tr$: 'cloud.common.entityComment'
							}
						],
						uuid: '69c0b45028d34f8d8b933978f551e6bb'
					});

					var companyActualLookupDataServiceConfig = {
						httpRead: {route: globals.webApiBaseUrl + 'controlling/actuals/costheader/', endPointRead: 'listbycompanyid'},
						filterParam: 'companyId'
					};

					return platformLookupDataServiceFactory.createInstance(companyActualLookupDataServiceConfig).service;
				}]);
})(angular);
