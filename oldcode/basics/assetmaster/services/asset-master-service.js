(function config(angular) {
	'use strict';

	var moduleName = 'basics.assetmaster';
	angular.module(moduleName).factory('basicsAssetMasterService', [
		'globals',
		'$http',
		'$timeout',
		'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceDataProcessorExtension',
		'procurementCommonHelperService',
		'PlatformMessenger',
		function basicsAssetMasterService(
			globals,
			$http,
			$timeout,
			platformDataServiceFactory,
			ServiceDataProcessArraysExtension,
			mandatoryProcessor,
			platformDataServiceDataProcessorExtension,
			procurementCommonHelperService,
			PlatformMessenger) {
			var sidebarSearchOptions = {
				moduleName: 'basics.assetmaster',
				pattern: '',
				enhancedSearchEnabled: true,
				pageSize: 100,
				useCurrentClient: false,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: false,
				withExecutionHints: true,
				enhancedSearchVersion: '2.0',
				includeDateSearch: true
			};
			var navHeaderFk = 0;
			var mainServiceOptions = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsAssetMasterService',
					entityNameTranslationID: 'basics.assetmaster.moduleName',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/assetmaster/',
						usePostForRead: true,
						endRead: 'tree'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/assetmaster/',
						usePostForRead: true,
						endCreate: 'createdata'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'basics/assetmaster/',
						usePostForRead: true,
						endUpdate: 'updatedata'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'basics/assetmaster/',
						usePostForRead: true,
						endDelete: 'deletedata'
					},

					dataProcessor: [new ServiceDataProcessArraysExtension(['AssetMasterChildren'])],
					entityRole: {
						root: {
							itemName: 'AssetMaster',
							moduleName: 'cloud.desktop.moduleDisplayNameAssetMaster',
							addToLastObject: true,
							lastObjectModuleName: 'basics.assetmaster',
							descField: 'DescriptionInfo.Description'
						}
					},
					presenter: {
						tree: {
							parentProp: 'AssetMasterParentFk', childProp: 'AssetMasterChildren',
							initCreationData: function initCreationData(creationData) {
								if (creationData.parentId === null || angular.isUndefined(creationData.parentId)) {
									creationData.parentId = 0;
								}
							},
							incorporateDataRead: incorporateDataRead
						}
					},
					sidebarSearch: {options: sidebarSearchOptions},
					entitySelection: {supportsMultiSelection: true},
					translation: {
						uid: 'basicsAssetMasterService',
						title: 'basics.assetmaster.moduleName',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'AssetMasterDto', moduleSubModule: 'Basics.AssetMaster' }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(mainServiceOptions);
			var service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'AssetMasterDto',
				moduleSubModule: 'Basics.AssetMaster',
				validationService: 'basicsAssetMasterValidationService'
			});
			service.onScrollToItem = new PlatformMessenger();

			var getNavData = function getNavData(item) {
				navHeaderFk = item.AssetMasterFk;
				if (angular.isDefined(navHeaderFk)) {
					return navHeaderFk;
				} else {
					throw new Error('The property contract header is not recognized.');
				}
			};

			procurementCommonHelperService.registerNavigation(serviceContainer.data.httpReadRoute, {
				moduleName: 'basics.assetmaster',
				getNavData: getNavData
			});

			return service;

			function incorporateDataRead(readData, data) {
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				var retData = serviceContainer.data.handleReadSucceeded(result, data);
				if (navHeaderFk > 0) {
					var itemList = service.getList();
					if (itemList.length > 0) {

						$timeout(function timeoutCallback() {
							service.onScrollToItem.fire(null, itemList[itemList.length - 1]);
						}, 200);
					}
				}
				navHeaderFk = 0;

				return retData;
			}


		}]);
})(angular);