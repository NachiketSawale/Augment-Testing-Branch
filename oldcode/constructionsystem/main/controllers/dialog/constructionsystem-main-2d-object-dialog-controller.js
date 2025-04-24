/**
 * Created by lvy on 3/10/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('cosMain2dObjectAndPropertyDialogController', [
		'$scope',
		'$rootScope',
		'$timeout',
		'$translate',
		'constructionSystemMainInstanceService',
		'constructionSystemMainObjectTemplateDialogService',
		'constructionSystemMainObjectTemplatePropertyDialogService',
		'constructionSystemMainObjectTemplateDataService',
		'constructionSystemMainObjectTemplatePropertyDataService',
		'platformDataServiceModificationTrackingExtension',
		function ($scope,
			$rootScope,
			$timeout,
			$translate,
			parentService,
			constructionSystemMainObjectTemplateDialogService,
			constructionSystemMainObjectTemplatePropertyDialogService,
			constructionSystemMainObjectTemplateDataService,
			constructionSystemMainObjectTemplatePropertyDataService,
			platformDataServiceModificationTrackingExtension) {

			$scope.options = $scope.$parent.modalOptions;

			$scope.modalOptions = {
				headerText: $translate.instant('constructionsystem.main.title2dObjectAndPropertyDialog'),
				code: $scope.options.selectedInstance.Code,
				desc: $scope.options.selectedInstance.DescriptionInfo.Translated
			};

			$scope.modalOptions.ok = function onOK() {
				var hasModified = checkIsModify();
				if (hasModified) {
					parentService.update().then(function () {
						constructionSystemMainObjectTemplatePropertyDataService.setIsUseCache(false);
						constructionSystemMainObjectTemplatePropertyDataService.removeCache();
						constructionSystemMainObjectTemplatePropertyDialogService.setList([]);
						constructionSystemMainObjectTemplateDataService.load();
						$scope.$close(false);
					});
				}
				else {
					$scope.$close(false);
					constructionSystemMainObjectTemplatePropertyDataService.setIsUseCache(false);
					constructionSystemMainObjectTemplatePropertyDialogService.setList([]);
				}
			};
			$scope.modalOptions.close = function onCancel() {
				var hasModified = checkIsModify();
				if (hasModified) {
					platformDataServiceModificationTrackingExtension.clearModificationsInRoot(parentService);
				}
				constructionSystemMainObjectTemplatePropertyDataService.setIsUseCache(false);
				constructionSystemMainObjectTemplatePropertyDialogService.setList([]);
				$scope.$close(false);
			};
			$scope.modalOptions.cancel = $scope.modalOptions.close;
			constructionSystemMainObjectTemplateDialogService.load();

			function checkIsModify() {
				var updateData = platformDataServiceModificationTrackingExtension.getModifications(parentService);
				var hasModified = false;
				var objectTemplateToSave = null;
				if (Object.prototype.hasOwnProperty.call(updateData,'CosInsObjectTemplateToDelete') && updateData.CosInsObjectTemplateToDelete.length) {
					hasModified = true;
				}
				else if (Object.prototype.hasOwnProperty.call(updateData,'CosInsObjectTemplateToSave') && updateData.CosInsObjectTemplateToSave.length) {
					objectTemplateToSave = updateData.CosInsObjectTemplateToSave[0];
					if ((Object.prototype.hasOwnProperty.call(objectTemplateToSave,'CosInsObjectTemplate') &&
                        objectTemplateToSave.CosInsObjectTemplate) ||
                        (Object.prototype.hasOwnProperty.call(objectTemplateToSave,'CosInsObjectTemplatePropertyToSave') &&
                        objectTemplateToSave.CosInsObjectTemplatePropertyToSave.length) ||
                        (Object.prototype.hasOwnProperty.call(objectTemplateToSave,'CosInsObjectTemplatePropertyToDelete') &&
                        objectTemplateToSave.CosInsObjectTemplatePropertyToDelete.length)) {
						hasModified = true;
					}
				}
				return hasModified;
			}
		}]);

	angular.module(moduleName).controller('cosMainObjectTemplateDialogController', [
		'$injector',
		'$scope',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'platformGridControllerService',
		'constructionSystemMainObjectTemplateUIStandardService',
		'constructionSystemMainObjectTemplateDialogService',
		'constructionSystemMainObjectTemplateValidationService',
		'constructionSystemMainObjectTemplateCostGroupService',
		function ($injector,
			$scope,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			gridControllerService,
			gridColumns,
			dataService,
			validationService,
			constructionSystemMainObjectTemplateCostGroupService) {
			basicsCommonDialogGridControllerService.initListController($scope, gridColumns, dataService, validationService, {
				costGroupService: constructionSystemMainObjectTemplateCostGroupService,
				initCalled: false,
				columns: [],
				uuid: 'B87836F929D846F98B01885979EBB943',
				skipPermissionCheck: true

			});

		}]);

	angular.module(moduleName).controller('cosMainObjectTemplatePropertyDialogController', [
		'$scope',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'constructionSystemMainObjectTemplatePropertyUIStandardService',
		'constructionSystemMainObjectTemplatePropertyDialogService',
		'constructionSystemMainObjectTemplatePropertyValidationService',
		function ($scope,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			gridColumns,
			dataService,
			validationService) {
			basicsCommonDialogGridControllerService.initListController($scope, gridColumns, dataService, validationService, {
				initCalled: false,
				columns: [],
				uuid: '0EBD079568AD40C29D56B8804137F7F4',
				skipPermissionCheck: true
			});

		}]);
})(angular);