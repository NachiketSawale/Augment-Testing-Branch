/**
 * Created by lnt on 5/11/2017.
 */
(function () {
	/* global */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainTextCombinationController', ['$scope', '$translate', 'boqMainTextGridService',
		function ($scope, $translate, boqMainTextGridService) {

			// Text Combination
			$scope.textCombinationList = [
				{Id: 1, Description: $translate.instant('boq.main.CombinationDetail')},
				{Id: 2, Description: $translate.instant('boq.main.DescriptionPostfix')},
				{Id: 3, Description: $translate.instant('boq.main.DetailPostfix')}
			];

			$scope.textCombination = {};
			$scope.textCombination.current = $scope.textCombinationList[0];

			$scope.textCombinationChanged = function textCombinationChanged(selectedTextCombination) {
				boqMainTextGridService.setSelectedCombinationId(selectedTextCombination.Id);
			};

			$scope.textCombinationOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.textCombinationList
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})();
