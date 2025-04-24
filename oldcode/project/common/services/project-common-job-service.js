(function (angular) {
	'use strict';
	/* global globals, Platform, _ */
	let moduleName = 'project.common';
	/**
	 * @ngdoc service
	 * @name estimateCommonFilterServiceProvider
	 * @function
	 *
	 * @description
	 * estimateCommonFilterServiceProvider for filtering e.g. line items container by combination of several filters.
	 */
	angular.module(moduleName).factory('projectCommonJobService', ['$injector', '$http', '$q','projectMainService',
		function ($injector, $http, $q, projectMainService) {
			let jobs = {};
			let status = [];
			let isStatusLoaded = false;
			let jobsPath = globals.webApiBaseUrl + 'logistic/job/ownedByProject';
			let jobStatusPath = globals.webApiBaseUrl + 'basics/lookupData/getData';
			let currentProjectFk = 0;
			let service = {
				prepareData: prepareData,
				isJobReadOnly: isJobReadOnly,
				clear: clear
			};
			function prepareData(projectFk) {
				if(!projectFk) {
					let selectedProjectItem = projectMainService.getSelected();
					projectFk = selectedProjectItem ? selectedProjectItem.Id : 0;
				}
				currentProjectFk = projectFk;
				return $q.all([loadJobStatus(), loadProjectJob()]);
			}

			function loadProjectJob() {
				if (jobs[currentProjectFk]) {
					return $q.when(jobs[currentProjectFk]);
				} else {
					return reloadJobs(currentProjectFk);
				}
			}

			function reloadJobs(projectFk) {
				return $http.get(jobsPath + '?projectFk=' + projectFk).then(function (response) {
					jobs[projectFk] = response.data;
					return jobs[projectFk];
				});
			}

			function loadJobStatus() {
				if (!isStatusLoaded) {
					let postData = {
						lookupModuleQualifier: 'basics.customize.jobstatus',
						displayProperty:'Description',
						valueProperty:'Id',
						CustomBoolProperty:'IsReadOnly'
					};
					return $http.post(jobStatusPath,postData ).then(function (res) {
						if (res.data) {
							status = res.data.items;
							isStatusLoaded = true;
						}
					});
				}
				return $q.when(status);
			}

			function isJobReadOnly(jobFk, projectFk) {
				if (projectFk) {
					currentProjectFk = projectFk;
				}
				if (currentProjectFk && jobs[currentProjectFk]) {
					let jobInfo = _.find(jobs[currentProjectFk], {Id: jobFk});
					if (jobInfo) {
						let statusInfo = _.find(status, {id: jobInfo.JobStatusFk});
						if (statusInfo && statusInfo.customBoolProperty) {
							return true;
						}
					}
				}
				return false;
			}

			function clear() {
				jobs = {};
				status = [];
				isStatusLoaded = false;
			}

			return service;
		}]);
})(angular);