/**
 * Created by wri on 9/20/2017.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerSynContactsWizardMainService',
		['platformModalService', '$http', '$q', 'cloudDesktopSidebarService', 'platformRuntimeDataService', 'platformGridAPI',
			function (platformModalService, $http, $q, cloudDesktopSidebarService, platformRuntimeDataService, platformGridAPI) {

				// http service
				var httpService = {};
				var urlFindBP = globals.webApiBaseUrl + 'businesspartner/main/exchange/businesspartnerlist';
				var urlFindContact = globals.webApiBaseUrl + 'businesspartner/main/exchange/contactlist';
				var urlFindAllBpAndContacts = globals.webApiBaseUrl + 'businesspartner/main/exchange/allBpAndContacts';

				httpService.findBusinessPartners = function () {
					return $http.post(urlFindBP,
						angular.extend({filter: ''}, cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(null))
					);
				};

				httpService.findContacts = function (val) {
					return $http.post(urlFindContact,
						angular.extend({filter: ''}, {Value: val})
					);
				};

				httpService.findAllBpAndContacts = function (val) {
					return $http.post(urlFindAllBpAndContacts,
						angular.extend({filter: ''}, {Value: val})
					);
				};

				// data service
				var service = {};

				service.findBusinessPartners = function () {
					var defer = $q.defer();
					httpService.findBusinessPartners()
						.then(function (response) {
							defer.resolve(response.data.Main);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				service.findContacts = function (val) {
					var defer = $q.defer();
					httpService.findContacts(val)
						.then(function (response) {
							defer.resolve(response.data.Main);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				service.findAllBpAndContacts = function (val) {
					var defer = $q.defer();
					httpService.findAllBpAndContacts(val)
						.then(function (response) {
							defer.resolve(response.data);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				service.setUserAndGlobalReadonly = function (data) {
					var fields = [{field: 'IsToExchangeUser', readonly: true}, {field: 'IsToExchangeGlobal', readonly: true}];

					angular.forEach(data, function (item) {
						platformRuntimeDataService.readonly(item, fields);
					});
				};

				service.setContactCheck = function (mappingItems, selBp, contacts) {
					var mapContacts = mappingItems.get(selBp.Id);
					angular.forEach(contacts, function (item) {
						var mapContact = _.filter(mapContacts, {Id: item.Id});
						if (mapContact.length > 0) {
							item.IsCheck = mapContact[0].IsCheck;
						}
					});
				};

				service.checkIndeterminateness = function (columnDef, grid, useTimeout) {
					var headers = grid.getColumnHeaders();
					var ele = headers.find('#chkbox_' + grid.getUID() + '_' + columnDef.id);

					if (ele.length) {
						var data = grid.getData().getItems();
						var hasTrueValue = false;
						var hasFalseValue = false;

						if (data.length) {
							hasTrueValue = _.findIndex(data, _.set({}, columnDef.field, true)) !== -1;
							hasFalseValue = _.findIndex(data, _.set({}, columnDef.field, false)) !== -1;
						}

						ele.prop('disabled', !data.length);
						ele.prop('indeterminate', hasTrueValue && hasFalseValue);
						ele.prop('checked', hasTrueValue && !hasFalseValue);

						if (useTimeout) {
							setTimeout(function () {
								service.checkIndeterminateness(columnDef);
							}, 1000);
						}
					}
				};

				service.getContactGrid = function () {
					return platformGridAPI.grids.element('id', '043BBC1DCC9540F4B005EBCC7E72B5DA').instance;
				};

				service.remove = function (val, arr) {
					var index = indexOf(val, arr);
					if (isNaN(index) || index > arr.length) {
						return false;
					}
					for (var i = 0, n = 0; i < arr.length; i++) {
						if (arr[i] !== arr[index]) {
							arr[n++] = arr[i];
						}
					}
					arr.length -= 1;
				};

				service.contains = function (val, arr) {
					var i = arr.length;
					while (i--) {
						if (arr[i].Id === val.Id) {
							return true;
						}
					}
					return false;
				};

				function indexOf(val, arr) {
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].Id === val.Id) {
							return i;
						}
					}
					return -1;
				}

				return service;
			}]);

	angular.module(moduleName).factory('businessPartnerSynContactsCtListService',
		['platformModalService', '$http', '$q', 'PlatformMessenger',
			function (platformModalService, $http, $q, PlatformMessenger) {
				var service = {};
				// slick.grid2 code begin
				var currentItem;
				service.getSelected = function () {
					var qDefer = $q.defer();
					qDefer.reject(currentItem);
					return qDefer.promise;
				};

				service.getSelectedItem = function () {
					var state = service.getSelected();
					if (state.$$state) {
						if (state.$$state.value) {
							return state.$$state.value;
						}
					}
				};

				service.setSelected = function (item) {
					var qDefer = $q.defer();
					currentItem = item;

					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				var dataList = [];

				service.setDataList = function (value) {
					dataList = value;
				};

				service.getList = function () {
					return dataList;
				};
				service.refreshGrid = function () {
					service.getList();
					service.listLoaded.fire();
				};

				service.listLoaded = new PlatformMessenger();

				service.registerListLoaded = function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				};
				service.unregisterListLoaded = function (callBackFn) {
					service.listLoaded.unregister(callBackFn);
				};
				service.unregisterSelectionChanged = function () {

				};
				// slick.grid2 code end

				return service;
			}]);

	angular.module(moduleName).factory('businessPartnerSynContactsBPListService',
		['platformModalService', '$http', '$q', 'PlatformMessenger',
			function (platformModalService, $http, $q, PlatformMessenger) {

				var service = {};

				// slick.grid2 code begin
				var currentItem;
				service.getSelected = function () {
					var qDefer = $q.defer();
					qDefer.reject(currentItem);
					return qDefer.promise;
				};

				service.getSelectedItem = function () {
					var state = service.getSelected();
					if (state.$$state) {
						if (state.$$state.value) {
							return state.$$state.value;
						}
					}
				};

				service.setSelected = function (item) {
					var qDefer = $q.defer();
					currentItem = item;
					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				var dataList = [];

				service.setDataList = function (value) {
					dataList = value;
				};

				service.getList = function () {
					return dataList;
				};
				service.refreshGrid = function () {
					service.getList();
					service.listLoaded.fire();
				};

				service.listLoaded = new PlatformMessenger();

				service.registerListLoaded = function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				};
				service.unregisterListLoaded = function (callBackFn) {
					service.listLoaded.unregister(callBackFn);
				};

				service.unregisterSelectionChanged = function () {

				};

				service.setSelectedEntities = function () {
				};

				return service;
			}]);

})(angular);
