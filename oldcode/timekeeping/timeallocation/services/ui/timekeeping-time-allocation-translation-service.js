/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var timekeepingTimeallocationModule = 'timekeeping.timeallocation';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var resourceCommonModule = 'resource.common';
	var timekeepingCommonModule = 'timekeeping.common';
	var timekeepingRecordingModule = 'timekeeping.recording';


	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(timekeepingTimeallocationModule).service('timekeepingTimeallocationTranslationService', TimekeepingTimeallocationTranslationService);

	TimekeepingTimeallocationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingTimeallocationTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [timekeepingTimeallocationModule, basicsCommonModule, cloudCommonModule, resourceCommonModule, timekeepingCommonModule, timekeepingRecordingModule]
		};

		data.words = {
			ProjectFk: {location: timekeepingTimeallocationModule, identifier: 'entityProjectFk'},
			PeriodFk: {location: timekeepingTimeallocationModule, identifier: 'entityPeriodFk'},
			RecordingFk: {location: timekeepingTimeallocationModule, identifier: 'entityRecordingFk'},
			JobFk: {location: timekeepingTimeallocationModule, identifier: 'entityJobFk'},
			DispatchHeaderFk: {location: timekeepingTimeallocationModule, identifier: 'entityDispatchHeaderFk'},
			AllocationDate: {location: timekeepingTimeallocationModule, identifier: 'entityAllocationDate'},
			EmployeeFk: {location: timekeepingCommonModule, identifier: 'employee'},
			EtmPlantFk: {location: resourceCommonModule, identifier: 'entityPlant'},
			ResultFk: {location: timekeepingCommonModule, identifier: 'entityTksResult'},
			Rate: {location: cloudCommonModule, identifier: 'entityRate'},
			TotalProductiveHours: {location: timekeepingTimeallocationModule, identifier: 'entityTotalProductiveHours'},
			DistributedHours: {location: timekeepingTimeallocationModule, identifier: 'entityDistributedHours'},
			ToDistribute: {location: timekeepingTimeallocationModule, identifier: 'entityToDistribute'},
			RecordType: {location: timekeepingTimeallocationModule, identifier: 'entityRecordType'},
			RecordFk: {location: timekeepingTimeallocationModule, identifier: 'entityRecordFk'},
			RecordDescription: {location: timekeepingTimeallocationModule, identifier: 'entityRecordDescription'},
			TimeAllocationStatusFk: {location: timekeepingTimeallocationModule, identifier: 'timekeepingallocstatus'},
			CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany'},
			Comment: {location: timekeepingTimeallocationModule,identifier: 'comment'},
			IsGenerated: {location: timekeepingTimeallocationModule,identifier: 'isgenerated'},
			DistributedHoursCurrentHeader: {location: timekeepingTimeallocationModule, identifier: 'entityDistributedHoursCurrentHeader'},
			DistributedHoursOtherHeaders: {location: timekeepingTimeallocationModule, identifier: 'entityDistributedHoursOtherHeaders'},
			DistributedHoursTotal: {location: timekeepingTimeallocationModule, identifier: 'entityDistributedHours'},
			Allocationenddate: {location: timekeepingTimeallocationModule, identifier: 'entityAllocationenddate'},
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefinedText', '0', 'userdefinedtext');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 10, 'UserDefinedNumber', '0', 'userdefinednumber');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 10, 'UserDefinedDate', '0', 'userdefineddate');
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		/*
		var modules = ['logistic', 'resource', 'services', 'project', 'basics'];
		data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));
*/

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
