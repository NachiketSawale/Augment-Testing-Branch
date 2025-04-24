/**
 * Created by bh on 14.07.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqLineTypeLookupDataService
	 * @function
	 *
	 * @description
	 * boqLineTypeLookupDataService is the data service for boq line type look ups
	 */
	angular.module('basics.lookupdata').factory('boqLineTypeLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqLineTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '05a552d28d0b476d8d7d53741f9c5450'
			});

			var boqLineTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/main/type/', endPointRead: 'getboqlinetypesforcurrenttype'},
				filterParam: 'currentLineTypeAndBoqHeader',
				prepareFilter: function(item) {
					return '?lineTypeId=' + item.BoqLineTypeFk + '&boqHeaderId=' + item.BoqHeaderFk;
				}
			};

			return platformLookupDataServiceFactory.createInstance(boqLineTypeLookupDataServiceConfig).service;
		}]);
})(angular);
