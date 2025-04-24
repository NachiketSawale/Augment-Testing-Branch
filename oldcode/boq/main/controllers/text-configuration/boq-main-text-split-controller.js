/**
 * Created by lnt on 5/11/2017.
 */
(function () {
	/* global */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainTextSplitController', ['$scope', '$translate', 'boqMainTextGridService',
		function ($scope, $translate, boqMainTextGridService) {

			// Text Split
			$scope.textSplitList = [
				{Id: 1, Description: $translate.instant('boq.main.WithLinefeed')},
				{Id: 2, Description: $translate.instant('boq.main.WithComma')},
				{Id: 3, Description: $translate.instant('boq.main.CommaRound')}
			];

			$scope.textSplit = {};
			$scope.textSplit.current = $scope.textSplitList[0];

			$scope.textSplitChanged = function textSplitChanged(selectedTextSplit) {
				boqMainTextGridService.setSelectedSplitId(selectedTextSplit.Id);
			};

			$scope.textSplitOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.textSplitList
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})();
