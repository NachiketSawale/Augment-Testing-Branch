(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	cloudTranslationModule.service('cloudTranslationContainerInformationService', CloudTranslationContainerInformationService);

	CloudTranslationContainerInformationService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'cloudTranslationTranslationService', 'basicsLookupdataConfigGenerator', 'cloudTranslationImportExportService'];

	function CloudTranslationContainerInformationService(platformSchemaService, platformUIConfigInitService, cloudTranslationTranslationService, basicsLookupdataConfigGenerator, cloudTranslationImportExportService) {
		const self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = null;
			switch (guid) {
				case '4d35ae8687dd4ed6aa5ce4b47befad0b': // cloudTranslationResourceListController
					config = self.getResourceServiceInfos();
					config.layout = self.getResourceContainerLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '3475cdad8acb4432a2bae7dbba8af912': // cloudTranslationResourceDetailController
					config = self.getResourceServiceInfos();
					config.layout = self.getResourceContainerLayout();
					config.ContainerType = 'Detail';
					break;
				case '13ff9d4cc7e149ca8965c702870639c2': // cloudTranslationTranslationListController
					config = self.getTranslationServiceInfos();
					config.layout = self.getTranslationContainerLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '26fb24afe1d64f8aa6434b9ee43919e5': // cloudTranslationTranslationDetailController
					config = self.getTranslationServiceInfos();
					config.layout = self.getTranslationContainerLayout();
					config.ContainerType = 'Detail';
					break;
				case 'f13984620ae3483c913aef196f02ad7e': // cloudTranslationLanguageListController
					config = self.getLanguageServiceInfos();
					config.layout = self.getLanguageContainerLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '6b045c1965cb43beab6f0efff980ca3c': // cloudTranslationLanguageDetailController
					config = self.getLanguageServiceInfos();
					config.layout = self.getLanguageContainerLayout();
					config.ContainerType = 'Detail';
					break;
				case '55c5907fd4224605876685a2b6066783': // cloudTranslationSourceListController
					config = self.getSourceServiceInfos();
					config.layout = self.getSourceContainerLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '4444643b757b4b1db98d603599E0a7a0': // cloudTranslationSourceDetailController
					config = self.getSourceServiceInfos();
					config.layout = self.getSourceContainerLayout();
					config.ContainerType = 'Detail';
					break;
				case 'f3a44c895396452a925e4b464a1a7864': // cloudTranslationToDoTranslationController
					config = self.getToDoTranslationServiceInfos();
					config.layout = self.getToDoTranslationContainerLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
			}

			return config;
		};

		this.getResourceServiceInfos = function getResourceServiceInfos() {
			return {
				standardConfigurationService: 'cloudTranslationResourceLayoutService',
				dataServiceName: 'cloudTranslationResourceDataService',
				validationServiceName: 'cloudTranslationResourceValidationService'
			};
		};

		const overloadResources = {
			sourcefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'cloudTranslationSourceLookupDataService',
				enableCache: true,
				readonly: true
			}),
			resourcefk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('cloud-translation-resource-lookup', 'cloudTranslationResourceLookup', 'ResourceTerm', true, 'cloudTranslationResourceDataService', null, 'self-reference-resource'),
			path: {readonly: true},
			id: {readonly: true},
			resourcekey: {readonly: true},
			foreignid: {readonly: true},
			isglossary: {readonly: true},
			subjectfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.tlssubject'),
			disableautomatch: {
				toolTip$tr$: 'cloud.translation.toolTipDisableAutoMatch'
			},
			resourceterm: {'change': 'formOptions.onResourceTermChanged'},
			category:{
				grid:{
					formatter: 'select',
					formatterOptions: {
						displayMember: 'Description',
						valueMember: 'Id',
						items: cloudTranslationImportExportService.resourceCategories
					},
					editorOptions: {
						displayMember: 'Description',
						valueMember: 'Id',
						items: cloudTranslationImportExportService.resourceCategories
					}
				}
			}
		};

		this.getResourceContainerLayout = function getResourceContainerLayout() {
			return self.getBaseLayout('cloud.translation.resource', ['id', 'resourcefk', 'sourcefk', 'path', 'resourcekey', 'foreignid', 'isglossary', 'disableautomatch',
				'resourceterm', 'subjectfk', 'remark', 'translatable', 'glossaryremark', 'maxlength', 'parameterinfo', 'isapproved', 'approvedby', 'ischanged', 'category'], overloadResources, true);
		};

		this.getTranslationServiceInfos = function getTranslationServiceInfos() {
			return {
				standardConfigurationService: 'cloudTranslationTranslationLayoutService',
				dataServiceName: 'cloudTranslationTranslationDataService',
				validationServiceName: 'cloudTranslationTranslationValidationService'
			};
		};

		const oloadLang = {
			languagefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'cloudTranslationLanguageLookupDataService',
				enableCache: true
			}),
			resourcefk: basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('cloudTranslationResourcepDataService', 'cloudTranslationResourceDataService', 'ResourceTerm', true, 'cloudTranslationResourceDataService'),
			id: {readonly: true}
		};
		this.getTranslationContainerLayout = function getTranslationContainerLayout() {
			return self.getBaseLayout('cloud.translation.translation', ['id', 'resourcefk', 'languagefk', 'translation', 'isapproved', 'istranslated', 'approvedby', 'remark', 'ischanged'], oloadLang, true);
		};

		this.getLanguageServiceInfos = function getLanguageServiceInfos() {
			return {
				standardConfigurationService: 'cloudTranslationLanguageLayoutService',
				dataServiceName: 'cloudTranslationLanguageDataService',
				validationServiceName: 'cloudTranslationLanguageValidationService'
			};
		};

		this.getLanguageContainerLayout = function getLanguageContainerLayout() {
			return self.getBaseLayout('cloud.translation.language', ['id', 'description', 'sorting', 'isdefault', 'culture', 'languageid', 'islive', 'issystem', 'exportcolumnname'], {id: {readonly: true}, issystem: {readonly: true}});
		};

		this.getSourceServiceInfos = function getSourceServiceInfos() {
			return {
				standardConfigurationService: 'cloudTranslationSourceLayoutService',
				dataServiceName: 'cloudTranslationSourceDataService',
				validationServiceName: 'cloudTranslationSourceValidationService'
			};
		};

		const oloadSource = {
			sourcetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.tlssourcetype'),
			id: {readonly: true}
		};

		this.getSourceContainerLayout = function getSourceContainerLayout() {
			return self.getBaseLayout('cloud.translation.source', ['id', 'description', 'sorting', 'isdefault', 'sourcetypefk', 'modulename'], oloadSource);
		};

		this.initializeContainerConfigurations = function initializeContainerConfigurations(conf, layout, dto) {
			const layouts = self.provideContainerConfigurations(layout, dto);
			conf.detailConfig = layouts.detailLayout;
			conf.listConfig = layouts.listLayout;
		};

		this.getToDoTranslationServiceInfos = function getToDoTranslationServiceInfos() {
			return {
				standardConfigurationService: 'cloudTranslationTodoTranslationLayoutService',
				dataServiceName: 'cloudTranslationTodoTranslationDataService',
				validationServiceName: 'cloudTranslationTodoTranslationValidationService'
			};
		};

		const oloadTodo = {
			resourceid: {
				navigator: {
					moduleName: 'cloud.translation-focus'
				}
			}
		};
		this.getToDoTranslationContainerLayout = function getToDoTranslationContainerLayout() {
			return self.getBaseLayout('cloud.translation.toDoTranslation', ['culture', 'source', 'translation', 'translationremark', 'resourceid', 'path', 'resourcekey', 'resourceterm', 'remark', 'parameterinfo', 'isapproved', 'isglossary'], oloadTodo, false);
		};

		this.provideContainerConfigurations = function provideContainerConfigurations(layout, dto) {
			const scheme = platformSchemaService.getSchemaFromCache({
				typeName: dto,
				moduleSubModule: 'Cloud.Translation'
			}).properties;
			const configs = {};

			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, cloudTranslationTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, cloudTranslationTranslationService);

			return configs;
		};

		this.getBaseLayout = function getBaseLayout(fid, atts, overloadObject, history) {

			const layout = {
				version: '1.0.0',
				fid: fid,
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: atts
					}
				],
				overloads: overloadObject || {}
			};

			if (history) {
				layout.groups.push({
					gid: 'entityHistory',
					isHistory: true
				});
			}

			return layout;
		};
	}

})(angular);