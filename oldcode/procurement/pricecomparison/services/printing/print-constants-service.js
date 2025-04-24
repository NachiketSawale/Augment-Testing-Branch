/**
 * Created by wed on 9/14/2018.
 */

(function (angular) {

	'use strict';

	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonPrintConstants', [
		'$translate',
		function ($translate) {
			return {
				paperSize: {
					A4: 1,
					A3: 2,
					Letter: 3
				},
				orientation: {
					portrait: 1,
					landscape: 2
				},
				profileType: {
					generic: 1,
					item: 2,
					boq: 3
				},
				printType: {
					item: 1,
					boq: 2
				},
				compareType: {
					1: 'item',
					2: 'boq'
				},
				currentView: {
					generic: -1,
					rfq: -2
				},
				loadValue: {
					default: 0,
					current: 1
				},
				profileSaveType: {
					user: 1,
					role: 2,
					system: 3
				},
				printLoadType: {
					loadDefault: '0',
					loadUiView: '1',
					loadLatest: '2'
				},
				screenDpi: {
					D72: 72
				},
				paperSizeWidth: {
					A4_portrait: 21,// jshint ignore: line
					A4_landscape: 29.7,// jshint ignore: line
					A3_portrait: 29.7,// jshint ignore: line
					A3_landscape: 42,// jshint ignore: line
					letter_portrait: 21.6,// jshint ignore: line
					letter_landscape: 27.9// jshint ignore: line
				},
				bidderFieldName: '_rt$bidder',
				eventNames: {
					applyNewGenericProfile: 'APPLY_NEW_GENERIC_PROFILE',
					paperSizeChange: 'PAPER_SIZE_CHANGE',
					orientationChange: 'ORIENTATION_CHANGE',
					maxBidderPageSizeChange: 'MAX_BIDDER_PAGE_SIZE_CHANGE',
					bidderWidthChange: 'BIDDER_WIDTH_CHANGE',
					rowConfigChange: 'ROW_CONFIG_CHANGE',
					bidderCountOrQuoteChange: 'BIDDER_COUNT_OR_QUOTE_CHANGE',
					bidderChange: 'BIDDER_CHANGE',
					loadProfileFromBase: 'LOAD_PROFILE_FROM_BASE',
					compareFieldsCountChange: 'COMPARE_FIELDS_COUNT_CHANGE',
					bidderVisibleNumChange: 'BIDDER_VISIBLE_NUM_CHANGE',
					containerSizeChange: 'CONTAINER_SIZE_CHANGE',
					genericClickChange: 'GENERIC_CLICK_CHANGE',
					rfqClickChange: 'RFQ_CLICK_CHANGE'
				},
				hints: {
					error: {},
					warning: {
						bidderWidthInvalid: {
							code: 1000,
							message: $translate.instant('procurement.pricecomparison.printing.bidderColumnWidthInvalid')
						}
					}
				},
				bidderNameTemplate: '{{PREFIX}}{{INDEX}}'
			};
		}
	]);
})(angular);