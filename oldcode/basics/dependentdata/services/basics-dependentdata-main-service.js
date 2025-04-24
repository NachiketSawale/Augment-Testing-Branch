/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	/* global globals, angular */
	'use strict';

	var moduleName = 'basics.dependentdata';
	var dependentDataModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * main data service for all module related functionality.
	 */
	dependentDataModule.factory('basicsDependentDataMainService', ['$q', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsDependentDataModuleLookupService', 'basicsDependentDataDomainLookupService', 'platformRuntimeDataService', 'basicsCommonMandatoryProcessor',

		function ($q, $http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, moduleLookupService, domainLookupService, platformRuntimeDataService, mandatoryProcessor) {

			var sidebarSearchOptions = {
				moduleName: moduleName,
				enhancedSearchEnabled: true,
				enhancedSearchVersion: '2.0',
				pattern: '',
				pageSize: 100,
				useCurrentClient: false,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: false,
				withExecutionHints: true
			};

			// The instance of the main service - to be filled with functionality below
			var serviceFactoryOptions = {
				flatRootItem: {
					module: dependentDataModule,
					serviceName: 'basicsDependentDataMainService',
					dataProcessor: [{processItem: processItem}],
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/', usePostForRead: true, endRead: 'listFiltered'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/', endCreate: 'createNew'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/', endUpdate: 'update'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/', endDelete: 'deleteEntity'
					},
					entityRole: {
						root: {
							codeField: 'Id',
							descField: 'DescriptionInfo.Translated',
							itemName: 'DependentData',
							mainItemName: 'DependentData',
							moduleName: 'cloud.desktop.moduleDisplayNameDependentData',
							useIdentification: true
						}
					},
					translation: {
						uid: 'basicsDependentDataMainService',
						title: 'basics.dependentdata.translateContainerDescriptionTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'DependentDataDto', moduleSubModule: 'Basics.DependentData' }
					},
					sidebarSearch: {
						options: sidebarSearchOptions
					}
				}
			};

			function processItem(item) {

				var fields = [
					{field: 'BoundContainerUuid', readonly: !item.ModuleFk},
					{field: 'ModuleFk', readonly: item.Version > 0} // prevent changing of module assignment!
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
			// serviceContainer.service.load();

			// events
			// serviceContainer.service.failedOnOutstandingChanges = new Platform.Messenger();

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'DependentDataDto',
				moduleSubModule: 'Basics.DependentData',
				validationService: 'basicsDependentDataValidationService',
				mustValidateFields: ['BoundContainerUuid']
			});

			var init = function () {
				var promises = [];
				promises.push(moduleLookupService.loadData());
				promises.push(domainLookupService.loadData());
				$q.all(promises).then(function () {
				});

			};
			init();

			return serviceContainer.service;

		}]);
})(angular);
