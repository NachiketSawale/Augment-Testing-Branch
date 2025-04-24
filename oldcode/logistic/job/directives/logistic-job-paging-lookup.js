/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name logistic-job-lookup
	 * @requires basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('logistic.job').directive('logisticJobPagingLookup', ['_', 'LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'logisticJobDialogLookupPagingDataService',
		function (_, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, logisticJobDialogLookupPagingDataService) {

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'logistic-job-controlling-unit-filter',
				serverSide: true,
				serverKey: 'basics.masterdata.controllingunit.filterkey',
				fn: function (item) {
					return {
						ProjectFk: item.projectFk
					};
				}
			},
			{
				key: 'logistic-job-is-not-pooljob-filter',
				fn: function filterJobTypByIsNotPoolJob(item) {
					return !item.IsVoid && !item.IsPoolJob;
				}
			}]);
			var formSettings = {
				fid: 'scheduling.main.selectionfilter',
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
					rid: 'controllingunit',
					label: 'Controlling',
					label$tr$: 'cloud.common.entityControllingUnit',
					type: 'directive',
					directive: 'basics-master-data-context-controlling-unit-lookup',
					options: {
						eagerLoad: false,
						filterKey: 'logistic-job-controlling-unit-filter',
						showClearButton: true
					},
					model: 'controllingUnitFk',
					sortOrder: 2
				},
				{
					gid: 'selectionfilter',
					rid: 'businessPartner',
					label: 'Business Partner',
					label$tr$: 'cloud.common.businessPartner',
					type: 'directive',
					directive: 'business-partner-main-business-partner-dialog',
					options: {
						initValueField: 'BusinesspartnerBpName1',
						showClearButton: true
					},
					model: 'businessPartnerFk',
					sortOrder: 3
				},
				{
					gid: 'selectionfilter',
					rid: 'zipcode',
					label: 'Zip Code',
					label$tr$: 'cloud.common.entityZipCode',
					type: 'description',
					model: 'zipCode',
					sortOrder: 4
				},
				{
					gid: 'selectionfilter',
					rid: 'city',
					label: 'City',
					label$tr$: 'cloud.common.entityCity',
					type: 'description',
					model: 'city',
					sortOrder: 5
				},
				basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
						required: false,
						dataServiceName: 'basicsCustomLogisticJobTypeLookupDataService',
						filterKey: 'logistic-job-is-not-pooljob-filter',
						valMember: 'Id',
						dispMember: 'DescriptionInfo.Translated',
						columns: [
							{
								id: 'Description',
								field: 'DescriptionInfo',
								name: 'Description',
								formatter: 'translation',
								width: 300,
								name$tr$: 'cloud.common.entityDescription'
							}
						]
					},
					{
						gid: 'selectionfilter',
						rid: 'jobtype',
						label: 'Job Type',
						type: 'integer',
						model: 'jobTypeFk',
						sortOrder: 6
					}
				),
				{
					gid: 'selectionfilter',
					rid: 'activeJob',
					label: 'Actual Job',
					label$tr$: 'logistic.job.actualJob',
					type: 'boolean',
					model: 'activeJob',
					sortOrder: 7
				},
				{
					gid: 'selectionfilter',
					rid: 'showOnlyJobsForTheCurrentDivision',
					label: 'Show only jobs for the current division',
					label$tr$: 'logistic.job.showOnlyJobsForTheCurrentDivision',
					type: 'boolean',
					model: 'showOnlyJobsForTheCurrentDivision',
					sortOrder: 8
				}]
			};

			var gridSettings = {
				layoutOptions:{
					translationServiceName: 'logisticJobTranslationService',
					uiStandardServiceName: 'logisticJobUIStandardService',
					schemas: [{
						typeName: 'JobDto',
						moduleSubModule: 'Logistic.Job'
					}]
				}
			};
			var lookupOptions = {
				lookupType: 'logisticJob',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'logistic.job.assignJob',
				filterOptions: {
					serverSide: true,
					serverKey: 'logisticjobfilter',
					fn: function (item){
						let filter = logisticJobDialogLookupPagingDataService.getFilterParams(item);
						if(filter){
							if(item && item.wizardData && item.wizardData.defaults && item.wizardData.defaults.selectedJob){
								filter = { selectedJob: item.wizardData.defaults.selectedJob};
							}
						}
						return filter;
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: 'ec47eeddecbe439f86cc79c248f63bbd'/*,
				setFocusToFirstEmptyFilter: true*/
			};
			return  new LookupFilterDialogDefinition(lookupOptions, 'logisticJobDialogLookupPagingDataService', formSettings, gridSettings);
		}
	]);
})(angular);
