/*
//////////////////////////////////////////////////////////////
Note: Due to the requirement of BP assignment isn't confirmed yet,
for saving the code change and assure no impact on original function,
hide the containers of BP assignment by removing the code below and put it here temporarily.
once the BP assignment is activated again, copy and paste the code below to module-containers.json
//////////////////////////////////////////////////////////////
{
    "id": "businesspartner.contact.businesspartnerassignmentgrid",
    "template": "app/components/base/grid-partial.html",
    "title": "businesspartner.contact.businessPartnerAssignment.grid",
    "controller": "businesspartnerContact2BpAssignmentListController",
    "uuid": "373ccc35eca3489d96c121cb0d23ed04",
    "permission": "b50fb90120804075b294e8378dd1be40"
},
{
    "id": "businesspartner.contact.businesspartnerassignmentform",
    "template": "app/components/base/form-detail-partial.html",
    "title": "businesspartner.contact.businessPartnerAssignment.detail",
    "controller": "businesspartnerContact2BpAssignmentFormController",
    "uuid": "896b30a924a74844a90bfaac0d932a7b",
    "permission": "b50fb90120804075b294e8378dd1be40"
}
 */

(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).controller('businesspartnerContact2BpAssignmentListController',
		['$scope', 'platformGridControllerService', 'businesspartnerContact2BpAssignmentDataService',
			'businessPartnerContact2BpAssignmentUIStandardService', 'businessPartnerContact2BpAssignmentValidationService',

			function ($scope, platformGridControllerService, dataService, UIStandardService, validationService) {
				let myGridConfig = {initCalled: false, columns: []};
				platformGridControllerService.initListController($scope, UIStandardService, dataService, validationService, myGridConfig);

			}
		]);
})(angular);