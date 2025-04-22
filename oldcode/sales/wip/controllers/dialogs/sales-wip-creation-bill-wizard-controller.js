/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	// TODO: refactoring needed:
	// - dialog and select-wip directive
	// - integration of directive (-> options)

	/**
	 * @ngdoc controller
	 * @name salesWipCreationBillWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard creation bill dialog
	 **/

	angular.module('sales.wip').controller('salesWipCreationBillWizardController', [
		'globals', '_', '$scope', '$http', '$modalInstance', '$injector', '$translate', 'salesWipCreateBillWizardDialogService', 'salesWipCreateWizardDialogUIService', 'basicsLookupdataLookupFilterService', 'platformModalService', 'salesCommonRubric',
		function (globals, _, $scope, $http, $modalInstance, $injector, $translate, salesWipCreateBillWizardDialogService, salesWipCreateWizardDialogUIService, basicsLookupdataLookupFilterService, platformModalService, salesCommonRubric) {

			$scope.generateType = 'create';
			var selectedWip = salesWipCreateBillWizardDialogService.getWIPSelected();
			$scope.wips = salesWipCreateBillWizardDialogService.getWIPsFromSameContract();

			// filters
			var lookupFilters = [
				{
					key: 'sales-wip-create-bill-wizard-previous-bill-filter',
					serverKey: 'sales-billing-previousbill-filter-by-server',
					serverSide: true,
					fn: function (wip/* , state */) {
						// if project already selected, show only bills from project, otherwise all
						// if we have even a contract selected, show only bills from contract
						return {
							OrdHeaderFk: wip.BillToFk !== null ? null : wip.OrdHeaderFk,
							ProjectFk: wip.ProjectFk
						};
					}
				},
				{
					key: 'sales-billing-configuration-filter',
					serverSide: true,
					fn: function (entity) {
						var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
						return `RubricFk=${salesCommonRubric.Billing}${rubricCat}`;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

			// form entity
			$scope.entity = {
				TypeFk: null,
				ConfigurationFk: null,
				RubricCategoryFk: _.get(selectedWip, 'RubricCategoryFk') || null,
				OrdHeaderFk: _.get(selectedWip, 'OrdHeaderFk') || null,
				ProjectFk: _.get(selectedWip, 'ProjectFk') || null,
				BillToFk: null,
				PreviousBillFk: null,
				Description: '',
				BillNo: '',
				CompanyFk: selectedWip.CompanyFk,
				Id: selectedWip.Id
			};
			// make rubric category readonly (after billing type was introduced)
			$injector.get('platformRuntimeDataService').readonly($scope.entity, [{
				field: 'RubricCategoryFk',
				readonly: true
			}]);

			// set default billing type
			function getDefaultBillingType() {
				return $injector.get('salesBillTypeLookupDataService').getDefaultAsync();
			}

			// bill no config
			function billNoConf(entity, value) {
				var hasToBeGenerated = $injector.get('salesBillingNumberGenerationSettingsService').hasToGenerateForRubricCategory(value);
				// TODO: better if validation method will be triggered instead and includes this case "is generated" as a valid case
				$injector.get('salesCommonUtilsService').deleteFromErrorList(entity, 'BillNo');
				$injector.get('platformRuntimeDataService').readonly(entity, [{
					field: 'BillNo',
					readonly: hasToBeGenerated
				}]);
				entity.BillNo = $injector.get('salesBillingNumberGenerationSettingsService').provideNumberDefaultText(value, entity.BillNo);
			}

			getDefaultBillingType().then(function (typeEntity) {
				$scope.entity.TypeFk = _.get(typeEntity, 'Id');
				// update bill no config on selecting type
				billNoConf($scope.entity, _.get(typeEntity, 'RubricCategoryFk'));
			});

			$scope.formOptions = {
				configure: salesWipCreateWizardDialogUIService.getCreateBillFormConfiguration(
					function onSelectedItemChangedHandler(e, args) {
						var rubricCatId = args.selectedItem.Id;
						isRubricCat(rubricCatId);
					},
					'sales-wip-rubric-category-by-customer-billing-filter' // Customer Billing ([BAS_RUBRIC]))
				)
			};

			// To make type fk required
			_.find($scope.formOptions.configure.rows, { rid: 'typeFk' }).required = true;
			// Add filter to typeFk
			_.find($scope.formOptions.configure.rows, { rid: 'typeFk' }).options.filterKey = 'sales-billing-type-with-rubric-filter';
			// To make rubric category required
			_.find($scope.formOptions.configure.rows, { rid: 'rubricCategoryFk' }).required = true;

			// Bill no field
			var billNo = {
				gid: 'baseGroup',
				rid: 'billNo',
				label: 'Bill No',
				label$tr$: 'sales.billing.entityBillNo',
				model: 'BillNo',
				required: true,
				type: 'code',
				sortOrder: 2,
				visible: true,
				asyncValidator: function (entity, value) {
					return $injector.get('salesBillingValidationHelperService').asyncValidateBillNo(entity.CompanyFk, value);
				}
			};
			$scope.formOptions.configure.rows.push(billNo);
			
			function suggestPreviousBill() {
				if (_.has(selectedWip, 'OrdHeaderFk') && selectedWip.OrdHeaderFk > 0) {
					var contractId = selectedWip.OrdHeaderFk;
					return $http.post(globals.webApiBaseUrl + 'sales/billing/suggestpreviousbillid?contractId=' + contractId).then(function successCallback(response) {
						var previousBillId = response.data;
						if (previousBillId > 0) {
							$scope.entity.PreviousBillFk = previousBillId;
						}
					}, function errorCallback(/* response */) {
						/* insert error handling here */
					});
				}
			}

			// add validation to billing type
			var typeRow = _.find($scope.formOptions.configure.rows, {rid: 'typeFk'});
			typeRow.validator = function validateSelectedType(entity, value) {
				$injector.get('salesBillTypeLookupDataService').getItemByIdAsync(value).then(function (typeEntity) {
					// no previous bill on single invoice (by default, not read only for now)
					if (typeEntity.IsSingle) {
						entity.PreviousBillFk = null;
					} else {
						suggestPreviousBill();
					}
					// populate related values like rubric category
					var rubricCategoryId = typeEntity.RubricCategoryFk;
					entity.RubricCategoryFk = rubricCategoryId;

					// update bill no config on changing type
					billNoConf($scope.entity, rubricCategoryId);
				});
			};

			$scope.modalOptions = {
				headerText: $translate.instant('sales.wip.wizardCWCreateBill'),
				ok: ok,
				cancel: close
			};

			$scope.loading = {
				show: false,
				text: $scope.generateType === 'create' ? $translate.instant('sales.wip.wizardCWCreateBillInProgress') : $translate.instant('sales.wip.wizardCWUpdateBillInProgress')
			};

			$scope.$watch('wips', function () {
				// at least one wip should be selected
				$scope.isWipSelected = _.size(_.filter($scope.wips, {'IsMarked': true})) > 0;
			}, true);

			// disable [OK]-Button?
			$scope.$watchGroup(['isWipSelected', 'isRubricCat','entity.BillNo'], function () {
				$scope.isOkDisabled = !$scope.isRubricCat || !$scope.isWipSelected || _.isEmpty($scope.entity.BillNo)
					|| $scope.entity.BillNo === undefined || $injector.get('platformRuntimeDataService').hasError($scope.entity, 'BillNo');
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


			function createBillFromWips() {
				var selectedWips = _.filter($scope.wips, { 'IsMarked': true });
				var wipIds = _.map(selectedWips, 'Id');
				salesWipCreateBillWizardDialogService.createBillFromWIPs($scope.entity.Description, $scope.entity.TypeFk, $scope.entity.ConfigurationFk, $scope.entity.PreviousBillFk, wipIds, $scope.entity.BillToFk, $scope.entity.BillNo).then(function (response) {
					$scope.loading.show = false;
					close();

					var newBill = response.data;
					var wipIds = [];
					selectedWips.forEach(wipEntity => wipIds.push(wipEntity.Id));
					salesWipCreateBillWizardDialogService.transferLineItemQuantitiesToBill(newBill.Id, wipIds, newBill.ProjectFk, newBill.PreviousBillFk || 0);
					var navigator = { moduleName: 'sales.billing' };


					var modalOptions = {
						templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
						headerText: $translate.instant('sales.common.billCreated.header'),
						bodyText: $translate.instant('sales.common.billCreated.body', { code: newBill.Code }),
						okBtnText: $translate.instant('sales.common.billCreated.okBtn'),
						navigate: function () {
							$injector.get('platformModuleNavigationService').navigate(navigator, newBill);
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

			function updateBillFromWips() {
				var selectedWips = _.filter($scope.wips, { 'IsMarked': true });
				var wipIds = _.map(selectedWips, 'Id');
				salesWipCreateBillWizardDialogService.updateBillFromWIPs($scope.entity, wipIds).then(function (response) {
					$scope.loading.show = false;
					close();

					var newBill = response.data;
					var wipIds = [];
					selectedWips.forEach(wipEntity => wipIds.push(wipEntity.Id));
					salesWipCreateBillWizardDialogService.transferLineItemQuantitiesToBill(newBill.Id, wipIds, newBill.ProjectFk, newBill.PreviousBillFk || 0);
					var navigator = { moduleName: 'sales.billing' };


					var modalOptions = {
						templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
						headerText: $translate.instant('sales.common.billUpdated.header'),
						bodyText: $translate.instant('sales.common.billUpdated.body', { code: newBill.Code }),
						okBtnText: $translate.instant('sales.common.billUpdated.okBtn'),
						navigate: function () {
							$injector.get('platformModuleNavigationService').navigate(navigator, newBill);
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
			function ok() {
				$scope.loading.show = true;

				if ($scope.generateType === 'create') {
					createBillFromWips();
				} else {
					updateBillFromWips();
				}
			}

			function close() {
				return $modalInstance.dismiss('cancel');
			}

			function isRubricCat(rubricCatId) {
				rubricCatId = rubricCatId || $scope.entity.RubricCategoryFk;
				var lookupType = 'basicsMasterDataRubricCategoryLookupDataService';
				var lookupService = $injector.get(lookupType);
				lookupService.setFilter(7);
				lookupService.getList({lookupType: lookupType}).then(function () {
					var item = lookupService.getItemById(rubricCatId, {lookupType: lookupType});
					item = item || lookupService.getDefault({lookupType: lookupType});
					$scope.entity.RubricCategoryFk = item ? item.Id : null;
					$scope.isRubricCat = !_.isEmpty(item);
				});
			}

			isRubricCat();

			suggestPreviousBill();

			salesWipCreateBillWizardDialogService.registerFilters();

			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(lookupFilters);
				salesWipCreateBillWizardDialogService.unregisterFilters();
			});
			$scope.onGenerateTypeChange = function (generateType) {
				let billNoIndex = $scope.formOptions.configure.rows.findIndex(row => row.rid === 'billNo');
				$scope.generateType = generateType;
				if ($scope.generateType === 'update') {
					$scope.formOptions.configure.rows[billNoIndex] = {
						gid: 'baseGroup',
						rid: 'billNo',
						label: 'Bill No',
						label$tr$: 'sales.billing.entityBillNo',
						model: 'Code',
						required: true,
						type: 'directive',
						directive: 'sales-billing-code-selector',
						options: {
							filterKey: 'sales-billing-no-filter',
							valueMember: 'Code',
							displayMember: 'Code',
						},
						sortOrder: 2,
						visible: true,
					};
				}
				else if ($scope.generateType === 'create') {
					$scope.formOptions.configure.rows[billNoIndex] = billNo;
				}
				$scope.generateType === 'create' ? $scope.modalOptions.headerText = $translate.instant('sales.wip.wizardCWCreateBill') : $scope.modalOptions.headerText = $translate.instant('sales.wip.wizardCWUpdateBill');
				$scope.$parent.$broadcast('form-config-updated', {});
			};
			$scope.onGenerateTypeChange($scope.generateType);

		}]);
})();
