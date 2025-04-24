(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).factory('languageLookupDataService',
		['$http', '$q', '_',
			function ($http, $q, _) {
				var service = {};

				var lookupData = {
					languageDataList: []
				};
				service.loadAsync = function loadAsync() {
					if (!lookupData.LanguageListAsyncPromise) {
						lookupData.LanguageListAsyncPromise = getLanguageDataList();
					}
					return lookupData.LanguageListAsyncPromise.then(function (data) {
						lookupData.LanguageListAsyncPromise = null;
						lookupData.languageDataList = _.uniq(data, 'Id');
						return lookupData.languageDataList;
					});
				};

				function getLanguageDataList() {
					var deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'cloud/common/getlanguages')
						.then(function (response) {
							if (response && response.data) {
								lookupData.languageDataList = response.data;
							}
							deferred.resolve(lookupData.languageDataList);
						});

					return deferred.promise;
				}

				service.getListAsync = function getListAsync() {
					var list = service.getList();
					if (list && list.length > 0) {
						return $q.when(list);
					} else {
						return service.loadAsync();
					}
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if (lookupData.languageDataList.length) {
						return $q.when(service.getItemById(value));
					} else {

						if (!lookupData.LanguageListAsyncPromise) {
							lookupData.LanguageListAsyncPromise = getLanguageDataList();
						}
						return lookupData.LanguageListAsyncPromise.then(function () {
							lookupData.LanguageListAsyncPromise = null;
							return service.getItemById(value);
						});
					}


				};
				service.getList = function getList() {
					return lookupData.languageDataList && lookupData.languageDataList.length ? lookupData.languageDataList : [];
				};

				service.getLookupData = function getLookupData() {
					return getLanguageDataList();
				};
				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.languageDataList;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
					}
					return item && item.Id ? item : null;
				};

				service.getSearchList = function getSearchList(searchvalue) {
					let searchRs = [];
					if (!lookupData.LanguageListAsyncPromise) {
						lookupData.LanguageListAsyncPromise = getLanguageDataList();
					}
					return lookupData.LanguageListAsyncPromise.then(function (data) {
						lookupData.languageDataList = _.uniq(data, 'Id');
						if (searchvalue) {
							let list = lookupData.languageDataList;
							if(list.length >=1) {
								for(var i=0; i< list.length; i++) {
									if(list[i].Description.toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1) {
										searchRs.push(list[i]);
									}
								}
							}
						} else {
							searchRs = data;
						}
						return searchRs;
					});
				};

				return service;
			}]);
})(angular);
