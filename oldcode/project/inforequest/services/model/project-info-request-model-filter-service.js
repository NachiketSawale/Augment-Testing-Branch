/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name project.inforequest.projectInfoRequestModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Info Request (RFI) module.
	 */
	angular.module('project.inforequest').factory('projectInfoRequestModelFilterService',
		projectInfoRequestModelFilterService);

	projectInfoRequestModelFilterService.$inject = ['projectMainProjectSelectionService',
		'modelViewerFilterFuncFactory',
		'projectInfoRequestModelAnnoObjectLinkDataService'];

	function projectInfoRequestModelFilterService(projectMainProjectSelectionService,
		modelViewerFilterFuncFactory,
		projectInfoRequestModelAnnoObjectLinkDataService) {

		projectMainProjectSelectionService.setItemSource('pinnedProject');

		return modelViewerFilterFuncFactory.createForDataService([projectInfoRequestModelAnnoObjectLinkDataService.createModelFilterSettings(), {
			serviceName: 'projectInfoRequestDataService'
		}]);
	}
})(angular);
