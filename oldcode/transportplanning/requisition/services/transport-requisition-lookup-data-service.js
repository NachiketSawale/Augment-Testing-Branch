/**
 * Created by anl on 2/18/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('transportplanningRequisitionLookupDataService', TrsRequisitionLookupDataService);

	TrsRequisitionLookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function TrsRequisitionLookupDataService(filterLookupDataService, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningRequisitionLookupDataService', {
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
			uuid: 'b33282f0f2b3400e8accafdfe9c9705b'
		});

		var options = {};

		return filterLookupDataService.createInstance(options);
	}
})(angular);