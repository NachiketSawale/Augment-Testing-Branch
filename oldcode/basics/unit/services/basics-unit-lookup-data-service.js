/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsUnitLookupDataService
	 * @function
	 *
	 * @description
	 * basicsUnitLookupDataService is the data service providing data for unit look ups
	 */
	angular.module('basics.unit').factory('basicsUnitLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '_',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, _) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsUnitLookupDataService', {
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
				uuid: '01faa125dc93475d80a5407dd67e0ed7'
			});

			var locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/unit/',
					endPointRead: 'freetypes'
				},
				showFilteredData: true,
				resolveStringValueCallback: (value, options, service, entity, columnDef) => {
					return service.getFilteredList(options)
						.then((items) => {
							const lowercaseValue = value.toLowerCase();
							const item = _.find(items, item => item.Unit === value || item.UnitInfo.Translated === value) ||
								_.find(items, item => item.Unit.toLowerCase() === lowercaseValue || item.UnitInfo.Translated.toLowerCase() === lowercaseValue);

							if (item) {
								return {
									apply: true,
									valid: true,
									value: item.Id
								};
							}

							return {
								apply: true,
								valid: false,
								value: value,
								error: 'not found!'
							};
						});
				},
				filterOnLoadFn: function (uomItem) {
					return uomItem.IsLive;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
