/**
 * Created by chd on 12/17/2021.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'defect.main';

	globals.lookups.defect = function defect() {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'referenceDefectLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'de04b948edd245f8bde2abf2bb6c9cbc',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						sortable: true
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						sortable: true,
					}
				],
				width: 500,
				height: 200,
				title: {name:'defect.main.defectLookupDialogueTitle'}
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name defect.main.directive:defectMainDefectLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Defect lookup.
	 *
	 */
	angular.module(moduleName).directive('defectMainDefectLookup', ['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.defect().lookupOptions);
		}
	]);

})(angular);
