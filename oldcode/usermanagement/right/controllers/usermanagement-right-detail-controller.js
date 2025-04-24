/**
 * Created by sandu on 28.09.2015.
 */
(function (angular) {

	'use strict';

	/**
     * @ngdoc controller
     * @name usermanagementRightDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of reportgroup entities.
     **/
	angular.module('usermanagement.right').controller('usermanagementRightDetailController', usermanagementRightDetailController);

	usermanagementRightDetailController.$inject = ['$scope', 'usermanagementRightService', 'platformDetailControllerService', 'usermanagementRightDescriptorStructureUIService',  'usermanagementRightTranslationService','usermanagementRightValidationService'];

	function usermanagementRightDetailController($scope, usermanagementRightService, platformDetailControllerService, usermanagementRightDescriptorStructureUIService, usermanagementRightTranslationService, usermanagementRightValidationService) {

		platformDetailControllerService.initDetailController($scope, usermanagementRightService, usermanagementRightValidationService, usermanagementRightDescriptorStructureUIService,usermanagementRightTranslationService);

		delete $scope.formContainerOptions.createBtnConfig;
		delete $scope.formContainerOptions.createChildBtnConfig;
	}
})(angular);