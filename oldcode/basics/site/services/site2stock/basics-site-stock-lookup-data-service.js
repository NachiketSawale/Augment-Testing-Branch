
(function (angular) {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).service('basicsSiteStockLookupDialogDataService', ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator',
		function (filterLookupDataService, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsSiteStockLookupDialogDataService', {
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
					field: 'Description',
					name: 'Description',
					formatter: 'translation',
					width: 300,
					name$tr$: 'cloud.common.entityDescription'
				}],
				uuid: '514c535ed0b74ef3bff7d0acb69d1e26'
			});

			var options = {};

			return filterLookupDataService.createInstance(options);
		}]);

})(angular);