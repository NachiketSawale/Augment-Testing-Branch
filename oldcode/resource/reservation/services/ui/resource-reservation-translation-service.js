(function (angular) {
	'use strict';

	var resourceReservationModule = 'resource.reservation';
	var resourceRequisitionModule = 'resource.requisition';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var schedulingMainModule = 'scheduling.main';
	var resourceMasterModule = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceReservationTranslationService
	 * @description provides translation for object Main module
	 */
	angular.module(resourceReservationModule).factory('resourceReservationTranslationService', ['_', 'platformTranslationUtilitiesService',

		function (_, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [resourceReservationModule, resourceRequisitionModule, cloudCommonModule, basicsCustomizeModule, schedulingMainModule, resourceMasterModule]
			};

			data.words = {
				ResourceFk: {location: resourceMasterModule, identifier: 'entityResource'},
				ReservationStatusFk: {location: cloudCommonModule, identifier: 'entityState'},
				ReservationTypeFk: {location: cloudCommonModule, identifier: 'entityType'},
				RequisitionFk: {location: resourceRequisitionModule, identifier: 'entityRequisition'},
				ReservedFrom: {location: resourceReservationModule, identifier: 'entityReservedFrom'},
				ReservedTo: {location: resourceReservationModule, identifier: 'entityReservedTo'},
				Quantity: {location: cloudCommonModule, identifier: 'entityQuantity'},
				UomFk: {location: cloudCommonModule, identifier: 'entityUoM'},
				ActivityFk: {location: schedulingMainModule, identifier: 'activity'},
				JobHeaderFk: {location: resourceReservationModule, identifier: 'entityJobHeader'},
				TypeFk: {location: basicsCustomizeModule, identifier: 'resourcetype'},
				TrsRequisitionFk: {location: resourceRequisitionModule, identifier: 'entityTrsRequisitionFk'},
				PpsEventFk: {location: resourceRequisitionModule, identifier: 'entityPpsEvent'},
				RequestedFrom: {location: resourceReservationModule, identifier: 'entityRequestedFrom'},
				RequestedTo: {location: resourceReservationModule, identifier: 'entityRequestedTo'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
				WorkingDays:  {location: resourceReservationModule, identifier: 'entityWorkingDays', initial: 'Working Days'},
				CalendarDays:  {location: resourceReservationModule, identifier: 'entityCalendarDays', initial: 'Calendar Days'},
				DispatcherGroupFk: {location: resourceRequisitionModule, identifier: 'entityDispatcherGroupFk'},
				RubricCategoryFk: {location: resourceReservationModule, identifier: 'rubricCategoryFk'},
				ProjectFk: {location: cloudCommonModule, identifier: 'entityProject'},
				JobFk: {location: resourceReservationModule, identifier: 'entityJob'},
				JobGroupFk: {location: resourceReservationModule, identifier: 'entityJobGroup' },
				CompanyFk: { location: cloudCommonModule, identifier: 'entityCompany' },
				JobPreferredFk: { location: resourceReservationModule, identifier: 'JobPreferredFk'},
				IsWorkOnWeekend: { location: resourceReservationModule, identifier: 'isWorkOnWeekend'},
				InstructionsOfDriver: { location: resourceReservationModule, identifier: 'instructionsOfDriver'},
				ProjectChangeFk: {location: cloudCommonModule, identifier: 'entityProjectChange'},
				ProjectChangeStatusFk: { location: basicsCustomizeModule, identifier: 'projectchangestatus', initial: 'Project Change Status' },
				Code: { location: resourceReservationModule, identifier: 'entityCode' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			let modules = ['logistic', 'resource',  'basics', 'project'];
			data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 6, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 6, 'UserDefinedDate', '0');
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
