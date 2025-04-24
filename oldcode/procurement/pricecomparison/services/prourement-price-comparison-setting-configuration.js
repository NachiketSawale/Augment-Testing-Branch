(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).service('procurementPriceComparisonSettingConfiguration', [
		'procurementPriceComparisonItemRowService',
		'procurementPriceComparisonBoqRowService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonItemColumnService',
		'procurementPriceComparisonBoqColumnService',
		'procurementPriceComparisonItemQuoteRowService',
		'procurementPriceComparisonBoqQuoteRowService',
		'procurementPriceComparisonItemBillingSchemaRowService',
		'procurementPriceComparisonBoqBillingSchemaRowService',
		'procurementPriceComparisonItemPrintColumnService',
		'procurementPriceComparisonBoqPrintColumnService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonItemColumnValidationService',
		'procurementPriceComparisonBoqColumnValidationService',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonItemConfigService',
		'procurementPriceComparisonBoqConfigService',
		function (
			itemRowService,
			boqRowService,
			itemService,
			boqService,
			commonService,
			itemColumnService,
			boqColumnService,
			itemQuoteRowService,
			boqQuoteRowService,
			itemBillingSchemaService,
			boqBillingSchemaService,
			itemPrintColumnService,
			boqPrintColumnService,
			printConstants,
			itemColumnValidationService,
			boqColumnValidationService,
			itemHelperService,
			boqHelperService,
			itemConfigService,
			boqConfigService
		) {
			var configuration = {
				item: {
					gridLayout: {
						gridId: 'ef496d027ad34b1f8fe282b1d6692ded',
						directive: 'column-layout-setting-directive'
					},
					quoteCompareColumn: {
						gridId: '81ec25f86f734995bac86eb0ed004230',
						directive: 'procurement-price-comparison-settings-column',
						dataService: itemColumnService,
						dataValidationService: itemColumnValidationService
					},
					quoteCompareField: {
						gridId: 'ec4f01501d994b7a8d619c1829a366d1',
						directive: 'procurement-price-comparison-settings-quote-row',
						dataService: itemQuoteRowService
					},
					billingSchemaField: {
						gridId: '16925de8c1334d639f402c8858618296',
						directive: 'procurement-price-comparison-settings-billing-schema-row',
						dataService: itemBillingSchemaService
					},
					compareField: {
						gridId: 'c4ec222341294810b2cb4dc2a77a86d7',
						formatterGridId: '7d0ca19a5ab24ce7b81c919e2b5d4fed',
						directive: 'procurement-price-comparison-settings-row',
						deviationFields: commonService.itemDeviationFields,
						dataService: itemRowService
					},
					summaryCompareField: {

					},
					isItem: true,
					helpService: itemHelperService,
					configService: itemConfigService,
					parentService: itemService,
					uiSetting: {
						uuid: '175bb712aa664306af7d17610916ddec'
					}
				},
				boq: {
					gridLayout: {
						gridId: '8b9a53f0a1144c03b8447a99f7b38448',
						directive: 'column-layout-setting-directive'
					},
					quoteCompareColumn: {
						gridId: '389cb2eac6df409ea876f09d0596a5a9',
						directive: 'procurement-price-comparison-settings-column',
						dataService: boqColumnService,
						dataValidationService: boqColumnValidationService
					},
					quoteCompareField: {
						gridId: 'f485f43742e54c8ba6435116e3724795',
						directive: 'procurement-price-comparison-settings-quote-row',
						dataService: boqQuoteRowService
					},
					billingSchemaField: {
						gridId: 'b4462e17c01843e7a0e42fe7132d3f94',
						directive: 'procurement-price-comparison-settings-billing-schema-row',
						dataService: boqBillingSchemaService
					},
					compareField: {
						gridId: '9ccc84e5bdaf431783ca47f24a025c29',
						formatterGridId: '7d0ca19a5ab24ce7b81c919e2b5d4fed',
						directive: 'procurement-price-comparison-settings-row',
						deviationFields: commonService.boqDeviationFields,
						dataService: boqRowService
					},
					summaryCompareField: {
						directive: 'procurement-price-comparison-boq-summary-compare-row'
					},
					isBoq: true,
					helpService: boqHelperService,
					configService: boqConfigService,
					parentService: boqService,
					uiSetting: {
						uuid: '5d48a6e029bb42c5903024b487ca4a60'
					}
				},
				printItem: {
					gridLayout: {
						gridId: 'ef496d027ad34b1f8fe282b1d6692ded',
						directive: 'column-layout-setting-directive'
					},
					quoteCompareColumn: {
						gridId: '118bbd4ba8394a21bb087f7fea358283',
						dataService: itemPrintColumnService,
						dataValidationService: itemColumnValidationService,
						customSetting: {
							dataService: itemPrintColumnService,
							uuid: '118bbd4ba8394a21bb087f7fea358283',
							parentProp: 'CompareColumnFk',
							canCreateIdealQuote: false,
							printType: printConstants.printType.item,
							visibleSkipFn: function () {
								return false;
							}
						}
					},
					quoteCompareField: {
						dataService: itemQuoteRowService,
						directive: 'procurement-price-comparison-print-row-settings-quote-row'
					},
					billingSchemaField: {
						directive: 'procurement-price-comparison-print-row-settings-billing-schema-row',
						dataService: itemBillingSchemaService
					},
					compareField: {
						directive: 'procurement-price-comparison-print-row-settings-compare-row',
						deviationFields: commonService.itemDeviationFields,
						dataService: itemRowService
					},
					summaryCompareField: {

					},
					isItem: true,
					isPrint: true,
					helpService: itemHelperService,
					configService: itemConfigService,
					parentService: itemService,
					uiSetting: {
						uuid: '350fb5471986484eba09545eedcadff9'
					}
				},
				printBoq: {
					gridLayout: {
						gridId: '8b9a53f0a1144c03b8447a99f7b38448',
						directive: 'column-layout-setting-directive'
					},
					quoteCompareColumn: {
						gridId: 'fcb3260df05048b99ab0263a20b98523',
						dataService: boqPrintColumnService,
						dataValidationService: boqColumnValidationService,
						customSetting: {
							dataService: boqPrintColumnService,
							uuid: 'fcb3260df05048b99ab0263a20b98523',
							parentProp: 'CompareColumnFk',
							canCreateIdealQuote: false,
							printType: printConstants.printType.boq,
							visibleSkipFn: function () {
								return false;
							}
						}
					},
					quoteCompareField: {
						dataService: boqQuoteRowService,
						directive: 'procurement-price-comparison-print-row-settings-quote-row'

					},
					billingSchemaField: {
						directive: 'procurement-price-comparison-print-row-settings-billing-schema-row',
						dataService: boqBillingSchemaService

					},
					compareField: {
						directive: 'procurement-price-comparison-print-row-settings-compare-row',
						deviationFields: commonService.boqDeviationFields,
						dataService: boqRowService
					},
					summaryCompareField: {

					},
					isBoq: true,
					isPrint: true,
					helpService: boqHelperService,
					configService: boqConfigService,
					parentService: boqService,
					uiSetting: {
						uuid: 'e16c9fce2973421abaac703c22c09fd9'
					}
				}
			};

			var currentConfig = {};

			function getCurrentConfig() {
				return currentConfig;
			}

			function setCurrentConfig(typeName) {
				currentConfig = configuration[typeName];
			}

			function extendConfiguration(options) {
				currentConfig = angular.extend(currentConfig, options);
			}

			function getGids() {
				return {
					gridLayout: 'grid.layout',
					quoteCompareColumn: 'settings.column',
					summaryCompareField: 'settings.summary.row',
					quoteCompareField: 'settings.quote.row',
					billingSchemaField: 'settings.billingschema.row',
					compareField: 'settings.row'
				};
			}

			return {
				getGids: getGids,
				getCurrentConfig: getCurrentConfig,
				setCurrentConfig: setCurrentConfig,
				extendConfiguration: extendConfiguration
			};
		}
	]);
})(angular);