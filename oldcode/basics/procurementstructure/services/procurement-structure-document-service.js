(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).factory('procurementStructureDocumentService',
		['platformDataServiceFactory', 'basicsProcurementStructureService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonMandatoryProcessor','basicsCommonServiceUploadExtension',
			'documentsProjectFileSizeProcessor','ServiceDataProcessDatesExtension',
			function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, basicsCommonMandatoryProcessor,basicsCommonServiceUploadExtension,
				documentsProjectFileSizeProcessor,ServiceDataProcessDatesExtension) {
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCreate: {
							route: globals.webApiBaseUrl + 'basics/procurementstructure/document/',
							endCreate: 'createdocument'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'basics/procurementstructure/document/',
							endDelete: 'deletedocument'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'basics/procurementstructure/document/',
							endUpdate: 'updatedocument'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/procurementstructure/document/',
							endRead: 'listdocument',
							usePostForRead: false
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: initCreationData
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcStructureDoc',
								parentService: parentService
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DocumentDate']),documentsProjectFileSizeProcessor],
					}
				};
				var uploadOptions = {
					uploadServiceKey: 'basics-procurementstructure-document',
					uploadConfigs: {
						SectionType: 'PrcStructureDoc',
						createForUploadFileRoute: 'basics/procurementstructure/document/createforuploadfile',
					},
					canPreview: true
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);
				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData);
					return serviceContainer.data.handleReadSucceeded(readData, data);
				}

				var data = serviceContainer.data;
				data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'PrcStructureDocDto',
					moduleSubModule: 'Basics.ProcurementStructure',
					validationService: '',
					mustValidateFields: []
				});
				return serviceContainer.service;

				function initCreationData(creationData) {
					creationData.PKey1 = parentService.getSelected().Id;
				}
			}]);
})(angular);