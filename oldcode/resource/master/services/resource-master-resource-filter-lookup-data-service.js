/**
 * Created by leo on 17.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceMasterResourceFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceMasterResourceFilterLookupDataService is the data service for resource look ups
	 */
	angular.module('resource.master').service('resourceMasterResourceFilterLookupDataService', ResourceMasterResourceFilterLookupDataService);

	ResourceMasterResourceFilterLookupDataService.$inject = ['lookupFilterDialogDataService', 'basicsLookupdataConfigGenerator'];

	function ResourceMasterResourceFilterLookupDataService(filterLookupDataService, basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceMasterResourceFilterLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			showIcon:true,
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
					formatter: 'description',
					width: 300,
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			uuid: '263985e9a0b1430a941d663e19e939ee'
		});

		var options = {
/*
			httpRoute: 'resource/master/resource/',
			endPointRead: 'lookuplistbyfilter',
			filterParam: {siteFk: null, kindFk: null}
*/
		};

		return filterLookupDataService.createInstance(options);
	}
})(angular);