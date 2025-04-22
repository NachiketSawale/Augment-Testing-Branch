/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name salesContractCreationBillWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard creation bill dialog
	 **/

	angular.module('sales.contract').controller('salesContractCreationBillWizardController', [
		'$scope', '$modalInstance', '$injector', '$translate', '_', 'salesContractCreateBillWizardDialogService', 'salesContractCreateWizardDialogUIService', 'salesBillingFilterService', 'salesCommonDataHelperService', 'salesBillTypeLookupDataService', 'salesBillingNumberGenerationSettingsService', 'platformModalService', 'basicsLookupdataLookupFilterService',
		function ($scope, $modalInstance, $injector, $translate, _, salesContractCreateBillWizardDialogService, salesContractCreateWizardDialogUIService, salesBillingFilterService, salesCommonDataHelperService, salesBillTypeLookupDataService, salesBillingNumberGenerationSettingsService, platformModalService, basicsLookupdataLookupFilterService) {

			$scope.entity = salesContractCreateBillWizardDialogService.getContractSelected();
			var filterKey = 'sales-contract-rubric-category-by-customer-billing-filter';

			// make rubric category readonly (after billing type was introduced)
			$injector.get('platformRuntimeDataService').readonly($scope.entity, [{field: 'RubricCategoryFk', readonly: true}]);

			// set default billing type
			function getDefaultBillingType() {
				return salesBillTypeLookupDataService.getDefaultAsync();
			}

			getDefaultBillingType().then(function (typeEntity) {
				$scope.entity.TypeFk = _.get(typeEntity, 'Id');
				// suggest previous bill
				suggestPreviousBillId($scope.entity.Id);
				// bill no config
				billNoConf($scope.entity, _.get(typeEntity, 'RubricCategoryFk'));
			});

			// suggest default previous Bill from Contract Id
			function suggestPreviousBillId(contractId, typeFk = $scope.entity.TypeFk) {
				if (typeFk) {
					salesBillTypeLookupDataService.getItemByIdAsync(typeFk).then(function (typeEntity) {
						if (!typeEntity.IsSingle) {
							return salesCommonDataHelperService.suggestPreviousBillId(contractId).then(function (response) {
								if (response && response.data && response.data > 0) {
									$scope.entity.PreviousBillFk = response.data;
								}
							});
						} else {
							$scope.entity.PreviousBillFk = null;
						}
					});
				}
			}

			// bill no config
			function billNoConf(entity, value) {
				var hasToBeGenerated = salesBillingNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
				// TODO: better if validation method will be triggered instead and includes this case "is generated" as a valid case
				$injector.get('salesCommonUtilsService').deleteFromErrorList(entity, 'BillNo');
				$injector.get('platformRuntimeDataService').readonly(entity, [{
					field: 'BillNo',
					readonly: hasToBeGenerated
				}]);
				entity.BillNo = salesBillingNumberGenerationSettingsService.provideNumberDefaultText(value, entity.BillNo);
			}

			salesBillingFilterService.registerBillingFilters();

			// set default options
			$scope.entity._opts = {
				transferContractQuantity: false
			};

			var config = salesContractCreateWizardDialogUIService.getCreateBillFormConfig(onSelectedItemChangedHandler, filterKey); // Customer Billing ([BAS_RUBRIC]))

			// To make rubric category required
			_.find(config.rows, { rid: 'rubricCategoryFk' }).required = true;

			var billingTypeLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideGenericLookupConfigForForm(
				'basics.customize.billtype',
				'Description',
				{
					gid: 'baseGroup',
					rid: 'typefk',
					model: 'TypeFk',
					label: 'Type',
					label$tr$: 'sales.billing.entityBillTypeFk',
					validator: function validateSelectedType(entity, value) {
						// populate related values like rubric category
						salesBillTypeLookupDataService.getItemByIdAsync(value).then(function (typeEntity) {
							entity.RubricCategoryFk = typeEntity.RubricCategoryFk;
							billNoConf(entity, entity.RubricCategoryFk);
							if (!typeEntity.IsSingle) {
								salesCommonDataHelperService.suggestPreviousBillId($scope.entity.Id)
									.then(function successCallback(response) {
										entity.PreviousBillFk = response.data;
									}, function errorCallback(/* response */) {
										/* insert error handling here */
									});
							} else {
								$scope.entity.PreviousBillFk = null;
							}
						});
					},
					required: true,
				},
				false, // caution: this parameter is ignored by the function
				{
					required: true,
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					filterKey: 'sales-billing-type-with-rubric-filter'
				}
			);
			var previousBillLookupConfig = {
				gid: 'baseGroup',
				rid: 'previousBillFk',
				model: 'PreviousBillFk',
				sortOrder: 1,
				label: 'Previous Bill',
				label$tr$: 'sales.common.PreviousBill',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'sales-common-bill-dialog-v2',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						filterKey: 'sales-contract-previous-bill-filter',
						showClearButton: true
					}
				}
			};
			config.rows.push(previousBillLookupConfig);

			// Bill no field
			var billNo = {
				gid: 'baseGroup',
				rid: 'billno',
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
			config.rows.push(billNo);

			var optionTransferContractQuantityConfig = {
				gid: 'baseGroup',
				rid: 'transfercontractquantity',
				type: 'boolean',
				model: '_opts.transferContractQuantity',
				label: 'Contract Quantity as Bill Quantity',
				label$tr$: 'sales.contract.wizardCWTransferContractQuantity',
				visible: true
			};
			// TODO: configuration is also used somewhere else, so at the moment we don't change the implementation of the function, instead we add the lookup afterwards
			config.version = '0.3.0';
			config.groups[0].attributes.unshift('typefk');
			config.rows.unshift(billingTypeLookupConfig);

			// add option "Transfer Contract Quantity as Bill Quantity"
			config.groups[0].attributes.push('transfercontractquantity');
			config.rows.push(optionTransferContractQuantityConfig);

			$scope.formOptions = {
				configure: config
			};

			$scope.modalOptions = {
				headerText: $translate.instant('sales.contract.wizardCWCreateBill'),
				ok: ok,
				cancel: close
			};

			$scope.loading = {
				show: false,
				text: $translate.instant('sales.contract.wizardCWCreateBillInProgress')
			};

			$scope.$watch('entity.RubricCategoryFk', function (newRubricCat /* , oldRubricCat */) {
				// sales configuration: set default by rubric category
				$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: newRubricCat});
					if (_.size(items) > 0) {
						$scope.entity.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
					}
				});
			});

			// watch to bill no field
			$scope.$watch('entity.BillNo', function (newBillNo) {
				$scope.isOkDisabled = _.isEmpty(newBillNo) || newBillNo === undefined || $injector.get('platformRuntimeDataService').hasError($scope.entity, 'BillNo');
			});

			function ok() {
				$scope.loading.show = true;

				salesContractCreateBillWizardDialogService.createBillFromContract($scope.entity).then(function (response) {
					var newBill = response.data;
					var navigator = {moduleName: 'sales.billing'};

					$scope.loading.show = false;

					close();

					var modalOptions = {
						templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
						headerText: $translate.instant('sales.common.billCreated.header'),
						bodyText: $translate.instant('sales.common.billCreated.body', {code: newBill.Code}),
						okBtnText: $translate.instant('sales.common.billCreated.okBtn'),
						navigate: function() {
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

			function close() {
				return $modalInstance.dismiss('cancel');
			}

			// TODO: same for billing type?
			function isOkDisabled(rubricCatId) {
				rubricCatId = rubricCatId || $scope.entity.RubricCategoryFk;
				var lookupType = 'basicsMasterDataRubricCategoryLookupDataService';
				var lookupService = $injector.get(lookupType);
				lookupService.setFilter(7);
				lookupService.getList({lookupType: lookupType}).then(function () {
					var item = lookupService.getItemById(rubricCatId, {lookupType: lookupType});
					item = item || lookupService.getDefault({lookupType: lookupType});
					$scope.entity.RubricCategoryFk = item ? item.Id : null;
					$scope.isOkDisabled = _.isEmpty(item) || _.isEmpty($scope.entity.BillNo) || $scope.entity.BillNo === undefined;
				});
			}

			function onSelectedItemChangedHandler(e, args) {
				salesContractCreateBillWizardDialogService.onRubricCategoryChanged.fire(args.selectedItem.Id);
			}

			var filters = [
				{
					key: 'sales-contract-previous-bill-filter',
					serverKey: 'sales-billing-previousbill-filter-by-server',
					serverSide: true,
					fn: function (dlgEntity/* , state */) {
						return {
							OrdHeaderFk: dlgEntity.Id,
							ProjectFk: dlgEntity.ProjectFk
						};
					}
				}
			];

			salesContractCreateBillWizardDialogService.registerFilters();
			salesContractCreateBillWizardDialogService.onRubricCategoryChanged.register(isOkDisabled);
			salesContractCreateBillWizardDialogService.onRubricCategoryChanged.fire();
			basicsLookupdataLookupFilterService.registerFilter(filters);

			$scope.$on('$destroy', function () {
				salesContractCreateBillWizardDialogService.unregisterFilters();
				salesContractCreateBillWizardDialogService.onRubricCategoryChanged.unregister(isOkDisabled);
				basicsLookupdataLookupFilterService.unregisterFilters(filters);
			});
		}]);
})();
