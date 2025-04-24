/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainObjectSelStatementInput', [
		'$timeout', 'estimateMainSelStatementFilterEditorService',
		function ($timeout, estimateMainSelStatementFilterEditorService) {
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
					let beChanged = false, parsed = {};

					// model -> view
					ctrl.$render = function () {
						parsed = JSON.parse(ctrl.$viewValue);
						$scope.model = parsed ? parsed.filterText: '';
					};

					$scope.onChange = function onChange(){
						beChanged = true;
						setValue();
					};

					function setValue()
					{
						if(beChanged===true){
							let filterObj = {
								filterComposite: parsed.filterComposite,
								filterText: $scope.model
							};

							ctrl.$setViewValue(JSON.stringify(filterObj));
							ctrl.$commitViewValue();

							$scope.$parent.$eval(attrs.config + '.rt$change()');

							let selStatementEditor = estimateMainSelStatementFilterEditorService.getCm('estObjectSelStatement');
							if (selStatementEditor){
								selStatementEditor.setValue(filterObj.filterText);
							}
						}
					}
				}
			};

		}
	]);

})(angular);
