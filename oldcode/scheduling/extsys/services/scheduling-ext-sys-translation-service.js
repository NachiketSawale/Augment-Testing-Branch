/**
 * Created by csalopek on 14.08.2017.
 */

(function (angular) {
	'use strict';

	var schedulingExtSysModule = 'scheduling.extsys';
	var cloudCommonModule = 'cloud.common';
	var schedulingCalendarModule = 'scheduling.calendar';

	/**
	 * @ngdoc service
	 * @name schedulingExtSysTranslationService
	 * @description provides translation for scheduling calendar module
	 */
	angular.module(schedulingExtSysModule).factory('schedulingExtSysTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService',

		function (platformTranslateService, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [schedulingExtSysModule, cloudCommonModule, schedulingCalendarModule]
			};

			data.words = {
				CalendarFk: {
					location: schedulingCalendarModule,
					identifier: 'translationDescCalendar',
					initial: 'Calendar'
				},
				ExternalSourceFk: {
					location: schedulingExtSysModule,
					identifier: 'entityExtSource',
					initial: 'External Source'
				},
				ExtGuid: {location: schedulingExtSysModule, identifier: 'entityExtGuid', initial: 'ExtGuid'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
