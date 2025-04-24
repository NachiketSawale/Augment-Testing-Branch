(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.equipment';
	var equipment = angular.module(moduleName);
	equipment.factory('resourceEquipmentLeafPhotoService', ['_', '$injector', 'platformDataServiceFactory', 'resourceEquipmentPlantDataService', 'platformFileUtilServiceFactory', '$rootScope', '$http', 'moment',
		'platformModalService', 'BasicsCommonDateProcessor', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantPictureReadOnlyProcessor',

		function (_, $injector, platformDataServiceFactory, resourceEquipmentPlantDataService, platformFileUtilServiceFactory, $rootScope, $http, moment,
			platformModalService, BasicsCommonDateProcessor, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantPictureReadOnlyProcessor) {
			var factoryOptions = {
				flatLeafItem: {
					module: equipment,
					serviceName: 'resourceEquipmentLeafPhotoService',
					entityNameTranslationID: 'resource.equipment.equipmentPhotoEntity',
					httpCreate: {route: globals.webApiBaseUrl + 'resource/equipment/photo/', endCreate: 'createphoto'},
					httpRead: {
						route: globals.webApiBaseUrl + 'resource/equipment/photo/',
						usePostForRead: true,
						endRead: 'listByParent',
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
							readData.PKey2 = selected.PlantGroupFk;
						}
					},
					dataProcessor: [new BasicsCommonDateProcessor('PictureDate'), platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PlantPictureDto',
						moduleSubModule: 'Resource.Equipment'
					}), resourceEquipmentPlantPictureReadOnlyProcessor],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'DependingDto', parentService: resourceEquipmentPlantDataService}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.createItem = function () {
				var result = {};
				$rootScope.$emit('photoAdded', result);
				if (!result.processed) {
					platformModalService.showMsgBox('Open container: "photo view" to add photos', 'Adding photos failed', 'info');
				}
				//serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceededInList(newItem, data);
			};

			serviceContainer.service.deleteEntities = function () {
				$rootScope.$emit('photoDeleted', serviceContainer.service.load);

			};

			serviceContainer.service.getSelectedSuperEntity = function getSelectedSuperEntity() {
				return resourceEquipmentPlantDataService.getSelected();
			};

			function setDefaultPicture() {
				let selectedParent = resourceEquipmentPlantDataService.getSelected();
				if (!_.isNil(selectedParent)) {
					let data = serviceContainer.service.getList();
					if (data !== undefined && data.length > 0) {
						getDefaultPictureItemAndSet(data);
					} else {
						serviceContainer.service.getListAsync(selectedParent.Id).then(function (response) {
							data = response;
							if (data !== undefined && data.length > 0) {
								setToMomentUTC(data);
								serviceContainer.data.itemList = data;
								getDefaultPictureItemAndSet(data);
							}
						});
					}
				}
			}

			function setToMomentUTC(data) {
				_.forEach(data, function (item) {
					item.PictureDate = moment.utc();
				});
			}

			serviceContainer.service.getListAsync = function (parentId) {
				let readData = {};
				readData.PKey1 = parentId;
				return $http.post(globals.webApiBaseUrl + 'resource/equipment/photo/listByParent', readData).then(function (response) {
					return response.data;
				});
			};

			function getDefaultPictureItemAndSet(data) {
				let item = _.find(data, {IsDefault: true});
				serviceContainer.service.setSelected(item);
			}

			serviceContainer.service.onInitFilesDragAndDropCallBack = function (files) {
				// endpoint is no supporting multiple create  => files[0]
				$injector.get('resourceEquipmentPhotoFileService').importFile(files[0]);
			};

			serviceContainer.service.registerListLoaded(setDefaultPicture);

			serviceContainer.service.canDelete = function canDelete() {
				const picture = serviceContainer.service.getSelected();

				return !_.isNil(picture) && !picture.FromPlantGroup;
			};

			return serviceContainer.service;
		}]);
})(angular);
