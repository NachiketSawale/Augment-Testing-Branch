/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingSettlementConstantValues provides definitions and constants frequently used in timekeeping settlement module
	 */
	angular.module(moduleName).value('timekeepingSettlementConstantValues', {
		schemes: {
			settlement: {typeName: 'TimekeepingSettlementDto', moduleSubModule: 'Timekeeping.Settlement'},
			item: {typeName: 'TimekeepingSettlementItemDto', moduleSubModule: 'Timekeeping.Settlement'}
		},
		uuid: {
			container: {
				settlementList: '128de81cbbe945759306123364a20cb1',
				settlementDetails: '5608ca31f98343ee8fc34b832eabb893',
				itemList: '6f4303109d94448bb98e71852946e039',
				itemDetails: '643fbcea9f8a44df94c7483549af3ef0'
			}
		}
	});
})(angular);
