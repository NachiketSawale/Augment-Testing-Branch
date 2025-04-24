/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingTimeallocationConstantValues provides definitions and constants frequently used in timekeeping timeSymbols module
	 */
	angular.module(moduleName).value('timekeepingTimeallocationConstantValues', {
		schemes: {
			timeallocationheader: {typeName: 'TimeAllocationHeaderDto', moduleSubModule: 'Timekeeping.TimeAllocation'},
			timeallocationitem: {typeName: 'TimeAllocationDto', moduleSubModule: 'Timekeeping.TimeAllocation'}
		},
		uuid: {
			container: {
				timeAllocationHeaderList: 'ff09ff1314074aaf909b3e86c2d07c8c',
				timeAllocationHeaderDetails: '6ee25aa6370247a3bf908a58eeaa5e1d',
				timeAllocationItemList: 'a3b5c55c64f74de89c84f8265b8cef42',
				timeAllocationItemDetails: 'd9ef33f2b9c04d63b5218ce7aa7236d2'
			}
		},
		types:{
			employee: { id: 1, description: 'timekeeping.common.employee'},
			plant: { id: 2, description: 'resource.common.entityPlant'}
		}
	});
})(angular);
