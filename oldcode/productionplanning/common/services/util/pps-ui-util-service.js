/**
 * Created by zov on 23/04/2019.
 */
(function () {
	/* global angular, _ */
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsUIUtilService', ['$injector', '$translate',
		'transportplanningTransportUtilService',
		function ($injector, $translate,
			transportplanningTransportUtilService) {

			function getService(service) {
				return _.isString(service) ? $injector.get(service) : service;
			}

			function extendUIService(currentService, additionalUIConfigs) {
				currentService = getService(currentService);
				var layout = _.cloneDeep(currentService.getStandardConfigForListView());
				if (!_.isEmpty(additionalUIConfigs.deleteColumns)) {
					_.remove(layout.columns, function (column) {
						return _.indexOf(additionalUIConfigs.deleteColumns, column.id) > -1;
					});
				}
				if (!_.isEmpty(additionalUIConfigs.readonlyColumns)) {
					_.forEach(layout.columns, function (column) {
						if (!_.includes(additionalUIConfigs.editableColumns, column.id)) {
							column.editor = null;
						}
					});
				}
				_.forEach(additionalUIConfigs.combineUIConfigs, function (config) {
					var gridLayout = getService(config.UIService).getStandardConfigForListView();
					_.forEach(gridLayout.columns, function (column) {
						var map = _.find(config.columns, {id: column.id});
						if (map && !_.find(layout.columns, {id: column.id})) {
							var cloned = _.cloneDeep(column);
							_.extend(cloned, map.overload.grid);
							layout.columns.push(cloned);
						}
					});
				});

				if (!_.isEmpty(additionalUIConfigs.addColumns)) {
					_.forEach(additionalUIConfigs.addColumns, function (column) {
						layout.columns.push(column);
					});
				}

				currentService.getStandardConfigForListView = function () {
					return layout;
				};

				var layout1 = _.cloneDeep(currentService.getStandardConfigForDetailView());
				if (!_.isEmpty(additionalUIConfigs.deleteColumns)) {
					_.remove(layout1.rows, function (row) {
						return _.indexOf(additionalUIConfigs.deleteColumns, row.rid) > -1;
					});
				}
				if (!_.isEmpty(additionalUIConfigs.readonlyColumns)) {
					_.forEach(layout1.rows, function (row) {
						if (!_.includes(additionalUIConfigs.editableColumns, row.id)) {
							row.readonly = true;
						}
					});
				}
				_.forEach(additionalUIConfigs.combineUIConfigs, function (config) {
					var gridLayout = getService(config.UIService).getStandardConfigForDetailView();
					_.forEach(gridLayout.rows, function (row) {
						var map = _.find(config.columns, {id: row.rid});
						if (map && !_.find(layout1.rows, {rid: row.rid})) {
							var cloned = _.cloneDeep(row);
							_.extend(cloned, map.overload.detail);
							layout1.rows.push(cloned);
						}
					});
				});

				currentService.getStandardConfigForDetailView = function () {
					return layout1;
				};

				return currentService;
			}

			function getIcon(iconUrl, titleStr) {
				return '<i class="pane-r block-image ' + iconUrl + (titleStr ? '" title="' + translate(titleStr) : '') + '"></i>';
			}

			function translate(str) {
				return $translate.instant(str);
			}

			function reloadServiceByName(parentService, serviceName, id) {
				var childServices = parentService.getChildServices();
				_.find(childServices, function (childService) {
					if (childService.getServiceName().endsWith(serviceName)) {
						reloadService(childService);
					} else {
						reloadService(childService, serviceName, id);
					}
				});
			}

			function reloadService(service, id) {
				if (service) {
					service.clearCache();
					service.unloadSubEntities();
					if (id && transportplanningTransportUtilService.hasShowContainerInFront(id)) {
						service.load();
					}
				}
			}

			function supportPage($scope, dataView) {
				if (!dataView) {
					return;
				}

				var page = dataView.dataPage;

				$scope.pageUp = function () {
					if (page.number <= 0) {
						return;
					}
					page.number--;
					$scope.search($scope.searchValue || $scope.searchString, true);
				};

				$scope.canPageUp = function () {
					return page.number > 0;
				};

				$scope.getPageText = function () {
					var startIndex = page.number * page.size,
						endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));
					if ($scope.searchValueModified === undefined) {
						if (page.totalLength > 0) {
							return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
						}
						return '';
					}
					if ($scope.isLoading) {
						return $translate.instant('cloud.common.searchRunning');
					}
					if (page.currentLength === 0) {
						return $translate.instant('cloud.common.noSearchResult');
					}
					return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
				};

				$scope.pageDown = function () {
					if (page.count <= page.number) {
						return;
					}
					page.number++;
					$scope.search($scope.searchValue || $scope.searchString, true);
				};

				$scope.canPageDown = function () {
					return page.count > (page.number + 1);
				};

				$scope.enabledPaging = function () {
					return page.enabled;
				};
			}

			return {
				extendUIService: extendUIService,
				getIcon: getIcon,
				translate: translate,
				reloadServiceByName: reloadServiceByName,
				reloadService: reloadService,
				supportPage: supportPage
			};
		}
	]);
})();
