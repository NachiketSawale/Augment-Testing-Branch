/**
 * Created by jhe on 9/18/2018.
 */

// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';
	/** @namespace item.Stock2matId */
	var moduleName = 'procurement.stock';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementStockCreateOrderProposalWizardController',
		['$scope', '$http', '$translate', 'createOrderProposalValidationService', 'platformRuntimeDataService','WizardHandler',
			'platformModalService', 'basicsLookupdataConfigGenerator', '_', 'procurementStockStockTotalDataService', 'createOrderProposalActionProcessor', 'procurementStockOrderProposalDataService','procurementOrderProposalsDataService',
			// eslint-disable-next-line func-names
			function ($scope, $http, $translate, validationService, platformRuntimeDataService,WizardHandler,
				platformModalService, basicsLookupdataConfigGenerator, _, procurementStockStockTotalDataService, createOrderProposalActionProcessor, procurementStockOrderProposalDataService, procurementOrderProposalsDataService) {

				$scope.options = $scope.$parent.modalOptions;
				// init current item.
				$scope.currentItem = {
					prjStock2MdcMaterialFk: $scope.options.prjStock2MdcMaterialFk,
					prcConfigurationFk: $scope.options.prcConfigurationFk,
					prcConfigurationReqFk: $scope.options.prcConfigurationReqFk,
					basClerkPrcFk: $scope.options.basClerkPrcFk,
					basClerkReqFk: $scope.options.basClerkReqFk,
					prcPackageFk: $scope.options.prcPackageFk,
					description: $scope.options.description,
					bpdBusinessPartnerFk: $scope.options.bpdBusinessPartnerFk,
					bpdSubsidiaryFk: $scope.options.bpdSubsidiaryFk,
					bpdSupplierFk: $scope.options.bpdSupplierFk,
					bpdContactFk: $scope.options.bpdContactFk,
					isLive: $scope.options.isLive,
					leadTime: $scope.options.leadTime,
					tolerance: $scope.options.tolerance,
					log: $scope.options.log,
					id: $scope.options.id,
					isFrameworkAgreement: $scope.options.isFrameworkAgreement,
					ProjectFk: $scope.options.ProjectFk,
					catalogCode: $scope.options.catalogCode,
					catalogDescription: $scope.options.catalogDescription,
					ItemDescription: $scope.options.ItemDescription
				};

				$scope.options.headerText = $translate.instant('procurement.stock.wizard.createOrderProposal.caption');

				$scope.options.dialogLoading = false;
				$scope.options.loadingInfo = '';

				var formConfig = {
					fid: 'procurement.stock.createOrderProposal',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							header: 'Basic Contract Data',
							isOpen: true,
							attributes: ['prcConfigurationFk', 'prcConfigurationReqFk', 'basClerkPrcFk', 'basClerkReqFk', 'description']
						},
						{
							gid: 'businessPartnerGroup',
							header: 'Business Partner Information',
							isOpen: true,
							attributes: ['bpdBusinessPartnerFk', 'bpdSubsidiaryFk', 'bpdSupplierFk', 'bpdContactFk', 'isLive', 'leadTime', 'tolerance', 'log']
						}
					],
					rows: [
						{
							rid: 'prcConfigurationFk',
							gid: 'baseGroup',
							required: true,
							label: 'Contract Configuration',
							label$tr$: 'procurement.orderproposals.header.ContractConfiguration',
							type: 'directive',
							model: 'prcConfigurationFk',
							directive: 'basics-configuration-configuration-combobox',
							options: {
								filterKey:  'prc-con-configuration-filter'
							},
							sortOrder: 1
						},
						{
							rid: 'prcConfigurationReqFk',
							gid: 'baseGroup',
							required: true,
							label: 'Requisition Configuration',
							label$tr$: 'procurement.orderproposals.header.ReqConfiguration',
							type: 'directive',
							model: 'prcConfigurationReqFk',
							directive: 'basics-configuration-configuration-combobox',
							options: {
								filterKey:  'prc-req-configuration-filter',
								initValueField: 'ConfigurationDescription'
							},
							sortOrder: 1
						},
						{
							rid: 'basClerkPrcFk',
							gid: 'baseGroup',
							label$tr$: 'cloud.common.entityResponsible',
							label: 'Responsible',
							type: 'directive',
							model: 'basClerkPrcFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionField: 'ClerkPrcDescription',
								descriptionMember: 'Description',
								lookupOptions: {
									initValueField: 'ClerkPrcCode',
									readOnly: false,
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							},
							sortOrder: 2
						},
						{
							rid: 'basClerkReqFk',
							gid: 'baseGroup',
							label$tr$: 'cloud.common.entityRequisitionOwner',
							label: 'Requisition Owner',
							type: 'directive',
							model: 'basClerkReqFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionField: 'ClerkReqDescription',
								descriptionMember: 'Description',
								lookupOptions: {
									initValueField: 'ClerkReqCode',
									readOnly: false,
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							},
							sortOrder: 3
						},
						{
							rid: 'prcPackageFk',
							gid: 'baseGroup',
							label: 'Package',
							label$tr$: 'cloud.common.entityPackageDescription',
							type: 'directive',
							model: 'prcPackageFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-common-package-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'prc-con-package-filter-for-order-proposal',
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							},
							sortOrder: 4
						},
						{
							rid: 'description',
							gid: 'baseGroup',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							type: 'directive',
							directive: 'create-order-proposal-description-checkbox',
							model: 'ItemDescription',
							sortOrder: 5
						},
						basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('business-partner-main-business-partner-dialog', 'directive', 'BusinessPartnerName1', false,
							{
								gid: 'businessPartnerGroup',
								rid: 'bpdBusinessPartnerFk',
								required: true,
								label: 'Business Partner',
								label$tr$: 'cloud.common.entityBusinessPartner',
								model: 'bpdBusinessPartnerFk',
								readonly: $scope.currentItem.isFrameworkAgreement,
								validator: validationService.validateBpdBusinessPartnerFk,
								sortOrder: 6,
								options: {
									IsShowBranch: true,
									mainService: 'procurementStockOrderProposalDataService',
									BusinessPartnerField: 'bpdBusinessPartnerFk',
									SubsidiaryField: 'bpdSubsidiaryFk',
									SupplierField: 'bpdSupplierFk'
								}
							}
						),
						{
							rid: 'bpdSubsidiaryFk',
							gid: 'businessPartnerGroup',
							label: 'Subsidiary',
							label$tr$: 'cloud.common.entitySubsidiary',
							type: 'directive',
							model: 'bpdSubsidiaryFk',
							directive: 'business-partner-main-subsidiary-lookup',
							readonly: $scope.currentItem.isFrameworkAgreement,
							options: {
								displayMember: 'AddressLine',
								showClearButton: true,
								filterKey: 'create-order-proposal-subsidiary-filter'
							},
							sortOrder: 7
						},
						{
							rid: 'bpdSupplierFk',
							gid: 'businessPartnerGroup',
							label: 'Supplier',
							label$tr$: 'cloud.common.entitySupplierDescription',
							type: 'directive',
							model: 'bpdSupplierFk',
							directive: 'basics-lookupdata-lookup-composite',
							readonly: $scope.currentItem.isFrameworkAgreement,
							options: {
								lookupDirective: 'business-partner-main-supplier-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'create-order-proposal--supplier-filter',
									disableInput: false,
									showClearButton: true,
									showEditButton: true
								}
							},
							sortOrder: 8
						},
						{
							rid: 'bpdContactFk',
							gid: 'businessPartnerGroup',
							label: 'Contact',
							label$tr$: 'procurement.contract.ConHeaderContact',
							type: 'directive',
							model: 'bpdContactFk',
							directive: 'business-partner-main-filtered-contact-combobox',
							options: {
								displayMember: 'FullName',
								showClearButton: true,
								filterKey: 'prc-con-contact-filter-for-order-proposal'
							},
							sortOrder: 9
						},
						{
							rid: 'isLive',
							gid: 'businessPartnerGroup',
							required: true,
							label: 'IsLive',
							type: 'boolean',
							model: 'isLive',
							sortOrder: 10
						},
						{
							rid: 'leadTime',
							gid: 'businessPartnerGroup',
							required: true,
							label: 'Lead Time',
							type: 'integer',
							model: 'leadTime',
							regex: '^[+]?[0-9]{0,4}$',
							sortOrder: 11
						},
						{
							rid: 'tolerance',
							gid: 'businessPartnerGroup',
							required: true,
							label: 'Tolerance',
							type: 'integer',
							model: 'tolerance',
							regex: '^[+]?[0-9]{0,4}$',
							sortOrder: 12
						},
						{
							rid: 'log',
							gid: 'businessPartnerGroup',
							label: 'Log',
							type: 'text',
							model: 'log',
							sortOrder: 13
						}
					]
				};

				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {

					}
				};

				var configurationFkValidation = $scope.$watch('currentItem.prcConfigurationFk', function () {
					$scope.isDisabled = isDisabledFn();
				});

				var configurationReqFkValidation = $scope.$watch('currentItem.prcConfigurationReqFk', function () {
					$scope.isDisabled = isDisabledFn();
				});

				var businessPartnerFkValidation = $scope.$watch('currentItem.bpdBusinessPartnerFk', function () {
					$scope.isDisabled = isDisabledFn();
				});

				function isDisabledFn() {
					var prcConfigurationFk = $scope.currentItem.prcConfigurationFk;
					var prcConfigurationReqFk = $scope.currentItem.prcConfigurationReqFk;
					var bpdBusinessPartnerFk = $scope.currentItem.bpdBusinessPartnerFk;
					return (prcConfigurationFk === null) || (bpdBusinessPartnerFk === null) || (prcConfigurationReqFk === null);
				}

				// eslint-disable-next-line no-undef
				$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';
				$scope.wizardName = $scope.modalOptions.value.wizardName;
				$scope.wizard = $scope.modalOptions.value.wizard;
				$scope.entity = $scope.modalOptions.value.entity;
				$scope.selectStep = angular.copy($scope.wizard.steps[0]);
				$scope.cachedOrderProposalData = [ {
					number: 0,
					orderProposalData: $scope.currentItem
				} ];
				$scope.isLastStep = function () {
					if ($scope.selectStep) {
						return $scope.selectStep.number === $scope.wizard.steps.length - 1;
					} else {
						return true;
					}
				};
				$scope.isFirstStep = function () {
					return $scope.selectStep.number === 0;
				};
				$scope.getEnabledSteps = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.getEnabledSteps();
					} else {
						return [];
					}
				};
				$scope.getTotalStepCount = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.totalStepCount();
					} else {
						return '';
					}
				};
				$scope.getCurrentStepNumber = function () {
					var wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.currentStepNumber();
					} else {
						return '';
					}
				};
				$scope.saveStep = function () {
					$scope.cachedOrderProposalData[$scope.selectStep.number] = {
						number: $scope.selectStep.number,
						orderProposalData: $scope.currentItem
					};
					var dataLength = $scope.cachedOrderProposalData.length;
					if($scope.selectStep.number < dataLength - 1){
						dataLength = $scope.selectStep.number + 1;
					}
					for (var i = 0; i < dataLength;  i++) {
						var currentCatalogIds = _.filter($scope.wizard.steps, {number: $scope.cachedOrderProposalData[i].number})[0].stock2matIds;
						var orderProposalData = $scope.cachedOrderProposalData[i].orderProposalData;
						for (var j = 0; j < currentCatalogIds.length;  j++) {
							saveOrderProposal(orderProposalData, currentCatalogIds[j]);
						}
					}
					$scope.$parent.$close(true);
				};
				$scope.previousStep = function () {
					if($scope.selectStep.number - 1 < 0) { return;}
					var wz = WizardHandler.wizard($scope.wizardName);
					stepGoto($scope.selectStep.number,$scope.selectStep.number - 1);
					wz.previous();
					setCurrentStep($scope.selectStep.number - 1);
				};
				$scope.nextStep = function () {
					var currentNumber = $scope.selectStep.number;
					if(currentNumber + 1 >= $scope.wizard.steps.length){
						procurementStockStockTotalDataService.gridRefresh();
						$scope.$parent.$close(true);
						return;
					}
					var wz = WizardHandler.wizard($scope.wizardName);
					stepGoto($scope.selectStep.number,$scope.selectStep.number + 1);
					wz.next();
					setCurrentStep(currentNumber + 1);
				};
				function stepGoto(currentNumber, gotoNumber){
					$scope.cachedOrderProposalData[currentNumber] = {
						number: currentNumber,
						orderProposalData: $scope.currentItem
					};
					var nextWizardStep = $scope.wizard.steps[gotoNumber];
					var nextOrderProposalData = _.filter($scope.cachedOrderProposalData,{number: gotoNumber})[0];
					if(nextOrderProposalData){
						var nextOrderProposalItem = new ConvertUpperOrderProposalItem(nextOrderProposalData.orderProposalData);
						setOrderProposalItem(nextOrderProposalItem, nextWizardStep.id, nextWizardStep.catalogCode, nextWizardStep.catalogDescription, false);
					}
					else{
						showOrderProposalDialog(nextWizardStep);
					}
				}
				function setCurrentStep(step) {
					$scope.selectStep = angular.copy($scope.wizard.steps[step]);
				}
				procurementStockStockTotalDataService.registerFilters();

				$scope.modalOptions = {};
				$scope.modalOptions.headerText =$scope.options.headerText + ' ' + $scope.getCurrentStepNumber() + ' / ' +
					$scope.getTotalStepCount() + ' - Catalog "' + $scope.currentItem.catalogCode + ' ' + $scope.currentItem.catalogDescription + '"';
				$scope.modalOptions.cancel = function cancel() {
					$scope.$close(false);
				};

				$scope.$on('$destroy', function () {
					if (configurationFkValidation) {
						configurationFkValidation();
					}
					if(configurationReqFkValidation){
						configurationReqFkValidation();
					}
					if (businessPartnerFkValidation) {
						businessPartnerFkValidation();
					}
					procurementStockStockTotalDataService.unRegisterFilters();
				});


				angular.extend($scope.options, {
					body: {
						okBtnText: 'okBtnText'
					},
					onOK: function () {
						$scope.isDisabled = true;
						$http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'procurement/stock/orderproposal/save',
							data: $scope.currentItem
						}).then(function (resultData) {
							var selectedStockTotal = procurementStockStockTotalDataService.getSelected();
							selectedStockTotal.OrderProposalStatus = resultData.data;
							createOrderProposalActionProcessor.processItem(selectedStockTotal);
							procurementStockStockTotalDataService.gridRefresh();
							$scope.$parent.$close(true);
						});
					}
				});
				function saveOrderProposal(currentItemData, stock2matId){
					$http.get(globals.webApiBaseUrl + 'procurement/stock/orderproposal/item?prjStock2MdcMaterialFk=' + stock2matId).then(function (response) {
						var stockOrderProposalDto = currentItemData;
						if(response.data === null || response.data === ''){
							stockOrderProposalDto.id = -1;
							stockOrderProposalDto.prjStock2MdcMaterialFk = stock2matId;
						}
						else {
							stockOrderProposalDto.id = response.data.Id;
							stockOrderProposalDto.prjStock2MdcMaterialFk = response.data.PrjStock2MdcMaterialFk;
							if(currentItemData.ItemDescription.IsSuffixes){
								stockOrderProposalDto.description = response.data.Description;
							}
						}
						$scope.isDisabled = true;
						$http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'procurement/stock/orderproposal/save',
							data: stockOrderProposalDto
						}).then(function (resultData) {
							var selectedStockTotals = procurementStockStockTotalDataService.getSelectedEntities();
							var selectedSotck2mats = selectedStockTotals.filter(function (item){return item.Stock2matId;});
							// eslint-disable-next-line func-names
							selectedSotck2mats.map(function (item){
								if(item.CatalogCode === stockOrderProposalDto.catalogCode){
									item.OrderProposalStatus = resultData.data;
									createOrderProposalActionProcessor.processItem(item);
									procurementStockStockTotalDataService.gridRefresh();
									procurementStockOrderProposalDataService.callRefresh();
									procurementOrderProposalsDataService.callRefresh();
								}
							});
						});
					});
				}

				function showOrderProposalDialog(wizardStep){
					var stock2matId = wizardStep.id, catalogCode = wizardStep.catalogCode, catalogDescription = wizardStep.catalogDescription;
					// eslint-disable-next-line no-undef
					$http.get(globals.webApiBaseUrl + 'procurement/stock/orderproposal/item?prjStock2MdcMaterialFk=' + stock2matId).then(function (response) {
						if (response.data === null || response.data === '') {
							$http.get(globals.webApiBaseUrl + 'procurement/stock/orderproposal/create?prjStock2MdcMaterialFk=' + stock2matId).then(function (response) {
								setOrderProposalItem(response.data, stock2matId, catalogCode, catalogDescription, true);
							});
						}else{
							setOrderProposalItem(response.data, stock2matId, catalogCode, catalogDescription, false);
						}
					});
				}

				function setOrderProposalItem(itemData, stock2matId, catalogCode, catalogDescription, isCreateItem){
					var isFrameworkAgreement = _.filter($scope.wizard.steps, { id:stock2matId })[0].stock2matIds.length <= 1;
					$scope.currentItem = {
						prcConfigurationFk: itemData.PrcConfigurationFk,
						prcConfigurationReqFk: itemData.PrcConfigurationReqFk,
						basClerkPrcFk: itemData.BasClerkPrcFk,
						basClerkReqFk: itemData.BasClerkReqFk,
						prcPackageFk: itemData.PrcPackageFk,
						description: itemData.Description,
						bpdBusinessPartnerFk: itemData.BpdBusinessPartnerFk,
						bpdSubsidiaryFk: itemData.BpdSubsidiaryFk,
						bpdSupplierFk: itemData.BpdSupplierFk,
						bpdContactFk: itemData.BpdContactFk,
						leadTime: itemData.LeadTime,
						ProjectFk: itemData.ProjectFk,
						isFrameworkAgreement: isFrameworkAgreement && itemData.IsFrameworkAgreement,
						prjStock2MdcMaterialFk: stock2matId,
						isLive: true,
						tolerance: 0,
						log: null,
						id: -1,
						catalogCode: catalogCode,
						catalogDescription: catalogDescription,
						ItemDescription: itemData.ItemDescription
					};
					if(isCreateItem === false){
						$scope.currentItem.id = itemData.Id;
						$scope.currentItem.prjStock2MdcMaterialFk = itemData.PrjStock2MdcMaterialFk;
						$scope.currentItem.isLive = itemData.IsLive;
						$scope.currentItem.tolerance = itemData.Tolerance;
						$scope.currentItem.log = itemData.Log;
					}
					if(_.filter($scope.cachedOrderProposalData,{number: $scope.selectStep.number}).length < 1){
						$scope.cachedOrderProposalData.push({
							number: $scope.selectStep.number,
							orderProposalData: $scope.currentItem
						});
					}
				}

				function ConvertUpperOrderProposalItem(itemData){
					return {
						PrcConfigurationFk: itemData.prcConfigurationFk,
						PrcConfigurationReqFk: itemData.prcConfigurationReqFk,
						BasClerkPrcFk: itemData.basClerkPrcFk,
						BasClerkReqFk: itemData.basClerkReqFk,
						PrcPackageFk: itemData.prcPackageFk,
						Description: itemData.description,
						BpdBusinessPartnerFk: itemData.bpdBusinessPartnerFk,
						BpdSubsidiaryFk: itemData.bpdSubsidiaryFk,
						BpdSupplierFk: itemData.bpdSupplierFk,
						BpdContactFk: itemData.bpdContactFk,
						LeadTime: itemData.leadTime,
						ProjectFk: itemData.ProjectFk,
						IsFrameworkAgreement: itemData.isFrameworkAgreement,
						PrjStock2MdcMaterialFk: itemData.prjStock2MdcMaterialFk,
						IsLive: itemData.isLive,
						Tolerance: itemData.tolerance,
						Log: itemData.log,
						Id: itemData.id,
						ItemDescription:itemData.ItemDescription
					};
				}
			}]);

	angular.module(moduleName).directive('createOrderProposalDescriptionCheckbox', [
		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: true,
				template: '<div class="lg-6 md-6"><input type="text" class="domain-type-description form-control" data-ng-model="Description"/></div>' +
                    '<div class="lg-6 md-6 text-center" title="{{ItemDes}}"><input type="checkbox" data-ng-model="Selected"/><span>Item Description as Suffixes</span></div>',
				link: function (scope, element, attrs, ngModelCtrl) {
					ngModelCtrl.$formatters.push(function (value) {
						if (value) {
							scope.Description = value.Description;
							scope.Selected = value.IsSuffixes;
							/* if(scope.$parent.$parent.$parent.$parent && scope.$parent.$parent.$parent.$parent.entity){
	                            scope.ItemDes = scope.$parent.$parent.$parent.$parent.entity.description;
                            	if(scope.ItemDes.indexOf('Contract Proposal') === 0){
		                            scope.ItemDes = scope.ItemDes.substr(18);
	                            }
                            } */
							return {
								Description: value.Description,
								IsSuffixes: value.IsSuffixes
							};
						}
						return '';
					});

					// view -> model
					scope.$watch('Description', function (newValue) {
						if (newValue && ngModelCtrl.$viewValue.Description !== newValue) {
							ngModelCtrl.$setViewValue({
								Description: newValue,
								IsSuffixes: scope.Selected
							});
							ngModelCtrl.$commitViewValue();
						}
					});

					scope.$watch('Selected', function (newValue) {
						ngModelCtrl.$setViewValue({
							Description: scope.Description,
							IsSuffixes: newValue
						});
						ngModelCtrl.$commitViewValue();
					});

				}
			};
		}]);
})(angular);
