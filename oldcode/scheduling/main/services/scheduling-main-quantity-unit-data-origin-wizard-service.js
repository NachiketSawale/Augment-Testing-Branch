/* global globals */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name schedulingQuantityUnitDataOriginWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.main').factory('schedulingMainQuantityUnitDataOriginWizardService',
		['$http','$translate', 'platformModalService','schedulingMainService','platformSidebarWizardCommonTasksService',
			function ($http, $translate, platformModalService, schedulingMainService,platformSidebarWizardCommonTasksService) {

				var serviceContainer = {data: {}, service: {}};

				serviceContainer.service.updateQuantityUnitDataOrigin = function updateQuantityUnitDataOrigin(options, placeHolder, descInfo) {

					var act = schedulingMainService.getSelected();

					if (act && act.Id) {
						var newObject = {
							Action: 14,
							ReferredEntityId: parseInt(options.Quantity)
						};
						var valueTwo = parseInt(options.Source);
						if (valueTwo === 1) {
							newObject.EffectedItemId = act.Id;
						}
						else {
							newObject.ScheduleId = act.ScheduleFk;
						}

						$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', newObject).then(function() {
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(descInfo.name);
						});
					}
				};

				return serviceContainer.service;
			}
		]);
})(angular);
