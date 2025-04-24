/**
 * Created by lnt on 05.06.2020.
 */

(function (angular) {

	'use strict';

	/* globals , globals */

	var modName = 'qto.main';

	angular.module(modName).factory('qtoProjectLocationLookupDataServiceFactory',
		['$q', '$http', '$injector', 'projectLocationLookupDataService',
			'qtoMainHeaderDataService', 'qtoMainLocationDataService', 'basicsLookupSimpleDataProcessor','qtoBoqType',

			function ($q, $http, $injector, projectLocationLookupDataService, qtoMainHeaderDataService, qtoMainLocationDataService, simpleProcessor,qtoBoqType) {

				var factoryService = {};

				factoryService.qtoProjectLocationLookupDataServiceFactory = function (boqType) {
					// isPrjBoq, isPrcBoq
					let prjLocations = {};

					function getProjectFk(){
						let projectFk;
						if (boqType === qtoBoqType.QtoBoq) {
							projectFk = qtoMainHeaderDataService.getSelected().ProjectFk || -1;
						} else if (boqType === qtoBoqType.PrjBoq) {
							projectFk = $injector.get('boqMainQtoDetailService').getSelectedProjectId();
						} else if (boqType === qtoBoqType.PrcBoq) {
							projectFk = $injector.get('procurementPackageQtoDetailService').getSelectedProjectId();
						} else if (boqType === qtoBoqType.BillingBoq) {
							let salesBillingService = $injector.get('salesBillingService');
							if (salesBillingService.getSelected()) {
								projectFk = salesBillingService.getSelected().ProjectFk;
							}
						} else if (boqType === qtoBoqType.PesBoq) {
							let procurementPesHeaderService = $injector.get('procurementPesHeaderService');
							if (procurementPesHeaderService.getSelected()) {
								projectFk = procurementPesHeaderService.getSelected().ProjectFk;
							}
						} else if (boqType === qtoBoqType.WipBoq) {

							let salesWipService = $injector.get('salesWipService');
							if (salesWipService.getSelected()) {
								projectFk = salesWipService.getSelected().ProjectFk;
							}
						}

						return projectFk;
					}


					function sortListItem(list) {
						return simpleProcessor.getSortProcessor()(list);
					}

					// the Data Refresh
					projectLocationLookupDataService.resetCache = function resetCache() {
						let defer = $q.defer();
						getPrjLocations().then(function (data) {
							defer.resolve(data);
						});

						return defer.promise;
					};

					function getPrjLocations() {
						let projectFk = getProjectFk();
						return $http.get(globals.webApiBaseUrl + 'project/location/tree?projectId=' + projectFk).then(function (response) {
							prjLocations['locations' + projectFk] = response.data;
							return response.data;
						});
					}

					/**
					 * Override getLookupData
					 * @param options
					 * @returns {*}
					 */
					projectLocationLookupDataService.getLookupData = function getLookupData() {
						var defer = $q.defer();
						let projectFk = getProjectFk();
						if (prjLocations && prjLocations['locations' + projectFk]) {
							defer.resolve(prjLocations['locations' + projectFk]);
						} else {
							getPrjLocations().then(function (data) {
								angular.forEach(data, function (item) {
									item.image = '';
								});
								prjLocations['locations' + projectFk] = sortListItem(data);
								defer.resolve(prjLocations['locations' + projectFk]);
							});
						}

						return defer.promise;
					};
					return projectLocationLookupDataService;
				};

				return factoryService;
			}
		]);
})(angular);