(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonBoqPriceConditionController', [
		'_',
		'$scope',
		'platformGridControllerService',
		'basicsPriceConditionStandardConfigurationService',
		'basicsMaterialPriceConditionValidationService',
		'procurementPriceComparisonBoqPriceConditionService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonCommonService',
		function (
			_,
			$scope,
			platformGridControllerService,
			uiStandardService,
			validationService,
			dataService,
			parentService,
			commonService
		) {

			let gridConfig = {
				initCalled: false,
				columns: []
			};

			$scope.service = dataService;
			$scope.deleteItem = function deleteItem() {
				if (dataService.hasSelection()) {
					dataService.deleteItem(dataService.getSelected());
				}
			};
			$scope.parentItem = parentService.selectedQuoteBoq;
			$scope.config = {
				rt$readonly: dataService.readonly
			};
			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService(dataService), gridConfig);

			$scope.priceConditionChanged = function () {
				parentService.setNewConditionFk($scope.parentItem.BoqItemId, $scope.parentItem.PrcPriceConditionFk);
				let quoteItem = $scope.parentItem;
				if (quoteItem && !quoteItem.IsIdealBidder) {
					let itemTree = parentService.getTree();
					let allQuoteItems = commonService.getAllQuoteItems(itemTree, 'BoqItemChildren');
					let idealQuoteItems = _.filter(allQuoteItems, function (i) {
						return i.IsIdealBidder && quoteItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && quoteItem.BoqItemId === i[commonService.itemEvaluationRelatedFields.sourceBoqItemId];
					});

					_.forEach(allQuoteItems, function (i) {
						if ((i.IsIdealBidder && quoteItem.QtnHeaderId === i[commonService.itemEvaluationRelatedFields.quoteId] && quoteItem.BoqItemId === i[commonService.itemEvaluationRelatedFields.sourceBoqItemId]) ||
							(i.QtnHeaderId === quoteItem.QtnHeaderId && i.BoqItemId === quoteItem.BoqItemId)) {
							i.PrcPriceConditionFk = $scope.parentItem.PrcPriceConditionFk;
						} else if (i.IsIdealBidder && angular.isArray(idealQuoteItems) && idealQuoteItems.length > 0) {
							let found = _.find(idealQuoteItems, {QtnHeaderId: i.QtnHeaderId, BoqItemId: i.BoqItemId});
							if (found) {
								i.PrcPriceConditionFk = $scope.parentItem.PrcPriceConditionFk;
							}
						}
					});
				}
				dataService.reload($scope.parentItem, $scope.parentItem.PrcPriceConditionFk, {
					exchangeRate: commonService.getExchangeRate(parentService.selectedQuote.RfqHeaderId, parentService.selectedQuote.Id)
				});
			};

			dataService.registerSelectionChanged(onParentItemChanged);
			parentService.onConditionChanged.register(onConditionChanged);
			parentService.onRowDeselected.register(onRowDeselected);

			$scope.value = $scope.parentItem ? $scope.parentItem.PrcPriceConditionFk : -1;

			function onParentItemChanged() {
				$scope.parentItem = parentService.selectedQuoteBoq;
				$scope.value = $scope.parentItem ? $scope.parentItem.PrcPriceConditionFk : null;
			}

			function onConditionChanged(value) {
				$scope.parentItem.PrcPriceConditionFk = $scope.value = value;
			}

			function onRowDeselected() {
				$scope.parentItem = null;
				$scope.value = null;
			}

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onParentItemChanged);
				parentService.onConditionChanged.unregister(onConditionChanged);
				parentService.onRowDeselected.unregister(onRowDeselected);
			});
		}
	]);
})(angular);