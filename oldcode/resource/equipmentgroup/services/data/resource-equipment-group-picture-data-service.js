(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'resource.equipmentgroup';
	const equipment = angular.module(moduleName);
	
	equipment.factory('resourceEquipmentGroupPictureDataService', ['_', '$injector', '$rootScope', '$http', 'moment', 'platformDataServiceFactory', 'platformFileUtilServiceFactory',
		'platformModalService', 'BasicsCommonDateProcessor', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentGroupDataService',

		function (_, $injector, $rootScope, $http, moment, platformDataServiceFactory, platformFileUtilServiceFactory,
			platformModalService, BasicsCommonDateProcessor, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentGroupDataService) {
			const factoryOptions = {
				flatLeafItem: {
					module: equipment,
					serviceName: 'resourceEquipmentPhotoService',
					entityNameTranslationID: 'resource.equipment.equipmentPhotoEntity',
					httpCreate: {route: globals.webApiBaseUrl + 'resource/equipmentgroup/photo/', endCreate: 'createphoto'},
					httpRead: {
						route: globals.webApiBaseUrl + 'resource/equipmentgroup/photo/',
						usePostForRead: true,
						endRead: 'listByParent',
						initReadData: function initReadData(readData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [new BasicsCommonDateProcessor('PictureDate'), platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PlantPictureDto',
						moduleSubModule: 'Resource.Equipment'
					})],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentGroupDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'DependingDto', parentService: resourceEquipmentGroupDataService}
					}
				}
			};
			const serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.createItem = function () {
				let result = {};
				$rootScope.$emit('photoAdded', result);
				if (!result.processed) {
					platformModalService.showMsgBox('Open container: "photo view" to add photos', 'Adding photos failed', 'info');
				}
			};

			serviceContainer.service.deleteEntities = function () {
				$rootScope.$emit('photoDeleted', serviceContainer.service.load);

			};

			serviceContainer.service.getSelectedSuperEntity = function getSelectedSuperEntity() {
				return resourceEquipmentGroupDataService.getSelected();
			};

			function setDefaultPicture() {
				let selectedParent = resourceEquipmentGroupDataService.getSelected();
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
				return $http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/photo/listByParent', readData).then(function (response) {
					return response.data;
				});
			};

			function getDefaultPictureItemAndSet(data) {
				let item = _.find(data, {IsDefault: true});
				serviceContainer.service.setSelected(item);
			}

			serviceContainer.service.onInitFilesDragAndDropCallBack = function (files) {
				// endpoint is no supporting multiple create  => files[0]
				$injector.get('resourceEquipmentGroupPhotoFileService').importFile(files[0]);
			};

			serviceContainer.service.registerListLoaded(setDefaultPicture);

			return serviceContainer.service;

		}]);
})(angular);
