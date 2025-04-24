(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDependentDataService', ['platformTranslateService', '$http', '$q', '$translate', 'globals', '_',
		function (platformTranslateService, $http, $q, $translate, globals, _) {

			const service = {};
			const containerContentJson = {};

			service.loadDataList = function (option) {
				let promise = option.Promise ? option.Promise : $http.get(globals.webApiBaseUrl + 'basics/common/dependent/getlist?mainItemId=' + option.mainItemId + '&moduleIdentifer=' + option.moduleIdentifer + '&projectId=' + option.prjectId + '' + '&headerId=' + option.headerId + '');

				return promise.then(function (response) {
					if (!!response && response.data) {
						const moduleNameList = [];
						_.forEach(response.data, function (item) {
							moduleNameList.indexOf(item.ModuleName) === -1 && moduleNameList.push(item.ModuleName);
							if(item.DetailChildren && item.DetailChildren.length > 0){
								_.forEach(item.DetailChildren, function (subItem){
									moduleNameList.indexOf(subItem.ModuleName) === -1 && moduleNameList.push(subItem.ModuleName);
								});
							}
						});

						return initContainerJson(moduleNameList).then(function () {
							index = 1;
							processTree(response.data);

							return response.data;
						});
					}
				});
			};

			let index = 1;

			function processTree(data) {
				if (!data || data.length <= 0) {
					return;
				}

				_.forEach(data, function (item) {
					item.Id = item.Uuid || index + '';
					index++;
					item.Title = item.Title || getTile(item.Uuid, item.ModuleName);
					item.Count += '';
					item.image = item.image || 'ico-accordion-grp';
					processTree(item.DetailChildren);
				});
			}

			function initContainerJson(moduleNameList) {
				const promises = [];
				_.forEach(moduleNameList, function (moduleName) {
					if (!containerContentJson[moduleName]) {
						platformTranslateService.registerModule([moduleName]);
						promises.push($http.get(globals.appBaseUrl + moduleName + '/content/json/module-containers.json').then(function (result) {
							if (result && result.data) {
								const includes = _.filter(result.data, function (includeDef) {
									return includeDef.include !== null && includeDef.include !== undefined;
								});

								if (!_.isNil(includes) && includes.length === 0) {
									containerContentJson[moduleName] = result.data;
								}

								const includeCalls = _.map(includes, function (includeDef) {
									return $http.get(globals.appBaseUrl + includeDef.include);
								});

								return $q.all(includeCalls)
									.then(function (responses) {
										containerContentJson[moduleName] = _.concat(result.data, _.flatten(_.map(responses, function (r) {
											return r.data;
										})));
									});
							}

						}));
					}
				});

				return promises.length > 0 ? $q.all(promises) : $q.when(true);
			}

			function getTile(uuid, moduleName) {
				if (!!containerContentJson && !!containerContentJson[moduleName]) {
					const containerContent = _.filter(containerContentJson[moduleName], {uuid: uuid});
					if (_.isArray(containerContent) && containerContent[0]) {
						return $translate.instant(containerContent[0].title) || containerContent[0].title;
					}
					return containerContent.title || uuid;
				}
				return uuid;
			}

			return service;
		}]);
})(angular);