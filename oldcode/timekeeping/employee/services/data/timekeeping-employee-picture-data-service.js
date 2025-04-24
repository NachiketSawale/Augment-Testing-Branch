/**
 * Created by leo on 08.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.employee';
	var employee = angular.module(moduleName);
	employee.factory('timekeepingEmployeePictureDataService', ['_', '$http','moment', 'platformDataServiceFactory', 'timekeepingEmployeeDataService', 'platformFileUtilServiceFactory', '$rootScope', 'platformModalService', 'BasicsCommonDateProcessor', 'platformDataServiceProcessDatesBySchemeExtension',

		function (_, $http, moment, platformDataServiceFactory, timekeepingEmployeeDataService, platformFileUtilServiceFactory, $rootScope, platformModalService, BasicsCommonDateProcessor, platformDataServiceProcessDatesBySchemeExtension) {
			var factoryOptions = {
				flatLeafItem: {
					module: employee,
					serviceName: 'timekeepingEmployeePictureDataService',
					entityNameTranslationID: 'timekeeping.employee.entityPicture',
					httpCreate: {route: globals.webApiBaseUrl + 'timekeeping/employee/picture/', endCreate: 'createpicture'},
					httpRead: {
						route: globals.webApiBaseUrl + 'timekeeping/employee/picture/',
						usePostForRead: true,
						endRead: 'listbyparent',
						initReadData: function initReadData(readData) {
							var selected = timekeepingEmployeeDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'timekeeping/employee/picture/', endUpdate: 'update'},
					dataProcessor: [new BasicsCommonDateProcessor('PictureDate'), platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'EmployeePictureDto',
						moduleSubModule: 'Timekeeping.Employee'
					})],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = timekeepingEmployeeDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'EmployeePictures', parentService: timekeepingEmployeeDataService}
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
			};

			serviceContainer.service.deleteEntities = function () {
				$rootScope.$emit('photoDeleted', serviceContainer.service.load);
			};

			serviceContainer.service.getSelectedSuperEntity = function getSelectedSuperEntity() {
				return timekeepingEmployeeDataService.getSelected();
			};

			timekeepingEmployeeDataService.cacheSelectPicture= serviceContainer.service.getSelected;

			function setDefaultPicture() {
				let selectedParent = timekeepingEmployeeDataService.getSelected();
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
				return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/picture/listbyparent', readData).then(function (response) {
					return response.data;
				});
			};

			function getDefaultPictureItemAndSet(data){
				let item = _.find(data, {IsDefault: true});
				serviceContainer.service.setSelected(item);
			}

			serviceContainer.service.registerListLoaded(setDefaultPicture);

			return serviceContainer.service;

		}]);
})(angular);
