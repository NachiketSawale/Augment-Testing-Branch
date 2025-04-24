(function (anglar) {
	'use strict';
    
	anglar.module('boq.main').directive('boqMainUrCalculateFromCheckbox', ['$translate',function ($translate){
		return {
			restrict: 'A',
			template: '<input type="checkbox" data-ng-model="entity.CalcFromUrb" data-domain="boolean" data-entity="entity" class="ng-pristine ng-valid ng-empty ng-touched" />  ' + $translate.instant('boq.main.urCalcByURB')
		};
	}]);
    
})(angular);