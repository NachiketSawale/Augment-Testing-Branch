/**
 * Created by lnt on 3/28/2019.
 */

(function () {
	/* global  _ */
	'use strict';

	var moduleName = 'qto.main';

	/**
	 * @ngdoc controller
	 * @name qtoBoqCopysourceDialogController
	 * @function
	 *
	 * @description
	 * Controller for copy boq lookup view.
	 **/
	angular.module(moduleName).controller('qtoBoqCopysourceDialogController', ['$scope', '$translate', '$injector',
		'boqMainLookupFilterService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'estimateProjectRateBookConfigDataService', 'boqMainNodeControllerService', 'boqMainBoqLookupService', 'platformNavBarService', 'platformGridControllerService',
		'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'boqMainStandardConfigurationServiceFactory', 'boqMainTranslationService',
		'platformModalService', 'platformGridAPI',
		function ($scope, $translate, $injector, boqMainLookupFilterService, cloudDesktopPinningContextService, basicsLookupdataLookupDescriptorService,
			basicsLookupdataLookupFilterService, estimateProjectRateBookConfigDataService, boqMainNodeControllerService, boqMainBoqLookupService, platformNavBarService, platformGridControllerService,
			cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationServiceFactory, boqMainTranslationService,
			platformModalService, platformGridAPI) {

			boqMainLookupFilterService.clearFilter(true);
			boqMainLookupFilterService.boqHeaderLookupFilter.prcStructureId = 0;
			$scope.options = $scope.$parent.modalOptions;

			var prcCopyModeFk, projectFk, boqWicCatFks, prcBoqsReference, prcHeaderFk;
			var parentService = $scope.options.parentService;
			if (parentService) {
				var createQtoItem = parentService.getDataItem();
				if(createQtoItem){
					prcCopyModeFk = createQtoItem.PrcCopyModeFk;
					projectFk = createQtoItem.ProjectFk;
					boqWicCatFks = createQtoItem.BoqWicCatFks;
					prcBoqsReference = createQtoItem.PrcBoqsReference;
					prcHeaderFk = createQtoItem.PrcHeaderFkOriginal;
				}
			}

			$scope.modalOptions = {
				headerText: $scope.options.headerText,
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok')
			};

			$scope.modalOptions.ok = function onOK() {
				var boqItemTree = boqMainBoqLookupService.getTree();
				var boqCopy = angular.copy(boqItemTree);
				boqCopy = filterBoqCopy(boqCopy);
				$scope.$close({ok: true, data: boqCopy});
			};

			function filterBoqCopy(boqsCopy) {
				var boqTrees = _.filter(boqsCopy, {IsFilter: true});
				_.each(boqTrees, function (boqTree) {
					boqTree.BoqItems = filterBoqCopy(boqTree.BoqItems);
				});

				return boqTrees;
			}

			$scope.modalOptions.close = function onCancel() {
				parentService.setBoqSource(0);
				$scope.$close({ok: false});
			};

			// scope variables/ functions
			$scope.selectedItem = {};
			$scope.selectedProject = boqMainLookupFilterService.boqHeaderLookupFilter.selectedProject;
			$scope.selectedWicGroup = boqMainLookupFilterService.boqHeaderLookupFilter.selectedWicGroup;
			$scope.selectedPrcStructure = boqMainLookupFilterService.boqHeaderLookupFilter.selectedPrcStructure;
			$scope.config = {};
			$scope.config.selectConfig = {readonly: true};
			$scope.isOkDisabled = true;
			boqMainLookupFilterService.boqHeaderLookupFilter.prcBoqsReference = prcBoqsReference;
			boqMainLookupFilterService.boqHeaderLookupFilter.prcHeaderFk = prcHeaderFk;

			$scope.boqTypeList = [
				{Id: 1, Description: $translate.instant('boq.main.wicBoq')},
				{Id: 3, Description: $translate.instant('boq.main.packageBoq')}
			];

			$scope.boqType = {};
			$scope.boqType.current = _.find($scope.boqTypeList, function (item) {
				var boqTypeId;
				if (prcCopyModeFk === 2) {
					boqTypeId = 3;
					if(item.Id === boqTypeId) {
						$scope.boqType.readonly = true;
						// Reset selected wic group
						setCurrentWicGroup(null);
						boqMainLookupFilterService.clearSelectedBoqHeader();
						boqMainBoqLookupService.clear();
						// Get project entity from client cache
						var currentProject = basicsLookupdataLookupDescriptorService.getItemByIdSync(projectFk, {lookupType: 'project'});
						setCurrentProject(currentProject);
						boqMainLookupFilterService.boqHeaderLookupFilter.prcBoqsReference = prcBoqsReference;
					}
				}
				else if (prcCopyModeFk === 3) {
					boqTypeId = 1;
					if(item.Id === boqTypeId) {
						// $scope.boqType.readonly = true;
						// Reset selected project
						setCurrentProject(null);
						boqMainLookupFilterService.clearSelectedBoqHeader();
						boqMainBoqLookupService.clear();
					}
				}
				else {
					boqTypeId = (boqMainLookupFilterService.boqHeaderLookupFilter.boqType === 0) ? 1 : boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
				}
				return item.Id === boqTypeId;
			});
			parentService.setBoqSource($scope.boqType.current.Id);
			boqMainLookupFilterService.boqHeaderLookupFilter.boqType = $scope.boqType.current.Id;
			$scope.config.selectConfig.readonly = ($scope.boqType.current.Id === 1);
			if($scope.boqType.current.Id === 3){
				boqMainLookupFilterService.clearSelectedBoqHeader();
				boqMainBoqLookupService.clear();
			}

			$scope.boqTypeOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.boqTypeList
			};

			$scope.boqTypeChanged = function boqTypeChanged(selectedBoqType) {
				if (angular.isDefined(selectedBoqType) && selectedBoqType !== null) {
					parentService.setBoqSource(selectedBoqType.Id);
					boqMainLookupFilterService.clearFilter();
					$scope.config.selectConfig.readonly = (selectedBoqType.Id === 1);
					boqMainLookupFilterService.boqHeaderLookupFilter.boqType = $scope.boqType.current.Id;
					if (selectedBoqType.Id === 1) {
						// Reset selected project
						setCurrentProject(null);
					}
					else {
						// Reset selected wic group
						setCurrentWicGroup(null);
					}

					if(selectedBoqType.Id === 3){
						var contractProject = basicsLookupdataLookupDescriptorService.getItemByIdSync(projectFk, {lookupType: 'project'});
						setCurrentProject(contractProject);
						boqMainLookupFilterService.boqHeaderLookupFilter.prcBoqsReference = prcBoqsReference;
						boqMainLookupFilterService.boqHeaderLookupFilter.prcHeaderFk = prcHeaderFk;
					}

					// When the project is pinned,select the pinned project
					if (selectedBoqType.Id === 2) {
						var context = cloudDesktopPinningContextService.getContext();
						var contextProjectInfo = _.find(context, {token: 'project.main'});
						if (contextProjectInfo && contextProjectInfo.id && angular.isNumber(contextProjectInfo.id)) {
							// Get project entity from client cache
							var currentProject = basicsLookupdataLookupDescriptorService.getItemByIdSync(contextProjectInfo.id, {lookupType: 'project'});
							if (currentProject) {
								setCurrentProject(currentProject);
							}
							else {
								// Get project entity from server side if can't get it from client cache
								basicsLookupdataLookupDescriptorService.getItemByKey('project', contextProjectInfo.id).then(function (data) {
									if (data && angular.isObject(data)) {
										setCurrentProject(data);
									}
								});
							}
						}
					}
				}
			};

			$scope.wicGroupLookupOptions = {
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedWicGroupChanged(e, args) {
						setCurrentWicGroup(args.selectedItem);
					}
				}],
				showClearButton: true,
				filterKey: 'contract-qto-wic-group-master-data-filter'
			};

			$scope.prcStructureLookupOptions = {
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedPrcStructureChanged(e, args) {
						setCurrentPrcStructure(args.selectedItem);
					}
				}],
				showClearButton: true
			};

			$scope.isWicBoQ = function isWicBoQ() {
				return $scope.boqType.current.Id === 1;
			};

			function setCurrentProject(currentProject) {
				boqMainLookupFilterService.clearFilter(true);
				$scope.selectedItem = currentProject ? currentProject.Id : null;
				boqMainLookupFilterService.setSelectedProject(currentProject);
				boqMainLookupFilterService.boqHeaderLookupFilter.projectId = currentProject ? currentProject.Id : 0;
			}

			function setCurrentWicGroup(currentWicGroup) {
				boqMainLookupFilterService.clearFilter(true);
				$scope.selectedItem = currentWicGroup ? currentWicGroup.Id : null;
				boqMainLookupFilterService.setSelectedWicGroup(currentWicGroup);
				boqMainLookupFilterService.boqHeaderLookupFilter.boqGroupId = currentWicGroup ? currentWicGroup.Id : 0;
			}

			function setCurrentPrcStructure(currentPrcStructure) {
				boqMainLookupFilterService.filterCleared.fire(); // -> underlying handler also clears the selected boq header
				boqMainLookupFilterService.setSelectedPrcStructure(currentPrcStructure);
				boqMainLookupFilterService.boqHeaderLookupFilter.prcStructureId = currentPrcStructure ? currentPrcStructure.Id : 0;
			}

			var filterCleared = function filterCleared() {
				$scope.selectedItem = null;
			};

			boqMainLookupFilterService.filterCleared.register(filterCleared);

			// using master data filter for the wic group lookup
			var filterIds = prcCopyModeFk === 3 ? boqWicCatFks : estimateProjectRateBookConfigDataService.getFilterIds(3);
			var filters = [
				{
					key: 'contract-qto-wic-group-master-data-filter',
					fn: function (item) {
						if (filterIds && filterIds.length > 0) {
							return _.includes(filterIds, item.Id);
						}
						return true;
					}
				}
			];

			function filterDataIniting() {
				$scope.showLoadingOverlay = true;
			}

			function filterDataInit() {
				filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
				$scope.showLoadingOverlay = false;
			}

			// master data filter(to filter the wic group boq headers)
			function setWicGroupWithMasterDataFilter() {
				boqMainLookupFilterService.setSelectedWicGroups(filterIds);
			}

			setWicGroupWithMasterDataFilter();

			basicsLookupdataLookupFilterService.registerFilter(filters);
			estimateProjectRateBookConfigDataService.onFilterDataInited.register(filterDataInit);
			estimateProjectRateBookConfigDataService.onFilterDataIniting.register(filterDataIniting);

			var addtionColmn = {
				id: 'isFilter2Copy',
				field: 'IsFilter',
				name: 'Filter',
				name$tr$: 'platform.masterdetail.filter',
				formatter: 'boolean',
				editor: 'boolean',
				width: 60
			};

			$scope.gridId = $scope.options.uuid;
			$scope.boqNodeControllerOptions = {readOnly: true};
			$scope.setTools = function () {
			};
			// An own instance of the boqMainStandardConfigurationService is needed here to be able to handle the assigned boqMainLookupService (assignment done in initBoqNodeController)
			// separately so there is no affect between the boq structure and the boq copy container.
			var boqMainStandardConfigurationService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService({currentBoqMainService: boqMainBoqLookupService});
			boqMainStandardConfigurationService.getStandardConfigForListView().columns.unshift(addtionColmn);

			boqMainNodeControllerService.initBoqNodeController($scope, boqMainBoqLookupService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, null /* boqMainValidationServiceProvider */, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChanged);
			function onCellChanged(e, args) {
				var item = args.item;
				$scope.isOkDisabled = !item.BoqItemFk && !item.IsFilter;
				var cloudCommonGridService = $injector.get('cloudCommonGridService');
				var flatBoqList = [];
				cloudCommonGridService.flatten([item], flatBoqList, 'BoqItems');
				_.each(flatBoqList, function (boqItem) {
					boqItem.IsFilter = item.IsFilter;
				});

				var boqList = boqMainBoqLookupService.getList();
				if (item.IsFilter) {
					setParentFilter(item, boqList);
				}

				boqMainBoqLookupService.gridRefresh();
			}

			function setParentFilter(item, boqList) {
				if (item.BoqItemFk) {
					var existItem = _.find(boqList, {Id: item.BoqItemFk});
					existItem.IsFilter = item.IsFilter;
					setParentFilter(existItem, boqList);
				}
			}

			boqMainBoqLookupService.registerListLoaded(updateItemList);
			function updateItemList(){
				var boqList = boqMainBoqLookupService.getTree();
				if(boqList && boqList.length > 0){
					boqList[0].IsFilter = true;
					$scope.isOkDisabled = false;
				}
			}

			$scope.$on('$destroy', function () {
				boqMainLookupFilterService.filterCleared.unregister(filterCleared);
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				estimateProjectRateBookConfigDataService.onFilterDataInited.unregister(filterDataInit);
				estimateProjectRateBookConfigDataService.onFilterDataIniting.unregister(filterDataIniting);
				boqMainLookupFilterService.setSelectedWicGroups([]);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChanged);
				boqMainBoqLookupService.unregisterListLoaded(updateItemList);
				boqMainLookupFilterService.clearSelectedBoqHeader();
				boqMainBoqLookupService.clear();
				boqMainLookupFilterService.clearFilter(true);
			});
		}
	]);
})();
