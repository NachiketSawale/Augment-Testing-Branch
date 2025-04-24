(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular, globals, _ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementContractContractTerminationController', [
		'$scope',
		'$translate',
		'$http',
		'platformGridAPI',
		'platformTranslateService',
		'prcCommonCalculationHelper',
		'platformModalService',
		'platformModuleInfoService',
		'platformModuleNavigationService',
		'accounting',
		'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService',
		'contractHeaderElementValidationService',
		function (
			$scope,
			$translate,
			$http,
			platformGridAPI,
			platformTranslateService,
			prcCommonCalculationHelper,
			platformModalService,
			platformModuleInfoService,
			platformModuleNavigationService,
			accounting,
			basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService,
			contractValidationService
		) {
			var data = $scope.modalOptions.data;
			var item = $scope.modalOptions.item;
			var dataService = $scope.modalOptions.dataService;
			var mulationPrcItemGridId = '10de61f515604e40ab330a24325dbac4';
			const terminateContractAs = {
				Requisition : 0,
				Contract: 1
			}
			$scope.gridData = {
				state: mulationPrcItemGridId
			};
			$scope.bpOptions = {
				rt$readonly: function () {
					return $scope.entity.partTo !== 'con';
				}
			};
			$scope.projectChangeOptions = {
				createOptions: {
					typeOptions: {
						isProcurement: true,
						isChangeOrder: true
					}
				},
				filterOptions: {
					serverKey: 'project-change-lookup-for-procurement-common-filter',
					serverSide: true,
					fn: function () {
						return {
							ProjectFk: item.ProjectFk,
							PrcHeaderConfigurationFk: item.PrcHeaderEntity ? item.PrcHeaderEntity.ConfigurationFk : null,
							ContractHeaderFk: item.ContractHeaderFk,
							IsProcurement : true
						};
					}
				}
			};
			$scope.entity = {
				partTo: 'req',
				BusinessPartnerFk: null,
				ContactFk: null,
				SubsidiaryFk: null,
				SupplierFk: null,
				projectChange: null,
				ProjectFk: item.ProjectFk
			};
			$scope.isLoading = false;
			$scope.OKBtnDisabled = function () {
				if ($scope.isLoading) {
					return true;
				} else if (!$scope.entity.projectChange && $scope.entity.projectChange !== 0) {
					return true;
				} else if ($scope.entity.partTo === 'con' && $scope.entity.BusinessPartnerFk === null) {
					return true;
				}
				return false;
			};
			$scope.step = 'step1';
			$scope.infoAfterCreate = '';
			$scope.unfinishedContractText = $translate.instant('procurement.contract.wizard.unfinishedContract') + item.Code;
			$scope.transferUnfinishedPartTo = $translate.instant('procurement.contract.wizard.transferUnFinishedPartTo');
			$scope.newChangeOrderAgainstOrginalContractWillBe = $translate.instant('procurement.contract.wizard.changeOrderGeneratedUnfinishedPart');
			$scope.specifyBp = $translate.instant('procurement.contract.wizard.specifyBusinessPartner');
			$scope.specifyProjectChange = $translate.instant('procurement.contract.wizard.specifyProjectChange');
			$scope.newReq = $translate.instant('procurement.contract.wizard.newRequisition');
			$scope.newCon = $translate.instant('procurement.contract.wizard.newContract');
			$scope.actionButtonText = $translate.instant('basics.common.ok');
			$scope.cancelButtonText = $translate.instant('basics.common.cancel');
			$scope.closeButtonText = $translate.instant('cloud.common.close');
			$scope.navigateTitle = platformModuleInfoService.getNavigatorTitle('procurement.requisition');
			$scope.totalGross = $translate.instant('procurement.contract.contractTermination.TotalGross');
			$scope.deliveredTotalGross = $translate.instant('procurement.contract.contractTermination.DeliveredTotalGross');
			$scope.totalNet = $translate.instant('procurement.contract.contractTermination.TotalNet');
			$scope.deliveredTotalNet = $translate.instant('procurement.contract.contractTermination.DeliveredTotalNet');
			var newContractWhenCreateReq = null;
			$scope.ok = function () {
				$scope.isLoading = true;
				const isTerminateByContract = $scope.entity.partTo === 'con';
				var parameter = {
					terminateContractAs: isTerminateByContract ?
						terminateContractAs.Contract :
						terminateContractAs.Requisition,
					conHeaderFk: item.Id,
					businessPartnerFk: $scope.entity.BusinessPartnerFk,
					contactFk: $scope.entity.ContactFk,
					subsidiaryFk: $scope.entity.SubsidiaryFk,
					supplierFk: $scope.entity.SupplierFk,
					projectChangeFk: $scope.entity.projectChange
				};
				newContractWhenCreateReq = null;
				basicsLookupdataLookupDescriptorService.addData('ConHeader', item);
				var msgBoxTitle = $translate.instant('procurement.contract.wizard.contractTermination');
				$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/terminateContract', parameter).then(function (response) {
					$scope.isLoading = false;

					if (!response || !response.data) {
						$scope.$close({ok: false});
						return platformModalService.showMsgBox('fail', msgBoxTitle, 'info');
					}

					$scope.step = 'step2';
					const data = response.data;
					const newContract = data.Contract;
					const newRequisition = data.Requisition;
					const newChangeOrder = data.ChangeOrderContract;
					newContractWhenCreateReq = !isTerminateByContract ? newChangeOrder.Code : newContractWhenCreateReq;
					$scope.contractIds = isTerminateByContract ? [newContract.Id, newChangeOrder.Id] : undefined;
					$scope.requisitionIds = !isTerminateByContract ? [newRequisition.Id] : undefined;
					$scope.navigateTitle = isTerminateByContract ?
						platformModuleInfoService.getNavigatorTitle('procurement.contract') :
						platformModuleInfoService.getNavigatorTitle('procurement.requisition');
					$scope.infoAfterCreate = isTerminateByContract ?
						$translate.instant('procurement.contract.wizard.conTerminationCreateConSuccessfully', {p1: newContract.Code, p2: newChangeOrder.Code}) :
						$translate.instant('procurement.contract.wizard.conTerminationCreateReqSuccessfully', {p1: newRequisition.Code, p2: newChangeOrder.Code});
				});
			};
			$scope.close = function () {
				newContractWhenCreateReq = null;
				$scope.$close({ok: false});
			};
			$scope.modalOptions.cancel = function cancel() {
				if ($scope.step === 'step2') {
					newContractWhenCreateReq.IsSearchItem = true;
					var list = dataService.getList();
					list = list.concat(newContractWhenCreateReq);
					dataService.setList(list);
					dataService.clearModifications();
				}
				newContractWhenCreateReq = null;
				$scope.$close({ok: false});
			};
			$scope.onNavigate = function () {
				if ($scope.entity.partTo === 'con') {
					$scope.$close(false);
					platformModuleNavigationService.navigate({
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService'
					}, $scope.contractIds, 'Ids');
				}
				else {
					$scope.$close(false);
					platformModuleNavigationService.navigate({
						moduleName: 'procurement.requisition',
						registerService: 'procurementRequisitionHeaderDataService'
					}, $scope.requisitionIds, 'Id');
				}
			};
			$scope.modalOptions.data.TotalGross = accounting.formatNumber($scope.modalOptions.data.TotalGross, 2, '', '.');
			$scope.modalOptions.data.TotalDeliveredGross = accounting.formatNumber($scope.modalOptions.data.TotalDeliveredGross, 2, '', '.');
			$scope.modalOptions.data.TotalNet = accounting.formatNumber($scope.modalOptions.data.TotalNet, 2, '', '.');
			$scope.modalOptions.data.TotalDeliveredNet = accounting.formatNumber($scope.modalOptions.data.TotalDeliveredNet, 2, '', '.');

			function totalColumnformatter(row, cell, value, columnDef, dataContext) {
				if (value === null) {
					value = dataContext[columnDef.field];
				}
				var formatterVal = accounting.formatNumber(value, 3, '', '.');
				return '<div style="width: 100%; height: 100%; top: 0;left: 0; text-align: left;box-sizing: border-box;">' + formatterVal + '</div>';
			}

			function initMulationPrcItemGrid(itemsData) {
				var mulationPrcItemGridColumns = [
					{
						id: 'Type',
						field: 'Type',
						name: 'Type',
						width: 60,
						name$tr$: 'cloud.common.entityType',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'Itemno',
						field: 'Itemno',
						width: 60,
						name: 'Itemno',
						formatter: 'Item No',
						name$tr$: 'cloud.common.Reference',
						readonly: true
					},
					{
						id: 'Reference',
						field: 'Reference',
						width: 104,
						name: 'Reference',
						formatter: 'Reference',
						name$tr$: 'cloud.common.Reference',
						readonly: true
					},
					{
						id: 'Quantity',
						field: 'Quantity',
						width: 80,
						name: 'Quantity',
						formatter: totalColumnformatter,
						name$tr$: 'cloud.common.entityQuantity',
						readonly: true
					},
					{
						id: 'QuantityDelivered',
						field: 'QuantityDelivered',
						name: 'Delivered Quantity',
						formatter: totalColumnformatter,
						name$tr$: 'procurement.contract.contractTermination.QuantityDelivered',
						width: 110,
						readonly: true
					},
					{
						id: 'QuantityUnDelivered',
						field: 'QuantityUnDelivered',
						name: 'Un-Delivered Quantity',
						formatter: totalColumnformatter,
						width: 120,
						name$tr$: 'procurement.contract.contractTermination.QuantityUnDelivered',
						readonly: true
					}];

				var mulationPrcItemGridConfig = {
					columns: angular.copy(mulationPrcItemGridColumns),
					data: itemsData,
					id: mulationPrcItemGridId,
					lazyInit: true,
					options: {
						indicator: true,
						idProperty: 'gridId'
					}
				};
				platformGridAPI.grids.config(mulationPrcItemGridConfig);
				platformTranslateService.translateGridConfig(mulationPrcItemGridConfig.columns);
			}

			function initContainItem() {
				var prcItems = _.filter(data.PrcItems, function (i) {
					return i.QuantityUnDelivered > 0;
				});
				var prcBoqs = _.filter(data.PrcBoqs, function (i) {
					return i.QuantityUnDelivered > 0;
				});
				var gridData = prcItems.concat(prcBoqs);
				initMulationPrcItemGrid(gridData);
			}

			function getFormConfigForDialog() {
				return {
					'fid': 'procurement.contract.termination.wizard',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData',
							'header': 'basic',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': 'businesspartnerfk',
							'gid': 'basicData',
							'label': 'entityBusinessPartner',
							'label$tr$': 'cloud.common.entityBusinessPartner',
							'type': 'directive',
							'model': 'BusinessPartnerFk',
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								'showClearButton': true,
								'filterKey': 'procurement-contract-businesspartner-businesspartner-filter',
								'IsShowBranch': true,
								'mainService':'procurementContractHeaderDataService',
								'BusinessPartnerField': 'BusinessPartnerFk',
								'SubsidiaryField':'SubsidiaryFk',
								'SupplierField':'SupplierFk',
								'ContactField': 'ContactFk',
								'events': [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										if (contractValidationService.SelectedItemChanged2BusinessPartnerFk && _.isFunction(contractValidationService.SelectedItemChanged2BusinessPartnerFk)) {
											contractValidationService.SelectedItemChanged2BusinessPartnerFk(e, args);
										}
									}
								}]
							}
						},
						{
							'rid': 'subsidiaryfk',
							'gid': 'basicData',
							'label': 'entitySubsidiary',
							'label$tr$': 'cloud.common.entitySubsidiary',
							'type': 'directive',
							'model': 'SubsidiaryFk',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								'showClearButton': true,
								'filterKey':'prc-con-subsidiary-filter'
							}
						},
						{
							'rid': 'supplierfk',
							'gid': 'basicData',
							'label': 'entitySupplier',
							'label$tr$': 'cloud.common.entitySupplier',
							'type': 'directive',
							'model': 'SupplierFk',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'business-partner-main-supplier-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'prc-con-supplier-filter',
									'disableInput': false,
									'showClearButton': true,
									'showEditButton': true
								}
							}
						},
						{
							'rid': 'contactfk',
							'gid': 'basicData',
							'label': 'ConHeaderContact',
							'label$tr$': 'procurement.contract.ConHeaderContact',
							'type': 'directive',
							'model': 'ContactFk',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								'showClearButton': true,
								'filterKey':'prc-con-contact-filter'
							}
						}
					]
				};
			}
			var formConfig = getFormConfigForDialog($scope);
			platformTranslateService.translateFormConfig(formConfig);
			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};
			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};
			function readonlyFieldsWhenUpdate(readonly) {
				platformRuntimeDataService.readonly($scope.entity, [{ field: 'BusinessPartnerFk', readonly: readonly }]);
				_.forEach(['ContactFk', 'SubsidiaryFk', 'SupplierFk'], function(field) {
					platformRuntimeDataService.readonly($scope.entity, [{ field: field, readonly: true }]);
				});
			}
			readonlyFieldsWhenUpdate($scope.entity.partTo !== 'con');

			const unwatch = $scope.$watch('entity.partTo', function (newValue, oldValue) {
				if (newValue !== oldValue) {
					$scope.entity.BusinessPartnerFk = null;
					$scope.entity.ContactFk = null;
					$scope.entity.SubsidiaryFk = null;
					$scope.entity.SupplierFk = null;
					$scope.$broadcast('form-config-updated');
					readonlyFieldsWhenUpdate($scope.entity.partTo !== 'con');
				}
			});

			initContainItem();

			$scope.$on('$destroy', function () {
				unwatch();
			});
		}
	]);
})();