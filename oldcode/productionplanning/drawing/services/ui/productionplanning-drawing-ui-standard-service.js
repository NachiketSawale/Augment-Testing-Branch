/**
 * Created by zov on 04/04/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).service('productionplanningDrawingUIStandardService', [
		'platformUIConfigInitService',
		'productionplanningDrawingTranslationService',
		'productionplanningDrawingContainerInformationService',
		'productionplanningDrawingMainService',
		'ppsCommonLayoutOverloadService',
		'platformSchemaService',
		'ppsCommonCustomColumnsServiceFactory',
		function (platformUIConfigInitService,
				  drawingTranslationService,
				  drawingContainerInformationService,
				  mainService,
				  ppsCommonLayoutOverloadService,
				  platformSchemaService,
				  customColumnsServiceFactory) {

			var servData = {
				service: this,
				layout: drawingContainerInformationService.getPpsDrawingLayout(),
				dtoSchemeId: {
					moduleSubModule: 'ProductionPlanning.Drawing',
					typeName: 'EngDrawingDto'
				},
				translator: drawingTranslationService
			};

			var dtoScheme = platformSchemaService.getSchemaFromCache(servData.dtoSchemeId).properties;
			if (dtoScheme) {
				var customColumnsService = customColumnsServiceFactory.getService(moduleName);
				_.merge(dtoScheme, customColumnsService.attributes);
			}
			servData.detailLayout = platformUIConfigInitService.provideConfigForDetailView(servData.layout, dtoScheme, servData.translator);
			servData.gridLayout = platformUIConfigInitService.provideConfigForListView(servData.layout, dtoScheme, servData.translator);

			servData.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
				return servData.detailLayout;
			};

			servData.service.getStandardConfigForListView = function getStandardConfigForListView() {
				return servData.gridLayout;
			};

			servData.service.getDtoScheme = function () {
				return dtoScheme;
			};

			ppsCommonLayoutOverloadService.translateAdditionalColumns(this);
			//set the callback function manually, in case the detail container not load when open the validation dialog
			_.forEach(this.getStandardConfigForDetailView().rows, function (row) {
				row.change = function (entity, field) {
					mainService.handleFieldChanged(entity, field);
				};
			});
		}]);
})();