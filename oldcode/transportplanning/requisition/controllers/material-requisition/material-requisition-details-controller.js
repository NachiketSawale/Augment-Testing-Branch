/**
 * Created by anl on 11/14/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	RequisitionModul.controller('transportplanningRequisitionMatRequisitionDetailsController', MatRequisitionDetailsController);
	MatRequisitionDetailsController.$inject = ['$scope',
		'platformContainerControllerService',
		'transportplanningRequisitionTranslationService'];

	function MatRequisitionDetailsController($scope,
											 platformContainerControllerService,
											 translationService) {


		var containerUid = $scope.getContentValue('uuid');
		var moduleName_ = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, moduleName_, containerUid, translationService);
	}
})(angular);