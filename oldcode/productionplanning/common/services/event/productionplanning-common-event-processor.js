/**
 * Created by anl on 3/30/2017.
 */
(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.common';
	/**
	 * @ngdoc service
	 * @name productionplanningCommonEventProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningCommonEventProcessor is the service to process data in main entity
	 *
	 */
	angular.module(moduleName).factory('productionplanningCommonEventProcessor', ProductionplanningCommonEventProcessor);

	ProductionplanningCommonEventProcessor.$inject = ['platformRuntimeDataService'];

	function ProductionplanningCommonEventProcessor(platformRuntimeDataService) {
		const service = {};

		service.processItem = function processItem(item, config) {
			if (config.parentService.getServiceName() === 'productionplanningItemDataService'
				|| config.parentService.getServiceName() === 'productionplanningItemSubItemDataService') {
				if (item.HasWriteRight) {
					const PUService = config.parentService;
					const selectedUnit = PUService.getSelected();
					// const keys = _.keys(item);

					if (selectedUnit !== null) {
						item.Belonging = item.ItemFk !== selectedUnit.Id ? 'parentUnit' : 'currentUnit';
						// Disable following code for the ticket #119888.(by zwz 2021/08/10)
						// Just disability not remove, in case following code will be reused in the future.
						// service.setColumnReadOnly(item, keys, item.ItemFk !== selectedUnit.Id);
					}
					service.setColumnReadOnly(item, ['Quantity', 'BasUomFk'], true);

					if(selectedUnit && selectedUnit.IsForPreliminary === true){
						platformRuntimeDataService.readonly(item, true);
					}
				} else {
					_.each(item, function (value, key) {
						service.setColumnReadOnly(item, [key], true);
					});
				}
			} else if (config.parentService.getServiceName() === 'productionplanningCommonProductItemDataService') {
				const selectParentItem = config.parentService.getSelected();

				if (selectParentItem !== null) {
					item.Belonging = item.ProductFk !== selectParentItem.Id ? 'parentUnit' : 'currentUnit';
				}
				if(config.parentFilterProperty === 'PpsProductFk'){
					_.each(item, function (value, key) {
						service.setColumnReadOnly(item, [key], true);
					});
				}
				service.setColumnReadOnly(item, ['Quantity', 'BasUomFk'], true);

				const grandparentSelectedItem = config.parentService.parentService()?.getSelected();
				if(grandparentSelectedItem && grandparentSelectedItem.IsForPreliminary === true){
					platformRuntimeDataService.readonly(item, true);
				}
			}

			let qty = item.Quantity;
			Object.defineProperty(item, 'Quantity', {
				get: function () {
					return qty;
				},
				set: function (newValue) {
					if(newValue < 0.01 || _.isNil(newValue)) {
						let a=0;
					}
					qty = newValue;
				}
			});
		};

		service.setColumnReadOnly = function setColumnReadOnly(item, columns, flag) {
			const fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			fields.push({field: 'DateshiftMode', readonly: item.Version > 0});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);