/**
 * Created by lvy on 9/7/2018.
 */
(function (angular) {
	'use strict';
	/* global moment,globals,_ */

	/* jshint -W072 */
	var moduleName = 'constructionsystem.master';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemMasterObjectTemplateProperty2TemplateDataService', [
		'$http',
		'platformDataServiceFactory',
		'constructionSystemMasterObjectTemplate2TemplateDataService',
		'constructionSystemMasterTemplateDataService',
		'basicsCommonMandatoryProcessor',
		'PlatformMessenger',
		'basicsCommonReadDataInterceptor',
		function (
			$http,
			dataServiceFactory,
			parentService,
			grandparentService,
			basicsCommonMandatoryProcessor,
			PlatformMessenger,
			basicsCommonReadDataInterceptor
		) {
			var route = globals.webApiBaseUrl + 'constructionsystem/master/objecttemplateproperty2template/';
			var serviceContainer;
			var serviceOptions = {
				flatLeafItem: {
					module: constructionSystemModule,
					serviceName: 'constructionSystemMasterObjectTemplateProperty2TemplateDataService',
					httpCRUD: {
						route: route,
						endRead: 'list'
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								setDataType(readData);
								var result = serviceContainer.data.handleReadSucceeded(readData, data);
								return result;
							},
							initCreationData: function initCreationData(createData) {
								createData.mainItemId = parentService.getSelected().Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'CosObjectTemplateProperty2Template',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					translation: {
						uid: 'constructionSystemMasterObjectTemplateProperty2TemplateDataService',
						title: 'constructionsystem.master.2dObjectTemplateProperty2TemplateGridContainerTitle'
					},
					actions: {delete: false, create: false},
					dataProcessor: []
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			service.completeEntityCreateed = new PlatformMessenger();
			basicsCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);
			grandparentService.completeEntityCreated.register(createList);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CosObjectTemplateProperty2TemplateDto',
				moduleSubModule: 'ConstructionSystem.Master',
				validationService: 'constructionSystemMasterObjectTemplatePropertyValidationService',
				mustValidateFields: ['MdlPropertyKeyFk']
			});

			var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
				return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
					service.completeEntityCreateed.fire(null, newData);
				});
			};

			function setDataType(readData) {
				angular.forEach(readData, function(e) {
					if (e.ValueType === 5) {
						e.PropertyValueDate = e.PropertyValueDate ? moment.utc(e.PropertyValueDate) : null;
					}
				});
			}

			// noinspection JSUnusedLocalSymbols
			function createList(e, completeData) {
				if (!completeData) {
					return;
				}
				/** @namespace completeData.CosParameter2TemplateToSave */
				var newList = [];
				angular.forEach(completeData.CosObjectTemplate2TemplateToSave, function (e) {
					if (e.CosObjectTemplateProperty2TemplateToSave && e.CosObjectTemplateProperty2TemplateToSave.length)
					{
						newList = newList.concat(e.CosObjectTemplateProperty2TemplateToSave);
					}
				});
				angular.forEach(newList, function(e) {
					if (e.ValueType === 5) {
						e.PropertyValueDate = e.PropertyValueDate ? moment.utc(e.PropertyValueDate) : null;
					}
				});
				if (angular.isArray(newList) && newList.length > 0) {
					serviceContainer.service.setCreatedItems(newList, true);
					_.forEach(newList, function(item) {
						serviceContainer.service.markItemAsModified(item);
					});
				}
			}

			return service;
		}]);
})(angular);