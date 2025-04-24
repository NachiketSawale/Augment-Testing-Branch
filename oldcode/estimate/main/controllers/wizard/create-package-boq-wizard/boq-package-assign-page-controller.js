/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainBoqPackageAssignPageController', estimateMainBoqPackageAssignPageController);

	estimateMainBoqPackageAssignPageController.$inject = [
		'$scope', '$translate', '$injector', '$http', 'globals',
		'estimateMainPrcPackage2HeaderLookupDataService',
		'estimateMainWizardAssignPageSimulationGridService',
		'packageOptionsProfileService',
		'estimateMainBoqPackageAssignFormConfig',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'estimateMainPackageSourceTypeConfigService',
		'estimateMainService',
		'procurementPackageNumberGenerationSettingsService',
		'basicsLookupdataLookupDescriptorService',
		'boqHierarchy'
	]

	function estimateMainBoqPackageAssignPageController(
		$scope, $translate, $injector, $http, globals,
		estimateMainPrcPackage2HeaderLookupDataService,
		estimateMainWizardAssignPageSimulationGridService,
		packageOptionsProfileService,
		estimateMainBoqPackageAssignFormConfig,
		platformRuntimeDataService,
		basicsLookupdataLookupFilterService,
		estimateMainPackageSourceTypeConfigService,
		estimateMainService,
		procurementPackageNumberGenerationSettingsService,
		basicsLookupdataLookupDescriptorService,
		boqHierarchy
	) {
		let firstLoadedSimulationData = [];
		let simulationGridId = '5c445b5f2a1a40f1925bd5c5cf6155f2';
		let wizardService = $injector.get('estimateMainCreateBoQPackageWizardService');
		let PACKAGE_SOURCE_TYPE = estimateMainPackageSourceTypeConfigService.PACKAGE_SOURCE_TYPE;
		let PRC_STRUCTURE_TYPE = estimateMainPackageSourceTypeConfigService.PRC_STRUCTURE_TYPE;
		$scope.entity.hideLookup = true;
		$scope.entity.boqPackageAssignmentEntity.IsCreateNew = false;
		$scope.entity.boqPackageAssignmentEntity.IsReadOnlyPackageCode = !$scope.entity.boqPackageAssignmentEntity.IsCreateNew &&
			!$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages;
		$scope.hasNewItem = false;
		$scope.isLoading = false;
		$scope.simulation = {
			state: simulationGridId
		};
		$scope.boqHierarchy = boqHierarchy;
		let config = {};

		$scope.updateOptions = {
			optionProfile: null
		};

		$scope.errorMessage = null;
		$scope.noteMessage = null;

		$scope.createUpdateBoQInPackageOptions = {
			ctrlId: 'createUpdateBoQInPackage',
			labelText: $translate.instant('estimate.main.createBoqPackageWizard.createUpdateBoQInPackage')
		};

		$scope.isConsiderBoqQtyRelationOptions = {
			ctrlId: 'considerBoqQtyRelation',
			labelText: $translate.instant('estimate.main.createBoqPackageWizard.isConsiderBoqQtyRelation')
		};

		$scope.isControllingUnitOptions = {
			ctrlId: 'isControllingUnit',
			labelText: $translate.instant('estimate.main.createBoqPackageWizard.controllingUnitAsBoQDivision')
		};

		$scope.isAggregateOptions = {
			ctrlId: 'isAggregate',
			labelText: $translate.instant('estimate.main.createBoqPackageWizard.isAggregateLineItem') + '/' +
				$translate.instant('estimate.main.createMaterialPackageWizard.aggregateProfileItem')
		};

		$scope.uniqueFieldsProfileOptions = estimateMainBoqPackageAssignFormConfig
			.getUniqueFieldsProfileOptions(wizardService.uniqueFieldsProfileService);

		$scope.costTransferOptionProfileOptions = estimateMainBoqPackageAssignFormConfig
			.getCostTransferOptionProfileOptions({
				disable: function () {
					return !$scope.entity.boqPackageAssignmentEntity.CreateUpdateBoQInPackage;
				}
			});

		$scope.prcStructureLookupOptions = estimateMainBoqPackageAssignFormConfig
			.getPrcStructureLookupOptions(wizardService);

		$scope.configurationLookupOptions = estimateMainBoqPackageAssignFormConfig.getConfigurationLookupOptions();

		$scope.clerkLookupOptions = estimateMainBoqPackageAssignFormConfig.getClerkLookupOptions();

		$scope.optionProfileOptions = {
			service: packageOptionsProfileService,
			getUpdateOptions: function () {
				return getOptions();
			},
			type: 'boq'
		};

		$scope.quantityTransferFromOptions = estimateMainBoqPackageAssignFormConfig.getQuantityTransferFromOptions();

		$scope.isCreateNewOptions = {
			ctrlId: 'isCreateNew',
			labelText: $translate.instant('estimate.main.createMaterialPackageWizard.onePackageAll')
		};

		$scope.isToCreateSeparatePackagesOptions = {
			ctrlId: 'isToCreateSeparatePackages',
			labelText: $translate.instant('estimate.main.createBoqPackageWizard.separatePackage')
		};

		$scope.isSkipBoqPositionAsDivisionBoqOptions = {
			ctrlId: 'isSkipBoqPositionAsDivisionBoq',
			labelText: $translate.instant('estimate.main.createBoqPackageWizard.isSkipPositionBoqAsDivisionBoq')
		};

		$scope.hidePackageWithMaterialOrNonCurrentCriteriaOptions = estimateMainBoqPackageAssignFormConfig.getHidePackageWithMaterialOrNonCurrentCriteriaOptions();

		$scope.lineItemWithNoResourcesFlagOptions = estimateMainBoqPackageAssignFormConfig.getLineItemWithNoResourcesFlagOptions();

		$scope.packageLookupOptions = estimateMainBoqPackageAssignFormConfig.getPackageLookupOptions();
		$scope.packageLookupOptions.readOnlyField = 'hideLookup';
		$scope.packageLookupOptions.isDescriptionReadonly = function () {
			return !$scope.entity.boqPackageAssignmentEntity.IsCreateNew && !$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages;
		};
		$scope.getConfig = getConfig;

		const gridService = estimateMainWizardAssignPageSimulationGridService.getService($scope, simulationGridId,
			'createBoqPackageAssignPage', getFirstLoadedSimulationData, setFirstLoadedSimulationData);

		estimateMainBoqPackageAssignFormConfig.registerLookupFilter();

		$scope.$on('$destroy', function () {
			gridService.unregisterMessengers();
			packageOptionsProfileService.reset();
			packageOptionsProfileService.selectItemChanged.unregister(onSelectOptionItemChanged);
			if (unwatch) {
				unwatch();
			}
			wizardService.isPackageGenerating.unregister(onIsPackageGeneration);
		});

		$scope.valueChanged = valueChanged;
		$scope.isForStructure = isForStructure;
		$scope.canShowQuantityTransferFrom = canShowQuantityTransferFrom;
		$scope.resetToDefaultSetting = resetToDefaultSetting;
		$scope.validateBoqPackageItem = validateBoqPackageItem;
		$scope.reset = reset;
		$scope.canShowError = canShowError;
		$scope.canShowNote = canShowNote;
		$scope.isForResource = isForResource;
		$scope.isForBoq = isForBoq;

		const unwatch = $scope.$watch('hasNewItem', function (newValue) {
			platformRuntimeDataService.readonly($scope.entity, [
				{
					field: 'boqPackageAssignmentEntity.IsCreateNew',
					readonly: !newValue
				},
				{
					field: 'boqPackageAssignmentEntity.IsToCreateSeparatePackages',
					readonly: !newValue
				}
			]);

			let profile = packageOptionsProfileService.getSelectedItem();
			if (profile) {
				let propertyConfig = profile.PropertyConfig;
				if (propertyConfig) {
					let optionItem = JSON.parse(propertyConfig);
					if (newValue) {
						$scope.entity.boqPackageAssignmentEntity.IsCreateNew = optionItem.IsCreateNew;
						$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages = optionItem.IsToCreateSeparatePackages;
					} else {
						$scope.entity.boqPackageAssignmentEntity.IsCreateNew = false;
						$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages = false;
					}
					valueChanged('boqPackageAssignmentEntity.IsCreateNew');
					valueChanged('boqPackageAssignmentEntity.IsToCreateSeparatePackages');
					return;
				}
			}

			if (!newValue) {
				$scope.entity.boqPackageAssignmentEntity.IsCreateNew = false;
				$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages = false;
				valueChanged('boqPackageAssignmentEntity.IsCreateNew');
				valueChanged('boqPackageAssignmentEntity.IsToCreateSeparatePackages');
			}
		});

		wizardService.isPackageGenerating.register(onIsPackageGeneration);

		loadSimulationPage();

		function loadSimulationPage() {
			const columns = gridService.getGridColumns();

			const customBoqBaseColumns = [
				{
					id: 'boqHeader',
					field: 'BoqHeader',
					name: 'BoQ Header',
					name$tr$: 'cloud.common.entityBoqHeaderFk',
					sortable: true,
					width: 90,
					formatter: 'description'
				},
				{
					id: 'boqReference',
					field: 'BoqReference',
					name: 'Reference No.',
					name$tr$: 'cloud.common.entityReferenceNo',
					sortable: true,
					width: 90,
					formatter: 'description'
				},
				{
					id: 'brief',
					field: 'BoqBriefInfo',
					name: 'Outline Specification',
					name$tr$: 'cloud.common.entityBriefInfo',
					sortable: true,
					width: 120,
					formatter: 'translation'
				}
			];

			const customBoqOtherInfoColumns = [
				{
					id: 'boqUomFk',
					field: 'BoqUomFk',
					name: 'BoQ UoM',
					name$tr$: 'estimate.main.createBoqPackageWizard.assignPage.simulation.boqUom',
					sortable: true,
					width: 90,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					}
				},
				{
					id: 'boqLineTypeFk',
					field: 'BoqLineTypeFk',
					name: 'BoQ Line Type',
					name$tr$: 'cloud.common.entityBoqLineType',
					sortable: true,
					width: 90,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BoQLineType',
						displayMember: 'Description'
					}
				}
			];

			const customStructureColumns = [
				{
					id: 'Structure Code',
					field: 'BasicStructureCodeFk',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'prcstructure',
						displayMember: 'Code'
					}
				},
				{
					id: 'Structure Description',
					field: 'BasicStructureCodeFk',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'prcstructure',
						displayMember: 'DescriptionInfo.Translated'
					}
				}
			];

			const customResourceColumns = [
				{
					id: 'lineItemCode',
					field: 'LineItemCode',
					name: 'LI Code',
					toolTip$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemCode',
					formatter: 'code',
					name$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemCode',
					width: 142
				},
				{
					id: 'lineItemDesc',
					field: 'LineItemDescription',
					name: 'Line Item Description',
					toolTip$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemDesc',
					formatter: 'description',
					name$tr$: 'estimate.main.createBoqPackageWizard.resourceSelectionPage.lineItemDesc',
					width: 200
				},
				{
					id: 'resourceCode',
					field: 'ResourceCode',
					name: 'Resource Code',
					name$tr$: 'estimate.main.createBoqPackageWizard.assignPage.simulation.resourceCode',
					formatter: 'code',
					width: 100
				},
				{
					id: 'resourceDescription',
					field: 'ResourceDescription',
					name: 'Resource Description',
					name$tr$: 'estimate.main.createBoqPackageWizard.assignPage.simulation.resourceDesc',
					formatter: 'description',
					width: 120
				},
				{
					id: 'resourceUomFk',
					field: 'ResourceUomFk',
					name: 'Resource UoM',
					name$tr$: 'estimate.main.createBoqPackageWizard.assignPage.simulation.resourceUom',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					width: 100
				},
			];

			let index = 3;

			if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value || $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value) {
				customBoqBaseColumns.forEach(function (col) {
					columns.splice(++index, 0, col);
				});
			}

			if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value) {
				customBoqOtherInfoColumns.forEach(function (col) {
					columns.splice(++index, 0, col);
				});
			}

			if ($scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value ||
				$scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.value) {
				customStructureColumns.forEach(function (col) {
					columns.splice(++index, 0, col);
				});
			}

			if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value) {
				customResourceColumns.forEach(function (col) {
					columns.splice(++index, 0, col);
				});
			}

			gridService.setupSimulationGrid(columns);
			$scope.isLoading = true;
			getSimulationData().then(function (list) {
				gridService.updateSimulationGrid(list);
				gridService.checkHasNewItem(list);
			})
				.finally(function () {
					$scope.isLoading = false;
				});

			packageOptionsProfileService.selectItemChanged.register(onSelectOptionItemChanged);
			packageOptionsProfileService.reset();
			packageOptionsProfileService.load('boq');
			procurementPackageNumberGenerationSettingsService.assertLoaded();
		}

		function getFirstLoadedSimulationData() {
			return firstLoadedSimulationData;
		}

		function setFirstLoadedSimulationData(data) {
			firstLoadedSimulationData = data;
		}

		function canShowQuantityTransferFrom() {
			return $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value ||
				$scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value;
		}

		function valueChanged(field) {
			wizardService.entityChanged($scope.entity, field);

			if (field === 'boqPackageAssignmentEntity.IsCreateNew' ||
				field === 'boqPackageAssignmentEntity.IsToCreateSeparatePackages') {
				if ($scope.entity.boqPackageAssignmentEntity.IsCreateNew ||
					$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages) {
					gridService.removeStructureMandatoryError();
				} else {
					gridService.doValidateStructureFk();
				}
			}
		}

		function getConfig(key) {
			if (config[key]) {
				return config[key];
			}

			config[key] = {
				rt$readonly: function () {
					return platformRuntimeDataService.isReadonly($scope.entity, key);
				}
			};

			if (key === 'boqPackageAssignmentEntity.Package.Reference') {
				config[key].maxLength = estimateMainBoqPackageAssignFormConfig.getPackageReferenceLen();
			}

			return config[key];
		}

		function getOptions() {
			return {
				optionProfile: $scope.updateOptions.optionProfile,
				IsCreateNew: $scope.entity.boqPackageAssignmentEntity.IsCreateNew,
				IsToCreateSeparatePackages: $scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages,
				CreateUpdateBoQInPackage: $scope.entity.boqPackageAssignmentEntity.CreateUpdateBoQInPackage,
				IsConsiderBoqQtyRelation: $scope.entity.boqPackageAssignmentEntity.IsConsiderBoqQtyRelation,
				IsControllingUnit: $scope.entity.boqPackageAssignmentEntity.IsControllingUnit,
				QuantityTransferFrom: $scope.entity.boqPackageAssignmentEntity.QuantityTransferFrom,
				isAggregate: $scope.entity.boqPackageAssignmentEntity.isAggregate,
				lineItemWithNoResourcesFlag: $scope.entity.boqPackageAssignmentEntity.lineItemWithNoResourcesFlag,
				uniqueFieldsProfile: $scope.entity.boqPackageAssignmentEntity.uniqueFieldsProfile,
				BoqStructureOption4SourceResources: $scope.entity.boqPackageAssignmentEntity.BoqStructureOption4SourceResources,
				IsSkipBoqPositionAsDivisionBoq: $scope.entity.boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq
			};
		}

		function onSelectOptionItemChanged() {
			let profile = packageOptionsProfileService.getSelectedItem();
			if (profile) {
				$scope.updateOptions.optionProfile = packageOptionsProfileService.getDescription(profile);
				let propertyConfig = profile.PropertyConfig;
				let changeUniqueProfile = null;
				if (propertyConfig) {
					let optionItem = JSON.parse(propertyConfig);
					if ($scope.hasNewItem) {
						$scope.entity.boqPackageAssignmentEntity.IsCreateNew = optionItem.IsCreateNew;
						$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages = optionItem.IsToCreateSeparatePackages;
					} else {
						$scope.entity.boqPackageAssignmentEntity.IsCreateNew = false;
						$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages = false;
					}

					$scope.entity.boqPackageAssignmentEntity.IsReadOnlyPackageCode = !$scope.entity.boqPackageAssignmentEntity.IsCreateNew &&
						!$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages;

					$scope.entity.boqPackageAssignmentEntity.CreateUpdateBoQInPackage = optionItem.CreateUpdateBoQInPackage;
					$scope.entity.boqPackageAssignmentEntity.IsConsiderBoqQtyRelation = optionItem.IsConsiderBoqQtyRelation;
					$scope.entity.boqPackageAssignmentEntity.IsControllingUnit = optionItem.IsControllingUnit;
					$scope.entity.boqPackageAssignmentEntity.QuantityTransferFrom = optionItem.QuantityTransferFrom ||
						$scope.entity.boqPackageAssignmentEntity.QuantityTransferFrom;
					$scope.entity.boqPackageAssignmentEntity.isAggregate = optionItem.isAggregate;
					$scope.entity.boqPackageAssignmentEntity.lineItemWithNoResourcesFlag = optionItem.lineItemWithNoResourcesFlag;

					if (optionItem.uniqueFieldsProfile && optionItem.uniqueFieldsProfile.length > 0) {
						changeUniqueProfile = optionItem.uniqueFieldsProfile;
					} else {
						changeUniqueProfile = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
					}

					if (angular.isDefined(optionItem.BoqStructureOption4SourceResources)) {
						$scope.entity.boqPackageAssignmentEntity.BoqStructureOption4SourceResources = optionItem.BoqStructureOption4SourceResources;
					}

					if (angular.isDefined(optionItem.IsSkipBoqPositionAsDivisionBoq)) {
						$scope.entity.boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq = optionItem.IsSkipBoqPositionAsDivisionBoq;
					}
				} else {
					const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
					resetToDefaultSetting();
					changeUniqueProfile = newProfileName;
				}
				if (changeUniqueProfile) {
					wizardService.uniqueFieldsProfileService.setSelectedItemDesc(changeUniqueProfile);
					const exist = wizardService.uniqueFieldsProfileService.getSelectedItem();
					if (!exist) {
						const newProfileName = $translate.instant('basics.common.dialog.saveProfile.newProfileName');
						changeUniqueProfile = newProfileName;
						wizardService.uniqueFieldsProfileService.setSelectedItemDesc(changeUniqueProfile);
					}
				}

				valueChanged('boqPackageAssignmentEntity.IsCreateNew');
				valueChanged('boqPackageAssignmentEntity.IsToCreateSeparatePackages');
				valueChanged('boqPackageAssignmentEntity.CreateUpdateBoQInPackage');
				valueChanged('boqPackageAssignmentEntity.IsConsiderBoqQtyRelation');
				valueChanged('boqPackageAssignmentEntity.IsControllingUnit');
				valueChanged('boqPackageAssignmentEntity.QuantityTransferFrom');
				valueChanged('boqPackageAssignmentEntity.isAggregate');
				valueChanged('boqPackageAssignmentEntity.lineItemWithNoResourcesFlag');
				valueChanged('boqPackageAssignmentEntity.BoqStructureOption4SourceResources');
			}
		}

		function resetToDefaultSetting() {
			$scope.entity.boqPackageAssignmentEntity.IsCreateNew = false;
			$scope.entity.boqPackageAssignmentEntity.IsReadOnlyPackageCode = !$scope.entity.boqPackageAssignmentEntity.IsCreateNew &&
				!$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages;
			$scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages = false;
			$scope.entity.boqPackageAssignmentEntity.CreateUpdateBoQInPackage = true;
			$scope.entity.boqPackageAssignmentEntity.IsConsiderBoqQtyRelation = false;
			$scope.entity.boqPackageAssignmentEntity.IsControllingUnit = false;
			$scope.entity.boqPackageAssignmentEntity.isAggregate = true;
			$scope.entity.boqPackageAssignmentEntity.lineItemWithNoResourcesFlag = true;
			$scope.entity.boqPackageAssignmentEntity.BoqStructureOption4SourceResources = boqHierarchy.projectBoqAndLineItem;
			$scope.entity.boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq = true;
			valueChanged('boqPackageAssignmentEntity.IsCreateNew');
			valueChanged('boqPackageAssignmentEntity.IsToCreateSeparatePackages');
			valueChanged('boqPackageAssignmentEntity.CreateUpdateBoQInPackage');
			valueChanged('boqPackageAssignmentEntity.IsConsiderBoqQtyRelation');
			valueChanged('boqPackageAssignmentEntity.IsControllingUnit');
			valueChanged('boqPackageAssignmentEntity.isAggregate');
			valueChanged('boqPackageAssignmentEntity.lineItemWithNoResourcesFlag');
			valueChanged('boqPackageAssignmentEntity.BoqStructureOption4SourceResources');
		}

		function getSimulationData() {
			const packageFilter = basicsLookupdataLookupFilterService.getFilterByKey('assign-boq-wizard-prc-package-filter');
			const additionalParameters = packageFilter.fn($scope.entity);
			let selectedParentId2DescendantIdsMap = null;
			let selectedPrcStructureIds = [];
			if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value) {
				selectedParentId2DescendantIdsMap = $scope.entity[PACKAGE_SOURCE_TYPE.PROJECT_BOQ.properties.selectedParentId2DescendantIdsMap];
			} else if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value) {
				selectedParentId2DescendantIdsMap = $scope.entity[PACKAGE_SOURCE_TYPE.WIC_BOQ.properties.selectedParentId2DescendantIdsMap];
			} else if ($scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value) {
				selectedParentId2DescendantIdsMap = $scope.entity[PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.properties.selectedParentId2DescendantIdsMap];
				const temp = $scope.entity[PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.properties.selectedList];
				if (!temp || temp.length === 0) {
					selectedPrcStructureIds.push(0);
				} else {
					selectedPrcStructureIds = temp;
				}
			} else if ($scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.value) {
				selectedParentId2DescendantIdsMap = $scope.entity[PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.properties.selectedParentId2DescendantIdsMap];
				const temp = $scope.entity[PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.properties.selectedList];
				if (!temp || temp.length === 0) {
					selectedPrcStructureIds.push(0);
				} else {
					selectedPrcStructureIds = temp;
				}
			}
			const options = {
				PackageLookupRequest: {
					SearchFields: [],
					SearchText: "",
					AdditionalParameters: additionalParameters || {},
					TreeState: {
						StartId: null,
						Depth: null
					},
					RequirePaging: true,
					PageState: {
						PageNumber: 0,
						PageSize: 200
					}
				},
				SelectedPrjBoqItemIds: $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value ?
					$scope.entity[PACKAGE_SOURCE_TYPE.PROJECT_BOQ.properties.selectedIdentificationIdList] : null,
				SelectedWicBoqItemIds: $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value ?
					$scope.entity[PACKAGE_SOURCE_TYPE.PROJECT_BOQ.properties.selectedIdentificationIdList] : null,
				SelectedPrjBoqPrcStructureIds: $scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value ?
					selectedPrcStructureIds : null,
				SelectedLineItemPrcStructureIds: $scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.value ?
					selectedPrcStructureIds : null,
				SelectedResourceIds: $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value ?
					$scope.entity[PACKAGE_SOURCE_TYPE.RESOURCE.properties.selectedList] : null,
				SelectedParentId2DescendantIdsMap: selectedParentId2DescendantIdsMap,
				MatchedEstHeaderId2LineItemIdsMap: $scope.entity.boqPackageAssignmentEntity.MatchedEstHeaderId2LineItemIdsMap,
				DefaultStructureId: $scope.entity.boqPackageAssignmentEntity.defaultStructureFk || null, // if default structurefk is 0, it means it is N/A. set it to null before sending back to backend
				DefaultConfigurationId: $scope.entity.boqPackageAssignmentEntity.Package.ConfigurationFk,
				DefaultProjectId: estimateMainService.getProjectId(),
				DefaultDescription: $scope.entity.defaultDescription
			};
			return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/getsimulationsfrocreatepackageboqfromestimate', options)
				.then(function (response) {
					const list = response && response.data ? response.data : [];
					for (let i = 0; i < list.length; ++i) {
						const item = list[i];
						if (item.BasicStructureCodeFk === 0) {
							basicsLookupdataLookupDescriptorService.attachData({
								prcstructure: [{
									Id: 0,
									Code: 'N/A',
									DescriptionInfo: {
										Translated: null
									}
								}]
							});
						}
						if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value && $scope.entity.resourceInfo) {
							const resource = $scope.entity.resourceInfo.resources ? $scope.entity.resourceInfo.resources.find(e =>
								e.Id === item.ResourceFk &&
								e.EstHeaderFk === item.EstHeaderFk &&
								e.EstLineItemFk === item.EstLineItemFk
							) : null;
							if (resource) {
								item.ResourceCode = resource.Code;
								item.ResourceDescription = resource.DescriptionInfo.Translated;
								item.ResourceUomFk = resource.BasUomFk;
							}
							const lineItem = $scope.entity.resourceInfo.matchedLineItemBaseInfoList ?
								$scope.entity.resourceInfo.matchedLineItemBaseInfoList.find(function (data) {
									return data.Id === item.EstLineItemFk && data.EstHeaderFk === item.EstHeaderFk
								}) : null;
							if (lineItem) {
								item.LineItemCode = lineItem.Code;
								item.LineItemDescription = lineItem.DescriptionInfo.Translated;
							}
						}
					}
					return list;
				});
		}

		function onIsPackageGeneration(value) {
			$scope.isLoading = value;
		}

		function validateBoqPackageItem(entity) {
			wizardService.validateBoqPackageItem(entity);
		}

		function reset() {
			const list = angular.copy(getFirstLoadedSimulationData());
			gridService.updateSimulationGrid(list);
			gridService.checkHasNewItem(list);
		}

		function canShowError() {
			if ($scope.entity.boqPackageAssignmentEntity.IsCreateNew || $scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages) {
				return false;
			}
			let hasError = false;
			const simulations = $scope.entity.boqPackageAssignmentEntity.simulationData;
			if (!simulations || simulations.length === 0) {
				return hasError;
			}

			_.forEach(simulations, function (simulation) {
				hasError = hasError || platformRuntimeDataService.hasError(simulation, 'Code');
				hasError = hasError || platformRuntimeDataService.hasError(simulation, 'StructureCodeFk');
			});

			if (hasError) {
				$scope.errorMessage = $translate.instant('estimate.main.createBoqPackageWizard.assignPage.noStructureDataError');
			}

			return hasError;
		}

		function canShowNote() {
			if ($scope.entity.boqPackageAssignmentEntity.IsCreateNew || $scope.entity.boqPackageAssignmentEntity.IsToCreateSeparatePackages) {
				return false;
			}
			let canShow = false;
			const simulations = $scope.entity.boqPackageAssignmentEntity.simulationData;
			if (!simulations || simulations.length === 0) {
				return canShow;
			}

			let newPackageCount = 0; // only for resource

			if ($scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value) {
				_.forEach(simulations, function (simulation) {
					if (simulation.Selected) { // for new package
						newPackageCount++;
					}
				});
			}
			if (newPackageCount > 10) {
				$scope.noteMessage = $translate.instant('estimate.main.createBoqPackageWizard.assignPage.moreThanTenResourcesInfo', {count: newPackageCount});
				canShow = true;
			}

			return canShow;
		}

		function isForResource() {
			return $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.RESOURCE.value;
		}

		function isForBoq() {
			return $scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.PROJECT_BOQ.value ||
				$scope.entity.packageSourceType === PACKAGE_SOURCE_TYPE.WIC_BOQ.value;
		}

		function isForStructure() {
			return $scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_LINE_ITEM.value ||
				$scope.entity.packageSourceType === PRC_STRUCTURE_TYPE.PRC_STRUCTURE_PROJECT_BOQ.value;
		}
	}

})();