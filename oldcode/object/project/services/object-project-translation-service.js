(function (angular) {
	'use strict';

	var objectProjectModule = 'object.project';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var objectMainModule = 'object.main';
	var schedulingMainModule = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name objectProjectTranslationService
	 * @description provides translation for object Project module
	 **/
	angular.module(objectProjectModule).factory('objectProjectTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [objectProjectModule, cloudCommonModule, basicsCustomizeModule, objectMainModule, schedulingMainModule]
			};

			data.words = {
				ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
				PriceListFk: { location: objectProjectModule, identifier: 'entityPriceList', initial: 'Price List' },
				ObjectTypeFk: { location: objectProjectModule, identifier: 'entityObjectType', initial: 'Object Type' },
				Remark01: { location: objectMainModule, identifier: 'entityRemark1', initial: 'Remark 1' },
				Remark02: { location: objectMainModule, identifier: 'entityRemark2', initial: 'Remark 2' },
				HeaderFk: { location: basicsCustomizeModule, identifier: 'headerFk', initial: 'Header' },
				LevelTypeFk: { location: objectMainModule, identifier: 'entityRemark', initial: 'Level Type' },
				LocationFk: { location: schedulingMainModule, identifier: 'Location', initial: 'Location' },
				Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
				FileArchiveDocFk: {location: objectMainModule, identifier: 'entityFileArchiveDocFk', initial: 'File Archive Doc'},
				InstallmentAgreementFk:{ location: basicsCustomizeModule, identifier: 'installmentagreement', initial: 'Installment Agreement'},
				RequestedInstallment:{ location: objectProjectModule, identifier: 'entityRequestedInstallment', initial: 'Requested Installment'},
				OriginFileName:{ location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Document Origin File Name' },
				DocumentTypeFk:{ location: cloudCommonModule, identifier: 'entityType', initial: 'Document Type'},
				UnitDocumentTypeFk:{ location: objectMainModule, identifier: 'entityUnitDocumentTypeFk', initial: 'Unit Document Type' },
				Date: { location: cloudCommonModule, identifier: 'entityDate', initial: 'Date' },
				Barcode:{ location: objectMainModule, identifier: 'entityBarcode', initial: 'Barcode'},
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addTeleComTranslation(data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
