/**
 * Created by shen on 7/13/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticJobCardRecordProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('logisticJobCardRecordProcessorService', LogisticJobCardRecordProcessorService);

	LogisticJobCardRecordProcessorService.$inject = ['_', 'platformRuntimeDataService', 'logisticCardConstantValues', 'logisticCardDataService'];

	function LogisticJobCardRecordProcessorService(_, platformRuntimeDataService, logisticCardConstantValues, logisticCardDataService) {
		let self = this;

		self.processItem = function processItem(item) {
			platformRuntimeDataService.readonly(item, [
				{field: 'Quantity', readonly: evaluateReadonlyForQuantity(item)},
				{
					field: 'WorkOperationTypeFk',
					readonly: item.JobCardRecordTypeFk !== logisticCardConstantValues.types.record.plant || !item.PlantFk
				},
				{
					field: 'EmployeeFk',
					readonly: item.JobCardRecordTypeFk !== logisticCardConstantValues.types.record.sundryService
				}
			]);
			logisticCardDataService.setEntityToReadonlyIfRootEntityIs(item);
		};

		function evaluateReadonlyForQuantity(item) {
			let readonly = true;
			if (item.JobCardRecordTypeFk === logisticCardConstantValues.types.record.material || (item.JobCardRecordTypeFk === logisticCardConstantValues.types.record.sundryService)) {
				readonly = false;
			} else if (item.JobCardRecordTypeFk === logisticCardConstantValues.types.record.plant && (item.IsBulkPlant || (!item.WorkOperationIsHire && !item.WorkOperationIsMinor))) {
				readonly = false;
			}
			return readonly;
		}

	}
})(angular);
