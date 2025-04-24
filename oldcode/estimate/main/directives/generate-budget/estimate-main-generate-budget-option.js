
(function(){
	'use strict';

	angular.module('estimate.main').directive('estimateMainGenerateBudgetOption', [function (){
		return {
			restrict: 'A',
			template:
				'<div ng-repeat="saOption in entity.StandardAllowanceOption">' +
				'   <div style="margin-top:6px">' +
				'       <input type="checkbox" ng-model="saOption.checked" ng-click="updateSelection($index+1)" class="ng-pristine ng-valid ng-empty ng-touched" style="margin:4px 11px 0 0" />' +
				'       {{saOption.Description}}' +
				'   </div>' +
				'</div>',
			controller: ['$scope', function ($scope) {
				$scope.entity = $scope.entity || {};

				$scope.updateSelection = function(position) {
					if(position === 0){
						$scope.entity.StandardAllowanceOption = !$scope.entity.StandardAllowanceOption;
					}else {
						angular.forEach($scope.entity.StandardAllowanceOption, function (saOption, index) {
							if (position - 1 === index){
								saOption.checked = !saOption.checked;
							}
						});
					}
				};

				$scope.$on('$destroy', function () {
				});

			}]
		};
	}]);

})();