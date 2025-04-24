/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainUpdatePackageBoqUpdatePageController', estimateMainUpdatePackageBoqUpdatePageController);

	estimateMainUpdatePackageBoqUpdatePageController.$inject = [
		'$scope',
		'$q',
		'$http',
		'$translate',
		'$timeout',
		'_',
		'moment',
		'globals',
		'platformRuntimeDataService',
		'basicsCommonEstimateLineItemFieldsValue',
		'basicsCommonUniqueFieldsProfileService',
		'basicsLookupdataLookupFilterService',
		'basicsCommonQuantityTransferFormConstant',
		'platformGridAPI',
		'platformTranslateService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformModalService',
		'platformGridControllerService',
		'estimateMainUpdatePackageBoqPackageDataService'
	];

	function estimateMainUpdatePackageBoqUpdatePageController(
		$scope,
		$q,
		$http,
		$translate,
		$timeout,
		_,
		moment,
		globals,
		platformRuntimeDataService,
		basicsCommonEstimateLineItemFieldsValue,
		basicsCommonUniqueFieldsProfileService,
		basicsLookupdataLookupFilterService,
		basicsCommonQuantityTransferFormConstant,
		platformGridAPI,
		platformTranslateService,
		basicsCommonHeaderColumnCheckboxControllerService,
		platformModalService,
		platformGridControllerService,
		estimateMainUpdatePackageBoqPackageDataService
	) {

		let packagesToProcess = [];
		let updateOptionToCreate = null;

		let packageGridId = '7d94dc75f6ab40a9a604f065f06e1bf3';
		let identityName = 'update.packageboq.from.estimate';
		let uniqueFieldsProfileService = basicsCommonUniqueFieldsProfileService.getService(identityName);
		let specialData = [{model: 'DescriptionInfo'}, {model: 'BasUomTargetFk'}];
		let processIndex = 0;
		uniqueFieldsProfileService.setReadonlyData(specialData);
		uniqueFieldsProfileService.setMustSelectedData(specialData);
		uniqueFieldsProfileService.setIsBoq(true);

		let source = {
			fromPrjBoq: 1,
			fromWicBoq: 2,
			fromLineItem: 3,
			fromResource: 4
		};

		let filters = [
			{
				key: 'estimate-wizard-update-boq-quantity-transfer-from',
				fn: function (item) {
					if ($scope.updateOption.selectCriteriaOption === source.fromWicBoq) {
						return item.value === basicsCommonQuantityTransferFormConstant.lineItemAQ || item.value === basicsCommonQuantityTransferFormConstant.lineItemWQ;
					}
					return true;
				}
			}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		let packageColumns = [
			{
				id: 'isSelected',
				field: 'isSelected',
				name$tr$: 'cloud.common.entitySelected',
				toolTip$tr$: 'cloud.common.entitySelected',
				formatter: 'boolean',
				editor: 'boolean',
				headerChkbox: true,
				cssClass: 'cell-center',
				sortable: true,
				width: 80
			},
			{
				id: 'updateStatus',
				field: 'updateStatus',
				name$tr$: 'cloud.common.entityUpdated',
				toolTip$tr$: 'cloud.common.entityUpdated',
				formatter: updateResultFormatter,
				sortable: true,
				width: 80
			},
			{
				id: 'code',
				field: 'Code',
				name$tr$: 'cloud.common.entityCode',
				toolTip$tr$: 'cloud.common.entityCode',
				formatter: 'code',
				sortable: true,
				searchable: true,
				width: 100
			},
			{
				id: 'description',
				field: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				toolTip$tr$: 'cloud.common.entityDescription',
				formatter: 'code',
				sortable: true,
				searchable: true,
				width: 110
			},
			{
				id: 'packageStatusDescription',
				field: 'PackageStatusFk',
				name$tr$: 'cloud.common.entityState',
				toolTip$tr$: 'cloud.common.entityState',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'PackageStatus',
					'displayMember': 'DescriptionInfo.Translated',
					'imageSelector': 'platformStatusIconService'
				},
				sortable: true,
				width: 100
			},
			{
				id: 'packageConfigurationDescription',
				field: 'ConfigurationFk',
				name$tr$: 'basics.common.packageColumn.prcConfigurationDescription',
				toolTip$tr$: 'basics.common.packageColumn.prcConfigurationDescription',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'prcconfiguration',
					displayMember: 'DescriptionInfo.Translated'
				},
				sortable: true,
				width: 100
			},
			{
				id: 'packageStructure',
				field: 'StructureFk',
				name$tr$: 'basics.common.entityPrcStructureFk',
				toolTip$tr$: 'basics.common.entityPrcStructureFk',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'prcstructure',
					'displayMember': 'Code'
				},
				sortable: true,
				width: 110
			},
			{
				id: 'packageStructure',
				field: 'StructureFk',
				name$tr$: 'cloud.common.entityStructureDescription',
				toolTip$tr$: 'cloud.common.entityStructureDescription',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'prcstructure',
					'displayMember': 'DescriptionInfo.Translated'
				},
				sortable: true,
				width: 110
			},
			{
				id: 'packageRequestOwnerCode',
				field: 'ClerkReqFk',
				name$tr$: 'cloud.common.entityRequisitionOwner',
				toolTip$tr$: 'cloud.common.entityRequisitionOwner',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'clerk',
					'displayMember': 'Code'
				},
				sortable: true,
				width: 110
			},
			{
				id: 'packageRequestOwnerDesc',
				field: 'ClerkReqFk',
				name$tr$: 'cloud.common.entityRequisitionOwnerDescription',
				toolTip$tr$: 'cloud.common.entityRequisitionOwnerDescription',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'clerk',
					'displayMember': 'Description'
				},
				sortable: true,
				width: 120
			},
			{
				id: 'packageResponsibleCode',
				field: 'ClerkPrcFk',
				name$tr$: 'cloud.common.entityResponsible',
				toolTip$tr$: 'cloud.common.entityResponsible',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'clerk',
					'displayMember': 'Code'
				},
				sortable: true,
				width: 110
			},
			{
				id: 'packageResponsibleDesc',
				field: 'ClerkPrcFk',
				name$tr$: 'cloud.common.entityResponsibleDescription',
				toolTip$tr$: 'cloud.common.entityResponsibleDescription',
				'formatter': 'lookup',
				'formatterOptions': {
					'lookupType': 'clerk',
					'displayMember': 'Description'
				},
				sortable: true,
				width: 120
			},
			{
				id: 'plannedStart',
				field: 'PlannedStart',
				name$tr$: 'basics.common.packageColumn.plannedStart',
				toolTip$tr$: 'basics.common.packageColumn.plannedStart',
				formatter: 'dateutc',
				sortable: true
			},
			{
				id: 'plannedEnd',
				field: 'PlannedEnd',
				name$tr$: 'basics.common.packageColumn.plannedEnd',
				toolTip$tr$: 'basics.common.packageColumn.plannedEnd',
				formatter: 'dateutc',
				sortable: true
			},
			{
				id: 'actualStart',
				field: 'ActualStart',
				name$tr$: 'basics.common.packageColumn.actualStart',
				toolTip$tr$: 'basics.common.packageColumn.actualStart',
				formatter: 'dateutc',
				sortable: true
			},
			{
				id: 'actualEnd',
				field: 'ActualEnd',
				name$tr$: 'basics.common.packageColumn.actualEnd',
				toolTip$tr$: 'basics.common.packageColumn.actualEnd',
				formatter: 'dateutc',
				sortable: true
			},
			{
				id: 'isMaterial',
				field: 'IsMaterial',
				name$tr$: 'basics.common.updateOption.isMaterial',
				toolTip$tr$: 'basics.common.updateOption.isMaterial',
				formatter: booleanFormatter,
				sortable: true,
				width: 80
			},
			{
				id: 'isService',
				field: 'IsService',
				name$tr$: 'basics.common.updateOption.isService',
				toolTip$tr$: 'basics.common.updateOption.isService',
				formatter: booleanFormatter,
				sortable: true,
				width: 80
			},
			{
				id: 'boqCriteria',
				field: 'BoqCriteria',
				name$tr$: 'basics.common.updateOption.boqCriteria',
				toolTip$tr$: 'basics.common.updateOption.boqCriteria',
				formatter: 'lookup',// booleanFormatter,
				formatterOptions: {
					lookupType: 'BoqCreateCriteriaType',
					displayMember: 'Description'
				},
				sortable: true,
				width: 110
			},
			{
				id: 'boqQtySource',
				field: 'BoqQtySource',
				name$tr$: 'basics.common.updateOption.boqQtySource',
				toolTip$tr$: 'basics.common.updateOption.boqQtySource',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'quantityTransferFrom',
					valueMember: 'Id',
					displayMember: 'description'
				},
				sortable: true,
				width: 110
			},
			{
				id: 'isConsideredQtyRel',
				field: 'IsConsideredQtyRel',
				name$tr$: 'basics.common.updateOption.isConsideredQtyRel',
				toolTip$tr$: 'basics.common.updateOption.isConsideredQtyRel',
				formatter: booleanFormatter,
				sortable: true,
				width: 110
			}
		];

		let updateOptions = {
			showGrouping: false,
			skipPermissionCheck: true,
			groups: [{
				gid: '1',
				header: '',
				isOpen: true,
				sortOrder: 1
			}],
			rows: [
				{
					gid: '1',
					rid: 'selectCriteriaOption',
					label: $translate.instant('basics.common.updatePackageBoq.criteriaType.selectCriteriaCreateBoq'),
					model: 'selectCriteriaOption',
					type: 'directive',
					directive: 'generate-boq-item-criteria-type-combobox',
					visible: true,
					sortOrder: 1,
					width: 150,
					options: {
						'showClearButton': false
					},
					validator: 'onCriteriaTypeSelectRowsChanged'
				},
				{
					gid: '1',
					rid: 'quantityTransferFrom',
					label: $translate.instant('basics.common.uniqueFields.quantityTransferFromLabel'),
					model: 'quantityTransferFrom',
					type: 'directive',
					directive: 'basics-common-quantity-transfer-form-lookup',
					sortOrder: 1,
					visible: true,
					validator: 'onQuantityTransferFromChanged',
					options: {
						filterKey: 'estimate-wizard-update-boq-quantity-transfer-from'
					}
				},
				{
					gid: '1',
					rid: 'considerBoqQtyRel',
					label: $translate.instant('basics.common.uniqueFields.considerBoqQtyRelation'),
					model: 'considerBoqQtyRelation',
					type: 'boolean',
					sortOrder: 1,
					visible: false
				},
				{
					gid: '1',
					rid: 'isAggregate',
					label: $translate.instant('basics.common.uniqueFields.isAggregate'),
					model: 'isAggregate',
					type: 'boolean',
					sortOrder: 1,
					visible: false,
					validator: 'onIsAggregateRowsChanged'
				},
				{
					gid: '1',
					rid: 'uniqueFieldProfile',
					label: $translate.instant('basics.common.uniqueFields.uniqueFieldsProfile'),
					model: 'uniqueFieldsProfile',
					type: 'directive',
					directive: 'basics-common-unique-fields-profile-lookup',
					options: {
						service: uniqueFieldsProfileService
					},
					sortOrder: 1,
					visible: false
				},
				{
					gid: '1',
					rid: 'controllingUnit',
					label: $translate.instant('basics.common.updatePackageBoq.criteriaType.controllingUnitAsTitle'),
					model: 'isControllingUnitAsTitle',
					type: 'boolean',
					sortOrder: 1,
					visible: false
				},
				{
					'gid': '1',
					'rid': 'projectBoqAndLineItemAsHierarchy',
					'label': 'Boq Hierarchy',
					'label$tr$': 'estimate.main.createBoqPackageWizard.boqHierarchy',
					'model': 'boqStructureOption4SourceResources',
					'type': 'radio',
					'options': {
						valueMember: 'value',
						labelMember: 'label',
						groupName: 'boqStructure4SourceResources',
						items: [
							{
								value: 1,
								label: $translate.instant('estimate.main.createBoqPackageWizard.projectBoqAndLineItemAsBoqHierarchy')
							}
						]
					},
					'sortOrder': 1,
					validator: 'onResourceBoqStructureOptionChanged',
					visible: false
				},
				{
					'gid': '1',
					'rid': 'isSkipPositionBoqAsDivisionBoq',
					type: 'directive',
					directive: 'platform-composite-input',
					label: ' ',
					model: 'isSkipPositionBoqAsDivisionBoq',// use for validator
					options: {
						rows: [{
							model: 'isSkipPositionBoqAsDivisionBoq',
							type: 'boolean',
							options: {
								labelText: $translate.instant('estimate.main.createBoqPackageWizard.isSkipPositionBoqAsDivisionBoq')
							}
						}]
					},
					'sortOrder': 1,
					visible: false
				},
				{
					'gid': '1',
					'rid': 'lineItemAsHierarchy',
					'label': ' ',
					'model': 'boqStructureOption4SourceResources',
					'type': 'radio',
					'options': {
						valueMember: 'value',
						labelMember: 'label',
						groupName: 'boqStructure4SourceResources',
						items: [
							{
								value: 2,
								label: $translate.instant('estimate.main.createBoqPackageWizard.lineItemAsBoqHierarchy')
							}
						]
					},
					'sortOrder': 1,
					validator: 'onResourceBoqStructureOptionChanged',
					visible: false
				}
			]
		};

		$scope.modalOptions = $scope.modalOptions || {};
		$scope.modalOptions.isProcessing = false;
		$scope.modalOptions.processingInfo = '';

		$scope.updateOption = {
			selectCriteriaOption: source.fromPrjBoq,
			quantityTransferFrom: basicsCommonQuantityTransferFormConstant.boqWQAQ,
			considerBoqQtyRelation: false,
			isAggregate: true,
			uniqueFieldsProfile: null,
			isControllingUnitAsTitle: false,
			boqStructureOption4SourceResources: 1,
			isSkipPositionBoqAsDivisionBoq: true
		};

		$scope.updateOptions = {
			configure: updateOptions
		};

		addGrouping(packageColumns);

		// grid configuration
		$scope.getContainerUUID = getContainerUUID;
		$scope.setTools = setTools;
		$scope.onContentResized = onContentResized;

		if (platformGridAPI.grids.exist(getContainerUUID())) {
			platformGridAPI.grids.unregister(getContainerUUID());
		}

		if (!angular.isFunction($scope.removeToolByClass)) {
			$scope.removeToolByClass = removeToolByClass;
		}

		platformGridControllerService.initListController($scope, {
			getStandardConfigForListView: function () {
				return {
					columns: packageColumns
				};
			}
		}, estimateMainUpdatePackageBoqPackageDataService, {}, {
			initCalled: false,
			columns: [],
			skipPermissionCheck: true
		});

		$scope.addTools = addTools;

		let removeIndex = _.findIndex($scope.tools.items, {id: 't109'});

		if (removeIndex > -1) {
			$scope.tools.items.splice(removeIndex, 1);
		}

		removeIndex = _.findIndex($scope.tools.items, {cssClass: 'tlb-icons ico-settings'});

		if (removeIndex > -1) {
			$scope.tools.items.splice(removeIndex, 1, {
				id: 't111',
				sort: 112,
				caption: 'cloud.common.gridlayout',
				iconClass: 'tlb-icons ico-settings',
				type: 'item',
				fn: function () {
					platformGridAPI.configuration.openConfigDialog($scope.gridId);
				},
				disabled: function () {
					return false;
				}
			}
			);
		}

		let headerCheckBoxFields = ['isSelected'];
		let headerCheckBoxEvents = [
			{
				source: 'grid',
				name: 'onHeaderCheckboxChanged',
				fn:  function (e){
					let isSelected =(e.target.checked);
					let packages = estimateMainUpdatePackageBoqPackageDataService.packages;
					_.forEach(packages, function (item) {
						item.isSelected = isSelected;
					});
				}
			}
		];
		basicsCommonHeaderColumnCheckboxControllerService.setGridId(packageGridId);
		basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields,headerCheckBoxEvents);

		$scope.hidePackageOption = true;
		$scope.updateBudgetOnlyOption = false;
		$scope.canUpdate = canUpdate;
		$scope.update = update;
		$scope.previous = previous;

		// validators
		$scope.onCriteriaTypeSelectRowsChanged = onCriteriaTypeSelectRowsChanged;
		$scope.onQuantityTransferFromChanged = onQuantityTransferFromChanged;
		$scope.onIsAggregateRowsChanged = onIsAggregateRowsChanged;
		$scope.onHidePackageOptionChanged = onHidePackageOptionChanged;
		$scope.onUpdateBudgetOnlyOptionChanged = onUpdateBudgetOnlyOptionChanged;
		$scope.onResourceBoqStructureOptionChanged = onResourceBoqStructureOptionChanged;

		$scope.$on('$destroy', function () {
			uniqueFieldsProfileService.selectItemChanged.unregister(onSelectItemChanged);
			reset();
		});

		init();
		// /////////////////////////

		function init() {
			reset();
			uniqueFieldsProfileService.selectItemChanged.register(onSelectItemChanged);
			uniqueFieldsProfileService.reset();
			let packageFilter = angular.isFunction($scope.modalOptions.getPackageFilter) ? $scope.modalOptions.getPackageFilter() : {};
			estimateMainUpdatePackageBoqPackageDataService.packageFilter = packageFilter;
			$scope.modalOptions.isProcessing = true;
			$scope.modalOptions.processingInfo = $translate.instant('platform.processing');
			let loadUniqueFieldsPromise = updateDynamicUniqueFields(packageFilter);
			let loadPackagePromise = estimateMainUpdatePackageBoqPackageDataService.load();
			$q.all([loadUniqueFieldsPromise, loadPackagePromise])
				.finally(function () {
					$scope.modalOptions.isProcessing = false;
				});

			// //////////////////////////
			function updateDynamicUniqueFields(packageFilter) {
				if (!packageFilter) {
					return $q.when([]);
				}
				let dynamicFields = [];
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getdynamicuniquefields', {
					EstimateScope: packageFilter.estimateScope,
					FilterRequest: packageFilter.filterRequest,
					LineItemIds: packageFilter.selectedIds,
					SourceType: 1 // TODO chi: can be removed?
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
		}

		function reset() {
			uniqueFieldsProfileService.reset();
			estimateMainUpdatePackageBoqPackageDataService.reset();
			packagesToProcess = [];
			processIndex = 0;
			updateOptionToCreate = null;
		}

		function onCriteriaTypeSelectRowsChanged(entity, value){
			$scope.updateOption.quantityTransferFrom = value === 1 ? basicsCommonQuantityTransferFormConstant.boqWQAQ : basicsCommonQuantityTransferFormConstant.lineItemAQ;
			refreshFromView(value, $scope.updateOption.quantityTransferFrom);
		}

		function onQuantityTransferFromChanged(entity, value){
			refreshFromView($scope.updateOption.selectCriteriaOption, value);
		}

		function onIsAggregateRowsChanged(entity, value) {
			setReadOnly($scope.updateOption, 'uniqueFieldsProfile', !value);
		}

		function onSelectItemChanged() {
			let profile = uniqueFieldsProfileService.getSelectedItem();
			$scope.updateOption.uniqueFieldsProfile = uniqueFieldsProfileService.getDescription(profile);
		}

		function onHidePackageOptionChanged(value) {
			estimateMainUpdatePackageBoqPackageDataService.updateListByHidePackageOption(value);
		}

		function setReadOnly(entity, readOnlyAttr, readOnly){
			platformRuntimeDataService.readonly(entity, [{field: readOnlyAttr, readonly: readOnly}]);
		}

		function refreshFromView(updateOption, quantityTransferFrom) {
			let config = $scope.updateOptions.configure;
			let uniqueFieldsRow = _.find(config.rows, {rid: 'uniqueFieldProfile'});
			let controllingUnitRow = _.find(config.rows, {rid: 'controllingUnit'});
			let isAggregateRow = _.find(config.rows, {rid: 'isAggregate'});
			let quantityTransferFromRow = _.find(config.rows, {rid: 'quantityTransferFrom'});
			let considerBoqQtyRelRow = _.find(config.rows, {rid: 'considerBoqQtyRel'});
			let projectBoqAndLineItemAsHierarchyRow = _.find(config.rows, {rid: 'projectBoqAndLineItemAsHierarchy'});
			let lineItemAsHierarchyRow = _.find(config.rows, {rid: 'lineItemAsHierarchy'});
			let isSkipPositionBoqAsDivisionBoqRow = _.find(config.rows, {rid: 'isSkipPositionBoqAsDivisionBoq'});

			switch (updateOption)
			{
				case 1: // project boq
				{
					uniqueFieldsRow.visible = false;
					controllingUnitRow.visible = false;
					isAggregateRow.visible = false;
					quantityTransferFromRow.visible = true;
					considerBoqQtyRelRow.visible = quantityTransferFrom === basicsCommonQuantityTransferFormConstant.lineItemAQ ||
						quantityTransferFrom === basicsCommonQuantityTransferFormConstant.lineItemWQ ||
						quantityTransferFrom === basicsCommonQuantityTransferFormConstant.lineItemQuantityTotal;
					projectBoqAndLineItemAsHierarchyRow.visible = false;
					lineItemAsHierarchyRow.visible = false;
					isSkipPositionBoqAsDivisionBoqRow.visible = false;
					$scope.$broadcast('form-config-updated');
					break;
				}
				case 2: // wic boq
				{
					uniqueFieldsRow.visible = false;
					controllingUnitRow.visible = false;
					isAggregateRow.visible = false;
					quantityTransferFromRow.visible = true;
					considerBoqQtyRelRow.visible = quantityTransferFrom === basicsCommonQuantityTransferFormConstant.lineItemAQ || quantityTransferFrom === basicsCommonQuantityTransferFormConstant.lineItemWQ;
					projectBoqAndLineItemAsHierarchyRow.visible = false;
					lineItemAsHierarchyRow.visible = false;
					isSkipPositionBoqAsDivisionBoqRow.visible = false;
					$scope.$broadcast('form-config-updated');
					break;
				}
				case 3: // line item
				{
					uniqueFieldsRow.visible = true;
					controllingUnitRow.visible = true;
					isAggregateRow.visible = true;
					quantityTransferFromRow.visible = false;
					considerBoqQtyRelRow.visible = true;
					projectBoqAndLineItemAsHierarchyRow.visible = false;
					lineItemAsHierarchyRow.visible = false;
					isSkipPositionBoqAsDivisionBoqRow.visible = false;
					$scope.$broadcast('form-config-updated');
					break;
				}
				case 4: // Resource
				{
					uniqueFieldsRow.visible = false;
					controllingUnitRow.visible = false;
					isAggregateRow.visible = false;
					quantityTransferFromRow.visible = false;
					considerBoqQtyRelRow.visible = false;
					projectBoqAndLineItemAsHierarchyRow.visible = true;
					lineItemAsHierarchyRow.visible = true;
					isSkipPositionBoqAsDivisionBoqRow.visible = true;
					$scope.$broadcast('form-config-updated');
					break;
				}
				default:
					break;
			}
		}

		function canUpdate() {
			let packages = estimateMainUpdatePackageBoqPackageDataService.packages;
			return _.some(packages, {isSelected: true});
		}

		function update() {
			packagesToProcess = [];
			updateOptionToCreate = null;
			processIndex = 0;
			doUpdate();
		}

		function doUpdate() {
			if (packagesToProcess.length === 0) {
				let packages = estimateMainUpdatePackageBoqPackageDataService.packages;
				_.forEach(packages, function (item) {
					if (item.isSelected) {
						packagesToProcess.push(item);
					}
				});
			}

			if (packagesToProcess.length === 0) {
				platformModalService.showMsgBox('estimate.main.updatePackageBoqWizard.updatePage.noPackageSelected', 'Info', 'ico-info');
				return;
			}

			if (packagesToProcess.length === processIndex) {
				let packageFailToUpdate = _.find(packagesToProcess, function(item){
					return item.updateStatus.code !== 1;
				});

				if (!packageFailToUpdate) {
					platformModalService.showMsgBox('estimate.main.updatePackageBoqWizard.updatePage.updateSuccess', 'Info', 'ico-info');
					$scope.$close();
				}
				else {
					estimateMainUpdatePackageBoqPackageDataService.gridRefresh();
					platformModalService.showMsgBox('estimate.main.updatePackageBoqWizard.updatePage.updateFail', 'Info', 'ico-info');

				}

				estimateMainUpdatePackageBoqPackageDataService.gridRefresh();
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, ['isSelected']);

				return;
			}

			let toProcess = packagesToProcess[processIndex];
			let data = {
				PackageId: toProcess.Id
			};

			if (!updateOptionToCreate) {
				updateOptionToCreate = buildUpdateOption($scope.updateOption);
			}

			angular.extend(data, updateOptionToCreate);

			if (packagesToProcess.IsService) {
				// data.Source = packagesToProcess.IsFromPrjBoq ? 1 : (packagesToProcess.IsFromWicBoq ? 2 : (packagesToProcess.IsFromLineItem ? 3 : 0));
				data.Source = packagesToProcess.BoqCriteria;
			}
			else {
				data.Source = $scope.updateOption.selectCriteriaOption;
			}

			data.DoesUpdateBudgetOnly4ExistedAssignment = $scope.updateBudgetOnlyOption;
			data.EstHeaderId = estimateMainUpdatePackageBoqPackageDataService.packageFilter.currentEstHeaderId;
			data.IsSkipBoqPositionAsDivisionBoq = $scope.updateOption.isSkipPositionBoqAsDivisionBoq;
			$scope.modalOptions.isProcessing = true;
			$scope.modalOptions.processingInfo = $translate.instant('estimate.main.updatePackageBoqWizard.updatePage.updateProcess', { code: toProcess.Code });
			let status = {code: 0, description: ''};
			$http.post(globals.webApiBaseUrl + 'procurement/package/wizard/updatepackageboq', data)
				.then(function (response) {
					if (!response) {
						return;
					}
					status.code = response.data;
				}, function (error) {
					status.code = -100;
					status.description = '';
					if (error && error.data) {
						status.description = error.data.ErrorMessage;
					}
				})
				.finally(function () {
					processIndex += 1;
					estimateMainUpdatePackageBoqPackageDataService.updatePackage(toProcess.Id, status);
					$scope.modalOptions.isProcessing = false;
					$scope.modalOptions.processingInfo = '';
					doUpdate();
				});
		}

		function buildUpdateOption(updateOption) {
			let option = {
				IsControllingUnitAsTitle: updateOption.isControllingUnitAsTitle,
				QuantityTransferFrom:  updateOption.quantityTransferFrom,
				ConsiderBoqQtyRelation: updateOption.considerBoqQtyRelation,
				BoqStructure4SourceResource: updateOption.boqStructureOption4SourceResources
			};

			let uniqueFieldsEntities = uniqueFieldsProfileService.getSelectedItem().UniqueFields;

			option.UniqueFields = _.filter(uniqueFieldsEntities, {isSelect: true})
				.map(function (field) {
					return {
						id: field.id,
						code: field.model
					};
				});

			return option;
		}

		function previous() {
			if (angular.isFunction($scope.modalOptions.previous)) {
				$scope.modalOptions.previous();
			}

			$scope.$close();
		}

		function addGrouping(columns) {
			if (!columns || columns.length === 0) {
				return;
			}
			_.forEach(columns, function (col) {
				col.grouping = {
					aggregateCollapsed: true,
					aggregators: [],
					generic: true,
					getter: col.field,
					title: $translate.instant(col.name$tr$)
				};

				if (col.field === 'updateStatus') {
					col.grouping.getter = 'updateStatus.code';
				}
			});
		}

		function getContainerUUID() {
			return packageGridId;
		}

		function setTools(tools) {
			tools.update = function () {
				tools.version += 1;
			};
			tools.refreshVersion = Math.random();
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};
			$scope.tools = tools;
		}

		function addTools(tools) {
			if (angular.isArray(tools)) {
				let tempToolsToAdd = [];
				let tempTools = angular.copy($scope.tools.items);
				_.forEach(tools, function(tool) {
					if (_.findIndex(tempTools, {id: tool.id}) === -1) {
						tempToolsToAdd.push(tool);
					}
				});
				tempTools = _(tempTools).concat(tempToolsToAdd).value();
				setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: tempTools
				});
				return;
			}
			throw new Error('must be called with an array as parameter');
		}

		function removeToolByClass(cssClassArray) {
			if (!$scope.tools) {
				return;
			}

			$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
				return findByClass(toolItem, cssClassArray);
			});
			$scope.tools.update();
		}

		function findByClass(toolItem, cssClassArray) {
			let notFound = true;
			_.each(cssClassArray, function (CssClass) {
				if (CssClass === toolItem.iconClass) {
					notFound = false;
				}
			});
			return notFound;
		}

		function updateResultFormatter(row, cell, value) {
			if (!value) {
				return '';
			}

			let formatterResult = fillResultInfo(value);
			let path = null;
			if (value.code === -1 || value.code === -4 || value.code === -100) {
				path = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-';
			}
			else  {
				path = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-';
			}

			return '<img src="' + path + formatterResult.imageName + '" title="' + formatterResult.toolTip + '">';
		}

		function fillResultInfo(status) {
			let imageName = null;
			let toolTip = null;
			let code = status.code;
			switch (code) {
				case 1:
					imageName = 'tick';
					toolTip = $translate.instant('basics.common.updatePackageBoq.criteriaType.generateBoqSuccess');
					break;
				case -1:
					imageName = 'error';
					toolTip = $translate.instant('basics.common.updatePackageBoq.noResourceOrNoBoqItemFk');
					break;
				case -4:
					imageName = 'error';
					toolTip = $translate.instant('basics.common.updatePackageBoq.boqStructureFkIsNotEqual');
					break;
				case -100:
					imageName = 'error';
					toolTip = status.description;
					break;
				default:
					imageName = 'transition';
					toolTip = $translate.instant('basics.common.notProcessed');
					break;
			}

			return {imageName: imageName, toolTip: toolTip};
		}

		function booleanFormatter(row, cell, value) {
			if (value) {
				return $translate.instant('basics.common.yes');
			}
			return $translate.instant('basics.common.no');
		}

		function onUpdateBudgetOnlyOptionChanged(value) {
			estimateMainUpdatePackageBoqPackageDataService.updateListByUpdateBudgetOnlyOption(value, true);
			platformRuntimeDataService.readonly($scope.updateOption, value);
		}

		function onResourceBoqStructureOptionChanged(entity, value) {
			if (value === 1) {
				platformRuntimeDataService.readonly($scope.updateOption, [{field: 'isSkipPositionBoqAsDivisionBoq', readonly: false}]);
			}
			else if (value !== 1){
				platformRuntimeDataService.readonly($scope.updateOption, [{field: 'isSkipPositionBoqAsDivisionBoq', readonly: true}]);
			}
		}

		function onContentResized() {
			$timeout(function () {
				platformGridAPI.grids.resize(getContainerUUID());
			});
		}
	}

})(angular);
