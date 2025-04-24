/*
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name logistic-dispatching-header-paging-lookup
	 * @requires
	 * @description Dialog to select a dispatching header
	 */

	angular.module('logistic.dispatching').directive('logisticDispatchingHeaderPagingLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'logisticDispatchingHeaderLookupDataServiceNew',
		function (LookupFilterDialogDefinitionPaging, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, logisticDispatchingHeaderLookupDataServiceNew) {

			var formSettings = {
				fid: 'dispatching.header.selectionfilter',
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
					rid: 'company',
					label: 'Company',
					label$tr$: 'cloud.common.entityCompany',
					type: 'directive',
					directive: 'basics-company-company-lookup',
					options: {
						showClearButton: true
					},
					model: 'companyFk',
					required: true,
					sortOrder: 1
				},
				{
					gid: 'selectionfilter',
					rid: 'job1',
					label: 'PerformingJob',
					label$tr$: 'logistic.dispatching.performingJob',
					type: 'directive',
					directive: 'logistic-job-paging-lookup',
					options: {
						showClearButton: true
					},
					model: 'job1Fk',
					required: true,
					sortOrder: 2
				},
				{
					gid: 'selectionfilter',
					rid: 'job2',
					label: 'ReceivingJob',
					label$tr$: 'logistic.dispatching.receivingJob',
					type: 'directive',
					directive: 'logistic-job-paging-lookup',
					options: {
						showClearButton: true
					},
					model: 'job2Fk',
					required: true,
					sortOrder: 3
				},
				{
					gid: 'selectionfilter',
					rid: 'startDate',
					label: 'Start',
					label$tr$: 'cloud.common.entityStartDate',
					type: 'date',
					model: 'startDate',
					sortOrder: 4,
					required: true
				},
				{
					gid: 'selectionfilter',
					rid: 'endDate',
					label: 'Finish',
					label$tr$: 'cloud.common.entityEndDate',
					type: 'date',
					model: 'startDate',
					sortOrder: 5,
					required: true
				}]
			};
			var gridSettings = {
				layoutOptions:{
					translationServiceName: 'logisticDispatchingTranslationService',
					uiStandardServiceName: 'logisticDispatchingHeaderUIConfigurationService',
					schemas: [{
						typeName: 'DispatchHeaderDto',
						moduleSubModule: 'Logistic.Dispatching'
					}]
				},
				inputSearchMembers: ['Code', 'Description', 'StartDate', 'EndDate']
			};
			var lookupOptions = {
				lookupType: 'DispatchHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'logistic.dispatching.assignHeaderTitle',
				// title: { name: 'Assign Dispatching Header', name$tr$: 'logistic.dispatching.assignHeaderTitle' },
				filterOptions: {
					serverSide: true,
					serverKey: 'logisticdispatchheaderfilter',
					fn: function (item){
						return logisticDispatchingHeaderLookupDataServiceNew.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: '8763ee6ee4cf4aa0a6804ec3d156a479'
			};
			return new LookupFilterDialogDefinitionPaging(lookupOptions, 'logisticDispatchingHeaderLookupDataServiceNew', formSettings, gridSettings);
		}
	]);
})(angular);
