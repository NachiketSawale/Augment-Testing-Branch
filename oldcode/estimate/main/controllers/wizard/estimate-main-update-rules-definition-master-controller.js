/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
     * @ngdoc controller
     * @name estimateMainUpdateRulesDefinitionMasterController
     * @function
     *
     * @description
     * estimateMainUpdateRulesDefinitionMasterController for update rules from Estimate to Master.
     **/
	angular.module(moduleName).controller('estimateMainUpdateRulesDefinitionMasterController',[
		'$http','$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateMainUpdateRulesDefinitionMasterConfigService', 'estimateMainUpdateRulesDefinitionMasterService', 'platformTranslateService','platformRuntimeDataService',

		function ($http,$scope, $translate, $modalInstance, $injector, platformCreateUuid, rulesConfigService, rulesDialogService, platformTranslateService,platformRuntimeDataService) {

			let uniqId = platformCreateUuid();

			$scope.okBtnDisabled = false;

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('estimate.main.updateRules'),
				ok : function (result) {
					let item = $scope.currentItem;
					if(item){
						rulesDialogService.createOrUpdateRules(item);
					}
					$modalInstance.close(result);
				},
				close : function () {
					$modalInstance.dismiss('cancel');
				},
				cancel : function () {
					$modalInstance.dismiss('cancel');
				}
			};

			$scope.change = function change(entity,model) {
				if(model === 'isCreateUpdateRule'){
					if (entity.isCreateUpdateRule === 'IsCreateRule') {
						$scope.okBtnDisabled= true;
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'Description', readonly: false}]);
					}
					if (entity.isCreateUpdateRule === 'IsUpdateRule') {
						$scope.okBtnDisabled= false;
						entity.__rt$data.errors = null;
						entity.Code = '';
						entity.Description = '';
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
						platformRuntimeDataService.readonly(entity, [{field: 'Description', readonly: true}]);
					}
				}

				if (entity.Code && entity.Code !== '' && entity.Code!== null) {
					$scope.okBtnDisabled = !!(entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors.Code !== null);
				}
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: rulesConfigService.getFormConfig(),
					validationMethod: function(){return true;}
				}
			};
			platformTranslateService.translateFormContainerOptions($scope.formContainerOptions);
			$scope.currentItem = rulesDialogService.getCurrentItem();

			$scope.$on('$destroy', function () {
				$scope.currentItem = {};
			});
		}
	]);
})(angular);
