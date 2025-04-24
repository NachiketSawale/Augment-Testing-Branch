/**
 * Created by spr on 17/7/2017.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function(angular) {
	/* global Platform */

	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainCreateBoQPackageWizardService', [
		'_', '$http', '$timeout', '$translate', '$injector',
		'platformGridAPI', 'platformWizardDialogService', 'cloudCommonGridService', 'platformRuntimeDataService', 'platformObjectHelper',
		'basicsLookupdataLookupFilterService', 'platformTranslateService', 'platformUtilService', 'platformModalService', 'basicsLookupdataLookupDataService', 'platformModalFormConfigService',
		'estimateMainService', 'estimateMainPackageSourceTypeConfigService', 'procurementContextService', 'estimateMainBoqPackageAssignFormConfig',
		'estimateMainPrcPackageLookupDataService', 'estimateMainWicBoqLookupService','basicsCommonUniqueFieldsProfileService','costTransferOptionProfileService', 'basicsCommonEstimateLineItemFieldsValue',
		'globals', 'basicsCommonQuantityTransferFormConstant', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService',
		'boqHierarchy',
		function (_, $http, $timeout, $translate, $injector,
			platformGridAPI, platformWizardDialogService, cloudCommonGridService, platformRuntimeDataService, platformObjectHelper,
			basicsLookupdataLookupFilterService, platformTranslateService, platformUtilService, platformModalService, basicsLookupdataLookupDataService, platformModalFormConfigService,
			estimateMainService, estimateMainPackageSourceTypeConfigService, procurementContextService, estimateMainBoqPackageAssignFormConfig,
			estimateMainPrcPackageLookupDataService, estimateMainWicBoqLookupService,basicsCommonUniqueFieldsProfileService, costTransferOptionProfileService, basicsCommonEstimateLineItemFieldsValue,
			globals, basicsCommonQuantityTransferFormConstant, PlatformMessenger, basicsLookupdataLookupDescriptorService,
			boqHierarchy) {

			let PACKAGE_SOURCE_TYPE = estimateMainPackageSourceTypeConfigService.PACKAGE_SOURCE_TYPE;
			let PRC_STRUCTURE_TYPE = estimateMainPackageSourceTypeConfigService.PRC_STRUCTURE_TYPE;

			let service = {};
			let entity = {}, currentStep = null, notAssignedLineItemList = [];
			let resultPackage = null;
			let identityName = 'generate.packageboq.from.lineitem';
			let uniqueFieldsProfileService = basicsCommonUniqueFieldsProfileService.getService(identityName);
			let specialData = [{model: 'DescriptionInfo'}, {model: 'BasUomTargetFk'}];
			service.getResourceListByPage = null;
			uniqueFieldsProfileService.setReadonlyData(specialData);
			uniqueFieldsProfileService.setMustSelectedData(specialData);
			uniqueFieldsProfileService.setIsBoq(true);
			service.uniqueFieldsProfileService = uniqueFieldsProfileService;
			service.isPackageGenerating = new PlatformMessenger();

			function assignBoqPackage(data) {
				if(data && data.boqPackageAssignmentEntity) {

					data.boqPackageAssignmentEntity.CostCodeFks = [];
					data.boqPackageAssignmentEntity.selectedCostCodes = [];
					data.boqPackageAssignmentEntity.IsSelectedReferenceLineItem = data.isSelectedReferenceLineItem;
					data.boqPackageAssignmentEntity.IsSelectedMultiplePackageAssignmentMode = data.isSelectedMultiplePackageAssignmentMode;
					data.boqPackageAssignmentEntity.SelectedParentId2DescendantIdsMap = data.selectedParentId2DescendantIdsMap;
					data.boqPackageAssignmentEntity.SelectedRootId2DescendantIdsMap = data.selectedRootId2DescendantIdsMap;
					// clear the data before call api
					data.selectedParentId2DescendantIdsMap = null;
					data.selectedRootId2DescendantIdsMap = null;
					data.prcStructureList = [];
					data.boqList = [];
					data.resourceInfo = null;
					if (data.boqPackageAssignmentEntity.CostTransferOptprofile && data.boqPackageAssignmentEntity.CostTransferOptprofile.length > 0) {
						let costCodes = [];
						cloudCommonGridService.flatten(data.boqPackageAssignmentEntity.CostTransferOptprofile, costCodes, 'resultChildren');
						_.forEach(costCodes, function (item) {
							if (item.isSelect) {
								if (data.boqPackageAssignmentEntity.CostCodeFks.indexOf(item.Id) <= -1) {
									data.boqPackageAssignmentEntity.CostCodeFks.push(item.Id);
								}

								if (data.boqPackageAssignmentEntity.CostCodeFks.indexOf(item.IdBak) <= -1) {
									data.boqPackageAssignmentEntity.CostCodeFks.push(item.IdBak);
								}

								var tempItem = angular.copy(item);
								tempItem.Selected = false;
								data.boqPackageAssignmentEntity.selectedCostCodes.push(tempItem);
							}
						});
					}

					let selectallProfiles = [];
					if (data.boqPackageAssignmentEntity.isAggregate) {
						let allProfiles = uniqueFieldsProfileService.getSelectedItem().UniqueFields;// data.boqPackageAssignmentEntity.uniqueFieldsProfile;
						selectallProfiles = _.filter(allProfiles, {isSelect: true})
							.map(function (field) {
								return {
									id: field.id,
									code: field.model,
									IsUseAsBoQDescription:field.useAsBoQDescription
								};
							});
					}

					if (data.boqPackageAssignmentEntity.Package) {
						data.boqPackageAssignmentEntity.Package.ClerkPrcFk = data.boqPackageAssignmentEntity.Package.ClerkPrcFk === 0 ? null : data.boqPackageAssignmentEntity.Package.ClerkPrcFk;
						data.boqPackageAssignmentEntity.Package.ClerkReqFk = data.boqPackageAssignmentEntity.Package.ClerkReqFk === 0 ? null : data.boqPackageAssignmentEntity.Package.ClerkReqFk;
					}

					data.boqPackageAssignmentEntity.UniqueFieldListProfile = selectallProfiles;

					data.boqPackageAssignmentEntity.EstLineItems =[];
					// avoid the request entity to large
					if(data.estimateScope === 0 || data.estimateScope === 1){
						data.boqList =[];
					}

					if (!data.boqPackageAssignmentEntity.IsCreateNew && !data.boqPackageAssignmentEntity.IsToCreateSeparatePackages) {
						const simulations = data.boqPackageAssignmentEntity.simulationData;
						data.boqPackageAssignmentEntity.simulationData = null;
						data.boqPackageAssignmentEntity.Simulations = [];
						if (simulations && simulations.length > 0) {
							_.forEach(simulations, function (simulation) {
								simulation.Package.ClerkPrcFk = simulation.ClerkPrcFk;
								simulation.Package.ClerkReqFk = simulation.ClerkReqFk;
								simulation.Package.Code = simulation.Selected ? simulation.Code : simulation.packageCode;
								if (simulation.Selected) { // for new package
									simulation.Package.Description = simulation.PackageDescription;
								 } else if (simulation.PackageCodeFk) { // for update package
									const packageLookups = basicsLookupdataLookupDescriptorService.getData('packagewithupdateopt');
									if (packageLookups && packageLookups[simulation.PackageCodeFk]) {
										simulation.Package.Description = packageLookups[simulation.PackageCodeFk].Description;
									}
								}
								simulation.Package.StructureFk = simulation.StructureCodeFk;
								simulation.Package.ConfigurationFk = simulation.ConfigurationFk;
								simulation.Package.IsCreateNew = simulation.Selected;
								simulation.Package.Id = simulation.PackageCodeFk || simulation.Package.Id;
								simulation.Package.PackageStatusFk = simulation.PackageStatusFk || simulation.Package.PackageStatusFk;
								const simulationData = {};
								simulationData.IsCreateNew = simulation.Selected;
								simulationData.IsMergeUpdate = simulation.Merge;
								simulationData.SourceBoqHeaderFk = simulation.BoqHeaderFk;
								simulationData.SourceBoqItemFk = simulation.BoqItemFk;
								simulationData.SubPackageFk = simulation.SubPackageFk;
								simulationData.SubPackageDescription = simulation.SubPackage;
								simulationData.PrcStructureFk = simulation.BasicStructureCodeFk;
								simulationData.Package = simulation.Package;
								if (data.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value) {
									simulationData.EstHeaderFk = simulation.EstHeaderFk;
									simulationData.EstLineItemFk = simulation.EstLineItemFk;
									simulationData.ResourceFk = simulation.ResourceFk;
									simulationData.BoqStructureOption4SourceResources = simulation.BoqStructureOption4SourceResources;
									simulationData.IsSkipBoqPositionAsDivisionBoq = angular.isDefined(simulation.IsSkipBoqPositionAsDivisionBoq) ? simulation.IsSkipBoqPositionAsDivisionBoq : true;
									if (simulation.Selected) { // for new package
										simulationData.BoqStructureOption4SourceResources = data.boqPackageAssignmentEntity.BoqStructureOption4SourceResources;
										simulationData.IsSkipBoqPositionAsDivisionBoq = data.boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq;
									}
								}
								data.boqPackageAssignmentEntity.Simulations.push(simulationData);
							});
						}
					}

					$http.post(globals.webApiBaseUrl + 'estimate/main/createboqpackage/assignboqpackages', data)
						.then(function (response) {
							if(response.data.timeStr){
								console.log(response.data.timeStr);
							}

							showPackageAssignmentResult(response.data);
						});
				}
			}

			function showPackageAssignmentResult(responseData) {
				if(responseData){
					setGeneratePakageData(responseData);
				}

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-generate-package-result-page.html'
				});
			}

			function showWicErrorDialog() {
				let dialogOption = {
					title: 'estimate.main.createBoqPackageWizard.wicErrorTitle',
					dataItem: {lineItemList: notAssignedLineItemList},
					dialogOptions: {showCANCELButton: false},
					formConfiguration: {
						fid: 'wicErrorDialog',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'wicErrorList',
							type: 'directive',
							directive: 'estimate-main-boq-package-unassigned-line-item-grid',
							model: 'lineItemList'
						}]
					}
				};

				platformModalFormConfigService.showDialog(dialogOption);
			}

			service.createProcurementPackage = function () {

				let filter = estimateMainService.getLastFilter();
				if (filter === null) {
					estimateMainService.refresh().then(function () {
						service.createProcurementPackage();
					});
					return;
				}
				platformUtilService.loadTemplates(['estimate.main/templates/estimate-main-assign-boq-package-dynamic-template.html']);
				let defaultAssignStepConfig = _.cloneDeep(PACKAGE_SOURCE_TYPE.PROJECT_BOQ.assignStepConfig);
				defaultAssignStepConfig.form = estimateMainBoqPackageAssignFormConfig.getConfig(this,1, uniqueFieldsProfileService,costTransferOptionProfileService);

				let wizardConfig = {
					id:'BAE9696E9A3943F6B9113E64076B0BF5',
					title: 'Create/Update BoQ Package',
					title$tr$: 'estimate.main.createBoqPackageWizard.title',
					steps: [
						{
							stepSettingsId: 'ACBF5994733848B1A5090763258CA280',
							id:'ACBF5994733848B1A5090763258CA280',
							title: 'Select Scope and Source',
							title$tr$: 'estimate.main.createBoqPackageWizard.selectScopeSource.title',
							form: {
								fid: 'selectScopeSource',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'default'
								}],
								rows: [{
									gid: 'default',
									rid: 'selectScopeSourceForm',
									type: 'directive',
									directive: 'estimate-main-boq-package-select-scope-source'
								}]
							},
							watches: [{
								expression: 'groupStructureSourceType',
								fn: function (info) {
									let groupStructureSourceType = PACKAGE_SOURCE_TYPE.getSourceTypeObjectByValue(info.newValue);

									info.wizard.steps[1] = _.cloneDeep(groupStructureSourceType.stepConfig);
									info.model.wicGroupId = null;
									info.model.strurctrueSourceType = null;
									if(groupStructureSourceType.stepConfig.id === 'BF0037DEB45D4CFA8010A740169C7CE1'){
										currentStep.disallowNext = true;
									}else{
										currentStep.disallowNext = false;
										info.model.packageSourceType =info.model.groupStructureSourceType;
									}

									if (info.model.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value) {
										info.model.boqPackageAssignmentEntity.QuantityTransferFrom = basicsCommonQuantityTransferFormConstant.boqWQAQ;
									}
									else {
										info.model.boqPackageAssignmentEntity.QuantityTransferFrom = basicsCommonQuantityTransferFormConstant.lineItemAQ;
									}

									if (info.model.packageSourceType !== PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value && info.model.packageSourceType !== PACKAGE_SOURCE_TYPE.WIC_BOQ.value) {
										info.model.boqPackageAssignmentEntity.IsToCreateSeparatePackages = false;
									}

									info.model.boqPackageAssignmentEntity.IsCreateNew = false;

									platformRuntimeDataService.readonly(info.model, [{
										field: 'boqPackageAssignmentEntity.IsCreateNew',
										readonly: false
									}]);

									_.cloneDeep(PACKAGE_SOURCE_TYPE.PROJECT_BOQ.stepConfig,groupStructureSourceType);
									const assignStepConfig = groupStructureSourceType.assignStepConfig;
									assignStepConfig.form = estimateMainBoqPackageAssignFormConfig.getConfig(service,groupStructureSourceType.value, uniqueFieldsProfileService,costTransferOptionProfileService);
									info.wizard.steps[2] = _.cloneDeep(assignStepConfig);
								}
							}, {
								expression: 'strurctrueSourceType',
								fn: function (info) {
									let structureSourceType = PRC_STRUCTURE_TYPE.getStructureTypeObjectByValue(info.newValue);
									if(info.model.strurctrueSourceType){
										info.model.packageSourceType =info.model.strurctrueSourceType;
										currentStep.disallowNext = false;
										_.cloneDeep(PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.stepConfig,structureSourceType);
										const form = estimateMainBoqPackageAssignFormConfig.getConfig(service,structureSourceType.value, uniqueFieldsProfileService,costTransferOptionProfileService);
										info.wizard.steps[2].form = _.cloneDeep(form);
									}
								}
							}, {
								expression: 'wicGroupId',
								fn: function (info) {
									currentStep.enableWicErrorButton = false;
									if (info.model.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value) {
										currentStep.disallowNext = false;
									}
								}
							}],
							wicErrorDialog: function (info) {
								// Call this method from button click callback in future when custom buttons are supported in wizard.
								showWicErrorDialog(info);
							},
							// temporary property to enable/disable WIC Error button once custom buttons are supported in wizard.
							enableWicErrorButton: false
						},
						_.cloneDeep(PACKAGE_SOURCE_TYPE.PROJECT_BOQ.stepConfig,'1'),
						defaultAssignStepConfig
					],
					width: '900px',
					onChangeStep: onStepChanged
				};
				platformWizardDialogService.translateWizardConfig(wizardConfig);

				platformWizardDialogService.showDialog(wizardConfig, resetEntity()).then(function (result) {
					if (!result || !result.data || !result.data.boqPackageAssignmentEntity) {
						return;
					}
					const item = result.data;
					if (result.success) {
						assignBoqPackage(item);
					}
				});
			};
			service.updateFieldStatus = updateFieldStatus;
			service.entityChanged = entityChanged;
			service.generateNewPackage = generateNewPackage;
			service.setGeneratePakageData = setGeneratePakageData;
			service.getGeneratePakageData = getGeneratePakageData;
			service.validateBoqPackageItem = validateBoqPackageItem;
			service.getEntity = getEntity;

			service.closeIsLoading = new Platform.Messenger();
			service.resourceResultPageInfoChanged = new Platform.Messenger();

			let subPackageFilter = {
				key: 'assign-boq-wizard-sub-package-filter',
				serverKey: 'prc-boq-package2header-filter',
				serverSide: true,
				fn: function (dataContext) {
					if (dataContext && dataContext.boqPackageAssignmentEntity && dataContext.boqPackageAssignmentEntity.Package && dataContext.boqPackageAssignmentEntity.Package.Id) {
						return {PrcPackageFk: dataContext.boqPackageAssignmentEntity.Package.Id};
					}
				}
			};

			let filters = [{
				key: 'assign-boq-wizard-package-configuration-filter',
				// serverKey: 'create-package-configuration-filter',
				serverSide: true,
				fn: function () {
					return {
						RubricFk : procurementContextService.packageRubricFk,
						IsProcurementService:true
					};
				}
			}, {
				key: 'assign-boq-wizard-prc-package-filter',
				serverSide: true,
				fn: function () {
					let hidePackageWithMaterialOrNonCurrentCriteria = false;
					// let isFromPrjBoq = false;
					// let isFromWicBoq = false;
					// let isFromLineItem = false;
					let boqCriteria = null;
					if (entity && entity.boqPackageAssignmentEntity && entity.boqPackageAssignmentEntity.hidePackageWithMaterialOrNonCurrentCriteria) {
						hidePackageWithMaterialOrNonCurrentCriteria = true;
						if (entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value) {
							boqCriteria = 1;
						} else if (entity.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value) {
							boqCriteria = 2;
						} else if (entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.value ||
							entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value) {
							boqCriteria = 3;
						} else if (entity.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value) {
							boqCriteria = 4;
						}
					}

					return {
						ProjectFk: estimateMainService.getSelectedProjectId(),
						IsLive: true,
						hidePackageWithMaterialOrNonCurrentCriteria: hidePackageWithMaterialOrNonCurrentCriteria,
						// isFromPrjBoq: isFromPrjBoq,
						// isFromWicBoq: isFromWicBoq,
						// isFromLineItem: isFromLineItem,
						boqCriteria: boqCriteria
					};
				}
			}, subPackageFilter
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			let defaultPackage = {
				Id: null,
				PrcHeaderFk: null,
				ActivityFk: null,
				BusinessPartnerFk: null,
				ClerkPrcFk: null,
				Code: null,
				CompanyFk: null,
				ConfigurationFk: null,
				Description: '',
				IsLive: true,
				PackageStatusFk: null,
				ProjectFk: null,
				ScheduleFk: null,
				StructureFk: null,
				Reference: ''
			};

			uniqueFieldsProfileService.selectItemChanged.register(onSelectItemChanged);

			return service;

			function setGeneratePakageData (PackageResult){
				resultPackage = PackageResult;
			}

			function getGeneratePakageData (){
				return resultPackage;
			}


			function resetEntity() {

				uniqueFieldsProfileService.reset();

				let profile = uniqueFieldsProfileService.getSelectedItem();

				// load the cost Transfer option profile
				costTransferOptionProfileService.reset();
				entity = {
					estimateScope: 0,
					isSelectedReferenceLineItem: false,
					isSelectedMultiplePackageAssignmentMode: false,
					packageSourceType: PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value,
					groupStructureSourceType: PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value,
					boqList: [],
					packageAssignList: [],
					packageAssignResultList: [],
					isDirectCostIndeterminate:false,
					isIndirectCostIndeterminate:false,
					isMarkUpCostIndeterminate:false,
					resourceList: [],
					boqPackageAssignmentEntity: {
						IsCreateNew: true,
						IsToCreateSeparatePackages: false,
						IsConsiderBoqQtyRelation:false,
						filterResourceWithOutPackage :false,
						IsReadOnlyPackageCode:false,
						CodeConflict: false,
						IsDirectCost:true,
						isMarkUpCost:true,
						IsIndirectCost:true,
						CreateUpdateBoQInPackage: true,
						isAggregate: true,
						IsControllingUnit:false,
						QuantityTransferFrom: basicsCommonQuantityTransferFormConstant.boqWQAQ,
						uniqueFieldsProfile: uniqueFieldsProfileService.getDescription(profile),
						UniqueFieldListProfile: null,
						CostTransferOptprofile:null,
						Package: {
							Id: 0,
							Code: null,
							ConfigurationFk: null,
							Description: null,
							ClerkPrcFk:null,
							IsLive: false
						},
						SubPackageFk: null,
						SubPackageDescription: null,
						hasUpdateOption: false,
						hidePackageWithMaterialOrNonCurrentCriteria: true,
						lineItemWithNoResourcesFlag: true,
						BoqStructureOption4SourceResources: boqHierarchy.projectBoqAndLineItem,// 1 - project boq + line item as boq hierarchy; 2 - line item as boq hierarchy
						IsSkipBoqPositionAsDivisionBoq: true,
						simulationData: null
					}
				};
				return entity;
			}

			function generateNewPackage(currentWindowEntity,item,isOverDefaultStructureFk) {

				let defaultStructureFkbak = null;

				let defaultCode = item.Package.Code;
				if(isOverDefaultStructureFk){
					defaultStructureFkbak = null;
				}else{
					defaultStructureFkbak = item.defaultStructureFk;
				}

				let configurationFk = item.Package.ConfigurationFk;
				let param ={
					projectId :estimateMainService.getProjectId(),
					configurationId :configurationFk,
					structureId :item.defaultStructureFk
				};
				service.isPackageGenerating.fire(true);
				return $http.post(globals.webApiBaseUrl + 'estimate/main/createboqpackage/generatenewpackage',param).then(function (response) {
					if (response.data) {
						let clerkPrcFk = (item.Package.ClerkPrcFk <= 0 ) ?  null : item.Package.ClerkPrcFk;
						let itemPackageStructurFk = (item.Package.StructureFk <= 0 ) ? defaultStructureFkbak : item.Package.StructureFk;
						_.assign(item.Package, response.data);
						item.Package.Description = item.defaultDescription;
						item.SubPackageDescription = item.defaultDescription;
						item.Package.StructureFk = itemPackageStructurFk;
						item.Package.ClerkPrcFk = clerkPrcFk;
						item.IsReadOnlyPackageCode = response.data.IsReadOnlyPackageCode;
						item.Package.Code = response.data.Code!==null ? response.data.Code :defaultCode;

						if(!item.IsReadOnlyPackageCode || !item.Package.Code  || !item.Package.StructureFk){
							currentStep.canFinish = false;
						}

						platformRuntimeDataService.readonly(currentWindowEntity, [{
							field: 'boqPackageAssignmentEntity.Package.Code',
							readonly:  item.IsReadOnlyPackageCode
						}]);
					}
				})
					.finally(function () {
						service.isPackageGenerating.fire(false);
						validateBoqPackageItem(item);
					});
			}

			function validateBoqPackageItem(item) {
				currentStep.canFinish = false;
				let costTransferOptprofile = item.CostTransferOptprofile && item.CostTransferOptprofile.length>0;
				if (!item.IsCreateNew && !item.IsToCreateSeparatePackages) {
					let isValid = true;
					if (item.simulationData && item.simulationData.length > 0) {
						_.forEach(item.simulationData, function (simulation) {
							isValid = isValid && !platformRuntimeDataService.hasError(simulation, 'Code');
							isValid = isValid && !platformRuntimeDataService.hasError(simulation, 'StructureCodeFk');
							if (entity.packageSourceType !== PACKAGE_SOURCE_TYPE.RESOURCE.value) {
								isValid = isValid && (costTransferOptprofile || item.filterResourceWithOutPackage);
							}
						});
					} else {
						isValid = false;
					}

					currentStep.canFinish = isValid;
				} else {
					if(item.CodeConflict ||!item.Package.StructureFk){
						currentStep.canFinish = false;
					}else if(item.filterResourceWithOutPackage){
						currentStep.canFinish = true;
					}else{
						if(costTransferOptprofile){
							currentStep.canFinish = true;
						}
					}
				}
			}

			function onPackageIdChanged(item) {
				if (item.boqPackageAssignmentEntity.Package.Id > 0) {
					let request = {
						'FilterKey': subPackageFilter.serverKey,
						'AdditionalParameters': subPackageFilter.fn(item),
						TreeState: {
							StartId: null,
							Depth: null
						}
					};
					basicsLookupdataLookupDataService.getSearchList('prcpackage2header', JSON.stringify(request)).then(function (data) {
						if (data && data.items && data.items.length > 0) {
							data = data.items[0];
							item.boqPackageAssignmentEntity.SubPackageFk = data.Id;
							validateBoqPackageItem(item.boqPackageAssignmentEntity);
						}
					});
				}
				updateFieldStatus(item);
			}

			function entityChanged(item, field) {
				switch (field) {
					case 'boqPackageAssignmentEntity.IsCreateNew':
						item.boqPackageAssignmentEntity.Package.Reference ='';
						if (item.boqPackageAssignmentEntity && item.boqPackageAssignmentEntity.IsCreateNew){
							item.boqPackageAssignmentEntity.IsToCreateSeparatePackages = false;
						}
						onIsCreateNewChanged(item);
						break;
					case 'boqPackageAssignmentEntity.IsToCreateSeparatePackages':
						if (item.boqPackageAssignmentEntity && item.boqPackageAssignmentEntity.IsToCreateSeparatePackages){
							item.boqPackageAssignmentEntity.IsCreateNew = false;
						}
						onIsCreateNewChanged(item);
						break;
					case 'boqPackageAssignmentEntity.Package.Id':
						onPackageIdChanged(item);
						break;
					case 'boqPackageAssignmentEntity.Package.ConfigurationFk':
						generateNewPackage(item,item.boqPackageAssignmentEntity,true);
						break;
					case 'boqPackageAssignmentEntity.CreateUpdateBoQInPackage':
						var isCreateUpdateBoQInPackage  = item.boqPackageAssignmentEntity.CreateUpdateBoQInPackage;
						if(!isCreateUpdateBoQInPackage){
							item.boqPackageAssignmentEntity.IsConsiderBoqQtyRelation = false;
						}
						updateFieldStatus(item);
						break;
					case 'boqPackageAssignmentEntity.isAggregate':
						updateFieldStatus(item);
						break;
					case 'boqPackageAssignmentEntity.Package.StructureFk':
						break;
					case 'boqPackageAssignmentEntity.QuantityTransferFrom':
						// packageSourceType : criteria:Project BoQ
						if(item.packageSourceType === 1 && item.boqPackageAssignmentEntity.QuantityTransferFrom === basicsCommonQuantityTransferFormConstant.boqWQAQ) {// the project BoQ
							item.boqPackageAssignmentEntity.IsConsiderBoqQtyRelation = false;
						}
						updateFieldStatus(item);
						break;
					case 'boqPackageAssignmentEntity.BoqStructureOption4SourceResources':
						updateFieldStatus(item);
						break;
				}
				validateBoqPackageItem(item.boqPackageAssignmentEntity);
			}

			function updateFieldStatus(item) {
				let isCreateNew = item.boqPackageAssignmentEntity.IsCreateNew || item.boqPackageAssignmentEntity.IsToCreateSeparatePackages;
				let isCreateUpdateBoQInPackage = item.boqPackageAssignmentEntity.CreateUpdateBoQInPackage;
				let isAggregate = item.boqPackageAssignmentEntity.isAggregate;
				let isConsiderBoqQtyRelation = (item.packageSourceType === 1 && item.boqPackageAssignmentEntity.QuantityTransferFrom === basicsCommonQuantityTransferFormConstant.boqWQAQ);

				let isQuantityTransferFrom = false;
				if (!item.boqPackageAssignmentEntity.CreateUpdateBoQInPackage || item.boqPackageAssignmentEntity.hasUpdateOption) {
					isQuantityTransferFrom = isConsiderBoqQtyRelation = true;
				}

				platformRuntimeDataService.readonly(item, [{
					field: 'boqPackageAssignmentEntity.Package.Code',
					readonly: isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.Package.Id',
					readonly: isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.Package.Description',
					readonly: !isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.SubPackageFk',
					readonly: item.boqPackageAssignmentEntity.Package.Id <= 0
				}, {
					field: 'boqPackageAssignmentEntity.SubPackageDescription',
					readonly: !isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.Package.ConfigurationFk',
					readonly: !isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.Package.StructureFk',
					readonly: !isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.Package.Reference',
					readonly: !isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.Package.ClerkPrcFk',
					readonly: !isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.IsControllingUnit',
					readonly: !isCreateUpdateBoQInPackage
				}, {
					field: 'boqPackageAssignmentEntity.uniqueFieldsProfile',
					readonly: !isCreateUpdateBoQInPackage || !isAggregate
				},
				{
					field: 'boqPackageAssignmentEntity.IsConsiderBoqQtyRelation',
					readonly: isConsiderBoqQtyRelation
				}, {
					field: 'boqPackageAssignmentEntity.QuantityTransferFrom',
					readonly: isQuantityTransferFrom
				}, {
					field: 'boqPackageAssignmentEntity.isAggregate',
					readonly: !isCreateUpdateBoQInPackage
				}, {
					field: 'boqPackageAssignmentEntity.hidePackageWithMaterialOrNonCurrentCriteria',
					readonly: isCreateNew
				}, {
					field: 'boqPackageAssignmentEntity.BoqStructureOption4SourceResources',
					readonly: !isCreateUpdateBoQInPackage
				},
				{
					field: 'boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq',
					readonly: !isCreateUpdateBoQInPackage || item.boqPackageAssignmentEntity.BoqStructureOption4SourceResources === boqHierarchy.lineItem
				}]);
			}

			function processList(entityList, processor, childItemProperty) {
				if(entityList && entityList.length > 0 && processor){
					if(angular.isString(processor)) {
						processor = $injector.get(processor);
					}
					for(let index = 0; index < entityList.length; index++){
						let entity = entityList[index];
						processor.processItem(entity);
						if(childItemProperty && entity[childItemProperty] && entity[childItemProperty].length > 0){
							processList(entity[childItemProperty], processor, childItemProperty);
						}
					}
				}
			}


			// show boqitem :note,position,surchargeitem
			function removeBoqItemThatNoReferToLineItem(boqList,boqIdList) {
				let boqItemList = [];
				let outPut= [];
				cloudCommonGridService.flatten(boqList, outPut, 'BoqItems');

				var basicsLookupdataTreeHelper = $injector.get('basicsLookupdataTreeHelper');
				var boqMainLineTypes  = $injector.get('boqMainLineTypes');

				_.find(outPut, function (boq) {

					if( (boqMainLineTypes.level1 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level2 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level3 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level4 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level5 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level6 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level7 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.level8=== boq.BoqLineTypeFk ||
                        boqMainLineTypes.level9 === boq.BoqLineTypeFk)){

						if(boq.HasChildren) {
							boq.BoqItems = [];
							boqItemList.push(boq);
						}
					}else if( !( (boqMainLineTypes.surchargeItem1 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.surchargeItem2 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.surchargeItem1 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.surchargeItem3 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.surchargeItem4 === boq.BoqLineTypeFk ||
                        boqMainLineTypes.position === boq.BoqLineTypeFk) && boqIdList.indexOf(boq.Id)<0) ){
						boq.BoqItems =[];
						boqItemList.push(boq);
					}
				});


				var context = {
					treeOptions: {
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems'
					},
					IdProperty: 'Id'
				};
				boqItemList = basicsLookupdataTreeHelper.buildTree(boqItemList, context);

				return boqItemList;
			}

			function populateSourceList(info, pageIndex, forceToFetchData) {
				let sourceType= PACKAGE_SOURCE_TYPE.getSourceTypeObjectByValue(info.model.groupStructureSourceType);
				if(sourceType.stepConfig.id==='BF0037DEB45D4CFA8010A740169C7CE1'){
					sourceType = PRC_STRUCTURE_TYPE.getStructureTypeObjectByValue(info.model.strurctrueSourceType);
				}
				let properties = sourceType.properties;

				let isFetchData = true;
				let step2Info = currentStep;
				step2Info.form = sourceType.stepConfig.form;
				step2Info.message = null;
				step2Info.disallowNext = true;
				step2Info.pageInfo = step2Info.pageInfo || {
					pageIndex: 0
				};
				if (angular.isNumber(pageIndex)) {
					step2Info.pageInfo.pageIndex = pageIndex;
				}

				if (info.model[properties.list] && info.model[properties.list].length > 0 && !forceToFetchData) {

					$timeout(function () {
						service.closeIsLoading.fire();
					});

					let list = info.model[properties.list];
					if(info.model.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value){
						list = _.filter(list, function (item) {
							return item.Id !== 0;
						});
					}

					if(list && list.length > 0){
						populateGrid(properties.gridId, list);
						isFetchData = false;
						step2Info.form = sourceType.stepConfig.form;
						step2Info.message = null;

						if (properties.isTree) {
							list = cloudCommonGridService.flatten(info.model[properties.list], [], properties.childItemProperty);
						} else {
							list = info.model[properties.list];
						}
						step2Info.disallowNext = !_.find(list, {IsSelected: true});
						if (properties.list === 'resourceList') {
							service.getResourceListByPage = registerGetResourceListByPage(info);
							$timeout(function () {
								service.resourceResultPageInfoChanged.fire(step2Info.pageInfo);
							});
						}
					}
					else{
						isFetchData = true;
						if (properties.list === 'resourceList') {
							service.getResourceListByPage = null;
						}
					}
				}
				if (isFetchData || !!forceToFetchData) {
					// info.step.loadingMessage = 'Fetching list';

					step2Info.disallowNext = true;

					let lineItemIds = [];
					if(info.model && info.model.estimateScope === 2 && estimateMainService.getSelectedEntities() && estimateMainService.getSelectedEntities().length >0 ){ // if highlight line item
						let lineItems =  estimateMainService.getSelectedEntities();
						lineItemIds = _.map(lineItems,'Id');
						info.model.lineItemIds =lineItemIds;
					}

					let params = {
						EstimateScope : info.model.estimateScope,
						PackageSourceType : info.model.packageSourceType,
						FilterRequest:  info.model.filterRequest,
						WicGroupId: null,
						lineItemIds : lineItemIds,
						isSelectedReferenceLineItem: info.model.WicGroupId,
						IsSelectedMultiplePackageAssignmentMode: info.model.isSelectedMultiplePackageAssignmentMode,
						PageIndex: step2Info.pageInfo.pageIndex
					};

					$http.post(globals.webApiBaseUrl + 'estimate/main/createboqpackage/getcriteriaselectionlist',params).then(function (response) {

						service.closeIsLoading.fire();
						if(response.data && !response.data.IsWithoutEligibleResource){


							if(response.data.Timestr){
								console.log(response.data.Timestr);
							}
							if(response.data.EstLineItems && response.data.EstLineItems.length>0){
								info.model.boqPackageAssignmentEntity.EstLineItems = response.data.EstLineItems;
							}
							info.model.boqPackageAssignmentEntity.lineItemWithNoResourcesFlag = response.data.HooklineItemWithNoResourcesFlag;

							if (response.data.MatchedEstHeaderId2LineItemIdsMap) {
								info.model.boqPackageAssignmentEntity.MatchedEstHeaderId2LineItemIdsMap = response.data.MatchedEstHeaderId2LineItemIdsMap;
							}

							let canNext = false;
							if(properties.list === 'boqList' && response.data.EntityList && response.data.EntityList.length > 0) {
								let boqList = removeBoqItemThatNoReferToLineItem(response.data.EntityList, response.data.boqItemIds);
								response.data.EntityList = boqList;
								const flatList = [];
								_.forEach(boqList, function (item) {
									prepareStructureList(item, flatList, 'BoqItems');
								});
								const boqItemIds = response.data.boqItemIds;
								_.forEach(flatList, function (item) {
									const foundBoqId = boqItemIds.find(e => e === item.Id);
									item.isMark = !!foundBoqId;
								});

								$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
									response.data.dtos = response.data.EntityList;
									basicsCostGroupAssignmentService.process(response.data, service, {
										mainDataName: 'dtos',
										attachDataName: 'ProjectBoQ2CostGroups',
										dataLookupType: 'ProjectBoQ2CostGroups',
										isTreeStructure: true,
										isReadonly: true,
										childrenName: 'BoqItems',
										identityGetter: function identityGetter(entity){
											return {
												BoqHeaderFk: entity.RootItemId,
												Id: entity.MainItemId
											};
										}
									});
								}]);

							}

							if (properties.list === 'resourceList' && response.data.EntityList && response.data.EntityList.length > 0) {
								step2Info.pageInfo.totalCount = response.data.ResourceResultTotalCount;
								step2Info.pageInfo.dataCount = response.data.EntityList.length;
								service.resourceResultPageInfoChanged.fire(step2Info.pageInfo);
								let flatResources = cloudCommonGridService.flatten(response.data.EntityList, [], 'ResourceChildren');
								let lineItems = response.data.MatchedLineItemBaseInfoList || [];
								let protectedAssemblyIdsOfResources = response.data.ProtectedAssemblyIdsOfResources || [];
								let defaultSelection = response.data.DefaultResourceResultSelections || [];
								info.model.resourceInfo = {
									matchedLineItemBaseInfoList: lineItems,
									resources: flatResources
								}
								if (!angular.isArray(info.model.selectedResourceIdList)) {
									info.model.selectedResourceIdList = defaultSelection;
								}
								_.forEach(flatResources, function (resource) {
									var lineItem = _.find(lineItems, {
										Id: resource.EstLineItemFk,
										EstHeaderFk: resource.EstHeaderFk
									});
									if (lineItem) {
										resource.LineItemCode = lineItem.Code;
										resource.LineItemDescription = lineItem.DescriptionInfo.Translated;
									}

									resource.isProtectedAssembly = resource.EstAssemblyFk && _.indexOf(protectedAssemblyIdsOfResources, resource.EstAssemblyFk) > -1;

									let found = info.model.selectedResourceIdList.find(function (sel) {
										return sel.Id === resource.Id && sel.PKey1 === resource.EstHeaderFk && sel.PKey2 === resource.EstLineItemFk;
									});
									resource.IsSelected = !!found;
									if (angular.isFunction(properties.allowSelection)) {
										if (!properties.allowSelection(resource)) {
											platformRuntimeDataService.readonly(resource, [{
												field: 'IsSelected',
												readonly: true
											}]);
										}
									}
								});
								service.getResourceListByPage = registerGetResourceListByPage(info);
								if (angular.isArray(info.model.selectedResourceIdList) && info.model.selectedResourceIdList.length > 0) {
									canNext = true;
								}
							}

							if (properties.list === 'prcStructureList' &&
								response.data.EntityList &&
								response.data.EntityList.length > 0 &&
								response.data.LineItemOrBoqPrcStructureIds &&
								response.data.LineItemOrBoqPrcStructureIds.length > 0) {
								const list = response.data.EntityList;
								const flatList = [];
								_.forEach(list, function (item) {
									prepareStructureList(item, flatList, 'ChildItems');
								});
								const structureIds = response.data.LineItemOrBoqPrcStructureIds;
								_.forEach(flatList, function (item) {
									const foundStructureId = structureIds.find(e => e === item.Id);
									item.isMark = !!foundStructureId;
								});
							}

							if (response.data.EntityList && response.data.EntityList.length > 0) {

								info.model[properties.list] = response.data.EntityList;
								info.model.boqPackageAssignmentEntity.filterResourceWithOutPackage = response.data.filterResourceWithOutPackage;
								if(properties.processor){
									processList(response.data.EntityList, properties.processor, properties.childItemProperty);
								}
								populateGrid(properties.gridId, info.model[properties.list],null,info.model.groupStructureSourceType, response.data.CostGroupCats );

							} else {
								step2Info.form = null;
								let noItemsMessage = properties.noItemsMessage;
								if(angular.isFunction(properties.noItemsMessage)){
									noItemsMessage = properties.noItemsMessage(response.data);
								}
								step2Info.message = $translate.instant(noItemsMessage);
							}
							step2Info.disallowNext = !canNext;
						}else{
							step2Info.form = null;
							step2Info.message = $translate.instant('estimate.main.createBoqPackageWizard.noEligibleResource');
							step2Info.disallowNext = true;
						}

					});

				}

				platformGridAPI.events.register(properties.gridId, 'onHeaderCheckboxChanged', function (e) {
					let list = [];
					if (properties.isTree) {
						list = cloudCommonGridService.flatten(info.model[properties.list], [], properties.childItemProperty);
					} else {
						list = info.model[properties.list];
					}

					_.forEach(list, function (item) {
						if (angular.isFunction(properties.allowSelection)) {
							if (properties.allowSelection(item)) {
								item.IsSelected = e.target.checked;
							}
							else {
								item.IsSelected = false;
							}
						}
						else {
							item.IsSelected = e.target.checked;
						}
					});
					$timeout(function () {
						if (properties.list === 'resourceList') {
							collectResourceSelectedIds(info, list, 'selectedResourceIdList');
							step2Info.disallowNext = !info.model.selectedResourceIdList || info.model.selectedResourceIdList.length <= 0;
						} else {
							step2Info.disallowNext = !e.target.checked;
						}
					});
				});

				platformGridAPI.events.register(properties.gridId, 'onCellChange', function () {
					let list = [];
					if (properties.isTree) {
						list = cloudCommonGridService.flatten(info.model[properties.list], [], properties.childItemProperty);
					} else {
						list = info.model[properties.list];
					}
					$timeout(function () {
						if (properties.list === 'boqList') {
							step2Info.disallowNext = !_.find(list, {IsSelected: true, BoqLineTypeFk: 0});
						} else if (properties.list === 'resourceList') {
							collectResourceSelectedIds(info, list, 'selectedResourceIdList');
							step2Info.disallowNext = !info.model.selectedResourceIdList || info.model.selectedResourceIdList.length <= 0;
						} else {
							step2Info.disallowNext = !_.find(list, {IsSelected: true});
						}
					});
				});
			}

			function collectResourceSelectedIds(info, allList, selectedProp) {
				info.model[selectedProp] = info.model[selectedProp] || [];
				let selectedList = info.model[selectedProp];
				_.forEach(allList, function (item) {
					let index = selectedList.findIndex(function (sel)  {
						return sel.Id === item.Id && sel.PKey1 === item.EstHeaderFk && sel.PKey2 === item.EstLineItemFk;
					});
					if (index === -1 && item.IsSelected) {
						selectedList.push({ Id: item.Id, PKey1: item.EstHeaderFk, PKey2: item.EstLineItemFk });
					} else if (index > -1 && !item.IsSelected) {
						selectedList.splice(index, 1);
					}
				});
			}

			function getTopLevelItemSelected(item, childProp, excludeRootLevel, selectedItems) {
				if (!item) {
					return;
				}
				let children = item[childProp] || [];
				// if the item is not selected, or root level item needs to be excluded when the item is root level and it has children,
				// go to next level to get the top level items.
				if (!item.IsSelected ||
					(excludeRootLevel && !item.parent && children.length > 0)) {
					children.forEach(function (child) {
						getTopLevelItemSelected(child, childProp, excludeRootLevel, selectedItems);
					});
					return;
				}
				selectedItems.push(item);
			}

			function populatePackageAssignList(info) {
				let properties= {};
				if(PACKAGE_SOURCE_TYPE.getSourceTypeObjectByValue(info.model.packageSourceType)){
					properties = PACKAGE_SOURCE_TYPE.getSourceTypeObjectByValue(info.model.packageSourceType).properties;

				}else if(PRC_STRUCTURE_TYPE.getStructureTypeObjectByValue(info.model.packageSourceType)){
					properties = PRC_STRUCTURE_TYPE.getStructureTypeObjectByValue(info.model.packageSourceType).properties;
				}


				/*
                * get the structureFK by new logic
                * if there are many Structure root and the Structure root is the same one then choose the Structure root id
                * else choose the minimum id of the  all the selected Structures
                *
                */
				let AllStructureOrBoqList = cloudCommonGridService.flatten(info.model[properties.list], [], properties.childItemProperty);
				let AllStructureOrBoqSelectedList = [];
				let structureOrBoqTopLevelSelectedList = [];
				let selectedPrcStructures = [];

				if(AllStructureOrBoqList && AllStructureOrBoqList.length) {
					AllStructureOrBoqSelectedList = _.filter(AllStructureOrBoqList, function (item) {
						if (item.IsSelected) {
							return item;
						}
					});

					if (info.model.modeFlg === 1) {
						structureOrBoqTopLevelSelectedList = _.filter(AllStructureOrBoqList, function (item) {
							if (item.IsSelected) {
								return item;
							}
						});
					} else {
						// modeFlg == 2, only get the top level selected
						const list = info.model[properties.list];
						list.forEach(function (item) {
							getTopLevelItemSelected(item, properties.childItemProperty, info.model.rootLevelFlg, structureOrBoqTopLevelSelectedList);
						});
					}

					let allParentIds = [];
					let structureRootIds = _.uniq(_.map(AllStructureOrBoqSelectedList, 'PrcStructureLevel1Fk'));

					if(structureRootIds && structureRootIds.length>1) {
						allParentIds = [];
					}
					else if (info.model.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value && AllStructureOrBoqList && AllStructureOrBoqList.length > 0) {
						collectResourceSelectedIds(info, AllStructureOrBoqList, properties.selectedList);
					}
					else{

						if(AllStructureOrBoqSelectedList && AllStructureOrBoqSelectedList.length ===1){
							allParentIds = _.map(AllStructureOrBoqSelectedList, 'Id');
						}else {

							let getParentStructure = function getParentStructure(currentStructure,parentIds){
								if(currentStructure){
									parentIds.push(currentStructure.Id);
								}
								if(currentStructure && currentStructure.PrcStructureFk){
									let structrue =[];
									if(!parentIds.includes(currentStructure.PrcStructureFk)){
										parentIds.push(currentStructure.PrcStructureFk);
										structrue = _.filter(AllStructureOrBoqList,{'Id':currentStructure.PrcStructureFk});
										if(structrue  && structrue.length>0){
											getParentStructure (structrue[0],parentIds);
										}
									}else{
										structrue = _.filter(AllStructureOrBoqList,{'Id':currentStructure.PrcStructureFk});
										if(structrue && structrue.length>0){
											allParentIds.push(structrue[0].Id);
										}
									}
								}
							};

							let parentIds= [];
							_.forEach(_.sortBy(AllStructureOrBoqSelectedList,'Id'),function(item){
								getParentStructure(item,parentIds);
							});
						}

					}

					if (info.model.packageSourceType !== PACKAGE_SOURCE_TYPE.RESOURCE.value) {
						info.model[properties.selectedList] = _.map(AllStructureOrBoqSelectedList, 'Id'); // properties.selectedList means the 'selectedPrcStructureIdList' or the 'SelectedBoqIdList'
					}
					if (info.model.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value ||
						info.model.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value) {
						let boqRoots = _.filter(AllStructureOrBoqList, function (item) {
							return !item.BoqItemFk;
						});
						collectSelectedDataFromSelectionPage(structureOrBoqTopLevelSelectedList, info, properties, 'BoqHeaderFk');
						collectSelectedDataFromSelectionPage(boqRoots, info, properties, 'BoqHeaderFk', true);
					}

					if (info.model.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value ||
						info.model.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.value) {
						let structureRoots = _.filter(AllStructureOrBoqList, function (item) {
							return !item.PrcStructureFk;
						});
						collectSelectedDataFromSelectionPage(structureOrBoqTopLevelSelectedList, info, properties);
						collectSelectedDataFromSelectionPage(structureRoots, info, properties, null, true);
					}

					if (properties.selectedNodeList) {
						if (AllStructureOrBoqSelectedList && AllStructureOrBoqSelectedList.length > 0) {
							info.model[properties.selectedNodeList] = [];
							_.forEach(AllStructureOrBoqSelectedList, function (item) {
								if (item.BoqLineTypeFk !== 107 && item.BoqLineTypeFk !== 105 && item.BoqLineTypeFk !== 106 && item.BoqLineTypeFk !== 110) {
									return;
								}
								info.model[properties.selectedNodeList].push({Id: item.Id, BoqHeaderFk: item.BoqHeaderFk});
							});
						}
					}

					if(properties.list === 'prcStructureList') {  // if from  the 'select procurement structure'
						if (AllStructureOrBoqSelectedList && AllStructureOrBoqSelectedList.length>0) {

							selectedPrcStructures = _.filter(AllStructureOrBoqList, {'Id': _.min(allParentIds)});
							if (properties.detailProperty) {
								if (selectedPrcStructures && selectedPrcStructures.length) {
									info.model.boqPackageAssignmentEntity.defaultDescription = platformObjectHelper.getValue(selectedPrcStructures[0], properties.detailProperty, '');
									info.model.boqPackageAssignmentEntity.defaultStructureFk = platformObjectHelper.getValue(selectedPrcStructures[0], properties.prcStructureProperty, null);
								}else{
									info.model.boqPackageAssignmentEntity.defaultDescription = null;
									info.model.boqPackageAssignmentEntity.defaultStructureFk = null;
								}
							}
						}else{
							info.model.boqPackageAssignmentEntity.defaultDescription = null;
							info.model.boqPackageAssignmentEntity.defaultStructureFk = null;
						}
					}else if (properties.list === 'boqList'){

						let selectedBoqItem = AllStructureOrBoqSelectedList[0];
						if (properties.detailProperty) {
							info.model.boqPackageAssignmentEntity.defaultDescription = platformObjectHelper.getValue(selectedBoqItem, properties.detailProperty, '');
						}
						if (properties.prcStructureProperty) {
							info.model.boqPackageAssignmentEntity.defaultStructureFk = platformObjectHelper.getValue(selectedBoqItem, properties.prcStructureProperty, null);
						}
					} else {
						info.model.boqPackageAssignmentEntity.defaultDescription = null;
						info.model.boqPackageAssignmentEntity.defaultStructureFk = null;
					}
				}

				updateFieldStatus(info.model);

				costTransferOptionProfileService.load(info.model).then(function(data){
					if(data){
						entity.boqPackageAssignmentEntity.CostTransferOptprofile = [];
						_.forEach(data,function(item){
							if(item.isSelect){
								entity.boqPackageAssignmentEntity.CostTransferOptprofile.push(item);
							}
						});
					}
				});
			}

			function onStepChanged(info) {
				currentStep = info.step;
				if (info.stepIndex === 0) {
					info.model.boqList = [];
					info.model.lineItemList = [];
					info.model.selectedBoqIdList = [];
					info.model.packageAssignList = [];
					info.model.prcStructureList= [];
					info.model.selectedResourceIdList = null;
					info.model.filterRequest = estimateMainService.getLastFilter();
					info.model.resourceList = [];
					info.model.selectedIdentificationIdList = [];
					info.model.selectedParentId2DescendantIdsMap = {};
					info.model.modeFlg = 2;
				}
				else if (info.stepIndex === 1) {
					info.model.selectedBoqIdList = [];
					info.model.packageAssignList = [];
					info.model.boqPackageAssignmentEntity.simulationData = null;
					populateSourceList(info);
					if (info.model.groupStructureSourceType === 9) {
						updateDynamicUniqueFields(info.model.estimateScope, info.model.filterRequest, info.model.lineItemIds || []);
					} else {
						let fields = basicsCommonEstimateLineItemFieldsValue.getWithDynamicFields();
						uniqueFieldsProfileService.updateDefaultFields(fields);
						uniqueFieldsProfileService.load();
					}
				} else if (info.stepIndex === 2) {
					info.model.packageAssignList = [];
					populatePackageAssignList(info);

					service.validateBoqPackageItem(info.model.boqPackageAssignmentEntity);
					estimateMainBoqPackageAssignFormConfig.change(info.model,'boqPackageAssignmentEntity.IsCreateNew');
				}
			}


			function populateGrid(gridId, data, resetLoadingMessage,groupStructureSourceType,costGroupCats) {
				if (resetLoadingMessage) {
					resetLoadingMessage.loadingMessage = null;
				}
				$timeout(function () {
					if(groupStructureSourceType ===1 || groupStructureSourceType === 2) {
						let columnsConfiguration = platformGridAPI.columns.configuration(gridId);
						if(columnsConfiguration){
							let columns = columnsConfiguration.current;
							let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
							let cgColumns = basicsCostGroupAssignmentService.createCostGroupColumns(costGroupCats);
							columns = columns.concat(cgColumns);
							platformGridAPI.columns.configuration(gridId, columns);
						}
					}

					platformGridAPI.items.data(gridId, data);
				});
			}

			function setDefaultItem(item) {
				_.assign(item.Package, defaultPackage);
				item.SubPackageFk = null;
				item.SubPackageDescription = '';
				item.hasUpdateOption = false;
			}

			function onIsCreateNewChanged(item) {
				if (item.boqPackageAssignmentEntity.IsCreateNew || item.boqPackageAssignmentEntity.IsToCreateSeparatePackages) {
					setDefaultItem(item.boqPackageAssignmentEntity);
					generateNewPackage(item,item.boqPackageAssignmentEntity);

					if(item && item.boqPackageAssignmentEntity){
						let packageData = item.boqPackageAssignmentEntity.Package;
						let postData = {
							prcStructureFk: item.boqPackageAssignmentEntity.defaultStructureFk,
							projectFk: packageData ? packageData.ProjectFk : null,
							companyFk: packageData ? packageData.CompanyFk : null,
							isProcurementService:true,
						};
						estimateMainBoqPackageAssignFormConfig.setResponsible(item.boqPackageAssignmentEntity.Package,postData);
					}
				}
				else {
					setDefaultItem(item.boqPackageAssignmentEntity);
				}

				updateFieldStatus(item);
			}

			function getEntity() {
				return entity;
			}

			function onSelectItemChanged() {
				let profile = uniqueFieldsProfileService.getSelectedItem();
				entity.boqPackageAssignmentEntity.uniqueFieldsProfile = uniqueFieldsProfileService.getDescription(profile);
			}

			function updateDynamicUniqueFields(estimateScope, filterRequest, selectedIds) {
				let dynamicFields = [];
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getdynamicuniquefields', {
					EstimateScope: estimateScope,
					FilterRequest: filterRequest,
					LineItemIds: selectedIds,
					SourceType: 1
				}).then(function (response) {
					if (!response || !angular.isArray(response.data)) {
						return dynamicFields;
					}
					dynamicFields = response.data;
					return dynamicFields;
				}).finally(function () {
					let fields = basicsCommonEstimateLineItemFieldsValue.getWithDynamicFields(dynamicFields);
					uniqueFieldsProfileService.updateDefaultFields(fields);
					uniqueFieldsProfileService.load();
				});
			}

			function registerGetResourceListByPage(info) {
				return function getListByPage(pageIndex, forceToFetchData) {
					populateSourceList(info, pageIndex, forceToFetchData);
				}
			}

			function prepareStructureList(parentItem, flatList, childProp) {
				if (!parentItem) {
					return;
				}
				flatList.push(parentItem);
				if (parentItem[childProp] && parentItem[childProp].length > 0) {
					_.forEach(parentItem[childProp], function (item) {
						item.parent = parentItem;
						prepareStructureList(item, flatList, childProp);
					});
				}
			}

			function collectSelectedDataFromSelectionPage (structureOrBoqTopLevelSelectedList, info, properties, pkey1Field, isRootDescendants) {
				let selectedList = [];
				const parentId2DescendantIdsMap = {};
				_.forEach(structureOrBoqTopLevelSelectedList, function (item) {
					let index = selectedList.findIndex(function (sel)  {
						if (pkey1Field) {
							return sel.Id === item.Id && sel.PKey1 === item[pkey1Field];
						} else {
							return sel.Id === item.Id;
						}
					});
					if (index === -1 && (item.IsSelected || isRootDescendants)) {
						if (pkey1Field) {
							selectedList.push({Id: item.Id, PKey1: item[pkey1Field]});
						} else {
							selectedList.push({Id: item.Id});
						}
						index = selectedList.length - 1;
					}

					if (index > -1) {
						const key = pkey1Field ? item.Id + '_' + item[pkey1Field] : item.Id.toString();
						// collect the descendants which are selected.
						const children = isRootDescendants ? item[properties.childItemProperty] || [] : [item];
						const descendants = cloudCommonGridService.flatten(children, [], properties.childItemProperty) || [];
						const descendantIds = _.filter(descendants, function (descendant) {
							return descendant.IsSelected;
						}).map(function (descendant) {
							return {
								Id: descendant.Id,
								PKey1: pkey1Field ? descendant[pkey1Field] : null
							};
						});

						if (isRootDescendants && descendantIds.length > 0) {
							descendantIds.unshift({
								Id: item.Id,
								PKey1: pkey1Field ? item[pkey1Field] : null
							});
							parentId2DescendantIdsMap[key] = descendantIds;
						} else if (!isRootDescendants) {
							parentId2DescendantIdsMap[key] = descendantIds;
						}

					}
				});
				if (isRootDescendants) {
					info.model[properties.selectedRootId2DescendantIdsMap] = parentId2DescendantIdsMap;
				} else {
					info.model[properties.selectedIdentificationIdList] = selectedList;
					info.model[properties.selectedParentId2DescendantIdsMap] = parentId2DescendantIdsMap;
				}
			}
		}
	]);
})(angular);

