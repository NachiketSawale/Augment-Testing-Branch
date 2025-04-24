/**
 * Created by chi on 10/7/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonCreateQuoteItemController', procurementPriceComparisonCreateQuoteItemController);

	procurementPriceComparisonCreateQuoteItemController.$inject = [
		'_',
		'$scope',
		'procurementCommonPrcItemDataService',
		'procurementCommonPrcItemValidationService',
		'platformDetailControllerService',
		'procurementCommonItemUIStandardService',
		'procurementContextService',
		'platformTranslateService',
		'procurementCommonPriceConditionService',
		'procurementPriceComparisonSimulateQuoteDataService',
		'procurementPriceComparisonQuoteMainControllerService',
		'procurementPriceComparisonLayoutModuleConfigService',
		'controllerOptions'];

	function procurementPriceComparisonCreateQuoteItemController(
		_,
		$scope,
		procurementCommonPrcItemDataService,
		procurementCommonPrcItemValidationService,
		platformDetailControllerService,
		procurementCommonItemUIStandardService,
		procurementContextService,
		platformTranslateService,
		procurementCommonPriceConditionService,
		procurementPriceComparisonSimulateQuoteDataService,
		procurementPriceComparisonQuoteMainControllerService,
		layoutModuleConfigService,
		controllerOptions) {

		procurementPriceComparisonQuoteMainControllerService.initialize($scope, function () {
			procurementContextService.removeModuleValue(procurementContextService.itemDataServiceKey);
			procurementPriceComparisonSimulateQuoteDataService.preparationDone.unregister(onPreparationDone);
		});

		let mainService = procurementContextService.getLeadingService();
		let qtnReqService = procurementContextService.getMainService();
		let dataService = procurementCommonPrcItemDataService.getService(qtnReqService, true);
		dataService.loadSubItemList = function () {
		};
		let validationService = procurementCommonPrcItemValidationService(dataService);

		procurementContextService.setItemDataService(dataService);

		$scope.getContainerUUID = function () {
			return '274da208b3da47988366d48f38707de2';
		};

		platformDetailControllerService.initDetailController($scope, dataService, validationService, procurementCommonItemUIStandardService, platformTranslateService);

		procurementPriceComparisonSimulateQuoteDataService.preparationDone.register(onPreparationDone);
		procurementPriceComparisonSimulateQuoteDataService.prepareCreateItem($scope.modalOptions.itemData);

		let customConfig = angular.copy($scope.formOptions.configure);
		customConfig.skipPermissionCheck = true;
		$scope.formOptions.configure = customConfig;

		$scope.modalOptions.addToOneQuote = addToOneQuote;
		$scope.modalOptions.addToAllQuotes = addToAllQuotes;
		$scope.modalOptions.cancel = close;

		$scope.modalOptions.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [],
			update: function () {
			}
		});

		$scope.modalOptions = _.extend($scope.modalOptions, controllerOptions);

		layoutModuleConfigService.useModuleConfig($scope, $scope.getContainerUUID(), $scope.formOptions, $scope.modalOptions.tools);

		function addToOneQuote() {
			$scope.modalOptions.dialogLoading = true;
			mainService.updateItem('item2OneQuote', controllerOptions.createParams).then(function () {
				closeAfterSave();
			}, function () {
				close();
			}).finally(() => {
				$scope.modalOptions.dialogLoading = false;
			});
		}

		function addToAllQuotes() {
			$scope.modalOptions.dialogLoading = true;
			mainService.updateItem('item2AllQuotes', (updateData) => {
				if (controllerOptions.createParams && controllerOptions.createParams.InsertOptions) {
					updateData.InsertOptions = {
						SelectedItem: controllerOptions.createParams.InsertOptions.SelectedItem,
						InsertBefore: controllerOptions.createParams.InsertOptions.InsertBefore
					};
				}
			}).then(function () {
				closeAfterSave();
			}, function () {
				close();
			}).finally(() => {
				$scope.modalOptions.dialogLoading = false;
			});
		}

		function close() {
			let selected = dataService.getSelected();
			if (selected) {
				dataService.deleteItem(selected);
			}
			if ($scope.$close) {
				$scope.$close();
			}
		}

		function closeAfterSave() {
			if ($scope.$close) {
				$scope.$close({needUpdate: true});
			}
		}

		function onPreparationDone() {
			if ($scope.modalOptions.type === 'item') {
				dataService.createItem(controllerOptions.createParams).finally(function () {
					$scope.modalOptions.dialogLoading = false;
				});
			}
		}
	}
})(angular);