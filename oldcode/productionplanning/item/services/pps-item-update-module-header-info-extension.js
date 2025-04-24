/**
 * Created by zwz on 2021/9/16.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningItemUpdateModuleHeaderInfoExtension
	 * @function
	 * @requires _,$q,basicsLookupdataLookupDescriptorService,cloudDesktopInfoService,cloudDesktopPinningContextService
	 * @description ProductionplanningItemUpdateModuleHeaderInfoExtension provides functionality of updating header info of PlanningUnit module
	 */
	itemModule.service('productionplanningItemUpdateModuleHeaderInfoExtension', Extension);
	Extension.$inject = ['_', '$q', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopInfoService', 'cloudDesktopPinningContextService'];

	function Extension(_, $q, basicsLookupdataLookupDescriptorService, cloudDesktopInfoService, cloudDesktopPinningContextService) {

		/**
		 * @ngdoc function
		 * @description update header info of PlanningUnit module
		 * @param {Object} ppsItem: The selected ppsItem record.
		 **/
		this.updateModuleHeaderInfo = function (ppsItem) {
			var selectedProject = {};
			var selectedHeader = {};

			var projectPromise = $q.when(true);
			var headerPromise = $q.when(true);
			if (ppsItem !== null && !_.isEmpty(ppsItem)) {
				projectPromise = $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('Project', getProjectId(ppsItem))).then(function (project) {
					if (project) {
						selectedProject = {
							ProjectNo: project.ProjectNo,
							ProjectName: project.ProjectName,
							ProjectId: project.Id
						};
					}
				});
				headerPromise = $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('PpsHeader', ppsItem.PPSHeaderFk)).then(function (header) {
					if (header) {
						selectedHeader = {
							Code: header.Code,
							DescriptionInfo: header.DescriptionInfo,
							Id: header.Id
						};
					}
				});
				$q.all([projectPromise, headerPromise]).then(function () {
					updateModuleHeaderInfo(ppsItem, selectedProject, selectedHeader);
				});
			} else {
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePPSItem', ''); // empty header info
			}
		};

		function updateModuleHeaderInfo(ppsItem, selectedProject, selectedHeader) {
			let entityText = '';
			let entityHeaderObject = {};
			if (ppsItem && angular.isDefined(ppsItem)) {
				if (selectedProject.ProjectNo) {
					if (isEmptyString(selectedProject.ProjectName)) {
						entityText = selectedProject.ProjectNo;
					} else {
						entityText = selectedProject.ProjectNo + ' - ' + selectedProject.ProjectName;
					}
					entityHeaderObject.project = {
						id: selectedProject.ProjectId,
						description: entityText
					}
				}

				if (selectedHeader.Code) {
					if (isEmptyString(selectedHeader.DescriptionInfo.Translated)) {
						entityText = selectedHeader ? selectedHeader.Code : '';
					} else {
						entityText = selectedHeader ? selectedHeader.Code + ' - ' + selectedHeader.DescriptionInfo.Translated : '';
					}
					entityHeaderObject.module = {
						id: selectedHeader.Id,
						description: entityText,
						moduleName: moduleName
					}
				}

				if (angular.isDefined(ppsItem.DescriptionInfo) && isEmptyString(ppsItem.DescriptionInfo.Translated)) {
					entityText = !_.isEmpty(ppsItem) ? ppsItem.Code : '';
				} else {
					entityText = !_.isEmpty(ppsItem) ? ppsItem.Code + ' - ' + ppsItem.DescriptionInfo.Translated : '';
				}
				entityHeaderObject.lineItem = {
					description: entityText
				}
			}
			cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePPSItem', entityHeaderObject);
		}

		function isEmptyString(text) {
			return _.isNil(text) || text.trim() === '';
		}

		function getProjectId(ppsItem) {
			var projectId = ppsItem.ProjectFk;
			if (_.isNil(projectId) || projectId === 0) {
				var context = cloudDesktopPinningContextService.getContext();
				var pinningPrj = _.find(context, { token: 'project.main' });
				if (pinningPrj) {
					projectId = pinningPrj.Id;
				}
			}
			return projectId;
		}

	}
})(angular);