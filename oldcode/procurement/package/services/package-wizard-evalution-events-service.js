/**
 * Created by wwa on 1/20/2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackageWizardEvalutionEventsService',
		['$q', '$http', 'procurementPackageDataService', 'platformModalService', 'procurementPackageEventService',
			'basicsLookupdataLookupDescriptorService', 'procurementModuleName',
			function ($q, $http, packageDataService, platformModalService, procurementPackageEventService,
				lookupDescriptorService, procurementModuleName) {

				var service = {}, self = this;

				self.handleOk = function (result) {
					evalution(result).then(function (res) {
						platformModalService.showMsgBox('procurement.package.wizard.evaluationEvents.loadSuccessedMessage', 'procurement.package.wizard.evaluationEvents.caption', 'info');
						var option = {
							moduleName: procurementModuleName.packageModule,
							leadingService: packageDataService
						};
						var packageEventService = procurementPackageEventService.getProcurementEventService(option);
						packageEventService.loadSubItemList();
						packageDataService.mergeMainEvent(res.data);
					});
				};

				function evalution(radioSelect) {
					var selected = packageDataService.getSelected();
					return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/evaluateevent', {
						MainItemId: selected.Id,
						StructureFk: selected.StructureFk,
						ProjectFk: radioSelect.ProjectFk
					});
				}

				service.getProjectInfo = function (projectId) {
					var projectItem = _.find(lookupDescriptorService.getData('project'), {Id: projectId});
					if (projectItem) {
						return projectItem.ProjectNo + '-' + projectItem.ProjectName;
					}
				};

				service.execute = function () {
					var selected = packageDataService.getSelected();
					if (!selected || !selected.Id) {
						platformModalService.showMsgBox('procurement.package.wizard.evaluationEvents.warningMsg', 'procurement.package.wizard.evaluationEvents.updateFailedTitle', 'warning');
						return;
					}

					var modalOptions = {
						PackageFk: selected.Id,
						StructureFk: selected.StructureFk,
						ProjectFk: selected.ProjectFk,
						headerTextKey: 'procurement.package.wizard.evaluationEvents.caption',
						templateUrl: globals.appBaseUrl + 'procurement.package/partials/evaluate-events-wizard-partial.html'
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result) {
							self.handleOk(result);
						}
					});
				};

				return service;
			}]);
})(angular);
