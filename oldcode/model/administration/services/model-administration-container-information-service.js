/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const modelAdministrationModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	modelAdministrationModule.factory('modelAdministrationContainerInformationService',
		modelAdministrationContainerInformationService);

	modelAdministrationContainerInformationService.$inject = ['$injector'];

	function modelAdministrationContainerInformationService($injector) {

		const service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			const config = {};
			switch (guid) {
				case 'a77d13ea33784bbcb9f21e9ed7fb3ff2': // modelAdministrationStaticHlSchemeListController
					config.layout = $injector.get('modelAdministrationStaticHlSchemeConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationStaticHlSchemeConfigurationService';
					config.dataServiceName = 'modelAdministrationStaticHlSchemeDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '1aa62e964ad34df6a9eb71484a0188fb': // modelAdministrationStaticHlSchemeDetailController
					config.layout = $injector.get('modelAdministrationStaticHlSchemeConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationStaticHlSchemeConfigurationService';
					config.dataServiceName = 'modelAdministrationStaticHlSchemeDataService';
					config.validationServiceName = null;
					break;
				case '325a35cc5b0c4c2184d3f5eb72c58f5a': // modelAdministrationStaticHlItemListController
					config.layout = $injector.get('modelAdministrationStaticHlItemConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationStaticHlItemConfigurationService';
					config.dataServiceName = 'modelAdministrationStaticHlItemDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '61f6e953a2a046e89df4b252e7b4b988': // modelAdministrationStaticHlItemDetailController
					config.layout = $injector.get('modelAdministrationStaticHlItemConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationStaticHlItemConfigurationService';
					config.dataServiceName = 'modelAdministrationStaticHlItemDataService';
					config.validationServiceName = null;
					break;
				case 'f7f839f32f4a47d8ab550a998421b17f': // modelAdministrationDynHlSchemeListController
					config.layout = $injector.get('modelAdministrationDynHlSchemeConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDynHlSchemeConfigurationService';
					config.dataServiceName = 'modelAdministrationDynHlSchemeDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '227e5eab5efe472086262160515c91bb': // modelAdministrationDynHlSchemeDetailController
					config.layout = $injector.get('modelAdministrationDynHlSchemeConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDynHlSchemeConfigurationService';
					config.dataServiceName = 'modelAdministrationDynHlSchemeDataService';
					config.validationServiceName = null;
					break;
				case 'ebd51626b3ff4f8689e1fed61bf6a49e': // modelAdministrationDynHlItemListController
					config.layout = $injector.get('modelAdministrationDynHlItemConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDynHlItemConfigurationService';
					config.dataServiceName = 'modelAdministrationDynHlItemDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '18cc3cc979c24f7390607c9e45df177c': // modelAdministrationDynHlItemDetailController
					config.layout = $injector.get('modelAdministrationDynHlItemConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDynHlItemConfigurationService';
					config.dataServiceName = 'modelAdministrationDynHlItemDataService';
					config.validationServiceName = null;
					break;
				case '373d22dca21440bda308ff6e85f81a85': // modelAdministrationDataTreeListController
					config.layout = $injector.get('modelAdministrationDataTreeConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDataTreeConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTreeDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'f04423524cb94bd1a76330c348f8e1b8': // modelAdministrationDataTreeDetailController
					config.layout = $injector.get('modelAdministrationDataTreeConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDataTreeConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTreeDataService';
					config.validationServiceName = null;
					break;
				case 'f97ebbe0f8594fe686c78899cbb3c59b': // modelAdministrationDataTreeLevelListController
					config.layout = $injector.get('modelAdministrationDataTreeLevelConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDataTreeLevelConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTreeLevelDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'ff23c6d3aea74dbcbeb0e3122b368be1': // modelAdministrationDataTreeLevelDetailController
					config.layout = $injector.get('modelAdministrationDataTreeLevelConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDataTreeLevelConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTreeLevelDataService';
					config.validationServiceName = null;
					break;
				case 'beb34f7d5c704610870cba1be748cc34': // modelAdministrationDataTreeNodeListController
					config.layout = $injector.get('modelAdministrationDataTreeNodeConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDataTreeNodeConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTreeNodeDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						parentProp: 'DataTreeNodeFk',
						childProp: 'Children',
					};
					break;
				case '19a6a6b9816e49d99141986d8880fb39': // modelAdministrationDataTreeNodeDetailController
					config.layout = $injector.get('modelAdministrationDataTreeNodeConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDataTreeNodeConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTreeNodeDataService';
					config.validationServiceName = null;
					break;
				case '710cd16529f6429fa457d207481adc26': // modelAdministrationDataTree2ModelListController
					config.layout = $injector.get('modelAdministrationDataTree2ModelConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDataTree2ModelConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTree2ModelDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '27d6e2162efc40208eb9cebda2deec00': // modelAdministrationDataTree2ModelDetailController
					config.layout = $injector.get('modelAdministrationDataTree2ModelConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDataTree2ModelConfigurationService';
					config.dataServiceName = 'modelAdministrationDataTree2ModelDataService';
					config.validationServiceName = null;
					break;

				case '51db6299be4f4d3097919ef4492b0cdc': // modelAdministrationDataTree2ModelListController
					config.layout = $injector.get('modelAdministrationBlackListConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationBlackListConfigurationService';
					config.dataServiceName = 'modelAdministrationBlackListDataService';
					config.validationServiceName = 'modelAdministrationPropertyKeyBlackListValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '3af9713a684b449aafe617272ba68ac9': // modelAdministrationBlackListDetailController
					config.layout = $injector.get('modelAdministrationBlackListConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationBlackListConfigurationService';
					config.dataServiceName = 'modelAdministrationBlackListDataService';
					config.validationServiceName = 'modelAdministrationPropertyKeyBlackListValidationService';
					break;

				case 'befa2d4aad3e40e28202f6d7e4df293b': // modelAdministrationViewerSettingsDetailController
					config.layout = $injector.get('modelAdministrationViewerSettingsConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationViewerSettingsConfigurationService';
					config.dataServiceName = 'modelAdministrationViewerSettingsDataService';
					config.validationServiceName = null;
					break;
				case 'f7d7913423cc4bf2824e8f13449ec482': // modelAdministrationViewerSettingsListController
					config.layout = $injector.get('modelAdministrationViewerSettingsConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationViewerSettingsConfigurationService';
					config.dataServiceName = 'modelAdministrationViewerSettingsDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'e7bee8d36e8f475b9812eb0d21696c49': // modelAdministrationPropertyKeyTagCategoryListController
					config.layout = $injector.get('modelAdministrationPropertyKeyTagCategoryConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationPropertyKeyTagCategoryConfigurationService';
					config.dataServiceName = 'modelAdministrationPropertyKeyTagCategoryDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						parentProp: 'PropertyKeyTagParentCategoryFk',
						childProp: 'Children'
					};
					break;
				case 'f0b70206735642cab5472cc4f5620c65': // modelAdministrationPropertyKeyTagCategoryDetailController
					config.layout = $injector.get('modelAdministrationPropertyKeyTagCategoryConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationPropertyKeyTagCategoryConfigurationService';
					config.dataServiceName = 'modelAdministrationPropertyKeyTagCategoryDataService';
					config.validationServiceName = null;
					break;
				case '7cfd83a5ad6b4a988250819559936199': // modelAdministrationPropertyKeyTagListController
					config.layout = $injector.get('modelAdministrationPropertyKeyTagConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationPropertyKeyTagConfigurationService';
					config.dataServiceName = 'modelAdministrationPropertyKeyTagDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '3630b32c31c7492681c5c79e76af90a9': // modelAdministrationPropertyKeyTagDetailController
					config.layout = $injector.get('modelAdministrationPropertyKeyTagConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationPropertyKeyTagConfigurationService';
					config.dataServiceName = 'modelAdministrationPropertyKeyTagDataService';
					config.validationServiceName = null;
					break;
				case 'f3dd6a81c5e14fddbe2f1b0b8cf05340': // modelAdministrationPropertyKeyListController
					config.layout = $injector.get('modelAdministrationPropertyKeyConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationPropertyKeyConfigurationService';
					config.dataServiceName = 'modelAdministrationPropertyKeyDataService';
					config.validationServiceName = 'modelAdministrationPropertyKeyValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '9889fc35cb8640ba9b59f0c8c663698f': // modelAdministrationPropertyKeyDetailController
					config.layout = $injector.get('modelAdministrationPropertyKeyConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationPropertyKeyConfigurationService';
					config.dataServiceName = 'modelAdministrationPropertyKeyDataService';
					config.validationServiceName = 'modelAdministrationPropertyKeyValidationService';
					break;

				case 'aa55f4fd2cbd43f69bead3e4a5cd454f': // modelAdministrationModelImportProfileListController
					config.layout = $injector.get('modelAdministrationModelImportProfileConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationModelImportProfileConfigurationService';
					config.dataServiceName = 'modelAdministrationImportProfileDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '225eae28ec104a3fa0c8b6210948fbf2': // modelAdministrationModelImportProfileDetailController
					config.layout = $injector.get('modelAdministrationModelImportProfileConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationModelImportProfileConfigurationService';
					config.dataServiceName = 'modelAdministrationImportProfileDataService';
					config.validationServiceName = null;
					break;
				case 'd0bad362f2c34cec9a1bf934d064ff89': // modelAdministrationModelImportPropertyKeyRuleListController
					config.layout = $injector.get('modelAdministrationModelImportPropertyKeyRuleConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationModelImportPropertyKeyRuleConfigurationService';
					config.dataServiceName = 'modelAdministrationImportPropertyKeyRuleDataService';
					config.validationServiceName = 'modelAdministrationImportPropertyKeyValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'f21727ad8b4b4b5b9b22330d600fb3fb': // modelAdministrationModelImportPropertyKeyRuleDetailController
					config.layout = $injector.get('modelAdministrationModelImportPropertyKeyRuleConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationModelImportPropertyKeyRuleConfigurationService';
					config.dataServiceName = 'modelAdministrationImportPropertyKeyRuleDataService';
					config.validationServiceName = 'modelAdministrationImportPropertyKeyValidationService';
					break;

				case '2744eda347844751ad0a61950b4ad6cf': // modelAdministrationModelImportPropertyProcessorListController
					config.layout = $injector.get('modelAdministrationModelImportPropertyProcessorConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationModelImportPropertyProcessorConfigurationService';
					config.dataServiceName = 'modelAdministrationModelImportPropertyProcessorDataService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '44f7428f27c94325ba46d1c2357f5ee7': // modelAdministrationModelImportPropertyProcessorDetailController
					config.layout = $injector.get('modelAdministrationModelImportPropertyProcessorConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationModelImportPropertyProcessorConfigurationService';
					config.dataServiceName = 'modelAdministrationModelImportPropertyProcessorDataService';
					break;

					//Tree Template

				case 'e5801f5433724277babcc584015775a1': // modelAdministrationDataFilterTreeTemplateListController
					config.layout = $injector.get('modelAdministrationDataFilterTreeTemplateConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDataFilterTreeTemplateConfigurationService';
					config.dataServiceName = 'modelAdministrationDataFilterTreeTemplateDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'd5e4452554d14a598da94cb3ed1cf7d0': // modelAdministrationDataFilterTreeTemplateDetailController
					config.layout = $injector.get('modelAdministrationDataFilterTreeTemplateConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDataFilterTreeTemplateConfigurationService';
					config.dataServiceName = 'modelAdministrationDataFilterTreeTemplateDataService';
					config.validationServiceName = null;
					break;

				case '9d4324768ea240a59b0f68e56eaa4f08': // modelAdministrationDataFilterTreeNodeTemplateListController
					config.layout = $injector.get('modelAdministrationDataFilterTreeNodeTemplateConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAdministrationDataFilterTreeNodeTemplateConfigurationService';
					config.dataServiceName = 'modelAdministrationDataFilterTreeNodeTemplateDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						parentProp: 'ModelFiltertreenodetemplateParentFk',
						childProp: 'children',
					};
					break;
				case 'f9711d08b2e842bc9175a47dbbb0205d': // modelAdministrationDataFilterTreeNodeTemplateDetailController
					config.layout = $injector.get('modelAdministrationDataFilterTreeNodeTemplateConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAdministrationDataFilterTreeNodeTemplateConfigurationService';
					config.dataServiceName = 'modelAdministrationDataFilterTreeNodeTemplateDataService';
					config.validationServiceName = null;
					break;
			}

			return config;
		};

		return service;
	}
})(angular);