/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainSearchAssembliesDialogService
	 * @function
	 * @requires
	 *
	 * @description
	 * #
	 * estimateMainSearchAssembliesDialogService
	 */
	angular.module('estimate.main').service('estimateMainSearchAssembliesDialogService', [
		'$q', '$translate', 'platformModalService', 'platformDataServiceFactory', 'platformTranslateService', 'platformCreateUuid',
		function ($q, $translate, platformModalService, platformDataServiceFactory, platformTranslateService, platformCreateUuid) {

			let service = {
				showDialog: showDialog,
				dataService: null
			};

			function showDialog(customOptions) {
				let defer = $q.defer();

				service.dataService = createDataService();  // create a data server for the dialog controller

				let defaultOptions = {
					headerText: $translate.instant('estimate.main.wizardDialog.copyAssemblies'),
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-search-assemblies-dialog.html',
					backdrop: false,
					width: 'max',
					maxWidth: '1000px',
					columns: [],                                // grid columns
					gridData: [],                               // grid data
					uuid: 'f12cd1b10df84ad8b012e06fef035bee',   // grid id (uuid)
					requestId: platformCreateUuid(),            // request id (guid)
					inquiryDataFn: null,                        // show estimate main line item window to search and copy line items
					requestDataFn: null                         // get the selected and saved Assemblies
				};

				let tempOptions = {};
				angular.extend(tempOptions, defaultOptions, customOptions);

				platformModalService.showDialog(tempOptions).then(function (result) {
					defer.resolve(result);
				});

				function createDataService() {
					let serviceOption = {
						module: angular.module('estimate.main'),
						serviceName: 'estimateMainSearchAssembliesDialogService',
						entitySelection: {},
						presenter: {list: {}}
					};

					let container = platformDataServiceFactory.createNewComplete(serviceOption);
					let dataService = container.service;
					let data = container.data;


					dataService.setList = function (items) {
						data.itemList.length = 0;
						_.forEach(items, function (item) {
							data.itemList.push(item);
						});
						data.itemList = data.itemList.length ? _.uniqBy(data.itemList, 'Id') : [];
						data.listLoaded.fire();
					};

					return dataService;
				}
				return defer.promise;
			}

			return service;
		}
	]);
})(angular);
