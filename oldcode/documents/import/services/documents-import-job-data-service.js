/**
 * Created by chk on 2/28/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.import';

	angular.module(moduleName).factory('documentImportJobDataService', ['_','globals','$q', '$filter', '$timeout', '$http', 'PlatformMessenger',
		'platformDataServiceFactory', 'documentsImportWizardImportService',
		function (_,globals,$q, $filter, $timeout, $http, PlatformMessenger, platformDataServiceFactory,
			documentsImportWizardImportService) {

			var service = {Items: []},
				option = {
					module: angular.module(moduleName),
					entitySelection: {}
				};

			var container = platformDataServiceFactory.createNewComplete(option);
			service = container.service;
			service.initServiceItems = function () {
				loadDataFromDb().then(function (response) {
					if (response && response.data && response.data.length > 0) {
						$timeout(function () {
							service.refreshData.fire(response.data);
						}, 300);
					}
				});
			};

			angular.extend(service, {
				getList: getList
			});

			function getList() {
				return service.Items;
			}

			service.refreshProgress = function () {
				var deferred = $q.defer();
				if (service.Items && service.Items.length > 0) {
					var sourceStates = [0, 1, 2];

					var res = _.filter(service.Items, function (item) {
						return _.findIndex(sourceStates, function (state) {
							return state === item.JobState;
						}) !== -1;
					});
					var needLazyLoadData = _.filter(service.Items, function (item) {
						return _.findIndex(sourceStates, function (state) {
							return state !== item.JobState && item.ProgressValue === 0;
						}) !== -1;
					});

					if (res && res.length) {
						loadDataFromDb().then(function (response) {
							if (response && response.data && response.data.length > 0) {
								container.data.selectedItem = null;
								service.refreshData.fire(response.data);
							}
							resolveDeferred();
						});
					} else {
						if (needLazyLoadData && needLazyLoadData.length) {
							// consider lazy modify
							_.forEach(needLazyLoadData, function (item) {
								item.ProgressValue = 100;
							});
							container.data.selectedItem = null;
							service.refreshData.fire(service.Items, true);

						}
						resolveDeferred();
					}
				} else {
					resolveDeferred();
				}

				function resolveDeferred() {
					$timeout(function () {
						deferred.resolve();
					}, 2000);
				}

				return deferred.promise;
			};

			function loadDataFromDb() {
				return $http.get(globals.webApiBaseUrl + 'documents/documentsimport/getimportjobs');
			}

			service.documentImport = function () {
				documentsImportWizardImportService.execute();
			};

			service.deleteOutUselessTask = function (jobIds) {
				if (jobIds && jobIds.length) {
					$http.post(globals.webApiBaseUrl + 'documents/documentsimport/deletetask', {JobIds: jobIds}).then(function () {
					});
					service.Items = _.filter(service.Items, function (item) {
						return !_.includes(jobIds, item.Id);
					});
				}
				service.selectedChanged.fire(service.Items.length > 0 ? service.Items[0] : null);
			};

			service.refreshData = new PlatformMessenger();
			service.selectedChanged = new PlatformMessenger();

			function importTaskCreateComplete(data) {
				service.refreshData.fire(data);
			}

			documentsImportWizardImportService.importTaskCreateComplete.register(importTaskCreateComplete);
			service.registerSelectionChanged(
				function () {
					service.selectedChanged.fire(service.getSelected());
				}
			);

			service.clearItems = function () {
				service.Items = [];
			};

			return service;

		}
	]);
})(angular);