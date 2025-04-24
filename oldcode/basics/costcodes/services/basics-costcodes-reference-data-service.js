/*
* $Id$
* Copyright(c) RIB Software GmbH
*/

(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'basics.costcodes';
	let costCodesModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCostCodesReferenceDataService
	 * @function
	 *
	 * @description
	 * basicsCostCodesReferenceDataService is the data service for all costcodes related functionality.
	 */

	costCodesModule.service('basicsCostCodesReferenceDataService',['$http','$injector','platformDataServiceFactory',
		function ($http,$injector,platformDataServiceFactory) {

			let costcodeData = {};
			let gridId = '';
			let references = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'basicsCostCodesReferenceDataService',
					entityNameTranslationID: 'basics.costcodes.source',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/costcodes/',
						usePostForRead: false,
						endRead: 'getreferences',
						initReadData: function initReadData(readData) {
							readData.filter = '?costcodeId=' + costcodeData.Id;
						}
					},
					useItemFilter: true,
					entityRole: {
						root: {
							rootForModule: moduleName,
							moduleName: 'Basics costcodes'
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {delete: false, create: false},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData,data) {
								var responce = JSON.parse(readData);
								_.forEach(responce, function(obj, index) {
									obj.Id = index + 1;
									obj.Source = obj.S;
									delete obj.S;
								});
								let result = serviceContainer.data.handleReadSucceeded(responce, data);
								return result;
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(references);
			let service = serviceContainer.service;

			service.loadCostcodeData = function (data) {
				costcodeData = data;
				service.load();
			};

			service.getGridId = function getGridId() {
				return gridId;
			};

			service.setGridId = function setGridId(grid) {
				gridId = grid;
			};

			return service;
		}
	]);

})();