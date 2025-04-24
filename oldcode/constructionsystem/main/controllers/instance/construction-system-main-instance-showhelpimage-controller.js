(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('constructionSystemMainInstanceShowHelpImageController', [
		'$scope','$http','constructionSystemMainInstanceGetHelpImageService','constructionSystemMainInstanceService',
		function ($scope,$http,constructionSystemMainInstanceGetHelpImageService,constructionSystemMainInstanceService) {
			$scope.path = globals.appBaseUrl;
			$scope.modalTitle = constructionSystemMainInstanceGetHelpImageService.getDialogTitle();
			var data = constructionSystemMainInstanceService.getSelected();
			$http.get(globals.webApiBaseUrl + 'constructionsystem/master/help/getblobimage?instanceId='+ data.Id + '&instanceHeaderFk=' + data.InstanceHeaderFk)
				.then(function(response){
					// dataValue = response.data;
					$scope.dataItem =response.data;
				});// constructionSystemMainInstanceGetHelpImageService.getDataItem();


			var formConfig = constructionSystemMainInstanceGetHelpImageService.getFormConfiguration();

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			/* $scope.onOK = function () {
                $scope.dataItem.selectedRisks = constructionSystemMasterHelpService.getSelectedEntities();
                console.log('Results of scope from dialog',$scope);
                $scope.$close({ok: true, data: $scope.dataItem});
            };

            $scope.onCancel = function () {
                $scope.dataItem.__rt$data.errors = null;
                $scope.$close({});
            }; */

			$scope.onClose = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})(angular);
