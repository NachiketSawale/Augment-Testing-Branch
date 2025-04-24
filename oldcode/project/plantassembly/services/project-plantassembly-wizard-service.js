/*
 * $Id: project-plantassembly-wizard-service.js DEV-2820 2023-12-22 05:03:39Z winjit.juily.deshkar $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'project.plantassembly';

	angular.module(moduleName).factory('projectPlantAssemblyWizardService',
		['$translate', 'platformModalFormConfigService', 'platformTranslateService', '$injector', 'projectPlantAssemblyMainService', '$http', 'projectPlantAssemblyFilterService',
			function ($translate, platformModalFormConfigService, platformTranslateService, $injector, projectPlantAssemblyMainService, $http, projectPlantAssemblyFilterService) {
				let service = {};

				service.updateEquipmentAssembly = function updateEquipmentAssembly() {

					let item = {
						updateCostCodes: true,
						updateMaterials: true,
						updateAssembly: true,
						UpdateMultipliersFrmPlantEstimate: false,
						selectUpdateScope: 1
					};

					let assemblySelected = projectPlantAssemblyMainService.getSelected();
					let assembliesSelected = projectPlantAssemblyMainService.getSelectedEntities();
					let isAssemblySelected = !!assemblySelected;

					let title = 'project.main.updatePlantAssemblyWizard.wizardTitle';
					let noteText = $translate.instant('project.main.updatePlantAssemblyWizard.wizardNoteText');
					item = {
						updateCostCodes: true,
						updateMaterials: true,
						updateAssembly: true,
						UpdateMultipliersFrmPlantEstimate: false,
						selectUpdateScope: 1,
						noteText: noteText
					};
					$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/GetEquipmentAssemblyCostUnitAlwaysEditableFlag').then(function (response) {
						let GetEquipmentAssemblyCostUnitAlwaysEditable = response.data;
						let config = {
							title: $translate.instant(title),
							dataItem: item,
							formConfiguration: {
								fid: 'project.main.updatePlantAssemblyWizard',
								version: '0.1.1',
								showGrouping: true,
								groups: [
									{
										gid: 'selectScope',
										header$tr$: $translate.instant('project.plantassembly.updatePlantAssemblyWizard.selectScope'),
										header: 'Select Scope',
										isOpen: true,
										attributes: ['selectUpdateScope']
									},
									{
										gid: 'updateSetting',
										header$tr$: $translate.instant('project.plantassembly.updatePlantAssemblyWizard.updateSetting'),
										header: 'Update Setting',
										isOpen: true,
										visible: !GetEquipmentAssemblyCostUnitAlwaysEditable,
										attributes: ['updateCostCodes', 'updateMaterials', 'updateAssembly']
									}
								],
								rows: [
									{
										gid: 'selectScope',
										rid: 'selectUpdateScope',
										model: 'selectUpdateScope',
										type: 'radio',
										label: 'Select Scope',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.selectUpdateScope'),
										options: {
											valueMember: 'value',
											labelMember: 'label',
											disabledMember: 'isReadonly',
											items: [
												{
													value: 3,
													label: 'Highlighted Assembly',
													label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.highlightedAssembly'),
													isReadonly: !isAssemblySelected
												},
												{
													value: 2,
													label: 'Current Result Set',
													label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.currentResultSet')
												},
												{
													value: 1,
													label: 'Entire Assemblies',
													label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.entireAssemblies')
												}]
										}
									},
									{
										gid: 'selectScope',
										rid: 'UpdateMultipliersFrmPlantEstimate',
										label: 'Update Price Condition Multipliers from Master',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.UpdateMultipliersFrmPlantEstimate'),
										type: 'boolean',
										model: 'UpdateMultipliersFrmPlantEstimate',
										sortOrder: 1
									},
									{
										gid: 'updateSetting',
										rid: 'updateCostCodes',
										label: 'Update values from Project cost codes',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.updateCostCodes'),
										type: 'boolean',
										model: 'updateCostCodes',
										sortOrder: 1,
										// change: onFieldChanged
									},
									{
										gid: 'updateSetting',
										rid: 'updateMaterials',
										label: 'Update values from Project Materials',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.updateMaterials'),
										type: 'boolean',
										model: 'updateMaterials',
										sortOrder: 2,
										// change: onFieldChanged
									},
									{
										gid: 'updateSetting',
										rid: 'updateAssembly',
										label: 'Update values from Project Assemblies',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.updateAssembly'),
										type: 'boolean',
										model: 'updateAssembly',
										sortOrder: 3
									},
									{
										gid: 'updateSetting',
										rid: 'note',
										label: 'Note:',
										label$tr$: $translate.instant('project.main.updatePlantAssemblyWizard.noteText'),
										model: 'noteText',
										type: 'comment',
										sortOrder: 6,
										visible: true,
										readonly: true
									}
								]
							},
							dialogOptions: {
								disableOkButton: function (/* modalOptions */) {
									return !item.updateCostCodes && !item.updateMaterials && !item.updateAssembly;
								}
							},
							handleOK: function handleOK(result) {
								if (result && result.ok && result.data) {
									let isPrjAssembly = true;
									let promise = $injector.get('projectMainService').update();
									promise.then(function () {
										result.data.filters = projectPlantAssemblyFilterService.getFilterRequest();
										if (assemblySelected) {
											result.data.assemblyId = assemblySelected.Id;
											result.data.assemblyIds = _.map(assembliesSelected, 'Id');
											result.data.assemblyHeaderId = assemblySelected.EstHeaderFk;
										}

										if (isPrjAssembly) {
											result.data.IsPrjAssembly = true;
											let project = $injector.get('projectMainService').getSelected();
											result.data.ProjectId = project ? project.Id : 0;
										}
										result.data.UpdateAssemblyResources = result.data.updateAssembly;
										$http.post(globals.webApiBaseUrl + 'estimate/main/resource/updatprojectplantassemblystructure', result.data).then(function (/* result */) {
											isPrjAssembly ? $injector.get('projectMainService').refresh() : estimateAssembliesService.refresh();
										});
									});
								}
							}
						};
						platformTranslateService.translateFormConfig(config.formConfiguration);

						platformModalFormConfigService.showDialog(config);
					});
				};

				return service;
			}]);
})(angular);