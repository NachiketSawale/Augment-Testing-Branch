/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('timekeepingWorkTimeModelLayoutService', TimekeepingWorkTimeModelLayoutService);

	TimekeepingWorkTimeModelLayoutService.$inject = ['platformUIConfigInitService',
		'timekeepingWorktimemodelContainerInformationService',
		'timekeepingWorkTimeModelTranslationService'];

	function TimekeepingWorkTimeModelLayoutService(platformUIConfigInitService,
		timekeepingWorktimemodelContainerInformationService,
		timekeepingWorkTimeModelTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingWorktimemodelContainerInformationService.getWorkTimeModelLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Timekeeping.WorkTimeModel',
				typeName: 'WorkTimeModelDto'
			},
			translator: timekeepingWorkTimeModelTranslationService
		});
	}
})(angular);
