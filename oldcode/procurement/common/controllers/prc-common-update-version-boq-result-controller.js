/**
 * Created by miu on 12/29/2021.
 */

(function (angular) {

	'use strict';

	let moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonUpdateVersionBoqResultController', [
		'_', '$scope', '$translate',
		function (_, $scope, $translate) {
			let targetModules = ['requisition', 'quotation', 'contract', 'pes'];
			let resultData = $scope.modalOptions.data;

			let options = {};
			options.titleMessage = $translate.instant('procurement.common.wizard.updateVersionBoQ.successMsg');
			options.successEntityCodes = [];
			_.forEach(targetModules, function (key) {
				let processResult = _.find(resultData.processResults, function (item) {
					return item.Module === key;
				});
				options[key] = processResult ? processResult.SuccessLeadEntitys.length : 0;
				if (processResult) {
					_.forEach(processResult.SuccessLeadEntitys, function (entity) {
						options.successEntityCodes.push(entity.Code);
					});
				}
			});
			options.successEntityCodes = options.successEntityCodes.join(';');
			$scope.modalOptions = _.extend($scope.modalOptions, options);
			$scope.modalOptions.showCodes = true;
			$scope.modalOptions.toggleOpen = function () {
				$scope.modalOptions.showCodes = !$scope.modalOptions.showCodes;
			};

			// eslint-disable-next-line no-unused-vars
			$scope.ok = function (success) {
				$scope.$parent.$close(false);
			};
		}
	]);
})(angular);