/**
 * Created by ltn on 11/3/2016.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.main').controller('renumberFreeBoqWizardController',
		['$scope', '$translate',
			function ($scope, $translate) {

				$scope.options = $scope.$parent.modalOptions;
				var allBoQs = $scope.$parent.modalOptions.selectBoQs;
				var eachBoQ = $scope.$parent.modalOptions.eachBoQ;
				var currentPrj = $scope.$parent.modalOptions.currentPrj;

				angular.extend($scope.options, {
					body: {
						selectedBoQ: $translate.instant('boq.main.renumberSelectedBoq'),
						allBoQs: allBoQs,
						eachBoQ: eachBoQ,
						currentPrj: currentPrj,
						radioSelect: 'selectedBoQ',
						withinSelect: 'eachBoQ'
					},
					onOK: function () {
						var sendData = {ok: true};
						if ($scope.options.body.radioSelect === 'selectedBoQ') {
							sendData.isRenumberCurrent = true;
						} else {
							sendData.isRenumberCurrent = false;
						}
						if ($scope.options.body.withinSelect === 'eachBoQ') {
							sendData.isWithinBoq = true;
						} else {
							sendData.isWithinBoq = false;
						}
						$scope.$close(sendData);
					}
				});
			}]);
})(angular);