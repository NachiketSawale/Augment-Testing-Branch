(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businesspartnerContactPhotoDataService
	 * @function
	 * @requireds platformDataServiceFactory
	 *
	 * @description contact photo data service
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('businesspartnerContactPhotoDataService', [
		'platformDataServiceFactory', 'businesspartnerContactDataService', 'globals',
		function (platformDataServiceFactory, businesspartnerContactDataService, globals) {
			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerContactPhotoDataService',
					entityRole: {
						leaf: {
							itemName: 'ContactPhoto',
							parentService: businesspartnerContactDataService,
							doesRequireLoadAlways: true
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/photo/',
						endCreate: 'createnew'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/contact/photo/',
						endRead: 'list'
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

			function incorporateDataRead(readData, data) {
				let list = data.handleReadSucceeded(readData, data);
				if (list.length > 0) {
					service.setSelected(list[0]);
				}
			}

			return service;
		}
	]);
})(angular);
