/**
 * Created by aljami on 25.04.2022
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name usermanagementUserDisableUserDialogController
	 * @function
	 *
	 * @description
	 * Controller for the  disable users wizard
	 **/
	angular.module('usermanagement.user').controller('usermanagementUserDisableUserDialogController', usermanagementUserDisableUserDialogController);

	usermanagementUserDisableUserDialogController.$inject = ['$scope', '$translate', 'usermanagementUserMainService', '$http', '_', 'usermanagementUserTranslationService', 'usermanagementUserValidationService'];

	function usermanagementUserDisableUserDialogController($scope, $translate, usermanagementUserMainService, $http, _, usermanagementUserTranslationService, usermanagementUserValidationService) { // jshint ignore:line

		$scope.selectedState = 2;
		$scope.labelState = $translate.instant('usermanagement.user.userState');
		$scope.userCount = $scope.dialog.modalOptions.value.selectedUsers.length;
		$scope.selectedUsers = $scope.dialog.modalOptions.value.selectedUsers;
		$scope.isShowingConfig = true;
		$scope.loading = false;
		$scope.loadingMessage = $translate.instant('usermanagement.user.disableUserDialog.loadingMessage');
		$scope.resultInfo = '';
		$scope.showResultInfo = function (){
			return !$scope.isShowingConfig && !$scope.loading;
		};

		const applyBtn = {
			id: 'apply',
			caption: $translate.instant('usermanagement.user.disableUserDialog.btnApply'),
			fn: function (event, info){
				$scope.loading = true;
				if($scope.selectedState === 1){
					$scope.resultInfo = $translate.instant('usermanagement.user.disableUserDialog.resultEnable', {'userCount' : $scope.userCount});
				}else{
					$scope.resultInfo = $translate.instant('usermanagement.user.disableUserDialog.resultDisable', {'userCount' : $scope.userCount});
				}
				$scope.isShowingConfig = false;
				let selectedUsers = $scope.dialog.modalOptions.value.selectedUsers;
				let selectedUserIds = _.map(selectedUsers, 'Id');
				$http.post(globals.webApiBaseUrl + 'usermanagement/main/user/updateStateBulk', {NewState: $scope.selectedState, UserIds: selectedUserIds}).then(function (updateResult){
					usermanagementUserMainService.refresh();
					$scope.loading = false;
					cancelBtn.caption = $translate.instant('usermanagement.user.disableUserDialog.btnClose');
				});
			},
			disabled: function (){
				return $scope.loading || !$scope.isShowingConfig;
			}
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('usermanagement.user.disableUserDialog.btnCancel'),
			fn: function (event, info){
				info.$close(false);
			}
		};

		$scope.dialog.buttons = [applyBtn, cancelBtn];
		$scope.setSelectedState = function (value){
			$scope.selectedState = value;
		};
	}
})(angular);
