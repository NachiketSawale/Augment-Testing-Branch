/* global */
(function () {
	'use strict';

	angular.module('basics.common').service('basicsCommonMapSnapshotService', ['$http', '$q', '$translate', 'logisticJobAddressBlobService', 'logisticJobDataService', 'PlatformMessenger',
		function ($http, $q, $translate, logisticJobAddressBlobService, logisticJobDataService, PlatformMessenger) {
			let service = {};
			let mapSnapshotTools = {};
			let isMultiSnapshot = false;
			let mapSnapshotReady  = new PlatformMessenger();
			/** @name setMapSnapshotTools
			 * @description Adds the snapshot tools to the map container
			 *
			 * @param multiSpanshots Indicates if the tool should be a dropdown for multiple items or for a single item without dropdown
			 * @param scope Scope of the map container
			 */
			service.setMapSnapshotTools = (scope, multiSpanshots) => {
				isMultiSnapshot = !!multiSpanshots;
				mapSnapshotTools = isMultiSnapshot ? getMultiSnaphotTools() : getSingleSnapshotTools();
				scope.setTools(mapSnapshotTools);
				scope.$on('finishMapSnapshot', function (data, result) {
					getBlobFromURL(result.url).then(blob => {
						if(_.isEqual(blob.type, 'image/jpeg') || _.isEqual(blob.type,'image/png')){
							setSelectedJob(result.jobId).then(jobEntity => {
								logisticJobAddressBlobService.config.standAlone = true;
								logisticJobAddressBlobService.importFile(blob).then(()=> {
									logisticJobDataService.setSelected([]);
									mapSnapshotReady.fire();
								});

							});
						} else {
							window.alert($translate.instant('basics.common.mapSnapshot.Error_InvalidMapSnapshot'));
						}
					});
				});
			};

			service.registerMapSnapshotReady  = function registerMapSnapshotReady (handler) {
				mapSnapshotReady.register(handler);
			};

			service.unregisterMapSnapshotReady = function unregisterMapSnapshotReady(handler) {
				mapSnapshotReady.unregister(handler);
			};
			/**
			 * @name setSelectedJob
			 * @description Sets the a logistic job with given id as a selected entity in logistic job data service
			 *
			 * @param {int} jobId
			 * @returns
			 */
			function setSelectedJob(jobId) {
				return $http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + jobId).then(function (jobResult) {
					return logisticJobDataService.setSelected([]).then(function () {
						return logisticJobDataService.setSelected(jobResult.data);
					});
				});
			}

			/**
			 * @name updateSnapshotItemList
			 * @description Update dynamically the list of items of the snapshot tools
			 *
			 * @param itemList List of items to be added to the list
			 * @param {string} paramNames.Code Name of parameter of code in item object
			 * @param {string} paramNames.LgmJobId Name of parameter of logistic job id in item object
			 * @param scope Scope of the map container
			 */
			service.updateSnapshotItemList = (itemList, paramNames, scope) => {
				let mapSnapshotTemp = mapSnapshotTools.items.filter(i => i.id === 'mapSnapshot')[0];
				itemList = itemList || [];

				if(!isMultiSnapshot){
					let item = itemList[0];
					mapSnapshotTemp.fn = function() {
						scope.$broadcast('mapSnapshot', item[paramNames.LgmJobId]);
					};
				} else {
					mapSnapshotTemp.list.items = [];
					itemList.forEach((item) => {
						mapSnapshotTemp.list.items.push({
							id: item[paramNames.LgmJobId],
							type: 'item',
							caption: item[paramNames.Code],
							fn: function(idString, item){
								scope.$broadcast('mapSnapshot', item.id);
							}
						});
					});
				}
			};

			/**
			 * @description Async func getting the blob files from the given URL
			 *
			 * @param {string} url
			 * @returns {promise|Object}
			 */
			function getBlobFromURL(url) {
				const defer = $q.defer();
				const webService = new XMLHttpRequest();
				webService.open('GET', url, true);
				webService.responseType = 'blob';
				webService.onload = function () {
					defer.resolve(webService.response);
				};
				webService.send();
				return defer.promise;
			}

			/**
			 * @description Gets the config object of a tool with dropdown for the list of items
			 *
			 * @returns {Object}
			 */
			function getMultiSnaphotTools(){
				return  {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'mapSnapshot',
							caption: 'basics.common.mapSnapshot.mapSnapshotToolName',
							type: 'dropdown-btn',
							iconClass: 'control-icons ico-camera',
							list: {
								showImages: false,
								cssClass: 'dropdown-menu-right',
								items: [
								],
								disabled: function () {
									return false;
								}
							}
						}
					]
				};
			}


			/**
			 * @description Gets the config object of a tool for a single item
			 *
			 * @returns {Object}
			 */
			function getSingleSnapshotTools(){
				return {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'mapSnapshot',
							caption: 'basics.common.mapSnapshot.mapSnapshotToolName',
							type: 'item',
							iconClass: 'control-icons ico-camera'
						}
					]
				};
			}

			return service;
		}
	]);

})(angular);