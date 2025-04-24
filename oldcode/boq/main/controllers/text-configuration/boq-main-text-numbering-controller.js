/**
 * Created by lnt on 5/11/2017.
 */
(function () {
	/* global */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainTextNumberingController', ['$scope', '$translate', 'boqMainTextGridService',
		function ($scope, $translate, boqMainTextGridService) {

			// Text Numbering
			$scope.textNumberingList = [
				{Id: 1, Description: $translate.instant('boq.main.Digit')},
				{Id: 2, Description: $translate.instant('boq.main.Lowercase')},
				{Id: 3, Description: $translate.instant('boq.main.Uppercase')},
				{Id: 4, Description: $translate.instant('boq.main.None')}
			];

			$scope.textNumbering = {};
			$scope.textNumbering.current = $scope.textNumberingList[0];

			$scope.textNumberingChanged = function textNumberingChanged(selectedTextNumbering) {
				boqMainTextGridService.setSelectedNumberingId(selectedTextNumbering.Id);
			};

			$scope.textNumberingOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.textNumberingList
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})();
