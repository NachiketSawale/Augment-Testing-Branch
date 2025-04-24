/**
 * Created by chk on 10/12/2016.
 */
(function (angular) {
	'use strict';
	/* global _ */

	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';

	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemCommonOutputDataService',
		['$injector', 'platformDataServiceFactory', 'PlatformMessenger',
			function ($injector, platformDataServiceFactory, PlatformMessenger) {

				var constructor = function constructor(option) {
					var service = {},
						parentService = $injector.get(option.serviceName),
						parentSelectedId = -1,
						dataItems = [];

					var container = platformDataServiceFactory.createNewComplete(option);

					service = container.service;

					angular.extend(service, {
						isShowError: false,
						isShowWarning: false,
						isShowInfo: false,
						isFilterByInstance: true,
						isFilterByCalculation: false,
						getList: getList,
						getFilter: getFilter,
						getFilterData: getFilterData,
						outPutResultChanged: new PlatformMessenger(),
						refreshGridData: new PlatformMessenger(),
						load: load
					});

					function load() {
						var selectedItem = parentService.getSelected();
						parentService.getScriptJobLog(selectedItem.Id).then(function (res) {
							dataItems = res.data || [];
							parentSelectedId = selectedItem.Id;
							var data = getFilterData(dataItems);
							service.refreshGridData.fire(data);
						});
					}

					function getList() {
						if (parentService.getExecutionResult) {
							return getFilterData(parentService.getExecutionResult().ErrorList);

						} else {
							if (parentService.hasSelection()) {
								var selectedItem = parentService.getSelected();
								if (parentSelectedId !== selectedItem.Id) {
									load();
								} else {
									return getFilterData(dataItems);
								}
							} else {
								return [];
							}
						}

					}

					function getFilterData(data) {
						data = data || [];

						if(angular.isFunction(option.filter)) {
							data = option.filter(data);
						}

						if (angular.isArray(data)) {
							_.forEach(data, function (item, index) {
								item.Id = index + 1;
								item.Order = item.Id;
							});

							if (service.isShowError || service.isShowWarning || service.isShowInfo) {
								data = data.filter(function (item) {
									return (service.isShowError && item.ErrorType === 1) ||
										(service.isShowWarning && item.ErrorType === 2) ||
										(service.isShowInfo && item.ErrorType === 3) ||
										item.ErrorType === 0;
								});
							}
						}

						return data;
					}

					function getFilter(prop, callback) {
						return function () {
							service[prop] = !service[prop];
							if (callback) {
								callback();
							}
							service.outPutResultChanged.fire();
						};
					}

					parentService.onScriptResultUpdated.register(function (value) {
						service.outPutResultChanged.fire(value);
					});

					return service;
				};

				var serviceCache = {};

				var getService = function getService(option) {
					var moduleName = option.module.name;

					if (!Object.prototype.hasOwnProperty.call(serviceCache,moduleName)) {
						serviceCache[moduleName] = constructor.apply(this, arguments);
					}

					return serviceCache[moduleName];
				};

				return {
					getService: getService
				};
			}
		]);

})(angular);