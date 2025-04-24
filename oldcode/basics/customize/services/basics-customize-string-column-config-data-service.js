
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStringColumnConfigDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeStringColumnConfigDataService is the data service for all entity
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.factory('basicsCustomizeStringColumnConfigDataService', ['$q', '_', 'platformDataServiceFactory',
		function ($q, _, platformDataServiceFactory ) {
			var basicsCustomizeStringColumnConfigDataServiceOption = {
				flatRootItem: {
					module: basicsCustomizeModule,
					serviceName: 'basicsCustomizeStringColumnConfigDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/customize/special/',
						endRead: 'tablescolumns'
					},
					entityRole: {
						root: {
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCustomizeStringColumnConfigDataServiceOption);
			var service = serviceContainer.service;

			// service.getModules = function getModules() {
			// 	return serviceContainer.data.itemList;
			// };


			service.getModules = function getModules() {
				var groups = _.groupBy(serviceContainer.data.itemList, function(c) {
					return c.ModuleName;
				});

				var res = [];

				_.forIn(groups, function (value) {
					res.push(value[0]);
				});

				return res;
			 };
			service.getModuleById = function getModuleById(id) {
				return _.find(serviceContainer.data.itemList, function(c) {
					return c.ModuleName === id;
				});
			};
			service.getModuleByIdAsync = function getModuleByIdAsync(id) {
				return $q.when(service.getModuleById(id));
			};
			service.getModuleLookupData = function getModuleLookupData() {
				var candidates = service.getModules();
				return $q.when(candidates);
			};


			service.getTables = function getTables() {
				var groups = _.groupBy(serviceContainer.data.itemList, function(c) {
					return c.TableName;
				});

				var res = [];

				_.forIn(groups, function (value) {
					res.push(value[0]);
				});

				return res;
			};
			service.getTableById = function getTableById(id) {
				return _.find(serviceContainer.data.itemList, function(c) {
					return c.TableName === id;
				});
			};
			service.getTableByIdAsync = function getTableByIdAsync(id) {
				return $q.when(service.getTableById(id));
			};
			service.getTableLookupData = function getTableLookupData() {
				var candidates = service.getTables();
				var filtered = _.filter(candidates, function (c) {
					return c.ModuleName === serviceContainer.data.tableFilter;
				});

				return $q.when(filtered);
			};
			service.setTableFilter = function setTableFilter(tableFilter) {
				serviceContainer.data.tableFilter = tableFilter;
			};


			service.getColumns = function getColumns() {
				var groups = _.groupBy(serviceContainer.data.itemList, function(c) {
					return c.ColumnName;
				});

				var res = [];

				_.forIn(groups, function (value) {
					res.push(value[0]);
				});

				return res;
			};
			service.getColumnById = function getColumnById(id) {
				return _.find(serviceContainer.data.itemList, function(c) {
					return c.ColumnName === id && c.TableName === serviceContainer.data.columnFilter &&
						c.ModuleName === serviceContainer.data.tableFilter;
				});
			};
			service.getColumnByIdAsync = function getColumnByIdAsync(id) {
				return $q.when(service.getColumnById(id));
			};
			service.getColumnLookupData = function getColumnLookupData() {
				var filtered = _.filter(serviceContainer.data.itemList, function (c) {
					return c.TableName === serviceContainer.data.columnFilter &&
						c.ModuleName === serviceContainer.data.tableFilter;
				});

				return $q.when(filtered);
			};
			service.setColumnFilter = function setColumnFilter(columnFilter) {
				serviceContainer.data.columnFilter = columnFilter;
			};



			return service;
		}]);
})();
