/*
 * $Id: project-main-pinnable-entity-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name project.main.projectMainPinnableEntityService
	 * @function
	 * @requires cloudDesktopPinningContextService, basicsLookupdataLookupDataService
	 *
	 * @description A pinning context service adapter for projects.
	 */
	angular.module('project.main').factory('projectMainPinnableEntityService', ['cloudDesktopPinningContextService',
		'basicsLookupdataLookupDataService',
		function (cloudDesktopPinningContextService, basicsLookupdataLookupDataService) {
			return cloudDesktopPinningContextService.createPinnableEntityService({
				token: 'project.main',
				retrieveInfo: function (id) {
					return basicsLookupdataLookupDataService.getItemByKey('Project', id).then(function (projectItem) {
						projectItem = projectItem ? projectItem : {ProjectNo: '*'};
						return cloudDesktopPinningContextService.concate2StringsWithDelimiter(projectItem.ProjectNo, projectItem.ProjectName, ' - ');
					});
				}
			});
		}]);
})();