/**
 * Created by shen on 7/14/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplierItemReadonlyProcessor
	 * @description provides validation methods for logistic job readonly entities
	 */
	angular.module(moduleName).service('logisticPlantSupplierItemReadonlyProcessor', LogisticPlantSupplierItemReadonlyProcessor);

	LogisticPlantSupplierItemReadonlyProcessor.$inject = ['_', 'platformRuntimeDataService'];

	function LogisticPlantSupplierItemReadonlyProcessor(_, platformRuntimeDataService) {
		var self = this;

		self.processItem = function (item) {
			if (item.IsReadOnly) {
				platformRuntimeDataService.readonly(item, true);
			} else {
				var fields = [
					{
						field: 'MaterialFk',
						readonly: _.isNil(item.JobFk) || item.JobFk === 0
					},{
						field: 'Quantity',
						readonly: _.isNil(item.JobFk) || item.JobFk === 0
					},{
						field: 'PlantFk',
						readonly: true
					}
				];

				platformRuntimeDataService.readonly(item, fields);
				if(item.IsStatusReadOnly){
					platformRuntimeDataService.readonly(item, true);
				}
			}
		};
	}
})(angular);
