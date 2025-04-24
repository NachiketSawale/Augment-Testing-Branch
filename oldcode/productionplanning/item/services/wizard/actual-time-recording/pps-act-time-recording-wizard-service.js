/**
 * Created by zwz on 01/06/2023.
 */

(function (angular) {
	'use strict';
	/* global _ moment globals */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningActualTimeRecordingWizardService', WizardService);
	WizardService.$inject = ['$http', '$translate', '$injector', 'platformModalService', 'productionplanningActualTimeRecordingWizardStepsService'];

	function WizardService($http, $translate, $injector, platformModalService, wizardStepsService) {
		let service = {};
		service.initial = function initial(scope, options) {
			scope.title = $translate.instant('productionplanning.item.wizard.actualTimeRecording.title');
			scope.isBusy = false;
			scope.context = {
				date : moment.utc(options.date),
				siteId: options.siteId,
				timeSymbolId : options.timeSymbolId,
			};
			scope.steps = [
				{
					url: 'productionplanning.item/templates/pps-act-time-recording-wizard-step1-time-assgn.html',
					service: 'productionplanningActualTimeRecordingWizardStep1TimeAssignmentService',
					title: $translate.instant('productionplanning.item.wizard.actualTimeRecording.employeeAreaActionAssgnStepTitle'),
					isInitialized: true
				},
				{
					url: 'productionplanning.item/templates/pps-act-time-recording-wizard-step2-prod-assgn.html',
					service: 'productionplanningActualTimeRecordingWizardStep2ProductAssignmentService',
					title: $translate.instant('productionplanning.item.wizard.actualTimeRecording.prodAssgnStepTitle'),
				}
			];

			wizardStepsService.initialize(scope, finish);

			scope.$on('$destroy', function () {
			});

			_.extend(scope.modalOptions, {
				cancel: close
			});

			function close() {
				scope.$emit('actual-time-reporting-wizard-is-closing');
				return scope.$close(false);
			}

			function finish(step2Service) {
				step2Service.setLoadingStatus(true);
				const step1Service = $injector.get('ppsActualTimeRecordingTimeAssignmentDataService');

				Promise.all([step1Service.update(), step2Service.doUpdate()]).then(() => {
					step2Service.setLoadingStatus(false);
					step2Service.showUpdatedDialog();
					close();
				});
			}
		};

		return service;
	}

})(angular);
