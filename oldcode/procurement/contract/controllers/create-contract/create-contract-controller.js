/**
 * Created by jie 2024.12.02
 */
/**
 * @ngdoc controller
 * @name procurementCreateContractWizardController
 * @function
 *
 * @description
 * Controller for the wizard dialog used to create contract
 **/

// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.contract';
	angular.module(moduleName).controller('procurementCreateContractWizardController', [
		'$scope', '$injector', '$http', '$translate', 'WizardHandler', 'platformGridAPI',
		'platformModalService', 'procurementCommonPrcItemDataService', 'procurementCommonUpdateItemPriceService',
		'procurementCommonItemPriceService', 'procurementContractWizardCreateContractService', 'businessPartnerLogicalValidator', 'basicsLookupdataLookupFilterService',
		'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'procurementContractNumberGenerationSettingsService', 'platformContextService','basicsLookupdataLookupDataService','$q',
		'procurementCommonCertificateNewDataService','procurementCommonGeneralsDataService','contractHeaderElementValidationService','platformDataServiceModificationTrackingExtension',
		function ($scope, $injector, $http, $translate, WizardHandler, platformGridAPI,
			platformModalService, procurementCommonPrcItemDataService, commonUpdateItemPriceService,
			dataService, createContractWizardService, businessPartnerLogicalValidator, basicsLookupdataLookupFilterService,
			moduleContext, basicsLookupdataLookupDescriptorService, procurementContractNumberGenerationSettingsService, platformContextService,lookupDataService,$q,
			procurementCommonCertificateDataService,procurementCommonGeneralsDataService,contractHeaderElementValidationService,platformDataServiceModificationTrackingExtension
		) {

			var selectedItems = procurementCommonPrcItemDataService.getService().getSelectedEntities();
			var firDialogWidth = '800px';
			var secDialogWidth = '800px';
			$scope.currentItem = {};
			$scope.wizard = $scope.modalOptions.value.wizard;
			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.wizard.title = $translate.instant('procurement.contract.wizard.createContractTitle');
			$scope.selectedOption = 1;
			$scope.OldSelectedOption = 0;
			$scope.materials = [];
			$scope.selections = [
				{name: $translate.instant('procurement.common.wizard.updateItemPrice.basePrice'), value: 0},
				{name: $translate.instant('procurement.common.wizard.updateItemPrice.latestPriceVersion'), value: -1}
			];
			$scope.steps = [
				{number: 0, identifier: 'basicSelectOption', skip: false},
				{number: 1, identifier: 'createContract', skip: false}
			];
			$scope.onResult = function (param) {
				$scope.selectedOption = param;
				$scope.initOptions.contractText = param === 5 ? $translate.instant('procurement.contract.wizard.frameWorkAgreement') : $translate.instant('procurement.contract.wizard.mainContract');
				//1 createContract,2 createCallOfContract,3 createChangeOrderContract,5 createCallOfFrameworkContract
				$scope.initOptions.isShowContract = (param !== 1 && param !== 5);
				$scope.initOptions.isShowPrjChange = param === 3;
				$scope.initOptions.isCallOffChangeOrder = (param === 2 || param === 3);
				$scope.initOptions.isShowFrameWork = param === 5;
				$scope.initOptions.isShowPurseOrder = param === 1;
			};

			$scope.selectStep = angular.copy($scope.steps[0]);
			$scope.isLastStep = function () {
				if ($scope.selectStep) {
					return $scope.selectStep.number === $scope.steps.length - 1;
				} else {
					return true;
				}
			};

			function resetFormStatus() {
				$scope.initOptions.contractText = $translate.instant('procurement.contract.wizard.mainContract');
				$scope.initOptions.dataModels.projectFk = null;
				$scope.initOptions.dataModels.configurationFk = null;
				$scope.initOptions.dataModels.contractFk = null;
				$scope.initOptions.dataModels.controllingUnitFk = null;
				$scope.initOptions.dataModels.prcStructureFk = null;
				$scope.initOptions.dataModels.businessPartner = {};
				$scope.initOptions.dataModels.subsidiary = {};
				$scope.initOptions.dataModels.supplier = {};
				$scope.initOptions.dataModels.contact = {};
				$scope.initOptions.dataModels.projectChange = {};
			}

			let entity = {
				BpdVatGroupFk:null,
				BusinessPartnerFk:null,
				SubsidiaryFk:null,
				SupplierFk:null,
				IncotermFk:null,
				BankFk:null,
				BpdBankTypeFk:null,
				PaymentTermFiFk:null,
				PaymentTermPaFk:null,
				PaymentTermAdFk:null,
				PrcHeaderEntity:{
					StructureFk:null,
					ConfigurationFk:null
				},
			}
			let scopeEntity = {};

			$scope.initOptions = {
				isShowContract: false,
				isShowPrjChange: false,
				contractText: $translate.instant('procurement.contract.wizard.mainContract'),
				dataModels: {
					businessPartner: {},
					subsidiary: {},
					supplier: {},
					projectChange: null,
					configuration: null,
					contractEntity: {Id: -1},
					contact: {},
					projectFk: null,
					code: null,
					configurationFk: null,
					controllingUnitFk: null,
					prcStructureFk: null,
					contractFk: null,
					BoqWicCatFk:null,
					boqWicCatBoqFk:null,
					paymentTermAdFk:null,
					paymentTermFiFk:null,
					paymentTermFk:null,
					incoTermFk:null,
					vatGroupFk:null,
					bankFk:null,
					ClerkPrcFk:null,
					ClerkReqFk:null,
				},
				BoqWicCatFk: null,
				MdcMaterialCatalogFk: null,
				changeProjectConfig: null,
				configurationConfig: null,
				isShowPurseOrder:true

			};

			$scope.currentItem = $scope.initOptions.dataModels;

			var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: createContractWizardService});

			let filters = [
				{
					key: 'prc-package-wizard-createcontract-subsidiary-filterkey',
					serverSide: true,
					serverKey: 'businesspartner-main-subsidiary-common-filter',
					fn: function () {

						var bpFk = $scope.initOptions.dataModels.businessPartner.Id;
						if (bpFk === undefined || bpFk === null) {
							bpFk = -2;
						}
						var supplierFk = null;
						if (!_.isNil($scope.initOptions.dataModels.supplier)) {
							supplierFk = $scope.initOptions.dataModels.supplier.Id;
							if (_.isNil(supplierFk) || supplierFk === 0) {
								supplierFk = null;
							}
						}

						return {BusinessPartnerFk: bpFk, SupplierFk: supplierFk};
					}
				},
				{
					key: 'prc-package-wizard-createcontract-supplier-filterkey',
					serverSide: true,
					serverKey: 'businesspartner-main-supplier-common-filter',
					fn: function () {
						var bpFk = $scope.initOptions.dataModels.businessPartner.Id;
						if (bpFk === undefined || bpFk === null) {
							bpFk = -2;
						}
						var subsidiaryFk = $scope.initOptions.dataModels.subsidiary.Id;
						if (_.isNil(subsidiaryFk) || subsidiaryFk === 0) {
							subsidiaryFk = null;
						}
						return {BusinessPartnerFk: bpFk, SubsidiaryFk: subsidiaryFk};
					}
				},
				{
					key: 'prc-package-wizard-createcontract-contact-filterkey',
					serverSide: true,
					serverKey: 'prc-con-contact-filter',
					fn: function () {
						var bpFk = $scope.initOptions.dataModels.businessPartner.Id || -2;
						let branchFk = $scope.initOptions.dataModels.subsidiary.Id || null;
						return {BusinessPartnerFk: bpFk, SubsidiaryFk: branchFk};
					}
				},
				{
					key: 'prc-contract-configuration-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk = ' + moduleContext.contractRubricFk;
					}
				},
				{
					key: 'prc-base-con-header-for-con-filter',
					serverKey: 'prc-base-con-header-filter',
					serverSide: true,
					fn: function (item) {
						return {
							IsCanceled: false,
							IsVirtual:false
						};
					}
				},
				{
					key: 'prc-con-controlling-by-prj-filter',
					serverKey: 'prc.con.controllingunit.by.prj.filterkey',
					serverSide: true,
					fn: function (entity) {
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
							CompanyFk: platformContextService.getContext().clientId
						};
					}
				},
			];

			function contractFilter(contract) {
				if ($scope.selectedOption === 5) {
					return contract && !contract.StatusIsCanceled && !contract.StatusIsVirtual && contract.ConHeaderFk === null && (contract.BoqWicCatFk !== null || contract.MdcMaterialCatalogFk !== null);
				}
				return contract && !contract.StatusIsCanceled && !contract.StatusIsVirtual && contract.ConHeaderFk === null;
			}

			init();

			function init() {
				createContractWizardService.scope = $scope;
				basicsLookupdataLookupFilterService.registerFilter(filters);
				createContractWizardService.clearContractorInfo();

			}

			function initProjectAndCuAndConfig() {
				let pinProjectFk = createContractWizardService.getPinningProjectId();
				if (pinProjectFk > 0) {
					$scope.initOptions.dataModels.projectFk = pinProjectFk;
					getCuByProject();
				}
				let rubricFk = moduleContext.contractRubricFk;
				let prcConfigs = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');

				let configuration = _.find(prcConfigs, (e) => e.RubricFk === rubricFk && e.IsLive && e.IsDefault);

				if (_.isNil(configuration)) {
					configuration = _.find(prcConfigs, (e) => e.RubricFk === rubricFk && e.IsLive);
				}
				$scope.initOptions.dataModels.configuration = configuration !== null ? configuration : null;
				if (!_.isNil($scope.initOptions.dataModels.configuration)) {
					$scope.initOptions.dataModels.configurationFk = $scope.initOptions.dataModels.configuration.Id;
					generalCode($scope.initOptions.dataModels.configuration.Id);
				}
			}

			function getRubricIndex() {
				// check the contract type, 0 Purchase Order, 5 for 'call off' and 5 for 'change order'
				var rubricIndex = 0;
				switch ($scope.selectedOption) {
					case 1:
						rubricIndex = 0;
						break;
					case 2:
						rubricIndex = 4;
						break;
					case 3:
						rubricIndex = 5;
						break
					default:
						rubricIndex = 0;
						break
				}
				return rubricIndex;
			}

			function generalCode(configurationId) {
				let prcConfigs = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');
				let rubricIndex = getRubricIndex();
				let configuration = _.find(prcConfigs, (e) => {
					return e.Id === configurationId;
				});
				if (!_.isNil(configuration)) {
					procurementContractNumberGenerationSettingsService.assertLoaded().then(function () {
						$scope.initOptions.dataModels.code = procurementContractNumberGenerationSettingsService.provideNumberDefaultText(configuration.RubricCategoryFk, null, rubricIndex);
					});
					$scope.initOptions.isReadonlyCode = procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(configuration.RubricCategoryFk, rubricIndex);
				}
			}

			$scope.gridId = 'f8472d3a2a914d9fb0539f24cd9c2077';

			function setCurrentStep(step) {
				$scope.selectStep = angular.copy($scope.steps[step]);
				let selectedOption = $scope.selectedOption;
				if ($scope.OldSelectedOption !== $scope.selectedOption) {
					resetFormStatus();
					$scope.OldSelectedOption = $scope.selectedOption;
				}

				initProjectAndCuAndConfig();
				//selectedOption : 1 createContract,2 createCallOfContract,3 createChangeOrderContract,5 createCallOfFrameworkContract
				switch (selectedOption) {
					case 1:
						initConfiguration();
						$scope.wizard.title = $translate.instant('procurement.contract.wizard.createContractTitle');
						break;
					case 2:
						$scope.wizard.title = $translate.instant('procurement.contract.wizard.createCallOfContractHeaderTitle');
						break;
					case 3:
						$scope.initOptions.isShowPrjChange = true;
						$scope.wizard.title = $translate.instant('procurement.contract.wizard.createChangeOrderContractHeaderTitle');
						break;
					case 5:
						initConfiguration();
						$scope.initOptions.contractText = $translate.instant('procurement.contract.wizard.frameWorkAgreement');
						$scope.wizard.title = $translate.instant('procurement.contract.wizard.createCallOfFrameworkContractHeaderTitle');
						break;
				}
			}

			$scope.previousStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				wz.previous();
				switch ($scope.selectStep.number) {
					case 1:
						$scope.options.width = firDialogWidth;
						setCurrentStep($scope.selectStep.number - 1);
						platformGridAPI.grids.unregister($scope.gridId);
						$scope.wizard.title = $translate.instant('procurement.contract.wizard.createContractTitle');
						break;
				}
			};

			$scope.nextStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);

				switch ($scope.selectStep.number) {
					case 0:
						wz.next();
						$scope.options.width = secDialogWidth;
						setCurrentStep($scope.selectStep.number + 1);
						break;
					case 1:
						$scope.isLoading = true;
						let contract = {
							Code: $scope.initOptions.dataModels.code,
							ProjectFk: $scope.initOptions.dataModels.projectFk,
							ConfigurationFk: $scope.initOptions.dataModels.configurationFk,
							BusinessPartnerFk: $scope.initOptions.dataModels.businessPartner.Id,
							ConHeaderFk: $scope.initOptions.dataModels.contractFk,
							ProjectChangeFk: $scope.initOptions.dataModels.projectChange ? $scope.initOptions.dataModels.projectChange.Id : null,
							SupplierFk: $scope.initOptions.dataModels.supplier ? $scope.initOptions.dataModels.supplier.Id : null,
							SubsidiaryFk: $scope.initOptions.dataModels.subsidiary ? $scope.initOptions.dataModels.subsidiary.Id : null,
							ContactFk: $scope.initOptions.dataModels.contact ? $scope.initOptions.dataModels.contact.Id : null,
							BoqWicCatFk: $scope.initOptions.dataModels.BoqWicCatFk,
							BoqWicCatBoqFk : $scope.initOptions.dataModels.boqWicCatBoqFk,
							MaterialCatalogFk: $scope.initOptions.dataModels.MdcMaterialCatalogFk,
							PaymentTermPaFk : $scope.initOptions.dataModels.paymentTermFk,
							PaymentTermFiFk : $scope.initOptions.dataModels.paymentTermFiFk,
							PaymentTermAdFk : $scope.initOptions.dataModels.paymentTermAdFk,
							IncotermFk : $scope.initOptions.dataModels.incoTermFk,
							BpdVatGroupFk : $scope.initOptions.dataModels.vatGroupFk,
							BankFk : $scope.initOptions.dataModels.bankFk,
							ControllingUnitFk:$scope.initOptions.dataModels.controllingUnitFk,
							ClerkPrcFk:$scope.initOptions.dataModels.ClerkPrcFk,
							ClerkReqFk:$scope.initOptions.dataModels.ClerkReqFk,
						}
						if($scope.initOptions.dataModels.MdcMaterialCatalogFk){
							contract.BankFk = scopeEntity.BankFk;
							contract.BpdVatGroupFk = scopeEntity.BpdVatGroupFk;
							contract.PaymentTermAdFk = scopeEntity.PaymentTermAdFk;
							contract.PaymentTermFiFk = scopeEntity.PaymentTermFiFk;
							contract.PaymentTermPaFk = scopeEntity.PaymentTermPaFk;
							contract.IncotermFk = scopeEntity.IncotermFk;
							contract.ClerkPrcFk = scopeEntity.ClerkPrcFk;
							contract.ClerkReqFk = scopeEntity.ClerkReqFk;
						}
						if($scope.initOptions.dataModels.BoqWicCatFk || $scope.initOptions.dataModels.projectFk){
							contract.BankFk = scopeEntity.BankFk;
						}
						if($scope.selectedOption === 1){
							scopeEntity.Code = $scope.initOptions.dataModels.code;
							scopeEntity.ProjectFk = $scope.initOptions.dataModels.projectFk;
							scopeEntity.ConfigurationFk = $scope.initOptions.dataModels.configurationFk;
							scopeEntity.ControllingUnitFk = $scope.initOptions.dataModels.controllingUnitFk;
							scopeEntity.BusinessPartnerFk = $scope.initOptions.dataModels.businessPartner.Id;
							scopeEntity.SupplierFk = $scope.initOptions.dataModels.supplier ? $scope.initOptions.dataModels.supplier.Id : null;
							scopeEntity.SubsidiaryFk = $scope.initOptions.dataModels.subsidiary ? $scope.initOptions.dataModels.subsidiary.Id : null;
							scopeEntity.ContactFk = $scope.initOptions.dataModels.contact ? $scope.initOptions.dataModels.contact.Id : null;
						}
						scopeEntity.Code = $scope.initOptions.dataModels.code;
						scopeEntity.ConfigurationFk = contract.ConfigurationFk;
						var parameter = {
							CreateType: $scope.selectedOption,
							conHeaderEntity: $scope.selectedOption === 1 ? scopeEntity : contract,
							StructureFk: $scope.initOptions.dataModels.prcStructureFk
						};
						$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createContractFromWizard', parameter).then(function (response) {
							$scope.isLoading = false;
							if (response.data && response.data.ConHeaderDto) {

									let contractService = $injector.get('procurementContractHeaderDataService');
								if($scope.selectedOption === 1){
									let conHeader = response.data.ConHeaderDto;

									if(conHeader.ProjectFk === 0){
										conHeader.ProjectFk = null;
									}
									let creationData = {
										BusinessPartnerFk : $scope.initOptions.dataModels.businessPartner.Id,
										Code : conHeader.Code,
										ConfigurationFk: conHeader.PrcHeaderEntity.ConfigurationFk,
										ContactFk: conHeader.ContactFk,
										ProjectFk: conHeader.ProjectFk,
										SubsidiaryFk: conHeader.SubsidiaryFk,
										SupplierFk: conHeader.SupplierFk
									};
									let contractServiceContainer = contractService.getContainerData();
									contractService.getContainerData().onCreateSucceeded(conHeader,contractServiceContainer,creationData).then(()=>{
										platformDataServiceModificationTrackingExtension.markAsModified(contractService, conHeader, contractService.getContainerData());
										contractService.gridRefresh();
									});

								}else {
									var contract = response.data.ConHeaderDto;
									let currentItemList = contractService.getList();
									currentItemList.push(contract);
									contractService.gridRefresh();
									contractService.setSelected(contract);
								}
								$scope.$close();
							} else {
								showInfo(true, $translate.instant('procurement.contract.wizard.fail'), 'ico-error');
							}
						}, function () {
							$scope.isLoading = false;
							$scope.initOptions.dataModels.vatGroupFk = null;
							$scope.initOptions.dataModels.bankFk = null;
						});
						break;
				}
			};

			function initConfiguration() {
				$scope.isLoading = true;
				$http.get(globals.webApiBaseUrl + 'procurement/contract/header/getdefaultvalues?projectFk=0')
					.then(function (respon) {
						if (respon && respon.data && respon.data.ConHeaderDto) {
							$scope.initOptions.dataModels.configurationFk = respon.data.ConHeaderDto.PrcHeaderEntity.ConfigurationFk;
							$scope.initOptions.dataModels.vatGroupFk = respon.data.ConHeaderDto.BpdVatGroupFk;
							$scope.initOptions.dataModels.paymentTermAdFk = respon.data.ConHeaderDto.PaymentTermAdFk;
							$scope.initOptions.dataModels.paymentTermFiFk = respon.data.ConHeaderDto.PaymentTermFiFk
							$scope.initOptions.dataModels.paymentTermFk = respon.data.ConHeaderDto.PaymentTermPaFk;
							$scope.initOptions.dataModels.incoTermFk = respon.data.ConHeaderDto.IncotermFk;
							scopeEntity = { ...scopeEntity, ...respon.data.ConHeaderDto };
						}
					}).finally(() => {
					$scope.isLoading = false;
				});
			}

			function showInfo(message, type) {
				$scope.error = {
					show: true,
					messageCol: 1,
					message: message,
					type: type
				};
			}

			$scope.disableOk = () => {
				let stepNumber = 0;
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					stepNumber = wz.currentStepNumber();
				}
				if (stepNumber === 2) {
					if ($scope.selectedOption === 1) {

					}
					switch ($scope.selectedOption) {
						case 2 :
							return !$scope.initOptions.dataModels.contractFk;
						case 3:
							return !($scope.initOptions.dataModels.contractFk && $scope.initOptions.dataModels.projectChange && $scope.initOptions.dataModels.projectChange.Id);
						case 5:
							return !($scope.initOptions.dataModels.MdcMaterialCatalogFk || ($scope.initOptions.dataModels.BoqWicCatFk && $scope.initOptions.dataModels.boqWicCatBoqFk) && $scope.initOptions.dataModels.businessPartner.Id);
					}
				}
				return false;
			}
			$scope.getButtonText = function () {
				if ($scope.isLastStep()) {
					return $translate.instant('procurement.contract.wizard.createContractBottomTitle');
				}

				return $translate.instant('basics.common.button.nextStep');
			};

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

			$scope.lookupOptions = {
				controllingUnit: {
					lookupDirective: 'controlling-structure-dialog-lookup',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: false,
						filterKey: 'prc-con-controlling-by-prj-filter'
					}
				},
				contract: {
					lookupDirective: 'prc-con-header-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: false,
						filterKey: 'prc-base-con-header-for-con-filter'
					}
				},
				configuration: {
					lookupType: 'prcConfiguration',
					filterKey: 'prc-contract-configuration-filter',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
				},
				prcStructure: {
					lookupDirective: 'basics-procurementstructure-structure-dialog',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						filterKey: 'basics-materialcatalog-procurement-structure-filter'
					}
				},
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
							var oldSubId = $scope.initOptions.dataModels.subsidiary.Id;
							$scope.initOptions.dataModels.subsidiary = args.selectedItem || {};
							var newSubId = $scope.initOptions.dataModels.subsidiary.Id;
							if (!_.isNil(newSubId) && oldSubId !== newSubId) {
								createContractWizardService.setDefaultSupplier($scope.initOptions.dataModels.businessPartner.Id, -1, newSubId);
								createContractWizardService.setDefaultContact($scope.initOptions.dataModels.businessPartner.Id, newSubId);
							}
							if (_.isNil(newSubId)) {
								$scope.initOptions.dataModels.supplier = null;
								$scope.initOptions.dataModels.contact = null;
							}
							if (e && e.code && e.code === 'Enter') {
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

							if (e && e.code && e.code === 'Enter') {
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
				projectChange: {
					lookupType: 'projectchange',
					lookupDirective: 'project-change-dialog',
					descriptionMember: 'Description',
					lookupOptions:
						{
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									$scope.initOptions.dataModels.projectChange = args.selectedItem || {};
								}
							}],
							createOptions: {
								typeOptions: {
									isProcurement: true,
									isChangeOrder: true
								},
								initCreateData: function (createData) {
									createData.PKey1 = $scope.initOptions.dataModels.projectFk;
									return createData;
								},
								handleCreateSuccessAsync: function ($injector, createItem) {
									var selectedBaseContracts = createContractWizardService.getSelectedContracts($scope.gridId) || [];
									var selectContract = null;
									if (selectedBaseContracts[0] !== null && selectedBaseContracts[0] !== undefined) {
										selectContract = selectedBaseContracts[0];
										createItem.ProjectFk = selectedBaseContracts[0].ProjectFk;
									}
									var $q = $injector.get('$q');

									var configLookup = null;
									var lookupTarget = null;
									if (selectContract !== null && selectContract.PrcHeaderEntity && selectContract.PrcHeaderEntity.ConfigurationFk) {
										var lookupService = $injector.get('basicsLookupdataLookupDescriptorService');
										var configLookupSet = lookupService.getData('prcConfiguration');
										if (configLookupSet && configLookupSet[selectContract.PrcHeaderEntity.ConfigurationFk]) {
											configLookup = configLookupSet[selectContract.PrcHeaderEntity.ConfigurationFk];
											var headerLookupSet = lookupService.getData('prcconfigheader');
											if (headerLookupSet) {
												lookupTarget = headerLookupSet[configLookup.PrcConfigHeaderFk];
											}
										}
									}
									if (configLookup) {
										if (lookupTarget) {
											if (selectContract !== null && lookupTarget.IsChangeFromMainContract) {
												createItem.ContractHeaderFk = selectContract.ConHeaderFk !== null ? selectContract.ConHeaderFk : selectContract.Id;
											}
											return $q.when(true);
										} else {
											return $injector.get('basicsLookupdataLookupDataService').getItemByKey('prcconfigheader', configLookup.PrcConfigHeaderFk).then(function (lookupTarget) {
												if (selectContract !== null && lookupTarget.IsChangeFromMainContract) {
													createItem.ContractHeaderFk = selectContract.ConHeaderFk !== null ? selectContract.ConHeaderFk : selectContract.Id;
												}
												return true;
											});
										}
									}
									return $q.when(true);
								}
							},
							filterOptions: {
								serverKey: 'project-change-lookup-for-contract-filter',
								serverSide: true,
								fn: function (dataContext) {
									return {
										ProjectFk: $scope.initOptions.dataModels.projectFk,
										PrcHeaderConfigurationFk: $scope.initOptions.dataModels.configurationFk,
										ContractHeaderFk: $scope.initOptions.dataModels.contractFk,
										IsProcurement: true,
										IsChangeOrder: true
									};
								}
							}
						}
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
							var selectedItem = args.selectedItem;
							$scope.initOptions.dataModels.businessPartner = selectedItem || {};
							var oldsuBId = $scope.initOptions.dataModels.subsidiary.Id;
							$scope.initOptions.dataModels.subsidiary.Id = selectedItem ? selectedItem.SubsidiaryFk : null;
							var entity = {BusinessPartnerFk: $scope.initOptions.dataModels.businessPartner.Id, SubsidiaryFk: $scope.initOptions.dataModels.subsidiary.Id};
							if (selectedItem && selectedItem.ContactFromBpDialog) {
								$scope.initOptions.dataModels.contact.Id = selectedItem.ContactFk;
								selectedItem.ContactFromBpDialog = false;
							} else {
								businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BusinessPartnerFk, entity.SubsidiaryFk).then(function () {
									if (!_.isNil(entity.ContactFk)) {
										$scope.initOptions.dataModels.contact.Id = entity.ContactFk;
									} else {
										$scope.initOptions.dataModels.contact.Id = null;
									}
								});
							}
							if (!selectedItem) {
								$scope.initOptions.dataModels.subsidiary = {};
								$scope.initOptions.isBtnNextDisabled = true;
								$scope.initOptions.dataModels.supplier = {};
								$scope.initOptions.dataModels.contact = {};
							}
							var subsidiaryId = $scope.initOptions.dataModels.subsidiary.Id;
							if (_.isNil(subsidiaryId)) {
								subsidiaryId = -1;
							}
							if (selectedItem) {
								if (oldsuBId !== selectedItem.SubsidiaryFk) {
									createContractWizardService.setDefaultSupplier(selectedItem.Id, -1, subsidiaryId);
								}
								$scope.initOptions.isBtnNextDisabled = false;
								contractHeaderElementValidationService.validateBusinessPartnerFk(scopeEntity,$scope.initOptions.dataModels.businessPartner.Id,'BusinessPartnerFk');
							}
							if (e && e.code && e.code === 'Enter') {
								$scope.isPopupEnter = true;
							}
						}
					}]
				},
				contact: {
					lookupType: 'Contact',
					version: 3,
					filterKey: 'prc-package-wizard-createcontract-contact-filterkey',
					valueMember: 'Id',
					displayMember: 'FullName',
					showClearButton: true
				},
				materialCatalog: {
					lookupDirective: 'basics-material-material-catalog-lookup',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						showClearButton: true,
						lookupType: 'MaterialCatalog',
						filterKey: 'prc-con-material-catalog-filter',
						'title': {
							'name': 'Framework Material Catalog Search Dialog',
							'name$tr$': 'procurement.contract.frameworkMaterialCatalogSearchDialog'
						}
					}
				},
				projectConfig:{
					lookupDirective:'basics-lookup-data-project-project-dialog',
					descriptionMember:'ProjectName',
					lookupOptions:{showClearButton: true}
				},
				boqWicCat:
					{
						lookupDirective: 'estimate-main-est-wic-group-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							showClearButton: true
						}
					},
				boqWicCatBoq: {
					lookupDirective: 'prc-common-wic-cat-boq-lookup',
					descriptionMember: 'BoqRootItem.BriefInfo.Translated',
					lookupOptions: {
						showClearButton: true,
						lookupType: 'PrcWicCatBoqs',
						filterKey: 'prc-con-wic-cat-boq-filter',
						disableDataCaching: true,
					}
				}

			};

			$scope.fieldConfig = {
				contract: {
					model: 'ConHeaderFk',
				},
				prcStructure: {
					model: 'PrcStructureFk',
				},
				controllingUnit: {
					model: 'ControllingUnitFk',
				},
				businessPartner: {
					model: 'BusinessPartnerFk',
				},
				subsidiary: {
					model: 'SubsidiaryFk',
				},
				supplier: {
					model: 'SupplierFk',
				},
				contact: {
					model: 'ContactFk',
				},
				defaultConfig: {
					rt$readonly: function () {
						return ($scope.selectedOption !== 1 && $scope.selectedOption !== 5);
					}
				},
				defaultBpConfig:{
					rt$readonly: function () {
						return $scope.selectedOption !== 1;
					}
				},
				byBpConfig: {
					rt$readonly: function () {
						if ($scope.selectedOption !== 1) {
							return true;
						}
						let bp = $scope.initOptions.dataModels.businessPartner;
						return !(bp && bp.Id);
					}
				},
				cuAndStrConfig: {
					rt$readonly: function () {
						return $scope.selectedOption !== 1;
					}
				},
				projectChangeConfig: {
					rt$readonly: function () {
						if ($scope.selectedOption !== 1) {
							const contractFk = $scope.initOptions.dataModels.contractFk;
							return !(contractFk > 0);
						}
						return false;
					}
				},
				contactConfig: {
					rt$readonly: function () {
						if ($scope.selectedOption === 2 || $scope.selectedOption === 3) {
							return true;
						}
						let bp = $scope.initOptions.dataModels.businessPartner;
						return !(bp && bp.Id);
					}
				},
				materialCatalog: {
					rt$readonly: function () {
						let boqWicCatFk = $scope.initOptions.dataModels.BoqWicCatFk;
						return !!boqWicCatFk;
					}
				},
				boqWicCat:{
					rt$readonly: function () {
						let mdcMaterialCatalogFk = $scope.initOptions.dataModels.MdcMaterialCatalogFk;
						return !!mdcMaterialCatalogFk;
					}
				},
				boqWicCatBoq:{
					rt$readonly: function () {
						let mdcMaterialCatalogFk = $scope.initOptions.dataModels.MdcMaterialCatalogFk;
						let boqWicCatFk = $scope.initOptions.dataModels.BoqWicCatFk;
						return !(!mdcMaterialCatalogFk && boqWicCatFk);
					}
				}
			};

			$scope.configurationChange = function () {
				generalCode($scope.initOptions.dataModels.configurationFk);
			};

			$scope.onProjectChange = () => {
				if(!_.isNil($scope.initOptions.dataModels.projectFk)) {
					getCuByProject();
					getClerkByProject($scope.initOptions.dataModels.projectFk, scopeEntity);
				}else{
					$scope.initOptions.dataModels.controllingUnitFk = null;
					$scope.initOptions.dataModels.ClerkPrcFk =scopeEntity.ClerkPrcFk = null;
					$scope.initOptions.dataModels.ClerkReqFk = scopeEntity.ClerkReqFk = null;
				}
			}

			function getClerkByProject(value, entity) {

				var clerkData = {
					prcStructureFk: entity.PrcHeaderEntity.StructureFk,
					projectFk: value,
					companyFk: entity.CompanyFk
				};

				if (entity.ClerkPrcFk === null || entity.ClerkReqFk === null) {
					$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function (response) {
						if (!_.isNil(response.data[0])) {
							entity.ClerkPrcFk = response.data[0];
						}
						if (!_.isNil(response.data[1])) {
							entity.ClerkReqFk = response.data[1];
						}
					});
				}
			}

			$scope.contractChange = () => {
				if ($scope.selectedOption === 2 || $scope.selectedOption === 3 || $scope.selectedOption === 5 && $scope.initOptions.dataModels.contractFk > 0) {
					$scope.initOptions.isReadonlyCU = false;
					let contractLookups = basicsLookupdataLookupDescriptorService.getData('conheaderview');
					if (contractLookups) {
						let contract = _.find(contractLookups, (e) => {
							return e.Id === $scope.initOptions.dataModels.contractFk;
						});
						if (contract) {
							$scope.initOptions.dataModels.projectFk = contract.ProjectFk;
							$scope.initOptions.dataModels.configurationFk = contract.PrcConfigurationFk;
							$scope.initOptions.dataModels.controllingUnitFk = contract.ControllingUnitFk;
							$scope.initOptions.dataModels.prcStructureFk = contract.PrcStructureFk;
							$scope.initOptions.dataModels.businessPartner.Id = contract.BusinessPartnerFk;
							$scope.initOptions.dataModels.subsidiary.Id = contract.BpdSubsidiaryFk;
							$scope.initOptions.dataModels.supplier.Id = contract.BpdSupplierFk;
							$scope.initOptions.dataModels.contact.Id = contract.BpdContactFk;
							$scope.initOptions.dataModels.BoqWicCatFk = contract.BoqWicCatFk;
							$scope.initOptions.dataModels.MdcMaterialCatalogFk = contract.MdcMaterialCatalogFk;
						}
					}
				}
			}

			$scope.materialCatalogChange = ()=>{
				let contractValidationService = $injector.get('contractHeaderElementValidationService');

				return contractValidationService.changeMaterialCatalogFk(entity,$scope.initOptions.dataModels.MdcMaterialCatalogFk,'MaterialCatalogFk').then(()=>{
					$scope.initOptions.dataModels.businessPartner.Id = scopeEntity.BusinessPartnerFk = entity.BusinessPartnerFk;
					$scope.initOptions.dataModels.subsidiary.Id = scopeEntity.SubsidiaryFk = entity.SubsidiaryFk;
					$scope.initOptions.dataModels.supplier.Id = scopeEntity.SupplierFk = entity.SupplierFk;
					$scope.initOptions.dataModels.bankFk = scopeEntity.BankFk = entity.BankFk;
					$scope.initOptions.dataModels.prcStructureFk = scopeEntity.PrcHeaderEntity.StructureFk = entity.PrcHeaderEntity.StructureFk;
					$scope.initOptions.dataModels.paymentTermAdFk = scopeEntity.PaymentTermAdFk = entity.PaymentTermAdFk;
					$scope.initOptions.dataModels.paymentTermFiFk = scopeEntity.PaymentTermFiFk = entity.PaymentTermFiFk;
					$scope.initOptions.dataModels.paymentTermFk = scopeEntity.PaymentTermPaFk = entity.PaymentTermPaFk;
					$scope.initOptions.dataModels.incoTermFk = scopeEntity.IncotermFk = entity.IncotermFk;
					getVatGroupClerkBySupplier(scopeEntity);
				});
			}

			$scope.prcStructureChange=() =>{
				let contractValidationService = $injector.get('contractHeaderElementValidationService');

				return contractValidationService.validatePrcHeaderEntity$StructureFk(scopeEntity,$scope.initOptions.dataModels.prcStructureFk,'MaterialCatalogFk');
			}

			$scope.boqWicCatChange = ()=>{
				$scope.initOptions.dataModels.boqWicCatBoqFk = null;
				clearBpInfo();
			}

			$scope.boqWicCatBoqChange = ()=>{
				let prcWicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
				if(prcWicCatBoqs) {
					let prcWicCatBoq = _.find(prcWicCatBoqs,(e)=>{
						return e.Id === $scope.initOptions.dataModels.boqWicCatBoqFk;
					});
					if(prcWicCatBoq){
						$scope.initOptions.dataModels.businessPartner.Id = prcWicCatBoq.WicBoq.BpdBusinessPartnerFk;
						$scope.initOptions.dataModels.subsidiary.Id = prcWicCatBoq.WicBoq.BpdSubsidiaryFk;
						$scope.initOptions.dataModels.supplier.Id = prcWicCatBoq.WicBoq.BpdSupplierFk;
						$scope.initOptions.dataModels.paymentTermFk = prcWicCatBoq.WicBoq.BasPaymentTermFk;
						$scope.initOptions.dataModels.paymentTermFiFk = prcWicCatBoq.WicBoq.BasPaymentTermFiFk;
						$scope.initOptions.dataModels.paymentTermAdFk = prcWicCatBoq.WicBoq.BasPaymentTermAdFk;
						let contracts = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
						let conHeader = _.find(contracts, {Id: prcWicCatBoq.WicBoq.ConHeaderFk});
						if(conHeader){
							$scope.initOptions.dataModels.prcStructureFk = entity.PrcHeaderEntity.StructureFk = conHeader.PrcStructureFk;
							$scope.prcStructureChange();
						}

						getVatGroupBank4Supplier($scope.initOptions.dataModels.supplier.Id);
					}else{
						clearBpInfo();
					}
				}
			}

			function asyncGetFrameworkContract(conHeaderFk) {
				if (conHeaderFk) {
					return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' +conHeaderFk).then(function(res) {
						return res.data;
					});
				}
			}

			async function getVatGroupBank4Supplier(supplierId) {
				if (supplierId !== null) {
					let supplier = _.find(basicsLookupdataLookupDescriptorService.getData('supplier'), {Id: supplierId});
					if (!supplier) {
						try {
							var searchRequest = {
								FilterKey: 'businesspartner-main-supplier-common-filter',
								SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
								SearchText: '',
								AdditionalParameters: {
									BusinessPartnerFk: $scope.initOptions.dataModels.businessPartner.Id,
									SubsidiaryFk: $scope.initOptions.dataModels.subsidiary.Id
								}
							};
							let dataList = await lookupDataService.getSearchList('supplier', searchRequest);
							let data = dataList.items ? dataList.items : [];
							supplier = _.find(data, {Id: supplierId});
						} catch (error) {
							console.error('Error fetching supplier:', error);
							supplier = null;
						}
					}
					let prcWicCatBoqs = basicsLookupdataLookupDescriptorService.getData('PrcWicCatBoqs');
					if (prcWicCatBoqs) {
						let wicCatBoq = _.find(prcWicCatBoqs, (e) => {
							return e.Id === $scope.initOptions.dataModels.boqWicCatBoqFk;
						});
						if (wicCatBoq && wicCatBoq.WicBoq) {
							let hasPaymentTermFk = !!(wicCatBoq.WicBoq.BasPaymentTermFk || wicCatBoq.WicBoq.BasPaymentTermFiFk || wicCatBoq.WicBoq.BasPaymentTermAdFk);

							if (wicCatBoq.WicBoq.BpdBusinessPartnerFk) {
								$scope.initOptions.dataModels.businessPartner.Id = wicCatBoq.WicBoq.BpdBusinessPartnerFk;
								if (wicCatBoq.WicBoq.BpdSubsidiaryFk) {
									$scope.initOptions.dataModels.subsidiary.Id = wicCatBoq.WicBoq.BpdSubsidiaryFk;
								} else {
									$scope.initOptions.dataModels.subsidiary = null;
								}
								if (wicCatBoq.WicBoq.BpdSupplierFk) {
									$scope.initOptions.dataModels.supplier.Id = wicCatBoq.WicBoq.BpdSupplierFk;
									return $http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + supplierId)
										.then(function (response) {
											var context = platformContextService.getContext();
											var companyId = context.clientId;
											var supplierWithSameCompany = _.filter(response.data, function (d) {
												return d.BasCompanyFk === companyId;
											});

											if (supplierWithSameCompany.length && response.data && response.data.length > 0) {
												var supplierCompany = _.orderBy(supplierWithSameCompany, ['Id']);
												if (supplierCompany[0].BasPaymentTermPaFk) {
													$scope.initOptions.dataModels.paymentTermFk = supplierCompany[0].BasPaymentTermPaFk;
												} else if (supplier && supplier.PaymentTermPaFk) {
													$scope.initOptions.dataModels.paymentTermFk = supplier.PaymentTermPaFk;
												}
												if (supplierCompany[0].BasPaymentTermFiFk) {
													$scope.initOptions.dataModels.paymentTermFiFk = supplierCompany[0].BasPaymentTermFiFk;
												} else if (supplier && supplier.PaymentTermFiFk) {
													$scope.initOptions.dataModels.paymentTermFiFk = supplier.PaymentTermFiFk;
												}
												// set VatGroup
												if (supplierCompany[0].VatGroupFk !== null) {
													$scope.initOptions.dataModels.vatGroupFk = supplierCompany[0].VatGroupFk;
												} else if (supplier && supplier.BpdVatGroupFk !== null) {
													$scope.initOptions.dataModels.vatGroupFk = supplier.BpdVatGroupFk;
												}

												if (!_.isNil(supplierCompany[0].BankFk)) {
													$scope.initOptions.dataModels.bankFk = supplierCompany[0].BankFk;
												} else if (supplier && !_.isNil(supplier.BankFk)) {
													$scope.initOptions.dataModels.bankFk = supplier.BankFk;
												}
											} else {
												if (supplier && supplier.BpdVatGroupFk !== null) {
													$scope.initOptions.dataModels.vatGroupFk = supplier.BpdVatGroupFk;
												}
												if (!hasPaymentTermFk) {
													if (supplier && !_.isNil(supplier.BankFk)) {
														$scope.initOptions.dataModels.bankFk = supplier.BankFk;
													}
													if (supplier && supplier.PaymentTermPaFk !== null) {
														$scope.initOptions.dataModels.paymentTermFk = supplier.PaymentTermPaFk;
													}
													if (supplier && supplier.PaymentTermFiFk !== null) {
														$scope.initOptions.dataModels.paymentTermFiFk = supplier.PaymentTermFiFk;
													}
												}
											}
											if (hasPaymentTermFk) {
												$scope.initOptions.dataModels.paymentTermFk = wicCatBoq.WicBoq.BasPaymentTermFk;
												$scope.initOptions.dataModels.paymentTermFiFk = wicCatBoq.WicBoq.BasPaymentTermFiFk;
												$scope.initOptions.dataModels.paymentTermAdFk = wicCatBoq.WicBoq.BasPaymentTermAdFk;
											}
										});
								} else {
									$scope.initOptions.dataModels.supplier = null;
								}
							}
						} else {
							var bankRequest = $http.get(globals.webApiBaseUrl + 'businesspartner/main/bank/getdefault4supplier?businessPartnerId=' + $scope.initOptions.dataModels.businessPartner.Id + '&supplierId=' + $scope.initOptions.dataModels.supplier.Id);
							var vatGroupRequest = $http.get(globals.webApiBaseUrl + 'businesspartner/main/suppliercompany/list?mainItemId=' + $scope.initOptions.dataModels.supplier.Id);

							return $q.all([bankRequest, vatGroupRequest]).then(function (responses) {
								var res = responses[0];
								var response = responses[1];

								var context = platformContextService.getContext();
								var companyId = context.clientId;
								var supplierWithSameCompany = _.filter(response.data, function (d) {
									return d.BasCompanyFk === companyId;
								});

								if (supplierWithSameCompany.length && response.data && response.data.length > 0) {
									var supplierCompany = _.orderBy(supplierWithSameCompany, ['Id']);
									// set VatGroup
									if (supplierCompany[0].VatGroupFk !== null) {
										$scope.initOptions.dataModels.vatGroupFk = supplierCompany[0].VatGroupFk;
									} else if (supplier && supplier.BpdVatGroupFk !== null) {
										$scope.initOptions.dataModels.vatGroupFk = supplier.BpdVatGroupFk;
									}
								}

								var data = res.data;
								if (data) {
									$scope.initOptions.dataModels.bankFk = data.Id;
								}
							}).catch(function (error) {
								console.error("request error", error);
							});
						}
					}
				}
			}

			function clearBpInfo() {
				$scope.initOptions.dataModels.businessPartner.Id = null;
				$scope.initOptions.dataModels.subsidiary.Id = null;
				$scope.initOptions.dataModels.supplier.Id = null;
				$scope.initOptions.dataModels.contact.Id = null;
			}

			function getCuByProject() {
				$scope.isLoading = true;
				$injector.get('procurementCommonControllingUnitFactory').getControllingUnit($scope.initOptions.dataModels.projectFk, $scope.initOptions.dataModels.controllingUnitFk).then(function (res) {
					if (res !== '' && res !== null) {
						$scope.initOptions.dataModels.controllingUnitFk = res;
					} else {
						$scope.initOptions.dataModels.controllingUnitFk = null;
					}
				}).finally(function () {
					$scope.isLoading = false;
				});
			}

			function getVatGroupClerkBySupplier(entity){
				return  $http.get(globals.webApiBaseUrl +'procurement/contract/wizard/GetVatGroupAndClerkBySupplier?supplierFk='+entity.SupplierFk).then(function (response) {
					if (!_.isNil(response.data)) {
						scopeEntity.ClerkPrcFk = response.data.ClerkPrcFk;
						scopeEntity.BpdVatGroupFk = response.data.BpdVatGroupFk;
					}
				});
			}

			var unWatch = $scope.$watch(function watchFn() {
				return $scope.getCurrentStepNumber();
			}, function compareFn(newValue, oldValue) {
				if (newValue !== oldValue) {
					$scope.modalOptions.headerText = $scope.wizard.title;
				}
			});

			$scope.$on('$destroy', function destroyFn() {
				unWatch();
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			});
		}]);

})(angular);
