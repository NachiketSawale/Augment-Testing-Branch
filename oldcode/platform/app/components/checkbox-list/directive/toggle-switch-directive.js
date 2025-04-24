(function () {
	'use strict';

	angular.module('platform').directive('platformToggleSwitch', platformToggleSwitch);

	function platformToggleSwitch() {
		return {
			restrict: 'EA',
			template: '<div class="toggle-switch" data-ng-show="showSwitch"><input ng-checked="ngModel" type="checkbox" data-ng-click="change(this, $event)" ng-disabled="setdisable" /></div>',
			scope: {
				showSwitch: '=',
				ngModel: '=',
				onChange: '&',
				setdisable: '='
			},
			link: function(scope){
				scope.change = function (that, event) {
					if (_.isFunction(scope.onChange)) {
						scope.ngModel = !scope.ngModel;
						scope.onChange()(that, event);
					}
				};
			}
		};
	}
})();