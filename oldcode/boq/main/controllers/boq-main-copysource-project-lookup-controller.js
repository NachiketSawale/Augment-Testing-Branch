/**
 * Created in workshop GZ
 */
(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainProjectLookupController
	 * @function
	 *
	 * @description
	 * Controller for the project lookup in the boq lookup view.
	 **/
	angular.module(moduleName).controller('boqMainProjectLookupController', ['$scope', '$translate',
		'boqMainLookupFilterService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'estimateProjectRateBookConfigDataService', 'boqMainBoqTypes', '$http',
		'boqMainCopyHeaderLookupDataService',
		function ($scope, $translate, boqMainLookupFilterService,cloudDesktopPinningContextService, basicsLookupdataLookupDescriptorService,
			basicsLookupdataLookupFilterService, estimateProjectRateBookConfigDataService, boqMainBoqTypes, $http, boqMainCopyHeaderLookupDataService) {

			// scope variables/ functions
			$scope.selectedItem = {};
			$scope.selectedProject = boqMainLookupFilterService.boqHeaderLookupFilter.selectedProject;
			$scope.selectedWicGroup = boqMainLookupFilterService.boqHeaderLookupFilter.selectedWicGroup;
			$scope.selectedPrcStructure = boqMainLookupFilterService.boqHeaderLookupFilter.selectedPrcStructure;
			$scope.selectedFromEstimateHeader = boqMainLookupFilterService.boqHeaderLookupFilter.selectedFromEstimateHeader;
			$scope.selectedToEstimateHeader = boqMainLookupFilterService.boqHeaderLookupFilter.selectedToEstimateHeader;
			$scope.config = {};
			$scope.config.selectConfig = {};
			$scope.boqTypeReadonly = false;
			$scope.projectReadonly = false;
			$scope.showWicGroupTree = true;

			var defaultBoqTypeList = [
				{Id: boqMainBoqTypes.wic, Description: $translate.instant('boq.main.wicBoq')},
				{Id: boqMainBoqTypes.project, Description: $translate.instant('boq.main.projectBoq')},
				{Id: boqMainBoqTypes.package, Description: $translate.instant('boq.main.packageBoq')},
				{Id: boqMainBoqTypes.contract, Description: $translate.instant('boq.main.contractBoq')}
			];

			$scope.boqTypeList = defaultBoqTypeList;

			$scope.boqType = {};
			$scope.boqType.current = _.find($scope.boqTypeList, function(item) {
				var boqTypeId = (boqMainLookupFilterService.boqHeaderLookupFilter.boqType === 0) ? 1 : boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
				return item.Id === boqTypeId;
			});
			boqMainLookupFilterService.boqHeaderLookupFilter.boqType = $scope.boqType.current.Id;

			$scope.config.selectConfig.rt$readonly = function () {
				return $scope.projectReadonly;
			};

			$scope.boqTypeOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.boqTypeList
			};

			$scope.boqTypeChanged = function boqTypeChanged(selectedBoqType, skipClearFilter) {
				if(angular.isDefined(selectedBoqType) && selectedBoqType !== null) {
					if(!skipClearFilter) {
						boqMainLookupFilterService.clearFilter();
					}
					/* $scope.config.selectConfig.readonly = $scope.projectReadonly/*(selectedBoqType.Id === 1); */
					boqMainLookupFilterService.boqHeaderLookupFilter.boqType = $scope.boqType.current.Id;
					if (selectedBoqType.Id === 1) {
						// Reset selected project for we are have selected WIC type
						setCurrentProject(null, skipClearFilter);
					} else {
						// Reset selected wic group
						setCurrentWicGroup(null, skipClearFilter);
					}
					setCurrentFromEstimateHeader(null);
					setCurrentToEstimateHeader(null);
					// When the project is pinned,select the pinned project
					initProjectSettingFilterService(skipClearFilter);

					boqMainLookupFilterService.boqTypeUpdated.fire();
				}
			};

			$scope.wicGroupLookupOptions = {
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedWicGroupChanged(e, args) {
						setCurrentWicGroup(args.selectedItem);
						setCurrentToEstimateHeader(null);
					}
				}],
				showClearButton: true,
				filterKey: 'estimate-main-wic-group-master-data-filter',
				selectableCallback: function (item) {
					var valid = true;
					var wicGroupIds = boqMainLookupFilterService.boqHeaderLookupFilter.wicGroupIds || null;
					if (angular.isArray(wicGroupIds) && wicGroupIds.length > 0) {
						valid = _.includes(wicGroupIds, item.Id);
					}
					return valid;
				}
			};

			$scope.prcStructureLookupOptions = {
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedPrcStructureChanged(e, args) {
						setCurrentPrcStructure(args.selectedItem);

						boqMainLookupFilterService.PrcStructureChanged.fire();                // added for defect 113288
					}
				}],
				showClearButton: true
			};

			$scope.projectLookupOptions = {
				filterKey: 'boq-main-project-data-filter',
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedProjectChanged(e, args) {
						setCurrentFromEstimateHeader(null);
						setCurrentProject(args.selectedItem);
					}
				}],
			};

			$scope.fromEstimateLookupOptions = {
				events: [
					{
						name: 'onSelectedItemChanged', handler: function selectedFromEstimateHeaderChanged(e, args) {
							setCurrentFromEstimateHeader(args.selectedItem);
						}
					},
				],
				dataServiceName: 'estimateBoqHeaderService',
				displayMember: 'Code',
				valueMember: 'Id',
				lookupModuleQualifier: 'estimateBoqHeaderService',
				lookupType: 'estimateBoqHeaderService',
				showClearButton: false,
				uuid: '041e85c763ac4db5a4499484505cdfd2',
				disableDataCaching: true,
				filterOnSearchIsFixed: true,
				isClientSearch: true,
				filter: function () {
					var filterObj = {
						ProjectId: boqMainLookupFilterService.boqHeaderLookupFilter.selectedProject.Id,
						BoqHeaderId: boqMainLookupFilterService.selectedBoqHeader ? boqMainLookupFilterService.selectedBoqHeader.BoqHeaderFk : null,
					};
					return filterObj;
				},
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'IsActive',
						field: 'IsActive',
						name: 'Is Active',
						formatter: 'boolean',
						name$tr$: 'boq.main.isActive'
					},
				],
				popupOptions: {
					width: 350
				}
			};

			$scope.toEstimateLookupOptions = {
				events: [
					{
						name: 'onSelectedItemChanged', handler: function selectedToEstimateHeaderChanged(e, args) {
							setCurrentToEstimateHeader(args.selectedItem);
						}
					},
				],
				dataServiceName: 'estimateBoqHeaderService',
				displayMember: 'Code',
				valueMember: 'Id',
				lookupModuleQualifier: 'estimateBoqHeaderService',
				lookupType: 'estimateBoqHeaderService',
				showClearButton: false,
				uuid: '48b069a09d8e4c50a518cb63a2686560',
				disableDataCaching: true,
				filterOnSearchIsFixed: true,
				isClientSearch: true,
				filter: function () {
					var filterObj = {
						ProjectId: boqMainLookupFilterService.getTargetBoqMainService().getSelectedProjectId(),
					};
					return filterObj;
				},
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'IsActive',
						field: 'IsActive',
						name: 'Is Active',
						formatter: 'boolean',
						name$tr$: 'boq.main.isActive'
					},
				],
				popupOptions: {
					width: 350
				}
			};

			$scope.isWicBoQ = function isWicBoQ() {
				if ($scope.boqType && $scope.boqType.current && $scope.boqType.current.Id) {
					return $scope.boqType.current.Id === 1;
				} else {
					return false;
				}
			};

			$scope.isFromEstimateVisible = function isFromEstimateVisible() {
				if ($scope.boqType && $scope.boqType.current && $scope.boqType.current.Id && $scope.boqType.current.Id === 2) {
					return copyEstimateOrAssembly();
				}
			};

			$scope.isToEstimateVisible = function isToEstimateVisible() {
				if ($scope.boqType && $scope.boqType.current && $scope.boqType.current.Id && ($scope.boqType.current.Id === 2 || $scope.boqType.current.Id === 1)) {
					return copyEstimateOrAssembly();
				}
			};

			function copyEstimateOrAssembly() {
				var targetBoqMainService = boqMainLookupFilterService.getTargetBoqMainService();
				if(targetBoqMainService !== null || targetBoqMainService !== undefined) {
					if(targetBoqMainService.getBoqStructure().CopyEstimateOrAssembly === false)
					{
						setCurrentFromEstimateHeader(null);
						setCurrentToEstimateHeader(null);
					}
					return targetBoqMainService.getBoqStructure().CopyEstimateOrAssembly;
				} else {
					return false;
				}
			}

			$scope.doShowWicGroupTree = function doShowWicGroupTree() {
				return $scope.showWicGroupTree;
			};

			function setCurrentFromEstimateHeader(currentFromEstimateHeader){
				boqMainLookupFilterService.setSelectedFromEstimateHeader(currentFromEstimateHeader);
				boqMainLookupFilterService.boqHeaderLookupFilter.fromEstimateHeaderId = currentFromEstimateHeader ? currentFromEstimateHeader.Id : null;
			}

			function setCurrentToEstimateHeader(currentToEstimateHeader){
				boqMainLookupFilterService.setSelectedToEstimateHeader(currentToEstimateHeader);
				boqMainLookupFilterService.boqHeaderLookupFilter.toEstimateHeaderId = currentToEstimateHeader ? currentToEstimateHeader.Id : null;
			}

			function setCurrentProject(currentProject, skipClearFilter){
				if(!skipClearFilter) {
					boqMainLookupFilterService.clearFilter(true);
				}
				$scope.selectedItem = currentProject ? currentProject.Id : null;
				boqMainLookupFilterService.setSelectedProject(currentProject);
				boqMainLookupFilterService.boqHeaderLookupFilter.projectId = currentProject ? currentProject.Id : 0;
				boqMainLookupFilterService.isFilterValueChanged = true;
				boqMainLookupFilterService.filterValueChanged.fire();
			}

			function setCurrentWicGroup(currentWicGroup, skipClearFilter){
				if(!skipClearFilter) {
					boqMainLookupFilterService.clearFilter(true, true);
				}
				$scope.selectedItem = currentWicGroup ? currentWicGroup.Id : null;
				boqMainLookupFilterService.setSelectedWicGroup(currentWicGroup);
				boqMainLookupFilterService.boqHeaderLookupFilter.boqGroupId = currentWicGroup ? currentWicGroup.Id : 0;
				boqMainLookupFilterService.isFilterValueChanged = true;
				boqMainLookupFilterService.filterValueChanged.fire();
			}

			function setCurrentPrcStructure(currentPrcStructure, skipClearFilter){
				if(!skipClearFilter) {
					boqMainLookupFilterService.filterCleared.fire(); // -> underlying handler also clears the selected boq header
				}
				boqMainLookupFilterService.setSelectedPrcStructure(currentPrcStructure);
				boqMainLookupFilterService.boqHeaderLookupFilter.prcStructureId = currentPrcStructure ? currentPrcStructure.Id : 0;
			}

			var filterCleared = function filterCleared() {
				$scope.selectedItem = null;
			};

			boqMainLookupFilterService.filterCleared.register(filterCleared);

			// using master data filter for the wic group lookup
			var rateBookConfigWicGroupFilterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
			var filters = [
				{
					key: 'estimate-main-wic-group-master-data-filter',
					fn: function (item) {
						var wicGroupFilterIds = boqMainLookupFilterService.boqHeaderLookupFilter.boqFilterWicGroupIds;

						if(!_.isArray(wicGroupFilterIds) || wicGroupFilterIds.length === 0) {
							wicGroupFilterIds = rateBookConfigWicGroupFilterIds;
						}

						if (!_.isArray(wicGroupFilterIds) || wicGroupFilterIds.length === 0) {
							wicGroupFilterIds = boqMainLookupFilterService.boqHeaderLookupFilter.wicGroupIds;
						}

						if(wicGroupFilterIds && wicGroupFilterIds.length > 0) {
							return _.includes(wicGroupFilterIds, item.Id);
						}
						return true;
					}
				},
				{
					key: 'boq-main-project-data-filter',
					serverSide: true,
					serverKey: 'boq-main-project-data-filter',
					fn: function (/* item */) {
						var projectIds = boqMainLookupFilterService.boqHeaderLookupFilter.projectIds;

						if (angular.isArray(projectIds) && projectIds.length > 0) {
							return {
								ids: projectIds
							};
						}
						return {};
					}
				}
			];

			function filterDataIniting() {
				$scope.showLoadingOverlay = true;
			}

			function filterDataInit() {
				rateBookConfigWicGroupFilterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
				$scope.showLoadingOverlay = false;
			}

			function reactOnBoqTypeReadOnlyChanged(isReadonly) {
				$scope.boqTypeReadonly = isReadonly;
			}

			function reactOnProjectReadOnlyChanged(isReadonly) {
				$scope.projectReadonly = isReadonly;
			}

			function reactOnBoqTypeChanged(boqTypeId) {
				var currentBoqType = _.find($scope.boqTypeList, function(item) {
					return item.Id === boqTypeId;
				});
				boqMainLookupFilterService.clearFilter(true);
				$scope.boqType.current = currentBoqType;
				$scope.boqType.currentId = currentBoqType ? currentBoqType.Id : -1;
				$scope.showWicGroupTree = $scope.boqTypeReadonly && $scope.boqType.currentId === 1 ? false : true;
				$scope.boqTypeChanged(currentBoqType, true);
			}

			var mainItemService = boqMainLookupFilterService.getMainItemService();

			function loadSingleProjectBoq() {
				// First check if there is only a single project boq given to the currently selected project
				return $http.post(globals.webApiBaseUrl + 'boq/main/getboqheaderlookup', boqMainLookupFilterService.boqHeaderLookupFilter).then(function (response) {
					if(response.data && _.isArray(response.data) && response.data.length === 1) {
						return response.data[0].BoqHeaderFk; // return BoqHeaderFk of single found project boq
					}
					else {
						return null;
					}
				});
			}

			function initProjectSettingFilterService(skipClearFilter) {
				// Get the currently assigned project id from related main item service
				var currentlySelectedMainItem = null;
				var initialized = false;
				var currentProject = null;
				var isProjectFilterActive = boqMainLookupFilterService.boqHeaderLookupFilter.boqType === boqMainBoqTypes.project || boqMainLookupFilterService.boqHeaderLookupFilter.boqType === boqMainBoqTypes.package;
				if(_.isObject(mainItemService)) {
					currentlySelectedMainItem = mainItemService.getSelected();

					if(_.isObject(currentlySelectedMainItem) &&
						_.isNumber(currentlySelectedMainItem.ProjectFk) &&
						isProjectFilterActive) {
						currentProject = basicsLookupdataLookupDescriptorService.getItemByIdSync(currentlySelectedMainItem.ProjectFk, {lookupType: 'project'});
						if (currentProject) {
							setCurrentProject(currentProject);
							initialized = true;
							if(boqMainLookupFilterService.getForceLoadOfSingleProjectBoq()) {
								let loadedSingleBoqPromoise = loadSingleProjectBoq().then(function(result) {
									return result;
								});

								loadedSingleBoqPromoise.then(function(loadedSingleBoq) {
									if(_.isNumber(loadedSingleBoq)) {
										boqMainCopyHeaderLookupDataService.getList({lookupType: 'boqMainCopyHeaderLookupDataService'}).then(function(retVal) {
											if(_.isArray(retVal) && retVal.length === 1) {
												boqMainLookupFilterService.onSingleProjectBoqLoaded.fire(retVal[0]);
											}
										});
									}
								});
							}
						}
					}
				}

				if (!initialized && isProjectFilterActive) {
					var context = cloudDesktopPinningContextService.getContext();
					var contextProjectInfo = _.find(context, {token: 'project.main'});
					if (contextProjectInfo && contextProjectInfo.id && angular.isNumber(contextProjectInfo.id)) {
						// Get project entity from client cache
						currentProject = basicsLookupdataLookupDescriptorService.getItemByIdSync(contextProjectInfo.id, {lookupType: 'project'});
						if (currentProject) {
							setCurrentProject(currentProject, skipClearFilter);
						} else {
							// Get project entity from server side if can't get it from client cache
							basicsLookupdataLookupDescriptorService.getItemByKey('project', contextProjectInfo.id).then(function (data) {
								if (data && angular.isObject(data)) {
									setCurrentProject(data, skipClearFilter);
								}
							});
						}
					}
				}

				return initialized;
			}

			basicsLookupdataLookupFilterService.registerFilter(filters);
			boqMainLookupFilterService.boqTypeReadonly.register(reactOnBoqTypeReadOnlyChanged);
			boqMainLookupFilterService.projectReadonly.register(reactOnProjectReadOnlyChanged);
			boqMainLookupFilterService.boqTypeChanged.register(reactOnBoqTypeChanged);
			estimateProjectRateBookConfigDataService.onFilterDataInited.register(filterDataInit);
			estimateProjectRateBookConfigDataService.onFilterDataIniting.register(filterDataIniting);
			boqMainLookupFilterService.boqTypeListChanged.register(onBoqTypeListChanged);

			if(_.isObject(mainItemService) && _.isFunction(mainItemService.registerSelectionChanged)) {
				mainItemService.registerSelectionChanged(initProjectSettingFilterService);
			}

			$scope.$on('$destroy', function () {
				boqMainLookupFilterService.filterCleared.unregister(filterCleared);
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				boqMainLookupFilterService.boqTypeReadonly.unregister(reactOnBoqTypeReadOnlyChanged);
				boqMainLookupFilterService.projectReadonly.unregister(reactOnProjectReadOnlyChanged);
				boqMainLookupFilterService.boqTypeChanged.unregister(reactOnBoqTypeChanged);
				estimateProjectRateBookConfigDataService.onFilterDataInited.unregister(filterDataInit);
				estimateProjectRateBookConfigDataService.onFilterDataIniting.unregister(filterDataIniting);
				boqMainLookupFilterService.setSelectedWicGroups([]);
				boqMainLookupFilterService.setIsSourceBoqContainerCreated(false);
				boqMainLookupFilterService.setSelectedWicGroupIds([]);
				boqMainLookupFilterService.setSelectedProjectIds([]);
				boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(null);

				if(_.isObject(mainItemService) && _.isFunction(mainItemService.unregisterSelectionChanged)) {
					mainItemService.unregisterSelectionChanged(initProjectSettingFilterService);
				}

				boqMainLookupFilterService.boqTypeListChanged.unregister(onBoqTypeListChanged);
			});

			initProjectSettingFilterService();
			boqMainLookupFilterService.setIsSourceBoqContainerCreated(true);
			boqMainLookupFilterService.copySourceBoqContainerCreated.fire(); // Inform about creation of copy source container

			function onBoqTypeListChanged(typesVisible) {
				var match = true;
				var needResetCurrent = !$scope.boqType.current;
				var foundCurrent = null;
				var difference = null;
				if (!angular.isArray($scope.boqTypeList)) {
					$scope.boqTypeList = [];
				}

				var typeIds = _.map($scope.boqTypeList, 'Id');

				if (!angular.isArray(typesVisible) || typesVisible.length === 0) {

					typesVisible = [boqMainBoqTypes.wic, boqMainBoqTypes.project, boqMainBoqTypes.package, boqMainBoqTypes.contract];

					difference = _.difference(typesVisible, typeIds);
					if (difference.length === 0) {
						difference = _.difference(typeIds, typesVisible);
					}

					match = difference.length === 0;

					if (!match) {
						$scope.boqTypeList = defaultBoqTypeList;

						if (!needResetCurrent && $scope.boqType.current) {
							foundCurrent = _.find($scope.boqTypeList, {Id: $scope.boqType.current.Id});
							if (!foundCurrent) {
								needResetCurrent = true;
							}
						}

						if (needResetCurrent) {
							$scope.boqType.current = _.find($scope.boqTypeList, function (item) {
								var boqTypeId = (boqMainLookupFilterService.boqHeaderLookupFilter.boqType === 0) ? 1 : boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
								return item.Id === boqTypeId;
							});
						}
						$scope.boqTypeOptions.items = $scope.boqTypeList;
					}
					else if (!$scope.boqType.current) {
						$scope.boqType.current = _.find($scope.boqTypeList, function (item) {
							var boqTypeId = (boqMainLookupFilterService.boqHeaderLookupFilter.boqType === 0) ? 1 : boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
							return item.Id === boqTypeId;
						});
					}

					return $scope.boqType.current ? $scope.boqType.current.Id : null;
				}

				match = true;

				difference = _.difference(typesVisible, typeIds);
				if (difference.length === 0) {
					difference = _.difference(typeIds, typesVisible);
				}

				match = difference.length === 0;

				if (!match) {
					$scope.boqTypeList = _.filter(defaultBoqTypeList, function (type) {
						var found = _.find(typesVisible, function (value) {
							return value === type.Id;
						});
						return !!found;
					});

					if (!needResetCurrent && $scope.boqType.current) {
						foundCurrent = _.find($scope.boqTypeList, {Id: $scope.boqType.current.Id});
						if (!foundCurrent) {
							needResetCurrent = true;
						}
					}

					if (needResetCurrent) {
						$scope.boqType.current = $scope.boqTypeList[0];
					}
					$scope.boqTypeOptions.items = $scope.boqTypeList;
				} else if (!$scope.boqType.current && angular.isArray($scope.boqTypeList) && $scope.boqTypeList.length > 0) {
					$scope.boqType.current = $scope.boqTypeList[0];
				}
				return $scope.boqType.current ? $scope.boqType.current.Id : null;
			}
		}
	]);
})();
