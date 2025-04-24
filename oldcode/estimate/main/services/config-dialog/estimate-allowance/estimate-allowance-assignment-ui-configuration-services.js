
(function () {
	'use strict';
	let moduleName = 'estimate.main';


	angular.module(moduleName).factory('estimateAllowanceAssignmentUIConfigurationService', [
		function () {
			let service = {};
			let formConfig = {
				groups: [
					{
						gid: 'allowanceConfig',
						header: 'Column Config',
						header$tr$: 'estimate.main.allowanceConfig',
						isOpen: true,
						visible: true,
						sortOrder: 6
					}
				],
				rows: [
					{
						gid: 'allowanceConfig',
						rid: 'EstAllowanceConfigTypeFk',
						label: 'Allowance Assignment Config Type',
						label$tr$: 'estimate.main.allowanceAssignmentType',
						type: 'directive',
						directive: 'estimate-allowance-assignment-config-type-lookup',
						model: 'EstAllowanceConfigTypeFk',
						options: {
							serviceName: 'estimateAllowanceAssignmentConfigTypeDataService',
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id',
							watchItems: true,
							showClearButton: true
						},
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'allowanceConfig',
						rid: 'estAllowanceConfigDesc',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						model: 'EstAllowanceConfigDesc',
						sortOrder: 2,
						readonly: false,
						type: 'code',
						width: 300
					},
					{
						gid: 'allowanceConfig',
						rid: 'allowanceAssignmentDetails',
						label: 'Allowance Assignment Config Details',
						label$tr$: 'estimate.main.allowanceAssignmentDetails',
						type: 'directive',
						model: 'EstAllowanceAssignmentEntities',
						directive:'estimate-allowance-assignment-grid',
						readonly: false,
						maxlength:5000,
						rows:20,
						sortOrder: 3
					}
				],
				overloads: {}
			};

			service.getFormConfig = function () {
				return formConfig;
			};

			return service;

		}
	]);

})(angular);
