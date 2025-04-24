/**
 * Created by Frank Baedeker on 26.08.2014.
 */
(function (angular) {
	'use strict';

	const tlsModule = 'cloud.translation';
	const cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name projectLocationTranslationService
	 * @description provides translation for project main module
	 */
	angular.module(tlsModule).factory('cloudTranslationTranslationService', CloudTranslationTranslationService);

	CloudTranslationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function CloudTranslationTranslationService(platformTranslationUtilitiesService) {
		const service = {};
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [tlsModule, cloudCommonModule]
		};

		data.words = {
			resourceEntity: {location: tlsModule, identifier: 'resourceEntity', initial: 'Resource'},
			resourceListTitle: {location: tlsModule, identifier: 'resourceListTitle', initial: 'Resources'},
			resourceDetailTitle: {location: tlsModule, identifier: 'resourceDetailTitle', initial: 'Resource Detail'},
			translationEntity: {location: tlsModule, identifier: 'translationEntity', initial: 'Translation'},
			translationListTitle: {location: tlsModule, identifier: 'translationListTitle', initial: 'Translations'},
			translationDetailTitle: {
				location: tlsModule,
				identifier: 'translationDetailTitle',
				initial: 'Translation Detail'
			},
			languageEntity: {location: tlsModule, identifier: 'languageEntity', initial: 'Language'},
			languageListTitle: {location: tlsModule, identifier: 'languageListTitle', initial: 'Languages'},
			languageDetailTitle: {location: tlsModule, identifier: 'languageDetailTitle', initial: 'Language Detail'},
			sourceEntity: {location: tlsModule, identifier: 'sourceEntity', initial: 'Source'},
			sourceListTitle: {location: tlsModule, identifier: 'sourceListTitle', initial: 'Sources'},
			sourceDetailTitle: {location: tlsModule, identifier: 'sourceDetailTitle', initial: 'Source Detail'},
			todoTranslationEntity: {
				location: tlsModule,
				identifier: 'todoTranslationEntity',
				initial: 'TODO Translation'
			},
			ResourceFk: {location: tlsModule, identifier: 'resourceEntity', initial: 'Resource'},
			SourceFk: {location: tlsModule, identifier: 'source', initial: 'Source'},
			Source: {location: tlsModule, identifier: 'source', initial: 'Source'},
			TranslationRemark: {location: tlsModule, identifier: 'translationremark', initial: 'Translation Remark'},
			ResourceId: {location: tlsModule, identifier: 'resourceid', initial: 'Resource Id'},
			Path: {location: tlsModule, identifier: 'path', initial: 'Path'},
			ResourceKey: {location: tlsModule, identifier: 'resourcekey', initial: 'Resource Key'},
			ForeignId: {location: tlsModule, identifier: 'foreignid', initial: 'Foreign Id'},
			IsGlossary: {location: tlsModule, identifier: 'isglossary', initial: 'Is Glossary'},
			ResourceTerm: {location: tlsModule, identifier: 'resourceterm', initial: 'Term'},
			ParameterInfo: {location: tlsModule, identifier: 'parameterinfo', initial: 'Parameter Info'},
			IsApproved: {location: tlsModule, identifier: 'isapproved', initial: 'Is Approved'},
			ApprovedBy: {location: tlsModule, identifier: 'approvedby', initial: 'Approved By'},
			LanguageFk: {location: tlsModule, identifier: 'languageEntity', initial: 'Language'},
			Translation: {location: tlsModule, identifier: 'translationEntity', initial: 'Translation'},
			Culture: {location: tlsModule, identifier: 'culture', initial: 'Culture'},
			LanguageId: {location: tlsModule, identifier: 'languageid', initial: 'Language Id'},
			SourceTypeFk: {location: tlsModule, identifier: 'sourcetype', initial: 'Source Type'},
			ModuleName: {location: tlsModule, identifier: 'modulename', initial: 'Module Name'},
			fileUpload: {location: tlsModule, identifier: 'fileUpload', initial: 'Source-File Upload'},
			SubjectFk: {location: tlsModule, identifier: 'subjectfk', initial: 'Subject'},
			Translatable: {location: tlsModule, identifier: 'translatable', initial: 'Translate'},
			GlossaryRemark: {location: tlsModule, identifier: 'glossaryremark', initial: 'Glossary Remark'},
			MaxLength: {location: tlsModule, identifier: 'maxlength', initial: 'MaxLength'},
			Id: {location: cloudCommonModule, identifier: 'entityId', initial: 'Id'},
			DisableAutoMatch: {location: tlsModule, identifier: 'disableAutoMatch', initial: 'Disable Auto Match'},
			IsTranslated: {location: tlsModule, identifier: 'isTranslated', initial: 'Is Translated'},
			English: {location: tlsModule, identifier: 'english', initial: 'English'},
			German: {location: tlsModule, identifier: 'german', initial: 'German'},
			Finnish: {location: tlsModule, identifier: 'finnish', initial: 'Finnish'},
			Russian: {location: tlsModule, identifier: 'russian', initial: 'Russian'},
			Chinese: {location: tlsModule, identifier: 'chinese', initial: 'Chinese'},
			French: {location: tlsModule, identifier: 'french', initial: 'French'},
			Spanish: {location: tlsModule, identifier: 'spanish', initial: 'Spanish'},
			Ischanged: {location: tlsModule, identifier: 'ischanged', initial: 'Is Changed'},
			IsLive: {location: tlsModule, identifier: 'islive', initial: 'Is Live'},
			IsSystem: {location: tlsModule, identifier: 'issystem', initial: 'Is System'},
			ExportColumnName: {location: tlsModule, identifier: 'exportcolumnname', initial: 'Export Column Name'},
			Category: {location: tlsModule, identifier: 'category', initial: 'Category'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);
