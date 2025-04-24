/**
 * Created by anl on 11/19/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionSynchronizeWizardController', SynchronizeWizardController);
	SynchronizeWizardController.$inject = ['$scope', '$http',
		'transportplanningRequisitionSynchronizeWizardService', '$translate'];

	function SynchronizeWizardController($scope, $http,
										 requisitionSynchronizeWizardService, $translate) {


		$scope.handleOK = function () {
			// var synList = _.filter($scope.gridData.config.data, function (synEntity) {
			// 	return synEntity.ReqItemUpdate || synEntity.Synchronize || synEntity.CreateItem || synEntity.DeleteItem;
			// });
			var synList = requisitionSynchronizeWizardService.getSynList();
			var request = {Requisition: $scope.formOptions.entity, SynList: synList};
			var url = globals.webApiBaseUrl + 'transportplanning/requisition/wizard/syntrsrequisition';
			$http.post(url, request).then(function () {
				$scope.onCancel();
			});
		};

		$scope.onCancel = function () {
			$scope.$dismiss('cancel');
		};

		requisitionSynchronizeWizardService.initDialog($scope, 'Transport-Requisition');

		$scope.modalOptions = {
			headerText: $translate.instant($scope.title),
			cancel: $scope.onCancel
		};

		$scope.$on('$destroy', function () {
			requisitionSynchronizeWizardService.destroyTabs();
		});

	}

})(angular);