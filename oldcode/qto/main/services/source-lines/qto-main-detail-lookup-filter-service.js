/**
 * Created by lnt
 */
(function () {

	'use strict';
	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainDetailLookupFilterService
	 * @function
	 *
	 * @description
	 * qtoMainDetailLookupFilterService is the service that holds the state of the currently active filter conditions for the qto lines lookup
	 */
	angular.module(moduleName).factory('qtoMainDetailLookupFilterService', ['PlatformMessenger', '$injector', function (PlatformMessenger) {

		// The instance of the change service - to be filled with functionality below
		let service = {};
		let internalProjectReference = {ProjectName: ''};
		let internalSelectedBoqHeader = {Id: null, BoqHeaderFk: null, Description: ''};
		let internalSelectedQtoHeader = {Id: null, Code: '', Description: ''};
		service.filterCleared  = new PlatformMessenger();
		service.qtoHeaderFilterCleared  = new PlatformMessenger();
		service.boqHeaderFilterCleared  = new PlatformMessenger();

		// Object that holds the state of the currently selected filter for doing boq header lookup
		service.boqHeaderLookupFilter = {
			boqType: 0,
			projectId: 0,
			boqGroupId: 0,
			selectedProject: internalProjectReference,
			filterCrbBoqs: false,
			wicGroupIds: [],
			projectIds: []
		};

		service.qtoHeaderLookupFilter = {
			projectId: null,
			boqHeaderFk: service.selectedBoqHeader ? service.selectedBoqHeader.Id : null
		};

		service.selectedBoqHeader = internalSelectedBoqHeader;

		service.setSelectedProject = function setSelectedProject(project) {
			project = project ? project : {Id: null, ProjectName: ''};
			service.boqHeaderLookupFilter.selectedProject = angular.merge(service.boqHeaderLookupFilter.selectedProject, project);
		};

		service.setSelectedBoqHeader = function setSelectedBoqHeader(boqHeader) {
			boqHeader = boqHeader ? boqHeader : {Id: null, BoqHeaderFk: null, Description: ''};
			service.selectedBoqHeader = angular.merge(service.selectedBoqHeader, boqHeader);
		};

		service.selectedQtoHeader = internalSelectedQtoHeader;

		service.setSelectedQtoHeader = function setSelectedQtoHeader(qtoHeader) {
			qtoHeader = qtoHeader ? qtoHeader : {Id: null, Code: '', Description: ''};
			service.selectedQtoHeader = angular.merge(service.selectedQtoHeader, qtoHeader);
		};

		service.setSelectedProjectIds = function setSelectedProjectIds(ids) {
			service.boqHeaderLookupFilter.projectIds = ids;
		};

		service.clearFilter = function clearFilter(skipType) {
			if(angular.isUndefined(skipType) || (skipType === null) || !skipType) {
				service.boqHeaderLookupFilter.boqType = 0;
			}

			service.boqHeaderLookupFilter.projectId = null;
			internalProjectReference.ProjectName = '';
			service.setSelectedProject(null);

			service.boqHeaderLookupFilter.projectIds = [];
			service.selectedBoqHeader = {Id: null, BoqHeaderFk: null, Description: ''};

			service.qtoHeaderLookupFilter.projectId = null;
			service.qtoHeaderLookupFilter.boqHeaderFk = null;
			service.selectedQtoHeader = {Id: null, Code: '', Description: ''};

			service.boqHeaderFilterCleared.fire();
			service.qtoHeaderFilterCleared.fire();
			service.filterCleared.fire();
		};

		service.clearSelectedBoqHeader = function clearSelectedBoqHeader() {
			internalSelectedBoqHeader.Id = null;
			internalSelectedBoqHeader.BoqHeaderFk = null;
			internalSelectedBoqHeader.Description = '';
		};

		service.filterCrbBoqs = function filterCrbBoqs(filter) {
			service.boqHeaderLookupFilter.filterCrbBoqs = filter;
		};

		return service;
	}]);
})();
