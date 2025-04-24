/**
 * Created by chi on 1/31/2018.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('procurementPesAccrualDetailController', procurementPesAccrualDetailController);

	procurementPesAccrualDetailController.$inject = ['$scope', 'platformDetailControllerService', 'procurementPesAccrualDataService',
		'procurementPesAccrualUIStandardService', 'procurementPesTranslationService'];

	function procurementPesAccrualDetailController($scope, platformDetailControllerService, procurementPesAccrualDataService,
		procurementPesAccrualUIStandardService, procurementPesTranslationService) {
		platformDetailControllerService.initDetailController($scope, procurementPesAccrualDataService, {},
			procurementPesAccrualUIStandardService, procurementPesTranslationService);
	}
})(angular);