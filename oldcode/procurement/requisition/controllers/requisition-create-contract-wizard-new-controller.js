(function (angular) {
	'use strict';
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionWizardCreateContractNewController', [
		'_',
		'$scope',
		'$timeout',
		'$state',
		'$translate',
		'$http',
		'globals',
		'platformGridAPI',
		'cloudDesktopSidebarService',
		'procurementPackageDataService',
		'procurementRequisitionHeaderDataService',
		'procurementRequisitionWizardCreateContractService',
		'platformModuleInfoService',
		'platformDialogService',
		'basicsLookupdataLookupFilterService',
		'businessPartnerLogicalValidator',
		'procurementRequisitionVariantUIStandardService',
		'platformTranslateService',
		'basicsLookupdataLookupControllerFactory',
		'platformRuntimeDataService',
		'procurementRequisitionWizardCreateContractFromVariantControlService',
		function (
			_,
			$scope,
			$timeout,
			$state,
			$translate,
			$http,
			globals,
			platformGridAPI,
			cloudDesktopSidebarService,
			procurementPackageDataService,
			procurementRequisitionHeaderDataService,
			requisitionWizardCreateContractService,
			platformModuleInfoService,
			platformDialogService,
			lookupFilterService,
			businessPartnerLogicalValidator,
			procurementRequisitionVariantUIStandardService,
			platformTranslateService,
			basicsLookupdataLookupControllerFactory,
			platformRuntimeDataService,
			variantControlService) {

			let translatePrefix = 'procurement.requisition.wizard.contract.';

			let reqHeader = procurementRequisitionHeaderDataService.getSelected() || {};
			let businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: requisitionWizardCreateContractService});
			// dialog status:search supplier and choose supplier
			let dialogStatus = {
				fillContract: 'step1'
			};

			let gridId = 'b974b12277b445568765382185b164c7';

			let filters = [
				{
					key: 'prc-package-wizard-createcontract-subsidiary-filterkey',
					serverSide: true,
					serverKey: 'businesspartner-main-subsidiary-common-filter',
					fn: function (context) {
						let bpFk;
						let supplierFk = null;
						if ($scope.variantOptions.isCreateFromVariants) {
							bpFk = context.BusinessPartnerFk;
							supplierFk = context.SupplierFk;
						} else {
							bpFk = $scope.initOptions.dataModels.businessPartner.Id;

							if (!_.isNil($scope.initOptions.dataModels.supplier)) {
								supplierFk = $scope.initOptions.dataModels.supplier.Id;
							}
						}
						if (bpFk === undefined || bpFk === null) {
							bpFk = -2;
						}
						if (_.isNil(supplierFk) || supplierFk === 0) {
							supplierFk = null;
						}
						return {BusinessPartnerFk: bpFk, SupplierFk: supplierFk};
					}
				},
				{
					key: 'prc-package-wizard-createcontract-supplier-filterkey',
					serverSide: true,
					serverKey: 'businesspartner-main-supplier-common-filter',
					fn: function (context) {
						let bpFk;
						let subsidiaryFk = null;
						if ($scope.variantOptions.isCreateFromVariants) {
							bpFk = context.BusinessPartnerFk;
							subsidiaryFk = context.SubsidiaryFk;
						} else {
							bpFk = $scope.initOptions.dataModels.businessPartner.Id;
							subsidiaryFk = $scope.initOptions.dataModels.subsidiary.Id;
						}
						if (bpFk === undefined || bpFk === null) {
							bpFk = -2;
						}
						if (_.isNil(subsidiaryFk) || subsidiaryFk === 0) {
							subsidiaryFk = null;
						}
						return {BusinessPartnerFk: bpFk, SubsidiaryFk: subsidiaryFk};
					}
				},
				{
					key: 'prc-requisition-wizard-createcontract-contact-filterkey',
					serverSide: true,
					serverKey: 'prc-con-contact-filter',
					fn: function (context) {
						let bpFk;
						let branchFk = null;
						if ($scope.variantOptions.isCreateFromVariants) {
							bpFk = context.BusinessPartnerFk;
							branchFk = context.SubsidiaryFk;
						} else {
							bpFk = $scope.initOptions.dataModels.businessPartner.Id;
							branchFk = $scope.initOptions.dataModels.subsidiary.Id;
						}
						if (bpFk === undefined || bpFk === null) {
							bpFk = -2;
						}
						if (_.isNil(branchFk) || branchFk === 0) {
							branchFk = null;
						}
						return {BusinessPartnerFk: bpFk, SubsidiaryFk: branchFk};
					}
				}
			];

			$scope.modalOptions = {
				bodyTitle: $translate.instant('procurement.common.findBidder.findTitle'),
				btnOkText: $translate.instant('cloud.common.ok'),
				btnCancelText: $translate.instant('cloud.common.cancel'),
				btnBackText: $translate.instant('basics.common.button.back'),
				btnSearchText: $translate.instant('cloud.common.toolbarSearch'),
				dialogLoading: false,
				loadingInfo: '',
				step: dialogStatus.fillContract,
				btnNextStatus: true
			};

			$scope.lookupOptions = {
				subsidiary: {
					lookupType: 'subsidiary',
					version: 3,
					filterKey: 'prc-package-wizard-createcontract-subsidiary-filterkey',
					valueMember: 'Id',
					displayMember: 'AddressLine',
					showClearButton: true,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let oldSubId = $scope.initOptions.dataModels.subsidiary.Id;
							$scope.initOptions.dataModels.subsidiary = args.selectedItem || {};
							let newSubId = $scope.initOptions.dataModels.subsidiary.Id;
							if (!_.isNil(newSubId) && oldSubId !== newSubId) {
								requisitionWizardCreateContractService.setDefaultSupplier($scope.initOptions.dataModels.businessPartner.Id, -1, newSubId, $scope.initOptions.dataModels);
								requisitionWizardCreateContractService.setDefaultContact($scope.initOptions.dataModels.businessPartner.Id, newSubId, $scope.initOptions.dataModels);
							}
							if(_.isNil(newSubId)){
								$scope.initOptions.dataModels.supplier = null;
								$scope.initOptions.dataModels.contact = null;
							}

							if (e?.code && e.code === 'Enter') {
								$scope.isPopupEnter = true;
							}
						}
					}]
				},
				supplier: {
					lookupType: 'supplier',
					version: 3,
					filterKey: 'prc-package-wizard-createcontract-supplier-filterkey',
					valueMember: 'Id',
					displayMember: 'Code',
					showClearButton: true,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							$scope.initOptions.dataModels.supplier = args.selectedItem || {};

							if (e?.code && e.code === 'Enter') {
								$scope.isPopupEnter = true;
							}
						}
					}, {
						name: 'onEditValueChanged',
						handler: function (e, args) {
							if (args.oldValue && !args.newValue) {
								$scope.initOptions.dataModels.supplier = {}; // clea description when click 'clear' button
							} else {
								if (_.isNil(args.newValue)) {
									$scope.initOptions.dataModels.supplier = args.selectedItem || {};
								}
							}
						}
					}]
				},
				businessPartner: {
					valueMember: 'Id',
					displayMember: 'BusinessPartnerName1',
					showClearButton: true,
					IsShowBranch: true,
					SubsidiaryField: 'SubsidiaryFk',
					ContactField: 'ContactFk',
					FromPackageWizard: true,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = args.selectedItem;
							$scope.initOptions.dataModels.businessPartner = selectedItem || {};
							let oldSubsidiaryId = $scope.initOptions.dataModels.subsidiary.Id;
							$scope.initOptions.dataModels.subsidiary.Id = selectedItem ? selectedItem.SubsidiaryFk : null;
							let entity = {BusinessPartnerFk: $scope.initOptions.dataModels.businessPartner.Id, SubsidiaryFk:$scope.initOptions.dataModels.subsidiary.Id};
							if(selectedItem?.ContactFromBpDialog){
								$scope.initOptions.dataModels.contact.Id = selectedItem.ContactFk;
								selectedItem.ContactFromBpDialog = false;
							}else{
								businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, entity.SubsidiaryFk).then(function () {
									if(!_.isNil(entity.ContactFk)){
										$scope.initOptions.dataModels.contact.Id = entity.ContactFk;
									}else{
										$scope.initOptions.dataModels.contact.Id = null;
									}
								});
							}

							if (!selectedItem) {
								$scope.initOptions.dataModels.subsidiary = {};
								$scope.initOptions.dataModels.supplier = {};
								$scope.initOptions.dataModels.contact = {};
							}
							let subsidiaryId = $scope.initOptions.dataModels.subsidiary.Id;
							if (_.isNil(subsidiaryId)) {
								subsidiaryId = -1;
							}
							if (selectedItem) {
								if (oldSubsidiaryId !== selectedItem.SubsidiaryFk) {
									requisitionWizardCreateContractService.setDefaultSupplier(selectedItem.Id, -1, subsidiaryId, $scope.initOptions.dataModels);
								}
							}
							if (e?.code && e.code === 'Enter') {
								$scope.isPopupEnter = true;
							}
						}
					}]
				},
				contact:  {
					lookupType: 'Contact',
					version: 3,
					filterKey: 'prc-requisition-wizard-createcontract-contact-filterkey',
					valueMember: 'Id',
					displayMember: 'FullName',
					showClearButton: true
				}
			};

			$scope.initOptions = {
				headerTitle: $translate.instant(translatePrefix + 'header'),
				contractorTitle: $translate.instant('procurement.common.contractorTitle'),
				businessPartnerText: $translate.instant('cloud.common.entityBusinessPartner'),
				contactText: $translate.instant(translatePrefix + 'contact'),
				subsidiaryText: $translate.instant('cloud.common.entitySubsidiary'),
				supplierText: $translate.instant('cloud.common.entitySupplier'),
				btnCloseText: $translate.instant('cloud.common.cancel'),
				btnNextText: $translate.instant('cloud.common.nextStep'),
				isCreateFromVariantsText: $translate.instant('procurement.requisition.wizard.contract.isCreateFromVariants'),
				dialogLoading: false,
				loadingInfo: '',
				isBtnLookupContractorDisabled: false,
				dataModels: {
					businessPartner: {},
					subsidiary: {},
					supplier: {},
					contractEntity: {Id: -1},
					contact: {}
				},
				step1BpOwnConfig: {
					rt$readonly: function () {
						return $scope.initOptions.isBtnLookupContractorDisabled || $scope.variantOptions.isCreateFromVariants;
					}
				},
				step1BpConfig: {
					rt$readonly: function () {
						if ($scope.variantOptions.isCreateFromVariants) {
							return true;
						}
						let bp = $scope.initOptions.dataModels.businessPartner;
						if (bp?.Id) {
							return $scope.initOptions.isBtnLookupContractorDisabled;
						}

						return true;
					}
				},
				onNext: function onNext() {
					let options = {
						ReqHeaderFk: reqHeader.Id,
						BusinessPartnerFk: requisitionWizardCreateContractService.scope.initOptions.dataModels.businessPartner?.Id,
						SubsidiaryFk: requisitionWizardCreateContractService.scope.initOptions.dataModels.subsidiary?.Id || null,
						SupplierFk: requisitionWizardCreateContractService.scope.initOptions.dataModels.supplier?.Id || null,
						ContactFk: requisitionWizardCreateContractService.scope.initOptions.dataModels.contact?.Id || null,
						isFromVariants: $scope.variantOptions.isCreateFromVariants,
						variants: $scope.getSelectedVariants()
					};
					$scope.modalOptions.dialogLoading = true;
					requisitionWizardCreateContractService.createContractWizard(options).then(function (data) {
						$scope.$close(false);
						if (angular.isArray(data) && data.length > 0) {
							platformDialogService.showDialog({
								templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/create-contract-wizard-dialog.html',
								width: '600px',
								resizeable: true,
								newIds: data.map(e => e.Id),
								newCodes: data.map(e => e.Code)
							});
						}
					})
						.finally(function () {
							$scope.modalOptions.dialogLoading = false;
						});
				},
				onClose: function () {
					$scope.$close(false);
				},
				onNavigate: function () {
					// default navigate to one contract.
					requisitionWizardCreateContractService.naviGate($scope.initOptions.dataModels.contractEntity, 'Id');
				}
			};

			$scope.canNext = canNext;
			init();

			// //////////////////////////////////////////////////////////////////////////////////////////////////////////
			function init() {
				// cache controller scope
				requisitionWizardCreateContractService.scope = $scope;
				requisitionWizardCreateContractService.selectedRequisition = reqHeader;
				requisitionWizardCreateContractService.translatePrefix = 'procurement.requisition';
				requisitionWizardCreateContractService.setDataForCreateContract();

				lookupFilterService.registerFilter(filters);
				$scope.modalOptions.dialogLoading = true;
				variantControlService.initVariantControl({
					variantGridId: gridId,
					scope: $scope,
					reqHeader: reqHeader,
					getScopeOptions: function () {
						return $scope.initOptions.dataModels;
					},
					customCols: getCustomVariantColumns(),
					beforeValidateisChecked: function (entity, value) {
						validateBpFk(entity, value, entity.BusinessPartnerFk);
					},
					isInitTools: true
				});
				$scope.getVariants().then(function (data) {
					let variants = data || [];
					let bpId = $scope.initOptions.dataModels.businessPartner ? $scope.initOptions.dataModels.businessPartner.Id : null;
					let subsidiaryId = $scope.initOptions.dataModels.subsidiary ? $scope.initOptions.dataModels.subsidiary.Id : null;
					let supplierId = $scope.initOptions.dataModels.supplier ? $scope.initOptions.dataModels.supplier.Id : null;
					let contactId = $scope.initOptions.dataModels.contact ? $scope.initOptions.dataModels.contact.Id : null;
					variants.forEach(function (item) {
						item.BusinessPartnerFk = bpId;
						item.SubsidiaryFk = subsidiaryId;
						item.SupplierFk = supplierId;
						item.ContactFk = contactId;
						let isReadonly = !item.BusinessPartnerFk;
						platformRuntimeDataService.readonly(item, [
							{field: 'SubsidiaryFk', readonly: isReadonly},
							{field: 'SupplierFk', readonly: isReadonly},
							{field: 'ContactFk', readonly: isReadonly}
						]);
					});
				})
					.finally(function () {
						$scope.modalOptions.dialogLoading = false;
					});
			}

			$scope.$on('$destroy', function () {
				lookupFilterService.unregisterFilter(filters);
				requisitionWizardCreateContractService.scope = null;
				requisitionWizardCreateContractService.selectedSubPackage = null;
				requisitionWizardCreateContractService.baseContractId = -1;
			});

			function getCustomVariantColumns() {
				return [
				{
					id: 'bpFk',
					field: 'BusinessPartnerFk',
					name: $scope.initOptions.businessPartnerText,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					},
					editor: 'lookup',
					editorOptions: {
						directive: 'filter-business-partner-dialog-lookup',
						lookupOptions: {
							valueMember: 'Id',
							displayMember: 'BusinessPartnerName1',
							showClearButton: true,
							IsShowBranch: true,
							SubsidiaryField: 'SubsidiaryFk',
							ContactField: 'ContactFk',
							FromPackageWizard: true,
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									let selectedItem = args.selectedItem;
									args.entity.BusinessPartnerFk = selectedItem?.Id || null;
									args.entity.SubsidiaryFk = selectedItem ? selectedItem.SubsidiaryFk : null;
									let entity = {BusinessPartnerFk: args.entity.BusinessPartnerFk, SubsidiaryFk: args.entity.SubsidiaryFk};
									if (selectedItem?.ContactFromBpDialog) {
										args.entity.ContactFk = selectedItem.ContactFk;
										selectedItem.ContactFromBpDialog = false;
									} else {
										businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, entity.SubsidiaryFk).then(function () {
											if (!_.isNil(entity.ContactFk)) {
												args.entity.ContactFk = entity.ContactFk;
											} else {
												args.entity.ContactFk = null;
											}
										});
									}

									if (!selectedItem) {
										args.entity.SubsidiaryFk = null;
										args.entity.SupplierFk = null;
										args.entity.ContactFk = null;
									}
									let subsidiaryId = args.entity.SubsidiaryFk;
									if (_.isNil(subsidiaryId)) {
										subsidiaryId = -1;
									}
									if (selectedItem) {
										if (subsidiaryId&&subsidiaryId>0) {
											requisitionWizardCreateContractService.setDefaultSupplier(selectedItem.Id, -1, subsidiaryId, args.entity);
										}
									}
								}
							}]
						}
					},
					validator: validateBusinessPartnerFk
				},
				{
					id: 'subsidiaryFk',
					field: 'SubsidiaryFk',
					name: $scope.initOptions.subsidiaryText,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'subsidiary', displayMember: 'AddressLine'
					},
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-subsidiary-lookup',
						lookupOptions: {
							filterKey: 'prc-package-wizard-createcontract-subsidiary-filterkey',
							displayMember: 'AddressLine',
							showClearButton: true,
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									let oldSubId = args.entity.SubsidiaryFk;
									args.entity.SubsidiaryFk = args.selectedItem ? args.selectedItem.Id : null;
									let newSubId = args.entity.SubsidiaryFk;
									if (!_.isNil(newSubId) && oldSubId !== newSubId) {
										requisitionWizardCreateContractService.setDefaultSupplier(args.entity.BusinessPartnerFk, -1, newSubId, args.entity);
										requisitionWizardCreateContractService.setDefaultContact(args.entity.BusinessPartnerFk, newSubId, args.entity);
									}
									if(_.isNil(newSubId)) {
										args.entity.SupplierFk = null;
										args.entity.ContactFk = null;
									}
								}
							}]
						}
					}
				},
				{
					id: 'supplierFk',
					field: 'SupplierFk',
					name: $scope.initOptions.supplierText,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Supplier',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-supplier-lookup',
						lookupOptions: {
							filterKey: 'prc-package-wizard-createcontract-supplier-filterkey',
							displayMember: 'Code',
							showClearButton: true,
						}
					}
				},
				{
					id: 'contactFk',
					field: 'ContactFk',
					name: $scope.initOptions.contactText,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Contact',
						displayMember: 'FullName'
					},
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-contact-dialog',
						lookupOptions: {
							filterKey: 'prc-requisition-wizard-createcontract-contact-filterkey',
							showClearButton: true
						}
					}
				}];
			}

			function canNext() {
				let canGoNext = ($scope.variantOptions.isCreateFromVariants && $scope.hasSelectedVariants())
					|| (!$scope.variantOptions.isCreateFromVariants && $scope.initOptions.dataModels.businessPartner?.Id);

				return canGoNext && isBusinessPartnerFilled();
			}

			function isBusinessPartnerFilled() {
				if ($scope.variantOptions.isCreateFromVariants) {
					let list = platformGridAPI.grids.element('id', gridId).dataView.getItems();
					if (!list) {
						return false;
					}
					let isFilled = true;
					list.forEach(item => {
						if (!item.isChecked) {
							return;
						}
						isFilled = isFilled && !!item.BusinessPartnerFk;
					});
					return isFilled;
				} else {
					return $scope.initOptions.dataModels.businessPartner.Id;
				}
			}

			function validateBusinessPartnerFk(entity, value) {
				let isReadonly =  !value;
				platformRuntimeDataService.readonly(entity, [
					{field: 'SubsidiaryFk', readonly: isReadonly},
					{field: 'SupplierFk', readonly: isReadonly},
					{field: 'ContactFk', readonly: isReadonly}
				]);
				return validateBpFk(entity, entity.isChecked, value);
			}

			function validateBpFk(entity, isChecked, businessPartnerFk) {
				let bpResult = {valid: true, apply: true};
				if (isChecked && !businessPartnerFk) {
					bpResult.valid = false;
					bpResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $scope.initOptions.businessPartner});
				}
				platformRuntimeDataService.applyValidationResult(bpResult, entity, 'BusinessPartnerFk');
				return bpResult;
			}
		}
	]);

})(angular);