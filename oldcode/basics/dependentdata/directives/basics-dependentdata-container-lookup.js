/**
 * Created by alm on 12.2.2024.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */
	var moduleName = 'basics.dependentdata';
	angular.module(moduleName).directive('basicsDependentDataContainerCombobox', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsDependentDataContainerLookupService', function (BasicsLookupdataLookupDirectiveDefinition, basicsDependentDataContainerLookupService) {
		var defaults = {
			lookupType: 'basicsDependentDataContainerLookup',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Title'
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			dataProvider: {
				getSearchList: function () {
					return basicsDependentDataContainerLookupService.getList();
				},
				getList: function () {
					return basicsDependentDataContainerLookupService.getList();
				},
				getItemByKey: function (key, options, scope) {
					return basicsDependentDataContainerLookupService.getItemByKey(key, options, scope);
				}
			}
		});
	}]);
})(angular);

(function (angular) {
	'use strict';

	angular.module('basics.dependentdata').factory('basicsDependentDataContainerLookupService', ['$http', 'platformTranslateService', '$injector', '$q', '$translate', 'basicsDependentDataModuleLookupService', 'basicsDependentDataMainService',

		function ($http, platformTranslateService, $injector, $q, $translate, basicsDependentDataModuleLookupService, basicsDependentDataMainService) {

			var service = {
				loadListing: false,
				containerJsonMap: new Map(),
				loadData: function () {
					const list = basicsDependentDataMainService.getList();
					const haveUuidRecords = _.filter(list, item => item.BoundContainerUuid !== null);
					const moduleIds = _.uniq(_.map(haveUuidRecords, item => item.ModuleFk));
					return service.getContainers(moduleIds);
				},
				loadTranslation: function (moduleName) {
					let translationServiceName = _.camelCase(moduleName) + 'TranslationService';
					return $q(function (resolve, reject) {
						try {
							let translationService = $injector.get(translationServiceName);
							if (translationService.loadTranslations) {
								translationService.loadTranslations().then(resolve, reject);
							} else {
								//cause by some module no have loadTranslations function ,Unable to determine if the translation issue has been loaded successfully
								translationService.registerUpdates(resolve);
								translationService.loadTranslations = function () {
									return $q.when(true);
								};
							}
						} catch (e) {
							//cause by some module  translationService name not match from db example: db is basicsAccountingjournalsTranslationService, code is  basicsAccountingJournalsTranslationService
							platformTranslateService.registerModule(moduleName, true).then(resolve, reject);
						}
					});
				},
				getContainers: function (moduleIds) {
					let promiseList = [];
					_.forEach(moduleIds, function (moduleId) {
						if (service.containerJsonMap.has(moduleId)) {
							return promiseList.push($q.when(service.containerJsonMap.get(moduleId)));
						}
						let moduleName = basicsDependentDataModuleLookupService.getItemByKey(moduleId).InternalName;
						let moduleEntityIndex=_.findIndex(globals.modules, value => value === moduleName);
						if(moduleEntityIndex<0){
							service.containerJsonMap.set(moduleId,[]);
							return  promiseList.push($q.when([]));
						}
						let defer = $q.defer();
						//promiseList.push($http.get(globals.webApiBaseUrl + 'basics/layout/containerdefinition?module=' + moduleName));
						$http.get(globals.appBaseUrl + moduleName + '/content/json/module-containers.json').then(function (response) {
							if (response.data) {
								let allContainers = _.filter(response.data, function (item) {
									return item.hasOwnProperty('uuid')
								});
								service.loadTranslation(moduleName).then(function () {
									let containerList = _.map(allContainers, item => {
										return {Id: item.uuid, Title: $translate.instant(item.title)};
									});
									service.containerJsonMap.set(moduleId,containerList);
									defer.resolve(containerList);
								});
							} else {
								return defer.resolve([]);
							}
						}).catch(error => {
							console.error("Failed to load container data", error);
							return defer.resolve([]);  // Return an empty array in case of error to avoid breaking the promise chain
						});
						promiseList.push(defer.promise);
					});
					return $q.all(promiseList).then(function (results) {
						return _.flatten(results);
					});
				},
				getList: function () {
					const userContainerSelectedEntity = basicsDependentDataMainService.getSelected();
					if (userContainerSelectedEntity) {
						const moduleFk = userContainerSelectedEntity.ModuleFk;
						return service.getContainers([moduleFk]);
					}
					return $q.when([]);
				},
				getItemByKey: function (key, options, scope) {
					const lookupData = _.flatten(_.toArray(service.containerJsonMap.values()));
					let item = _.find(lookupData, {Id: key});
					if (item) {
						return $q.when(item);
					} else {
						let userContainerSelectedEntity = basicsDependentDataMainService.getSelected();
						let list = basicsDependentDataMainService.getList();
						if (scope || (userContainerSelectedEntity && userContainerSelectedEntity.BoundContainerUuid === key)) {
							let moduleId = scope ? scope.entity.ModuleFk : userContainerSelectedEntity.ModuleFk;
							const containerList = service.containerJsonMap.get(moduleId);
							if (_.isEmpty(containerList)) {
								return service.getContainers([moduleId]).then(function (containerListResponse) {
									return $q.when(_.find(containerListResponse, {Id: key}));
								});
							} else {
								return $q.when(_.find(containerList, {Id: key}));
							}
						} else if (list.length > 0 && !service.loadListing) {
								service.loadListing = true;
								return service.loadData().then(function (response) {
									service.loadListing = false;
									basicsDependentDataMainService.gridRefresh();
									return $q.when(_.find(response, {Id: key}));
								});
						} else {
							return $q.when(null);
						}
					}
				}
			};
			return service;
		}]);
})(angular);
