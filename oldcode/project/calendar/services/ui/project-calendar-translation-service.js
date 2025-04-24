/*
 * $Id: project-calendar-translation-service.js 535284 2019-02-27 06:26:30Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var projectCalendarModule = 'project.calendar';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var schedulingCalendarModule = 'scheduling.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(projectCalendarModule).service('projectCalendarTranslationService', ProjectCalendarTranslationService);

	ProjectCalendarTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProjectCalendarTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [projectCalendarModule, basicsCommonModule, cloudCommonModule, basicsCustomizeModule, schedulingCalendarModule]
		};

		data.words = {
			CalendarFk: { location: projectCalendarModule, identifier: 'calendarEntityName', initial: 'Project Calendar' },
			CalendarSourceFk: { location: projectCalendarModule, identifier: 'calendarSourceFk', initial: 'Source Calendar' },
			CalendarTypeFk: { location: basicsCustomizeModule, identifier: 'calendartype', initial: 'Calendar Type' },
			basicData: {location: 'cloud.common', identifier: 'entityProperties', initial: 'Basic Data'},
			WorkOperationTypeFk: {location: 'project.calendar', identifier: 'workOperationTypeFk'},
			ExceptDate: {location: 'project.calendar', identifier: 'exceptDate'},
			BackgroundColor: {location: 'project.calendar', identifier: 'backgroundColor'},
			FontColor: {location: 'project.calendar', identifier: 'fontColor'},
			IsWorkDay: {location: 'project.calendar', identifier: 'isWorkDay'},
			IsShownInChart: {location: 'project.calendar', identifier: 'isShownInChart'},
			IsReleased: {location: 'project.calendar', identifier: 'isReleased'},
			WorkStart: {location: 'project.calendar', identifier: 'workStart'},
			WorkEnd: {location: 'project.calendar', identifier: 'workEnd'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
