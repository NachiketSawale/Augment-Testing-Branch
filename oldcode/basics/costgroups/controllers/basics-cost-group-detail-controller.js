/**
 * Created by lnt on 8/1/2019.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc controller
	 * @name basicsCostGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics costGroup entities.
	 **/
	angular.module(moduleName).controller('basicsCostGroupDetailController', BasicsCostGroupDetailController);

	BasicsCostGroupDetailController.$inject = ['$scope','$injector', 'platformContainerControllerService'];

	function BasicsCostGroupDetailController($scope,$injector, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ae907fe037404c529b869ac249530084');
		let oldDirty = $scope.formOptions.configure.dirty;
		$scope.formOptions.configure.dirty = function dirty(entity, field, options) {
			if (field === 'LeadQuantityCalc' || field === 'NoLeadQuantity' || field ==='UomFk') {
				$injector.get('basicsCostGroupDataService').calculateQuantity(entity, field);
			}
			if (oldDirty) {
				oldDirty(entity, field, options);
			}
		};
	}

})(angular);