(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsStringConfigModuleLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'basicsCustomizeStringColumnConfigDataService',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, basicsCustomizeStringColumnConfigDataService) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsStringConfigModuleLookupDataService', {
				valMember: 'ModuleName',
				dispMember: 'ModuleName',
				columns: [
					{
						id: 'ModuleName',
						field: 'ModuleName',
						name: 'ModuleName',
						formatter: 'comment',
						width: 300,
						name$tr$: 'basics.customize.entityModule'
					}
				],
				uuid: '2a22d10562d440b09227e2394fe1ccc3'
			});


			var service = {
				getList: function getList() {
					return basicsCustomizeStringColumnConfigDataService.getModules();
				},
				getItemById: function getItemById(id) {
					return basicsCustomizeStringColumnConfigDataService.getModuleById(id);
				},
				getItemByIdAsync: function getItemByIdAsync(id) {
					return basicsCustomizeStringColumnConfigDataService.getModuleByIdAsync(id);
				},
				getLookupData: function getLookupData(options) {
					return basicsCustomizeStringColumnConfigDataService.getModuleLookupData(options);
				},
				setFilter: function setFilter(filterFunc) {
					basicsCustomizeStringColumnConfigDataService.setModuleFilter(filterFunc);
				},
				resetCache: function getLookupData(options) {
					return basicsCustomizeStringColumnConfigDataService.getModuleLookupData(options);
				}
			};

			return service;
		}]);
})(angular);
