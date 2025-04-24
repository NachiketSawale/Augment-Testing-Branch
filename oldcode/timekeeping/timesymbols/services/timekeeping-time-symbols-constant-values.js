/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timesymbols';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingTimeSymbolsConditionConstantValues provides definitions and constants frequently used in timekeeping timeSymbols module
	 */
	angular.module(moduleName).value('timekeepingTimeSymbolsConstantValues', {
		schemes: {
			timeSymbol: {typeName: 'TimeSymbolDto', moduleSubModule: 'Timekeeping.TimeSymbols'},
			timeSymbolAccount: { typeName: 'TimeSymbolAccountDto', moduleSubModule: 'Timekeeping.TimeSymbols' },
			timeSymbol2Group: { typeName: 'TimeSymbol2GroupDto', moduleSubModule: 'Timekeeping.TimeSymbols' },
			timeMobileSymbol: { typeName: 'TimeMobileTimeSymbolDto', moduleSubModule: 'Timekeeping.MobileTimeSymbols' }
		},
		uuid: {
			container: {
				timeSymbolList: '4e5bc29fd0a3407b8f2e7c0c224b578c',
				timeSymbolDetails: '9d1103ff3dfb42ceae45f0991605761c',
				timeSymbolAccountList: 'f1f173225e0040d8bfd114c90f359e09',
				timeSymbolAccountDetails: '24979528559e40cf9cfcd22d9e7cc393',
				timeSymbol2GroupList: '535fb8d5c72e47d0b34bc50cf3d03798',
				timeSymbol2GroupDetail:'609d6bbd14914574b5e8e173548a2bde'
			}
		}
	});
})(angular);
