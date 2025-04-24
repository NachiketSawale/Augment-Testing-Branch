/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var basicsConfigModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardContainerDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardContainerDataService is a data service for managing container of generic wizards.
	 */
	basicsConfigModule.factory('basicsConfigGenWizardContainerDataService', ['basicsConfigGenWizardStepDataService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsConfigGenWizardInstanceDataService', 'basicsConfigGenericWizardDataProcessorFactoryService',
		'platformRuntimeDataService', 'platformDataServiceInitialValidationDataProcessorFactory', 'platformFileUtilServiceFactory', 'genericWizardUseCaseConfigService', '$injector', 'platformVanillaDataProtectorService',

		function (basicsConfigGenWizardStepDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsConfigGenWizardInstanceDataService,
				  basicsConfigGenericWizardDataProcessorFactoryService, platformRuntimeDataService, initialValidationFactory, fileUtilServiceFactory, genericWizardUseCaseConfigService, $injector, platformVanillaDataProtectorService) {

			var genWizardContainerOption = {
				flatNodeItem: {
					module: basicsConfigModule,
					serviceName: 'basicsConfigGenWizardContainerDataService',
					entityNameTranslationID: 'basics.config.entityContainer',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/config/genwizard/container/'},
					httpRead: {
						usePostForRead: true,
						route: globals.webApiBaseUrl + 'basics/config/genwizard/container/'
					},
					dataProcessor: [
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'GenericWizardContainerDto',
							moduleSubModule: 'Basics.Config'
						}),
						{
							processItem: function (item) {
								/*
																if (item.Version > 0) {
																	platformRuntimeDataService.readonly(item, [{
																		field: 'ContainerUuid',
																		readonly: true
																	}]);
																}
								*/
								var isReadonly = getReadonly();
								platformRuntimeDataService.readonly(item, [{
									field: 'ContainerUuid',
									readonly: item.Version > 0
								}, {
									field: 'CanInsert',
									readonly: isReadonly
								}, {
									field: 'FileArchiveDocFk',
									readonly: isReadonly
								}
								]);
							}
						}, initialValidationFactory.createProcessor({
							typeName: 'GenericWizardContainerDto',
							moduleSubModule: 'Basics.Config'
						}, 'basicsConfigGenWizardValidationService')
					],
					actions: {delete: true, canDeleteCallBackFunc: canDelete, create: 'flat'},
					modification: {multi: true},
					entityRole: {node: {itemName: 'Container', parentService: basicsConfigGenWizardStepDataService}},
					translation: {
						uid: 'basicsConfigGenWizardContainerDataService',
						title: 'basics.config.genWizardContainerListContainerTitle',
						columns:[
							{header: 'basics.config.entityTitle', field: 'TitleInfo'},
							{header: 'cloud.common.entityComment', field: 'CommentInfo'}
						],
						dtoScheme: { typeName: 'GenericWizardContainerDto', moduleSubModule: 'Basics.Config' }
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = basicsConfigGenWizardStepDataService.getSelected().Id;
								creationData.EntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardContainerOption);

			var service = serviceContainer.service;

			service.canCreate = function canCreate() {

				var selected = basicsConfigGenWizardStepDataService.getSelected();
				if (selected) {
					// a splitted step can have max 2 container
					if (selected.GenericWizardStepTypeFk === 2) {
						return serviceContainer.data.itemList.length < 2;
					}
					if (selected.GenericWizardStepTypeFk === 1) {
						return serviceContainer.data.itemList.length < 1;
					}
				}
			};

			serviceContainer.data.initReadData = function initGenWizardContainerReadData(readData) {
				readData.SuperEntityId = basicsConfigGenWizardStepDataService.getSelected().Id;
			};

			function getReadonly() {
				var res = false;
				var genWiz = basicsConfigGenWizardInstanceDataService.getSelected();
				if (genWiz !== undefined && genWiz !== null) {
					var config = genericWizardUseCaseConfigService.getUseCaseConfiguration(genWiz.WizardConfiGuuid);
					res = config.readonly;
				}
				return res;
			}

			service.isReadonly = function isReadonly() {
				return getReadonly();
			};

			function canDelete(item) {
					return platformVanillaDataProtectorService.isVanillaData(item) ? false : !getReadonly() || item.Version === 0;
			}


			service.isContainerTypeChart = function isContainerTypeChart() {
				var result = false;
				var genWiz = basicsConfigGenWizardInstanceDataService.getSelected();
				var selected = service.getSelected();
				if ((genWiz !== undefined && genWiz !== null) && selected && selected.ContainerUuid) {
					var module = genericWizardUseCaseConfigService.getModuleFromContainerUuid(genWiz.WizardConfiGuuid, selected.ContainerUuid);
					if (module) {
						var moduleName = _.camelCase(module);
						var containerInfoService = $injector.get(moduleName + 'ContainerInformationService');
						var containerInfo = containerInfoService.getContainerInfoByGuid(selected.ContainerUuid);
						result = containerInfo && containerInfo.ContainerType === 'chart';
					}
				}
				return result;
			};

			var config = {
				getDocId: globals.webApiBaseUrl + 'basics/common/document/getnewfilearchivedocid',
				importUrl: globals.webApiBaseUrl + 'basics/common/document/uploadfile',
				fileFkName: 'FilearchivedocFk',
				storeInFileArchive: true,
			};

			var fileService = fileUtilServiceFactory.getFileService(config, serviceContainer.service);
			angular.extend(service, fileService);
			return service;
		}
	]);
})();