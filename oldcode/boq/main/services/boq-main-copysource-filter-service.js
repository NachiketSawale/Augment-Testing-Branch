/**
 * Created by bh on 03.08.2015.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainLookupFilterService
	 * @function
	 *
	 * @description
	 * boqMainLookupFilterService is the service that holds the state of the currently active filter conditions for the boq lookup
	 */
	angular.module(moduleName).factory('boqMainLookupFilterService', [ 'PlatformMessenger', '$injector', function (PlatformMessenger) {

		// The instance of the change service - to be filled with functionality below
		var service = {};
		var internalProjectReference = {ProjectName: ''};
		var internalWicGroupReference = {DescriptionInfo: {Translated: ''}};
		var internalPrcStructureReference = {DescriptionInfo: {Translated: ''}};
		var internalSelectedBoqHeader = {Id: 0, BoqHeaderFk: 0, Description: ''};
		var internalSelectedFromEstimateHeader = {Id: null, DescriptionInfo: {Translated: ''}};
		var internalSelectedToEstimateHeader = {Id: null, DescriptionInfo: {Translated: ''}};
		var isSourceBoqContainerCreated = false;
		var correspondingMainItemService = null;
		var correspondingTargetBoqMainService = null;
		var forceLoadOfSingleProjectBoq = false;
		service.filterCleared  = new PlatformMessenger();
		service.boqTypeReadonly = new PlatformMessenger();
		service.projectReadonly = new PlatformMessenger();
		service.boqTypeChanged = new PlatformMessenger();
		service.copySourceBoqContainerCreated = new PlatformMessenger();
		service.wicGroupChanged = 'init';
		service.PrcStructureChanged = new PlatformMessenger();// added for defect 113288
		service.isFilterValueChanged = false;
		service.boqTypeUpdated = new PlatformMessenger();
		service.filterValueChanged = new PlatformMessenger();
		service.onSingleProjectBoqLoaded = new PlatformMessenger();
		service.boqTypeListChanged = new PlatformMessenger();

		// Object that holds the state of the currently selected filter for doing boq header lookup
		service.boqHeaderLookupFilter =
		{
			boqType: 0,
			projectId: 0,
			boqGroupId : 0,
			boqFilterWicGroupIds: [],// master data filter
			prcStructureId : 0,
			packageIds: [],
			selectedProject: internalProjectReference,
			selectedWicGroup: internalWicGroupReference,
			selectedPrcStructure: internalPrcStructureReference,
			selectedFromEstimateHeader: internalSelectedFromEstimateHeader,
			selectedToEstimateHeader: internalSelectedToEstimateHeader,
			prcBoqsReference: [],
			prcHeaderFk: 0,
			filterCrbBoqs: false,
			wicGroupIds: [],
			projectIds: [],
			materialCatalogIds: [],
			mainItemId2BoqHeaderIds: null,
			contractIds: [],
			fromEstimateHeaderId : null,
			toEstimateHeaderId : null
		};

		service.selectedBoqHeader = internalSelectedBoqHeader;

		service.setSelectedProject = function setSelectedProject(project) {
			project = project ? project : {Id: 0, ProjectName: ''};
			service.boqHeaderLookupFilter.selectedProject = angular.merge(service.boqHeaderLookupFilter.selectedProject, project);
		};

		service.setSelectedWicGroup = function setSelectedWicGroup(wicGroup) {
			wicGroup = wicGroup ? wicGroup : {Code: '', DescriptionInfo: {Translated: ''}};
			service.boqHeaderLookupFilter.selectedWicGroup = angular.merge(service.boqHeaderLookupFilter.selectedWicGroup, wicGroup);
			service.wicGroupChanged = 'changed';
		};

		service.setSelectedWicGroups = function setSelectedWicGroups(wicGroups) {
			service.boqHeaderLookupFilter.boqFilterWicGroupIds = wicGroups;
		};

		service.setSelectedPackageIds = function setSelectedPackageIds(packageIds) {
			service.boqHeaderLookupFilter.packageIds = packageIds;
		};

		service.setSelectedPrcStructure = function setSelectedPrcStructure(prcStructure) {
			prcStructure = prcStructure ? prcStructure : {Code: '', DescriptionInfo: {Translated: ''}};
			service.boqHeaderLookupFilter.selectedPrcStructure = angular.merge(service.boqHeaderLookupFilter.selectedPrcStructure, prcStructure);
		};

		service.setSelectedBoqHeader = function setSelectedBoqHeader(boqHeader) {
			boqHeader = boqHeader ? boqHeader : {Id: 0, BoqHeaderFk: 0, Description: ''};
			service.selectedBoqHeader = angular.merge(service.selectedBoqHeader, boqHeader);
		};

		service.setSelectedFromEstimateHeader = function setSelectedFromEstimateHeader(fromEstimateHeader) {
			fromEstimateHeader = fromEstimateHeader ? fromEstimateHeader : {Id: null, DescriptionInfo: {Translated: ''}};
			service.boqHeaderLookupFilter.selectedFromEstimateHeader = angular.merge(service.boqHeaderLookupFilter.selectedFromEstimateHeader, fromEstimateHeader);
		};

		service.setSelectedToEstimateHeader = function setSelectedToEstimateHeader(toEstimateHeader) {
			toEstimateHeader = toEstimateHeader ? toEstimateHeader : {Id: null, DescriptionInfo: {Translated: ''}};
			service.boqHeaderLookupFilter.selectedToEstimateHeader = angular.merge(service.boqHeaderLookupFilter.selectedToEstimateHeader, toEstimateHeader);
		};

		service.setSelectedWicGroupIds = function (ids) {
			service.boqHeaderLookupFilter.wicGroupIds = ids;
		};

		service.setSelectedProjectIds = function setSelectedProjectIds(ids) {
			service.boqHeaderLookupFilter.projectIds = ids;
		};

		service.setSelectedMaterialCatalogIds = function setSelectedMaterialCatalogIds(ids) {
			service.boqHeaderLookupFilter.materialCatalogIds = ids;
		};

		service.setSelectedMainItemId2BoqHeaderIds = function  setSelectedMainItemId2BoqHeaderIds(map) {
			service.boqHeaderLookupFilter.mainItemId2BoqHeaderIds = map;
			service.isFilterValueChanged = true;
		};

		service.setSelectedContractIds = function setSelectedContractIds(ids) {
			service.boqHeaderLookupFilter.contractIds = ids;
		};

		service.clearFilter = function clearFilter(skipType, skipWicGroupIds) {
			if(angular.isUndefined(skipType) || (skipType === null) || !skipType) {
				service.boqHeaderLookupFilter.boqType = 0;
			}

			service.boqHeaderLookupFilter.projectId = 0;
			service.boqHeaderLookupFilter.boqGroupId = 0;
			service.boqHeaderLookupFilter.prcBoqsReference = [];
			service.boqHeaderLookupFilter.prcHeaderFk = 0;
			service.setSelectedProject(null);

			if(angular.isUndefined(skipWicGroupIds) || (skipWicGroupIds === null) || !skipWicGroupIds) {
				service.boqHeaderLookupFilter.boqFilterWicGroupIds = [];
			}
			service.boqHeaderLookupFilter.packageIds = [];
			service.boqHeaderLookupFilter.wicGroupIds = [];
			service.boqHeaderLookupFilter.projectIds = [];
			service.boqHeaderLookupFilter.materialCatalogIds = [];
			service.boqHeaderLookupFilter.mainItemId2BoqHeaderIds = null;
			service.boqHeaderLookupFilter.contractIds = [];

			internalProjectReference.ProjectName = '';

			internalWicGroupReference.Id = 0;
			internalWicGroupReference.Code = '';
			internalWicGroupReference.DescriptionInfo.Translated = '';
			/*
			internalPrcStructureReference.Id = 0;
			internalPrcStructureReference.Code = '';
			internalPrcStructureReference.DescriptionInfo.Translated = '';
*/
			service.boqHeaderLookupFilter.fromEstimateHeaderId = null;
			service.boqHeaderLookupFilter.toEstimateHeaderId = null;

			service.filterCleared.fire();
		};

		service.clearSelectedBoqHeader = function clearSelectedBoqHeader() {
			internalSelectedBoqHeader.Id = 0;
			internalSelectedBoqHeader.BoqHeaderFk = '';
			internalSelectedBoqHeader.Description = '';
		};

		service.setIsSourceBoqContainerCreated = function setIsSourceBoqContainerCreated(flag) {
			isSourceBoqContainerCreated = flag;
		};

		service.getIsSourceBoqContainerCreated = function getIsSourceBoqContainerCreated() {
			return isSourceBoqContainerCreated;
		};

		service.filterCrbBoqs = function filterCrbBoqs(filter) {
			service.boqHeaderLookupFilter.filterCrbBoqs = filter;
		};

		service.setMainItemService = function setMainItemService(mainItemService) {
			correspondingMainItemService = mainItemService;
		};

		service.getMainItemService = function getMainItemService() {
			return correspondingMainItemService;
		};

		service.setTargetBoqMainService = function setTargetBoqMainService(boqMainService) {
			correspondingTargetBoqMainService = boqMainService;
		};

		service.getTargetBoqMainService = function getTargetBoqMainService() {
			return correspondingTargetBoqMainService;
		};

		service.setForceLoadOfSingleProjectBoq = function setForceLoadOfSingleProjectBoq(force) {
			forceLoadOfSingleProjectBoq = force;
			service.isFilterValueChanged = true; // to force loading of boq header lookup by skipping cache.
		};

		service.getForceLoadOfSingleProjectBoq = function getForceLoadOfSingleProjectBoq() {
			return forceLoadOfSingleProjectBoq;
		};

		return service;
	}]);
})();
