(function () {
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).controller('basicsCustomizeEmailSettingsListController',
		['$scope', 'platformTranslateService', 'basicsCustomizeEmailServerConfigurationService', 'platformDialogService', '$translate', '_',
			function ($scope, platformTranslateService, basicsCustomizeEmailServerConfigurationService, platformDialogService, $translate, _) {
				let data = $scope.dialog ? $scope.dialog.modalOptions.value : $scope.modalOptions.value;

				function getDisabledMember() {
					return data.itemDisabledMember || 'disabled';
				}

				function testConnection(entity){
					$scope.isLoading = true;
					$scope.loadingMessage = $translate.instant('basics.customize.emailServer.messages.testOngoing');
					basicsCustomizeEmailServerConfigurationService.testEmailConnection(_.cloneDeep($scope.selectedItem)).then(function (result){
						if(result.data){
							if(result.data.Success){
								platformDialogService.showMsgBox('basics.customize.emailServer.messages.testConnectionSuccess', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
							}else{
								platformDialogService.showMsgBox(result.data.Message, 'basics.customize.emailServer.dialogTitle.testConnection', 'error');
							}
						}

						$scope.isLoading = false;
					}, function (){
						$scope.isLoading = false;
					});
				}

				$scope.nameProperty = $scope.dialog.modalOptions.value.itemDisplayMember || 'Name';
				$scope.displayedItems = $scope.dialog.modalOptions.value.items;
				$scope.formOptions = {
					configure : basicsCustomizeEmailServerConfigurationService.getDefaultForm(testConnection)
				};
				platformTranslateService.translateFormConfig($scope.formOptions.configure);
				$scope.selectedItem = $scope.dialog.modalOptions.value.selectedItem;

				$scope.selectItem = function (item){
					$scope.selectedItem = item;
				};

				$scope.getItemName = function (item){
					return item.Name + ((item.IsDefault) ? ' (*)' : '');
				};

				$scope.isDisabled = function (item){
					if (item && item.hasOwnProperty(getDisabledMember())) {
						return item[getDisabledMember()];
					} else {
						return false;
					}
				};
			}
		]);
})();