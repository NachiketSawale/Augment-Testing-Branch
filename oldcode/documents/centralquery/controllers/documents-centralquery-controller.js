/*
 * $Id: documents-centralquery-controller.js 600666 2020-08-24 06:27:47Z alm $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global */
	var moduleName = 'documents.centralquery';

	angular.module(moduleName).controller('documentsCentralqueryController',
		['$scope', 'platformMainControllerService', 'documentCentralQueryDataService',
			'documentProjectDocumentTranslationService','basicsLookupdataLookupDefinitionService',
			'documentsProjectDocumentModuleContext','modelViewerStandardFilterService','projectDocumentNumberGenerationSettingsService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, documentCentralQueryDataService,
				documentProjectDocumentTranslationService, basicsLookupdataLookupDefinitionService, moduleContext, modelViewerStandardFilterService,
				projectDocumentNumberGenerationSettingsService) {


				basicsLookupdataLookupDefinitionService.load(['documentsProjectHasDocumentRevisionCombobox']);
				var opt = { search: true, reports: false, auditTrail: 'f9d93fcec04a4a278970428c893835bc' };
				var mc = {};
				// var docuementService = documentsProjectDocumentDataService.getService({
				// moduleName: moduleName
				// });
				var moduleOption = {
					moduleName: moduleName ,
					parentService:documentCentralQueryDataService,
					columnConfig: [
						{documentField: 'PrjProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'ConHeaderFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', readOnly: false},
						{documentField: 'MdcMaterialCatalogFk', readOnly: false},
						{documentField: 'PrcPackageFk', readOnly: false},
						{documentField: 'InvHeaderFk', readOnly: false},
						{documentField: 'PrcStructureFk', readOnly: false},
						{documentField: 'PesHeaderFk', readOnly: false},
						{documentField: 'BpdCertificateFk',readOnly: false},
						{documentField: 'EstHeaderFk', readOnly: false},
						{documentField: 'PrjLocationFk', readOnly: false},
						{documentField: 'PsdActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', readOnly: false},
						{documentField: 'QtnHeaderFk', readOnly: false},
						{documentField: 'RfqHeaderFk', readOnly: false},
						{documentField: 'ReqHeaderFk', readOnly: false},
						{documentField: 'BilHeaderFk', readOnly: false},
						{documentField: 'WipHeaderFk', readOnly: false}
					]
				};
				moduleContext.setConfig(moduleOption);
				var sidebarReports = platformMainControllerService.registerCompletely($scope, documentCentralQueryDataService, mc, documentProjectDocumentTranslationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('DocumentModelFilterService');
				projectDocumentNumberGenerationSettingsService.assertLoaded();
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(documentCentralQueryDataService, sidebarReports, documentProjectDocumentTranslationService, opt);
				});

			}]);
})(angular);
