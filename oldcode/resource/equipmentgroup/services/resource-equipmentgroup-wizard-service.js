(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'resource.equipment';

	angular.module(moduleName).factory('resourceEquipmentGroupSidebarWizardService', ['_', '$http', '$translate', '$injector', '$q', 'moment', 'platformSidebarWizardCommonTasksService',
		'resourceEquipmentGroupDataService', 'platformContextService', 'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService','resourceEquipmentPlantDataService', 'platformModuleNavigationService', 'platformModalService', 'platformDialogService', 'basicsCompanyNumberGenerationInfoService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
		'platformWizardDialogService', 'basicsCommonWizardHelper',

		function (_, $http, $translate, $injector, $q, moment, platformSidebarWizardCommonTasksService, resourceEquipmentGroupDataService, platformContextService, basicsLookupdataConfigGenerator, platformTranslateService, platformModalFormConfigService, resourceEquipmentPlantDataService, platformModuleNavigationService, platformModalService, platformDialogService, basicsCompanyNumberGenerationInfoService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService,
				  platformWizardDialogService,basicsCommonWizardHelper) {

			let service = {};

			var disableGroup = function disableGroup() {
				return platformSidebarWizardCommonTasksService.provideDisableInstance(resourceEquipmentGroupDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
					'resource.equipmentgroup.disableDone', 'resource.equipmentgroup.alreadyDisabled', 'code', 1);
			};
			service.disableGroup = disableGroup().fn;

			var enableGroup = function enableGroup() {
				return platformSidebarWizardCommonTasksService.provideEnableInstance(resourceEquipmentGroupDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
					'resource.equipmentgroup.enableDone', 'resource.equipmentgroup.alreadyEnabled', 'code', 2);
			};
			service.enableGroup = enableGroup().fn;

			async function validatePlantGroupForCreateWizard(entity, value, model, defaultPlantKind, defaultPlantType) {
				const plantValService = $injector.get('resourceEquipmentPlantValidationService');
				if(_.isNil(value)) {
					return plantValService.validatePlantGroupFk(entity, value, model);
				}
				plantValService.validatePlantGroupFk(entity, value, model);
				let selectedPlantGroupFromPlant = await getSelectedPlantGroupFromPlant(value);
				if (selectedPlantGroupFromPlant) {
					entity.KindFk = selectedPlantGroupFromPlant.DefaultPlantKindFk ?? defaultPlantKind.Id;
					entity.TypeFk = selectedPlantGroupFromPlant.DefaultPlantTypeFk ?? defaultPlantType.Id;
					entity.Description = selectedPlantGroupFromPlant.DescriptionInfo.Description;
					if(!_.isNil(selectedPlantGroupFromPlant.DefaultProcurementStructureFk)) {
						entity.ProcurementStructureFk = selectedPlantGroupFromPlant.DefaultProcurementStructureFk;
					}
				}

				return plantValService.asyncValidatePlantGroupFk(entity, value, model).then(function(result) {
					if(entity.HasToGenerateCode) {
						platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
					}

					return result;
				});
			}

			service.createPlant = async function createPlant(isFromPlantCreationButton) {
				if (typeof isFromPlantCreationButton !== 'boolean') {
					isFromPlantCreationButton = false;
				}

				let isValid;
				let modalCreateConfig = null;
				const title = $translate.instant('resource.equipmentgroup.createPlant');
				let selectedPlantGroup = resourceEquipmentGroupDataService.getSelected();
				let plantGroupIds = [];
				if(selectedPlantGroup) {
					plantGroupIds.push(selectedPlantGroup.Id);
				}
				let defaultPlantKind = await getDefaultPlantKind();
				let defaultPlantType = await getDefaultPlantType();

				isValid = validatePlantGroups(plantGroupIds, isFromPlantCreationButton);

				if (isValid) {
					platformModalService.showDialog({
						headerTextKey: 'Information about default values',
						iconClass: 'ico-info',
						bodyTextKey: $translate.instant('resource.equipmentgroup.defaultValuesInfo'),
						showOkButton: true
					}).then(async function () {
						// Once the information dialog is closed, continue with the rest of the logic
						modalCreateConfig = {
							title: title,
							dataItem: {
								Code: null,
								GroupFk: selectedPlantGroup ? selectedPlantGroup.Id : null,
								KindFk: selectedPlantGroup && selectedPlantGroup.DefaultPlantKindFk ? selectedPlantGroup.DefaultPlantKindFk : defaultPlantKind.Id,
								TypeFk: selectedPlantGroup && selectedPlantGroup.DefaultPlantTypeFk ? selectedPlantGroup.DefaultPlantTypeFk : defaultPlantType.Id,
								Description: selectedPlantGroup ? selectedPlantGroup.DescriptionInfo.Description : null,
								ProcurementStructureFk: selectedPlantGroup ? selectedPlantGroup.DefaultProcurementStructureFk : null,
								HasToGenerateCode: false,
								Version: 0
							},
							formConfiguration: {
								fid: 'resource.equipmentgroup.createPlant',
								version: '1.0.0',
								showGrouping: false,
								groups: [{ gid: 'baseGroup' }],
								rows: [
									basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
										{
											dataServiceName: 'resourceEquipmentGroupLookupDataService',
											cacheEnable: true,
											additionalColumns: false,
											showClearButton: true
										},
										{
											gid: 'baseGroup',
											rid: 'plantgroup',
											label: 'Equipment Group',
											label$tr$: 'resource.equipmentgroup.entityResourceEquipmentGroup',
											type: 'integer',
											model: 'GroupFk',
											required: true,
											asyncValidator: async function (entity, value, model) {
												return validatePlantGroupForCreateWizard(entity, value, model, defaultPlantKind, defaultPlantType);
											},
											sortOrder: 0
										}),
									{
										gid: 'baseGroup',
										rid: 'code',
										model: 'Code',
										label$tr$: 'cloud.common.entityCode',
										type: 'code',
										required: true,
										asyncValidator: async function (entity, value, model) {
											const plantValService = $injector.get('resourceEquipmentPlantValidationService');

											return plantValService.asyncValidateCode(entity, value, model);
										},
										sortOrder: 1
									},
									basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.plantkind', '',
										{
											gid: 'baseGroup',
											rid: 'kind',
											label: 'Plant Kind',
											label$tr$: 'basics.customize.plantkind',
											type: 'integer',
											model: 'KindFk',
											required: true,
											sortOrder: 2
										}, false, { required: false }),
									basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.planttype', '',
										{
											gid: 'baseGroup',
											rid: 'type',
											label: 'Type',
											label$tr$: 'basics.customize.planttype',
											type: 'integer',
											model: 'TypeFk',
											required: true,
											sortOrder: 3
										}, false, { required: false }),
									{
										gid: 'baseGroup',
										rid: 'structure',
										label: 'Structure',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupOptions: { showClearButton: true },
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'prcstructure',
												displayMember: 'Code'
											},
											lookupDirective: 'basics-procurementstructure-structure-dialog',
											descriptionMember: 'DescriptionInfo.Translated'
										},
										model: 'ProcurementStructureFk',
										required: true,
										sortOrder: 5
									},
									{
										gid: 'baseGroup',
										rid: 'description',
										model: 'Description',
										label$tr$: 'cloud.common.entityDescription',
										type: 'description',
										sortOrder: 6
									}
								]
							},
							handleOK: async function handleOK(result) {
								if (result.data.GroupFk) {
									plantGroupIds = [result.data.GroupFk];
								}

								let data = {
									PlantGroupIds: plantGroupIds,
									Code: result.data.HasToGenerateCode ? null : result.data.Code,
									HasToGenerateCode: result.data.HasToGenerateCode,
									PlantKind: result.data.KindFk,
									PlantType: result.data.TypeFk,
									Description: result.data.Description,
									ProcurementStructure: result.data.ProcurementStructureFk
								};

								$http.post(globals.webApiBaseUrl + 'resource/equipment/plant/createwizardforplant', data)
									.then(function (response) {
										if (response && response.data) {
											let dataItem = { Code: response.data.Code };
											const customButtons = typeof response.data.Code === 'undefined' || response.data.Code === null ? [] : [
												{
													id: 'goto',
													caption: 'Go To Plant',
													fn: function (button, event, closeFn) {
														let navigator = platformModuleNavigationService.getNavigator('resource.equipment');
														platformModuleNavigationService.navigate(navigator, dataItem, 'Code');
														closeFn();
													}
												}
											];

											return platformModalService.showDialog({
												headerTextKey: 'Create Plant',
												iconClass: 'ico-info',
												bodyTextKey: response.data.Message,
												showCancelButton: false,
												customButtons
											});
										}
										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
									});
							},
							dialogOptions: {
								disableOkButton: function () {
									return validationCheckForCreatePlant(modalCreateConfig);
								},
							},
						};

						if (selectedPlantGroup) {
							let infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('resourceEquipmentGroupDataService', 30);
							await infoService.load();

							let modelCode = modalCreateConfig.formConfiguration.rows.find(row => row.rid === 'code')?.model;

							if (infoService.hasToGenerateForRubricCategory(selectedPlantGroup.RubricCategoryFk)) {
								modalCreateConfig.dataItem.Code = infoService.provideNumberDefaultText(selectedPlantGroup.RubricCategoryFk, selectedPlantGroup.Code);
								modalCreateConfig.dataItem.HasToGenerateCode = true;

								// Make the Code field readonly if needed
								platformRuntimeDataService.readonly(modalCreateConfig.dataItem, [{ field: modelCode, readonly: true }]);
							} else {
								modalCreateConfig.dataItem.Code = '';
								platformRuntimeDataService.readonly(modalCreateConfig.dataItem, [{ field: modelCode, readonly: false }]);
							}
						} else {
							validatePlantGroupForCreateWizard(modalCreateConfig.dataItem, null, 'GroupFk', defaultPlantKind, defaultPlantType).then(function(res){
								platformRuntimeDataService.applyValidationResult(res, modalCreateConfig.dataItem, 'GroupFk');
							});
						}

						platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
						platformModalFormConfigService.showDialog(modalCreateConfig);
					});
				}
			};

			async function getDefaultPlantKind() {
				return $injector.get('basicsLookupdataSimpleLookupService').getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'basics.customize.plantkind',
				}).then(function (response) {
					return _.minBy(response, function (item) {
						return  item.isDefault && item.sorting;
					});
				});
			}

			async function getDefaultPlantType() {
				return $injector.get('basicsLookupdataSimpleLookupService').getList({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'basics.customize.planttype',
				}).then(function (response) {
					return _.minBy(response, function (item) {
						return  item.isDefault && item.sorting;
					});
				});
			}

			async function getSelectedPlantGroupFromPlant(plantGroupId) {
				const ident = { Id: plantGroupId };
				try {
					const response = await $http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/instance', ident);
					if (response.data) {
						return response.data;
					} else {
						throw new Error('Plant group not found.');
					}
				} catch (error) {
					console.error('Error fetching plant group:', error);
					throw error;
				}
			}

			function validationCheckForCreatePlant(modalCreateConfig) {
				let result = true;
				let dataItem = null;
				if (modalCreateConfig) {
					dataItem = modalCreateConfig.dataItem;
					const hasCodeError = platformRuntimeDataService.hasError(dataItem, 'Code');
					if (modalCreateConfig.dataItem && !hasCodeError && modalCreateConfig.dataItem.GroupFk && dataItem.Code && dataItem.KindFk && dataItem.TypeFk && dataItem.ProcurementStructureFk) {
						result = false;
					}
				}
				return result;
			}

			function validatePlantGroups(resources, isFromPlantCreationButton) {
				if (resources.length > 0 || isFromPlantCreationButton) {
					return true;
				}

				platformDialogService.showDialog({
					headerText: 'Create New Plant',
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info',
					disableOkButton: false
				});

				return false;
			}


			service.createResTypeStructure = function createResTypeStructure(){

				const title = 'resource.equipmentgroup.createResourceTypeStructureWizard.createResourceTypeStructureTitle';
				const selectionStepUuid = '6610c0160a0045729d8d07da6c34891d';
				const translationNamespace = 'resource.equipmentgroup.createResourceTypeStructureWizard.';

				const selectedPlantGroupParent = resourceEquipmentGroupDataService.getSelected();

				if(!selectedPlantGroupParent){
					let modalOptions = {
						headerText: $translate.instant(title),
						bodyText: $translate.instant(translationNamespace + 'creationErrorNoPlantGroupSelectedTitle'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
					return;
				}
				const selectPlantGroupParentId = selectedPlantGroupParent.Id;


				let dataItem = {
					selection: {
						items: [],
						selectionListConfig: {
							multiSelect: false,
							idProperty: 'Id',
							columns: [],
						},
						listModel: {},
						selectedPlantGroupParent: {
							noResType: true,
							isHighestLevel: _.isNil(selectedPlantGroupParent.EquipmentGroupFk)
						}
					},
					creationType: {
						isMapToExistingResType2PlantGroup: false,
						isForCreateResourceType: false,
						resourceTypeFk: null
					}
				};

				// This is the first step that provides a grid list of plant groups (children) based on the selected parent plant group
				function createGridStep() {
					let title = translationNamespace + 'step1Title';
					let topDescription = translationNamespace + 'topDescription';

					let equipmentGroupLayout =  _.cloneDeep($injector.get('resourceEquipmentGroupLayoutService').getStandardConfigForListView().columns);
					let checkBoxColumnForLevel1Pg = {
						editor: 'boolean',
						editorOptions: {},
						field: 'createResourceType',
						formatter: 'boolean',
						fixed: true,
						width: 150,
						formatterOptions: {},
						id: 'createResourceType-checkbox',
						name: translationNamespace + 'createResourceType',
						name$tr$: translationNamespace + 'createResourceType',
						toolTip: translationNamespace + 'createResourceTypeToolTip',
						toolTip$tr$: translationNamespace + 'createResourceTypeToolTip',
					};
					equipmentGroupLayout.unshift(checkBoxColumnForLevel1Pg);

					dataItem.selection.listModel = {
						items: dataItem.selection.items,
						selectedId: null,
						stepId: selectionStepUuid,
						selectionListConfig: {
							selectedIdProperty: 'SelectedId',
							idProperty: 'Id',
							columns: equipmentGroupLayout,
							multiSelect: false
						}
					};



					let listStep = platformWizardDialogService.createListStep($translate.instant(title), $translate.instant(topDescription), 'selection.listModel', selectionStepUuid);
					listStep.disallowNext = false;
					listStep.cssClass = '';


					return listStep;
				}

				// this is the second step to choose a creation type
				let creationTypeStep = [
					{
						model: 'creationType.isMapToExistingResType2PlantGroup',
						tr: translationNamespace + 'isMapToExistingResType2PlantGroup',
						domain: 'boolean',
						options: {readonly: false}
					}, {
						model: 'creationType.isForCreateResourceType',
						tr: translationNamespace + 'isForCreateResourceType',
						domain: 'boolean',
						options: {readonly: false}
					},{
						model: 'creationType.resourceTypeFk',
						tr: translationNamespace + 'resourceTypeFk',
						domain: 'lookup',
						options: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'resourceTypeLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: true,

						}, {
							gid: 'group',
							rid: 'resourceTypeFk',
							model: 'creationType.resourceTypeFk',
							label: 'Resource Type',
							label$tr$: 'ResourceType',
							type: 'lookup',
							required: false,
							readonly: false,
							sortOrder: 1
						}),
					}];

				let secondCreateTypeStep = basicsCommonWizardHelper.createStep(translationNamespace + 'step2Title', creationTypeStep, $translate.instant(translationNamespace + 'creationTypeInfo'));

				let steps  = [];
				// Check the selected plant group, if it has no children, then don't show the first page (plant group children list)
				if(selectedPlantGroupParent.SubGroups.length === 0){
					let selectedItem = {
						Id : selectPlantGroupParentId,
						createResourceType : true
					};
					dataItem.selection.items.push(selectedItem);
					steps = [secondCreateTypeStep];
				} else {
					steps = [createGridStep(), // as first page of the wizard
						secondCreateTypeStep, // as the second page of the wizard
					];
				}


				// start with the wizard config
				let createResTypeFromPlantGroupWizard = {
					id: 'createResTypeFromPGWizard',
					title$tr$: $translate.instant(translationNamespace + 'createResourceTypeStructureTitle'),
					steps: steps,
					watches: [
						{
							expression: 'creationType.isMapToExistingResType2PlantGroup',
							fn: function (info){
								if(info.newValue === true){
									info.model.creationType.isForCreateResourceType = false;
								}
								checkAllowFinish(info);
							}
						}, {
							expression: 'creationType.isForCreateResourceType',
							fn: function (info){
								if(info.newValue === true){
									info.model.creationType.isMapToExistingResType2PlantGroup = false;
								}
								readOnlyResTypeLookup(info, info.newValue);
								checkAllowFinish(info);
							}
						},{
							expression: 'creationType.resourceTypeFk',
							fn: checkAllowFinish
						},
					],
					height:'800px'
				};
				// end of the wizard config

				var loadData = {
					// check resource type structure exists
					'checkResTypeExists' : checkResTypeExists(selectPlantGroupParentId),
					// get plant group child list
					'getPgChildList' : getPgChildrenList(selectPlantGroupParentId)
				};

				$q.all(loadData).then(function (result) {
					dataItem.selection.selectedPlantGroupParent.noResType = result.checkResTypeExists.length === 0;
					_.forEach(result.getPgChildList, function (childGroup) {
						childGroup.createResourceType = true;
						dataItem.selection.items.push(childGroup);
					});
				}).then(function () {
					// create wizard in ui and manage onFinish call to server for report creation with selected plant group
					platformWizardDialogService.translateWizardConfig(createResTypeFromPlantGroupWizard);
					platformWizardDialogService.showDialog(createResTypeFromPlantGroupWizard, dataItem).then(function (result) {
						if (result.success) {
							const payload = {
								PlantGroupIds: _.map(_.filter(result.data.selection.items, 'createResourceType'), 'Id'),
								PlantGroupId: selectPlantGroupParentId,
								ResTypeFk: result.data.creationType.resourceTypeFk,
								IsForCreateResourceType : result.data.creationType.isForCreateResourceType,
								MapToExistingResType2PlantGroup : result.data.creationType.isMapToExistingResType2PlantGroup
							};
							$http.post(globals.webApiBaseUrl + 'resource/type/createrestypefromplantgroup', payload).then(function (response) {

								// If new resType is created, need to load lookup
								if (response && response.status === 201) {
									var resTypeLookup = $injector.get('resourceTypeLookupDataService');
									resTypeLookup.resetCache({lookupType : 'resourceTypeLookupDataService'});
								}

								if (response && (response.status === 200 || response.status === 201) ) {
									let modalOptions = {
										headerTextKey: translationNamespace + 'createResourceTypeStructureTitle',
										bodyTextKey: translationNamespace + 'creationSuccess',
										showOkButton: true,
										showCancelButton: true,
										resizeable: true,
										height: '500px',
										iconClass: 'info'
									};
									platformModalService.showDialog(modalOptions);
								}
								else {
									// Wizard failed
									platformModalService.showMsgBox(
										$translate.instant(translationNamespace + 'creationFailed'),
										$translate.instant(translationNamespace + 'createResourceTypeStructureTitle'),
										'warning');
								}
							});
						}
					});
				});

			};

			// gets a plant group children list from a selected root plant group from server
			function getPgChildrenList(plantGroupId) {
				return $http.get(globals.webApiBaseUrl + 'resource/equipmentgroup/childrentreebyparent?plantGroupId=' + plantGroupId ).then(function (response) {
					if(response && response.data){
						return response.data;
					}
				});
			}

			function checkResTypeExists(plantGroupId){
				let url = globals.webApiBaseUrl + 'resource/type/plantgroup2restype/getbyplantgroup?plantGroupId=' + plantGroupId;
				return $http.get(url).then(function (response) {
					return response && response.data;
				});
			}

			// Watch functions
			function checkAllowFinish(info){
				let secondStep = _.find(info.wizard.steps, {id : 'resource.equipmentgroup.createResourceTypeStructureWizard.step2Title'});
				let isOptionSelected = (info.model.creationType.isForCreateResourceType === true ||
					info.model.creationType.isMapToExistingResType2PlantGroup === true);
				let isResTypeSelected = !_.isNil(info.model.creationType.resourceTypeFk);
				let noResType = info.model.selection.selectedPlantGroupParent.noResType;

				if(info.model.selection.selectedPlantGroupParent.isHighestLevel && info.model.creationType.isForCreateResourceType === true){
					secondStep.canFinish = isOptionSelected && noResType;
					if(noResType === false){
						let warningMsg = $translate.instant('resource.equipmentgroup.createResourceTypeStructureWizard.resTypeExistWarning');
						platformModalService.showMsgBox(warningMsg, $translate.instant('resource.equipmentgroup.createResourceTypeStructureWizard.createResourceTypeStructureTitle'), 'warning');
					}
				}else{
					secondStep.canFinish = isOptionSelected && isResTypeSelected;
				}

				info.scope.$broadcast('form-config-updated');
			}

			function readOnlyResTypeLookup(info, readOnly){
				if(info.model.selection.selectedPlantGroupParent.isHighestLevel){
					let secondStep = _.find(info.wizard.steps, {id : 'resource.equipmentgroup.createResourceTypeStructureWizard.step2Title'});
					_.find(secondStep.form.rows, {rid: 'resourceTypeFk'}).readonly = readOnly;
					if(readOnly===true)
					{
						info.model.creationType.resourceTypeFk = null;
					}
				}
			}

			return service;
		}
	]);
})(angular);
