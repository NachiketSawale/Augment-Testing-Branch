/* global  */
(function (angular) {
	'use strict';
	var defectModule = 'defect.main';

	angular.module(defectModule).factory('defectTranslationService', [
		'platformTranslateService', 'platformTranslationUtilitiesService','$q',
		function (platformTranslateService, platformTranslationUtilitiesService,$q) {

			var cloudCommonModule = 'cloud.common';
			var basicsCommonModule = 'basics.common';
			const modelAnnotationModule = 'model.annotation';
			var modelMainModule = 'model.main';
			var modelProjectModule = 'model.project';
			var modelViewerModule = 'model.viewer';
			var basicsMeetingModule = 'basics.meeting';

			var service = {instant: platformTranslateService.instant};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [
					cloudCommonModule, basicsCommonModule, defectModule,
					modelAnnotationModule, modelMainModule, modelProjectModule, modelViewerModule,basicsMeetingModule
				]
			};


			data.words = {
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				OriginFileName: {location: defectModule, identifier: 'entityFileArchiveDoc', initial: 'Origin File Name'},
				DocumentDate: {location: defectModule, identifier: 'entityDate', initial: 'Date'},
				DocumentTypeFk: {location:cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				DfmDocumenttypeFk: {location:defectModule, identifier: 'entityDefectType', initial: 'Defect Document Type'},
				Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				CheckStatus: {location: defectModule, identifier: 'entityCheckStatus', initial: 'CheckStatus'}
			};

			// translate common properties
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			// platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}
	]);
})(angular);
