/**
 * Created by aljami on 13.06.2022
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name usermanagementRightAssignCategoryDialogController
	 * @function
	 *
	 * @description
	 * Controller for the assign category wizard
	 **/
	angular.module('usermanagement.right').controller('usermanagementRightAssignCategoryDialogController', usermanagementRightAssignCategoryDialogController);

	usermanagementRightAssignCategoryDialogController.$inject = ['$scope', '$translate', 'usermanagementRightMainService', '$http', '_'];

	function usermanagementRightAssignCategoryDialogController($scope, $translate, usermanagementRightService, $http, _) { // jshint ignore:line

		//$scope.selectedState = 2;

		$scope.selectedCategory = null;
		$scope.rolesCount = $scope.dialog.modalOptions.value.selectedRoles.length;
		$scope.selectedRoles = $scope.dialog.modalOptions.value.selectedRoles;
		$scope.categories = $scope.dialog.modalOptions.value.categories;
		$scope.categoryConfig = {
			valueMember: 'Id',
			displayMember: 'Name',
			items: $scope.categories
		};
		$scope.isShowingConfig = true;
		$scope.loading = false;
		$scope.loadingMessage = $translate.instant('usermanagement.right.dialogAssignCategory.loadingMessage');
		$scope.resultInfo = '';
		$scope.showResultInfo = function (){
			return !$scope.isShowingConfig && !$scope.loading;
		};

		const applyBtn = {
			id: 'apply',
			caption: $translate.instant('usermanagement.right.dialogAssignCategory.btnApply'),
			fn: function (event, info){
				$scope.loading = true;
				let selectedRoleIds = _.map($scope.selectedRoles, 'Id');
				let newCategory = ($scope.selectedCategory === -1) ? null : $scope.selectedCategory;
				$http.post(globals.webApiBaseUrl + 'usermanagement/main/role/updateCategoryBulk', {NewCategory: newCategory, RoleIds: selectedRoleIds}).then(function (updateResult){
					usermanagementRightService.refresh().then(function (refreshed){
						$scope.loading = false;
						$scope.isShowingConfig = false;
						cancelBtn.caption = $translate.instant('usermanagement.right.dialogAssignCategory.btnClose');
						usermanagementRightService.setSelected($scope.selectedRoles);
						if(newCategory !== null){
							if($scope.rolesCount > 1){
								$scope.resultInfo = $translate.instant('usermanagement.right.dialogAssignCategory.resultAssign', {'rolesCount' : $scope.rolesCount, 'categoryName': _.find($scope.categories, function (category){ return category.Id === $scope.selectedCategory;}).Name});
							}else{
								$scope.resultInfo = $translate.instant('usermanagement.right.dialogAssignCategory.resultAssignSingle', {'categoryName': _.find($scope.categories, function (category){ return category.Id === $scope.selectedCategory;}).Name});
							}
						}else{
							if($scope.rolesCount > 1){
								$scope.resultInfo = $translate.instant('usermanagement.right.dialogAssignCategory.resultRemove', {'rolesCount' : $scope.rolesCount});
							}else{
								$scope.resultInfo = $translate.instant('usermanagement.right.dialogAssignCategory.resultRemoveSingle');
							}
						}
					});


				});
			},
			disabled: function (){
				return $scope.selectedCategory === null || $scope.loading || !$scope.isShowingConfig;
			}
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('usermanagement.right.dialogAssignCategory.btnCancel'),
			fn: function (event, info){
				info.$close(false);
			}
		};

		$scope.dialog.buttons = [applyBtn, cancelBtn];
		$scope.setSelectedState = function (value){
			$scope.selectedState = value;
		};

		$scope.$watch('selectedCategory', function (newValue, oldValue){
			if(newValue !== -1){
				applyBtn.caption = $translate.instant('usermanagement.right.dialogAssignCategory.btnApply');
			}else{
				applyBtn.caption = $translate.instant('usermanagement.right.dialogAssignCategory.btnRemove');
			}
		});
	}
})(angular);
