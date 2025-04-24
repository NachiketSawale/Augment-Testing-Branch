/**
 * Created by alm on 1/24/2022.
 */
// eslint-disable-next-line no-unused-vars
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.package').factory('packageFilterLookupDataService', ['lookupFilterDialogDataService',
		function (filterLookupDataService) {
			var options = {};
			return filterLookupDataService.createInstance(options);
		}]);

	angular.module('procurement.package').directive('procurementPackagePackageWithOptionLookupDialogNew', ['procurementContextService','LookupFilterDialogDefinition','$injector', 'basicsLookupdataConfigGenerator', 'packageFilterLookupDataService',
		function (moduleContext,LookupFilterDialogDefinition,$injector, basicsLookupdataConfigGenerator, packageFilterLookupDataService) {
			var formSettings = {
				fid: 'procurement.package.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'selectionfilter',
					rid: 'project',
					label: 'Project',
					label$tr$: 'procurement.package.selectProjectFilter',
					model: 'ShowOtherProject',
					type: 'boolean',
					sortOrder: 1
				}]
			};

			function booleanFormatter(row, cell, value) {
				var translate = $injector.get('$translate');
				if (value) {
					return translate.instant('basics.common.yes');
				}
				return translate.instant('basics.common.no');
			}

			var gridSettings = {
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
						id: 'project',
						field: 'ProjectFk',
						name$tr$: 'cloud.common.entityProjectNo',
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'Project',
							'displayMember': 'ProjectNo',
						}
					},{
						id: 'projectfkDescription',
						field: 'ProjectFk',
						name: 'Project Description',
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'ProjectName',
							lookupType: 'Project'
						},
						width: 100,
						searchable: false
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
				]
			};

			var lookupOptions = {
				lookupType: 'packagewithupdateopt',
				valueMember: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'prc-package-filter',
					fn: function (item) {
						var checkProjectFilter= packageFilterLookupDataService.getFilterParams(item);
						if(checkProjectFilter.ShowOtherProject){
							return {CompanyFk:moduleContext.loginCompany,IsLive:true,IsMaterial:true};
						}
						else{
							return {ProjectFk:moduleContext.loginProject,IsLive:true,IsMaterial:true};
						}
					}
				},
				pageOptions: {
					enabled: true
				},
				version: 3,
				width: 650,
				height: 500,
				title:'procurement.common.packageLookupDialogTitle',
				uuid: '620efe1707594640ac7c4cb4f4637d20'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'packageFilterLookupDataService', formSettings, gridSettings);
		}
	]);



})(angular, globals);