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

	angular.module('logistic.dispatching').directive('logisticDispatchingRecordDialogLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'logisticDispatchingRecordDialogLookupDataService',
		function (LookupFilterDialogDefinitionPaging, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, logisticDispatchingRecordDialogLookupDataService) {

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
					rid: 'header',
					label: 'Dispatching Header',
					label$tr$: 'logistic.dispatching.dispatchingHeader',
					type: 'directive',
					directive: 'logistic-dispatching-header-paging-lookup',
					options: {
						showClearButton: true,
						version: 3
					},
					model: 'headerFk',
					required: true,
					sortOrder: 1
				}]
			};
			var gridSettings = {
				columns: [
					{
						id: 'code',
						field: 'RecordNo',
						name: 'Record Number',
						name$tr$: 'logistic.dispatching.entityRecordNo',
						readonly: true
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true,
						width: 270
					},
					{
						id:'recordType',
						field: 'RecordTypeFk',
						name: 'Record Type',
						name$tr$: 'logistic.dispatching.recordType',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'recordtype',
							displayMember: 'ShortKeyInfo.Translated',
							dataServiceName: 'logisticDispatchingRecordTypeLookupDataService'
						}
					},
					{
						id: 'header',
						field: 'DispatchHeaderFk',
						name: 'Dispatching Header',
						name$tr$: 'logistic.dispatching.dispatchingHeader',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'DispatchHeader',
							displayMember: 'Code',
							version: 3
						}
					},
					{
						id: 'article',
						field: 'ArticleCode',
						name: 'Article Code',
						name$tr$: 'logistic.dispatching.entityArticleCode',
						readonly: true,
						formatter: 'code'
					},
					{
						id: 'articledescription',
						field: 'ArticleDesc',
						name: 'Article Description',
						name$tr$: 'logistic.dispatching.entityArticleDesc',
						formatter: 'translation',
						readonly: true,
						width: 270
					}
				],
				inputSearchMembers: ['RecordNo', 'Description', 'ArticleCode', 'ArticleDesc']
			};
			var lookupOptions = {
				lookupType: 'DispatchRecord',
				valueMember: 'Id',
				displayMember: 'RecordNo',
				title: 'logistic.dispatching.assignRecordTitle',
				// title: { name: 'Assign Dispatching Header', name$tr$: 'logistic.dispatching.assignHeaderTitle' },
				filterOptions: {
					serverSide: true,
					serverKey: 'logisticDispatchRecordFilter',
					fn: function (item){
						return logisticDispatchingRecordDialogLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: 'd71c955aff5846bb9835be9996057ce5'
			};
			return new LookupFilterDialogDefinitionPaging(lookupOptions, 'logisticDispatchingRecordDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
