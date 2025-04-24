/**
 * Created by shen on 5/2/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.job';


	/**
	 * @ngdoc service
	 * @name logisticJobPlantLocation2ProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('logisticJobPlantLocation2ProcessorService', LogisticJobPlantLocation2ProcessorService);

	LogisticJobPlantLocation2ProcessorService.$inject = ['_', 'platformRuntimeDataService'];

	function LogisticJobPlantLocation2ProcessorService(_, platformRuntimeDataService) {
		let self = this;

		self.processItem = function processItem(item) {
			platformRuntimeDataService.hideContent(item, [
				'Quantity'
			],evaluateVisibleForQuantity(item));
		};

		function evaluateVisibleForQuantity(item) {
			let hide = false;
			if (item.PlantIsBulk && item.Quantity === 0) {
				hide = true;
			}
			return hide;
		}


	}
})(angular);
