(function (angular) {
	'use strict';

	angular.module('basics.clerk').directive('basicsClerkForWorkflowDialog',
		['$translate', 'BasicsLookupdataLookupDirectiveDefinition', '$',
			function ($translate, BasicsLookupdataLookupDirectiveDefinition, $) {
				var defaults = {
					lookupType: 'clerk',
					valueMember: 'Id',
					displayMember: 'Code',
					//formatter:function(editValue, options, selectedRowItem, entity){
					//	if(selectedRowItem){
					//		return selectedRowItem.FirstName +' '+selectedRowItem.FamilyName;
					//	}
					//	return editValue;
					//},
					uuid: '4607df39eeeb41dabbbb4e893c332680',
					dialogUuid: '94aad014bf21425cab7b2d68540392a0',
					columns: [
						{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
						{id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'},
						{id: 'depart', field: 'Department', name: 'Department', name$tr$: 'cloud.common.entityDepartment'},
						{id: 'firstName', field: 'FirstName', name: 'FirstName', name$tr$: 'basics.clerk.entityFirstName'},
						{
							id: 'familyName',
							field: 'FamilyName',
							name: 'FamilyName',
							name$tr$: 'basics.clerk.entityFamilyName'
						},
						{
							id: 'companyCode',
							field: 'CompanyCode',
							name: 'CompanyCode',
							name$tr$: 'cloud.common.entityCompanyCode'
						},
						{
							id: 'companyName',
							field: 'CompanyName',
							name: 'CompanyName',
							name$tr$: 'cloud.common.entityCompanyName'
						}

					],
					width: 500,
					height: 200,
					//title: { name: 'cloud.common.dialogTitleClerk' }
					title: {name: 'cloud.common.dialogTitleClerk'}
					// title: {
					// 	name: $translate.instant('cloud.common.dialogClerkTitle')
					// 	name: 'basics.clerk.dialogTitleClerk'
					// }
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
					controller: ['$scope',
						function ($scope) {
							$scope.$watch(function () {
								return $scope.$$childTail.keys;
							}, function (newValue, oldValue) {
								if (newValue.length === 0 && oldValue.length > 0) {
									$scope.$$childTail.clearValue();
								}
							});

						}]
				});
			}
		]);
})(angular);
