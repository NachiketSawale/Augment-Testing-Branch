/**
 * Created by anl on 5/28/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).service('productionplanningActivityLookupNewDataService', ResourceMasterResourceFilterLookupDataService);

	ResourceMasterResourceFilterLookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function ResourceMasterResourceFilterLookupDataService(filterLookupDataService, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningActivityLookupNewDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			columns: [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					width: 50,
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					formatter: 'translation',
					width: 300,
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			uuid: '9efdbc43fa7f49ffb4216b792ad8763c'
		});

		var options = {};

		return filterLookupDataService.createInstance(options);
	}
})(angular);