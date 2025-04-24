(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemLookupDataService', LookupDataService);

	LookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function LookupDataService(filterLookupDataService, lookupdataConfigGenerator) {
		lookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsItemLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			columns: [{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				formatter: 'code',
				width: 50,
				name$tr$: 'cloud.common.entityCode'
			}, {
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'translation',
				width: 300,
				name$tr$: 'cloud.common.entityDescription'
			}],
			uuid: 'be682d063cb240558004441b3844718f'
		});

		var options = {};

		return filterLookupDataService.createInstance(options);
	}
})(angular);