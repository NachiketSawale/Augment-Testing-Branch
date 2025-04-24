/**
 * Created by lal on 2018-07-02.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwo.mtwoControlTowerConfigurationDetailController
	 * @require $scoep
	 * @description MtwoControlTowerConfigurationDetailController controller for mtwo ControlTowerconfiguration detail  controller
	 *
	 */
	var moduleName = 'mtwo.controltowerconfiguration';
	angular.module(moduleName).value('controltowerConfigurationDetailConfig', {groups: [], rows: []});

	angular.module(moduleName).controller('mtwoControlTowerConfigurationDetailController', MtwoControlTowerConfigurationDetailController);

	MtwoControlTowerConfigurationDetailController.$inject = [
		'$scope',
		'platformGridAPI',
		'platformCreateUuid',
		'platformDetailControllerService',
		'mtwoControlTowerConfigurationMainService',
		'mtwoControlTowerConfigurationStandardConfigurationService',
		'mtwoControlTowerConfigurationValidationService',
		'mtwoControlTowerConfigurationTranslationService'];

	function MtwoControlTowerConfigurationDetailController(
		$scope,
		platformGridAPI,
		platformCreateUuid,
		platformDetailControllerService,
		mtwoControlTowerConfigurationMainService,
		mtwoControlTowerConfigurationStandardConfigurationService,
		mtwoControlTowerConfigurationValidationService,
		mtwoControlTowerConfigurationTranslationService) {

		platformDetailControllerService.initDetailController($scope, mtwoControlTowerConfigurationMainService, mtwoControlTowerConfigurationValidationService, mtwoControlTowerConfigurationStandardConfigurationService, mtwoControlTowerConfigurationTranslationService);

		$scope.change = function change() {
			mtwoControlTowerConfigurationMainService.gridRefresh();
		};


	}
})(angular);
