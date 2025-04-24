/**
 * Created by chi on 3/2/2020.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.packageWithUpdateOpt = function packageWithUpdateOpt($injector) {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'packagewithupdateopt',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '620efe1707594640ac7c4cb4f4637d20',
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
						field: 'ConfigurationFk',
						name$tr$: 'procurement.common.prcConfigurationDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcconfiguration',
							displayMember: 'DescriptionInfo.Translated'
						},
						searchable: false
					},
					{
						id: 'isMaterial',
						field: 'IsMaterial',
						name$tr$: 'basics.common.updateOption.isMaterial',
						formatter: booleanFormatter,
						searchable: false
					},
					{
						id: 'isService',
						field: 'IsService',
						name$tr$: 'basics.common.updateOption.isService',
						formatter: booleanFormatter,
						searchable: false
					},
					{
						id: 'boqCriteria',
						field: 'BoqCriteria',
						name$tr$: 'basics.common.updateOption.boqCriteria',
						toolTip$tr$: 'basics.common.updateOption.boqCriteria',
						formatter: 'lookup',// booleanFormatter,
						formatterOptions: {
							lookupType: 'BoqCreateCriteriaType',
							displayMember: 'Description'
						},
						sortable: true,
						width: 110
					}
				],
				width: 500,
				height: 200,
				title: {name: 'procurement.common.packageLookupDialogTitle'},
				pageOptions: {
					enabled: true
				}
			}
		};

		// //////////////////////////
		function booleanFormatter(row, cell, value) {
			var translate = $injector.get('$translate');
			if (value) {
				return translate.instant('basics.common.yes');
			}
			return translate.instant('basics.common.no');
		}
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementPackagePackageWithUpdateOptionLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Package with update option lookup.
	 *
	 */
	angular.module(moduleName).directive('procurementPackagePackageWithUpdateOptionLookup', procurementPackagePackageWithUpdateOptionLookup);

	procurementPackagePackageWithUpdateOptionLookup.$inject = ['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition', '$injector'];

	function procurementPackagePackageWithUpdateOptionLookup(basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition, $injector) {
		basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration', 'packageStatus']);
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.packageWithUpdateOpt($injector).lookupOptions);
	}
})(angular, globals);