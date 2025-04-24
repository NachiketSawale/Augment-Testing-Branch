/**
 * Created by baf on 03.10.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc controller
	 * @name resourceSkillChainDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource skill chain entities.
	 **/
	angular.module(moduleName).controller('resourceSkillChainDetailController', ResourceSkillChainDetailController);

	ResourceSkillChainDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceSkillChainDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '41057af6965043cfaab9bb267b239061');
	}

})(angular);