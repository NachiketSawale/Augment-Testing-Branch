(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name logistic-job-lookup
	 * @requires basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('logistic.card').directive('logisticCardDialogLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'logisticCardDialogLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, logisticCardDialogLookupDataService) {

			var formSettings = {
				fid: 'logistic.card.dialoglookup',
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
					label$tr$: 'cloud.common.entityProject',
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						showClearButton: true
					},
					model: 'projectFk',
					sortOrder: 1
				},
				{
					gid: 'selectionfilter',
					rid: 'job',
					label: 'Job',
					label$tr$: 'logistic.card.entityJob',
					type: 'directive',
					directive: 'logistic-job-paging-lookup',
					options: {
						eagerLoad: true,
						showClearButton: true,
						defaultFilter: {'projectFk': 'projectFk'}
					},
					model: 'jobFk',
					sortOrder: 2
				},
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.jobcardstatus', '', {
					gid: 'selectionfilter',
					rid: 'status',
					label: 'Status',
					label$tr$: 'cluod.common.entityState',
					type: 'integer',
					model: 'statusFk',
					sortOrder: 3
				}, false, {required: false})]
			};

			var gridSettings = {
				layoutOptions: {
					translationServiceName: 'logisticCardTranslationService',
					uiStandardServiceName: 'logisticCardLayoutService',
					schemas: [{
						typeName: 'JobCardDto',
						moduleSubModule: 'Logistic.Card'
					}]
				}
			};
			var lookupOptions = {
				lookupType: 'logisticJobCard',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'logistic.card.cardEntity',
				filterOptions: {
					serverSide: true,
					serverKey: 'logisticjobcardfilter',
					fn: function (item) {
						return logisticCardDialogLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: 'c4a6a043727146deaebf82df77fe8fb4'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'logisticCardDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
