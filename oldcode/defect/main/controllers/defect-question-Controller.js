/**
 * Created by pet on 6/12/2018.
 */
/* global  */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	/**
        * @ngdoc controller
        * @name defectQuestionController
        * @function
        *
        * @description
        * defect checklist controller
        **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('defectQuestionController',
		['$scope', 'platformGridControllerService', 'defectQuestionDataService', 'defectQuestionValidationService',
			'defectQuestionUIStandardService','platformGridAPI','defectChecklistDataService',
			function ($scope, gridControllerService, dataService, validationService, gridColumns,platformGridAPI,defectChecklistDataService) {
				var gridConfig = {
					columns: []
				};
				var setCellEditable = function () {
					return defectChecklistDataService.setReadonly();
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			}
		]
	);
})(angular);