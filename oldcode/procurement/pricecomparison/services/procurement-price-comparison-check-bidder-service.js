(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonCheckBidderService', [
		'_',
		function (_) {
			const _constant = {
				baseBoqValue: -2,                    // Package Basics
				baseBoqKey: 'QuoteCol_-2_-2_-2',     // Package Basic
				targetValue: -1,                     // Requisition Basic
				targetKey: 'QuoteCol_-1_-1_-1',      // Requisition Basic
				TargetPriceValue: -4,                // Target
				TargetPriceKey: 'QuoteCol_-4_-4_-4', // Target
				MaterialValue: -5,                   // Catalogue Basic
				MaterialKey: 'QuoteCol_-5_-5_-5'     // Catalogue Basic
			};

			const _references = [
				_constant.targetKey,
				_constant.baseBoqKey,
				_constant.TargetPriceKey,
				_constant.MaterialKey,
				_constant.targetValue,
				_constant.baseBoqValue,
				_constant.TargetPriceValue,
				_constant.MaterialValue
			];

			const _baseService = {
				isBase: function (item) {
					return _constant.baseBoqKey === item || _constant.baseBoqValue === item;
				},
				isTarget: function (item) {
					return _constant.targetKey === item || _constant.targetValue === item;
				},
				isReference: function (item) {
					return _.includes(_references, item);
				},
				isNotReference: function (item) {
					return !this.isReference(item);
				},
				isIncludedTargetCalculationColumn: function (item) {
					return this.isTarget(item) || this.isNotReference(item);
				},
				isExcludedTargetCalculationColumn: function (item) {
					return this.isNotReference(item);
				},
				isTargetPrice: function (item) {
					return _constant.TargetPriceKey === item || _constant.TargetPriceValue === item;
				},
				isMaterialPrice: function (item) {
					return _constant.MaterialKey === item || _constant.MaterialValue === item;
				}
			};

			return _.extend({}, _baseService, {
				constant: _constant,
				boq: {
					isTarget: _baseService.isTarget,
					isBase: _baseService.isBase,
					isIncludedTargetCalculationColumn: _baseService.isIncludedTargetCalculationColumn,
					isExcludedTargetCalculationColumn: _baseService.isExcludedTargetCalculationColumn,
					isReference: _baseService.isReference,
					isNotReference: _baseService.isNotReference
				},
				item: {
					isTarget: _baseService.isTarget,
					isBase: _baseService.isBase,
					isTargetPrice: _baseService.isTargetPrice,
					isIncludedTargetCalculationColumn: _baseService.isIncludedTargetCalculationColumn,
					isExcludedTargetCalculationColumn: _baseService.isExcludedTargetCalculationColumn,
					isMaterialPrice: _baseService.isMaterialPrice,
					isReference: _baseService.isReference,
					isNotReference: _baseService.isNotReference
				}

			});
		}
	]);
})(angular);