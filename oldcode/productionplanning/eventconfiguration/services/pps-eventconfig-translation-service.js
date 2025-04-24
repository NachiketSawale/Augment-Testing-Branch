/**
 * Created by anl on 6/5/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	var cloudCommonModule = 'cloud.common';
	var platform = 'platform';
	var basicsMaterialModule = 'basics.material';
	var basicsSiteModule = 'basics.site';
	var ppsCommonModule = 'productionplanning.common';
	var ppsItemModule = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningEventconfigurationTranslationService', EventConfigurationTranslationService);

	EventConfigurationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function EventConfigurationTranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, cloudCommonModule, platform, basicsMaterialModule, basicsSiteModule, ppsCommonModule,
				ppsItemModule]
		};

		data.words = {
			baseGroup: {location: platform, identifier: 'baseGroup', initial: '*Basic Data'},
			EventSeqConfigFk: {
				location: moduleName,
				identifier: 'eventSequence.eventSeqConfigFk',
				initial: '*Parent Config'
			},
			Description: {location: cloudCommonModule, identifier: 'description', initial: '*Description'},
			MaterialGroupFk: {location: basicsMaterialModule, identifier: 'record.materialGroup', initial: '*Material Group'},
			MaterialFk: {location: basicsMaterialModule, identifier: 'record.material', initial: '*Material'},
			SiteFk: {location: basicsSiteModule, identifier: 'entitySite', initial: '*Site'},
			SeqEventSplitFromFk: {
				location: moduleName,
				identifier: 'eventSequence.seqEventSplitFromFk',
				initial: '*SplitFrom'
			},
			SeqEventSplitToFk: {
				location: moduleName,
				identifier: 'eventSequence.seqEventSplitToFk',
				initial: '*SplitTo'
			},
			IsTemplate: {location: moduleName, identifier: 'eventSequence.isTemplate', initial: '*Is Template'},
			QuantityFrom: {location: moduleName, identifier: 'eventSequence.quantityFrom', initial: '*Quantity From'},
			QuantityTo: {location: moduleName, identifier: 'eventSequence.quantityTo', initial: '*Quantity To'},
			SplitAfterQuantity: {
				location: moduleName,
				identifier: 'eventSequence.splitAfterQuantity',
				initial: '*Split After Quantity'
			},
			SplitDayOffset: {
				location: moduleName,
				identifier: 'eventSequence.splitDayOffset',
				initial: '*Split Day Offset'
			},
			IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: '*Is Default'},
			Mounting: {location: moduleName, identifier: 'eventSequence.mounting', initial: '*Is Mounting'},
			ReproductionEng: {
				location: moduleName,
				identifier: 'eventSequence.reproductionEng',
				initial: '*Reproduction For Eng'
			},
			Reproduction: {location: moduleName, identifier: 'eventSequence.reproduction', initial: '*Reproduction'},
			ItemTypeFk: {location: ppsItemModule, identifier: 'entityItemType', initial: '*Item Type'},


			EventTypeFk: {location: ppsCommonModule, identifier: 'event.eventTypeFk', initial: '*Event Type'},
			SequenceOrder: {
				location: moduleName,
				identifier: 'eventTemplate.sequenceOrder',
				initial: '*Sequence Order'
			},
			Duration: {location: moduleName, identifier: 'eventTemplate.duration', initial: '*Duration'},
			LeadTime: {location: moduleName, identifier: 'eventTemplate.leadTime', initial: '*Lead Time'},
			RelationKindFk : {location: moduleName, identifier: 'eventTemplate.relationKind', initial: '*Relation Kind'},
			MinTime: {location: moduleName, identifier: 'eventTemplate.minTime', initial: '*Min Time'},

			certificateGroup: {location: moduleName, identifier: 'eventSequence.certificateGroup', initial: '*Certificate'},
			CeActive: {location: moduleName, identifier: 'eventSequence.ceActive', initial: '*CE Active'},
			CeField1: {location: moduleName, identifier: 'eventSequence.ceField1', initial: '*CE Field1'},
			CeField2: {location: moduleName, identifier: 'eventSequence.ceField2', initial: '*CE Field2'},
			CeField3: {location: moduleName, identifier: 'eventSequence.ceField3', initial: '*CE Field3'},
			CeField4: {location: moduleName, identifier: 'eventSequence.ceField4', initial: '*CE Field4'},

			queryGroup:{location: moduleName, identifier: 'eventSequence.queryGroup', initial: '*Query Parameters'},
			automaticGroup:{location: moduleName, identifier: 'eventSequence.automaticGroup', initial: '*Automatic Split'},
			ppsCreationGroup: {location: moduleName, identifier: 'eventSequence.ppsCreationGroup', initial: '*Planning Unit Creation'},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			IsLive: { location: ppsCommonModule, identifier: 'isLive', initial: '*Is Live'},
			MatSiteGrpFk: {location: ppsCommonModule, identifier: 'matSiteGrpFk', initial: '*Material Site Group'},
			CalCalendarLeadFk: { location: ppsCommonModule, identifier: 'event.calCalendarFk', initial: 'Calendar' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);