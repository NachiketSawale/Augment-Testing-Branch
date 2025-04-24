/**
 * Created by zwz on 20/03/2023.
 */
(function () {
	'use strict';

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsProjectUtilService', [
		function () {
			this.getProjectId = (entity, defaultValue = -1) => {
				let projectId = defaultValue;
				if (entity.PrjProjectFk) {
					projectId = entity.PrjProjectFk;
				} else if (entity.ProjectFk) {
					projectId = entity.ProjectFk;
				} else if (entity. ProjectId) {
					projectId = entity.ProjectId;
				}
				return projectId;
			};
		}
	]);
})();
