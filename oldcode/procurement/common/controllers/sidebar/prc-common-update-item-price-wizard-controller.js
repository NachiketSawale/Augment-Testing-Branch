/**
 * Created by alm on 23/8/2018.
 */
/**
 * @ngdoc controller
 * @name procurementCommonUpdateItemPriceWizardController
 * @function
 *
 * @description
 * Controller for the wizard dialog used to to update item price
 **/

// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonUpdateItemPriceWizardController', [
		'$scope', '$injector', '$http', '$translate', 'WizardHandler', 'platformGridAPI',
		'platformModalService', 'procurementCommonPrcItemDataService', 'procurementCommonUpdateItemPriceService',
		'procurementCommonItemPriceService', 'platformGridControllerService', 'procurementCommonItemPriceLayout',
		function ($scope, $injector, $http, $translate, WizardHandler, platformGridAPI,
			platformModalService, procurementCommonPrcItemDataService, commonUpdateItemPriceService,
			dataService, platformGridControllerService, itemPriceLayout) {

			var selectedItems = procurementCommonPrcItemDataService.getService().getSelectedEntities();
			var allItems = procurementCommonPrcItemDataService.getService().getList();
			var parentService = $scope.modalOptions.value.parentService;
			var firDialogWidth = '800px';
			var secDialogWidth = '1300px';
			dataService = dataService.getService(parentService);
			itemPriceLayout = itemPriceLayout.getUI(dataService);
			$scope.currentItem = {
				queryNeutralMaterial: true,
				queryFromMaterialCatalog: true,
				queryFromQuotation: true,
				queryFromContract: true,
				startDate: null,
				endDate: null,
				pricecondition: null,
				rt$hasError: function () {
					return $scope.currentItem.startDate && $scope.currentItem.endDate && $scope.currentItem.startDate > $scope.currentItem.endDate;
				},
				rt$errorText: function () {
					if ($scope.currentItem.rt$hasError()) {
						return $translate.instant('basics.material.updatePriceWizard.DateError', {startDate: 'Start date', endDate: 'End date'});
					}
					return '';
				}
			};
			$scope.currentItem.pricecondition = -1;
			dataService.queryNeutralMaterial = $scope.currentItem.queryNeutralMaterial;
			$scope.itemDisabled = selectedItems.length <= 0;
			$scope.wizard = $scope.modalOptions.value.wizard;
			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.wizard.title = $translate.instant('procurement.common.wizard.updateItemPrice.title');
			$scope.allOrSelected = 1;
			$scope.materials = [];
			$scope.selections = [
				{name: $translate.instant('procurement.common.wizard.updateItemPrice.basePrice'), value: 0},
				{name: $translate.instant('procurement.common.wizard.updateItemPrice.latestPriceVersion'), value: -1}
			];
			$scope.onResult = function (param) {
				$scope.allOrSelected = param;
			};
			$scope.selectedItem = $scope.selections[1].value;
			$scope.getCurrentStepNumber = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.currentStepNumber();
				} else {
					return '';
				}
			};
			$scope.getEnabledSteps = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.getEnabledSteps();
				} else {
					return [];
				}
			};
			$scope.steps = [
				{number: 0, identifier: 'basicSelectOption', skip: false},
				{number: 1, identifier: 'updatePrice', skip: false}
			];
			$scope.selectStep = angular.copy($scope.steps[0]);
			$scope.isLastStep = function () {
				if ($scope.selectStep) {
					return $scope.selectStep.number === $scope.steps.length - 1;
				} else {
					return true;
				}
			};
			$scope.getButtonText = function () {
				if ($scope.isLastStep()) {
					return $translate.instant('procurement.common.wizard.updateItemPrice.update');
				}

				return $translate.instant('basics.common.button.nextStep');
			};
			$scope.getTotalStepCount = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.totalStepCount();
				} else {
					return '';
				}
			};

			$scope.gridId = dataService.guid;
			$scope.setTools = function () {
			};
			var gridConfig = {
				grouping: false,
				columns: [],
				uuid: dataService.guid,
				initCalled: false,
				lazyInit: true,
				parentProp: '',
				childProp: 'Children',
				idProperty: 'Index'
			};

			function setCurrentStep(step) {
				$scope.selectStep = angular.copy($scope.steps[step]);
			}

			var leadData = parentService.getSelected();
			var module = 0;
			var serviceName = parentService.getServiceName();
			if (serviceName.indexOf('Package') !== -1) {
				module = 0;
			} else if (serviceName.indexOf('Requisition') !== -1) {
				module = 1;
			} else if (serviceName.indexOf('Quote') !== -1) {
				module = 2;
			} else if (serviceName.indexOf('Contract') !== -1) {
				module = 3;
			}

			commonUpdateItemPriceService.BusinessPartnerId = leadData.BusinessPartnerFk;

			$scope.previousStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				wz.previous();
				switch ($scope.selectStep.number) {
					case 1:
						$scope.options.width = firDialogWidth;
						setCurrentStep($scope.selectStep.number - 1);
						platformGridAPI.grids.unregister($scope.gridId);
						break;
				}
			};

			$scope.search = function () {
				setGridDataForItems();
			};

			$scope.nextStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				var currencyItems = $scope.allOrSelected === 1 ? allItems : selectedItems;
				var haveMaterialItems = _.find(currencyItems, function (o) {
					return o.MdcMaterialFk !== null;
				});
				if (!haveMaterialItems) {
					var msg = $translate.instant('procurement.common.wizard.updateItemPrice.itemNoMaterial');
					platformModalService.showMsgBox(msg, 'Info', 'ico-info');
					return false;
				}
				switch ($scope.selectStep.number) {
					case 0:
						setGridDataForItems();
						wz.next();
						$scope.options.width = secDialogWidth;
						setCurrentStep($scope.selectStep.number + 1);
						break;
					case 1:
						var allGridData = dataService.getList();
						var selectGridData = _.filter(allGridData, {Selected: true});
						if (selectGridData.length === 0) {
							platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateItemPrice.noItemSelected'), '', 'ico-info'); // jshint ignore:line
							break;
						}
						dataService.goUpdateItem(serviceName, selectGridData, leadData, module);
						wz.next();
						break;
				}
			};

			$scope.materialCatalogChange = function () {
				if (!$scope.currentItem.queryFromMaterialCatalog) {
					$scope.currentItem.pricecondition = null;
					$scope.currentItem.queryNeutralMaterial = false;
				} else {
					$scope.currentItem.pricecondition = -1;
				}
			};

			$scope.neutralMatChange = function () {
				commonUpdateItemPriceService.queryNeutralMaterial = $scope.currentItem.queryNeutralMaterial;
			};

			function setGridDataForItems() {
				var selectIds = [];
				var currencyItems = [];
				// allOrSelected === 1 => all items,  allOrSelected === 2 => selected items
				if ($scope.allOrSelected === 2) {
					selectIds = _.map(selectedItems, 'Id');
					currencyItems = selectedItems;
				} else {
					selectIds = _.map(allItems, 'Id');
					currencyItems = allItems;
					commonUpdateItemPriceService.materialIds = _.map(allItems, function (item) {
						if (!_.isNil(item.MdcMaterialFk)) {
							return item.MdcMaterialFk;
						}
					});
				}
				var itemsWithMaterial = _.filter(currencyItems, function (item) {
					return !!item.MdcMaterialFk;
				});
				commonUpdateItemPriceService.materialIds = _.map(itemsWithMaterial, 'MdcMaterialFk');

				if (!platformGridAPI.grids.exist(dataService.guid)) {
					platformGridControllerService.initListController($scope, itemPriceLayout, dataService, null, gridConfig);
				}
				var headerParentItem = dataService.parentService() ? dataService.parentService().getSelected() : null;
				dataService.setGridDataForItems(leadData, selectIds, $scope.currentItem, null, headerParentItem);
			}

			var unWatch = $scope.$watch(function watchFn() {
				return $scope.getCurrentStepNumber();
			}, function compareFn(newValue, oldValue) {
				if (newValue !== oldValue) {
					$scope.modalOptions.headerText = $scope.wizard.title + ($scope.wizard.title ? ' - ' : '') + $scope.getCurrentStepNumber() + ' / ' + $scope.getTotalStepCount();
				}
			});

			$scope.$on('$destroy', function destroyFn() {
				unWatch();
			});

		}]);

})(angular);
