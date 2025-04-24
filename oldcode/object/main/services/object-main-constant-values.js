/**
 * Created by baf on 07.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainConditionConstantValues
	 * @function
	 *
	 * @description
	 * objectMainConditionConstantValues provides definitions and constants frequently used in object main module
	 */
	angular.module(moduleName).value('objectMainConstantValues', {
		schemes: {
			unitInstallment: { typeName: 'UnitInstallmentDto', moduleSubModule: 'Object.Main' }
		},
		uuid: {
			container: {
				unitInstallmentList: '47048c5b099c46288cb3d85b3c656f8f',
				unitInstallmentDetails: '97d3218a1f574c0491a3a917064ac912'
			}
		},
		rubricId: 83
	});
})(angular);
