/**
 * $Id:
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.project';
	const modelProjectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelProjectClerkDataService
	 * @description provides methods to access, create and update model Project clerk entities
	 */
	modelProjectModule.service('modelProjectClerkDataService', modelProjectClerkDataService);

	modelProjectClerkDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'modelProjectModelDataService', 'ServiceDataProcessDatesExtension'];

	function modelProjectClerkDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, modelProjectModelDataService, ServiceDataProcessDatesExtension) {

		const self = this;
		const modelProjectClerkServiceOption = {
			flatLeafItem: {
				module: modelProjectModule,
				serviceName: 'modelProjectClerkDataService',
				entityNameTranslationID: 'cloud.common.entityClerk',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/project/modelclerkrole/',
					endRead: 'listformodel',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						const selectedModel = modelProjectModelDataService.getSelected();
						readData.filter = '?modelId=' + selectedModel.Id;
					}
				},
				dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = modelProjectModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ModelClerkRole', parentService: modelProjectModelDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(modelProjectClerkServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'modelProjectClerkValidationService'
		}, {typeName: 'ModelClerkRoleDto', moduleSubModule: 'Model.Project'}));
	}
})(angular);

