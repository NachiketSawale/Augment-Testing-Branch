/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name defect.main.defectMainModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Defect module.
	 */
	angular.module('defect.main').factory('defectMainModelFilterService',
		defectMainModelFilterService);

	defectMainModelFilterService.$inject = ['projectMainProjectSelectionService',
		'modelViewerFilterFuncFactory', 'defectMainModelAnnoObjectLinkDataService'];

	function defectMainModelFilterService(projectMainProjectSelectionService,
		modelViewerFilterFuncFactory, defectMainModelAnnoObjectLinkDataService) {

		projectMainProjectSelectionService.setItemSource('pinnedProject');

		return modelViewerFilterFuncFactory.createForDataService([defectMainModelAnnoObjectLinkDataService.createModelFilterSettings(), {
			serviceName: 'defectMainHeaderDataService'
		}]);
	}
})(angular);
