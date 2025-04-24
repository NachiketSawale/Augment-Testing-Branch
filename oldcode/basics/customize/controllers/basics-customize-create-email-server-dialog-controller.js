(function () {
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).controller('basicsCustomizeCreateEmailServerDialogController',
		['$scope', 'platformTranslateService', 'basicsCustomizeEmailServerConfigurationService', 'platformDialogService', '$translate', '_',
			function ($scope, platformTranslateService, basicsCustomizeEmailServerConfigurationService, platformDialogService, $translate, _) {
				let data = $scope.dialog ? $scope.dialog.modalOptions.value : $scope.modalOptions.value;

				function testConnection(entity){
					$scope.isLoading = true;
					$scope.loadingMessage = $scope.messages.testOngoing;
					basicsCustomizeEmailServerConfigurationService.testEmailConnection(_.cloneDeep($scope.selectedItem)).then(function (result){
						$scope.isLoading = false;
						if(result && result.data && result.data){
							if(result.data.Success){
								platformDialogService.showMsgBox('basics.customize.emailServer.messages.testConnectionSuccess', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
							}else{
								platformDialogService.showMsgBox(result.data.Message, 'basics.customize.emailServer.dialogTitle.testConnection', 'error');
							}
						}
					}, function (){
						$scope.isLoading = false;
					});
				}

				$scope.messages = {
					testOngoing: $translate.instant('basics.customize.emailServer.messages.testOngoing'),
					createOngoing: $translate.instant('basics.customize.emailServer.messages.createOngoing'),
				};

				const saveBtn = {
					id: 'create',
					caption: $translate.instant('basics.customize.emailServer.button.btnCreate'),
					fn: function ($event, info) {
						$scope.isLoading = true;
						$scope.loadingMessage = $scope.messages.createOngoing;
						basicsCustomizeEmailServerConfigurationService.saveNewlyCreatedServer($scope.selectedItem).then(function (result){
							$scope.isLoading = false;
							if(result){
								info.$close();
							}

						}, function (result){
							$scope.isLoading = false;
						});
					}
				};

				$scope.formOptions = {
					configure : basicsCustomizeEmailServerConfigurationService.getDefaultForm(testConnection)
				};

				$scope.selectedItem = $scope.dialog.modalOptions.value.selectedItem;

				$scope.dialog.buttons = [
					saveBtn
				];

				platformTranslateService.translateFormConfig($scope.formOptions.configure);

			}
		]);
})();