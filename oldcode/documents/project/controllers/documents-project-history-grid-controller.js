/**
 * Created by lvy on 8/17/2018.
 */
(function () {

	'use strict';
	var moduleName = 'documents.project';

	angular.module(moduleName).controller('documentsProjectDocumentHistoryController', ['$scope','platformGridControllerService', 'documentProjectHistoryUIStandardService', 'documentsProjectDocumentHistoryDataService', 'documentProjectHeaderValidationService', 'documentsProjectDocumentDataService', 'documentsProjectDocumentModuleContext',
		function ($scope, gridControllerService, gridColumns, documentsProjectDocumentHistoryDataService, validationService, documentsProjectDocumentDataService, documentsProjectDocumentModuleContext) {

			var config = documentsProjectDocumentModuleContext.getConfig();

			var historyConfig = angular.copy(config);

			documentsProjectDocumentDataService.setIsContainerConnected(true);
			historyConfig.parentService = documentsProjectDocumentDataService.getService(config);

			var dataService = documentsProjectDocumentHistoryDataService.getService(historyConfig);

			gridControllerService.initListController($scope, gridColumns, dataService, validationService, {});


			var filterBtn = [{
				id: 'filterByClerk',
				sort: 0,
				caption: 'documents.project.filterByClerk',
				iconClass: 'tlb-icons ico-filter',
				type: 'check',
				fn: function (id, btn) {
					dataService.clickBtnFilterByClerk(btn.value);
				},
				disabled: function () {
					var module = historyConfig.parentService.getModule();
					if (module && module.name === 'documents.centralquery') {
						return false;
					}
					return true;
				}
			}];

			$scope.addTools(filterBtn);

			$scope.$on('$destroy', function () {
				documentsProjectDocumentDataService.setIsContainerConnected(false);
			});
		}
	]);
})();