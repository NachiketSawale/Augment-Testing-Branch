(function (angular) {
	'use strict';

	angular.module('sales.billing').controller('saleBillingItemPriceConditionController',
		['$scope', '$injector', '$translate', 'platformModalService', 'platformGridControllerService', 'boqMainPriceconditionUIStandardService', 'basicsMaterialPriceConditionValidationService',
			function ($scope, $injector, $translate, platformModalService, platformGridControllerService, boqMainPriceconditionUIStandardService, basicsMaterialPriceConditionValidationService) {

				var gridOption = {
						initCalled: false,
						columns: []
					},
					dataService = $scope.getContentValue('dataService');
				$scope.isLoaded = true;
				if (angular.isString(dataService)) {
					dataService = $injector.get(dataService);
				}

				var validationService = basicsMaterialPriceConditionValidationService(dataService);

				dataService.gridRefresh();

				$scope.service = dataService;

				$scope.parentItem = dataService.getParentItem();
				$scope.config = {rt$readonly: readonly};

				function readonly() {
					var selected = dataService.getParentItem();
					if (angular.isFunction(dataService.getReadOnly)) {
						return !(((selected && angular.isDefined(selected.Id))) && !dataService.getReadOnly());
					} else {
						return !(selected && angular.isDefined(selected.Id));
					}
				}

				$scope.value = $scope.parentItem.PrcPriceConditionFk;

				dataService.getParentService().registerSelectionChanged(onParentItemChange);

				function onParentItemChange() {
					$scope.parentItem = dataService.getParentItem();
					$scope.value = $scope.parentItem.PrcPriceConditionFk;
				}

				platformGridControllerService.initListController($scope, angular.copy(boqMainPriceconditionUIStandardService), dataService, validationService, gridOption);

				$scope.createItem = function () {
					$scope.service.isLoading = true;

					dataService.canCreate().then(function (response) {
						dataService.createItem().then(function () {
							if (response.data) {
								dataService.createItem().then(function () {
									if (dataService.hasEmptyType) {
										$scope.hasEmptyType = dataService.hasEmptyType();
									}
								});
							} else {
								$scope.service.isLoading = false;
								var message = $translate.instant('basics.material.warning.priceConditionTypeWarningMsg') || 'All pre-defined price condition line types have been listed thus cannot add new record.';
								var title = $translate.instant('basics.material.warning.warningTitle') || 'Warning';
								platformModalService.showMsgBox(message, title, 'warning');
							}
						});
					});
				};

				$scope.deleteItem = function deleteItem() {
					if (dataService.hasSelection()) {
						dataService.deleteItem(dataService.getSelected());

						if (dataService.hasEmptyType) {
							$scope.hasEmptyType = dataService.hasEmptyType();
						}
					}
				};

				function recalculate() {
					$scope.service.isLoading = false;
					dataService.recalculate(dataService.parentService().getSelected(), $scope.parentItem.PrcPriceConditionFk);
				}

				$scope.priceConditionChanged = function () {
					unwatchEntityAction();
					dataService.reload($scope.parentItem, $scope.parentItem.PrcPriceConditionFk).finally(watchEntityAction);
					$scope.parentItem.PrcPriceconditionFk = $scope.parentItem.PrcPriceConditionFk;
				};

				$scope.lookupOptions = {
					showClearButton: true
				};

				function watchEntityAction() {
					if($scope.isLoaded) {
						dataService.registerEntityCreated(recalculate);
						dataService.registerEntityDeleted(recalculate);
					}
				}

				function unwatchEntityAction() {
					dataService.unregisterEntityCreated(recalculate);
					dataService.unregisterEntityDeleted(recalculate);
				}

				dataService.watchEntityAction = watchEntityAction;
				dataService.unwatchEntityAction = unwatchEntityAction;

				watchEntityAction();

				$scope.$on('$destroy', function () {
					$scope.isLoaded = false;
					unwatchEntityAction();
					dataService.getParentService().unregisterSelectionChanged(onParentItemChange);
				});
			}]);

})(angular);
