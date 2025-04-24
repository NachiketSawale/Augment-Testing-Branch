(function (angular) {

	'use strict';
	var modelProjectModule = angular.module('model.project');

	/**
	 * @ngdoc service
	 * @name modelProjectContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	modelProjectModule.factory('modelProjectContainerInformationService', ['$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator','modelProjectModelClipboardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, modelProjectModelClipboardService) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '77dd0994f5f544ddaf048c1a5f17c5fe': //modelProjectModelListController
						config = getProjectModelListConfig(config);
						break;
					case 'BE26C4B00D8748718D1258A51A77811B': //modelProjectModelListController
						config = getProjectModelListConfig(config);
						break;
					case 'd5d4776c5ea64701912a9c8b007ec446': //modelProjectModelVersionListController
						config = getProjectModelVersionListConfig(config);
						break;

					case '5b2eda413a434857848e70df9ba397f9': //modelProjectModelMapListController
						config = getProjectModelMapListConfig(config);
						break;

					case 'a16d5eb0ec314c00871308b03f4a1c39': //modelProjectModelVersionDetailController
						config = getProjectModelVersionDetailConfig(config);
						break;
					case 'ad70980f975343f1a2af096762faec25': //modelProjectModelDetailController
						config = getProjectModelDetailConfig(config);
						break;
					case '8a10e1cb69774d56926abd47c0c8dca9': //modelProjectModelDetailController
						config = getProjectModelDetailConfig(config);
						break;
					case 'A4F63DA300D948B78A6492B65EF1E5D5': //modelProjectModelReadonlyDetailController
						config = $injector.get('modelProjectModelReadonlyUIConfig').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'modelProjectModelReadonlyUIConfig';
						config.dataServiceName = 'modelProjectModelReadonlyDataService';
						config.validationServiceName = 'modelProjectModelValidationService';
						break;
					case '903fffcab05b40c3b0025f510e17bcba': //modelProjectModelFileListController
						config = getProjectModelFileListConfig(config);
						break;
					case '8b4e238704f84550b00830dec07b25b5': //modelProjectModelFileListController
						config = getProjectModelFileListConfig(config);
						break;
					case '7215f25341714c81af7657fcd3854911': //modelProjectModelFileDetailController
						config = getProjectModelFileDetailConfig(config);
						break;
					case '4909263a40954a3caf4f757e782dd679': //modelProjectModelFileDetailController
						config = getProjectModelFileDetailConfig(config);
						break;
					case 'eee4bf0089af41d2ae0f4a68027b58b3': //modelProjectModelPartListController
						config = getProjectModelPartListConfig(config);
						break;
					case 'b5faadeba52d44828e9cb453913eb8fd': //modelProjectModelPartDetailController
						config = getProjectModelPartDetailConfig(config);
						break;
					case '4a870e66e25044f0985a567df1395500': //modelProjectModelStakeholderListController
						config = getProjectModelStakeholderListConfig(config);
						break;
					case 'f254928aff3d427193c35f1596304523': //modelProjectModelStakeholderDetailController
						config = getProjectModelStakeholderDetailConfig(config);
						break;

					case '4541517fca60493cac556035d34d6209': // modelProjectAdministrationDataTree2ModelListController
						config.layout = $injector.get('modelProjectAdministrationDataTree2ModelConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'modelProjectAdministrationDataTree2ModelConfigurationService';
						config.dataServiceName = 'modelProjectAdministrationDataTree2ModelDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'db96f2a2b9d546dca4f339e2305f00e7': // modelProjectAdministrationDataTree2ModelDetailController
						config.layout = $injector.get('modelProjectAdministrationDataTree2ModelConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'modelProjectAdministrationDataTree2ModelConfigurationService';
						config.dataServiceName = 'modelProjectAdministrationDataTree2ModelDataService';
						config.validationServiceName = null;
						break;

					case '90ed732516e74347a59f2a187f3246ad': // modelProjectPropertyKeyBlackListController
						config.layout = $injector.get('modelProjectPropertyKeyBlackListConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'modelProjectPropertyKeyBlackListConfigurationService';
						config.dataServiceName = 'modelProjectPropertyKeyBlackListDataService';
						config.validationServiceName = 'modelAdministrationPropertyKeyBlackListValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '5511a01cf9f94875bdb51f48d4bdebfa': // modelProjectPropertyKeyBlackListDetailController
						config.layout = $injector.get('modelProjectPropertyKeyBlackListConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'modelProjectPropertyKeyBlackListConfigurationService';
						config.dataServiceName = 'modelProjectPropertyKeyBlackListDataService';
						config.validationServiceName = 'modelAdministrationPropertyKeyBlackListValidationService';
						break;
					case '70ce0ba51f5545fdabb81be621cfa2c5': // modelProjectClerkListController
						config = service.getModelProjectClerkServiceInfos();
						config.layout = service.getModelProjectClerkLayout();
						config.ContainerType = 'Grid';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '32942b95e0e441e392a69c73361023cb': // modelProjectClerkDetailController
						config = service.getModelProjectClerkServiceInfos();
						config.layout = service.getModelProjectClerkLayout();
						config.ContainerType = 'Detail';
						break;
				}

				function getProjectModelListConfig(config) {
					config.layout = $injector.get('modelProjectModelUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelProjectModelUIConfig';
					config.dataServiceName = 'modelProjectModelDataService';
					config.validationServiceName = 'modelProjectModelValidationService';
					config.listConfig = {
						initCalled: false, columns: [], type: 'model.project',dragDropService: modelProjectModelClipboardService};
					return config;
				}

				function getProjectModelVersionListConfig(config) {
					config.layout = $injector.get('modelProjectModelUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelProjectModelVersionUIConfig';
					config.dataServiceName = 'modelProjectModelVersionDataService';
					config.validationServiceName = 'modelProjectModelValidationService';
					config.listConfig = {initCalled: false, columns: []};
					return config;
				}

				function getProjectModelMapListConfig(config) {
					config.layout = $injector.get('modelProjectModelUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelProjectModelMapUIConfig';
					config.dataServiceName = 'modelProjectModelMapDataService';
					config.validationServiceName = 'modelProjectModelValidationService';
					config.listConfig = {initCalled: false, columns: []};
					return config;
				}

				function getProjectModelVersionDetailConfig(config) {
					config.layout = $injector.get('modelProjectModelUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelProjectModelUIConfig';
					config.dataServiceName = 'modelProjectModelVersionDataService';
					config.validationServiceName = 'modelProjectModelValidationService';
					config.listConfig = {initCalled: false, columns: []};
					return config;
				}

				function getProjectModelDetailConfig(config) {
					config = $injector.get('modelProjectModelUIConfig').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelProjectModelUIConfig';
					config.dataServiceName = 'modelProjectModelDataService';
					config.validationServiceName = 'modelProjectModelValidationService';
					return config;
				}

				function getProjectModelFileListConfig(config) {
					config.layout = $injector.get('modelProjectModelFileUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelProjectModelFileUIConfig';
					config.dataServiceName = 'modelProjectModelFileDataService';
					config.validationServiceName = 'modelProjectModelFileValidationService';
					config.listConfig = {initCalled: false, columns: []};
					return config;
				}

				function getProjectModelFileDetailConfig(config) {
					config = $injector.get('modelProjectModelFileUIConfig').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelProjectModelFileUIConfig';
					config.dataServiceName = 'modelProjectModelFileDataService';
					config.validationServiceName = 'modelProjectModelFileValidationService';
					return config;
				}

				function getProjectModelPartListConfig(config) {
					config.layout = $injector.get('modelProjectModelPartUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelProjectModelPartUIConfig';
					config.dataServiceName = 'modelProjectModelPartDataService';
					config.listConfig = {initCalled: false, columns: []};
					config.validationServiceName = {};
					return config;
				}

				function getProjectModelPartDetailConfig(config) {
					config = $injector.get('modelProjectModelPartUIConfig').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelProjectModelPartUIConfig';
					config.dataServiceName = 'modelProjectModelPartDataService';
					config.validationServiceName = {};
					return config;
				}

				function getProjectModelStakeholderListConfig(config) {
					config.layout = $injector.get('modelProjectModelStakeholderUIConfig').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelProjectModelStakeholderUIConfig';
					config.dataServiceName = 'modelProjectModelStakeholderDataService';
					config.listConfig = {initCalled: false, columns: []};
					return config;
				}

				function getProjectModelStakeholderDetailConfig(config) {
					config = $injector.get('modelProjectModelStakeholderUIConfig').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelProjectModelStakeholderUIConfig';
					config.dataServiceName = 'modelProjectModelStakeholderDataService';
					return config;
				}

				return config;
			};
			service.getModelProjectClerkServiceInfos = function getModelProjectClerkServiceInfos() {
				return {
					standardConfigurationService: 'modelProjectClerkLayoutService',
					dataServiceName: 'modelProjectClerkDataService',
					validationServiceName: 'modelProjectClerkValidationService'
				};
			};

			service.getModelProjectClerkLayout = function getModelProjectClerkLayout() {
				let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'model.project.header.clerk',
					['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'commenttext']);
				res.overloads = service.getOverloads(['clerkrolefk', 'clerkfk']);
				res.addValidationAutomatically = true;
				return res;
			};

			service.getOverloads = function getOverloads(overloads) {
				let ovls = {};
				if (overloads) {
					_.forEach(overloads, (ovl) => {
						let ol = service.getOverload(ovl);
						if (ol) {
							ovls[ovl] = ol;
						}
					});
				}
				return ovls;
			};

			service.getOverload = function getOverloads(overload) {
				let ovl = null;

				switch (overload) {
					case 'clerkrolefk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCustomClerkRoleLookupDataService',
							enableCache: true
						});
						break;
					case 'clerkfk':
						ovl = platformLayoutHelperService.provideClerkLookupOverload();
						break;
				}

				return ovl;
			};

			return service;
		}
	]);
})(angular);
