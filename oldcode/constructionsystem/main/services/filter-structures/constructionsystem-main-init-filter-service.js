/**
 * Created by xsi on 2016-04-01.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */
	var module = angular.module('constructionsystem.main');

	/**
	 * @ngdoc service
	 * @name constructionsystemMainInitFilterService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * a base service to init leading structure grid controller and data service.
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	module.factory('constructionsystemMainInitFilterService', [
		'$injector', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'constructionSystemMainFilterService',
		'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateParameterFormatterService',
		function ($injector, platformDataServiceFactory, ServiceDataProcessArraysExtension, constructionSystemMainFilterService,
			platformGridControllerService, estimateMainCommonUIService, estimateMainService, estimateParameterFormatterService) {
			var currentSelectedEstimateHeaderId;
			return {
				initDataService: initDataService,
				initController: initController,
				setEstHeaderId: setEstHeaderId
			};

			function setEstHeaderId(estHeaderId, projectId) {
				if (currentSelectedEstimateHeaderId !== estHeaderId) {
					currentSelectedEstimateHeaderId = estHeaderId;
					estimateParameterFormatterService.setSelectedEstHeaderNProject(estHeaderId, projectId);
				}
			}

			function initDataService(options, updateOptions) {
				var serviceOption = {
					hierarchicalRootItem: {
						module: module,
						serviceName: options.serviceName,
						httpRead: options.httpRead,
						httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/'},
						dataProcessor: [new ServiceDataProcessArraysExtension([options.treePresOpt.childProp || 'ChildItems'])],
						presenter: {tree: options.treePresOpt},
						entityRole: {
							root: {
								itemName: options.itemName,
								lastObjectModuleName: module,
								rootForModule: module,
								handleUpdateDone: function (updateData, response) {
									estimateMainService.updateList(updateData, response);
								}
							}
						},
						actions: {} // no create/delete actions
					}
				};

				if (angular.isFunction(updateOptions)) {
					updateOptions(serviceOption);
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				serviceContainer.data.provideUpdateData = function (updateData) {
					updateData.EstHeaderId = currentSelectedEstimateHeaderId;
					return estimateMainService.getUpdateData(updateData, updateData.EstHeaderId);
				};

				// disable display information of the selected root item to the header bar.
				service.setShowHeaderAfterSelectionChanged(null);

				constructionSystemMainFilterService.addMarkersChanged(service, options.treePresOpt, options.toolBar);

				return service;
			}

			function initController(scope, dataService, fields, clipboardService) {
				var uiService = estimateMainCommonUIService.createUiService(fields, {
					serviceName: dataService.getServiceName(),
					itemName: dataService.getItemName()
				});
				var updateTools = function () {
					scope.tools.update();  // force to call disabled fn of toolbar buttons
				};
				var config = dataService.getGridConfig();
				if (clipboardService) {
					config.dragDropService = clipboardService.dragDropService;
					config.type = clipboardService.type;
				}
				platformGridControllerService.initListController(scope, uiService, dataService, null, config);

				var removeItems = ['create', 'delete', 'createChild'];
				scope.tools.items = _.filter(scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});

				constructionSystemMainFilterService.onFilterButtonRemoved.register(updateTools);
				scope.$on('$destroy', function () {
					constructionSystemMainFilterService.onFilterButtonRemoved.unregister(updateTools);
				});
			}
		}
	]);
})(angular);