(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsStringConfigColumnDataService', ['$q', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'basicsCustomizeStringColumnConfigDataService',

		function ($q, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, basicsCustomizeStringColumnConfigDataService) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsStringConfigColumnDataService', {
				valMember: 'ColumnName',
				dispMember: 'ColumnName',
				columns: [
					{
						id: 'ColumnName',
						field: 'ColumnName',
						name: 'ColumnName',
						formatter: 'comment',
						width: 300,
						name$tr$: 'basics.customize.column'
					},
					{
						id: 'TableName',
						field: 'TableName',
						name: 'TableName',
						formatter: 'comment',
						width: 300,
						name$tr$: 'basics.customize.table'
					}
				],
				uuid: '26445d65c7a64c88b3877b29502a3d7f'
			});


			var service = {
				getList: function getList() {
					return basicsCustomizeStringColumnConfigDataService.getColumns();
				},
				getItemById: function getItemById(id) {
					return basicsCustomizeStringColumnConfigDataService.getColumnById(id);
				},
				getItemByIdAsync: function getItemByIdAsync(id) {
					return basicsCustomizeStringColumnConfigDataService.getColumnByIdAsync(id);
				},
				getLookupData : function getLookupData(options) {
					return basicsCustomizeStringColumnConfigDataService.getColumnLookupData(options);
				},
				setFilter: function setFilter(filterFunc) {
					basicsCustomizeStringColumnConfigDataService.setColumnFilter(filterFunc);
				},
				resetCache: function setFilter(options) {
					return basicsCustomizeStringColumnConfigDataService.getColumnLookupData(options);
				}
			};

			return service;
		}]);
})(angular);
