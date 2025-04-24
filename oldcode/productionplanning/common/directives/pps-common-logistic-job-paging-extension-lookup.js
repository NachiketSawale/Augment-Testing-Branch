(function (angular) {
	'use strict';
	/* global globals _ */

	const moduleName = 'productionplanning.common';

	const defaultFormSettings = {
		fid: 'logistic.job.extension.selectionfilter',
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
			rid: 'drawing',
			label: 'Drawing',
			label$tr$: 'productionplanning.drawing.entityDrawing',
			type: 'directive',
			directive: 'productionplanning-drawing-dialog-lookup',
			options: {
				showClearButton: true
			},
			model: 'drawingFk',
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
		{
			gid: 'selectionfilter',
			rid: 'materialGroup',
			label: 'Material Group',
			label$tr$: 'basics.material.record.materialGroup',
			type: 'directive',
			directive: 'basics-material-material-group-lookup',
			options: {
				showClearButton: true
			},
			model: 'materialGroupFk',
			sortOrder: 6
		},
		{
			gid: 'selectionfilter',
			rid: 'Material',
			label: 'Material',
			label$tr$: 'basics.material.record.material',
			type: 'description',
			model: 'material',
			sortOrder: 7
		},
		{
			gid: 'selectionfilter',
			rid: 'jobType',
			label: 'Job Type',
			label$tr$: 'logistic.job.jobType',
			type: 'radio',
			model: 'jobType',
			options: {
				valueMember: 'value',
				labelMember: 'label',
				groupName: 'jobType',
				items: [{
					value: 'both',
					label: 'Both',
					label$tr$: 'logistic.job.internalAndExternalJob'
				}, {
					value: 'internal',
					label: 'Internal Job',
					label$tr$: 'logistic.job.internalJob'
				}, {
					value: 'external',
					label: 'External Job',
					label$tr$: 'logistic.job.externalJob'
				}]
			},
			sortOrder: 8
		},
		{
			gid: 'selectionfilter',
			rid: 'activeJob',
			label: 'Actual Job',
			label$tr$: 'logistic.job.actualJob',
			type: 'boolean',
			model: 'activeJob',
			sortOrder: 9
		}]
	};

	const defaultGridSettings = {
		layoutOptions:{
			translationServiceName: 'logisticJobTranslationService',
			uiStandardServiceName: 'ppsLogisticJobExtensionUIStandardService',
			schemas: [{
				typeName: 'JobDto',
				moduleSubModule: 'Logistic.Job'
			}]
		}
	};

	const getLookupOptions = dataService => {
		return {
			lookupType: 'logisticJobEx',
			valueMember: 'Id',
			displayMember: 'Code',
			title: 'logistic.job.assignJob',
			filterOptions: {
				serverSide: true,
				serverKey: 'logisticjobexfilter',
				fn: item => {
					return dataService.getFilterParams(item);
				}
			},
			pageOptions: {
				enabled: true,
				size: 100
			},
			dialogOptions: {
				// Override the default template to fix issue of grid's height too small when dialog have many form options.
				templateUrl: globals.appBaseUrl + 'productionplanning.common/partials/pps-common-lookup-filter-dialog-form-grid.html'
			},
			version: 3,
			uuid: 'a54fd0be275e4b439135c771ac5a2881'
		};
	};

	/**
	 * @ngdoc directive
	 * @name logistic-job-paging-extension-lookup
	 * @requires
	 * @description
	 */
	angular.module(moduleName).directive('logisticJobPagingExtensionLookup', ['LookupFilterDialogDefinition',
		'logisticJobDialogLookupPagingExtensionDataService',
		function (LookupFilterDialogDefinition, logisticJobDialogLookupPagingExtensionDataService) {

			const formSettings = _.cloneDeep(defaultFormSettings);
			const gridSettings = _.cloneDeep(defaultGridSettings);
			const lookupOptions = getLookupOptions(logisticJobDialogLookupPagingExtensionDataService);

			return new LookupFilterDialogDefinition(lookupOptions, 'logisticJobDialogLookupPagingExtensionDataService', formSettings, gridSettings);
		}
	]);

	/**
	 * @ngdoc directive
	 * @name current-location-job-lookup
	 * @requires
	 * @description
	 */
	angular.module(moduleName).directive('currentLocationJobLookup', ['LookupFilterDialogDefinition',
		'logisticJobDialogLookupPagingExtensionDataService',
		function (LookupFilterDialogDefinition, logisticJobDialogLookupPagingExtensionDataService) {

			const formSettings = _.cloneDeep(defaultFormSettings);
			const gridSettings = _.cloneDeep(defaultGridSettings);
			const lookupOptions = getLookupOptions(logisticJobDialogLookupPagingExtensionDataService);

			const originalFn = lookupOptions.filterOptions.fn;
			lookupOptions.filterOptions.fn = item => {
				const filterParams = originalFn(item);
				filterParams.showOnlyJobsForTheCurrentDivision = false;
				return filterParams;
			};

			return new LookupFilterDialogDefinition(lookupOptions, 'logisticJobDialogLookupPagingExtensionDataService', formSettings, gridSettings);
		}
	]);
})(angular);
