/**
 * Created by chi on 10/12/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonCreateQuoteBoqItemController', procurementPriceComparisonCreateQuoteBoqItemController);

	procurementPriceComparisonCreateQuoteBoqItemController.$inject = [
		'globals',
		'_',
		'$scope',
		'prcBoqMainService',
		'platformDetailControllerService',
		'boqMainCommonService',
		'boqMainTranslationService',
		'platformModalService',
		'procurementContextService',
		'boqMainDetailFormControllerService',
		'$timeout',
		'boqMainValidationServiceProvider',
		'boqMainStandardConfigurationService',
		'boqMainDetailFormConfigService',
		'procurementPriceComparisonSimulateQuoteDataService',
		'procurementPriceComparisonQuoteMainControllerService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonLayoutModuleConfigService',
		'controllerOptions'];

	function procurementPriceComparisonCreateQuoteBoqItemController(
		globals,
		_,
		$scope,
		prcBoqMainService,
		platformDetailControllerService,
		boqMainCommonService,
		boqMainTranslationService,
		platformModalService,
		procurementContextService,
		boqMainDetailFormControllerService,
		$timeout,
		boqMainValidationServiceProvider,
		boqMainStandardConfigurationService,
		boqMainDetailFormConfigService,
		procurementPriceComparisonSimulateQuoteDataService,
		procurementPriceComparisonQuoteMainControllerService,
		basicsLookupdataLookupDescriptorService,
		layoutModuleConfigService,
		controllerOptions) {

		let dataService = null;
		procurementPriceComparisonQuoteMainControllerService.initialize($scope, function () {
			if (dataService) {
				dataService.unregisterEntityCreated(onEntityCreated);
			}
			procurementPriceComparisonSimulateQuoteDataService.preparationDone.unregister(onPreparationDone);
		});

		let mainService = procurementContextService.getLeadingService();
		let qtnReqService = procurementPriceComparisonSimulateQuoteDataService.getQuoteRequisitionService(mainService);
		dataService = prcBoqMainService.getService(qtnReqService);
		procurementPriceComparisonSimulateQuoteDataService.getPrcBoqService(qtnReqService, dataService);
		dataService.registerEntityCreated(onEntityCreated);

		procurementPriceComparisonSimulateQuoteDataService.preparationDone.register(onPreparationDone);
		procurementPriceComparisonSimulateQuoteDataService.prepareCreateBoqItem($scope.modalOptions.boqData);

		$scope.getContainerUUID = function getContainerUUID() {
			return 'a6acabddc69f45408c3dd3a9504a2ac5';
		};

		boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, dataService, boqMainValidationServiceProvider, boqMainStandardConfigurationService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

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

		$scope.$on('$destroy', function () {
			dataService.unregisterEntityCreated(onEntityCreated);
			procurementPriceComparisonSimulateQuoteDataService.preparationDone.unregister(onPreparationDone);
		});

		function addToOneQuote() {
			$scope.modalOptions.dialogLoading = true;
			mainService.updateItem('item2OneQuote').then(function () {
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
						SelectedBoq: controllerOptions.createParams.InsertOptions.SelectedBoq,
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
				let itemList = dataService.getList();
				if (selected.BoqItemFk) {
					if (!_.some(itemList, {Id: selected.BoqItemFk})) {
						selected.BoqItemFk = null;
					}
				}
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

		function onEntityCreated() {
			$scope.modalOptions.dialogLoading = false;
		}

		function onPreparationDone() {
			if ($scope.modalOptions.type === 'boq') {
				let quotes = basicsLookupdataLookupDescriptorService.getData('Quote');
				let currQuote = quotes[$scope.modalOptions.creationData.quote.QtnHeaderId];
				if (currQuote) {
					dataService.setSelectedProjectId(currQuote.ProjectFk);
				}
				dataService.createBoqPositionFromPriceComparison($scope.modalOptions.creationData).then(function (response) {
					if (!response && $scope.$close) {
						$scope.$close();
					}
				});
			}
		}
	}
})(angular);
