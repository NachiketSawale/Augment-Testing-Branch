/**
 * Created by shen on 7/13/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.card';
	/**
	 * @ngdoc service
	 * @name logisticJobCardTemplateRecordProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('logisticJobCardTemplateRecordProcessorService', LogisticJobCardTemplateRecordProcessorService);

	LogisticJobCardTemplateRecordProcessorService.$inject = ['_', 'platformRuntimeDataService', 'logisticCardTemplateConstantValues'];

	function LogisticJobCardTemplateRecordProcessorService(_, platformRuntimeDataService, logisticCardTemplateConstantValues) {
		let self = this;

		self.processItem = function processItem(item) {
			platformRuntimeDataService.readonly(item, [
				{field: 'Quantity', readonly: evaluateReadonlyForQuantity(item)}
			]);
		};

		function evaluateReadonlyForQuantity(item) {
			let readonly = true;
			if (item.JobCardRecordTypeFk === logisticCardTemplateConstantValues.type.material || (item.JobCardRecordTypeFk === logisticCardTemplateConstantValues.type.sundryService)) {
				readonly = false;
			} else if (item.JobCardRecordTypeFk === logisticCardTemplateConstantValues.type.plant && (item.IsBulkPlant || (!item.WorkOperationIsHire && !item.WorkOperationIsMinor))) {
				readonly = false;
			}
			return readonly;
		}

	}
})(angular);
