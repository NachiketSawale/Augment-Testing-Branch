/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'sales.common';

	angular.module(moduleName).controller('salesCommonChangeSalesTypeOrConfigurationController',
		['_', '$scope', '$injector', '$rootScope', 'platformTranslateService', 'salesCommonChangeSalesTypeOrConfigurationUIService',
			function (_, $scope, $injector, $rootScope, platformTranslateService, salesCommonChangeSalesTypeOrConfigurationUIService) {

				let formConfig = salesCommonChangeSalesTypeOrConfigurationUIService.getFormConfig();
				let context = salesCommonChangeSalesTypeOrConfigurationUIService.getContext();
				let mainService = context.mainService;
				let selectedItem = $injector.get(mainService).getSelected();
				let okBtn = $scope.dialog.getButtonById('ok');

				$scope.entity = {
					ContractId :selectedItem.Id,
					TypeFk: selectedItem.TypeFk,
					RubricCategoryFk: selectedItem.RubricCategoryFk,
					ConfigurationFk: selectedItem.ConfigurationFk,
					OrdHeaderFk: selectedItem.OrdHeaderFk,
					BidHeaderFk: selectedItem.BidHeaderFk,
					ChangeEntityFk: selectedItem.PrjChangeFk
				};

				platformTranslateService.translateFormConfig(formConfig);

				$scope.formContainerOptions = {
					formOptions: {
						configure: formConfig
					}
				};

				$scope.$watch('entity.TypeFk', function (newTypeId) {
					// TODO: For Sales.Bid
					if (context.id === 1) {
						$injector.get('salesBidTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							let mainContract = _.find(formConfig.rows, {model: 'OrdHeaderFk'});
							let mainBid = _.find(formConfig.rows, {model: 'BidHeaderFk'});
							let changeOrder = _.find(formConfig.rows, {model: 'ChangeEntityFk'});
							if (typeEntity.IsMain) {
								mainContract.visible = false;
								mainBid.required = false;
								mainBid.visible = false;
								changeOrder.visible = false;
								changeOrder.required = false;
								$scope.entity.BidHeaderFk = null;
								$scope.entity.ChangeEntityFk = null;
							}
							else if (typeEntity.IsSide) {
								mainContract.visible = false;
								changeOrder.visible = false;
								changeOrder.required = false;
								mainBid.required = true;
								mainBid.visible = true;
								$scope.entity.ChangeEntityFk = null;
							}
							else if (typeEntity.IsChange) {
								mainContract.visible = false;
								mainBid.visible = true;
								mainBid.required = true;
								changeOrder.required = true;
								changeOrder.readonly = false;
								changeOrder.visible = true;
							}
							$scope.$broadcast('form-config-updated');
						});
					}
					// TODO: For Sales.Contract
					else if (context.id === 2) {
						$injector.get('salesContractTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
							let mainContract = _.find(formConfig.rows, {model: 'OrdHeaderFk'});
							let mainBid = _.find(formConfig.rows, {model: 'BidHeaderFk'});
							let changeOrder = _.find(formConfig.rows, {model: 'ChangeEntityFk'});
							if (typeEntity.IsMain) {
								mainContract.visible = false;
								mainContract.required = false;
								mainBid.visible = false;
								changeOrder.visible = false;
								changeOrder.required = false;
								$scope.entity.OrdHeaderFk = null;
								$scope.entity.ChangeEntityFk = null;
							}
							else if (typeEntity.IsSide) {
								mainBid.visible = false;
								changeOrder.visible = false;
								changeOrder.required = false;
								mainContract.required = true;
								mainContract.visible = true;
								$scope.entity.ChangeEntityFk = null;
							}
							else if (typeEntity.IsChange) {
								mainBid.visible = false;
								mainContract.visible = true;
								mainContract.required = true;
								changeOrder.required = true;
								changeOrder.readonly = false;
								changeOrder.visible = true;
							}
							$scope.$broadcast('form-config-updated');
						});
					}
					// TODO: For Sales.Wip
					else if (context.id === 3) {
						let mainContract = _.find(formConfig.rows, {model: 'OrdHeaderFk'});
						let mainBid = _.find(formConfig.rows, {model: 'BidHeaderFk'});
						let changeOrder = _.find(formConfig.rows, {model: 'ChangeEntityFk'});
						let typeFk = _.find(formConfig.rows, {model: 'TypeFk'});
						let rubricCat = _.find(formConfig.rows, {model: 'RubricCategoryFk'});
						typeFk.readonly = true;
						typeFk.visible = false;
						mainContract.visible = false;
						mainContract.required = false;
						mainBid.visible = false;
						changeOrder.visible = false;
						changeOrder.required = false;
						rubricCat.readonly = false;
						$scope.entity.TypeFk = null;
						$scope.$broadcast('form-config-updated');
					}
					// TODO: For Sales.Bill
					else if (context.id === 4) {
						let mainContract = _.find(formConfig.rows, {model: 'OrdHeaderFk'});
						let mainBid = _.find(formConfig.rows, {model: 'BidHeaderFk'});
						let changeOrder = _.find(formConfig.rows, {model: 'ChangeEntityFk'});
						mainContract.visible = false;
						mainContract.required = false;
						mainBid.visible = false;
						changeOrder.visible = false;
						changeOrder.required = false;
						$scope.$broadcast('form-config-updated');
					}
				});

				$scope.$watch('entity.RubricCategoryFk', function () {
					if (!context.id) {
						return $scope.$broadcast('form-config-updated');
					}

					const rubricId = $scope.entity.RubricCategoryFk;
					const salesCommonDataHelper = $injector.get('salesCommonDataHelperService');

					salesCommonDataHelper.getDefaultOrFirstSalesConfig(rubricId)
						.then(function (configurationId) {
							$scope.entity.ConfigurationFk = configurationId;
							$scope.$broadcast('form-config-updated');
						});
				});

				$scope.$watch('entity.ConfigurationFk', function () {
					let rubricId = $scope.entity.RubricCategoryFk;
					let rubricIndex = '';
					let numberRangeService = null;
					let salesConfig = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', $scope.entity.ConfigurationFk);

					if (context.id === 1) {
						numberRangeService = $injector.get('salesBidNumberGenerationSettingsService');
						selectedItem.Code = numberRangeService.provideNumberDefaultText(rubricId, selectedItem.Code, rubricIndex);
					}
					if (context.id === 2) {
						numberRangeService = $injector.get('salesContractNumberGenerationSettingsService');
						selectedItem.Code = numberRangeService.provideNumberDefaultText(rubricId, selectedItem.Code, rubricIndex);
					}
					if (context.id === 3) {
						numberRangeService = $injector.get('salesWipNumberGenerationSettingsService');
						selectedItem.Code = numberRangeService.provideNumberDefaultText(rubricId, selectedItem.Code, rubricIndex);
					}
					if (context.id === 4) {
						numberRangeService = $injector.get('salesBillingNumberGenerationSettingsService');
						selectedItem.BillNo = numberRangeService.provideNumberDefaultText(rubricId, selectedItem.BillNo, rubricIndex);
					}
					// todo: taken over payment data if mainItem not having payment data
					selectedItem.PaymentTermPaFk = salesConfig ? salesConfig.PaymentTermPaFk !== null ? salesConfig.PaymentTermPaFk : null:null;
					selectedItem.PaymentTermFiFk = salesConfig ? salesConfig.PaymentTermFiFk !== null ? salesConfig.PaymentTermFiFk : null:null;
				});

				okBtn.disabled = function () { // OK Button logic
					let mainItem;
					let typeId = $scope.entity.TypeFk;
					let rubCatId = $scope.entity.RubricCategoryFk;
					let configId = $scope.entity.ConfigurationFk;
					let changeItem = $scope.entity.ChangeEntityFk;

					$scope.dialog.modalOptions.value = $scope.entity;
					$scope.dialog.modalOptions.value.TypeFk = typeId;
					$scope.dialog.modalOptions.value.RubricCategoryFk = rubCatId;
					$scope.dialog.modalOptions.value.ConfigurationFk = configId;
					$scope.dialog.modalOptions.value.ChangeEntityFk = changeItem;
					$scope.dialog.modalOptions.value.OrdHeaderFk = $scope.entity.OrdHeaderFk;
					$scope.dialog.modalOptions.value.BidHeaderFk = $scope.entity.BidHeaderFk;
					mainItem = context.id === 1 ? $scope.entity.BidHeaderFk : $scope.entity.OrdHeaderFk;

					// For BID & Sales Contract module
					if (context.id === 1 || context.id === 2) {
						if (typeId === 1 && !_.isNull(rubCatId) && !_.isNull(configId) && _.isNull(mainItem) && _.isNull(changeItem)) {
							return false;
						}
						if (typeId === 2 && !_.isNull(rubCatId) && !_.isNull(configId) && !_.isNull(mainItem) && !_.isNull(changeItem)) {
							return false;
						}
						if (typeId === 3 && !_.isNull(rubCatId) && !_.isNull(configId) && !_.isNull(mainItem) && _.isNull(changeItem)) {
							return false;
						}
					}
					// For WIP module
					if (context.id === 3){
						if (!_.isNull(rubCatId) && !_.isNull(configId)) {
							return false;
						}
					}
					// For Bill module
					if (context.id === 4){
						if (!_.isNull(typeId) && !_.isNull(rubCatId) && !_.isNull(configId)) {
							return false;
						}
					}
					else {
						return true;
					}
				};
			}
		]
	);
})();