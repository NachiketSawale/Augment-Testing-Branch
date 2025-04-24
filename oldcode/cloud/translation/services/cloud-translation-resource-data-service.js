/**
 * Created by baf on 31.05.2016
 */
(function () {
	'use strict';
	const cloudTlsModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardStepDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardStepDataService is a data service for managing steps of generic wizard instances.
	 */
	cloudTlsModule.factory('cloudTranslationResourceDataService', ['$rootScope', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', '$q', '$http', 'basicsLookupdataLookupDescriptorService', 'cloudTranslationResourceValidationService', 'basicsLookupdataLookupDescriptorService', 'globals',

		function ($rootScope, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, $q, $http, descriptorService, resourceValidationService, basicsLookupdataLookupDescriptorService, globals) {

			const resourceDataServiceOptions = {
				flatRootItem: {
					module: cloudTlsModule,
					serviceName: 'cloudTranslationResourceDataService',
					entityNameTranslationID: 'cloud.translation.resourceEntity',
					httpUpdate: {route: globals.webApiBaseUrl + 'cloud/translation/resource/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'cloud/translation/resource/',
						usePostForRead: true,
						endRead: 'listfiltered'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ResourceDto',
						moduleSubModule: 'Cloud.Translation'
					}), resourceValidationService.getResourceFkProcessor(), resourceValidationService.getIsGlossaryProcessor(), resourceValidationService.getIsChangedProcessor()],
					actions: {delete: false, create: false},
					modification: {},
					entityRole: {
						root: {
							itemName: 'Resource',
							moduleName: 'cloud.desktop.moduleDisplayNameTranslation',
							mainItemName: 'Resource',
							handleUpdateDone: handleUpdateDone,
							useIdentification: true
						}
					},
					presenter: {list: {}},
					sidebarSearch: {
						options: {
							moduleName: 'cloud.translation',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 1000,
							useCurrentClient: false,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};


			const container = platformDataServiceFactory.createNewComplete(resourceDataServiceOptions);
			const service = container.service;


			function handleUpdateDone(originalData, updateData) {
				// update the changed LookupItem in cache
				basicsLookupdataLookupDescriptorService.updateData(resourceDataServiceOptions.flatRootItem.serviceName, [updateData.Resource]);
				service.gridRefresh();
				$rootScope.$emit('resourceUpdateDone');
			}

			service.getItemByIdAsync = function (id) {
				return service.getItemByKey(id);
			};

			service.getItemByKey = function (key) {
				if (key) {
					const cachedItem = descriptorService.getLookupItem('cloudTranslationResourceLookup', key);
					if (!cachedItem) {
						return $http.get(globals.webApiBaseUrl + 'cloud/translation/resource/bykey', {params: {id: key}}).then(function (result) {
							const item = result.data;
							descriptorService.addData('cloudTranslationResourceLookup', [item]);
							return item;
						});
					} else {
						return $q.when(cachedItem);
					}
				} else {
					return $q.when(null);
				}
			};

			function postData(filterValue) {
				return $http.post(globals.webApiBaseUrl + 'cloud/translation/resource/getsearchlist', {FilterValue: filterValue}).then(function getSearchList(result) {
					return result.data;
				});
			}

			service.getSearchList = function (filterValue) {
				filterValue = filterValue.replace('SearchPattern', 'ResourceTerm');
				return postData(filterValue);
			};

			service.selectResource = function (resource) {
				service.setSelected(resource, []);
			};

			service.setListWithoutModification = function (resourceList) {
				service.setList(resourceList);
				container.data.doClearModifications(null, container.data);
			};

			return service;
		}
	]);
})();