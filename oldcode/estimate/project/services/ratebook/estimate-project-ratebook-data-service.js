/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular, globals) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.project';
	let projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateProjectRateBookDataService
	 * @function
	 *
	 * @description
	 * estimateProjectRateBookDataService is the data service for all ratebook related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('estimateProjectRateBookDataService', ['$http', '$q', 'platformRuntimeDataService', 'projectMainService', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'platformDataServiceMandatoryFieldsValidatorFactory',
		'estimateProjectRateBookConfigDataService',

		function (
			$http, $q, platformRuntimeDataService, projectMainService, platformDataServiceFactory, ServiceDataProcessArraysExtension, platformDataServiceMandatoryFieldsValidatorFactory,
			estimateProjectRateBookConfigDataService) {

			let allChildItems = [], thisContentTypeId = null;

			function processItem(item){
				let fields = [
					{ field: 'Code', readonly: true },
					{ field: 'DescriptionInfo', readonly: true },
					{ field: 'IsChecked', readonly: item.IsReadOnly }
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			let rateBookServiceInfo = {
				hierarchicalLeafItem: {
					module: projectMainModule,
					serviceName: 'estimateProjectRateBookDataService',
					entityNameTranslationID: 'project.main.entityRateBook',
					httpCreate: { route: globals.webApiBaseUrl + 'project/main/ratebook/' },
					httpRead: { route: globals.webApiBaseUrl + 'project/main/ratebook/', usePostForRead: true,
						initReadData: function(readData) {
							if(thisContentTypeId){
								readData.PKey3 = thisContentTypeId;
								readData.IsInProject = estimateProjectRateBookConfigDataService.isInProject();
							}
							else {
								let contentTypeId = estimateProjectRateBookConfigDataService.getCustomizeContentTypeId();
								readData.IsInProject = estimateProjectRateBookConfigDataService.isInProject();
								if (contentTypeId) {
									readData.PKey3 = contentTypeId;
								}
								else {
									// here should get the content ID from customize config dialog as PKey2
									let contentId = estimateProjectRateBookConfigDataService.getCustomizeContentId();
									if (contentId) {
										readData.PKey2 = contentId;
									}
									else {
										let sel = projectMainService.getSelected();
										if (sel) {
											readData.PKey1 = sel.Id;
										}
									}
								}
							}
						}
					},
					presenter: {
						tree: {
							parentProp: 'RateBookParentFk', childProp: 'RateBookChildren'
						}
					},
					dataProcessor: [{ processItem: processItem }],
					translation: {
						uid: 'estimateProjectRateBookDataService',
						title: 'project.main.entityRateBook',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }]
					},
					entityRole: { leaf: { itemName: 'RateBook', parentService: projectMainService, parentFilter: 'projectId' } }
				} };

			let container = platformDataServiceFactory.createNewComplete(rateBookServiceInfo);

			let service = container.service;

			let serviceData = container.data;

			service.createItem = null;
			service.deleteItem = null;
			service.createChildItem = null;

			service.isCheckedValueChange = function (selectItem, newValue) {
				service.onItemCheckedChange(selectItem, newValue, true);
				return {apply: false, valid: true, error: ''};
			};

			service.setThisContentTypeId = function (_contentTypeId) {
				thisContentTypeId = _contentTypeId;
			};

			let getAllChildItems = function (groupItem) {
				if (groupItem) {
					allChildItems = allChildItems.concat(groupItem);
					_.forEach(groupItem, function (item) {
						if (item.RateBookChildren !== null) {
							getAllChildItems(item.RateBookChildren);
						}
					});
				}
			};

			service.onItemCheckedChange = function (selectItem, newValue) {
				allChildItems = [];
				selectItem.IsChecked = newValue;

				service.markItemAsModified(selectItem);

				getAllChildItems(selectItem.RateBookChildren);

				// if the parent checked,the all child should be changed
				_.forEach(allChildItems, function (item) {
					item.IsChecked = newValue;
					service.markItemAsModified(item);
				});

				service.fixIsChecked(serviceData.itemTree);
				service.gridRefresh();
			};

			service.onLoaded = function () {
				service.fixIsChecked(serviceData.itemTree);
				service.gridRefresh();
			};

			service.fixIsChecked = function(items) {
				items.forEach(doItemCheck);
				return items;
			};

			service.setActivated = function (isReadOnly) {
				let list = service.getTree();
				_.each(list, function (item) {
					item.IsReadOnly = isReadOnly;
					item.PrjContentFk = -1;
					if(item.IsChecked){
						service.markItemAsModified(item);
					}
					processItem(item);
					if(item.RateBookChildren){
						setChildrenActivated(item.RateBookChildren, isReadOnly);
					}
				});
				service.gridRefresh();
			};

			function setChildrenActivated(list, isReadOnly) {
				_.each(list, function (item) {
					item.IsReadOnly = isReadOnly;
					item.PrjContentFk = -1;
					if(item.IsChecked){
						service.markItemAsModified(item);
					}
					processItem(item);
					if(item.RateBookChildren){
						setChildrenActivated(item.RateBookChildren, isReadOnly);
					}
				});
			}

			function isFirstLevel(item) {
				return (item.Id === 1 || item.Id === 2 || item.Id === 3 || item.Id === 4 || item.Id === 5);
			}

			function doItemCheck(item) {
				if (item.RateBookChildren && item.RateBookChildren.length) {
					let checkedItems = [], unCheckedItems = [];

					item.RateBookChildren.forEach(function (item) {
						let isChecked = doItemCheck(item);

						if (isChecked === true) {
							checkedItems.push(item);
						}
						else if (isChecked !== 'unknown') {
							unCheckedItems.push(item);
						}
					});

					if (checkedItems.length === item.RateBookChildren.length) {
						item.IsChecked = true;
						// service.markItemAsModified(item);
					}
					else if (unCheckedItems.length === item.RateBookChildren.length) {
						item.IsChecked = false;
					}
					else {
						item.IsChecked = isFirstLevel(item)? 'unknown' : true;
						// service.markItemAsModified(item);
					}
				}
				return item.IsChecked;
			}

			service.clearData = function () {
				service.setList([]);
				service.gridRefresh();
			};

			return service;

		}]);
})(angular, globals);
