/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUpdateMaterialPackageService', ['$q', '$http', '$timeout', '$injector', 'platformDialogService', 'platformWizardDialogService',
		function ($q, $http, $timeout, $injector, platformDialogService, platformWizardDialogService) {

			let service = {};
			service.showUpdateMaterialPackageWizardDialog=function(){
				let wzConfig = {
					title$tr$: 'estimate.main.updateMaterialPackageWizard.updateMaterialPackage',
					steps: [{
						id: '168ec8eaefad4b98a66194e7a1bee6d5',
						title: 'Select Estimate Scope',
						title$tr$: 'estimate.main.updateMaterialPackageWizard.selectEstimateScope',
						width: '650px',
						height:'300px',
						disallowBack: false,
						disallowNext: false,
						canFinish: false
					},{
						id: 'f3c1633fd1c44ad8acebb9c545396a7d',
						title: 'Update Package',
						title$tr$: 'estimate.main.updateMaterialPackageWizard.updatePackage',
						width: '900px',
						height:'720px',
						disallowBack: false,
						disallowNext: false,
						canFinish: true
					}],
				};
				platformWizardDialogService.translateWizardConfig(wzConfig);
				let obj = {
					selector: {},
					__selectorSettings: {}
				};
				let dlgConfig = {
					id: '299c743f12bc4a2a8118f96547af8725',
					headerText$tr$: 'estimate.main.updateMaterialPackageWizard.updateMaterialPackage',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/wizard/estimate-main-update-material-package-wizard.html',
					resizeable: true,
					width:'650px',
					height:'300px',
					value: {
						wizard: wzConfig,
						entity:obj,
						wizardName: 'wzdlg1'
					}
				};

				return platformDialogService.showDialog(dlgConfig);
			};

			service.getPackageByEst = function (itemData) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/getPackageByEst',itemData);
			};

			service.updatePackage = function (params) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/updatePackageItem',params);
			};

			service.getDynamicUniqueFields = function getDynamicUniqueFields(ProjectId) {
				return $http.get(globals.webApiBaseUrl + 'basics/costgroupcat/list?projectId='+ProjectId);
			};

			return service;

		}
	]);
})(angular);
