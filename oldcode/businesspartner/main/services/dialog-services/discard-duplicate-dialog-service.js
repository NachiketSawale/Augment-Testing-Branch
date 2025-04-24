/**
 * Created by chi on 11/23/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainDiscardDuplicateDialogService',
		['$q', 'platformModalService', 'businesspartnerMainDiscardDuplicateDialogLayout', 'platformDataServiceFactory',
			function ($q, platformModalService, businesspartnerMainDiscardDuplicateDialogLayout, platformDataServiceFactory) {
				var service = {};

				service.executionType = {
					'discardAndDisplay': 1,
					'ignore': 2
				};

				service.showDialog = showDialog;

				return service;

				// /////////////////////////
				function showDialog(gridData, model, currentItem, customOptions) {
					var defer = $q.defer();

					var invalidModel = model;
					var defaultOptions = {
						templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/discard-duplicate-dialog.html',
						UUID: '5137DCEC39EF49C1AC0342E4DA3016BF',
						backdrop: false,
						width: '850px',
						gridLayout: businesspartnerMainDiscardDuplicateDialogLayout,
						dataService: createService(),
						getInvalidModel: getInvalidModel,
						getCurrentItem: getCurrentItem,
						executionType: service.executionType,
						showPage: false
					};

					let modalOptions = customOptions ? angular.extend({}, defaultOptions, customOptions) : defaultOptions;
					platformModalService.showDialog(modalOptions).then(function (result) {
						defer.resolve(result);
					});

					function createService() {
						let dataList = gridData || [];
						var serviceConfigs = {
							module: angular.module(moduleName),
							serviceName: 'businessPartnerMainDiscardDuplicateDialogService',
							entitySelection: {},
							presenter: {
								list: {}
							},
							httpRead: {
								useLocalResource: true,
								resourceFunction: function () {
									return dataList;
								},
								resourceFunctionParameters: []
							}
						};

						var containerService = platformDataServiceFactory.createNewComplete(serviceConfigs).service;

						Object.defineProperties(containerService, {
							'dataList': {
								get: function () {
									return dataList;
								},
								set: function (value) {
									dataList = value;
								}, enumerable: true
							}
						});

						if (containerService.load) {
							containerService.load();
							containerService.goToFirst();
						}

						return containerService;
					}

					function getInvalidModel() {
						return invalidModel;
					}

					function getCurrentItem() {
						return currentItem;
					}

					return defer.promise;
				}
			}
		]);
})(angular);