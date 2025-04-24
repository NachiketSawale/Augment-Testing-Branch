(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	var template1 = '<div class="subview-content">' +
		'<div class="toolbar"><div data-platform-menu-list data-list="tools"  data-platform-refresh-on="[tools.version, tools.refreshVersion]"></div></div>' +
		'<div class="flex-box flex-column filler" ng-style="{height: divHeight ? divHeight : 250}"><platform-Grid data="gridData"></platform-Grid></div></div>';

	/**
	 * @ngdoc directive
	 * @name: procurementPriceComparisonItemSettingsColumn
	 * @description
	 * #
	 * a directive for item compare columns
	 */
	angular.module(moduleName).directive('procurementPriceComparisonSettingsColumn', [
		function () {
			return {
				restrict: 'A',
				scope: {
					divWidth: '=',
					divHeight: '=',
					customSetting: '='
				},
				template: template1,
				controller: 'procurementPriceComparisonColumnController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name: procurementPriceComparisonItemSettingsQuoteRow
	 * @description
	 * #
	 * a directive for item quote compare fields
	 */
	angular.module(moduleName).directive('procurementPriceComparisonSettingsQuoteRow', [
		function () {
			return {
				restrict: 'A',
				scope: {
					divWidth: '=',
					divHeight: '='
				},
				template: template1,
				controller: 'procurementPriceComparisonQuoteRowController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name: procurementPriceComparisonBillingSchemaSettingsQuoteRow
	 * @description
	 * #
	 * a directive for item quote compare fields
	 */
	angular.module(moduleName).directive('procurementPriceComparisonSettingsBillingSchemaRow', [
		'$translate',
		function ($translate) {
			var template =
				'<div class="flex-box flex-row" style="padding-left:8px;">' +
				'   <div class="checkbox">' +
				'       <label class="platform-form-label" style="max-width:initial;">' + $translate.instant('procurement.pricecomparison.takeFinalInBillingSchema') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}"  type="checkbox" data-ng-checked="service.isFinalShowInTotal" data-ng-model="service.isFinalShowInTotal"/>' +
				'       </label>' +
				'   </div>' +
				'</div>';
			template += template1;
			return {
				restrict: 'A',
				scope: {
					divWidth: '=',
					divHeight: '='
				},
				template: template,
				controller: 'procurementPriceComparisonBillingSchemaRowController'
			};
		}
	]);

	angular.module(moduleName).directive('procurementPriceComparisonBoqSummaryCompareRow', [
		function () {
			return {
				restrict: 'A',
				scope: {
					model: '@'
				},
				templateUrl: 'procurement.pricecomparison/partials/boq-summary-item-type.html',
				controller: 'procurementPriceComparisonBoQPrintController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name: procurementPriceComparisonSettingsRow
	 * @description
	 * #
	 * a directive for compare fields
	 */
	angular.module(moduleName).directive('procurementPriceComparisonSettingsRow', [
		'$translate',
		function ($translate) {
			var template =
				'<div class="flex-box flex-row" style="padding-left:8px;">' +
				'   <div class="checkbox">' +
				'       <label class="platform-form-label">' + $translate.instant('procurement.pricecomparison.horizontalCompare') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}" data-ng-change="onVerticalCompareRowsChanged()" type="checkbox" data-ng-model="service.isVerticalCompareRows"/>' +
				'       </label>' +
				'   </div>' +
				'   <div class="checkbox col-lg-offset-1" style="margin-top: initial;">' +
				'       <label class="platform-form-label">' + $translate.instant('procurement.pricecomparison.lineValueColumnVisible') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}" data-ng-disabled="!service.isVerticalCompareRows" data-ng-change="onLineValueColumnChanged()" type="checkbox" data-ng-model="service.isLineValueColumn"/>' +
				'       </label>' +
				'   </div>' +
				'   <div data-ng-if="service.isBoq" class="checkbox col-lg-offset-1" style="margin-top: initial;">' +
				'       <label class="platform-form-label">' + $translate.instant('procurement.pricecomparison.isCalculateAsPerAdjustedQuantity') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}" type="checkbox" data-ng-model="service.isCalculateAsPerAdjustedQuantity"/>' +
				'       </label>' +
				'   </div>' +
				'</div>';
			template += template1;
			return {
				restrict: 'A',
				scope: {
					divWidth: '=',
					divHeight: '='
				},
				template: template,
				controller: 'procurementPriceComparisonRowController'
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name: procurementPriceComparisonPrintRowSettingsRow
	 * @description
	 * #
	 * a directive for compare fields
	 */
	angular.module(moduleName).factory('procurementPriceComparisonPrintRowSettingsRowDefinition', [
		function () {
			return function (options) {
				return angular.merge({
					restrict: 'A',
					scope: {
						divWidth: '=',
						divHeight: '=',
						entity: '=',
						model: '@'
					},
					template: '',
					controller: 'procurementPriceComparisonPrintItemRowSettingController'
				}, options);
			};
		}
	]);

	angular.module(moduleName).directive('procurementPriceComparisonPrintRowSettingsCompareRow', [
		'$translate',
		'procurementPriceComparisonPrintRowSettingsRowDefinition',
		function ($translate,
			PrintRowSettingsRowDefinition) {
			var template =
				'<div class="flex-box flex-row" style="padding-left:8px;">' +
				'   <div class="checkbox">' +
				'       <label class="platform-form-label">' + $translate.instant('procurement.pricecomparison.printing.horizontalPrint') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}" data-ng-change="onVerticalCompareRowsChanged()" type="checkbox" data-ng-model="entity.isVerticalCompareRows"/>' +
				'       </label>' +
				'   </div>' +
				'   <div class="checkbox col-lg-offset-1" style="margin-top: initial;">' +
				'       <label class="platform-form-label">' + $translate.instant('procurement.pricecomparison.printing.lineValueColumnPrint') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}" data-ng-disabled="!entity.isVerticalCompareRows" data-ng-change="onLineValueColumnChanged()" type="checkbox" data-ng-model="entity.isLineValueColumn"/>' +
				'       </label>' +
				'   </div>' +
				'   <div data-ng-if="entity.isBoq" class="checkbox col-lg-offset-1" style="margin-top: initial;">' +
				'       <label class="platform-form-label">' + $translate.instant('procurement.pricecomparison.isCalculateAsPerAdjustedQuantity') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}" type="checkbox" data-ng-model="entity.isCalculateAsPerAdjustedQuantity" data-ng-change="isCalculateAsPerAdjustedQuantity()"/>' +
				'       </label>' +
				'   </div>' +
				'</div>';
			template += template1;
			return new PrintRowSettingsRowDefinition({template: template});
		}
	]);

	angular.module(moduleName).directive('procurementPriceComparisonPrintRowSettingsQuoteRow', [
		'procurementPriceComparisonPrintRowSettingsRowDefinition',
		function (PrintRowSettingsRowDefinition) {
			return new PrintRowSettingsRowDefinition({template: template1});
		}
	]);

	angular.module(moduleName).directive('procurementPriceComparisonPrintRowSettingsBillingSchemaRow', [
		'$translate',
		'procurementPriceComparisonPrintRowSettingsRowDefinition',
		function (
			$translate,
			PrintRowSettingsRowDefinition) {
			var template =
				'<div class="flex-box flex-row" style="padding-left:8px;">' +
				'   <div class="checkbox">' +
				'       <label class="platform-form-label" style="max-width: initial;">' + $translate.instant('procurement.pricecomparison.takeFinalInBillingSchema') +
				'           <input data-ng-model-options="{debounce: { default: 0, blur: 0}}"  type="checkbox" data-ng-checked="entity.isFinalShowInTotal" data-ng-change="onFinalShowInTotalChanged()" data-ng-model="entity.isFinalShowInTotal"/>' +
				'       </label>' +
				'   </div>' +
				'</div>';
			template += template1;
			return new PrintRowSettingsRowDefinition({template: template});
		}
	]);

})(angular);
