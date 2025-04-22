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

	angular.module(moduleName).controller('salesContractBillFromAdvanceLineWizardController', [
		'globals', '_', '$http', '$scope', '$modalInstance', '$injector', '$translate', 'platformRuntimeDataService', 'platformGridAPI', 'platformTranslateService', 'platformModalService', 'salesContractBillFromPaymentScheduleWizardDialogService', 'salesContractBillFromPaymentScheduleWizardDialogUIService', 'basicsLookupdataLookupFilterService', 'salesWipBoqService', 'salesContractValidationService', 'salesBillingValidationService', 'salesCommonBillTypeLookupOptions', 'salesContractAdvanceDataService', 'salesContractService', 'basicsLookupdataConfigGenerator',
		function (globals, _, $http, $scope, $modalInstance, $injector, $translate, platformRuntimeDataService, platformGridAPI, platformTranslateService, platformModalService, salesContractBillFromPaymentScheduleWizardDialogService, salesContractBillFromPaymentScheduleWizardDialogUIService, basicsLookupdataLookupFilterService, salesWipBoqService, salesContractValidationService, salesBillingValidationService, salesCommonBillTypeLookupOptions, salesContractAdvanceDataService, salesContractService, basicsLookupdataConfigGenerator) {

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
				headerText: $translate.instant('sales.contract.generateBillFromAdvanceLineTitle'),
				ok: ok,
				cancel: close
			};

			// Grid form
			$scope.gridAdvanceLineId = 'f1ba697014f2404ba4c69965735fcf46';
			$scope.gridData = {
				state: $scope.gridAdvanceLineId
			};

			var advanceLineAllColumns = angular.copy($injector.get('salesContractAdvanceUIStandardService').getStandardConfigForListView().columns);
			var advanceLineColumns = _.filter(advanceLineAllColumns, function (item) {
				return ['description', 'amountdue', 'amountdone', 'datedue', 'datedone'].indexOf(item.id) > -1;
			});

			if (!platformGridAPI.grids.exist($scope.gridAdvanceLineId)) {
				var gridConfig = {
					data: [],
					columns: advanceLineColumns,
					id: $scope.gridAdvanceLineId,
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
				platformGridAPI.columns.configuration($scope.gridAdvanceLineId, advanceLineColumns);
			}

			setTimeout(function () {
				var gridList = [getContractAdvanceLineSelected()];
				var fields = [];
				_.forEach(gridList, function (item) {
					_.forOwn(item, function (value, key) {
						var field = {field: key, readonly: true};
						fields.push(field);
					});
					platformRuntimeDataService.readonly(item, fields);
				});
				platformGridAPI.items.data($scope.gridAdvanceLineId, gridList);
			}, 100);

			function getContractAdvanceLineSelected() {
				return angular.copy(salesContractAdvanceDataService.getSelected());
			}

			function getContractSelected() {
				return angular.copy(salesContractService.getSelected());
			}

			var initDataItem = {
				Id: getContractSelected().Id,
				ProjectFk: getContractSelected().ProjectFk,
				TypeFk: null,
				RubricCategoryFk: null,
				BillNo: null,
				Description: null,
				ResponsibleCompanyFk: getContractSelected().CompanyResponsibleFk,
				ClerkFk: getContractSelected().ClerkFk
			};

			$scope.entity = initDataItem;

			$scope.formOptions = {
				configure: getGenerateFormConfiguration()
			};

			function setReadOnlyFields() {
				var fields = [];
				// TODO: check also need to make typefk to readonly
				fields.push({field: 'RubricCategoryFk', readonly: true});
				platformRuntimeDataService.readonly($scope.entity, fields);
			}

			$scope.loading = {
				show: false,
				text: $translate.instant('sales.contract.generateBillFromPaymentScheduleInProgress')
			};

			function ok() {

				var selectedAdvance = salesContractAdvanceDataService.getSelected();
				var postData = {
					ContractId: getContractSelected().Id,
					AdvanceId: selectedAdvance.Id,
					BillTypeFk: $scope.entity.TypeFk,
					RubricCategoryFk: $scope.entity.RubricCategoryFk,
					ConfigurationFk: $scope.entity.ConfigurationFk,
					BillNo: $scope.entity.BillNo,
					Description: $scope.entity.Description,
					ResponsibleCompanyFk: $scope.entity.ResponsibleCompanyFk,
					ClerkFk: $scope.entity.ClerkFk,
					AdvanceDate: selectedAdvance.DateDue
				};

				$http.post(globals.webApiBaseUrl + 'sales/billing/createBillFromContractAdvance', postData).then(function (response) {
					var billCreated = response.data;
					if (billCreated) {
						var navigator = {moduleName: 'sales.billing'};

						$scope.loading.show = false;
						close();

						platformModalService.showYesNoDialog('sales.contract.billFromAdvanceCreatedSuccess', 'sales.contract.generateBillFromAdvanceLineTitle', 'no').then(function (response) {
							if (response.yes) {
								$injector.get('platformModuleNavigationService').navigate(navigator, billCreated);
								$injector.get('salesCommonUtilsService').toggleSideBarWizard();
							}

							// Refresh payment schedule to show Bill assignment
							$injector.get('salesContractPaymentScheduleDataService').load();
						});
					}
					else {
						// show error message box
						platformModalService.showErrorBox('sales.contract.generalError', 'cloud.common.errorMessage');
					}
				});
			}

			function close() {
				$modalInstance.dismiss('cancel');
			}

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

			// disable [OK]-Button?
			$scope.$watchGroup(['entity.TypeFk', 'entity.BillNo', 'entity.ResponsibleCompanyFk', 'entity.ClerkFk'], function () {
				$scope.isOkDisabled = !$scope.entity.TypeFk || !$scope.entity.BillNo || !$scope.entity.ResponsibleCompanyFk || !$scope.entity.ClerkFk || platformRuntimeDataService.hasError($scope.entity, 'BillNo');
			});

			function getGenerateFormConfiguration() {

				var formOptions =
						{
							fid: 'sales.contract.generateWizardModal',
							version: '0.0.1',
							showGrouping: false,
							change: 'change',
							groups: [
								{
									gid: 'baseGroup',
									attributes: [
										'typefk', 'rubriccategoryfk', 'billno', 'description', 'responsiblecompanyfk', 'clerkfk'
									]
								}
							],
							rows: [
								// Bill Type
								basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
									'basics.customize.billtype',
									'Description',
									{
										gid: 'baseGroup',
										rid: 'typeFk',
										model: 'TypeFk',
										required: true,
										sortOrder: 3,
										label$tr$: 'sales.contract.entityBillTypeFk',
										validator: validateSelectedType

									},
									true, // caution: this parameter is ignored by the function
									{
										required: true,
										customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
									}
								),
								// Rubric Category
								{
									gid: 'baseGroup',
									rid: 'rubricCategoryFk',
									model: 'RubricCategoryFk',
									required: true,
									sortOrder: 4,
									label$tr$: 'project.main.entityRubric',
									label: 'Category',
									validator: validateSelectedRubricCategory,
									asyncValidator: salesBillingValidationService.asyncValidateRubricCategoryFk,
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'sales-billing-rubric-category-by-rubric-filter',
											showClearButton: false
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RubricCategoryByRubricAndCompany',
										displayMember: 'Description'
									}
								},
								{
									gid: 'baseGroup',
									rid: 'configurationfk',
									label: 'Configuration',
									sortOrder: 5,
									label$tr$: 'sales.common.entityConfigurationFk',
									type: 'directive',
									model: 'ConfigurationFk',
									directive: 'basics-configuration-configuration-combobox',
									options: {
										filterKey: 'sales-billing-configuration-filter',
										showClearButton: true
									}
								},
								// BillNo
								{
									gid: 'baseGroup',
									rid: 'billno',
									label$tr$: 'sales.billing.entityBillNo',
									model: 'BillNo',
									type: 'code',
									required: true,
									sortOrder: 5,
									validator: salesBillingValidationService.validateBillNo,
									asyncValidator: asyncValidateBillNo
								},
								// Description
								{
									rid: 'description',
									gid: 'baseGroup',
									label$tr$: 'cloud.common.entityDescription',
									model: 'Description',
									type: 'description',
									sortOrder: 6
								},

								// Responsible
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'salesBidCompanyLookupDataService',
									enableCache: true,
									filter: function (item) {
										return item.ResponsibleCompanyFk;
									}
								},
								{
									gid: 'baseGroup',
									rid: 'responsibleCompanyFk',
									model: 'ResponsibleCompanyFk',
									sortOrder: 7,
									required: true,
									label$tr$: 'sales.common.entityCompanyResponsibleFk',
									validator: salesContractValidationService.validateCompanyResponsibleFk
								}
								),
								// Clerk
								{
									gid: 'baseGroup',
									rid: 'clerkFk',
									model: 'ClerkFk',
									required: true,
									sortOrder: 8,
									label: 'Clerk',
									label$tr$: 'basics.clerk.entityClerk',
									validator: salesContractValidationService.validateClerkFk,
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: false
										}
									}
								},

							]
						};

				function getBillingTypeById(typeId) {
					return $injector.get('basicsLookupdataSimpleLookupService').getItemById(typeId, salesCommonBillTypeLookupOptions);
				}

				// lookup configs
				// - Billing Type
				function validateSelectedType(entity, value) {
					// populate related values like rubric category
					getBillingTypeById(value).then(function (typeEntity) {
						var rubricCategoryId = typeEntity.BasRubricCategoryFk;
						entity.RubricCategoryFk = rubricCategoryId;
						validateSelectedRubricCategory(entity, rubricCategoryId);
					});
				}

				// - Rubric Category
				function validateSelectedRubricCategory(entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'BillNo',
						readonly: $injector.get('salesBillingNumberGenerationSettingsService').hasToGenerateForRubricCategory(value)
					}]);
					entity.BillNo = $injector.get('salesBillingNumberGenerationSettingsService').provideNumberDefaultText(value, entity.BillNo);
				}

				function asyncValidateBillNo(entity, value) {
					entity.CompanyFk = entity.ResponsibleCompanyFk;
					return salesBillingValidationService.asyncValidateBillNo(entity, value);
				}

				platformTranslateService.translateFormConfig(formOptions);

				return formOptions;
			}
		}]);
})();
