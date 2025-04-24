/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUpdatePackageBoqWizardService', estimateMainUpdatePackageBoqWizardService);

	estimateMainUpdatePackageBoqWizardService.$inject = ['globals', 'basicsCommonUniqueFieldsProfileService', 'basicsCommonWizardStepService'];

	function estimateMainUpdatePackageBoqWizardService(globals, basicsCommonUniqueFieldsProfileService, basicsCommonWizardStepService) {
		let service = {};
		let defaultUpdateData = {
			packageFilter: {
				estimateScope: 0,
				selectedIds: null,
				filterRequest: null
			}
		};

		let updateData = null;

		service.execute = execute;
		return service;

		// ///////////////////////

		function execute(filterValue) {
			reset();
			updateData = angular.copy(defaultUpdateData);
			angular.extend(updateData.packageFilter, filterValue);
			let config = buildSteps();
			basicsCommonWizardStepService.start(config);
		}

		function reset() {
			updateData = null;
		}

		function setEstimateScope(value) {
			updateData.packageFilter.estimateScope = value;
		}

		function buildSteps() {
			return {
				titleKey: 'estimate.main.updatePackageBoqWizard.title',
				steps: [
					{
						id: 'estimateScope',
						override: {
							headerTextKey: 'estimate.main.updatePackageBoqWizard.selectScopePage.title',
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-update-package-boq-scope-page.html',
							width: '300px',
							resizeable: false
						},
						customOptions: {
							setEstimateScope: setEstimateScope,
							getEstimateScope : getEstimateScope
						}
					},
					{
						id: 'update',
						override: {
							headerTextKey: 'estimate.main.updatePackageBoqWizard.updatePage.title',
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-update-package-boq-update-page.html',
							width: '1250px'
						},
						customOptions: {
							getPackageFilter: getPackageFilter
						}
					}
				]
			};
		}

		function getEstimateScope() {
			return updateData.packageFilter.estimateScope;
		}

		function getPackageFilter() {
			return updateData.packageFilter;
		}
	}

})(angular);
