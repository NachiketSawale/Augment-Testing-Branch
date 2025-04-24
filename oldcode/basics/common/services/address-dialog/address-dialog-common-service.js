/**
 * Created by chi on 2018/4/3.
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonAddressDialogCommonService', basicsCommonAddressDialogCommonService);
	basicsCommonAddressDialogCommonService.$inject = ['basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService'];

	function basicsCommonAddressDialogCommonService(basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService) {

		let filters = [
			{
				key: 'address-dialog-state-filter',
				serverSide: true,
				fn: function (item) {
					if (item && recordState(item.CountryFk)) {
						return 'CountryFk=' + item.CountryFk;
					}
					return '1=2';
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		return {
			recordState: recordState
		};

		// //////////////////////
		function recordState(countyFk) {
			let items = basicsLookupdataLookupDescriptorService.getData('country');
			let item = items && items[countyFk];
			return item && item.Recordstate;
		}
	}
})(angular);