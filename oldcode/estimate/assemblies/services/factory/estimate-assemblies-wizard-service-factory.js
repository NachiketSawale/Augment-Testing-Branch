/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesWizardServiceFactory',
		['_', '$translate', '$http', '$injector', 'platformTranslateService', 'platformModalFormConfigService', 'platformSidebarWizardConfigService', 'platformRuntimeDataService', 'platformLongTextDialogService', 'estimateAssembliesAssembliesStructureService',
			function (_, $translate, $http, $injector,
				platformTranslateService, platformModalFormConfigService, platformSidebarWizardConfigService, platformRuntimeDataService, platformLongTextDialogService, estimateAssembliesAssembliesStructureService) {

				let factoryService = {};
				factoryService.createNewEstAssembliesWizardService = function createNewEstAssembliesWizardService(estimateAssembliesService, estimateAssembliesFilterService, isPrjAssembly) {

					let service = {};

					let item = {
						updateCostCodes: true,
						updateMaterials: true,
						updateAssemblyResources: true,
						updateCostTypes: false,
						updateParameter: false,
						selectUpdateScope: 1,
						UpdateMultipliersFrmPlantEstimate: false
					};

					service.updateAssemblies = function () {

						let assemblySelected = estimateAssembliesService.getSelected();
						let assembliesSelected = estimateAssembliesService.getSelectedEntities();
						let isAssemblySelected = !!assemblySelected;

						let title = 'estimate.assemblies.updateAssembliesWizard.title';
						item = {
							updateCostCodes: true,
							updateMaterials: true,
							updateAssemblyResources: true,
							updateCostTypes: false,
							updateParameter: false,
							selectUpdateScope: 1,
							updateFromMasterEA: false,
							UpdateMultipliersFrmPlantEstimate: false,
						};
						let config = {
							title: $translate.instant(title),
							dataItem: item,
							formConfiguration: {
								fid: 'estimate.assemblies.updateAssembliesWizard',
								version: '0.1.1',
								showGrouping: true,
								groups: [
									{
										gid: 'selectScope',
										header$tr$:'estimate.assemblies.updateAssembliesWizard.selectScope',
										header: 'Select Scope',
										isOpen: true,
										attributes: ['selectUpdateScope']
									},
									{
										gid: 'updateSetting',
										header$tr$:'estimate.assemblies.updateAssembliesWizard.updateSetting',
										header: 'Update Setting',
										isOpen: true,
										attributes: ['updateCostCodes', 'updateMaterials', 'updateAssemblyResources', 'updateCostTypes', 'updateParameter', 'updateFromMasterEA','UpdateMultipliersFrmPlantEstimate']
									}
								],
								rows: [
									{
										gid: 'selectScope',
										rid: 'selectUpdateScope',
										model: 'selectUpdateScope',
										type: 'radio',
										label: 'Select Scope',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.selectUpdateScope',
										options: {
											valueMember: 'value',
											labelMember: 'label',
											disabledMember : 'isReadonly',
											items: [
												{
													value: 3,
													label: 'Highlighted Assembly',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.highlightedAssembly',
													isReadonly : !isAssemblySelected
												},
												{
													value: 2,
													label: 'Current Result Set',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.currentResultSet'
												},
												{
													value: 1,
													label: 'Entire Assemblies',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.entireAssemblies'
												}]
										}
									},
									{
										gid: 'updateSetting',
										rid: 'updateCostCodes',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.updateCostCodes',
										type: 'boolean',
										model: 'updateCostCodes',
										sortOrder: 1,
										change: onFieldChanged
									},
									{
										gid: 'updateSetting',
										rid: 'updateMaterials',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.updateMaterials',
										type: 'boolean',
										model: 'updateMaterials',
										sortOrder: 2,
										change: onFieldChanged
									},
									{
										gid: 'updateSetting',
										rid: 'updateAssemblyResources',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.updateAssemblyResources',
										type: 'boolean',
										model: 'updateAssemblyResources',
										sortOrder: 3
									},
									{
										gid: 'updateSetting',
										rid: 'updateCostTypes',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.updateCostTypes',
										type: 'boolean',
										model: 'updateCostTypes',
										sortOrder: 4
									},
									{
										gid: 'updateSetting',
										rid: 'updateParameter',
										label$tr$: isPrjAssembly ? 'estimate.assemblies.updateAssembliesWizard.updateParameter' : 'estimate.assemblies.updateAssembliesWizard.updateParameterFromCustomizing',
										type: 'boolean',
										model: 'updateParameter',
										sortOrder: 5
									},
									{
										gid: 'updateSetting',
										rid: 'updateFromMasterEA',
										label$tr$: 'estimate.main.updateProjectPlantAssemblies',
										type: 'boolean',
										model: 'updateFromMasterEA',
										sortOrder: 6
									},
									{
										gid: 'updateSetting',
										rid: 'UpdateMultipliersFrmPlantEstimate',
										label: 'Update Price Condition Multipliers from Master',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.UpdateMultipliersFrmPlantEstimate'),
										type: 'boolean',
										model: 'UpdateMultipliersFrmPlantEstimate',
										sortOrder: 7
									},
								]
							},
							dialogOptions: {
								disableOkButton: function (/* modalOptions */) {
									return !item.updateCostCodes && !item.updateMaterials && !item.updateAssemblyResources && !item.updateParameter && !item.updateFromMasterEA;
								}
							},
							handleOK: function handleOK(result) {
								if (result && result.ok && result.data) {
									let promise = isPrjAssembly ? $injector.get('projectMainService').update() : estimateAssembliesService.update();
									promise.then(function () {
										result.data.filters = estimateAssembliesFilterService.getFilterRequest();
										if (assemblySelected) {
											result.data.assemblyId = assemblySelected.Id;
											result.data.assemblyIds = _.map(assembliesSelected, 'Id');
											result.data.assemblyHeaderId = assemblySelected.EstHeaderFk;
										}

										if (isPrjAssembly){
											result.data.IsPrjAssembly = true;
											let project =  $injector.get('projectMainService').getSelected();
											result.data.ProjectId = project ? project.Id : 0;

											// filter out the assemly which refer to the version job
											if(result.data.selectUpdateScope === 3){
												assembliesSelected  =  _.filter(assembliesSelected,function (d) {
													return !d.readOnlyByJob;
												});
												result.data.assemblyIds = _.map(assembliesSelected, 'Id');
											}
										}

										$http.post(globals.webApiBaseUrl + 'estimate/main/resource/updateestimateassemblyresources', result.data).then(function (response) {
											if (isPrjAssembly){
												$injector.get('projectMainService').refresh();
											} else {
												// check the assembly validation resources
												if (response && response.data && response.data.Assemblies2Validation){
													let message = $translate.instant('estimate.assemblies.correctWarningResource');
													var assemblies2Validation = response.data.Assemblies2Validation;
													for (let i=0; i<assemblies2Validation.length; i++){
														let strContent = $translate.instant('estimate.assemblies.warningAssemblyResource', {
															value0: assemblies2Validation[i].LineItemCode,
															value1: assemblies2Validation[i].ResourceCode
														});

														let number = i + 1;
														message += '\r\n' + number + '.' + strContent;
													}

													let modalOptions = {
														headerTextKey: 'estimate.assemblies.warningResourceTitle',
														bodyTextKey: message,
														showOkButton: true,
														iconClass: 'ico-warning'
													};
													$injector.get('platformModalService').showDialog(modalOptions);
												}

												estimateAssembliesService.refresh();
											}
										});
									});
								}
							}
						};
						platformTranslateService.translateFormConfig(config.formConfiguration);
						config.scope = platformSidebarWizardConfigService.getCurrentScope();
						platformModalFormConfigService.showDialog(config);
					};

					service.updateAssemblyStructure = function () {

						let assemblySelected = estimateAssembliesService.getSelected();
						let assembliesSelected = estimateAssembliesService.getSelectedEntities();
						let isAssemblySelected = !!assemblySelected;

						let title = 'estimate.assemblies.updateAssemblyStructureWizard.title';
						item = {
							updateCostCodes: true,
							updateMaterials: true,
							updateAssemblyResources: true,
							updateCostTypes: false,
							updateParameter: false,
							selectUpdateScope : 1,
							updateCostGroup: 0
						};
						let config = {
							title: $translate.instant(title),
							dataItem: item,
							formConfiguration: {
								fid: 'estimate.assemblies.updateAssembliesWizard',
								version: '0.1.1',
								showGrouping: true,
								groups: [
									{
										gid: 'selectScope',
										header$tr$:'estimate.assemblies.updateAssembliesWizard.selectScope',
										header: 'Select Scope',
										isOpen: true,
										attributes: ['selectUpdateScope']
									},
									{
										gid: 'updateOption',
										header$tr$:'estimate.assemblies.updateAssembliesWizard.updateOption',
										header: 'Update Cost Group',
										isOpen: true,
										attributes: ['updateOption']
									}
								],
								rows: [
									{
										gid: 'selectScope',
										rid: 'selectUpdateScope',
										model: 'selectUpdateScope',
										type: 'radio',
										label: 'Select Scope',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.selectUpdateScope',
										options: {
											valueMember: 'value',
											labelMember: 'label',
											disabledMember : 'isReadonly',
											items: [
												{
													value: 3,
													label: 'Highlighted Assembly',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.highlightedAssembly',
													isReadonly : !isAssemblySelected
												},
												{
													value: 2,
													label: 'Current Result Set',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.currentResultSet'
												},
												{
													value: 1,
													label: 'Entire Assemblies',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.entireAssemblies'
												}]
										}
									},
									{
										gid: 'updateOption',
										rid: 'updateCostGroup',
										model: 'updateCostGroup',
										type: 'boolean',
										label: 'Update Cost Group',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.updateCostGroup',
									},
									{
										gid: 'updateOption',
										rid: 'updateDescription',
										model: 'updateDescription',
										type: 'boolean',
										label: 'Update Description',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.updateDescription',
									}
								]
							},
							dialogOptions: {
								disableOkButton: function (/* modalOptions */) {
									return !item.updateCostCodes && !item.updateMaterials && !item.updateAssemblyResources && !item.updateParameter;
								}
							},
							handleOK: function handleOK(result) {
								if (result && result.ok && result.data) {
									let promise = isPrjAssembly ? $injector.get('projectMainService').update() : estimateAssembliesService.update();
									promise.then(function () {
										result.data.filters = estimateAssembliesFilterService.getFilterRequest();
										if (assemblySelected) {
											result.data.assemblyId = assemblySelected.Id;
											result.data.assemblyIds = _.map(assembliesSelected, 'Id');
											result.data.assemblyHeaderId = assemblySelected.EstHeaderFk;
										}

										if (isPrjAssembly){
											result.data.IsPrjAssembly = true;
											let project =  $injector.get('projectMainService').getSelected();
											result.data.ProjectId = project ? project.Id : 0;
										}

										$http.post(globals.webApiBaseUrl + 'estimate/main/resource/updatprojectassemblystructure', result.data).then(function (/* result */) {
											isPrjAssembly ? $injector.get('projectMainService').refresh() : estimateAssembliesService.refresh();
										});
									});
								}
							}
						};
						platformTranslateService.translateFormConfig(config.formConfiguration);
						config.scope = platformSidebarWizardConfigService.getCurrentScope();
						platformModalFormConfigService.showDialog(config);
					};

					service.importAssemblies = function(){
						$injector.get('projectAssemblyMainService').setIsPrjAssembly(isPrjAssembly);
						let categoryId = 0;
						let structureService = estimateAssembliesService.getStructureService();
						if(structureService) {
							let selectedCatalog = structureService.getSelected();
							while (selectedCatalog) {
								categoryId = selectedCatalog.Id;
								selectedCatalog = _.find(structureService.getList(), {Id: selectedCatalog.EstAssemblyCatFk});
							}
						}
						let projectId = null;
						if(isPrjAssembly) {
							let project = $injector.get('projectMainService').getSelected();
							projectId = project ? project.Id : null;
							if(!projectId) {
								let message = $translate.instant('estimate.assemblies.importAssembliesWizard.importFailed');
								let modalOptions = {
									headerTextKey: 'estimate.assemblies.importAssembliesWizard.importFailedTitle',
									bodyTextKey: message,
									showOkButton: true,
									iconClass: 'ico-warning'
								};
								return $injector.get('platformModalService').showDialog(modalOptions);
							}
						}
						let dataItem = {
							FileData: null,
							IsSelectCategoryAsRoot: false,
							IsOverride: false,
							CategoryId: categoryId,
							MaterialId: null,
							IsFileSelected: false,
							ProjectId: projectId
						};
						let config = getFormConfig(dataItem);
						platformTranslateService.translateFormConfig(config.formConfiguration);
						config.scope = platformSidebarWizardConfigService.getCurrentScope();
						return platformModalFormConfigService.showDialog(config).then(function(result){
							if (result && result.ok && result.data) {
								return asyncImportAssemblies(result.data);
							}  else {
								return Promise.reject({message: 'No data to import'});
							}
						});
					};

					service.enableAssemblyCategory = enableAssemblyCategory();

					service.disableAssemblyCategory = disableAssemblyCategory();

					function enableAssemblyCategory() {
						return function () {
							let modalService = $injector.get('platformModalService');
							let title = $translate.instant('estimate.assemblies.enableAssemblyCategory.title');
							let bodyText = $translate.instant('estimate.assemblies.enableAssemblyCategory.message');

							let modalOptions = {
								headerText: title,
								bodyText: bodyText,
								iconClass: 'ico-info',
								showCancelButton: true,
								showOkButton: true,
							};

							modalService.showDialog(modalOptions).then(function (result) {
								if (result.ok) {
									let selectedEntities = estimateAssembliesAssembliesStructureService.getSelectedEntities();

									if (!selectedEntities?.length) return;

									let selectedCategoryIds = selectedEntities.map(entity => entity.Id);
									let codeList = selectedEntities.map(entity => entity.Code).join(', ');
									let successMessage = $translate.instant('estimate.assemblies.enableAssemblyCategory.enableDone', { code: codeList });

									$http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/enabledisableassemblycategory', {
										CategoryIds: selectedCategoryIds,
										IsEnableAssemblyCategory: true
									})
										.then(function (response) {
											if (response) {
												let service = $injector.get('estimateAssembliesAssembliesStructureService');
												service.updateList(response.data);
												modalService.showDialog({
													headerText: title,
													bodyText: successMessage,
													iconClass: 'ico-info',
													showOkButton: true,
												});
											}
										})
										.catch(function (error) {
											modalService.showMsgBox('cloud.common.errorDialogTitle', 'cloud.common.errorMessage', 'ico-error');
										});
								}
							});
						};
					}

					function disableAssemblyCategory() {
						return function () {
							let modalService = $injector.get('platformModalService');
							let selectedCategory = estimateAssembliesAssembliesStructureService.getSelected();

							if (!selectedCategory) return;

							if (!selectedCategory.IsLive) {
								let title = $translate.instant('estimate.assemblies.disableAssemblyCategory.title');
								let bodyText = $translate.instant('estimate.assemblies.disableAssemblyCategory.alreadyDisabledMessage', { code: selectedCategory.Code });

								modalService.showDialog({
									headerText: title,
									bodyText: bodyText,
									iconClass: 'ico-info',
									showOkButton: true
								});
								return;
							}

							let title = $translate.instant('estimate.assemblies.disableAssemblyCategory.title');
							let bodyText = $translate.instant('estimate.assemblies.disableAssemblyCategory.message');

							let modalOptions = {
								headerText: title,
								bodyText: bodyText,
								iconClass: 'ico-info',
								showCancelButton: true,
								showOkButton: true,
							};

							modalService.showDialog(modalOptions).then(function (result) {
								if (result.ok) {
									let selectedEntities = estimateAssembliesAssembliesStructureService.getSelectedEntities();

									if (!selectedEntities?.length) return;

									let selectedCategoryIds = selectedEntities.map(entity => entity.Id);
									let codeList = selectedEntities.map(entity => entity.Code).join(', ');
									let successMessage = $translate.instant('estimate.assemblies.disableAssemblyCategory.disableDone', { code: codeList });

									$http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/enabledisableassemblycategory', {
										categoryIds: selectedCategoryIds,
										isEnableAssemblyCategory: false
									})
										.then(function (response) {
											if (response) {
												let service = $injector.get('estimateAssembliesAssembliesStructureService');
												service.updateList(response.data);
												estimateAssembliesAssembliesStructureService.markItemAsModified(selectedEntities);
												modalService.showDialog({
													headerText: title,
													bodyText: successMessage,
													iconClass: 'ico-info',
													showOkButton: true,
												});
											}
										})
										.catch(function () {
											modalService.showMsgBox('cloud.common.errorDialogTitle', 'cloud.common.errorMessage', 'ico-error');
										});
								}
							});
						};
					}

					function getFormConfig(dataItem){
						let title = 'estimate.assemblies.importAssembliesWizard.title';
						let config =  {
							title: $translate.instant(title),
							dataItem: dataItem,
							formConfiguration: {
								fid: 'estimate.assemblies.importAssembliesWizard',
								version: '0.1.1',
								showGrouping: true,
								groups: [
									{
										gid: 'baseGroup',
										header: 'Basic Setting',
										header$tr$: 'estimate.assemblies.importAssembliesWizard.baseGroup',
										visible: true,
										isOpen: true,
										attributes: []
									}
								],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'FileData',
										label: 'Please Select File',
										label$tr$: 'estimate.assemblies.importAssembliesWizard.selectFile',
										type: 'directive',
										model: 'FileData',
										directive: 'estimate-assemblies-wizard-import-control',
										options: {},
										visible: true,
										required: true,
										sortOrder: 1
									},
									{
										gid: 'baseGroup',
										rid: 'IsSelectCategoryAsRoot',
										label: 'Select Assemblies Category as Root Element',
										label$tr$: 'estimate.assemblies.importAssembliesWizard.selectCategoryAsRoot',
										type: 'boolean',
										model: 'IsSelectCategoryAsRoot',
										sortOrder: 2,
										visible: true,
										change: function(entity){
											let row = config.formConfiguration.rows.find(e=>e.rid==='CategoryId');
											if(row){
												row.visible = entity.IsSelectCategoryAsRoot;
											}
											let scope = platformSidebarWizardConfigService.getCurrentScope();
											if(scope) {
												scope.$broadcast('form-config-updated');
											}
										}
									},
									{
										gid: 'baseGroup',
										rid: 'CategoryId',
										label: 'Select Assemblies Category',
										label$tr$: 'estimate.assemblies.importAssembliesWizard.selectCategory',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'estimate-assemblies-category-root-lookup',
											descriptionMember: 'DescriptionInfo.Translated',
											lookupOptions: {
												showClearButton: true,
												isRootCategory:true
											}
										},
										model: 'CategoryId',
										sortOrder: 3,
										visible: false
									},
									{
										gid: 'baseGroup',
										rid: 'MaterialId',
										label: 'Select Material Catalog',
										label$tr$: 'estimate.assemblies.importAssembliesWizard.selectMaterial',
										type: 'directive',
										options: {
											lookupDirective: 'estimate-main-material-catalog-lookup',
											descriptionMember: 'DescriptionInfo.Translated',
											lookupOptions: {
												showClearButton: true
											}
										},
										model: 'MaterialId',
										directive: 'basics-lookupdata-lookup-composite',
										sortOrder: 3,
										visible: true,
									},
									{
										gid: 'baseGroup',
										rid: 'IsOverride',
										label: 'Override Existing Assemblies',
										label$tr$: 'estimate.assemblies.importAssembliesWizard.overwriteExistingAssemblies',
										type: 'boolean',
										model: 'IsOverride',
										sortOrder: 4,
										visible: false
									}
								]
							},
							dialogOptions: {
								disableOkButton: function disableOkButton() {
									return !config.dataItem.IsFileSelected;
								}
							}
						};
						return config;
					}

					function asyncImportAssemblies(dataItem) {
						return $http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'estimate/main/lineitem/importassemblies',
							headers: {'Content-Type': undefined},
							transformRequest: function (data) {
								let formData = new FormData();
								// formData.append('model', data.qtoHeaderId);
								formData.append('file', data.FileData);
								formData.append('IsSelectCategoryAsRoot', data.IsSelectCategoryAsRoot);
								formData.append('IsOverride', data.IsOverride);
								formData.append('CategoryId', data.CategoryId);
								formData.append('ProjectId', data.ProjectId);
								formData.append('MaterialId', data.MaterialId);
								return formData;
							},
							data: dataItem
						}).then(function (response) {
							if (response && response.data) {
								let messages = [];
								let errorMessages = [];
								let pathTr = 'estimate.assemblies.importAssembliesWizard.';
								let titleTr = pathTr+ (response.data.IsSuccess ? 'importSuccessTitle' : 'importFailedTitle');
								let wh = '50%';
								if(response.data.IsSuccess) {
									if (response.data.ReportList && response.data.ReportList.length > 0) {
										_.forEach(response.data.ReportList, rep => {
											messages.push(`Import ${rep.ResourceName}: Total(${rep.Total}),Success(${rep.SuccessTotal}),error(${rep.FailTotal})`);
											errorMessages =  [...errorMessages, ...rep.Details];
										});
										messages = [...messages,...errorMessages];
									}
								}else{
									messages.push(response.data.Message);
									wh = '20%';
								}
								if(errorMessages.length===0) {
									wh = '20%';
								}
								platformLongTextDialogService.showDialog({
									headerText$tr$: titleTr,
									codeMode: true,
									hidePager: true,
									width: wh,
									height: wh,
									dataSource: new function () {
										var infoText = $translate.instant(titleTr)+ '\n';
										if (_.some(messages)) {
											infoText += messages.join('\n');
										}
										platformLongTextDialogService.LongTextDataSource.call(this);
										this.current = infoText;
									}
								});
								if(response.data.IsSuccess) {
									if (isPrjAssembly) {
										$injector.get('projectMainService').refresh();
									} else {
										estimateAssembliesService.refresh();
									}
								}
							}
						});
					}

					service.transferCostCodeOrMaterial = function (){

						let assemblySelected = estimateAssembliesService.getSelected();
						let assembliesSelected = estimateAssembliesService.getSelectedEntities();
						let isAssemblySelected = !!assemblySelected;
						let costCdoes=[];
						let materials=[];

						let title = 'estimate.assemblies.transferCostcodeOrMaterialWizard.title';
						let item = {
							selectUpdateScope : 1,
							selectTransferScope : 1,
							costCdoes: costCdoes,
							materials: materials
						};
						let config = {
							title: $translate.instant(title),
							dataItem: item,
							formConfiguration: {
								fid: 'estimate.assemblies.updateAssembliesWizard',
								version: '0.1.1',
								showGrouping: true,
								groups: [
									{
										gid: 'selectScope',
										header$tr$:'estimate.assemblies.transferCostcodeOrMaterialWizard.selectScope',
										header: 'Select Scope',
										isOpen: true,
										attributes: ['selectUpdateScope']
									},
									{
										gid: 'updateSetting',
										header$tr$:'estimate.assemblies.transferCostcodeOrMaterialWizard.updateSetting',
										header: 'Basic Setting',
										isOpen: true,
										attributes: ['selectTransferScope']
									},
									{
										gid: 'costCdoeGrid',
										header$tr$:'estimate.assemblies.transferCostcodeOrMaterialWizard.transferCostCode',
										header: 'Cost Codes',
										isOpen: true,
									},
									{
										gid: 'materialGrid',
										header$tr$:'estimate.assemblies.transferCostcodeOrMaterialWizard.transferMaterial',
										header: 'material',
										isOpen: true,
									}
								],
								rows: [
									{
										gid: 'selectScope',
										rid: 'selectUpdateScope',
										model: 'selectUpdateScope',
										type: 'radio',
										label: 'Select Scope',
										label$tr$: 'estimate.assemblies.updateAssembliesWizard.selectUpdateScope',
										options: {
											valueMember: 'value',
											labelMember: 'label',
											disabledMember : 'isReadonly',
											items: [
												{
													value: 3,
													label: 'Highlighted Assembly',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.highlightedAssembly',
													isReadonly : !isAssemblySelected
												},
												{
													value: 2,
													label: 'Current Result Set',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.currentResultSet'
												},
												{
													value: 1,
													label: 'Entire Assemblies',
													label$tr$: 'estimate.assemblies.updateAssembliesWizard.entireAssemblies'
												}],
										},
										change: function (entity) {

											let data={};
											data.filters = estimateAssembliesFilterService.getFilterRequest();
											data.selectUpdateScope = item.selectUpdateScope;
											if(item.selectUpdateScope === 1){
												data.filters.furtherFilters=[];
											}
											else if(item.selectUpdateScope === 2){
												let assemblysCurrentData = $injector.get('platformGridAPI').items.filtered(estimateAssembliesService.getGridId());
												if(assemblysCurrentData){
													data.TransferCostCodeIds = _.compact(_.map(assemblysCurrentData, 'TransferMdcCostCodeFk'));
													data.TransferMaterialIds = _.compact(_.map(assemblysCurrentData, 'TransferMdcMaterialFk'));
												}
											}
											else if(item.selectUpdateScope === 3){
												if (assemblySelected) {
													data.TransferCostCodeIds = _.compact(_.map(assembliesSelected, 'TransferMdcCostCodeFk'));
													data.TransferMaterialIds = _.compact(_.map(assembliesSelected, 'TransferMdcMaterialFk'));
												}
											}

											$http.post(globals.webApiBaseUrl + 'estimate/assemblies/GetAssemblyTransferData',data).then(function(response){
												item.costCdoes = response.data.CostCodeTransferEntities;
												item.materials = response.data.MaterialTransferEntitys;
												addDataShowColumn(item.costCdoes);
												addDataShowColumn(item.materials);
												updateCostAndMaterialPriceLists();
											});
										},
									},
									{
										gid: 'updateSetting',
										rid: 'selectTransferScope',
										model: 'selectTransferScope',
										type: 'radio',
										label: 'Basic Setting',
										label$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.updateSetting',
										options: {
											valueMember: 'value',
											labelMember: 'label',
											disabledMember : 'isReadonly',
											items: [
												{
													value: 1,
													label: 'Transfer to Base',
													label$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.TransferToBase'
												},
												{
													value: 2,
													label: 'Transfer to latest Price Version',
													label$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.transferToPriceList'
												}]
										},
										change: function (entity) {
											updateCostAndMaterialPriceLists();
										}
									},
									{
										gid: 'costCdoeGrid',
										rid: 'costCdoes',
										type: 'directive',
										directive: 'estimate-assemblies-transfer-cost-code-grid',
										model: 'costCdoes',
										visible: true,
										sortOrder: 100
									},
									{
										gid: 'materialGrid',
										rid: 'materials',
										type: 'directive',
										directive: 'estimate-assemblies-transfer-material-grid',
										model: 'materials',
										visible: true,
										sortOrder: 100
									}
								]
							},
							dialogOptions: {

							},
							handleOK: function handleOK(result) {
								if (result && result.ok && result.data) {
									let data={};
									data.selectUpdateScope = item.selectUpdateScope;
									data.isUpdateBase = item.selectTransferScope === 1;
									data.CostCodeTransferEntities = item.costCdoes.filter(function (d) {
										return d.IsSelected && d.MdcPriceListFK;
									});
									data.MaterialTransferEntitys = item.materials.filter(function (d) {
										return d.IsSelected && d.MdcPriceListFK;
									});

									if(item.selectUpdateScope===3) {
										if (assemblySelected) {
											const costCodes = _.map(assembliesSelected, 'TransferMdcCostCodeFk');
											const materialIds = _.map(assembliesSelected, 'TransferMdcMaterialFk');

											data.TransferCostCodeIds = costCodes[0] === null?[]:costCodes;
											data.TransferMaterialIds = materialIds[0] === null?[]:materialIds;

										}
									}else {
										data.filters = estimateAssembliesFilterService.getFilterRequest();
									}
									$http.post(globals.webApiBaseUrl + 'estimate/assemblies/UpdateAssemblyTransferRate',data).then(function(response){
										let message = $translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.resultMessage');
										let modalOptions = {
											headerTextKey: 'estimate.assemblies.transferCostcodeOrMaterialWizard.title',
											bodyTextKey: message,
											showOkButton: true,
											iconClass: 'ico-info'
										};
										return $injector.get('platformModalService').showDialog(modalOptions);
									});
								}
							}
						};
						if(item.selectUpdateScope){
							let data={};
							data.filters = estimateAssembliesFilterService.getFilterRequest();
							if(item.selectUpdateScope === 1){
								data.filters.furtherFilters=[];
							}
							data.selectUpdateScope = item.selectUpdateScope;
							 $http.post(globals.webApiBaseUrl + 'estimate/assemblies/GetAssemblyTransferData',data).then(function(response){
								 item.costCdoes = response.data.CostCodeTransferEntities;
								 item.materials = response.data.MaterialTransferEntitys;
								 addDataShowColumn(item.costCdoes);
								 addDataShowColumn(item.materials);
								 platformTranslateService.translateFormConfig(config.formConfiguration);
								 config.scope = platformSidebarWizardConfigService.getCurrentScope();
								 platformModalFormConfigService.showDialog(config);
							});
						}
						function addDataShowColumn(entitys) {
							entitys.forEach(function (entity) {
								if(entity){
									entity.PriceVersionListFk=-1;
									entity.PriceList='';
								}
							});
						};
						function updateCostAndMaterialPriceLists() {
							if(item.selectTransferScope === 1){
								item.costCdoes.forEach(function (entity) {
									entity.MdcPriceListFK=-1;
									entity.CostCodePriceVerFk=-1;
									entity.PriceList='';
								});
								item.materials.forEach(function (entity) {
									entity.MdcPriceListFK=-1;
									entity.MaterialPriceVerFk=-1;
									entity.PriceList='';
								});
							}else
							{
								item.costCdoes.forEach(function (entity) {
									if(entity && entity.PriceListForUpdate.length>0){
										entity.CostCodePriceVerFk = entity.PriceListForUpdate[0].PriceVersionFk;
										entity.MdcPriceListFK = entity.PriceListForUpdate[0].Id;
										entity.PriceList= entity.PriceListForUpdate[0].PriceVersion;
									}
								});
								item.materials.forEach(function (entity) {
									if (entity.MaterialPriceList?.length > 0) {
										entity.MaterialPriceVerFk = entity.MaterialPriceList[0].PriceVersionFk;
										entity.MdcPriceListFK = entity.MaterialPriceList[0].Id;
										entity.PriceList = entity.MaterialPriceList[0].PriceList;
									}
								});
							}
							$injector.get('platformGridAPI').items.data('f9h772c1e65047e432k1959e8563d1fb', item.costCdoes);
							$injector.get('platformGridAPI').grids.refresh('f9h772c1e65047e432k1959e8563d1fb');
							$injector.get('platformGridAPI').items.data('w9h873c1e65047k432k1959e8533d2fo', item.materials);
							$injector.get('platformGridAPI').grids.refresh('w9h873c1e65047k432k1959e8533d2fo');
						}
					}

					return service;

					function onFieldChanged(entity/* , model, row */) {
						if (!entity.updateCostCodes && !entity.updateMaterials) {
							entity.updateCostTypes = false;
						}
						platformRuntimeDataService.readonly(entity, [{
							field: 'updateCostTypes',
							readonly: !entity.updateCostCodes && !entity.updateMaterials
						}]);
					}

				};

				return factoryService;
			}]);
})(angular);
