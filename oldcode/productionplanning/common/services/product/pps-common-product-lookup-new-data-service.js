/**
 * Created by anl on 5/15/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('productionplanningCommonProductLookupNewDataService', ResourceMasterResourceFilterLookupDataService);

	ResourceMasterResourceFilterLookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function ResourceMasterResourceFilterLookupDataService(filterLookupDataService, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningCommonProductLookupNewDataService', {
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
			uuid: '3b571b0732d94043b221cd84fef55363'
		});

		var options = {};

		return filterLookupDataService.createInstance(options);
	}
})(angular);