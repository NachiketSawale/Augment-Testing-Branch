(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqUomLookupDataService
	 * @function
	 *
	 * @description
	 * boqUomLookupDataService is the data service providing data for uom look ups
	 */
	angular.module('basics.lookupdata').factory('boqUomLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, injector) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqUomLookupDataService', {
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
				uuid: '129666ffa48346b3aa0470185f227191'
			});


			var uomLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getuoms'},
				filterParam: 'currentBoqHeader',
				prepareFilter: function (currentBoqHeader) {
					var headerID = currentBoqHeader ? currentBoqHeader.BoqHeaderId : injector.get('boqMainService').getSelected().BoqHeaderFk;
					if(!headerID){
						headerID=0;
					}
					return '?boqHeaderId=' + headerID;
				},
				showFilteredData: true,
				filterOnLoadFn: function (uomItem) {
					return uomItem.IsLive;
				},
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
				}
			};

			return platformLookupDataServiceFactory.createInstance(uomLookupDataServiceConfig).service;
		}]);
})(angular);
