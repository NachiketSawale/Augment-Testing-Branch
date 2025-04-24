/**
 * Created by Frank Baedeker on 22.08.2017.
 */
(function (angular) {
	'use strict';

	var resourceTypeModule = 'resource.type';
	var module = angular.module(resourceTypeModule);

	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var resourceSkillModule = 'resource.skill';

	/**
	 * @ngdoc service
	 * @name resourceTypeTranslationService
	 * @description provides translation for resource type module
	 */
	module.service('resourceTypeTranslationService', ResourceTypeTranslationService);

	ResourceTypeTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceTypeTranslationService(platformTranslationUtilitiesService) {
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceTypeModule, cloudCommonModule, basicsCustomizeModule, resourceSkillModule]
		};

		data.words = {
			//Entities / container / Title
			UoMFk: { location: cloudCommonModule, identifier: 'entityUoM'},
			DispatcherGroupFk: { location: basicsCustomizeModule, identifier: 'logisticsdispatchergroup'},
			IsCrane: { location: resourceTypeModule, identifier: 'IsCrane'},
			IsTruck: { location: resourceTypeModule, identifier: 'IsTruck'},
			IsDriver: { location: resourceTypeModule, identifier: 'IsDriver'},
			SkillFk: { location: resourceSkillModule, identifier: 'resourceSkillEntity'},
			IsDetailer: { location: resourceTypeModule, identifier: 'entityIsDetailer'},
			IsStructuralEngineer: { location: resourceTypeModule, identifier: 'entityIsStructuralEngineer'},
			IsPlant: { location: resourceTypeModule, identifier: 'entityIsPlant'},
			ModuleFk: {location: basicsCustomizeModule, identifier: 'entityModule'},
			Specification: { location: cloudCommonModule, identifier:'EntitySpec'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			MdcMaterialFk: { location: resourceTypeModule, identifier: 'entityMaterial'},
			PrcStructureFk: { location: resourceTypeModule, identifier: 'entityProcurementStructure'},
			IsSmallTools: { location: resourceTypeModule, identifier: 'entityIsSmallTools'},
			CreateTemporaryResource: { location: resourceTypeModule, identifier: 'entityCreateTemporaryResource'},
			GroupFk: { location: resourceTypeModule, identifier: 'entityGroupFk'},
			IsBulk: { location: resourceTypeModule, identifier: 'entityIsBulk'},
			UomDayFk: { location: cloudCommonModule, identifier: 'entityUoM'},
			TypeRequestedFk: { location: resourceTypeModule, identifier: 'entityTypeRequested'},
			Duration: { location: resourceTypeModule, identifier: 'entityDuration'},
			IsRequestedEntirePeriod: { location: resourceTypeModule, identifier: 'entityIsRequestedEntirePeriod'},
			NecessaryOperators: { location: resourceTypeModule, identifier: 'entityNecessaryOperators'},
			ResSkillFk: { location: resourceSkillModule, identifier: 'resourceSkillEntity'},
			PlantGroupFk: { location: resourceTypeModule, identifier: 'entityPlantGroupFk'},
			HR: { location: resourceTypeModule, identifier: 'entityHR'},
			Has2ndDemand: { location: resourceTypeModule, identifier: 'entityHas2ndDemand'},
			IsTrailer: { location: resourceTypeModule, identifier: 'entityIsTrailer'},
			IsTransportPermission: { location: resourceTypeModule, identifier: 'entityIsTransportPermission'},
			ResAlterTypeFk: { location: resourceTypeModule, identifier: 'alternativeResTypeEntity'},
		};

		function provideResourceTypeContainerTitle(words) {
			words.entityResourceType = { location: resourceTypeModule, identifier: 'entityResourceType', initial: 'XX'};
			words.typeListTitle = { location: resourceTypeModule, identifier: 'typeListTitle', initial: 'XX'};
			words.typeDetailTitle = { location: resourceTypeModule, identifier: 'typeDetailTitle', initial: 'XX'};
		}

		// Get some predefined packages of words used in project
		provideResourceTypeContainerTitle(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addUserDefinedBoolTranslation(data.words, 5, 'UserDefinedBool', '0');

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(this, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		this.provideProjectStockContainerTitle = provideResourceTypeContainerTitle;
	}
})(angular);
