/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('SalesBidDocumentTypeProcessor', ['_', '$translate', '$injector', function (_, $translate, $injector) {
		var service = {};

		service.processItem = function processItem(item) {
			// Type was introduced later to the bid header, thus there exist old data, which does not have a type assigned.
			// Currently, for old data the type is determined by the properties BidHeaderFk and PrjChangeFk.
			var bidType = $injector.get('salesBidTypeLookupDataService').getItemById(item.TypeFk);
			if (_.isNil(bidType)) {
				if (item.BidHeaderFk !== null && item.PrjChangeFk !== null) {
					item.DocumentType = $translate.instant('sales.bid.docTypeChangeQuote');
				} else if (item.BidHeaderFk !== null && item.PrjChangeFk === null) {
					item.DocumentType = $translate.instant('sales.bid.docTypeSideQuote');
				} else if (item.BidHeaderFk === null && item.PrjChangeFk === null) {
					item.DocumentType = $translate.instant('sales.bid.docTypeSalesBid');
				} else {
					item.DocumentType = ''; // TODO: check this case, there are bids...
				}
			} else {
				if (bidType.IsChange) {
					item.DocumentType = $translate.instant('sales.bid.docTypeChangeQuote');
				} else if (bidType.IsSide) {
					item.DocumentType = $translate.instant('sales.bid.docTypeSideQuote');
				} else if (bidType.IsMain) {
					item.DocumentType = $translate.instant('sales.bid.docTypeSalesBid');
				} else {
					item.DocumentType = ''; // TODO: check this case, there are bids...
				}
			}
		};

		return service;
	}]);
})();
