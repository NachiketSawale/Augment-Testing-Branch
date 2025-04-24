/**
 * Created by baf on 25.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceConstantValues
	 * @function
	 *
	 * @description
	 * logisticSundryServiceConstantValues provides definitions and constants frequently used in logistic sundryservice module
	 */
	angular.module(moduleName).value('logisticSundryServiceConstantValues', {
		schemes: {
			sundryService: {typeName: 'SundryServiceDto', moduleSubModule: 'Logistic.SundryService'},
			servicePriceList: {typeName: 'SundryServicePriceListDto', moduleSubModule: 'Logistic.SundryService'}
		},
		uuid: {
			container: {
				sundryServiceList: '3c3df5cc678f4ee4a2184555c39854c3',
				sundryServiceDetails: '3e8ef5f3b7c741f486e60dd2bb1c564c',
				servicePriceListList: '014f9eb6e9cc4d8089bf7b7e1173d677',
				servicePriceListDetails: '1f0839eeedb741cc9cbeb6f00266c6f8'
			}
		}
	});
})(angular);
