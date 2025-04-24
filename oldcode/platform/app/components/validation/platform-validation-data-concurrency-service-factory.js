(function (angular) {
	/* globals moment */
	'use strict';
	let moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name PlatformValidationDataConcurrencyService
	 * @function
	 *
	 * @description
	 * This service provides validation weather loaded visible list data is up-to-date according to DB
	 **/
	angular.module(moduleName).factory('platformValidationDataConcurrencyService', PlatformValidationDataConcurrencyService);

	PlatformValidationDataConcurrencyService.$inject = ['_', 'platformGridAPI', '$http', 'platformErrorHttpInterceptor', '$q', 'platformDialogService', 'platformDataServiceModificationTrackingExtension'];

	function PlatformValidationDataConcurrencyService(_, platformGridAPI, $http, platformErrorHttpInterceptor, $q, platformDialogService, platformDataServiceModificationTrackingExtension) {
		return function (dataService, scope, checkChangesURL, onDbChangedUpdateFunction) {
			let service = this;

			let dbChangesCheckActive = false; // activate check for changes in DB
			let dbChangesCheckRequestRunning = false;
			let activeUpdateOfChildServices = true;
			let doShowConcurrencyErrorDialog = true;
			let checkOnlyItemsInList = false;
			let itemsToCheck = [];

			let timeoutSpan = 2000;

			// #region check for changes in db

			service.checkForChanges = () => {
				if (dbChangesCheckActive && !dbChangesCheckRequestRunning && (!checkOnlyItemsInList || itemsToCheck.length > 0)) {
					const dataToCheck = getItemsToCheckRequestObject(scope, dataService);
					dbChangesCheckRequestRunning = true;
					checkForChangesInDB(dataToCheck).finally(() => {
						if ((!checkOnlyItemsInList || itemsToCheck.length > 0)) {
							setTimeout(service.checkForChanges, timeoutSpan);
						}
						dbChangesCheckRequestRunning = false;
					});
				}
			};

			// #endregion

			service.activateDbChangesCheck = () => {
				dbChangesCheckActive = true;
				platformErrorHttpInterceptor.onHttpError.register(showConcurrencyErrorDialog);
			};

			service.deactivateDbChangesCheck = () => {
				dbChangesCheckActive = false;
				platformErrorHttpInterceptor.onHttpError.unregister(showConcurrencyErrorDialog);
			};

			service.setCheckInterval = (value) => {
				if (_.isInteger(value) && value > 0) {
					timeoutSpan = value;
				}
			};

			service.setCheckForChildServices = (value) => {
				activeUpdateOfChildServices = !!value;
			}

			service.setDoShowConcurrencyErrorDialog = (value) => {
				doShowConcurrencyErrorDialog = !!value;
			}

			service.setCheckOnlyItemsInList = (value, list) => {
				checkOnlyItemsInList = !!value;
				if (list && list.length > 0) {
					itemsToCheck = list;
				}
			}

			function getItemsToCheckRequestObject() {
				let dataToCheck = {};
				dataToCheck[dataService.getItemName()] = {};

				let listOfItems = [];

				if (checkOnlyItemsInList) {
					listOfItems = itemsToCheck;
				} else if (scope && scope.gridId) {
					let gridElem = platformGridAPI.grids.element('id', scope.gridId); // check only visible data -> better performance
					let gridInstance = gridElem.instance;

					if (gridInstance && gridInstance.getRenderedRowIds) {
						listOfItems = gridInstance.getRenderedRowIds().filter(id => gridElem.dataView.getItemByIdx(id));
					}
				}

				listOfItems.forEach(item => {
						let itemId = item.Id;
						dataToCheck[dataService.getItemName()][itemId] = dataService.getList().find(entity => entity.Id === itemId).Version;
					});
					if (activeUpdateOfChildServices) {
						dataService.getChildServices().forEach(childService => {
							if (childService.getItemName() && childService.getList().length > 0) {
								dataToCheck[childService.getItemName()] = {};
								childService.getList().forEach(subentity => {
									dataToCheck[childService.getItemName()][subentity.Id] = subentity.Version;
								});
							}
						});
					}

				return dataToCheck;
			}

			function checkForChangesInDB(dataToCheckObject) {
				return $http.post(globals.webApiBaseUrl + checkChangesURL, dataToCheckObject).then((response) => {
					let reloadChildren = false;
					let promises = [];
					for (let dataForItemType in response.data) {
						if (response.data[dataForItemType] > 0) {
							if (dataService.getItemName() === dataForItemType) {
								const selectedEntity = _.cloneDeep(dataService.getSelected());
								let itemsToRefresh = dataService.getList().filter(entity => response.data[dataForItemType].includes(entity.Id));
								promises.push(dataService.refreshEntities(itemsToRefresh, reloadChildren).then(loaded => {
									dataService.getList().filter(x => response.data[dataForItemType].includes(x.Id)).forEach(item => {
										if (doShowConcurrencyErrorDialog) {
											const diffKeys = findDifferences(selectedEntity, item);
											if(selectedEntity && selectedEntity.Id === item.Id && diffKeys.length > 0) {
												// show dialog
												showConcurrencyErrorDialog(null, {
													oldVersion: selectedEntity,
													newVersion: item,
													diffKeys: diffKeys
												}).then(function (result) {
													if (result.ok) {
														onDbChangedUpdateFunction(item);
													}
												});
											} else {
												onDbChangedUpdateFunction(item);
											}
										} else {
											onDbChangedUpdateFunction(item);
										}
									});
								}));
							} else if (activeUpdateOfChildServices) {
								dataService.getChildServices().forEach(childService => {
									if (childService.getItemName() === dataForItemType) {
										let itemsToRefresh = childService.getList().filter(entity => response.data[dataForItemType].includes(entity.Id));
										const selectedEntity = _.cloneDeep(dataService.getSelected());
										promises.push(childService.load().then(loaded => {
											childService.getList().filter(x => response.data[dataForItemType].includes(x.Id)).forEach(item => {
												onDbChangedUpdateFunction(item);
											});
										}));
									}
								});
							}
						}
					}
					return $q.all(promises);
				});
			}

			function showConcurrencyErrorDialog(e, data) {
				if (e) { // if function triggered by event onHttpError
					if (data.data && data.data.ErrorCode === 33554434) { // concurrency error
						window.alert('Check Changes - concurrency error!');
						return true;
					}
				} else if (data.oldVersion && data.newVersion) {
					let customOptions = {
						windowClass: 'error-dialog',
						width: '700px',
						resizeable: true,
						headerText$tr$: 'cloud.common.errorDialogTitle',
						bodyText: 'My modal dialog',
						iconClass: 'ico-error',
						dataItem: {
							newVersion: data.newVersion,
							oldVersion: data.oldVersion
						}
					};

					return platformDialogService.showInputDialog(customOptions);
				}
				return false;
			}

			function findDifferences(original, toCompare) {
				let diffArray = [];
				const propertiesToSkip = ['Version', 'UpdatedBy', 'UpdatedAt', 'InsertedBy', 'InsertedAt', '__rt$data'];
				for (let key in original) {
					if(!propertiesToSkip.includes(key) && !_.isArray(original[key]) && !_.isFunction(original[key])) {
						if (_.isObject(original[key]) && !moment.isMoment(original[key])) {
							diffArray.push(...findDifferences(original[key], toCompare[key]));
						} else if(moment.isMoment(original[key]) && moment(original[key]) !== moment(toCompare[key])) {
							diffArray.push(key);
						} else if(original[key] !== toCompare[key]) {
							diffArray.push(key);
						}
					}
				}
				return diffArray;
			}

			return service;
		};
	}
})(angular);