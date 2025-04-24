/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	const resourceProjectModule = 'resource.project';
	const cloudCommonModule = 'cloud.common';
	const projectMainModule = 'project.main';
	const resourceModule = 'resource.requisition';
	const schedulingMainModule = 'scheduling.main';
	const basicsMaterialModule = 'basics.material';
	const logisticActionModule = 'logistic.action';
	const basicsCustomizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name resourceProjectTranslationService
	 * @description provides translation methods for resource project module
	 */
	angular.module(resourceProjectModule).service('resourceProjectTranslationService', ResourceProjectTranslationService);

	ResourceProjectTranslationService.$inject = ['platformTranslationUtilitiesService', 'resourceRequisitionTranslationService'];

	function ResourceProjectTranslationService(platformTranslationUtilitiesService, resourceRequisitionTranslationService) {
		const self = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceProjectModule, cloudCommonModule, projectMainModule,resourceModule,schedulingMainModule,basicsMaterialModule, logisticActionModule,
				'resource.reservation', 'resource.requisition', 'basics.customize', 'logistic.common', 'logistic.dispatching']
		};

		data.words = {
			ProjectNo: {location: projectMainModule, identifier: 'projectNo'},
			ProjectName: {location: cloudCommonModule, identifier: 'entityName'},
			ProjectName2: {location: projectMainModule, identifier: 'name2'},
			CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency'},
			CostCode: {location: resourceProjectModule, identifier: 'entityCostCodeCode'},
			CostCodeDescInfo: {location: resourceProjectModule, identifier: 'entityCostCodeDescInfo'},
			ResourceDescInfo: {location: resourceProjectModule, identifier: 'entityResourceDescInfo'},
			RubricCategoryFk: {location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk'},

			RecordNo:{ location: logisticActionModule, identifier: 'entityRecordNo' },
			DueDate: {location: resourceProjectModule, identifier: 'entityDueDate'},
			ActionItemStatusFk: {location: resourceProjectModule, identifier: 'entityActionItemStatus'},
			DocumentFk: {location: resourceProjectModule, identifier: 'entityDocument'},
			PlantCertificateFk: {location: resourceProjectModule, identifier: 'entityPlantCertificate'},
			ContractHeaderFk: {location: resourceProjectModule, identifier: 'entityContractHeader'},
			BusinessPartnerFk: {location: resourceProjectModule, identifier: 'entityBusinessPartner'},
			TransportStart: {location: resourceProjectModule, identifier: 'entityTransportStart'},
			TransportEnd: {location: resourceProjectModule, identifier: 'entityTransportEnd'},
			DeliveryTimesFrom: {location: resourceProjectModule, identifier: 'entityDeliveryTimesFrom'},
			DeliveryTimeStill: {location: resourceProjectModule, identifier: 'entityDeliveryTimeStill'},
			ClerkFk: {location: resourceProjectModule, identifier: 'entityClerk'},
			ClerkResponsibleFk: {location: resourceProjectModule, identifier: 'entityClerkResponsible'},
			IsLive: {location: cloudCommonModule, identifier: 'entityIsLive'},
			IsAuthorized: {location: resourceProjectModule, identifier: 'entityIsAuthorized'},
			IsRequestDate: {location: resourceProjectModule, identifier: 'entityIsRequestDate'},
			IsRequestUrl: {location: resourceProjectModule, identifier: 'entityIsRequestUrl'},
			IsRequestPrjDocument: {location: resourceProjectModule, identifier: 'entityIsRequestPrjDocument'},
			IsRequestPlantCertificate: {location: resourceProjectModule, identifier: 'entityIsRequestPlantCertificate'},
			IsRequestBizPartner: {location: resourceProjectModule, identifier: 'entityIsRequestBizPartner'},
			IsRequestPrcContract: {location: resourceProjectModule, identifier: 'entityIsRequestPrcContract'},
			IsRequestClerk: {location: resourceProjectModule, identifier: 'entityIsRequestClerk'},
			Url: { location: basicsCustomizeModule, identifier: 'url' },
			InitialStartDate: {location: resourceProjectModule, identifier: 'initialStartDate'},
			InitialDuration: {location: resourceProjectModule, identifier: 'initialDuration'},
			InitialEndDate: {location: resourceProjectModule, identifier: 'initialEndDate'},
			ActualStartDate: {location: resourceProjectModule, identifier: 'actualStartDate'},
			ActualDuration: {location: resourceProjectModule, identifier: 'actualDuration'},
			ActualEndDate: {location: resourceProjectModule, identifier: 'actualEndDate'},
			TimeslotUpdateReasonFk: {location: basicsCustomizeModule, identifier: 'resourcetimeslotupdatereason'},
			TimeslotNumber: {location: resourceProjectModule, identifier: 'timeslotNumber'}
		};

		resourceRequisitionTranslationService.addRequisitionTranslation(data.words);

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 6, 'UserDefinedText', '0');

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);