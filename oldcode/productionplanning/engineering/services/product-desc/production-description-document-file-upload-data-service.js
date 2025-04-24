/**
 * Created by lav on 2018-4-13.
 * Remark: At the moment, because wizard “Import Product Description” is discarded, code of this file will not be used any more. 
 * But here we will still keep the code, in case we will reuse it in the future(e.g. reuse to patch CAD data in DB without accounting).(by zwz 2019/11/12)
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('productDescriptionDocumentDocumentFileUploadDataService',
		[
			'platformModalService',
			'$q',
			'basicsCommonServiceUploadExtension',
			'$http', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService',
			'$translate',
			'productionplanningEngineeringProductDescriptionDataService',
			'productionplanningCommonUploadService',
			'productionplanningCommonDocumentDataServiceFactory',
			'productionplanningCommonDocumentDataServiceRevisionFactory',
			/* jshint -W072 */
			function (platformModalService,
					  $q,
					  basicsCommonServiceUploadExtension,
					  $http, PlatformMessenger, basicsLookupdataLookupDescriptorService,
					  $translate,
					  productDescDataService,
					  productionplanningCommonUploadService,
					  productionplanningCommonDocumentDataServiceFactory,
					  productionplanningCommonDocumentDataServiceRevisionFactory) {

				var option = {
					uploadServiceKey: 'production-description-document-file-upload',
					uploadConfigs: {SectionType: 'PpsDocument'},
					maxLengthFileName: 16
				};

				var service = productionplanningCommonUploadService.createNewService(option);

				service.importProductDesc = function (fileUploadEntity, afterFinishedCallBack) {
					var uploadItem = {
						percentage: 0,
						restUploadTime: getTime(0),
						uploadOptions: {
							fileInfo: {
								fileName: ''
							}
						}
					};
					service.getUploadService().setItemsSource([uploadItem]);//set a virtual updateitem to show the progress
					var files = fileUploadEntity.FileInfo;
					var uomFK = fileUploadEntity.UomFK;
					var materialFK = fileUploadEntity.MaterialFK;
					var serviceOptions = {
						foreignKey: 'ProductDescriptionFk',
						containerId: 'productionplanning.engineering.productDescription.ppsdocument',
						parentService: productDescDataService
					};
					var documentDataService = productionplanningCommonDocumentDataServiceFactory.getService(serviceOptions);

					serviceOptions = {
						foreignKey: serviceOptions.foreignKey,
						containerId: 'af8a5a1df29f42a6b86d1f990bada53a',
						parentContainerId: serviceOptions.containerId,
						grandfatherService: productDescDataService
					};
					var revisionDataService = productionplanningCommonDocumentDataServiceRevisionFactory.getService(serviceOptions);

					var index = 0;
					var uploadFile = function uploadFile() {
						if (files.length > index) {
							var file = files[index];
							var fileName = file.fileName.substr(0, file.fileName.lastIndexOf('.'));
							if (!uploadItem.startTime) {
								uploadItem.startTime = Date.now();
							}
							productDescDataService.createItemByCode(fileName, uomFK, materialFK).then(function (newProductDesc) {
								var documentTypeId = _.find(service.fileExtensionArray, {Extention: productionplanningCommonUploadService.getFileExtension(file.fileName)}).id;
								documentDataService.createItemByTypeId(documentTypeId, newProductDesc, file).then(function (ppsDocument) {
									documentDataService.updateLoadedDocument(ppsDocument, file);
									revisionDataService.createItemBy(ppsDocument, file).then(function (documentRevision) {
										revisionDataService.updateLoadedItem(documentRevision);
										index++;
										uploadItem.uploadOptions.fileInfo.fileName = fileName;
										uploadItem.percentage = Math.floor(index / files.length * 100);
										uploadItem.restUploadTime = getTime((files.length - index) * (Date.now() - uploadItem.startTime) / 1000);
										uploadItem.startTime = Date.now();
										uploadFile();
									});
								});
							});
						}
						else {
							service.getUploadService().setItemsSource([]);//clear the progress bar
							if (afterFinishedCallBack) {
								afterFinishedCallBack();
							}
						}
					};
					uploadFile();
				};

				function getTime(time) {
					var h = parseInt(time / 3600);
					var m = parseInt(time % 3600 / 60);
					var s = parseInt(time % 3600 % 60);
					return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
				}

				return service;
			}]);
})(angular);