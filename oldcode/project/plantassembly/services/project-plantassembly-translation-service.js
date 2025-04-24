/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	let projectPlantassemblyModule = 'project.plantassembly';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';
	let estimateMainModule = 'estimate.main';
	let estimateProjectModule = 'estimate.project';
	/**
	 * @ngdoc service
	 * @name projectPlantAssemblyTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // letiable name is forced by translation json file
	angular.module(projectPlantassemblyModule).service('projectPlantAssemblyTranslationService', ProjectPlantassemblyTranslationService);

	ProjectPlantassemblyTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProjectPlantassemblyTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [projectPlantassemblyModule, basicsCommonModule, cloudCommonModule,estimateMainModule,estimateProjectModule]
		};

		data.words = {
			basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
			QuantityFactor1:{ location: estimateMainModule, identifier: 'quantityFactor1', initial: 'Quantity Factor1(Project)' },
			QuantityFactor2:{ location: estimateMainModule, identifier: 'quantityFactor2', initial: 'Quantity Factor2(Project)' },
			QuantityFactor3:{ location: estimateMainModule, identifier: 'quantityFactor3', initial: 'Quantity Factor3(Project)' },
			QuantityFactor4:{ location: estimateMainModule, identifier: 'quantityFactor4', initial: 'Quantity Factor4(Project)' },
			CostFactor1:{ location: estimateMainModule, identifier: 'costFactor1', initial: 'Cost Factor1(Project)' },
			CostFactor2:{ location: estimateMainModule, identifier: 'costFactor2', initial: 'Cost Factor2(Project)' },
			LgmJobFk: {location: estimateProjectModule, identifier: 'lgmJobFk', initial: 'Job'},
			EtmPlantgroupFk: {location: estimateProjectModule, identifier: 'etmPlantgroupFk', initial: 'Equipment Plant Group'},
			EtmPlantFk: {location: estimateProjectModule, identifier: 'etmPlantFk', initial: 'Equipment Plant'}
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
