/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainResourceFilterService
	 * @function
	 *
	 * @description
	 * estimateMainResourceFilterService is the data service to filter resources (with or without rules).
	 */
	estimateMainModule.factory('estimateMainResourceFilterService', [
		'platformDataServiceFactory',
		'estimateTotalCalculateService',
		'estimateMainResourceService',
		'estimateMainService',
		function (platformDataServiceFactory,
			estimateTotalCalculateService,
			estimateMainResourceService,
			estimateMainService

		) {

			let requestData = {},
				titles = {
					'allResources': 'estimate.main.showAllResources',
					'resWithRule': 'estimate.main.showResourcesWithRule',
					'resWithoutRule': 'estimate.main.showResourcesWithoutRule',
					'resWithoutDisable': 'estimate.main.showResourcesWithoutDisable'
				},
				lastSelectedFilterKey = null;

			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainResourceFilterService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/resource/',
						endRead: 'filteredresources',
						initReadData: function initReadData(readData) {
							angular.extend(readData, requestData);
						},
						usePostForRead: true
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					actions: {}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(options),
				service = serviceContainer.service;

			function incorporateDataRead(readData) {
				let list = readData && readData.length ? readData : [];
				estimateMainResourceService.updateList(list);
			}

			function activateIcon(scope, resFilterKey){
				setActiveIcon(scope, resFilterKey);
			}

			function loadData(filter) {
				let selectedItem = estimateMainService.getSelected();
				if(!selectedItem){
					return;
				}
				requestData.estHeaderFk = selectedItem.EstHeaderFk;
				requestData.estLineItemFk = selectedItem.Id;
				requestData.projectId = estimateMainService.getSelectedProjectId();
				requestData.filter = filter;
				lastSelectedFilterKey = filter;
				service.load();
			}

			// set the active resource icon
			function setActiveIcon(scope, resKey) {
				if(!_.includes(_.keys(titles), resKey)) {
					resKey = _.head(_.keys(titles));
				}
				try {
					_.find(scope.tools.items, function (i) {
						return i.filterIconsGroup === 'resourceFilterTypes';
					}).list.activeValue = resKey;
					lastSelectedFilterKey = resKey;
					scope.tools.update();
				} catch (e) {
					return;
				}
			}

			function initFilterTools() {
				let tools = [
					{
						filterIconsGroup: 'resourceFilterTypes',
						type: 'sublist',
						id:'resourceFilterTypes',
						list: {
							cssClass: 'radio-group',
							showTitles: true,
							items: [
								{
									id: 'all_resources',
									caption: 'estimate.main.showAllResources',
									type: 'radio',
									value: 'allResources',
									iconClass: 'tlb-icons ico-res-show-all',
									fn: function () {
										loadData('allResources');
									},
									disabled: function () {
										return false;
									}
								},
								{
									id: 'with_rule',
									caption: 'estimate.main.showResourcesWithRule',
									type: 'radio',
									value: 'resWithRule',
									iconClass: 'tlb-icons ico-res-show-rules',
									fn: function () {
										loadData('resWithRule');
									},
									disabled: function () {
										return false;
									}
								},
								{
									id: 'without_rules',
									caption: 'estimate.main.showResourcesWithoutRule',
									type: 'radio',
									value: 'resWithoutRule',
									iconClass: 'tlb-icons ico-res-show-norules',
									fn: function () {
										loadData('resWithoutRule');
									},
									disabled: function () {
										return false;
									}
								},
								{
									id: 'without_disable',
									caption: 'estimate.main.showResourcesWithoutDisable',
									type: 'radio',
									value: 'resWithoutDisable',
									iconClass: 'tlb-icons ico-res-show-notdisabled',
									fn: function () {
										loadData('resWithoutDisable');
									},
									disabled: function () {
										return false;
									}
								}
							]
						}
					}

				];
				return tools;
			}

			function getLastSelectedFilterKey(){
				return lastSelectedFilterKey;
			}

			function setLastSelectedFilterKey(key){
				lastSelectedFilterKey = key;
			}

			return angular.extend(service, {
				loadData: loadData,
				initFilterTools: initFilterTools,
				activateIcon : activateIcon,
				getLastSelectedFilterKey: getLastSelectedFilterKey,
				setLastSelectedFilterKey: setLastSelectedFilterKey
			});
		}]);
})();
