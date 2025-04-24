
(function (angular) {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigDataConfigurationController
	 * @function
	 *
	 * @description
	 * Controller for the list view of module table info default entities.
	 **/

	angular.module(moduleName).controller('basicsConfigDataConfigurationController', BasicsConfigDataConfigurationController);

	BasicsConfigDataConfigurationController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigModuleTableInformationDataService',
		'basicsConfigDataConfigurationColumnUIService', 'basicsConfigDataConfigurationValidationService', 'basicsConfigConfigurableTableDataService'];

	function BasicsConfigDataConfigurationController($scope, platformGridControllerService, basicsConfigModuleTableInformationDataService,
		basicsConfigDataConfigurationColumnUIService, basicsConfigDataConfigurationValidationService, basicsConfigConfigurableTableDataService) {

		var myGridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope,  basicsConfigDataConfigurationColumnUIService, basicsConfigModuleTableInformationDataService, basicsConfigDataConfigurationValidationService, myGridConfig);

		if (basicsConfigConfigurableTableDataService.addUsingContainer) {
			basicsConfigConfigurableTableDataService.addUsingContainer($scope.gridId);
		}

		$scope.$on('$destroy', function () {
			if (basicsConfigConfigurableTableDataService.removeUsingContainer) {
				basicsConfigConfigurableTableDataService.removeUsingContainer($scope.gridId);
			}
		});
	}
})(angular);