
(function (angular) {
	'use strict';

	const controllingProjectControlsModule = 'controlling.projectcontrols';
	const procurementPackageModule = 'procurement.package';
	const cloudCommonModule = 'cloud.common';
	angular.module(controllingProjectControlsModule).service('controllingProjectControlsPackageTranslationService', ControllingProjectControlsPackageTranslationService);

	ControllingProjectControlsPackageTranslationService.$inject = ['_', 'platformTranslationUtilitiesService'];

	function ControllingProjectControlsPackageTranslationService(_, platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [controllingProjectControlsModule, cloudCommonModule]
		};

		data.words = {
			BusinesspartnerName: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.businessPartnerName', 'initial': 'Business Partner Name'},
			ContractCode: {'location': procurementPackageModule, 'identifier': 'entityContract.code', 'initial': 'Contract Code'},
			ContractDescription: {'location': procurementPackageModule, 'identifier': 'entityContract.description', 'initial': 'Contract Description'},
			ContractStatus: {'location': procurementPackageModule, 'identifier': 'entityContract.status', 'initial': 'Contract Status'},
			PlannedStart: {'location': procurementPackageModule, 'identifier': 'entityPlannedStart', 'initial': 'Planned Start'},
			PlannedEnd: {'location': procurementPackageModule, 'identifier': 'entityPlannedEnd', 'initial': 'Planned End'},
			ActualStart: {'location': procurementPackageModule, 'identifier': 'entityActualStart', 'initial': 'Actual Start'},
			ActualEnd: {'location': procurementPackageModule, 'identifier': 'entityActualEnd', 'initial': 'Actual End'},
			PrcValue: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.prcValue', 'initial': 'Prc Value'},
			PrcBudget: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.prcbudget', 'initial': 'Prc Budget'},
			ReqValue: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.reqvalue', 'initial': 'Req Value'},
			ConValueOverall: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.convalueoverall', 'initial': 'Con Value Overall'},
			ConValueApproved: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.convalueapproved', 'initial': 'Con Value Approved'},
			ConValueOrde: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.convalueorde', 'initial': 'Con Value Orde'},
			ConValueMain: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.convaluemain', 'initial': 'Con Value Main'},
			ConValueCoApproved: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.convaluecoapproved', 'initial': 'Con Value Co Approved'},
			ConValueCoNApproved: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.convalueconapproved', 'initial': 'Con Value Co Not Approved'},
			PesValueOverall: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.pesvalueoverall', 'initial': 'Pes Value Overall'},
			PesValueAccepted: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.pesvalueaccepted', 'initial': 'Pes Value Accepted'},
			InvValueOverall: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.invvalueoverall', 'initial': 'Inv Value Overall'},
			InvValuePosted: {'location': controllingProjectControlsModule, 'identifier': 'packageContainer.invvalueposted', 'initial': 'Inv Value Posted'},
			ControllingUnitCode: {'location': cloudCommonModule, 'identifier': 'entityControllingUnitCode', 'initial': 'ControllingUnit Code'},
			StructureCode: {'location': 'basics.procurementstructure', 'identifier': 'moduleName', 'initial': 'Procurement Structure'}
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
