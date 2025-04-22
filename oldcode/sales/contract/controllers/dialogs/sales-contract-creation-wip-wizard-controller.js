/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name salesContractCreationWipWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard creation WIP dialog
	 **/

	angular.module('sales.contract').controller('salesContractCreationWipWizardController',
		['_', '$scope', '$modalInstance', '$injector', '$translate', 'platformTranslateService', 'salesContractCreateWipWizardDialogService', 'salesContractCreateWizardDialogUIService', 'platformModalService',
			function (_, $scope, $modalInstance, $injector, $translate, platformTranslateService, salesContractCreateWipWizardDialogService, salesContractCreateWizardDialogUIService, platformModalService) {

				$scope.generateType = 'create';

				// we get the base form configuration and extend it by the contracts grid
				var formConfig = salesContractCreateWizardDialogUIService.getCreateOrUpdateWipFormConfig(onSelectedItemChangedHandler, $scope.generateType);
				var gridOptions = _.get(_.find(formConfig.rows, { rid: 'contractsGrid' }), 'options');

				$scope.entity = {};

				// preserve option flag IsCollectiveWIP, we take option from service here
				// TODO: for better testing
				$scope.entity.IsCollectiveWip = salesContractCreateWipWizardDialogService.getCollectiveWIP();

				$scope.loadFormConfig = function (generateType) {
					return salesContractCreateWizardDialogUIService.getCreateOrUpdateWipFormConfig(onSelectedItemChangedHandler, generateType);
				};

				$scope.formOptions = {
					configure: formConfig
				};

				$scope.modalOptions = {
					headerText: $scope.generateType === 'create' ? $translate.instant('sales.contract.wizardCWCreateWip') : $translate.instant('sales.contract.wizardCWUpdateWip'),
					ok: ok,
					cancel: close
				};

				$scope.loading = {
					show: false,
					text: $scope.generateType === 'create' ? $translate.instant('sales.contract.wizardCWCreateWipInProgress') : $translate.instant('sales.contract.wizardCWUpdateWipInProgress')
				};

				$scope.$on('salesContractSelectContracts:reloadedGrid', function () {
					var contracts = salesContractCreateWipWizardDialogService.getContracts();
					$scope.isOkDisabled = _.size(contracts) === 0;
				});

				$scope.$on('salesContractSelectContracts:IsMarkedChanged', function () {
					var contracts = salesContractCreateWipWizardDialogService.getContracts();
					$scope.isOkDisabled = _.size(_.filter(contracts, {'IsMarked': true})) === 0;
				});

				$scope.$watch('entity.IsCollectiveWip', function (newIsCollectiveWip/* , oldIsCollectiveWip */) {
					// toggle grid readonly
					gridOptions.readonly = newIsCollectiveWip;
					salesContractCreateWipWizardDialogService.setCollectiveWIP(newIsCollectiveWip);

					// make sure grid is reloaded
					$scope.$broadcast('reloadGrid');
				});

				$scope.$watch('entity.RubricCategoryFk', function (newRubricCat /* , oldRubricCat */) {
					// sales configuration: set default by rubric category
					$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
						var items = _.filter(data, {RubricCategoryFk: newRubricCat});
						if (_.size(items) > 0) {
							$scope.entity.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
						}
					});
				});

				$scope.$watch('entity.Code', function () {
					salesContractCreateWipWizardDialogService.getWipHeaderFk($scope.entity.WipHeaderFk);
					// make sure grid is reloaded
					$scope.$broadcast('reloadGrid');
				});
				function ok() {
					$scope.loading.show = true;
					if ($scope.generateType === 'create') {
						createWipFromContract();
					} else {
						updateWipFromContracts();
					}
				}

				function close() {
					$modalInstance.dismiss('cancel');
				}

				// suggest default previous wip from given main contract id
				function suggestPreviousWipId(mainContractId) {
					$injector.get('salesCommonDataHelperService').suggestPreviousWipId(mainContractId).then(function (response) {
						if (response && response.data) {
							if (response.data > 0) {
								var suggestedWipId = response.data;
								$scope.entity.PreviousWipId = suggestedWipId;
							}
						}
					});
				}

				function isOkDisabled(rubricCatId) {
					var lookupType = 'basicsMasterDataRubricCategoryLookupDataService';
					var lookupService = $injector.get(lookupType);
					lookupService.setFilter(17);
					lookupService.getList({lookupType: lookupType}).then(function () {
						var item = lookupService.getItemById(rubricCatId, {lookupType: lookupType});
						item = item || lookupService.getDefault({lookupType: lookupType});
						$scope.entity.RubricCategoryFk = item ? item.Id : null;
						$scope.isOkDisabled = _.isEmpty(item);
					});
				}

				function createWipFromContract() {
					var wipPromise = salesContractCreateWipWizardDialogService.createWipFromContracts($scope.entity);
					wipPromise.then(function (response) {
						var newWip = response.data;
						var navigator = {moduleName: 'sales.wip'};

						$scope.loading.show = false;

						close();

						var modalOptions = {
							templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
							headerText: $translate.instant('sales.common.wipCreated.header'),
							bodyText: $translate.instant('sales.common.wipCreated.body', {code: newWip.Code}),
							okBtnText: $translate.instant('sales.common.wipCreated.okBtn'),
							navigate: function() {
								$injector.get('platformModuleNavigationService').navigate(navigator, newWip);
								$injector.get('salesCommonUtilsService').toggleSideBarWizard();
								this.cancel();
							}
						};
						platformModalService.showDialog(modalOptions);
					},
					function () {
						$scope.loading.show = false;
					});
				}
				function updateWipFromContracts() {
					var wipPromise = salesContractCreateWipWizardDialogService.updateWipFromContracts($scope.entity);
					wipPromise.then(function (response) {
						var updatedWip = response.data;
						var navigator = { moduleName: 'sales.wip' };
						$scope.loading.show = false;
						close();
						var modalOptions = {
							templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
							headerText: $translate.instant('sales.common.wipUpdated.header'),
							bodyText: $translate.instant('sales.common.wipUpdated.body', { code: updatedWip.Code }),
							okBtnText: $translate.instant('sales.common.wipUpdated.okBtn'),
							navigate: function () {
								$injector.get('platformModuleNavigationService').navigate(navigator, updatedWip);
								$injector.get('salesCommonUtilsService').toggleSideBarWizard();
								this.cancel();
							}
						};
						platformModalService.showDialog(modalOptions);
					},
						function () {
							$scope.loading.show = false;
						});
				}
				$scope.onGenerateTypeChange = function (generateType) {
					$scope.generateType = generateType;
					$scope.generateType === 'create' ? $scope.modalOptions.headerText = $translate.instant('sales.contract.wizardCWCreateWip') : $scope.modalOptions.headerText = $translate.instant('sales.contract.wizardCWUpdateWip');

					var newFormConfig = $scope.loadFormConfig($scope.generateType);
					newFormConfig.groups = formConfig.groups;
					$scope.formOptions.configure = newFormConfig;
					$scope.$parent.$broadcast('form-config-updated', {});
				};

				$scope.onGenerateTypeChange($scope.generateType);

				function onSelectedItemChangedHandler(e, args) {
					salesContractCreateWipWizardDialogService.onRubricCategoryChanged.fire(args.selectedItem.Id);
				}

				// take description from selected contract (#113172)
				var selectedContract = salesContractCreateWipWizardDialogService.getContractSelected(); // it's a copy
				if (_.has(selectedContract, 'DescriptionInfo.Translated')) {
					$scope.entity.DescriptionInfo = selectedContract.DescriptionInfo;
				}

				// suggest a previous wip based on the given contract
				if (_.has(selectedContract, 'Id')) {
					// main contract or change/side contract?
					let mainContractId = selectedContract.OrdHeaderFk > 0 ? selectedContract.OrdHeaderFk : selectedContract.Id;
					suggestPreviousWipId(mainContractId);
				}

				salesContractCreateWipWizardDialogService.registerFilters();
				salesContractCreateWipWizardDialogService.onRubricCategoryChanged.register(isOkDisabled);
				salesContractCreateWipWizardDialogService.onRubricCategoryChanged.fire();

				$scope.$on('$destroy', function () {
					salesContractCreateWipWizardDialogService.unregisterFilters();
					salesContractCreateWipWizardDialogService.onRubricCategoryChanged.unregister(isOkDisabled);
				});
			}]);
})();
