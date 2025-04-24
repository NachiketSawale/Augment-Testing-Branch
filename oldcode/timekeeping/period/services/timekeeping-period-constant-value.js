/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingPeriodConstantValues provides definitions and constants frequently used in timekeeping period module
	 */
	angular.module(moduleName).value('timekeepingPeriodConstantValues', {
		schemes: {
			period: {typeName: 'PeriodDto', moduleSubModule: 'Timekeeping.Period'},
			transaction: {typeName: 'TimekeepingTransactionDto', moduleSubModule: 'Timekeeping.Period'},
			validation: {typeName: 'TimekeepingValidationDto', moduleSubModule: 'Timekeeping.Period'}
		},
		uuid: {
			container: {
				periodList: '7d9965a4006c4a9fac97f8514baf6b4d',
				periodDetails: '670b62e97f124e208db778cb7135220a',
				transactionList: '940ef410ba484efb97058e0dd40486c1',
				transactionDetails: '5dbfeadb546b43bc96e46f11201fd918',
				validationList: 'c1f889062e564495853240e4d8f8b5e2',
				validationDetails: '6ac2eb988f484ca4aa848f27064929c5'
			}
		},
		consolidationLevelValues: [
			{Id: 1, description$tr$: 'timekeeping.period.consolidationLevel.none'},
			{Id: 2, description$tr$: 'timekeeping.period.consolidationLevel.dayEmployeeCoding'},
			{Id: 3, description$tr$: 'timekeeping.period.consolidationLevel.employeeCoding'},
			{Id: 4, description$tr$: 'timekeeping.period.consolidationLevel.periodCoding'},
			{Id: 5, description$tr$: 'timekeeping.period.consolidationLevel.periodActivityCoding'}]
	});
})(angular);
