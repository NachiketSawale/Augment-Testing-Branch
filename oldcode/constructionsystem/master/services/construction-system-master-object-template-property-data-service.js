/**
 * Created by lvy on 6/7/2018.
 */
(function (angular) {
	'use strict';
	/* global moment,globals */

	/* jshint -W072 */
	var moduleName = 'constructionsystem.master';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemMasterObjectTemplatePropertyDataService', [
		'$injector',
		'platformDataServiceFactory',
		'constructionSystemMasterObjectTemplateDataService',
		'basicsCommonMandatoryProcessor',
		'PlatformMessenger',
		'basicsLookupdataLookupDescriptorService',
		function (
			$injector,
			dataServiceFactory,
			parentService,
			basicsCommonMandatoryProcessor,
			PlatformMessenger,
			basicsLookupdataLookupDescriptorService
		) {
			var route = globals.webApiBaseUrl + 'constructionsystem/master/objecttemplateproperty/';
			var serviceContainer;
			var serviceOptions = {
				flatLeafItem: {
					module: constructionSystemModule,
					serviceName: 'constructionSystemMasterObjectTemplatePropertyDataService',
					httpCRUD: {
						route: route,
						endRead: 'list'
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								if (readData.MdlAdministrationPropertyKeys && readData.MdlAdministrationPropertyKeys.length) {
									basicsLookupdataLookupDescriptorService.addData('modelAdministrationPropertyKeys', readData.MdlAdministrationPropertyKeys);
								}
								setDataType(readData.Main);
								return serviceContainer.data.handleReadSucceeded(readData.Main, data);
							},
							initCreationData: function initCreationData(createData) {
								createData.mainItemId = parentService.getSelected().Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'CosObjectTemplateProperty',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					translation: {
						uid: 'constructionSystemMasterObjectTemplatePropertyDataService',
						title: 'constructionsystem.master.2dObjectTemplatePropertyGridContainerTitle',
						dtoScheme: {
							typeName: 'CosObjectTemplatePropertyDto',
							moduleSubModule: 'ConstructionSystem.Master'
						}
					},
					dataProcessor: []
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			service.completeEntityCreateed = new PlatformMessenger();

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CosObjectTemplatePropertyDto',
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

			return service;
		}]);
})(angular);