/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutConditionConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingLayoutConditionConstantValues provides definitions and constants frequently used in timekeeping layout module
	 */
	angular.module(moduleName).value('timekeepingLayoutConstantValues', {
		schemes: {
			inputPhase: {typeName: 'InputPhaseDto', moduleSubModule: 'Timekeeping.Layout'},
			inputPhaseGroup: {typeName: 'InputPhaseGroupDto', moduleSubModule: 'Timekeeping.Layout'},
			inputPhaseTimeSymbol: {typeName: 'InputPhase2TimeSymbolDto', moduleSubModule: 'Timekeeping.Layout'},
			userInterfaceLayout: {typeName: 'UserInterfaceLayoutDto', moduleSubModule: 'Timekeeping.Layout'}
		},
		uuid: {
			container: {
				inputPhaseList: 'bb17574b8bdb4c969bc7f13f78e2ba3c',
				inputPhaseDetails: 'c437bd6038b0485ea206aac36172ee2f',
				inputPhaseGroupList: 'c56ac5f039ec4cc7a911e9d22953a815',
				inputPhaseGroupDetails: 'dc9c2426a7d442bb9dd7eb343773cad9',
				inputPhaseTimeSymbolList: '784c48ec472d4dd6bee47b2b6d5a83b6',
				inputPhaseTimeSymbolDetails: '160bc67764a443cea4bcbba1ff6b0cd8',
				userInterfaceLayoutList: 'af8a45a50e3f467ab563336623d14c3c',
				userInterfaceLayoutDetails: '0f43a4ef30aa4686ab0bf5d5ad256f4b'
			}
		}
	});
})(angular);
