(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	angular.module(moduleName).factory('ppsProductDescriptionLookupDataService', LookupDataService);

	LookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function LookupDataService(filterLookupDataService, lookupdataConfigGenerator) {
		lookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsProductDescriptionLookupDataService', {
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
			}
			],
			uuid: 'a44daa5f635a4ddaa34e815013735d61'
		});

		var options = {};

		return filterLookupDataService.createInstance(options);
	}
})(angular);