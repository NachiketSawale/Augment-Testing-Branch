/**
 * Created by chi on 10/21/2018.
 */
(function (angular, globals, $) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,$ */
	var moduleName = 'procurement.pricecomparison';

	globals.lookups.prcItemEvaluation = function prcItemEvaluation() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcItemEvaluation',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('procurementPriceComparisonEvaluationComplexLookup', procurementPriceComparisonEvaluationComplexLookup);

	procurementPriceComparisonEvaluationComplexLookup.$inject = ['_', '$translate', '$templateCache', 'globals',
		'platformModalService', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDataService'];

	function procurementPriceComparisonEvaluationComplexLookup(_, $translate, $templateCache, globals,
		platformModalService, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupDataService) {

		var defaults = globals.lookups.prcItemEvaluation().lookupOptions;

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			controller: ['$scope', function ($scope) {
				var template = null;
				var rfqHeaderId = $scope.entity ? $scope.entity.RfqHeaderId : null;
				var entityType = $scope.$parent.options.entityType;
				var prcItemId = null;
				var boqInfo = null;
				if (entityType === 'item') {
					prcItemId = getPrcItemIdFromEntity($scope.entity);
				} else if (entityType === 'boq') {
					boqInfo = getBoqInfoFromEntity($scope.entity);
				} else {
					throw new Error('No such entityType is found.');
				}

				$scope.lookupOptions.dataProvider = basicsLookupdataLookupDataService.registerDataProviderByType(defaults.lookupType);

				init();

				var buttons = [
					{
						img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
						execute: onOpenPopupClicked,
						canExecute: function () {
							return true;
						}
					}
				];

				$.extend($scope.lookupOptions, {
					buttons: buttons
				});

				// ///////////////////////////
				function init() {
					$templateCache.loadTemplateFile('procurement.pricecomparison/templates/price-comparison-item-evaluation-popup.html').then(function () {
						// sectionId will be passed by basicsCharacteristicCodeLookupService setter!
						// pass the sectionId to the popup controller
						// template = $templateCache.get('basics-characteristic-code-popup.html').replace('$$sectionId$$', $scope.getSectionId());
						template = $templateCache.get('price-comparison-item-evaluation-popup.html');
					});
				}

				function onOpenPopupClicked() {

					if (rfqHeaderId === null) {
						return;
					}
					var filterParams = {
						rfqHeaderId: rfqHeaderId
					};

					if (entityType === 'item') {
						filterParams.prcItemId = prcItemId;
					} else if (entityType === 'boq') {
						angular.extend(filterParams, boqInfo);
					} else {
						throw new Error('No such entityType is found.');
					}

					var modalOptions = {
						headerText: $translate.instant('procurement.pricecomparison.otherQuoteItemDialog.otherQuoteItemDialogTitle'),
						template: template,
						backdrop: false,
						windowClass: 'form-modal-dialog',
						value: {},  // object that will be returned,
						filterParams: filterParams,
						entityType: entityType
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (!result || !result.value) {
							return;
						}
						$scope.$parent.updatePrice($scope.entity, result.value, $scope.$parent.options.lookupMember, $scope.$parent.config.field);
					});
				}

				function getPrcItemIdFromEntity(entity) {
					if (entity) {
						let parentItem = entity.parentItem || entity;
						parentItem = $scope.$parent.config.isVerticalCompareRows ? entity : parentItem;
						if (parentItem && parentItem.QuoteItems) {
							let quoteItems = parentItem.QuoteItems,
								quoteKey = $scope.$parent.config.isVerticalCompareRows ? $scope.$parent.config.quoteKey : $scope.$parent.config.field;
							let quote = _.find(quoteItems, {QuoteKey: quoteKey});
							if (quote) {
								return quote.PrcItemId;
							}
						}
					}
					return null;
				}

				function getBoqInfoFromEntity(entity) {
					if (entity) {
						let parentItem = entity.parentItem || entity;
						parentItem = $scope.$parent.config.isVerticalCompareRows ? entity : parentItem;
						if (parentItem && parentItem.QuoteItems) {
							let quoteItems = parentItem.QuoteItems;
							let quoteKey = $scope.$parent.config.isVerticalCompareRows ? $scope.$parent.config.quoteKey : $scope.$parent.config.field;
							let quote = _.find(quoteItems, { QuoteKey: quoteKey });
							if (quote) {

								return {
									boqHeaderId: quote.BoqHeaderId,
									boqItemId: quote.BoqItemId,
									reqHeaderId: quote.ReqHeaderId
								};
							}
						}
					}
					return null;
				}
			}]
		});
	}
})(angular, globals, $);