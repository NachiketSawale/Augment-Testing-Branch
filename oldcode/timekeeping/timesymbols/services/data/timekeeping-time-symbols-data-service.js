/**
 * Created by nit on 07.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsDataService
	 * @function
	 *
	 * @description
	 * timekeepingTimeSymbolsDataService is the data service for all time Symbols related functionality.
	 */
	let moduleName = 'timekeeping.timesymbols';
	let timeSymbols = angular.module(moduleName);
	timeSymbols.factory('timekeepingTimeSymbolsDataService', ['platformDataServiceFactory','platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'platformRuntimeDataService',
		function (platformDataServiceFactory,platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor, platformRuntimeDataService) {

			let factoryOptions = {
				flatRootItem: {
					module: timeSymbols,
					serviceName: 'timekeepingTimeSymbolsDataService',
					entityNameTranslationID: 'timekeeping.timesymbols.entityTimeSymbol',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/timesymbols/',
						endRead: 'filtered',
						endDelete: 'multidelete',
						usePostForRead: true
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'TimeSymbols',
							moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingTimeSymbols',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TimeSymbolDto',
						moduleSubModule: 'Timekeeping.TimeSymbols'
					}),{ processItem: setReadonly },],
					translation: {
						uid: 'timekeepingTimeSymbolsDataService',
						title: 'timekeeping.timesymbols.timeSymbolListTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'TimeSymbolDto',
							moduleSubModule: 'Timekeeping.TimeSymbols'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'TimeSymbolDto',
				moduleSubModule: 'Timekeeping.TimeSymbols',
				validationService: 'timekeepingTimeSymbolsValidationService'
			});

			let service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};

			function setReadonly(entity) {
				let fields = [
					{ field: 'Description', readonly: true },
					{ field: 'IsExpense', readonly: true },
					{ field: 'CodeFinance', readonly: true }
				];
				if (entity.ExternalId) {
					platformRuntimeDataService.readonly(entity, fields);
				}
			}

			return service;
		}]);
})(angular);
