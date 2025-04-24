(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'hsqe.checklist';

	globals.lookups.checkList = function checkList() {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'CheckList',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '3819a8a5317c4579908f4d2e2f95d75e',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				width: 500,
				height: 200,
				title: {name: 'Check List Search Dialog', name$tr$: 'hsqe.checklist.title.checkListLookupDialog'}
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementCommonPackageLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Package lookup.
	 *
	 */
	angular.module(moduleName).directive('hsqeChecklistHeaderLookup', ['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.checkList().lookupOptions);
		}
	]);

})(angular);
