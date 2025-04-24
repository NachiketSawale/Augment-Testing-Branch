(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).factory('mtwoChatbotNlpIntentLookupDataService',
		['$http', '$q', '_','$injector',
			function ($http, $q, _, $injector) {
				var service = {};

				var lookupData = {
					nlpIntentDataList: []
				};
				service.loadAsync = function loadAsync() {
					if (!lookupData.NlpIntentListAsyncPromise) {
						lookupData.NlpIntentListAsyncPromise = getNlpIntentDataList();
					}
					return lookupData.NlpIntentListAsyncPromise.then(function (data) {
						lookupData.NlpIntentListAsyncPromise = null;
						lookupData.nlpIntentDataList = _.uniq(data, 'Id');
						return lookupData.nlpIntentDataList;
					});
				};

				function getNlpIntentDataList() {
					var deferred = $q.defer();
					// todo get data
					// var nlpId = $injector.get('qtoMainHeaderDataService').getSelected().BoqHeaderFk;
					var headerId = $injector.get('mtwoChatBotHeaderDataService').getSelected().Id;
					$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/wf2intent/getnlpintentdata?headerId=' + headerId)
						.then(function (response) {
							if (response && response.data) {
								lookupData.nlpIntentDataList = response.data;
							}
							deferred.resolve(lookupData.nlpIntentDataList);
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
					if (lookupData.nlpIntentDataList.length) {
						return $q.when(service.getItemById(value));
					} else {

						if (!lookupData.NlpIntentListAsyncPromise) {
							lookupData.NlpIntentListAsyncPromise = getNlpIntentDataList();
						}
						return lookupData.NlpIntentListAsyncPromise.then(function () {
							lookupData.NlpIntentListAsyncPromise = null;
							return service.getItemById(value);
						});
					}


				};
				service.getList = function getList() {
					return lookupData.nlpIntentDataList && lookupData.nlpIntentDataList.length ? lookupData.nlpIntentDataList : [];
				};

				service.getLookupData = function getLookupData() {
					return getNlpIntentDataList();
				};
				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.nlpIntentDataList;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].Name === value) {
								item = list[i];
								break;
							}
						}
					}
					return item && item.Id ? item : null;
				};

				service.getSearchList = function getSearchList(searchvalue) {
					let searchRs = [];
					if (!lookupData.NlpIntentListAsyncPromise) {
						lookupData.NlpIntentListAsyncPromise = getNlpIntentDataList();
					}
					return lookupData.NlpIntentListAsyncPromise.then(function (data) {
						lookupData.nlpIntentDataList = _.uniq(data, 'Id');
						if (searchvalue) {
							let list = lookupData.nlpIntentDataList;
							if(list.length >=1) {
								for( var i=0; i< list.length; i++) {
									if(list[i].Name.toLowerCase().indexOf(searchvalue.toLowerCase()) !== -1) {
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

				service.fleshLookupData = function fleshLookupData() {
					lookupData.NlpIntentListAsyncPromise = getNlpIntentDataList();
					return lookupData.NlpIntentListAsyncPromise;
				};
				return service;
			}]);
})(angular);
