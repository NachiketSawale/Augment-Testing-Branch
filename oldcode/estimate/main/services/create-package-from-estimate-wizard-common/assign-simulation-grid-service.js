/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainWizardAssignPageSimulationGridService', estimateMainWizardAssignPageSimulationGridService);

	estimateMainWizardAssignPageSimulationGridService.$inject = [
		'$http', '$translate', 'platformRuntimeDataService', 'estimateMainCreatePackageMatchnessTypeConstant',
		'estimateMainCreateMaterialPackageService', 'estimateMainPrcPackage2HeaderLookupDataService',
		'platformGridAPI', '_', 'platformTranslateService', 'globals',
		'procurementPackageNumberGenerationSettingsService',
		'basicsLookupdataLookupDescriptorService',
		'estimateMainBoqPackageAssignFormConfig',
		'basicsLookupdataLookupFilterService',
		'$timeout',
		'$rootScope'];

	function estimateMainWizardAssignPageSimulationGridService($http, $translate, platformRuntimeDataService, matchnessTypeConstant,
															   estimateMainCreateMaterialPackageService, estimateMainPrcPackage2HeaderLookupDataService,
															   platformGridAPI, _, platformTranslateService, globals,
															   procurementPackageNumberGenerationSettingsService,
															   basicsLookupdataLookupDescriptorService,
															   estimateMainBoqPackageAssignFormConfig,
															   basicsLookupdataLookupFilterService,
															   $timeout,
															   $rootScope) {
		let service = {};
		let subPackageFilter = {
			key: 'assign-boq-grid-wizard-sub-package-filter',
			serverKey: 'prc-boq-package2header-filter',
			serverSide: true,
			fn: function (dataContext) {
				if (dataContext && dataContext.Package && dataContext.Package.Id) {
					return {PrcPackageFk: dataContext.Package.Id};
				}
			}
		};

		if (!basicsLookupdataLookupFilterService.hasFilter(subPackageFilter.key)) {
			basicsLookupdataLookupFilterService.registerFilter([subPackageFilter]);
		}
		service.getService = getService;

		return service;

		function getService($scope, simulationGridId, pageId, getFirstLoadedSimulationData, setFirstLoadedSimulationData) {
			let commonService = {};
			const isGenerated = 'Is Generated';
			commonService.getGridColumns = getGridColumns;
			commonService.checkHasNewItem = checkHasNewItem;
			commonService.updateSimulationGrid = updateSimulationGrid;
			commonService.setupSimulationGrid = setupSimulationGrid;
			commonService.unregisterMessengers = unregisterMessengers;
			commonService.removeStructureMandatoryError = removeStructureMandatoryError;
			commonService.doValidateStructureFk = doValidateStructureFk;
			return commonService;

			function getGridColumns() {
				return [
					{
						id: 'Selected',
						field: 'Selected',
						name: 'New',
						sortable: true,
						name$tr$: 'estimate.main.createMaterialPackageWizard.new',
						editor: 'boolean',
						formatter: 'boolean',
						width: 35
					},
					{
						id: 'Merge',
						field: 'Merge',
						name: 'Merge Update',
						name$tr$: 'estimate.main.createMaterialPackageWizard.mergeUpdate',
						editor: 'boolean',
						sortable: true,
						formatter: 'boolean',
						width: 90
					},
					{
						id: 'Matchness',
						field: 'Matchness',
						name: 'Matchness',
						name$tr$: 'estimate.main.createMaterialPackageWizard.matchness',
						readonly: true,
						sortable: true,
						width: 90,
						formatter: 'description'
					},
					{
						id: 'Structure',
						field: 'StructureCodeFk',
						name: 'Procurement Structure',
						name$tr$: 'estimate.main.prcStructureFk',
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurementstructure-structure-dialog',
							lookupOptions: {
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {

											if (args && args.selectedItem) {
												let packageData = args.entity.Package;
												let postData = {
													prcStructureFk: args.selectedItem.Id,
													projectFk: packageData ? packageData.ProjectFk : null,
													companyFk: packageData ? packageData.CompanyFk : null,
													isProcurementService: true
												};
												estimateMainBoqPackageAssignFormConfig.setResponsible(packageData, postData).then(function () {
													args.entity.StructureCodeFk = args.selectedItem.Id;
													if (args.selectedItem.DescriptionInfo) {
														args.entity.SubPackage = args.selectedItem.DescriptionInfo.Translated;
														args.entity.PackageDescription = args.selectedItem.DescriptionInfo.Translated;
													}
													setCode(args.entity);
												});
											}
										}
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcstructure',
							displayMember: 'Code'
						},
						validator: validateStructureFk,
						width: 150
					},
					{
						id: 'newPackageCode',
						field: 'Code',
						name: 'New Package Code',
						name$tr$: 'estimate.main.createBoqPackageWizard.assignPage.simulation.newPackageCode',
						readonly: true,
						width: 90,
						sortable: true,
						formatter: function (row, cell, value) {
							if (value === isGenerated) {
								return $translate.instant('cloud.common.isGenerated');
							}
							return value;
						},
						validator: validateCode
					},
					{
						id: 'Status',
						name: 'Status',
						name$tr$: 'estimate.main.createMaterialPackageWizard.status',
						width: 90,
						field: 'PackageStatusFk',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PackageStatus',
							'displayMember': 'DescriptionInfo.Translated',
							'imageSelector': 'platformStatusIconService'
						},
						sortable: true
					},
					{
						id: 'PackageCode',
						name: 'Package Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.packageCode',
						width: 90,
						field: 'PackageCodeFk',
						sortable: true,
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-package-package-with-update-option-lookup',
							lookupOptions: {
								filterKey: 'assign-boq-wizard-prc-package-filter',
								showClearButton: false,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let isNewMode = args.entity.MatchnessType === matchnessTypeConstant.New;
											let selectedItem = args.selectedItem;
											if (selectedItem) {
												if (isNewMode) {// new
													args.entity.Selected = false;
													args.entity.Code = null;
													setReadOnly(args.entity, 'Selected', false);
													setReadOnly(args.entity, 'ClerkPrcFk', true);
													setReadOnly(args.entity, 'ConfigurationFk', true);
												}
												const tempSimulationData = angular.isFunction(getFirstLoadedSimulationData) ?
													getFirstLoadedSimulationData() : [];
												args.entity.ConfigurationFk = args.selectedItem.ConfigurationFk;
												args.entity.ClerkPrcFk = args.selectedItem.ClerkPrcFk;
												args.entity.PackageCodeFk = args.selectedItem.Id;
												args.entity.PackageStatusFk = args.selectedItem.PackageStatusFk;
												args.entity.StructureCodeFk = args.selectedItem.StructureFk;
												if (args.selectedItem.IsService && angular.isNumber(args.selectedItem.ResourceBoqStructure)) {
													args.entity.BoqStructureOption4SourceResources = args.selectedItem.ResourceBoqStructure;
												}

												let firstData = angular.copy(_.find(tempSimulationData, {'Id': args.entity.Id}));
												if (firstData.PackageCodeFk !== args.entity.PackageCodeFk) {
													args.entity.Matchness = $translate.instant('estimate.main.createMaterialPackageWizard.userSpecified');
													args.entity.MatchnessType = matchnessTypeConstant.UserSpecified;
												} else if (!isNewMode) {
													args.entity.Matchness = firstData.Matchness;
													args.entity.MatchnessType = firstData.MatchnessType;
												}

												args.entity.packageCode = selectedItem.Code;

												if (!args.selectedItem.ClerkPrcFk) {
													estimateMainCreateMaterialPackageService.getClerkPrc(args.selectedItem).then(function (rep) {
														args.entity.ClerkPrcFk = rep.data;
													});
												}

												let filterString = estimateMainPrcPackage2HeaderLookupDataService.getFilterString({
													projectId: selectedItem.ProjectFk,
													prcPackageId: selectedItem.Id
												});
												estimateMainPrcPackage2HeaderLookupDataService.readData(filterString).then(function (response) {
													let subPackages = _.get(response, 'data');
													args.entity.SubPackageFk = _.some(subPackages) ? _.first(subPackages).Id : null;
												});
												if (args.entity.Merge) {
													updateSimulationGridByMerge();
												}
												validateStructureFk(args.entity, args.entity.StructureCodeFk, 'StructureCodeFk');
												validateCode(args.entity, args.entity.Code, 'Code');
											}
										}
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'packagewithupdateopt', 'displayMember': 'Code'},
					},
					{
						id: 'PackageDescription',
						name: 'Package Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.packageDescription',
						width: 110,
						sortable: true,
						'editor': 'dynamic',
						formatter: 'dynamic',
						validator: 'packageDescriptionValueChange',
						domain: function (item, column) {
							let domain;
							if (matchnessTypeConstant.New !== item.MatchnessType) {
								domain = 'lookup';
								column.field = 'PackageCodeFk';
								column.formatterOptions = {
									lookupType: 'packagewithupdateopt',
									displayMember: 'Description'
								};
							} else {
								domain = 'description';
								column.field = 'PackageDescription';
								column.formatterOptions = null;
							}
							return domain;
						}
					},
					{
						id: 'SubPackage',
						name: 'Sub Package',
						name$tr$: 'estimate.main.createMaterialPackageWizard.subPackage',
						editor: 'dynamic',
						formatter: 'dynamic',
						sortable: true,
						validator: 'packageDescriptionValueChange',
						domain: function (item, column) {
							let domain;
							if (matchnessTypeConstant.New !== item.MatchnessType) {
								domain = 'lookup';
								column.field = 'SubPackageFk';
								column.editorOptions = {
									lookupDirective: 'procurement-package-package2-header-combobox',
									lookupOptions: {
										'filterKey': 'assign-boq-grid-wizard-sub-package-filter'
									}
								};
								column.formatterOptions = {
									lookupType: 'prcpackage2header',
									valMember: 'Id',
									displayMember: 'Description'
								};
							} else {
								domain = 'description';
								column.field = 'SubPackage';
								column.formatterOptions = null;
							}
							return domain;
						},
						width: 100
					},
					{
						id: 'Configuration',
						field: 'ConfigurationFk',
						name: 'Configuration',
						name$tr$: 'estimate.main.createMaterialPackageWizard.configuration',
						sortable: true,
						editor: 'lookup',
						editorOptions: {
							'directive': 'basics-configuration-configuration-combobox',
							'lookupOptions': {
								'filterKey': 'assign-boq-wizard-package-configuration-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'PrcConfiguration',
							'displayMember': 'DescriptionInfo.Translated'
						},
						width: 80
					}, {
						id: 'Responsible',
						field: 'ClerkPrcFk',
						name: 'Responsible',
						name$tr$: 'estimate.main.createMaterialPackageWizard.responsible',
						sortable: true,
						editor: 'lookup',
						editorOptions: {
							'directive': 'cloud-clerk-clerk-dialog-without-teams',
							'lookupOptions': {
								'showClearButton': true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'clerk',
							'displayMember': 'Code'
						},
						width: 80
					}
				];
			}

			function setupSimulationGrid(simulationGridColumns) {

				unregisterMessengers();

				simulationGridColumns = simulationGridColumns || [];

				let simulationGridConfig = {
					columns: angular.copy(simulationGridColumns),
					data: [],
					id: simulationGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(simulationGridConfig);
				platformTranslateService.translateGridConfig(simulationGridConfig.columns);
				platformGridAPI.events.register(simulationGridId, 'onCellChange', onCellModified);
				platformGridAPI.events.register(simulationGridId, 'onBeforeEditCell', onBeforeEditCell);

			}

			function resetNewSimulationGrid() {
				let simulationData = platformGridAPI.items.data(simulationGridId);
				let newDatas = _.filter(simulationData, {'MatchnessType': matchnessTypeConstant.New});
				if (newDatas.length > 0) {
					_.forEach(newDatas, function (item, index) {
						setReadOnly(item, 'PackageDescription', true);
						setReadOnly(item, 'SubPackage', true);
					});

					platformGridAPI.grids.invalidate(simulationGridId);
					platformGridAPI.items.data(simulationGridId, simulationData);
					platformGridAPI.grids.refresh(simulationGridId);

				}
			}

			function checkHasNewItem(data) {
				let simulationData = data || platformGridAPI.items.data(simulationGridId);
				let newItems = _.filter(simulationData, function (item) {
					return item.Selected;
				});
				pageId = '#' + pageId;
				// if ($(pageId).data('kendoSplitter')) {
				// 	if (newItems && newItems.length === 0) {
				// 		$(pageId).data('kendoSplitter').collapse('#ui-layout-east');
				// 	} else {
				// 		$(pageId).data('kendoSplitter').expand('#ui-layout-east');
				// 	}
				// }

				$scope.hasNewItem = newItems && newItems.length > 0;
				apply(function(){
					$scope.$apply();
				});
			}

			function apply(fn) {
				let phase = $rootScope.$$phase;
				if (phase === '$apply' || phase === '$digest') {
					$timeout(fn, 50);
				} else {
					fn();
				}
			}

			function unregisterMessengers() {
				if (platformGridAPI.grids.exist(simulationGridId)) {
					platformGridAPI.events.unregister(simulationGridId, 'onCellChange', onCellModified);
					platformGridAPI.events.unregister(simulationGridId, 'onBeforeEditCell', onBeforeEditCell);
					platformGridAPI.grids.unregister(simulationGridId);
				}
			}

			function onCellModified(e, arg) {
				if (!arg.cell) {
					return false;
				}
				let propertyName = platformGridAPI.columns.configuration(simulationGridId).visible[arg.cell].field;
				let selections = platformGridAPI.rows.selection({
					gridId: simulationGridId,
					wantsArray: true
				});
				let newChecked = arg.item.Selected;
				if (selections && selections.length) {
					const tempSimulationData = angular.isFunction(getFirstLoadedSimulationData) ?
						getFirstLoadedSimulationData() : [];
					_.forEach(selections, function (selected) {
						let firstData = angular.copy(_.find(tempSimulationData, {'Id': selected.Id}));
						let isReadonlyItem = platformRuntimeDataService.isReadonly(firstData, 'Selected');
						if (!isReadonlyItem) {
							if ('Selected' === propertyName) {
								if (newChecked) {
									selected.Matchness = $translate.instant('estimate.main.createMaterialPackageWizard.new');
									selected.MatchnessType = matchnessTypeConstant.New;
									selected.PackageCodeFk = 0;
									selected.SubPackageFk = 0;
									selected.PackageStatusFk = 0;
									selected.Merge = false;
									selected.Selected = newChecked;
									selected.StructureCodeFk = firstData.BasicStructureCodeFk;
									selected.packageCode = null;
									if (0 !== firstData.StructureConfigurationFk) {
										selected.ConfigurationFk = firstData.StructureConfigurationFk;
									}
									setCode(selected);
									if (newChecked) {
										setReadOnly(selected, 'Code', selected.Code === isGenerated);
									}
								} else {
									selected.Matchness = firstData.Matchness;
									selected.MatchnessType = firstData.MatchnessType;
									selected.PackageCodeFk = firstData.PackageCodeFk;
									selected.SubPackageFk = firstData.SubPackageFk;
									selected.ConfigurationFk = firstData.ConfigurationFk;
									selected.PackageStatusFk = firstData.PackageStatusFk;
									selected.StructureCodeFk = firstData.StructureCodeFk;
									selected.packageCode = firstData.packageCode;
									selected.Selected = newChecked;
									selected.Code = null;
								}
								setReadOnly(selected, 'PackageCodeFk', false);
								setReadOnly(selected, 'ConfigurationFk', !newChecked);
								setReadOnly(selected, 'ClerkPrcFk', !newChecked);
								setReadOnly(selected, 'Merge', newChecked);
								setReadOnly(selected, 'StructureCodeFk', !newChecked);
								validateStructureFk(selected, selected.StructureCodeFk, 'StructureCodeFk');
								validateCode(selected, selected.Code, 'Code');
							} else if ('Merge' === propertyName) {
								if (!newChecked) {
									selected.PackageCodeFk = firstData.PackageCodeFk;
									selected.StructureCodeFk = firstData.StructureCodeFk;
									selected.SubPackageFk = firstData.SubPackageFk;
									selected.ConfigurationFk = firstData.ConfigurationFk;
									selected.PackageStatusFk = firstData.PackageStatusFk;
									selected.StructureCodeFk = firstData.StructureCodeFk;
									selected.ClerkPrcFk = firstData.ClerkPrcFk;
									selected.Matchness = firstData.Matchness;
									selected.MatchnessType = firstData.MatchnessType;
								}
								selected.Merge = arg.item.Merge;
								validateStructureFk(selected, selected.StructureCodeFk, 'StructureCodeFk');
								validateCode(selected, selected.Code, 'Code');
							}
						}
					});
					updateSimulationGridByMerge();
					checkHasNewItem();
				}
			}

			function onBeforeEditCell(e, args) {
				let currentItem = args.item;
				if (!currentItem) {
					return;
				}
				if ('PackageDescription' === args.column.id) {
					if (matchnessTypeConstant.New !== currentItem.MatchnessType) {
						return false;
					}
				}
				return true;
			}

			function updateSimulationGridByMerge() {
				let simulationData = platformGridAPI.items.data(simulationGridId);
				let mergeItems = _.filter(simulationData, function (item) {
					return item.Merge;
				});
				let mergeCount = mergeItems.length;
				const tempSimulationData = angular.isFunction(getFirstLoadedSimulationData) ?
					getFirstLoadedSimulationData() : [];
				if (mergeCount >= 1) {
					let firstMergeItem = mergeItems[0];
					_.forEach(mergeItems, function (item) {
						if (item.Id !== firstMergeItem.Id && mergeCount > 1) {
							setReadOnly(item, 'PackageCodeFk', true);
						} else {
							setReadOnly(item, 'PackageCodeFk', false);
						}
						item.PackageCodeFk = firstMergeItem.PackageCodeFk;
						item.StructureCodeFk = firstMergeItem.StructureCodeFk;
						item.SubPackageFk = firstMergeItem.SubPackageFk;
						item.ConfigurationFk = firstMergeItem.ConfigurationFk;
						item.PackageStatusFk = firstMergeItem.PackageStatusFk;
						item.StructureCodeFk = firstMergeItem.StructureCodeFk;
						item.ClerkPrcFk = firstMergeItem.ClerkPrcFk;

						let firstData = angular.copy(_.find(tempSimulationData, {'Id': item.Id}));
						if (firstData.PackageCodeFk !== item.PackageCodeFk) {
							item.MatchnessType = matchnessTypeConstant.UserSpecified;
							item.Matchness = $translate.instant('estimate.main.createMaterialPackageWizard.userSpecified');
						} else if (!item.Selected) {
							item.Matchness = firstData.Matchness;
						}
					});
					let grid = platformGridAPI.grids.element('id', simulationGridId);
					let selectedRows = [];
					if (grid && grid.instance && _.isFunction(grid.instance.getSelectedRows)) {
						selectedRows = grid.instance.getSelectedRows();
					}
					platformGridAPI.grids.invalidate(simulationGridId);
					platformGridAPI.items.data(simulationGridId, simulationData);
					platformGridAPI.grids.refresh(simulationGridId);
					if (selectedRows && selectedRows.length && _.isFunction(grid.instance.setSelectedRows)) {
						grid.instance.setSelectedRows(selectedRows);
					}
				}
			}

			function updateSimulationGrid(simulationData) {
				// reset data by new
				let newDatas = _.filter(simulationData, {'MatchnessType': matchnessTypeConstant.New});
				let onePackageFlg = $scope.entity.boqPackageAssignmentEntity.IsCreateNew;
				if (newDatas.length > 0) {
					if (onePackageFlg) {
						_.forEach(newDatas, function (item, index) {
							setReadOnly(item, 'PackageDescription', false);
							setReadOnly(item, 'SubPackage', true);
						});
					} else {
						_.forEach(newDatas, function (item) {
							setReadOnly(item, 'PackageDescription', false);
							setReadOnly(item, 'SubPackage', false);
						});
					}
				}

				platformGridAPI.grids.invalidate(simulationGridId);
				// load list
				_.each(simulationData, function (item) {
					if (matchnessTypeConstant.New === item.MatchnessType) {
						item.Selected = true;
						setReadOnly(item, 'Selected', true);
						setReadOnly(item, 'ConfigurationFk', false);
						setReadOnly(item, 'ClerkPrcFk', false);
						setReadOnly(item, 'Merge', true);
						setReadOnly(item, 'StructureCodeFk', false);
					} else {
						setReadOnly(item, 'ConfigurationFk', true);
						setReadOnly(item, 'ClerkPrcFk', true);
						setReadOnly(item, 'StructureCodeFk', true);
					}
					validateStructureFk(item, item.StructureCodeFk, 'StructureCodeFk');
					validateCode(item, item.Code, 'Code');
				});

				if (angular.isFunction(setFirstLoadedSimulationData)) {
					setFirstLoadedSimulationData(_.cloneDeep(simulationData));
				}

				$scope.entity.boqPackageAssignmentEntity.simulationData = simulationData;
				platformGridAPI.items.data(simulationGridId, simulationData);
			}

			function validateCode(entity, value, field) {
				let validation = {
					valid: true,
					apply: true
				};
				if (entity.Selected && !entity.Code) {
					let fieldName = $translate.instant('estimate.main.createBoqPackageWizard.assignPage.simulation.newPackageCode');
					validation.valid = false;
					validation.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					platformRuntimeDataService.applyValidationResult(validation, entity, field);
				} else {
					platformRuntimeDataService.applyValidationResult(validation, entity, field);
				}

				if (entity.Selected && entity.Code && !platformRuntimeDataService.isReadonly(entity, 'Code')) {
					isPackageCodeUnique(entity).then(function (response) {
						if (!response) {
							return;
						}
						const uniqueResult = response.data;
						platformRuntimeDataService.applyValidationResult(uniqueResult, entity, field);
						platformGridAPI.grids.invalidate(simulationGridId);
						platformGridAPI.grids.refresh(simulationGridId);
					});
				}

				setTimeout(function () {
					if (angular.isFunction($scope.validateBoqPackageItem)) {
						$scope.validateBoqPackageItem($scope.entity.boqPackageAssignmentEntity);
					}
				});
				return validation;
			}

			function removeStructureMandatoryError() {
				let simulationData = platformGridAPI.items.data(simulationGridId);
				if (!simulationData || simulationData.length === 0) {
					return;
				}
				simulationData.forEach(entity => {
					let validation = {
						valid: true,
						apply: true
					};
					platformRuntimeDataService.applyValidationResult(validation, entity, 'StructureCodeFk');
				});
				platformGridAPI.grids.invalidate(simulationGridId);
				platformGridAPI.grids.refresh(simulationGridId);
			}

			function doValidateStructureFk() {
				let simulationData = platformGridAPI.items.data(simulationGridId);
				if (!simulationData || simulationData.length === 0) {
					return;
				}
				simulationData.forEach(entity => {
					validateStructureFk(entity, entity.StructureCodeFk, 'StructureCodeFk');
				});
				platformGridAPI.grids.invalidate(simulationGridId);
				platformGridAPI.grids.refresh(simulationGridId);
			}

			function validateStructureFk(entity, value, field) {
				let validation = {
					valid: true,
					apply: true
				};

				if (entity.Selected && !value) {
					let fieldName = $translate.instant('estimate.main.prcStructureFk');
					validation.valid = false;
					validation.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					platformRuntimeDataService.applyValidationResult(validation, entity, field);
				} else {
					platformRuntimeDataService.applyValidationResult(validation, entity, field);
				}

				setTimeout(function () {
					if (angular.isFunction($scope.validateBoqPackageItem)) {
						$scope.validateBoqPackageItem($scope.entity.boqPackageAssignmentEntity);
					}
				});

				return validation;
			}

			function setCode(simulation) {
				if (!simulation) {
					return;
				}
				if (simulation.Selected && simulation.ConfigurationFk) {
					const configurations = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');
					if (configurations) {
						const configuration = _.find(configurations, {Id: simulation.ConfigurationFk});
						if (configuration) {
							const hasTo = procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(configuration.RubricCategoryFk);
							if (hasTo) {
								simulation.Code = isGenerated;
							}
						}
					}
				} else {
					simulation.Code = simulation.Code === isGenerated ? null : simulation.Code;
				}
			}
		}

		function setReadOnly(item, model, flg) {
			platformRuntimeDataService.readonly(item, [{
				field: model,
				readonly: flg
			}]);
		}

		function isPackageCodeUnique(entity, value) {
			const error = $translate.instant('procurement.requisition.ReqHeaderReferenceUniqueError');

			return $http.get(globals.webApiBaseUrl + 'procurement/package/package/isunique' + '?id=' + entity.Id + '&projectFk=' + entity.ProjectFk + '&code=' + value)
				.then(function (result) {
					if (!result.data) {
						return {
							apply: true,
							valid: false,
							error: error
						};
					} else {
						return {
							apply: true,
							valid: true
						}
					}
				});
		}
	}
})();