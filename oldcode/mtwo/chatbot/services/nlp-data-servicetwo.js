(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).factory('nlpDataServiceTwo',
		['$http', '$q', '_',
			function ($http, $q, _) {
				var service = {};

				var lookupData = {
					nlpDataList: []
				};
				service.loadAsync = function loadAsync() {
					if (!lookupData.NlpListAsyncPromise) {
						lookupData.NlpListAsyncPromise = getNlpDataList();
					}
					return lookupData.NlpListAsyncPromise.then(function (data) {
						lookupData.NlpListAsyncPromise = null;
						lookupData.nlpDataList = _.uniq(data, 'Id');
						return lookupData.nlpDataList;
					});
				};

				function getNlpDataList() {
					var deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/configuration/getnlpdata')
						.then(function (response) {
							// var projects = [];
							if (response && response.data) {
								// add emptyvalue
								response.data.unshift({Id: null,Name: ''});
								lookupData.nlpDataList = response.data;
							}
							deferred.resolve(lookupData.nlpDataList);
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
					if (lookupData.nlpDataList.length) {
						return $q.when(service.getItemById(value));
					} else {

						if (!lookupData.NlpListAsyncPromise) {
							lookupData.NlpListAsyncPromise = getNlpDataList();
						}
						return lookupData.NlpListAsyncPromise.then(function () {
							lookupData.NlpListAsyncPromise = null;
							return service.getItemById(value);
						});
					}


				};
				service.getList = function getList() {
					return lookupData.nlpDataList && lookupData.nlpDataList.length ? lookupData.nlpDataList : [];
				};

				service.getLookupData = function getLookupData() {
					if (!lookupData.NlpListAsyncPromise) {
						lookupData.NlpListAsyncPromise = getNlpDataList();
					}
					return lookupData.NlpListAsyncPromise;
				};
				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.nlpDataList;
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
					if (!lookupData.NlpListAsyncPromise) {
						lookupData.NlpListAsyncPromise = getNlpDataList();
					}
					return lookupData.NlpListAsyncPromise.then(function (data) {
						lookupData.nlpDataList = _.uniq(data, 'Id');
						if (searchvalue) {
							let list = lookupData.nlpDataList;
							if(list.length >=1) {
								for( var i=0; i< list.length; i++) {
									if(list[i].Name.toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1
										|| list[i].Culture.toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1
										|| list[i].Activeversion.toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1) {
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
