/**
 * Created by sandu on 28.01.2016.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigWizardXGroupPValueListController
	 * @function
	 *
	 * @description
	 * Controller for the wizardXgrouppvalue list view
	 **/
	angModule.controller('basicsConfigWizardXGroupPValueListController', basicsConfigWizardXGroupPValueListController);

	basicsConfigWizardXGroupPValueListController.$inject = ['$scope', 'basicsConfigWizardXGroupPValueService', 'basicsConfigWizardXGroupPValueUIService',
		'basicsConfigWizardXGroupPValueValidationService', 'platformGridControllerService','$translate'];

	function basicsConfigWizardXGroupPValueListController($scope, basicsConfigWizardXGroupPValueService, basicsConfigWizardXGroupPValueUIService,
	                                                      basicsConfigWizardXGroupPValueValidationService, platformGridControllerService, $translate) {

		var myGridConfig = {initCalled: false, columns: []};

		var toolbarItems = [
			{
				id: 't1',
				caption: $translate.instant('basics.config.parameterAdjustment'),
				type: 'item',
				cssClass: 'tlb-icons ico-db-update',
				fn: basicsConfigWizardXGroupPValueService.adjustParameters,
				disabled: ''
			}
		];

		platformGridControllerService.initListController($scope, basicsConfigWizardXGroupPValueUIService, basicsConfigWizardXGroupPValueService, basicsConfigWizardXGroupPValueValidationService, myGridConfig);
		platformGridControllerService.addTools(toolbarItems);

	}
})();