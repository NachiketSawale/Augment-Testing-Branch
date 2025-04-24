(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainPhotoDataService
	 * @function
	 * @requireds platformDataServiceFactory
	 *
	 * @description Provide activity data service
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('businesspartnerMainPhotoDataService', [
		'platformDataServiceFactory', 'businesspartnerMainHeaderDataService', 'globals', 'businesspartnerStatusRightService',
		function (platformDataServiceFactory, businesspartnerMainHeaderDataService, globals, businesspartnerStatusRightService) {

			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerMainPhotoDataService',
					entityRole: {
						leaf: {
							itemName: 'Photo',
							parentService: businesspartnerMainHeaderDataService,
							doesRequireLoadAlways: true
						}
					},
					httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/photo/', endCreate: 'create'},
					httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/photo/', endRead: 'list'},
					presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData
					}}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			serviceContainer.service.disablePrev = function () {
				return canContactNavigate();
			};

			serviceContainer.service.disableNext = function () {
				return canContactNavigate('forward');
			};

			function canContactNavigate(type) {
				type = type || 'backward';
				let select = serviceContainer.service.getSelected();
				let list = serviceContainer.service.getList();
				if (!select?.Id || list <= 0) {
					return false;
				}
				let index = type === 'forward' ? list.length - 1 : 0;
				return select === list[index];
			}

			function incorporateDataRead(readData, data) {
				let status = businesspartnerMainHeaderDataService.getItemStatus();
				if (status.IsReadonly === true) {
					businesspartnerStatusRightService.setListDataReadonly(readData, true);
				}

				return data.handleReadSucceeded(readData, data);
			}

			return serviceContainer.service;

			function initCreationData(creationData) {
				let selected = businesspartnerMainHeaderDataService.getSelected();
				creationData.PKey1 = selected.Id;
			}
		}
	]);
})(angular);
