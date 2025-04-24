/**
 * Created by Cakiral on 19.08.2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsUnitCalendarLookupDataService
	 * @function
	 *
	 * @description
	 * basicsUnitCalendarLookupDataService is the data service providing data for unit-calendar look ups
	 */
	angular.module('basics.unit').factory('basicsUnitCalendarLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsUnitCalendarLookupDataService', {
				valMember: 'Id',
				dispMember: 'UnitInfo.Translated',
				columns: [
					{
						id: 'Unit',
						field: 'UnitInfo',
						name: 'Unit',
						formatter: 'translation',
						name$tr$: 'basics.unit.entityUnit'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '4b258702c29911e99cb52a2ae2dbcce4'
			});

			var locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/unit/',
					endPointRead: 'calendartypes'
				},
				selectableCallback: function (uomItem) {
					return uomItem.UomTypeFk >= 2 && uomItem.UomTypeFk <= 7;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
