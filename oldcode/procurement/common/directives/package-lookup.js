(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcPackage = function prcPackage() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcPackage',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '3819a8a5317c4579908f4d2e2f95d75e',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'packageStatusDescription',
						field: 'PackageStatusFk',
						name$tr$: 'cloud.common.entityState',
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'PackageStatus',
							'displayMember': 'DescriptionInfo.Translated',
							'imageSelector': 'platformStatusIconService'
						},
						searchable: false
					},
					{
						id: 'packageConfigurationDescription',
						field: 'PrcPackageConfigurationFk',
						name$tr$: 'procurement.common.prcConfigurationDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcconfiguration',
							displayMember: 'DescriptionInfo.Translated'
						},
						searchable: false
					}
				],
				width: 500,
				height: 200,
				title: {name: 'procurement.common.packageLookupDialogTitle'}
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
	angular.module(moduleName).directive('procurementCommonPackageLookup', ['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition) {
			basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration', 'packageStatus']);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcPackage().lookupOptions);
		}
	]);

})(angular, globals);