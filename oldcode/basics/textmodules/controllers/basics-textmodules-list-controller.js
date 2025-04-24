/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.textmodules';

	/**
     * @ngdoc controller
     * @name basicsTextModulesListController
     * @function
     * @description
     * Controller for the  list view of Text Modules entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsTextModulesListController',
		['$scope', 'platformGridControllerService', 'basicsTextModulesMainService', 'basicsTextModulesStandardConfigurationService', 'basicsTextModulesValidationService',
			function ($scope, platformGridControllerService, basicsTextModulesMainService,  basicsTextModulesStandardConfigurationService, basicsTextModulesValidationService) {

				let myGridConfig = { initCalled: false, columns: [],
					rowChangeCallBack: function rowChangeCallBack(){
						let selectedTextModule = basicsTextModulesMainService.getSelected();
						if(selectedTextModule){
							basicsTextModulesMainService.onSelectedTextModuleChange(selectedTextModule);
						}
					}
				};
				platformGridControllerService.initListController($scope, basicsTextModulesStandardConfigurationService, basicsTextModulesMainService, basicsTextModulesValidationService, myGridConfig);
			}
		]);
})(angular);
