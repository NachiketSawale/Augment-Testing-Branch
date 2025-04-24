(function(angular){
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainColumnConfigUIStandardService',[
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'estimateMainCostCodeAssignmentDetailLookupDataService',
		function (basicsLookupdataConfigGenerator, platformTranslateService, estimateMainCostCodeAssignmentDetailLookupDataService) {
			var service = {};

			service.getGridColumns = function getGridColumns() {
				estimateMainCostCodeAssignmentDetailLookupDataService.getEditType();
				var gridColumns = [];

				platformTranslateService.translateGridConfig(gridColumns);

				return gridColumns;
			};

			service.getStandardConfigForListView = function () {
				return {
					addValidationAutomatically: true,
					columns: service.getGridColumns()
				};
			};

			return service;
		}]);
})(angular);
