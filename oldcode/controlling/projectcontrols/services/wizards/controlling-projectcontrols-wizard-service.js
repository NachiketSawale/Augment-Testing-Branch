
(function () {

	'use strict';
	var moduleName = 'controlling.projectcontrols';
	/**
	 * @ngdoc factory
	 * @name controllingProjectcontrolsSidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all controlling projectcontrols wizards
	 */
	angular.module(moduleName).factory('controllingProjectcontrolsSidebarWizardService',
		['globals', 'platformModalService', '$translate', '$injector', 'controllingProjectcontrolsProjectMainListDataService', '$http',
			function (globals, platformModalService, $translate, $injector, controllingProjectcontrolsProjectMainListDataService, $http) {

				var service = {};

				// wizard functions
				service.controllingDataTrans = function controllingDataTrans() {
					let option = {
						project: controllingProjectcontrolsProjectMainListDataService.getSelected(),
						controllingVersionDataService: $injector.get('controllingProjectcontrolsControllingVersionListDataService')
					};

					$injector.get('controllingStructureTransferDataToBisDataService').showTransferToBisWizard(option);
				};

				service.resetData = function resetData() {
					platformModalService.showDialog ({
						templateUrl: globals.appBaseUrl + 'controlling.projectcontrols/templates/controlling-projectcontrols-reset-data.html',
						backdrop: false,
						windowClass: 'form-modal-dialog',
						width: 800,
						title: $translate.instant('controlling.projectcontrols.resetData'),
					}).then (function (result) {
						if (!result || !result.ok || !_.isArray(result.data) || result.data.length < 1) {
							return;
						}
						let SelectedFormulaIds = [];
						_.forEach(result.data, function(formula){
							if(formula.isSelected){
								SelectedFormulaIds.push(formula.rid);
							}
						});
						if(SelectedFormulaIds.length < 0){
							return;
						}
						let controllingProjectcontrolsDashboardService = $injector.get('controllingProjectcontrolsDashboardService');
						let selectVersion = controllingProjectcontrolsDashboardService.getHistoryVersions();

						if(!selectVersion || selectVersion.ribHistoryId < 0){
							return;
						}

						let request = {
							'RibHistoryId': selectVersion.ribPrjHistroyKey,
							'SelectedFormulaIds':SelectedFormulaIds
						};

						$http.post(globals.webApiBaseUrl + 'controlling/projectcontrols/dashboard/resetdata', request).then(function(){
							controllingProjectcontrolsDashboardService.load();
						});
					});
				};

				return service;
			}
		]);
})();
