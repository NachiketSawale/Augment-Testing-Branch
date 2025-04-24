(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainContactPhotoDataService
	 * @function
	 * @requireds platformDataServiceFactory
	 *
	 * @description contact photo data service
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('businesspartnerMainContactPhotoDataService', [
		'platformDataServiceFactory', 'businesspartnerMainContactDataService', 'globals', 'platformPermissionService',
		'businesspartnerStatusRightService', 'businesspartnerMainHeaderDataService',
		function (platformDataServiceFactory, businesspartnerMainContactDataService, globals, platformPermissionService,
			businesspartnerStatusRightService, businesspartnerMainHeaderDataService) {
			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerMainContactPhotoDataService',
					entityRole: {
						leaf: {
							itemName: 'ContactPhoto',
							parentService: businesspartnerMainContactDataService,
							doesRequireLoadAlways: platformPermissionService.hasRead('3d4ec8d837f049eda2e7d92e051d9351')
						}
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/photo/',
						endRead: 'list'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/photo/',
						endCreate: 'createnew'
					},
					presenter: {list: {incorporateDataRead: incorporateDataRead}}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = container.service;
			delete service.mergeUpdatedDataInCache;

			let oldStoreCacheFor = container.data.storeCacheFor;
			container.data.storeCacheFor = function storeCacheFor(item, data) {
				let foundInValidData = _.find(data.itemList, function (dataItem) {
					return dataItem.ContactFk !== item.Id;
				});

				if (foundInValidData) {
					return;
				}

				oldStoreCacheFor(item, data);
			};

			service.storeCacheForCopy = function (item) {
				container.data.storeCacheFor(item, container.data);
			};

			function incorporateDataRead(readData, data) {
				let status = businesspartnerMainHeaderDataService.getItemStatus();
				if (status.IsReadonly === true) {
					businesspartnerStatusRightService.setListDataReadonly(readData, true);
				}

				let list = data.handleReadSucceeded(readData, data);
				if (list.length > 0) {
					service.setSelected(list[0]);
				}
			}

			let canCreate = container.service.canCreate;
			container.service.canCreate = function () {
				return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
			};

			let canDelete = container.service.canDelete;
			container.service.canDelete = function () {
				return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
			};
			return service;
		}
	]);
})(angular);
