/**
 * Created by reimer on 07.09.2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.userform';

	/* jshint -W072 */
	angular.module(moduleName).factory('basicsUserFormFormDataWizardService', [
		'basicsCommonChangeStatusService',
		'platformModalService',
		function (
			basicsCommonChangeStatusService,
			platformModalService) {

			var service = {};

			service.changeFormDataStatus = function (param, userParam) {

				if (!userParam) {
					showInfo('Please first select a data entity!');
					return;
				}

				var inst = basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						// projectField: 'ProjectFk',
						statusName: 'formdata',
						mainService: userParam.mainService,
						dataService: userParam.dataService,
						statusField: 'FormDataStatusFk',
						codeField: 'Description',
						descField: 'Description',
						title: 'Change Form Data Status',
						updateUrl: 'basics/userform/data/changestatus',
						id: 123
					}
				);
				inst.fn();

			};

			function showInfo(message) {
				var modalOptions = {
					headerTextKey: 'Info',
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			}

			return service;

		}]);
})(angular);