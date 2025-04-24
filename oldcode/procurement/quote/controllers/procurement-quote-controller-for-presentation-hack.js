(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,$ */
	var moduleName = 'procurement.quote';

	angular.module(moduleName).controller('userFormControllerHack', ['$scope', 'procurementQuoteHeaderDataService', '$http',
		function ($scope, headerDataService, $http) {

			function loadUserForm() {
				var id;
				if (!headerDataService.getSelected()) {
					return;
				}
				id = headerDataService.getSelected().Id;
				var templateUrlForms = globals.webApiBaseUrl + 'basics/userform/data/rubricdatalist?rubricId=25&contextFk=' + id;
				var formFk = 124;
				$http.get(templateUrlForms).then(
					function (response) {
						var forms = response.data;
						var form = _.find(forms, function (form) {
							return form.FormFk === formFk;
						});
						if(!form){
							return;
						}
						var formDataId = form.Id;
						var templateUrl = globals.webApiBaseUrl + 'basics/userform/getformlink?formId=' + formFk + '&formDataId=' + formDataId + '&contextId=' + id + '&editable=false';

						$http.get(templateUrl).then(
							function (response) {
								$('#iframeHack').attr('src', response.data);
							});

					});

			}

			headerDataService.registerSelectionChanged(loadUserForm);

			loadUserForm();

			$scope.$on('$destroy', function () {
				headerDataService.unregisterSelectionChanged(loadUserForm);
			});
		}
	]);
})();