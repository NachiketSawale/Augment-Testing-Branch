(function () {
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).factory('controllingGeneralContractorCreatePackagesWizardDialogService', ['globals', 'PlatformMessenger', '$http', '_', '$injector', '$translate',
		'basicsLookupdataConfigGenerator', 'platformModalService', 'platformDataValidationService', 'platformRuntimeDataService', 'platformContextService',
		'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupFilterService','platformDataServiceFactory',
		function (globals, PlatformMessenger, $http, _, $injector, $translate, basicsLookupdataConfigGenerator, platformModalService, platformDataValidationService,
		          platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, cloudDesktopPinningContextService,
		          basicsLookupdataLookupFilterService,platformDataServiceFactory) {

			let service = {};
			let initDataItem = {};
			let projectContext = {};
			let otherPackagesBudget = 0;
			let currentPackageBudget = 0;
			let defaultConfigurationFk = null;

			let genWizardInstanceDataServiceOption = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'controllingGeneralContractorCreatePackagesWizardDialogService',
					actions: {},
					modification: {},
					entityRole: {
						root: {
							itemName: 'CreatePackagesWizard'
						}
					},
					presenter: {
						list: {}
					}
				}
			};
			let serviceContainer = platformDataServiceFactory.createNewComplete(genWizardInstanceDataServiceOption);
			service = serviceContainer.service;


			service.getCurrentPackageBudget = function(){
				return currentPackageBudget;
			};

			service.getOtherPackagesBudget = function(){
				return otherPackagesBudget;
			};

			let resultPackage = null;
			service.setGeneratePackage = function setGeneratePackage (PackageResult){
				resultPackage = PackageResult;
			};

			service.getGeneratePackage =function getGeneratePackage (){
				return resultPackage;
			};

			service.showBudgetInfo = new PlatformMessenger();
			service.setStructureReadOnly = new PlatformMessenger();
			service.validateDialogConfiguration = new PlatformMessenger();

			service.resetToDefault = function init() {
				let costControlSelected =  $injector.get('controllingGeneralcontractorCostControlDataService');

				projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
				initDataItem = {
					AssetMasterFk: null,
					PrcPackageFk: null,
					PrjProjectFk: null,
					ConfigurationFk: null,
					Description: null,
					MdcControllingUnitFk:costControlSelected.getSelected()? Math.abs(costControlSelected.getSelected().Id): null,
					StructureFk: -1,
					ClerkPrcFk: null, // reference StructureFk
					ClerkReqFk: null, // reference StructureFk
					TaxCodeFk: null, // reference StructureFk
					AssetMasterList: [], // for filter
					packageCreationShowAssetMaster: null,
					Code:null,
					Budget:0,
					Remark:null,
					Version:0,
					GenerateType:'1',
					PackageStatusFk:null,
					IsAutoSave :true,
					SelectedPrcPackage: null
				};


				if (projectContext) {
					initDataItem.PrjProjectFk = projectContext.id;
				}
			};

			service.getDefaultConfigurationFk = function getDefaultConfigurationFk() {
				// let rubricFk = $injector.get('procurementContextService').packageRubricFk;
				//
				// let urlStr = 'basics/procurementconfiguration/configuration/getByStructure?';
				// if(initDataItem.StructureFk === null ||initDataItem.StructureFk<=0){
				// 	urlStr = urlStr +'rubricId='+rubricFk;
				// }
				// else{
				// 	urlStr = urlStr + 'structureId='+initDataItem.StructureFk+'&rubricId='+rubricFk;
				// }
				// $http.get(globals.webApiBaseUrl + urlStr).

				service.getConfigurationFkPromist(initDataItem.StructureFk).then(function (response) {
					initDataItem.ConfigurationFk= response.data;
					defaultConfigurationFk = initDataItem.ConfigurationFk;
					service.validateDialogConfiguration.fire(initDataItem.ConfigurationFk);
				});

			};

			service.getConfigurationFkPromist = function (structureId){
				let urlStr = 'basics/procurementconfiguration/configuration/getByStructure?';
				if(_.isNumber(structureId) && structureId > 0){
					urlStr = urlStr + 'structureId=' + structureId + '&';
				}
				urlStr += 'rubricId='+$injector.get('procurementContextService').packageRubricFk;

				return $http.get(globals.webApiBaseUrl + urlStr);
			}

			service.getStructureDefaultConfigurationFk = function(){
				return defaultConfigurationFk;
			}

			service.validateDialogConfigurationFk = function validateDialogConfigurationFk(entity, value){
				service.validateDialogConfiguration.fire(value);
				return true;
			};

			function filterPrcPackage(args){
				let contractorCostControlDataService =  $injector.get('controllingGeneralcontractorCostControlDataService');
				let costControlSelected = contractorCostControlDataService.getSelected();

				let packageStatuss = $injector.get('basicsLookupdataLookupDescriptorService').getData('PackageStatus');
				packageStatuss = _.filter(packageStatuss,function(d){
					return d.IsLive;
				});

				let ids = _.map(packageStatuss,'Id');

				return args.MdcControllingUnitFk === Math.abs(costControlSelected.Id) && args.ProjectFk === costControlSelected.PrjProjectFk && _.indexOf(ids,args.PackageStatusFk)>=0;
			}

			service.getRestBudget = function (entity,prcPakcageFk){
				let contractorCostControlDataService =  $injector.get('controllingGeneralcontractorCostControlDataService');
				let costControlSelected = contractorCostControlDataService.getSelected();

				projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});

				let param ={
					MdcControllingUnitFk:Math.abs(costControlSelected.Id),
					PrcPackageFk:prcPakcageFk,
					PrjProjectFk:projectContext.id
				};

				$http.post(globals.webApiBaseUrl + 'procurement/package/package/GetRestBudget',param).then(function (response) {

					if(response && response.data){
						currentPackageBudget = response.data.CurrentPackageBudget;
						otherPackagesBudget = response.data.OtherPackagesBudget;
						entity.Budget = prcPakcageFk ? response.data.CurrentPackageBudget : costControlSelected.OwnBudget+ costControlSelected.OwnBudgetShift - otherPackagesBudget;
						service.showBudgetInfo.fire(true);
					}
				});

			};
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'gcc-sales-contracts-contract-filter',
					fn: function (contract, entity) {
						return entity.PrjProjectFk;
					}
				}, {
					key: 'procurement-header-package-filter',
					serverSide:false,
					fn: function (args) {
						return filterPrcPackage(args);
					}
				}, {
					key: 'prc-package-configuration-filter',
					serverSide:true,
					fn: function () {
						return 'RubricFk = ' + $injector.get('procurementContextService').packageRubricFk;
					}
				}
			]);

			function onSelectedPackageChanged(selectedItem, entity){
				entity.StructureFk = selectedItem.StructureFk;
				entity.ConfigurationFk = selectedItem.ConfigurationFk;

				entity.Remark = selectedItem.Remark;
				entity.PackageStatusFk = selectedItem.PackageStatusFk;
				service.getRestBudget(entity,selectedItem.Id);
				service.setStructureReadOnly.fire();
				service.validateDialogConfiguration.fire(entity.ConfigurationFk);
			}
			service.onSelectedPackageChanged = onSelectedPackageChanged;

			service.getFormConfig = function getFormConfig() {
				return {
					'fid': 'controlling.generalcontractor.create.packages',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							gid: 'basicData',
							attributes: [
								'prjprojectfk', 'structurefk', 'configurationfk', 'prcpackagefk', 'code', 'description', 'budget', 'mdccontrollingunitfk','remark'
							]
						}
					],
					'rows': [
						{
							'rid': 'mdccontrollingunitfk',
							'gid': 'basicData',
							'readonly': true,
							'label': 'MdcControllingUnitFk',
							'label$tr$': 'controlling.generalcontractor.ControllingUnitFk',
							'type': 'directive',
							'model': 'MdcControllingUnitFk',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						{
							'rid': 'prjprojectfk',
							'gid': 'basicData',
							'label$tr$': 'controlling.generalcontractor.entityProjectName',
							'label': 'Project Name',
							'type': 'directive',
							'model': 'PrjProjectFk',
							'readonly': true,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookup-data-project-project-dialog',
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'initValueField': 'ProjectNo',
									'showClearButton': true
								}
							}
						},
						{
							gid: 'basicData',
							rid: 'prcpackagefk',
							model: 'PrcPackageFk',
							label: 'Package',
							label$tr$: 'controlling.generalcontractor.prcPackageFk',
							type: 'directive',
							visible: false,
							directive: 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-common-package-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'procurement-header-package-filter',
									'events': [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												if(args && args.selectedItem && args.entity){
													onSelectedPackageChanged(args.selectedItem, args.entity);
												}
											}
										}
									]
								}
							}
						},
						{
							'rid': 'code',
							'gid': 'basicData',
							'label': 'Code',
							'label$tr$': 'controlling.generalcontractor.entityCode',
							'type': 'code',
							'model': 'Code',
							'required':'true'
						},
						{
							'rid': 'description',
							'gid': 'basicData',
							'label': 'Description',
							'label$tr$': 'controlling.generalcontractor.Description',
							'type': 'description',
							'model': 'Description',
							'domainSchemaProperty': {
								'moduleSubModule': 'Procurement.Package',
								'typeName': 'PrcPackageDto',
								'propertyName': 'Description'
							}
						},
						{
							'rid': 'structurefk',
							'gid': 'basicData',
							'label$tr$': 'controlling.generalcontractor.entityPrcStructureFk',
							'label': 'Procurement Structure',
							'type': 'directive',
							'model': 'StructureFk',
							'validator': service.validateDialogStructureFk,
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'readOnly': true,
								'lookupDirective': 'basics-procurementstructure-structure-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'initValueField': 'StructureCode',
									'showClearButton': true
								}
							}
						},
						{
							'rid': 'configurationfk',
							'gid': 'basicData',
							'label': 'Configuration',
							'label$tr$': 'controlling.generalcontractor.entityConfiguration',
							'type': 'directive',
							'model': 'ConfigurationFk',
							'validator': service.validateDialogConfigurationFk,
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								'filterKey': 'prc-package-configuration-filter'
							}
						},
						{
							gid: 'basicData',
							rid: 'budget',
							model: 'Budget',
							label: 'Budget',
							label$tr$: 'controlling.generalcontractor.Budget',
							name: 'Budget',
							formatter: 'decimal',
							type: 'money',
							domain: 'numeric',
							change: function () {
								service.showBudgetInfo.fire(true);
							}
						},
						{
							gid: 'basicData',
							rid: 'maxremainingbudget',
							model: 'MaxRemainingBudget',
							label: 'Max Remaining Budget',
							label$tr$: 'controlling.generalcontractor.MaxRemainingBudget',
							name: 'MaxRemainingBudget',
							formatter: 'decimal',
							type: 'money',
							domain: 'numeric',
							readonly: true
						},
						{
							gid: 'basicData',
							rid: 'remark',
							model: 'Remark',
							label: 'Remark',
							label$tr$: 'controlling.generalcontractor.Remark',
							name: 'Remark',
							type: 'text',
							formatter: 'remark',
							domain: 'text',
							options:{
								type: 'default',
								useMaxHeight: 'false'
							}
						}
					]
				};
			};

			function IsPackageContainerExist(){
				return $injector.get('platformGridAPI').grids.exist('29caf5bfb483446e9daad4126d1f13c4');
			}

			service.showDialog = function showDialog(onCreateFn) {
				projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
				service.resetToDefault();

				let contractorCostControlDataService = $injector.get('controllingGeneralcontractorCostControlDataService');
				let costControlSelected = contractorCostControlDataService.getSelected();

				let packageDataService = $injector.get('controllingGeneralContractorPackagesDataService');
				let selectedPackage = packageDataService.getSelected();
				if(selectedPackage && IsPackageContainerExist()){
					initDataItem.GenerateType = '2';
					if(filterPrcPackage(selectedPackage)){
						initDataItem.SelectedPrcPackage = selectedPackage;
					}
				}else{
					service.getDefaultConfigurationFk();
				}

				let config = {
					title: $translate.instant ('controlling.generalcontractor.CreatePackagesStructureWizard'),
					dataItem: initDataItem,
					formConfiguration: service.getFormConfig(),
					handleOK: function handleOK(result) {
						let creationData = {
							AssetMasterFk: null,
							PrcPackageFk: result.data.PrcPackageFk,
							PrjProjectFk: result.data.PrjProjectFk,
							ConfigurationFk:  result.data.ConfigurationFk,
							Description: result.data.Description,
							MdcControllingUnitFk: Math.abs(costControlSelected.Id),
							StructureFk: result.data.StructureFk,
							ClerkPrcFk: result.data.ClerkPrcFk,
							ClerkReqFk: result.data.ClerkReqFk,
							TaxCodeFk: result.data.TaxCodeFk,
							AssetMasterList: result.data.AssetMasterList, // for filter
							packageCreationShowAssetMaster: result.data.packageCreationShowAssetMaster,
							Code: result.data.Code,
							Budget: result.data.Budget,
							Remark: result.data.Remark,
							Version: result.data.Version,
							GenerateType: result.data.GenerateType,
							IsAutoSave: true
						};
						if (_.isFunction (onCreateFn)) {
							onCreateFn (creationData);
						}
					}
				};

				platformTranslateService.translateFormConfig (config.formConfiguration);
				let headerText = $translate.instant ('controlling.generalcontractor.CreatePackagesStructureWizard');

				platformModalService.showDialog ({
					headerText: $translate.instant (headerText),
					dataItem: initDataItem,
					templateUrl: globals.appBaseUrl + 'controlling.generalcontractor/templates/create-update-create-packages-dialog-template.html',
					backdrop: false,
					width: '700px',
					uuid: '2B2A5BDF32424409BD78C99AFB1BC828'
				}).then (function (result) {
					if (result.ok) {
						config.handleOK (result);
					} else {
						if (config.handleCancel) {
							config.handleCancel (result);
						}
					}
				}
				);
			};

			return service;

		}]);
})();
