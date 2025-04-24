(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsStringConfigTableLookupDataService', ['basicsLookupdataConfigGenerator', 'basicsCustomizeStringColumnConfigDataService','$q',

		function (basicsLookupdataConfigGenerator, basicsCustomizeStringColumnConfigDataService, $q) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsStringConfigTableLookupDataService', {
				valMember: 'TableName',
				dispMember: 'TableName',
				columns: [
					{
						id: 'TableName',
						field: 'TableName',
						name: 'TableName',
						formatter: 'comment',
						width: 300,
						name$tr$: 'basics.customize.table'
					},
					{
						id: 'ModuleName',
						field: 'ModuleName',
						name: 'ModuleName',
						formatter: 'comment',
						width: 300,
						name$tr$: 'basics.customize.entityModule'
					}
				],
				uuid: '4d702d4982b14a75904bb7549a880b81'
			});

			var service = {
				getList: function getList() {
					return basicsCustomizeStringColumnConfigDataService.getTables();
				},
				getItemById: function getItemById(id) {
					return basicsCustomizeStringColumnConfigDataService.getTableById(id);
				},
				getItemByIdAsync: function getItemByIdAsync(id) {
					return basicsCustomizeStringColumnConfigDataService.getTableByIdAsync(id);
				},
				getLookupData: function getLookupData(options) {
					return basicsCustomizeStringColumnConfigDataService.getTableLookupData(options);
				},
				setFilter: function setFilter(filterFunc) {
					basicsCustomizeStringColumnConfigDataService.setTableFilter(filterFunc);
				},
				resetCache: function getLookupData(options) {
					return basicsCustomizeStringColumnConfigDataService.getTableLookupData(options);
				}
			};

			return service;
		}]);
})(angular);
