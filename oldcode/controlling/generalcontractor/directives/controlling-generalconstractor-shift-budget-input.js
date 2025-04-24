(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).directive('controllingGeneralContstactorShiftBudgetInput', [
		'keyCodes',
		function (keyCodes){
			return {
				restrict: 'EA',
				template: '<input type="text" ng-focus="onFocus()" ng-blur="onBlur()" ng-keydown="onKeyDown($event)" data-entity="entity" ng-model="value"  data-domain="decimal" class="domain-type-description grid-control ng-pristine  ng-scope ng-not-empty" style="height: 20px" ng-pattern-restrict="(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,2})$)" />',
				link: function (scope){
					scope.onFocus = function (){
						scope.value = (scope.value-0).toFixed(2);
					};

					scope.onKeyDown = function (event){
						switch (event.keyCode) {
							case keyCodes.ENTER:
							case keyCodes.TAB:
								scope.onBlur();
								break;
						}
					};

					scope.onBlur = function (){
						if(scope.entity.SorurceType){
							scope.value = scope.value-0 > 0 ? 0 - scope.value : scope.value-0;
						}else{
							scope.value = scope.value-0 < 0 ? 0 - scope.value : scope.value-0;
						}

						scope.entity.ShiftBudget = scope.value;
					};
				} 
			};
		}
	]);
    
})(angular);