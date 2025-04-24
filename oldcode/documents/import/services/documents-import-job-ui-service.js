/**
 * Created by chk on 2/22/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.import';

	/**
	 * documentImportJobUiService
	 */
	angular.module(moduleName).factory('documentsImportJobUiService', ['$filter',
		function ($filter) {

			var gridColumns = [
				{
					id: 'Description',
					field: 'Description',
					name$tr$: 'documents.import.description',
					toolTip: 'Description',
					sortable: false,
					readonly:true,
					width:120,
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'Description',
						title:'Description'
					},
					formatter:'description'
				},
				{
					id: 'XmlName',
					field: 'XmlName',
					name$tr$: 'documents.import.xmlName',
					toolTip: 'XmlName',
					sortable: false,
					readonly:true,
					width:120,
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'XmlName',
						title:'XmlName'
					},
					formatter:'description'
				},
				{
					id: 'jobstate',
					field: 'JobState',
					name$tr$: 'documents.import.jobState',
					toolTip: 'jobstate',
					sortable: false,
					readonly:true,
					formatter: function(row, cell, value){
						return $filter('commonJobStateFilter')(value);
					},
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'JobState',
						title:'JobState'
					}
				},
				{
					id: 'starttime',
					field: 'StartTime',
					name$tr$: 'documents.import.startTime',
					toolTip: 'starttime',
					sortable: false,
					readonly:true,
					width:120,
					formatter:'datetimeutc',
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'StartTime',
						title:'StartTime'
					}
				},
				{
					id: 'endtime',
					field: 'EndTime',
					name$tr$: 'documents.import.endTime',
					toolTip: 'endtime',
					sortable: false,
					readonly:true,
					width:120,
					formatter:'datetimeutc',
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'EndTime',
						title:'EndTime'
					}
				},
				{
					id: 'progressvalue',
					field: 'ProgressValue',
					name$tr$: 'documents.import.progressValue',
					toolTip: 'progressValue',
					sortable: false,
					readonly:true,
					formatter: function(row, cell, value){
						return $filter('commonJobProgressFilter')(value);
					},
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'ProgressValue',
						title:'ProgressValue'
					}
				},
				{
					id: 'errormessage',
					field: 'ErrorMessage',
					name$tr$: 'documents.import.errorMessage',
					toolTip: 'errormessage',
					sortable: false,
					readonly:true,
					width:150,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'ProgressValue',
						title:'ProgressValue'
					},
					formatter:'description'
				}
			];

			function getStandardConfigForListView(){
				return {
					columns: gridColumns
				};
			}

			return {getStandardConfigForListView:getStandardConfigForListView};
		}
	]);

	angular.module(moduleName).factory('documentsImportResultUiService', [
		function () {

			var gridColumns = [
				{
					id: 'ImportStatus',
					field: 'ImportStatus',
					name$tr$: 'documents.import.importStatus',
					toolTip: 'ImportStatus',
					sortable: false,
					readonly:true,
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'ImportStatus',
						title:'ImportStatus'
					},
					formatter:'description'
				},
				{
					id: 'BarCode',
					field: 'BarCode',
					name$tr$: 'documents.import.barCode',
					toolTip: 'BarCode',
					sortable: false,
					readonly:true,
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'BarCode',
						title:'BarCode'
					},
					formatter:'description'
				},
				{
					id: 'XmlName',
					field: 'XmlName',
					name$tr$: 'documents.import.xmlName',
					toolTip: 'XmlName',
					sortable: false,
					readonly:true,
					width:120,
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'XmlName',
						title:'XmlName'
					},
					formatter:'description'
				},
				{
					id: 'File',
					field: 'File',
					name$tr$: 'documents.import.file',
					toolTip: 'File',
					sortable: false,
					readonly:true,
					searchable: true,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'File',
						title:'File'
					},
					formatter:'description'
				},
				{
					id: 'ErrMsg',
					field: 'ErrMsg',
					name$tr$: 'documents.import.errorMessage',
					toolTip: 'ErrorMessage',
					sortable: false,
					readonly:true,
					width:150,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'ErrMsg',
						title:'ErrMsg'
					},
					formatter:'description'
				},
				{
					id: 'WarningMessage',
					field: 'WarningMessage',
					name$tr$: 'documents.import.warningMessage',
					toolTip: 'WarningMessage',
					sortable: false,
					readonly:true,
					width:150,
					grouping:{
						aggregateCollapsed:true,
						aggregators:[],
						getter:'WarningMessage',
						title:'WarningMessage'
					},
					formatter:'description'
				}

			];

			function getStandardConfigForListView(){
				return {
					columns: gridColumns
				};
			}

			return {getStandardConfigForListView:getStandardConfigForListView};
		}
	]);
})(angular);