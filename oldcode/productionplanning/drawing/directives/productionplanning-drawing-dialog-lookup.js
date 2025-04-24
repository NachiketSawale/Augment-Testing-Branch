/**
 * Created by zwz on 10/15/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('ppsDrawingDialogLookupConfig', PpsDrawingDialogLookupConfig);
	PpsDrawingDialogLookupConfig.$inject = ['basicsLookupdataConfigGenerator', 'productionplanningDrawingDialogLookupDataService'];
	function PpsDrawingDialogLookupConfig (basicsLookupdataConfigGenerator, productionplanningDrawingDialogLookupDataService) {
		var service = {};

		service.formSettings = {
			fid: 'productionplanning.drawing.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
					gid: 'selectionfilter',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
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
					model: 'projectId', // 'projectId' maps to the param that will be used in DoBuildLookupSearchFilter() of server side. Don't modify it.
					sortOrder: 1
				}, {
					gid: 'selectionfilter',
					rid: 'ppsItem',
					label: 'Production Unit',
					label$tr$: 'productionplanning.item.entityItem',
					type: 'directive',
					directive: 'productionplanning-item-item-lookup-dialog',
					options: {
						showClearButton: true
					},
					model: 'ppsItemId', // 'ppsItemId' maps to the param that will be used in DoBuildLookupSearchFilter() of server side. Don't modify it.
					sortOrder: 2
				},
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.engineeringdrawingtype','',
					{
						gid: 'selectionfilter',
						rid: 'drawingType',
						label: 'Drawing Type',
						label$tr$: 'productionplanning.drawing.engDrawingTypeFk',
						type: 'integer',
						model: 'drawingTypeId',// 'drawingTypeId' maps to the param that will be used in DoBuildLookupSearchFilter() of server side. Don't modify it.
						sortOrder: 3
					}, false, {required: false, showIcon: true}
				)
			]
		};

		service.gridSettings = {
			columns: [{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true
				}, {
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description',
					readonly: true
				}, {
					id: 'projectNo',
					field: 'PrjProjectFk',
					name: 'Project',
					name$tr$: 'cloud.common.entityProjectNo',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					},
					readonly: true
				}, {
					id: 'projectName',
					field: 'PrjProjectFk',
					name: 'Project Name',
					name$tr$: 'cloud.common.entityProjectName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectName'
					},
					readonly: true
				},{
					id: 'ppsItemFk',
					field: 'PpsItemFk',
					name: 'Production Unit',
					name$tr$: 'productionplanning.item.entityItem',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PPSItem',
						displayMember: 'Code',
						version : 3
					},
					readonly: true
				},{
					id: 'engDrawingTypeFk',
					field: 'EngDrawingTypeFk',
					name: 'Type',
					name$tr$: 'cloud.common.entityType',
					formatter: 'lookup',
					formatterOptions: {
						version: 3,
						lookupType: 'EngDrawingType',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService',
						showClearButton: true,
						valueMember: 'Id'
					}
				}, {
					id: 'engDrawingStatusFk',
					field: 'EngDrawingStatusFk',
					name: 'EngDrawingStatusFk',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingstatus',null, {
						showIcon: true
					}).grid.formatterOptions
				}, {
					id: 'insertedat',
					field: 'InsertedAt',
					name: 'InsertedAt',
					name$tr$: 'cloud.common.entityInsertedAt',
					formatter: 'datetime'
				}],
			inputSearchMembers: ['Code', 'Description']
		};

		service.createLookupOptions = function (serverKey) {
			const getProjectId = (entity) => {
				if (entity.ProjectId > 0) {
					return entity.ProjectId;
				}
				if (entity.ProjectFk > 0) {
					return entity.ProjectFk;
				}
				if (entity.PrjProjectFk > 0) {
					return entity.PrjProjectFk;
				}
				return null;
			};

			var lookupOptions = {
				lookupType: 'EngDrawing',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'productionplanning.drawing.assignDrawing',
				filterOptions: {
					serverSide: true,
					serverKey: serverKey,
					fn: function (entity) {
						var filter = productionplanningDrawingDialogLookupDataService.getFilterParams();
						if (entity && _.isEmpty(filter)) {
							const prjId = getProjectId(entity);
							if (prjId > 0) {//set the filter for popup up, this is used in the Report:Products container
								filter.projectId = prjId;
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
				uuid: '9c4f5b5fa8dd4614850297daef6ccd2b'
			};
			return lookupOptions;
		};

		return service;
	}

	angular.module(moduleName).directive('productionplanningDrawingDialogLookup', Lookup);
	Lookup.$inject = ['LookupFilterDialogDefinition', 'ppsDrawingDialogLookupConfig'];
	function Lookup(LookupFilterDialogDefinition, ppsDrawingDialogLookupConfig) {
		var lookupOptions = ppsDrawingDialogLookupConfig.createLookupOptions('productionplanning-drawing-filter');
		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningDrawingDialogLookupDataService', ppsDrawingDialogLookupConfig.formSettings, ppsDrawingDialogLookupConfig.gridSettings);
	}

	angular.module(moduleName).directive('productionplanningDrawingDialogAllLookup', AllLookup);
	AllLookup.$inject = ['LookupFilterDialogDefinition', 'ppsDrawingDialogLookupConfig'];
	function AllLookup(LookupFilterDialogDefinition, ppsDrawingDialogLookupConfig) {
		var lookupOptions = ppsDrawingDialogLookupConfig.createLookupOptions('productionplanning-drawing-all-filter');
		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningDrawingDialogLookupDataService', ppsDrawingDialogLookupConfig.formSettings, ppsDrawingDialogLookupConfig.gridSettings);
	}

})(angular);
