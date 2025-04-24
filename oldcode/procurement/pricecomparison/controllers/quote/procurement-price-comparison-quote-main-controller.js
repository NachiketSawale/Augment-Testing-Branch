/**
 * Created by chi on 10/7/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonQuoteMainControllerService', procurementPriceComparisonQuoteMainControllerService);

	procurementPriceComparisonQuoteMainControllerService.$inject = [
		'$translate',
		'procurementContextService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonSimulateQuoteDataService'
	];

	function procurementPriceComparisonQuoteMainControllerService(
		$translate,
		procurementContextService,
		procurementPriceComparisonItemService,
		procurementPriceComparisonBoqService,
		procurementPriceComparisonSimulateQuoteDataService) {

		let service = {};
		let itemData = null;
		let boqData = null;
		let creationData = null;
		let type = null;
		service.initialize = initialize;

		Object.defineProperties(service, {
			'itemData': { // for item
				get: function () {
					return itemData;
				},
				set: function (value) {
					itemData = value;
				},
				enumerable: true
			},
			'boqData': {
				get: function () {
					return boqData;
				},
				set: function (value) {
					boqData = value;
				},
				enumerable: true
			},
			'creationData': {
				get: function () {
					return creationData;
				},
				set: function (value) {
					creationData = value;
				},
				enumerable: true
			},
			'type': {
				get: function () {
					return type;
				},
				set: function (value) {
					type = value;
				},
				enumerable: true
			}
		});

		return service;

		function initialize($scope, extendDestroyHandler) {
			let quoteService = procurementPriceComparisonSimulateQuoteDataService.getQuoteHeaderService();
			let qtnReqService = procurementPriceComparisonSimulateQuoteDataService.getQuoteRequisitionService(quoteService);
			procurementContextService.setLeadingService(quoteService);
			procurementContextService.setMainService(qtnReqService);
			procurementContextService.setModuleReadOnly(false);

			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.wizard.createQuoteItem'),
				btnAddToOneQuoteText: $translate.instant('procurement.pricecomparison.wizard.addToOneQuote'), // 'Add to One Quote',
				btnAddToAllQuotesText: $translate.instant('procurement.pricecomparison.wizard.addToAllQuotes'), // 'Add to All Quotes',
				btnCancelText: $translate.instant('cloud.common.cancel'), // 'Cancel'
				dialogLoading: true,
				setTools: function (tools) {
					if (!$scope.modalOptions) {
						return;
					}
					$scope.modalOptions.tools = tools;

					if (!angular.isFunction(tools.update)) {
						$scope.modalOptions.tools.update = function () {
						};
					}
				},
				itemData: itemData,
				boqData: boqData,
				creationData: creationData,
				type: type
			};

			$scope.$on('$destroy', function () {
				itemData = null;
				boqData = null;
				creationData = null;
				type = null;

				procurementPriceComparisonSimulateQuoteDataService.resetLocalData();

				// remove context values
				procurementContextService.removeModuleValue(procurementContextService.leadingServiceKey);
				procurementContextService.removeModuleValue(procurementContextService.prcCommonMainService);
				procurementContextService.removeModuleValue(procurementContextService.moduleReadOnlyKey);
				procurementContextService.removeModuleValue(procurementContextService.moduleStatusKey);
				/** @namespace moduleContext.moduleNameKey */
				procurementContextService.removeModuleValue(procurementContextService.moduleNameKey);

				if (!procurementContextService.getMainService() ||
					(procurementContextService.getMainService().getItemName() !== 'ItemComparisonData' &&
						procurementContextService.getMainService().getItemName() !== 'BoqComparisonData')) {
					if ($scope.modalOptions.type === 'item') {
						procurementContextService.setLeadingService(procurementPriceComparisonItemService);
						procurementContextService.setMainService(procurementPriceComparisonItemService);
					} else {
						procurementContextService.setLeadingService(procurementPriceComparisonBoqService);
						procurementContextService.setMainService(procurementPriceComparisonBoqService);
					}
				}

				if (angular.isFunction(extendDestroyHandler)) {
					extendDestroyHandler();
				}
			});
		}

	}
})(angular);