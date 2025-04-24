/**
 * Created by reimer on 15.01.2018.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigWizardGroupListController
	 * @function
	 *
	 * @description
	 *
	 **/
	angModule.controller('basicsConfigAuditContainerListController', basicsConfigAuditContainerListController);

	basicsConfigAuditContainerListController.$inject = ['$scope',
		'basicsConfigAuditContainerService',
		'basicsConfigAuditContainerUIService',
		'basicsConfigWizardGroupValidationService',
		'platformGridControllerService'];

	function basicsConfigAuditContainerListController($scope,
	                                                  parentService,
	                                                  uiService,
	                                                  validationService,
	                                                  platformGridControllerService) {


		var myGridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope,
			uiService,
			parentService,
			validationService,
			myGridConfig);

	}
})();