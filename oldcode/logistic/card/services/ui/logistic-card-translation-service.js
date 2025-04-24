/*
 * $Id: logistic-card-translation-service.js 629428 2021-03-24 08:22:51Z shen $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var logisticCardModule = 'logistic.card';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var logisticCommonModule = 'logistic.common';
	var procureStrucureModule = 'basics.procurementstructure';

	/**
	 * @ngdoc service
	 * @name logisticCardTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(logisticCardModule).service('logisticCardTranslationService', LogisticCardTranslationService);

	LogisticCardTranslationService.$inject = ['platformTranslationUtilitiesService', '_', 'resourceEquipmentTranslationService'];

	function LogisticCardTranslationService(platformTranslationUtilitiesService, _, resourceEquipmentTranslationService) {
		var service = this;

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticCardModule, basicsCommonModule, cloudCommonModule, basicsCustomizeModule,
				logisticCommonModule,procureStrucureModule]
		};
		// data.allUsedModules = _.concat(data.allUsedModules, resourceEquipmentTranslationModulesServices.getAllTranslationModules(), logisticJobTranslationModulesServices.getAllTranslationModules());
		var modules = ['logistic', 'resource', 'services', 'project', 'basics', 'documents'];
		data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

		data.words = {
			PlannedStart: { location: logisticCardModule, identifier: 'plannedStart'},
			PlannedFinish: { location: logisticCardModule, identifier: 'plannedFinish'},
			RecordNo: { location: logisticCardModule, identifier: 'recordNo'},
			JobCardRecordTypeFk: { location: basicsCustomizeModule, identifier: 'jobcardrecordtype'},
			CardRecordFk: { location: logisticCardModule, identifier: 'cardRecord'},
			ActualStart: { location: logisticCardModule, identifier: 'actualStart'},
			ActualFinish: { location: logisticCardModule, identifier: 'actualFinish'},
			JobFk: { location: logisticCardModule, identifier: 'entityJob'},
			ReservationFk: { location: logisticCardModule, identifier: 'entityReservation'},
			DispatchHeaderFk: { location: logisticCardModule, identifier: 'dispatchHeader'},
			DispatchRecordFk: { location: logisticCardModule, identifier: 'dispatchRecord'},
			JobCardStatusFk: { location: cloudCommonModule, identifier: 'entityState'},
			WorkOperationTypeFk: { location: logisticCardModule, identifier: 'workOperationTypeFk'},
			PrjStockFk: {location: logisticCardModule, identifier: 'entityStock'},
			Remark: {location: logisticCardModule, identifier: 'entityRemark'},
			Comment: {location: logisticCardModule, identifier: 'entityComment'},
			ClerkFk: {location: logisticCardModule, identifier: 'entityClerkFk'},
			IsDone: {location: logisticCardModule, identifier: 'entityIsDone'},
			PlantFk:{ location: logisticCardModule, identifier: 'entityPlant'},
			JobCardTemplateFk: {location: logisticCardModule, identifier: 'cardTemplateEntity'},
			JobCardDocTypeFk :{ location: logisticCardModule, identifier: 'entityJobCardDocTypeFk'},
			DocumentTypeFk:{ location: logisticCardModule, identifier: 'entityDocumentTypeFk'},
			OriginFileName:{location: cloudCommonModule, identifier: 'documentOriginFileName'},
			Date:{ location: cloudCommonModule, identifier: 'entityDate'},
			Barcode:{ location: logisticCardModule, identifier: 'entityBarcode'},
			Quantity: { location: logisticCardModule, identifier: 'entityQuantity'},
			AcceptedQuantity:{ location: logisticCardModule, identifier: 'entityAcceptedQuantity'},
			DeliveredQuantity:{ location: logisticCardModule, identifier: 'entityDeliveredQuantity'},
			EmployeeFk: {location: logisticCardModule, identifier: 'entityEmployee'},
			CardRecordDescription: {location: logisticCardModule, identifier: 'cardRecordDescription'},
			UomFk:{ location: cloudCommonModule, identifier: 'entityUoM'},
			ResourceFk:{ location: logisticCardModule, identifier: 'entityResource'},
			RequisitionFk: { location: logisticCardModule, identifier: 'entityRequisition'},
			ActualStartDate: { location: logisticCardModule, identifier: 'entityActualstartdate'},
			ActualStopDate: { location: logisticCardModule, identifier: 'entityActualstopdate'},
			RubricCategoryFk: { location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk'},
			ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
			JobCardAreaFk:{ location: basicsCustomizeModule, identifier: 'jobcardarea'},
			JobCardGroupFk:{ location: basicsCustomizeModule, identifier: 'jobcardgroup'},
			JobCardPriorityFk:{ location: basicsCustomizeModule, identifier: 'jobcardpriority'},
			WorkDay:{ location: logisticCardModule, identifier: 'entityWorkDay'},
			WorkStart:{ location: logisticCardModule, identifier: 'entityWorkStart'},
			WorkEnd:{ location: logisticCardModule, identifier: 'entityWorkEnd'},
			WorkBreak:{ location: logisticCardModule, identifier: 'entityWorkBreak'},
			SundryServiceFk:{ location: logisticCardModule, identifier: 'entitySundryServiceFk'},
			WorkingMinutes:{ location: logisticCardModule, identifier: 'entityWorkingMinutes'},
			TotalTime:{ location: logisticCardModule, identifier: 'entityTotalTime'},
			BasClerkOwnerFk:{ location: logisticCardModule, identifier: 'entityBasClerkOwnerFk'},
			BasClerkResponsibleFk:{ location: logisticCardModule, identifier: 'entityBasClerkResponsibleFk'},
			Meterreading:{ location: logisticCardModule, identifier: 'entityMeterreading'},
			NotDoneCount: {location: logisticCardModule, identifier: 'entityNotDoneCount'},
			JobPerformingFk:{location: logisticCardModule, identifier: 'entityJobPerforming'},
			ProjectFk:{location: logisticCardModule, identifier: 'entityProject'},
			ProcurementStructureFk:{location: procureStrucureModule, identifier: 'prcStructureFk'},
			Url: { location: logisticCardModule, identifier: 'url', initial: 'Url' },
			JobCardActivityFk: { location: logisticCardModule, identifier: 'jobcardactivityfk', initial: 'jobCardActivityFk' },
			Start: { location: logisticCardModule, identifier: 'start', initial: 'start' },
			Finish: { location: logisticCardModule, identifier: 'finish', initial: 'finish' },
			JobCardFk: { location: logisticCardModule, identifier: 'jobcardfk', initial: 'jobcardfk' },
			ReservationId: {location: logisticCardModule, identifier: 'ReservationId'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment'}
		};

		// Get some predefined packages of words used in project
		resourceEquipmentTranslationService.addCompatibleMaterialWords(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 6, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 6, 'UserDefinedNumber', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 6, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
