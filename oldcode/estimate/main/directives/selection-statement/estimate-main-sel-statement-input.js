/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainSelStatementInput', [
		'$timeout', 'estimateMainSelStatementFilterEditorService', 'estimateMainSelStatementFilterEditorTranslateService',
		function ($timeout, estimateMainSelStatementFilterEditorService, estimateMainSelStatementFilterEditorTranslateService) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					entity: '=',
					readonly: '=',
					onInit: '&'
				},
				controllerAs: 'ctrl',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/selection-statement/line-item-selection-statement-input.html',
				controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
					$scope.config = $scope.$parent.$eval($attrs.config);
				}],
				link: function ($scope, $element, attrs, ctrl) {
					let beChanged = false;

					// model -> view
					ctrl.$render = function () {
						$scope.model = estimateMainSelStatementFilterEditorTranslateService.getSelStatementTranslated(ctrl.$viewValue);
					};

					$scope.onChange = function onChange(){
						beChanged = true;
						setValue();
					};

					function setValue()
					{
						if(beChanged===true){

							let selStatementToSave = estimateMainSelStatementFilterEditorTranslateService.getSelStatementToSave($scope.model);
							// $scope.model = estimateMainSelStatementFilterEditorTranslateService.getSelStatementTranslated(JSON.parse(selStatementToSave));

							ctrl.$setViewValue(selStatementToSave);
							ctrl.$commitViewValue();

							$scope.$parent.$eval(attrs.config + '.rt$change()');

							let selStatementEditor = estimateMainSelStatementFilterEditorService.getCm('estSelStatement');
							selStatementEditor.setValue($scope.model);
						}
					}
				}
			};

		}
	]);

})(angular);
