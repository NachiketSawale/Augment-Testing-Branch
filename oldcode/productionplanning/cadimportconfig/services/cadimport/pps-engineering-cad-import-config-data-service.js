/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsEngineeringCadImportConfigDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor) {

		function enSureInvalidValue(newItem) {
			if (newItem) {
				Object.keys(newItem).forEach(function (prop) {
					if (prop.endsWith('Fk')) {
						if (newItem[prop] === 0) {
							newItem[prop] = null;
						}
					}
				});
			}
		}

		var serviceInfo = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'ppsEngineeringCadImportConfigDataService',
				entityNameTranslationID: 'productionplanning.cadimportconfig.entityTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/cadimportconf/',
					endRead: 'filtered',
					endDelete: 'multideletex',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'PpsEngineeringCadImports',
						moduleName: 'cloud.desktop.moduleDisplayNameEngineeringCADImportConfig',
						useIdentification: true
					}
				},
				presenter: {
					list: {
						handleCreateSucceeded: function (newItem) {
							enSureInvalidValue(newItem);
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				sidebarWatchList: {active: true}, // enable watchlist for this module
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
						withExecutionHints: false
					}
				}
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EngCadImportConfigDto',
			moduleSubModule: 'ProductionPlanning.CadImportConfig',
			validationService: 'ppsEngineeringCadImportConfigValidationService',
			mustValidateFields: ['EngDrawingTypeFk', 'ImporterKind', 'BaseDirectory', 'MatchPattern', 'MatchPatternType']
		});

		return container.service;
	}
})(angular);
