/**
 * Created by anl on 10/18/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonCharacteristicSimpleLookupDataService', CharacteristicSimpleLookup);

	CharacteristicSimpleLookup.$inject = ['basicsLookupdataConfigGenerator', 'platformLookupDataServiceFactory',
		'basicsLookupdataLookupFilterService'];

	function CharacteristicSimpleLookup(basicsLookupdataConfigGenerator, platformLookupDataServiceFactory,
		basicsLookupdataLookupFilterService) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsCommonCharacteristicSimpleLookupDataService', {
			valMember: 'Id',
			dispMember: 'DescriptionInfo.Description',
			columns: [
				{id: 'code', field: 'Code', name: 'Code', formatter: 'code', width: 80, name$tr$: 'cloud.common.entityCode'},
				{id: 'desc', field: 'DescriptionInfo.Description', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription'}
			],
			uuid: 'e8e76930e37f42478e26ebde8881fdee'
		});

		let characteristicSimpleLookupConfig = {
			lookupType: 'basicsCharacteristicCodeLookup',
			httpRead: {route: globals.webApiBaseUrl + 'basics/characteristic/characteristic/', endPointRead: 'getcharacteristicbysectionfk'},
			filterParam: 'sectionFk',
			prepareFilter: function (sectionId) {
				return '?sectionFk=' + sectionId;
			},
			// modifyLoadedData: function (items) {
			// }
			// selectableCallback: function select(dataItem, entity) {
			// }
		};

		let filters = [
			{
				key: 'basicsCharacteristicDataLookupFilter',
				serverSide: false,
				fn: function (item) {
					return item.CharacteristicTypeFk === 2 || item.CharacteristicTypeFk === 6;
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		return platformLookupDataServiceFactory.createInstance(characteristicSimpleLookupConfig).service;
	}
})(angular);