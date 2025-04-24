/**
 * Created by lnt on 5/11/2017.
 */
(function (angular) {
	/* global */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainTextTypeController', ['$scope', '$translate', 'boqMainTextGridService',
		function ($scope, $translate, boqMainTextGridService) {

			$scope.config = {};
			$scope.config.selectConfig = {readonly: true};

			// Text Type
			$scope.textTypeList = [
				{Id: 1, Description: $translate.instant('boq.main.ProjectCharacteristic')},
				{Id: 2, Description: $translate.instant('boq.main.WorkContent')}
			];

			$scope.textType = {};
			$scope.textType.current = $scope.textTypeList[boqMainTextGridService.getSelectedTypeFk() - 1];

			$scope.textTypeChanged = function textTypeChanged(selectedTextType) {
				if (angular.isDefined(selectedTextType) && selectedTextType !== null) {
					boqMainTextGridService.setSelectedTypeFk(selectedTextType.Id);
					boqMainTextGridService.load().then(function () {

					});
				}
			};

			$scope.textTypeOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.textTypeList
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})(angular);
