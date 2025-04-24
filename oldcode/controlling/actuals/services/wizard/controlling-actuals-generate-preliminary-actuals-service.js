(function () {
	'use strict';

	var angularModule = angular.module('controlling.actuals');

	angularModule.factory('controllingActualsGeneratePreliminaryActualsService', ['globals', '$translate', 'platformModalService',
		function (globals, $translate, platformModalService) {
			var service = {};

			service.showDialog = function showDialog(parentService) {
				var header = parentService.getSelected();
				var modalOptions =
				{
					serviceName: parentService.getServiceName(),
					currentItem: header,
					templateUrl: globals.appBaseUrl + 'controlling.actuals/templates/wizard/controlling-actuals-generate-preliminary-actuals-wizard.html',
					parentService: parentService,
				};
				platformModalService.showDialog(modalOptions);
			};

			return service;
		}
	]);

})();
