/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name salesContractBillFromPaymentScheduleWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard generate BillFromPaymentScheduleWizardController dialog
	 **/

	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractBillFromPaymentScheduleWizardController', [
		'globals', '_', '$http', '$scope', '$modalInstance', '$injector', '$translate', 'platformRuntimeDataService', 'platformGridAPI', 'platformTranslateService', 'platformModalService', 'salesContractBillFromPaymentScheduleWizardDialogService', 'salesContractBillFromPaymentScheduleWizardDialogUIService', 'basicsLookupdataLookupFilterService', 'salesWipBoqService',
		function (globals, _, $http, $scope, $modalInstance, $injector, $translate, platformRuntimeDataService, platformGridAPI, platformTranslateService, platformModalService, salesContractBillFromPaymentScheduleWizardDialogService, salesContractBillFromPaymentScheduleWizardDialogUIService, basicsLookupdataLookupFilterService, salesWipBoqService) {

			var paymentScheduleAllColumns = angular.copy($injector.get('salesContractPaymentScheduleUIStandardService').getStandardConfigForListView().columns);
			var paymentScheduleColumns = _.filter(paymentScheduleAllColumns, function (item) {
				return ['code', 'description', 'amountnet', 'amountgross', 'datepayment', 'daterequest'].indexOf(item.id) > -1;
			});

			var wipStatusLookup = $injector.get('salesWipStatusLookupDataService');
			var wipStatusIsApproved = {};
			wipStatusLookup.getList({}).then(function(data) {
				if (data) {
					_.forEach(data, function (d) {
						if (d.IsAccepted) {
							wipStatusIsApproved[d.Id] = d;
						}
					});
				}
			});

			$scope.modalOptions = {
				headerText: $translate.instant('sales.contract.generateBillFromPaymentSchedule'),
				ok: ok,
				cancel: close,
				hasBoqs: salesContractBillFromPaymentScheduleWizardDialogService.hasBoqs()
			};

			// Grid form
			$scope.gridPaymentScheduleId = '9c2c3995a56b4eb2addbaed52b99a646';
			$scope.gridData = {
				state: $scope.gridPaymentScheduleId
			};

			if (!platformGridAPI.grids.exist($scope.gridPaymentScheduleId)) {
				var gridConfig = {
					data: [],
					columns: paymentScheduleColumns,
					id: $scope.gridPaymentScheduleId,
					lazyInit: true,
					isStaticGrid: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					},
					enableConfigSave: false
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

			} else {
				platformGridAPI.columns.configuration($scope.gridPaymentScheduleId, paymentScheduleColumns);
			}

			setTimeout(function () {
				var gridList = [salesContractBillFromPaymentScheduleWizardDialogService.getContractPaymentScheduleSelected()];
				var fields = [];
				_.forEach(gridList, function (item) {
					_.forOwn(item, function (value, key) {
						var field = {field: key, readonly: true};
						fields.push(field);
					});
					platformRuntimeDataService.readonly(item, fields);
				});
				platformGridAPI.items.data($scope.gridPaymentScheduleId, gridList);
			}, 100);

			// Detail form
			salesContractBillFromPaymentScheduleWizardDialogService.resetToDefault($scope);
			$scope.entity = salesContractBillFromPaymentScheduleWizardDialogService.getDataItem();

			$scope.formOptions = {
				configure: salesContractBillFromPaymentScheduleWizardDialogUIService.getGenerateFormConfiguration()
			};

			function setReadOnlyFields() {
				var readOnly = $scope.entity.RadioType === '0';

				var fields = [];
				fields.push({field: 'WipFk', readonly: readOnly});
				fields.push({field: 'BoqFk', readonly: !readOnly});
				fields.push({field: 'TypeFk', readonly: $scope.entity.TypeFk > 0});
				fields.push({field: 'RubricCategoryFk', readonly: true});

				platformRuntimeDataService.readonly($scope.entity, fields);
			}

			$scope.radioOptionChanged = function radioOptionChanged() {
				if ($scope.entity.RadioType === '0') {
					var salesContractBoqService = $injector.get('salesContractBoqService');
					salesContractBoqService.setFilter('contractId=' + salesContractBillFromPaymentScheduleWizardDialogService.getContractSelected().Id);
					salesContractBoqService.load().then(function (contractBoqs) {
						// Attached to lookup
						$injector.invoke(['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
							basicsLookupdataLookupDescriptorService.removeData('salesContractExistedBoqs');
							basicsLookupdataLookupDescriptorService.updateData('salesContractExistedBoqs', contractBoqs);
						}]);
					});
				}

				$scope.entity.BoqFk = null;
				$scope.entity.WipFk = null;

				setReadOnlyFields();
			};

			$scope.change = function change(entity, model) {
				if (entity.WipFk === null) {
					var fields = [{field: 'BoqFk', readonly: false}];
					platformRuntimeDataService.readonly($scope.entity, fields);
				} else if (_.isNumber(entity.WipFk) !== null && model !== 'BoqFk') {
					// If BoqFk is updated we do not re-upload again the boq lookup
					// Download Boqs by WIP
					salesWipBoqService.setFilter('wipId=' + entity.WipFk);
					salesWipBoqService.load().then(function (wipBoqs) {

						if (!_.isEmpty(wipBoqs)) {
							// Do not select any BoqFk when WIP option is chosen
							// var boqSelected = _.first(angular.copy(wipBoqs));
							// $scope.entity.BoqHeaderFk = boqSelected.BoqHeader.Id;
							// $scope.entity.BoqFk = boqSelected.Id;

							$injector.invoke(['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
								basicsLookupdataLookupDescriptorService.removeData('salesContractExistedBoqs');
								basicsLookupdataLookupDescriptorService.updateData('salesContractExistedBoqs', wipBoqs);
							}]);

							var readOnly = true;
							var fields = [];
							fields.push({field: 'BoqFk', readonly: readOnly});
							platformRuntimeDataService.readonly($scope.entity, fields);
						}
					});
				}
			};

			$scope.loading = {
				show: false,
				text: $translate.instant('sales.contract.generateBillFromPaymentScheduleInProgress')
			};

			function ok() {
				if ($scope.entity.RadioType === '0') {
					// Continue to generate Contract
					$scope.loading.show = true;
					generateContractBillFromPaymentSchedule();
				} else if ($scope.entity.RadioType === '1') {
					var ids = [$scope.entity.WipFk];
					$http.post(globals.webApiBaseUrl + 'sales/wip/wipsbyids', ids).then(function (response) {
						var wipHeaderList = response.data;
						var wipEntity = _.find(wipHeaderList, {Id: $scope.entity.WipFk});

						if (wipEntity && wipEntity.Id) {
							// Check WIP status
							var wipStatusLookup = $injector.get('salesWipStatusLookupDataService');
							wipStatusLookup.getItemByIdAsync(wipEntity.WipStatusFk, {dataServiceName: 'salesWipStatusLookupDataService'}).then(function (wipStatus) {
								if (!wipStatus.IsAccepted) {
									platformModalService.showMsgBox('sales.wip.wizardCWCreateBillWipNotAcceptedInfo', 'sales.wip.wizardCWCreateBill', 'info');
									return;
								}

								// Continue to generate Contract
								$scope.loading.show = true;
								generateContractBillFromPaymentSchedule();
							});
						}
					});
				}
			}

			function close() {
				$modalInstance.dismiss('cancel');
			}

			function generateContractBillFromPaymentSchedule() {
				salesContractBillFromPaymentScheduleWizardDialogService.generateContractBillFromPaymentSchedule($scope.entity).then(function (response) {
					var billCreated = response.data;
					if (billCreated) {
						var navigator = {moduleName: 'sales.billing'};

						$scope.loading.show = false;

						close();

						platformModalService.showYesNoDialog('Create Bill Successfully! Open Created Bill?', 'sales.contract.generateBillFromPaymentSchedule', 'no')
							.then(function (response) {
								if (response.yes) {
									$injector.get('platformModuleNavigationService').navigate(navigator, billCreated);
									$injector.get('salesCommonUtilsService').toggleSideBarWizard();
								}

								// Refresh payment schedule to show Bill assignment
								$injector.get('salesContractPaymentScheduleDataService').load();
							});

					} else {
						// show error message box
						// platformModalService.showErrorBox('An error has occurred, Please try again later', 'cloud.common.errorMessage');
						$scope.loading.show = false;
					}
				},
				function () {
					$scope.loading.show = false;
				});
			}

			var salesContractBillFromPaymentScheduleFilter = [
				{
					key: 'sales-contract-bill-from-payment-schedule-filter',
					fn: function (contract, entity) {
						// if project already selected, show only contracts from project, otherwise all
						var restrictToProject = entity.ProjectFk ? contract.ProjectFk === entity.ProjectFk : true;
						// only contracts allowed which do not reference other contracts
						// also do not allow self reference
						return contract.Id === entity.Id ? false : contract.OrdHeaderFk === null && restrictToProject;
					}
				},
				{

					key: 'sales-contract-bill-from-contract-wip-filter',
					fn: function (wip, entity) {
						if (wip && wip.OrdHeaderFk === entity.Id && wipStatusIsApproved[wip.WipStatusFk]) {
							return true;
						}
						return false;
					}
				},
				{
					key: 'sales-contract-billing-previousbill-filter-by-server',
					serverKey: 'sales-billing-previousbill-filter-by-server',
					serverSide: true,
					fn: function (paymentSchedule/* , state */) {
						// if project already selected, show only bills from project, otherwise all
						// if we have even a contract selected, show only bills from contract
						var contractSelected = salesContractBillFromPaymentScheduleWizardDialogService.getContractSelected();
						return {
							IsSetPreviousBillWizard: true,
							OrdHeaderFk: contractSelected.Id,
							ProjectFk: paymentSchedule.ProjectFk
						};
					}
				}
			];
			$scope.$watch('entity.RubricCategoryFk', function (newRubricCat /* , oldRubricCat */) {
				// sales configuration: set default by rubric category
				$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: newRubricCat});
					if (_.size(items) > 0) {
						$scope.entity.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
					}
				});
			});
			function init() {
				setReadOnlyFields();
			}

			init();

			basicsLookupdataLookupFilterService.registerFilter(salesContractBillFromPaymentScheduleFilter);

			// disable [OK]-Button?
			$scope.$watchGroup(['entity.WipFk', 'entity.BoqFk', 'entity.TypeFk', 'entity.BillNo', 'entity.ResponsibleCompanyFk', 'entity.ClerkFk'], function () {
				if ($scope.entity.RadioType === '0') {
					$scope.isOkDisabled = !$scope.entity.BoqFk || !$scope.entity.TypeFk || (!$scope.entity.BillNo && !$scope.entity.ConfigurationFk ) || !$scope.entity.ResponsibleCompanyFk || !$scope.entity.ClerkFk || platformRuntimeDataService.hasError($scope.entity, 'BillNo');
				}else if ($scope.entity.RadioType === '1'){
					// $scope.isOkDisabled = !$scope.entity.WipFk || !$scope.entity.BoqFk  || !$scope.entity.TypeFk || !$scope.entity.BillNo || !$scope.entity.ResponsibleCompanyFk || !$scope.entity.ClerkFk || platformRuntimeDataService.hasError($scope.entity, 'BillNo');
					$scope.isOkDisabled = !$scope.entity.WipFk || !$scope.entity.TypeFk || (!$scope.entity.BillNo && !$scope.entity.ConfigurationFk ) || !$scope.entity.ResponsibleCompanyFk || !$scope.entity.ClerkFk || platformRuntimeDataService.hasError($scope.entity, 'BillNo');
				}
				// $scope.isOkDisabled = !($scope.entity.RadioType === '0' ? $scope.entity.BoqFk : $scope.entity.WipFk) ||
				//  !$scope.entity.TypeFk || !$scope.entity.BillNo || !$scope.entity.ResponsibleCompanyFk || !$scope.entity.ClerkFk || platformRuntimeDataService.hasError($scope.entity, 'BillNo');
			});

			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(salesContractBillFromPaymentScheduleFilter);
			});
		}]);
})();
