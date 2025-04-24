/**
 * Created by baf on 13.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('logisticDispatchingRecordProcessorService', LogisticDispatchingRecordProcessorService);

	LogisticDispatchingRecordProcessorService.$inject = ['_', 'platformRuntimeDataService', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderDataService', 'logisticDispatchingCommonLookupDataService'];

	function LogisticDispatchingRecordProcessorService(_, platformRuntimeDataService, logisticDispatchingConstantValues, logisticDispatchingHeaderDataService, logisticDispatchingCommonLookupDataService) {
		var self = this;

		self.processItem = function processItem(item) {
			var pricesAreReadOnlyForCurrentItem = getPricesReadOnlyConfig(item);
			platformRuntimeDataService.readonly(item, [
				{field: 'Quantity', readonly: evaluateReadonlyForQuantity(item)},
				{
					field: 'WorkOperationTypeFk',
					readonly: item.RecordTypeFk !== logisticDispatchingConstantValues.record.type.plant
				},
				{
					field: 'StockTransactionTypeFk',
					readonly: item.RecordTypeFk !== logisticDispatchingConstantValues.record.type.material
				},
				{
					field: 'StockReceivingTransactionTypeFk',
					readonly: item.RecordTypeFk !== logisticDispatchingConstantValues.record.type.material
				},
				{field: 'StockLocationReceivingFk', readonly: item.StockReceivingFk === null},
				{
					field: 'PrjStockLocationFk',
					readonly: item.PrjStockFk === null || item.RecordTypeFk !== logisticDispatchingConstantValues.record.type.material
				},
				{
					field: 'PrjStockFk',
					readonly: item.RecordTypeFk !== logisticDispatchingConstantValues.record.type.material
				},
				{
					field: 'Price',
					readonly: item.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant ||
						item.RecordTypeFk === logisticDispatchingConstantValues.record.type.sundryService ||
						(item.RecordTypeFk === logisticDispatchingConstantValues.record.type.material && !_.isNil(item.PrjStockFk))
				},
				{
					field: 'PriceOc',
					readonly: item.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant ||
						item.RecordTypeFk === logisticDispatchingConstantValues.record.type.sundryService ||
						(item.RecordTypeFk === logisticDispatchingConstantValues.record.type.material && !_.isNil(item.PrjStockFk))
				},
				{
					field: 'PricePortion01',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortion02',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortion03',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortion04',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortion05',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortion06',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'pricePortionsOc',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortionOc01',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortionOc02',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortionOc03',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortionOc04',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortionOc05',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PricePortionOc06',
					readonly: pricesAreReadOnlyForCurrentItem
				},
				{
					field: 'PlantComponentFk',
					readonly: !logisticDispatchingConstantValues.record.type.plant || !item.PlantFk
				},
				{
					field: 'UoMFk',
					readonly: logisticDispatchingConstantValues.record.type.material !== item.RecordTypeFk
				},
				{
					field: 'DangerQuantity',
					readonly: evaluateReadonlyForDangerQuantity(item)
				},
				{
					field: 'PricePortionPre01',
					readonly: true
				},
				{
					field: 'PricePortionPre02',
					readonly: true
				},
				{
					field: 'PricePortionPre03',
					readonly: true
				},
				{
					field: 'PricePortionPre04',
					readonly: true
				},
				{
					field: 'PricePortionPre05',
					readonly: true
				},
				{
					field: 'PricePortionPre06',
					readonly: true
				},
				{
					field: 'PricePortionPreOc01',
					readonly: true
				},
				{
					field: 'PricePortionPreOc02',
					readonly: true
				},
				{
					field: 'PricePortionPreOc03',
					readonly: true
				},
				{
					field: 'PricePortionPreOc04',
					readonly: true
				},
				{
					field: 'PricePortionPreOc05',
					readonly: true
				},
				{
					field: 'PricePortionPreOc06',
					readonly: true
				},
				{
					field: 'PriceTotalPreOc',
					readonly: true
				},
				{
					field: 'PricePreOc',
					readonly: true
				},
				{
					field: 'PricePre',
					readonly: true
				},
				{
					field: 'PriceTotalPre',
					readonly: true
				},
				{
					field: 'PrecalculatedWorkOperationTypeFk',
					readonly: !item.IsBulkPlant
				},
				{
					field: 'ProjectChangeFk',
					readonly: item.RequisitionFk !== null || item.ReservationFk !== null,
				},
				{
					field: 'PricingGroupFk',
					readonly: item.RecordTypeFk !== logisticDispatchingConstantValues.record.type.plant,
				},
			]);
		};

		function evaluateReadonlyForQuantity(item) {
			var readonly = true;
			if (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.material || (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.sundryService)) {
				readonly = false;
			} else if (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant && (item.IsBulkPlant || (!item.WorkOperationIsHire && !item.WorkOperationIsMinor))) {
				readonly = false;
			} else if (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.resource) {
				readonly = false;
			}
			return readonly;
		}

		function getPricesReadOnlyConfig(item) {
			var readOnly = false;

			if (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.sundryService) {
				readOnly = !item.IsManual;
			} else if (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.plant) {
				readOnly = !item.IsManual;
			} else if (item.RecordTypeFk === logisticDispatchingConstantValues.record.type.material) {
				readOnly = true;
			}
			if(item.IsBulkPlant){
				readOnly = true;
			}
			return readOnly;
		}

		function evaluateReadonlyForDangerQuantity(item) {
			var readonly = false;
			var packageTypeIdsWithIsFreeCapacity = logisticDispatchingCommonLookupDataService.getPackageTypeIdsWithIsFreeCapacity();
			if (packageTypeIdsWithIsFreeCapacity.length > 0 && item && item.PackageTypeFk) {
				readonly = !_.some(packageTypeIdsWithIsFreeCapacity, function (id) {
					return id === item.PackageTypeFk;
				});
			}
			return readonly;
		}
	}
})(angular);
