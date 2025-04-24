/**
 * Created by baf on 05.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupConstantValues
	 * @function
	 *
	 * @description
	 * logisticSundryServiceGroupConstantValues provides definitions and constants frequently used in logistic sundrygroup module
	 */
	angular.module(moduleName).value('logisticSundryServiceGroupConstantValues', {
		schemes: {
			group: {typeName: 'SundryServiceGroupDto', moduleSubModule: 'Logistic.SundryGroup'},
			account: {typeName: 'SundryServiceGroupAccountDto', moduleSubModule: 'Logistic.SundryGroup'},
			taxCode: {typeName: 'SundryGroupTaxCodeDto', moduleSubModule: 'Logistic.SundryGroup'}
		},
		uuid: {
			container: {
				groupList: 'c89773b5e5b342339203a99d29c07c09',
				groupDetails: '5702f80f88aa494db2bddec1d42c05d9',
				accountList: 'c2b21e2891ad4162aa6adebc111623d5',
				accountDetails: '6ffe2a8357dd4782b8d9abea6680326e',
				taxCodeList: '53ee04a365cc4110a06e44c00d39ddf9',
				taxCodeDetails: '0a1129006edb4425a610dd413a853a10'
			}
		}
	});
})(angular);
