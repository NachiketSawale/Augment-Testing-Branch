/**
 * Created by baf on 27.08.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobPlantAllocationValidationService
	 * @description provides validation methods for logistic job plantAllocation entities
	 */
	angular.module(moduleName).service('logisticJobPlantAllocationProcessor', LogisticJobPlantAllocationProcessor);

	LogisticJobPlantAllocationProcessor.$inject = ['platformRuntimeDataService'];

	function LogisticJobPlantAllocationProcessor(platformRuntimeDataService) {

		this.processItem = function processJobPlantAllocation(jpa) {
			platformRuntimeDataService.readonly(jpa, true);
		};
	}
})(angular);
