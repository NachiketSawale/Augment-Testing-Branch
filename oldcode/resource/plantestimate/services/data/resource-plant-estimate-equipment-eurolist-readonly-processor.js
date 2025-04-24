(function (angular) {
	'use strict';

	const moduleName = 'resource.plantestimate';

	angular.module(moduleName).service('resourcePlantEstimateEquipmentEurolistReadonlyProcessor', ResourcePlantEstimateEquipmentEurolistReadonlyProcessor);
	ResourcePlantEstimateEquipmentEurolistReadonlyProcessor.$inject = ['platformRuntimeDataService'];
	function ResourcePlantEstimateEquipmentEurolistReadonlyProcessor(platformRuntimeDataService ) {
		const fields = [
			{ field: 'Code', readonly: true},
			{ field: 'Description', readonly: true},
			{ field: 'CatalogRecordLowerFk', readonly: true},
			{ field: 'CatalogRecordUpperFk', readonly: true},
			{ field: 'DepreciationLowerFrom', readonly: true},
			{ field: 'DepreciationLowerTo', readonly: true},
			{ field: 'DepreciationUpperFrom', readonly: true},
			{ field: 'DepreciationUpperTo', readonly: true},
			{ field: 'DepreciationPercentFrom', readonly: true},
			{ field: 'DepreciationPercentTo', readonly: true},
			{ field: 'Depreciation', readonly: true},
			{ field: 'RepairUpper', readonly: true},
			{ field: 'RepairLower', readonly: true},
			{ field: 'RepairPercent', readonly: true},
			{ field: 'RepairCalculated', readonly: true},
			{ field: 'ReinstallmentLower', readonly: true},
			{ field: 'ReinstallmentUpper', readonly: true},
			{ field: 'ReinstallmentCalculated', readonly: true},
			{ field: 'PriceIndexCalc', readonly: true},
			{ field: 'PriceIndexLower', readonly: true},
			{ field: 'PriceIndexUpper', readonly: true},
			{ field: 'IsExtrapolated', readonly: true},
			{ field: 'IsInterpolated', readonly: true}
		];

		this.processItem = function processItem(plantEuroList) {
			platformRuntimeDataService.readonly(plantEuroList, fields);
		};
	}
})(angular);