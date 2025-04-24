/**
 * Created by zwz on 2023/4/17.
 */
(function (angular) {
	'use strict';
	/* globals angular, _ */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsPlannedQuantityCommonUIService', CommonUIService);
	CommonUIService.$inject = ['$translate', 'ppsPlannedQuantityUIStandardService', 'ppsPlannedQuantityReadonlyUIService',
		'$q', 'platformGridAPI', 'platformRuntimeDataService'];

	function CommonUIService($translate, uiStandardService, ppsPlannedQuantityReadonlyUIService,
		$q, platformGridAPI, platformRuntimeDataService) {

		this.getPlannedQtyCommonColumns = (selectedPU, gridId) => {
			let originalColumns = ppsPlannedQuantityReadonlyUIService.getPlannedQtyReadOnlyColumns();

			return [
				{
					editor: 'decimal',
					field: 'AssigningQuantity',
					formatter: 'decimal',
					disallowNegative: true,
					validator: (item, value, field) => {
						if (selectedPU.Quantity > 0) {
							item.AssigningQuantityOneUnit = value / selectedPU.Quantity;
							// recalculate AssigningBillingQuantity and AssigningBillingQuantityPerProduct
							if (item.IsProportionalBill === true) {
								item.AssigningBillingQuantity = item.BillingQuantity * value / item.Quantity;
								item.AssigningBillingQuantityPerProduct = item.AssigningBillingQuantity / selectedPU.Quantity;
							}
						}

						return true;
					},
					id: 'assigningQuantity',
					width: 120,

					name: '*Assigning Quantity',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assigningQuantity'
				},
				{
					editor: null,
					field: 'AssignableQuantity',
					formatter: 'decimal',
					id: 'assignableQuantity',
					width: 150,

					name: '*Max Assignable Quantity',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assignableQuantity'
				},
				{
					editor: 'decimal',
					field: 'AssigningQuantityOneUnit',
					formatter: 'decimal',
					id: 'assigningQuantityOneUnit',
					width: 150,

					name: '*Assigned Quantity Per Unit',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assigningQuantityOneUnit',
					validator: (item, value, field) => {
						if (selectedPU.Quantity > 0) {
							item.AssigningQuantity = value * selectedPU.Quantity;
							// recalculate AssigningBillingQuantity and AssigningBillingQuantityPerProduct
							if (item.IsProportionalBill === true) {
								item.AssigningBillingQuantity = item.BillingQuantity * item.AssigningQuantity / item.Quantity;
								item.AssigningBillingQuantityPerProduct = item.AssigningBillingQuantity / selectedPU.Quantity;
							}
						}
						return true;
					},
				},
				{
					editor: null,
					field: 'AssignableQuantityOneUnit',
					formatter: 'decimal',
					id: 'assignableQuantityOneUnit',
					width: 170,

					name: '*Max Assignable Quantity Per Unit',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assignableQuantityOneUnit'
				},

				{
					id: 'isProportionalBill',
					field: 'IsProportionalBill',
					editor: 'boolean',
					formatter: 'boolean',
					validator: (item, value, field) => {
						// set readonly of columns AssigningBillingQuantity(Assigning Bill Quantity per PU) and AssigningBillingQuantityPerProduct(Assigning Bill Quantity per Product)
						platformRuntimeDataService.readonly(item, [{ field: 'AssigningBillingQuantity', readonly: !!value }, { field: 'AssigningBillingQuantityPerProduct', readonly: !!value }]);
						if(value === true && selectedPU.Quantity > 0){
							item.AssigningBillingQuantity = item.BillingQuantity * item.AssigningQuantity / item.Quantity;
							item.AssigningBillingQuantityPerProduct = item.AssigningBillingQuantity / selectedPU.Quantity;
						}

						return true;
					},
					width: 120,

					name: '*Proportional Bill',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.proportionalBill',
				},
				{
					id: 'assigningBillingQuantity',
					field: 'AssigningBillingQuantity',
					editor: 'decimal',
					formatter: 'decimal',
					width: 150,

					name: '*Assigning Bill Quantity per PU',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assigningBillingQuantity',
					validator: (item, value, field) => {
						// recalculate AssigningQuantityPerProduct when assigningBillingQuantity(Assigning Bill Quantity per PU) is changed.
						item.AssigningBillingQuantityPerProduct = selectedPU.Quantity > 0 ? value / selectedPU.Quantity : item.AssigningQuantityPerProduct;
						return true;
					},
				},
				{
					id: 'assignableBillingQuantity',
					field: 'AssignableBillingQuantity',
					formatter: 'decimal',
					editor: null, // it will make the column readonly
					width: 150,

					name: '*Max Assignable Bill Quantity Per PU',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assignableBillingQuantity'
				},
				{
					editor: 'decimal',
					field: 'AssigningBillingQuantityPerProduct',
					formatter: 'decimal',
					id: 'assigningBillingQuantityPerProduct',
					width: 150,

					name: '*Assigning Bill Quantity Per Product',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assigningBillingQuantityPerProduct',
					validator: (item, value, field) => {
						// recalculate assigningBillingQuantity when AssigningQuantityPerProduct is changed. Here value means AssigningBillingQuantityPerProduct
						item.AssigningBillingQuantity = selectedPU.Quantity > 0 ? value * selectedPU.Quantity : item.AssigningBillingQuantityPerPU;
						return true;
					},
				},
				{
					id: 'assignableBillingQuantityPerProduct',
					field: 'AssignableBillingQuantityPerProduct',
					formatter: 'decimal',
					editor: null, // it will make the column readonly
					width: 150,

					name: '*Max Assignable Bill Quantity Per Product',
					name$tr$: 'productionplanning.drawing.quantityAssignment.quantitySelection.assignableBillingQuantityPerProduct'
				},

			].concat(originalColumns);
		};
	}
})(angular);