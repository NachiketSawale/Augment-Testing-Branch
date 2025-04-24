/**
 * Created by waz on 3/6/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);

	module.factory('productionplanningCommonDocumentDataServiceRevisionFactory', PpsDocumentDataServiceFactory);

	PpsDocumentDataServiceFactory.$inject = [
		'$q',
		'$http',
		'PlatformMessenger',
		'platformDataServiceActionExtension',
		'platformDataServiceModificationTrackingExtension',
		'basicsCommonBaseDataServiceBuilder',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonServiceUploadExtension',
		'basicsCommonMandatoryProcessor',
		'basicsCommonFileUploadServiceFactory',
		'productionplanningCommonDocumentRevisionValidationServiceFactory',
		'productionplanningCommonDocumentDataServiceFactory',
		'productionplanningCommonDocumentRevisionDataServiceSyncManager',
	'ppsCommonDocumentCombineDataServiceFactory'];
	function PpsDocumentDataServiceFactory($q,
	                                       $http,
	                                       PlatformMessenger,
	                                       platformDataServiceActionExtension,
	                                       platformDataServiceModificationTrackingExtension,
	                                       BaseDataServiceBuilder,
	                                       basicsLookupdataLookupDescriptorService,
	                                       basicsCommonServiceUploadExtension,
	                                       basicsCommonMandatoryProcessor,
	                                       uploadServiceFactory,
	                                       RevisionValidationServiceFactory,
	                                       DocumentDataServiceFactory,
	                                       SyncManager,
		documentCombineDataServiceFactory) {
		var serviceFactroy = {};
		var serviceCache = {};

		serviceFactroy.createNewComplete = function (serviceOptions) {



			var foreignKey = serviceOptions.foreignKey;
			var containerId = serviceOptions.containerId;
			var serviceContainer;
			var uploadDone = new PlatformMessenger();
			var parentService = getParentService(serviceOptions);
			var httpResource = {route: globals.webApiBaseUrl + 'productionplanning/common/document/revision/'};
			var info = {
				module: module,
				entityNameTranslationID: 'productionplanning.common.document.revision.entityRevision',
				serviceName: parentService.getServiceName() + 'RevisionDataService'
			};
			var role = {
				leaf: {
					itemName: 'Revision',
					parentService: parentService,
					parentFilter: 'documentId',
					doesRequireLoadAlways: true
				}
			};
			var presenter = {
				list: {
					incorporateDataRead: function (readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData);
						var result = readData.Main ? {
							FilterResult: readData.FilterResult,
							dtos: readData.Main || []
						} : readData;

						return serviceContainer.data.handleReadSucceeded(result, data);
					},
					initCreationData: function initCreationData(creationData) {
						creationData.Id = parentService.getSelected().Id;
						var maxRevision = _.maxBy(service.getList(), 'Revision');
						creationData.PKey1 = maxRevision? maxRevision.Revision + 1 : 1;
					}
				}
			};

			var builder = new BaseDataServiceBuilder('flatLeafItem');
			serviceContainer = builder
				.setHttpResource(httpResource)
				.setServiceInfo(info)
				.setEntityRole(role)
				.setPresenter(presenter)
				.build();

			var uploadOptions = {
				uploadServiceKey: parentService.name + '.ppsdocument',
				uploadConfigs: {SectionType: 'PpsDocument', appId: '1F45E2E0E33843B98DEB97DBD69FA218'},
				canUpload: canUpload,
				canPreview: true,
				uploadFilesCallBack: uploadFilesCallBack
			};
			var uploadService = uploadServiceFactory.createService(uploadOptions);
			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			/* jshint -W003 */
			var service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsDocumentRevisionDto',
				moduleSubModule: 'ProductionPlanning.Common',
				validationService: RevisionValidationServiceFactory.getService(containerId, service)
			});

			// beacuse the upload service extension can't use in revision container, I have to write a new one
			service.uploadFiles = uploadFiles;
			service.createUploadRevision = createUploadRevision;
			service.registerUploadDone = registerUploadDone;

			function registerUploadDone(callback) {
				uploadDone.register(callback);
			}

			function canUpload() {
				return parentService.getSelected();
			}

			function uploadFiles() {
				var documentTypeId = service.parentService().getSelected().DocumentTypeFk;
				return uploadService.uploadFiles({},
					service.getExtension(basicsLookupdataLookupDescriptorService.getData('DocumentType'),
						documentTypeId));
			}

			function uploadFilesCallBack(currentItem, data) {
				createUploadRevision(currentItem, data, function () {
					uploadDone.fire(null, data);
				});
			}

			service.createItemBy = function (currentItem, data) {
				var deffered = $q.defer();
				var createItem = function () {
					var maxRevision = _.maxBy(service.getList(), 'Revision');
					var seq = maxRevision? maxRevision.Revision + 1 : 1;
					$http.post(globals.webApiBaseUrl + 'productionplanning/common/document/revision/create', {
						documentId: currentItem.Id,
						seq: seq
					}).then(function (response) {
						var newItem = response.data;
						newItem.FileArchiveDocFk = data.FileArchiveDocId;
						newItem.OriginFileName = newItem.Description = data.fileName.substr(0, 42);
						serviceContainer.data.storeCacheFor(currentItem, serviceContainer.data);
						serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data);
						deffered.resolve(newItem);
					});
				};
				if (_.isArray(serviceContainer.service.getList() && serviceContainer.service.getList().length > 0)) {//use cache,if not, the modified at the first time will lose
					createItem();
				}
				else {
					serviceContainer.service.loadSubItemList().then(function () {//find in db
						createItem();
					});
				}
				return deffered.promise;
			};

			function createUploadRevision(currentItem, data, afterCreatedCallback) {
				service.createItem().then(function (createdItem) {
					createdItem.FileArchiveDocFk = data.FileArchiveDocId;
					var fileName = data.fileName;
					if (angular.isString(fileName) && fileName.length > 42) {
						createdItem.OriginFileName = createdItem.Description = fileName.substr(0, 42);
					} else {
						createdItem.OriginFileName = createdItem.Description = fileName;
					}
					service.updateLoadedItem(createdItem);
					if (afterCreatedCallback) {
						afterCreatedCallback.call(this);
					}
				});
			}

			function getParentService(serviceOptions){
				if(serviceOptions.usingForCombine === 'true'){
					return documentCombineDataServiceFactory.getService({
						containerId: serviceOptions.parentContainerId
					});
				}else{
					return DocumentDataServiceFactory.getService({
						containerId: serviceOptions.parentContainerId,
						parentService: serviceOptions.grandfatherService,
						foreignKey: serviceOptions.foreignKey,
						idProperty: serviceOptions.idProperty
					});
				}
			}

			var syncManager = new SyncManager(service, parentService);
			syncManager.syncDocumentAndRevision();

			return service;
		};

		//get service or create service by module name
		serviceFactroy.getService = function getService(serviceOptions) {
			var containerId = serviceOptions.parentContainerId;
			if (!serviceCache[containerId]) {
				serviceCache[containerId] = serviceFactroy.createNewComplete(serviceOptions);
			}
			return serviceCache[containerId];
		};
		return serviceFactroy;
	}
})(angular);