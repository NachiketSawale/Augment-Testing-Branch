/**
 * Created by leo on 16.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.calendar';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name scheduling.calendar
	 * @description
	 * Module definition of the scheduling module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'schedulingCalendarExceptiondayWizardService',
				wizardGuid: '81cb872e1e4f4607b89b6f86dfc80c33',
				methodName: 'createExceptionDays',
				canActivate: true
			}, {
				serviceName: 'schedulingCalendarSidebarWizardService',
				wizardGuid: '41acb6a864df4085924df772f45286d2',
				methodName: 'disableCalendar',
				canActivate: true
			}, {
				serviceName: 'schedulingCalendarSidebarWizardService',
				wizardGuid: 'dc3207967e644708b0187820c5958129',
				methodName: 'enableCalendar',
				canActivate: true
			},
			{
				serviceName: 'schedulingCalendarSidebarWizardService',
				wizardGuid: '34b854f51d024f67abb0da8334b1f531',
				methodName: 'deleteCalendar',
				canActivate: true
			}
			];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'CalendarDto', moduleSubModule: 'Scheduling.Calendar'},
							{typeName: 'WorkdayDto', moduleSubModule: 'Scheduling.Calendar'},
							{typeName: 'WorkHourDto', moduleSubModule: 'Scheduling.Calendar'},
							{typeName: 'WeekdayDto', moduleSubModule: 'Scheduling.Calendar'},
							{typeName: 'ExceptionDayDto', moduleSubModule: 'Scheduling.Calendar'}
						]);
					}],
					loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('schedulingCalendarMainService').searchByCalId(item, triggerField);
					}
				}
			);
		}]);

})(angular);
