(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	angular.module(moduleName).controller('procurementPackageWizardCreateContractController', [
		'_', '$scope', '$http', 'globals', '$state', '$timeout', '$translate', '$injector',
		'procurementPackageDataService', 'procurementPackagePackage2HeaderService', 'procurementPackageWizardCreateContractService',
		'cloudDesktopSidebarService', 'basicsLookupdataLookupFilterService',
		'platformModuleNavigationService', 'platformModuleInfoService',
		'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService','businessPartnerLogicalValidator',
		function (_, $scope, $http, globals, $state, $timeout, $translate, $injector,
			packageDataService, subPackageDataService, packageWizardCreateContractService,
			cloudDesktopSidebarService, lookupFilterService,
			platformModuleNavigationService, platformModuleInfoService,
			platformGridAPI, platformTranslateService, platformRuntimeDataService, LookupDescriptorService, businessPartnerLogicalValidator) {

			var translatePrefix = 'procurement.package.wizard.contract.';

			var data = $scope.dialog.modalOptions.data;
			let hasContractItem = $scope.dialog.modalOptions.hasContractItem;
			let packageFromScope = $scope.dialog.modalOptions.package;
			let subPackageFromScope = $scope.dialog.modalOptions.subPackage;
			let resultPromiseFromScope = $scope.dialog.modalOptions.resultPromise;
			var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: packageWizardCreateContractService});

			var isOverWrite = false;
            var isChangeOrderShow=false;
			if (data && data.contracts) {
				// first case: only one base contract and it has no changes.
				var contracts = data.contracts;
				var validChangeOrderContracts = data.validChangeOrderContracts;
				if (contracts.length === 1 && !contracts[0].ConStatus.IsOrdered &&
					!contracts[0].ConStatus.IsReadonly && (!validChangeOrderContracts || validChangeOrderContracts.length === 0)) {
					isOverWrite=true;
					isChangeOrderShow=true;
					packageWizardCreateContractService.baseContractId = contracts[0].Id;
					// readonly contracts here.
					_.forEach(contracts, function (item) {
						platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: true}]);
					});
				} else if (contracts.length === 1) {
					// if not over write, then will be create change order contract as the default.
					contracts[0].Selected = true;
				}
			}
			var filters = [
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
						if(!_.isNil($scope.initOptions.dataModels.supplier)){
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
				}
			];

			var itemColumns = [
				{
					id: 'status',
					field: 'StatusFk',
					name: 'Status',
					name$tr$: 'cloud.common.entityState',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcItemStatus',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService'
					},
					width: 100
				},
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					formatter: 'description',
					width: 125
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'comment',
					width: 125
				},
				{
					id: 'packageQuantity',
					field: 'PackageQuantity',
					name: 'Package Quantity',
					name$tr$: 'procurement.package.wizard.packageQuantity',
					formatter: 'quantity',
					width: 85
				},
				{
					id: 'contractQuantity',
					field: 'ContractQuantity',
					name: 'Contracted Quantity',
					name$tr$: 'procurement.package.wizard.contractedQuantity',
					formatter: 'quantity',
					width: 85
				},
				{
					id: 'varianceQuantity',
					field: 'VarianceQuantity',
					name: 'Variance Quantity',
					name$tr$: 'procurement.package.wizard.varianceQuantity',
					formatter: 'quantity',
					width: 85
				},
				{
					id: 'uom',
					field: 'UomFk',
					name$tr$: 'cloud.common.entityUoM',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Uom',
						displayMember: 'Unit'
					},
					width: 100
				}
			];

			var contractColumns = [
				{
					id: 'selected',
					field: 'Selected',
					name: 'Selected',
					name$tr$: 'cloud.common.Selected',
					formatter: 'boolean',
					editor: $scope.readonly ? null : 'boolean',
					headerChkBox: false,
					validator: validateSelected
				},
				{
					id: 'status',
					field: 'ConStatusFk',
					name: 'Status',
					name$tr$: 'cloud.common.entityState',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ConStatus',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService'
					}
				},
				{
					id: 'contractCode',
					field: 'Code',
					name: 'Contract Code',
					name$tr$: 'cloud.common.entityCode',
					formatter: 'code'
				},
				{
					id: 'contractDescription',
					field: 'Description',
					name: 'Contract Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description'
				},
				{
					id: 'businessPartner',
					field: 'BusinessPartnerFk',
					name: 'Business Partner',
					name$tr$: 'cloud.common.entityBusinessPartner',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				{
					id: 'contractTotal',
					field: 'ConTotalValueNet',
					name: 'Total',
					name$tr$: 'cloud.common.entityTotal',
					formatter: 'quantity'
				}
			];

			$scope.hasContractMessage = !!hasContractItem;
			$scope.contractGridId = 'c6709dd7a46542bd984950d56d084bef';
			$scope.contractGridConfig = {
				state: $scope.contractGridId
			};
			$scope.initOptions = {
				headerTitle: $translate.instant(translatePrefix + 'header'),
				navigateTitle: platformModuleInfoService.getNavigatorTitle('procurement.contract'),
				contractorTitle: $translate.instant('procurement.common.contractorTitle'),
				changesFound: $translate.instant(translatePrefix + 'changeFound'),
				chooseToDealWithChanges: $translate.instant(translatePrefix + 'chooseHowToDealWithChanges'),
				overwriteContractText: $translate.instant(translatePrefix + 'overwriteContractText'),
				changeOrderContractText: $translate.instant(translatePrefix + 'changeOrderContractText'),
				creaNewBaseContractWithBp: $translate.instant(translatePrefix + 'creaNewBaseContractWithBp'),
				businessPartnerText: $translate.instant('cloud.common.entityBusinessPartner'),
				contactText: $translate.instant(translatePrefix + 'contact'),
				subsidiaryText: $translate.instant('cloud.common.entitySubsidiary'),
				supplierText: $translate.instant('cloud.common.entitySupplier'),
				overWriteOrCreateText: isOverWrite ? $translate.instant('cloud.common.ok') : $translate.instant('cloud.common.buttonCreate'),
				// btnOkText: $translate.instant('cloud.common.ok'),
				btnCloseText: $translate.instant('cloud.common.cancel'),
				btnNextText: $translate.instant('cloud.common.nextStep'),
				copyHeaderTextFromPackage: $translate.instant(translatePrefix + 'copyHeaderTextFromPackage'),
				isBtnNextDisabled: true,
				isBtnNavigateDisabled: true,
				isOverWrite: isOverWrite,
				isChangeOrderShow:isChangeOrderShow,
				overWriteRadioVal: 'overwrite',
				newBaseRadioVal: 'createBase',
				changeRadioVal: 'changeOrder',
				step: !data ? 'step1' : 'step2', // show 'sub package' info dialog by default
				dialogLoading: false,
				loadingInfo: '',
				radioType: isOverWrite ? 'overwrite' : 'changeOrder',
				noteText: $translate.instant(translatePrefix + 'noteText'),
				projectCollapse: isOverWrite,
				contractGridCollapse: false,
				businessPartnerCollapse: true,
				isBtnLookupContractorDisabled: false,
				doesCopyHeaderTextFromPackage: false,
				dataModels: {
					businessPartner: {},
					subsidiary: {},
					supplier: {},
					projectChange: null,
					contractEntity: {Id: -1},
					contact: {}
				},
				changeProjectConfig: {
					rt$readonly: function () {
						return $scope.initOptions.radioType !== $scope.initOptions.changeRadioVal;
					}
				},
				bpConfig: {
					rt$readonly: function () {
						return $scope.initOptions.radioType !== $scope.initOptions.newBaseRadioVal;
					}
				},
				step1BpOwnConfig: {
					rt$readonly: function () {
						return $scope.initOptions.isBtnLookupContractorDisabled;
					}
				},
				step1BpConfig: {
					rt$readonly: function () {
						var bp = $scope.initOptions.dataModels.businessPartner;
						if (bp && bp.Id) {
							return $scope.initOptions.isBtnLookupContractorDisabled;
						}

						return true;
					}
				},
				onNext: function () { // create base contracts.
					packageWizardCreateContractService.showCreateContractDialog(subPackageFromScope, resultPromiseFromScope);
				},
				onKeyEnter: function () {
					if ($scope.isPopupEnter === true) {
						$scope.isPopupEnter = null;
					} else {
						if ($scope.initOptions.dataModels.businessPartner.Id) {
							// console.log('to do');
							packageWizardCreateContractService.showCreateContractDialog();
						}
					}
				},
				onOk: function () {
					$scope.initOptions.isBtnOKDisabled = true;
					packageWizardCreateContractService.onOk($scope.contractGridId, resultPromiseFromScope);
				},
				onClose: function () {
					$scope.$close(false);
					if(resultPromiseFromScope) {
						resultPromiseFromScope.resolve({cancel:false});
					}
				},
				onNavigate: function () {
					// default navigate to one contract.
					packageWizardCreateContractService.naviGate($scope.initOptions.dataModels.contractEntity, 'Id');
				},
				onOkButtonDisabled: function () {
					var selectedBaseContracts = packageWizardCreateContractService.getSelectedContracts($scope.contractGridId) || [];
					var hasBusinessPartner = !!(this.dataModels.businessPartner && this.dataModels.businessPartner.Id);// this.dataModels.specificBusinessPartner;
					var hasProject = this.dataModels.projectChange && angular.isDefined(this.dataModels.projectChange.Id) && this.dataModels.projectChange.Id > 0;// projectId would be greater then 0.
					return !(this.radioType === this.overWriteRadioVal || (this.radioType === this.newBaseRadioVal && hasBusinessPartner) ||
						(this.radioType === this.changeRadioVal && selectedBaseContracts.length > 0 && hasProject));

				},
				toggleOpen: function (id) {

					if (id === 'contractGrid') {
						$scope.initOptions.contractGridCollapse = !$scope.initOptions.contractGridCollapse;
					} else if (id === 'changeProject') {
						$scope.initOptions.projectCollapse = !$scope.initOptions.projectCollapse;
					} else if (id === 'businessPartner') {
						$scope.initOptions.businessPartnerCollapse = !$scope.initOptions.businessPartnerCollapse;
					}
				},
				isBtnOKDisabled: false
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
							var oldSubId = $scope.initOptions.dataModels.subsidiary.Id;
							$scope.initOptions.dataModels.subsidiary = args.selectedItem || {};
							var newSubId = $scope.initOptions.dataModels.subsidiary.Id;
							if (!_.isNil(newSubId) && oldSubId !== newSubId) {
								packageWizardCreateContractService.setDefaultSupplier($scope.initOptions.dataModels.businessPartner.Id, -1, newSubId);
								packageWizardCreateContractService.setDefaultContact($scope.initOptions.dataModels.businessPartner.Id, newSubId);
							}
							if(_.isNil(newSubId)){
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
					lookupOptions: {
						readonly: $scope.initOptions.radioType !== $scope.initOptions.changeRadioVal,
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
								var packageItem = packageDataService.getSelected() || {};
								createData.PKey1 = packageItem.ProjectFk;
								var selectedBaseContracts = packageWizardCreateContractService.getSelectedContracts($scope.contractGridId) || [];
								if (selectedBaseContracts[0] !== null && selectedBaseContracts[0] !== undefined) {
									createData.PKey1 = selectedBaseContracts[0].ProjectFk;
								}
								return createData;
							},
							handleCreateSuccessAsync: function ($injector, createItem) {
								var selectedBaseContracts = packageWizardCreateContractService.getSelectedContracts($scope.contractGridId) || [];
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
							serverKey: 'project-change-lookup-for-procurement-common-filter',
							serverSide: true,
							fn: function () {
								var packageItem = packageDataService.getSelected() || {};
								return {
									ProjectFk: packageItem.ProjectFk,
									IsProcurement : true
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
							var entity = {BusinessPartnerFk: $scope.initOptions.dataModels.businessPartner.Id, SubsidiaryFk:$scope.initOptions.dataModels.subsidiary.Id};
							if(selectedItem && selectedItem.ContactFromBpDialog){
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
									packageWizardCreateContractService.setDefaultSupplier(selectedItem.Id, -1, subsidiaryId);
								}
								$scope.initOptions.isBtnNextDisabled = false;
							}
							if (e && e.code && e.code === 'Enter') {
								$scope.isPopupEnter = true;
							}
						}
					}]
				},
				contact:  {
					lookupType: 'Contact',
					version: 3,
					filterKey: 'prc-package-wizard-createcontract-contact-filterkey',
					valueMember: 'Id',
					displayMember: 'FullName',
					showClearButton: true
				}
			};
			// item grid config.
			$scope.itemGridId = '2b83b2c77ee048000ef5fc2550c1f816';
			$scope.itemGridConfig = {
				state: $scope.itemGridId
			};

			function GetContactCheck(contacts) {
				if (!_.isEmpty(contacts)) {
					let checkedList = _.filter(contacts, {bpContactCheck: true});
					if (_.isEmpty(checkedList)) {
						checkedList = _.orderBy(contacts, ['IsDefault', 'Id'], ['desc', 'asc']);
					}
					return checkedList.length > 0 ? checkedList[0].Id : contacts[0].Id;
				}
				return null;
			}
			// //////////////////////////////////////////////////////////////////////////////////////////////////////////

			function changeConfigVal(isChangeOrder, isNewBaseContract) {

				$scope.initOptions.contractGridCollapse = !isChangeOrder;
				$scope.initOptions.projectCollapse = !isChangeOrder;
				$scope.initOptions.businessPartnerCollapse = !isNewBaseContract;
				var contracts = platformGridAPI.items.data($scope.contractGridId) || [];

				_.forEach(contracts, function (item) {
					platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: !isChangeOrder}]);
					if (!isChangeOrder) {
						item.Selected = false;
					}
				});

				if (!isChangeOrder) {
					$scope.initOptions.dataModels.projectChange = null;
				}

				if (!isNewBaseContract) {
					$scope.initOptions.dataModels.businessPartner = {};
					$scope.initOptions.dataModels.subsidiary = {};
					$scope.initOptions.dataModels.supplier = {};
				}

				if (isChangeOrder) {
					packageWizardCreateContractService.setDefaultChangeProject(subPackageFromScope);
				}

				platformGridAPI.items.data($scope.contractGridId, contracts);
				platformGridAPI.grids.refresh($scope.contractGridId);
			}

			function validateSelected(entity, value) {
				if (value) {
					var contracts = platformGridAPI.items.data($scope.contractGridId) || [];
					_.forEach(contracts, function (item) {
						if (item.Selected && item.Id !== entity.Id) {
							item.Selected = false;
						}
					});
					platformGridAPI.items.data($scope.contractGridId, contracts);
				}

				return true;
			}

			init();

			function init() {
				// cache controller scope
				packageWizardCreateContractService.scope = $scope;

				var selectedSubpackage = subPackageDataService.getSelected() ? subPackageDataService.getSelected(): subPackageFromScope;
				packageWizardCreateContractService.selectedSubPackage = selectedSubpackage;
				packageWizardCreateContractService.translatePrefix = translatePrefix;
				packageWizardCreateContractService.setDataForCreateContract(selectedSubpackage ? selectedSubpackage.Id : null);
				// if only one change project,set it.
				if (!isOverWrite) {
					packageWizardCreateContractService.setDefaultChangeProject(packageFromScope);
				}
				// set changed items grid.
				if (!platformGridAPI.grids.exist($scope.itemGridId)) {
					var gridConfig4Item = {
						columns: angular.copy(itemColumns),
						data: data ? data.changeItems : [],
						id: $scope.itemGridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id'
						}
					};
					platformGridAPI.grids.config(gridConfig4Item);
					platformTranslateService.translateGridConfig(gridConfig4Item.columns);
				} else {
					platformGridAPI.items.data($scope.itemGridId, data ? data.changeItems : []);
				}
				// set contracts grid.
				if (!platformGridAPI.grids.exist($scope.contractGridId)) {
					var gridConfig4Contract = {
						columns: angular.copy(contractColumns),
						data: data ? data.contracts : [],
						id: $scope.contractGridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id'
						}
					};
					platformGridAPI.grids.config(gridConfig4Contract);
					platformTranslateService.translateGridConfig(gridConfig4Contract.columns);
				} else {
					platformGridAPI.items.data($scope.contractGridId, data ? data.contracts : []);
				}

				lookupFilterService.registerFilter(filters);
			}

			// watch
			$scope.$watch('initOptions.radioType', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					if (newVal === $scope.initOptions.overWriteRadioVal) {
						changeConfigVal(false, true);
					}
					if (newVal === $scope.initOptions.changeRadioVal) {
						changeConfigVal(true, false);
					} else if (newVal === $scope.initOptions.newBaseRadioVal) {
						changeConfigVal(false, true);
					}
				}
			});

			$scope.$on('$destroy', function () {
				lookupFilterService.unregisterFilter(filters);

				packageWizardCreateContractService.scope = null;
				packageWizardCreateContractService.selectedSubPackage = null;
				packageWizardCreateContractService.baseContractId = -1;
				LookupDescriptorService.removeData('ChangeProject');

			});
		}
	]);
})(angular);