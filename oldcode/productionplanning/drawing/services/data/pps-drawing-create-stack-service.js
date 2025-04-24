/**
 * Created by las on 6/20/2023.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('ppsDrawingCreateStackOption', ['productionplanningDrawingStackDataService', 'productionplanningDrawingStackValidationService',
		function (productionplanningDrawingStackDataService, productionplanningDrawingStackValidationService) {
			var parentService = productionplanningDrawingStackDataService.getService();
			var validator = productionplanningDrawingStackValidationService.getService(parentService);
			return {
				rootService: parentService,
				dataService: 'ppsDrawingCreateStackService',
				uiStandardService: 'productionplanningDrawingStackUIStandardService',
				validationService: validator,
				fields: ['Code', 'Description', 'Type', 'Length', 'UomLengthFk', 'Width', 'UomWidthFk', 'Height', 'UomHeightFk', 'Weight', 'UomWeightFk'],
				creationData: {MainItemId: null, Id: null}
			};
		}]);

	angular.module(moduleName).factory('ppsDrawingCreateStackService', [
		'$q', '$http', 'ppsCommonDocumentAnnotationExtension',
		'platformDataValidationService', 'productionplanningDrawingStackDataService',

		function ($q, $http, ppsCommonDocumentAnnotationExtension,
			platformDataValidationService, productionplanningDrawingStackDataService) {

			var parentService = productionplanningDrawingStackDataService.getService();
			var service = {};
			service.createItem = function (creationOptions, customCreationData) {
				customCreationData.Id = ppsCommonDocumentAnnotationExtension.getEngDrawing();
				return parentService.createItemSimple(creationOptions, customCreationData, function (data) {
					service.updateData = data;
					return data;
				});
			};
			service.update = function () {
				return parentService.updateSimple(
					service.updateData
				).then(function (result) {
					service.updateData = result.data;
					clearValidationErrors();
				});
			};
			service.deleteItem = function () {
				clearValidationErrors();
				service.updateData = null;
				return $q.when(true);
			};

			function clearValidationErrors() {
				platformDataValidationService.removeDeletedEntityFromErrorList(service.updateData, parentService);
			}

			return service;
		}]);

})(angular);
