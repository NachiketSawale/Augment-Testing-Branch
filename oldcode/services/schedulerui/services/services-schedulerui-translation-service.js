/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var servicesScheduleruiModule = 'services.schedulerui';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name servicesScheduleruiTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(servicesScheduleruiModule).service('servicesScheduleruiTranslationService', ServicesScheduleruiTranslationService);

	ServicesScheduleruiTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ServicesScheduleruiTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [servicesScheduleruiModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			Id: { location: servicesScheduleruiModule, identifier: 'columns.id', initial: 'Id' },
			JobFk: { location: servicesScheduleruiModule, identifier: 'columns.jobFk', initial: 'Parent' },
			Name: { location: servicesScheduleruiModule, identifier: 'columns.name', initial: 'Name' },
			Description: { location: servicesScheduleruiModule, identifier: 'columns.description', initial: 'Description' },
			Log: { location: servicesScheduleruiModule, identifier: 'columns.log', initial: 'Log' },
			JobState: { location: servicesScheduleruiModule, identifier: 'columns.jobstate', initial: 'Job State' },
			StartTime: { location: servicesScheduleruiModule, identifier: 'columns.starttime', initial: 'Start Time' },
			ExecutionStartTime: { location: servicesScheduleruiModule, identifier: 'columns.executionstarttime', initial: 'Execution Start Time' },
			ExecutionEndTime: { location: servicesScheduleruiModule, identifier: 'columns.executionendtime', initial: 'Execution End Time' },
			Parameter: { location: servicesScheduleruiModule, identifier: 'columns.parameter', initial: 'Parameter' },
			Priority: { location: servicesScheduleruiModule, identifier: 'columns.priority', initial: 'Priority' },
			RepeatUnit: { location: servicesScheduleruiModule, identifier: 'columns.repeatunit', initial: 'Repeat Unit' },
			RepeatCount: { location: servicesScheduleruiModule, identifier: 'columns.repeatcount', initial: 'Repeat Count' },
			TaskType: { location: servicesScheduleruiModule, identifier: 'columns.tasktype', initial: 'Task Type' },
			LoggingLevel: { location: servicesScheduleruiModule, identifier: 'columns.logginglevel', initial: 'Logging Level' },
			RunInUserContext: { location: servicesScheduleruiModule, identifier: 'columns.runinusercontext', initial: 'Run In User Context' },
			KeepDuration: { location: servicesScheduleruiModule, identifier: 'columns.keepduration', initial: 'Keep Duration' },
			KeepCount: { location: servicesScheduleruiModule, identifier: 'columns.keepcount', initial: 'Keep Count' },
			ExecutionMachine: { location: servicesScheduleruiModule, identifier: 'columns.executionmachine', initial: 'Execution Machine' },
			MachineName: { location: servicesScheduleruiModule, identifier: 'columns.machinename', initial: 'Target Group' }
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
	}

})(angular);
