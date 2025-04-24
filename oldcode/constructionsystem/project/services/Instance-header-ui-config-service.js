(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	/**
	 * @ngdoc service
	 * @name constructionSystemProjectInstanceHeaderUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem project instanceHeader container grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemProjectInstanceHeaderUIConfigService', [
		'platformUIConfigInitService', 'constructionSystemProjectTranslateService', 'basicsLookupdataConfigGenerator',
		'projectMainService', 'platformUIStandardExtentService',
		function (platformUIConfigInitService, translateService, basicsLookupdataConfigGenerator, projectMainService, platformUIStandardExtentService) {

			var layout = geDetailLayout();
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				dtoSchemeId: {typeName: 'InstanceHeaderDto', moduleSubModule: 'ConstructionSystem.Project'},
				layout: layout,
				translator: translateService
			});
			platformUIStandardExtentService.extend(this, layout.addition);

			function extendGrouping(gridColumns) {
				angular.forEach(gridColumns, function (column) {
					angular.extend(column, {
						grouping: {
							title: column.name$tr$,
							getter: column.field,
							aggregators: [],
							aggregateCollapsed: true
						}
					});
				});
				return gridColumns;
			}

			function geDetailLayout() {
				var modelFkConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'modelProjectModelTreeLookupDataService',
					enableCache: true,
					filter: function () {
						return {
							projectId: projectMainService.getIfSelectedIdElse(-1),
							includeComposite: true
						};
					}
				});

				modelFkConfig.grid.editorOptions.lookupOptions.selectableCallback = function (dataItem) {
					return angular.isNumber(dataItem.Id);
				};

				return {
					fid: 'constructionsystem.project.instanceheader.detail',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['statefk', 'modelfk', 'estimateheaderfk', 'psdschedulefk', 'boqheaderfk', 'code', 'description', 'commenttext', 'baslanguageqtofk', 'qtoacceptquality', 'modeloldfk', 'isincremental','hint']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						// description:{
						// 	grid: {
						// 		maxLength:255
						// 	},
						// 	detail: {
						// 		maxLength:255
						// 	}
						// },
						statefk: {
							readonly: true,
							detail: {
								type: 'directive',
								directive: 'constructionsystem-project-instance-header-status-combobox',
								options: {readOnly: true}
							},
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'InstanceHeaderStatus',
									displayMember: 'Description',
									imageSelector: 'platformStatusIconService'
								}
							}
						},
						modelfk: modelFkConfig,
						estimateheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'estimateMainHeaderLookupDataService',
							enableCache: true,
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1)+'&isContainerAll=0';
							}
						}, {required: true}),
						psdschedulefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupScheduleDataService',
							enableCache: true,
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1);
							}
						}),
						boqheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'boqProjectLookupDataService',
							enableCache: true,
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1);
							}
						}),
						code: {
							navigator: {
								moduleName: 'constructionsystem.main',
								registerService: 'ConstructionSystemMainInstanceService'
							},
							required: true
						},
						commenttext: {},
						baslanguageqtofk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'instanceHeaderLanguageDataService',
							enableCache: true,
							dispMember: 'DescriptionInfo.Translated'
						}),
						qtoacceptquality: {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'QtoQuality',
									'displayMember': 'Description',
									'dataServiceName': 'cosProjectQtoAcceptQualityDataService'
								},
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'cos-project-qto-accept-quality-combobox'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'cos-project-qto-accept-quality-combobox'
							}
						},
						modeloldfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelProjectModelTreeLookupDataService',
							enableCache: true,
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1) + '&includeComposite=true';
							},
							readonly: true
						}),
						isincremental: {readonly: true}
					},
					addition: {
						grid: extendGrouping([
							{
								afterId: 'modelfk',
								id: 'modelDescription',
								field: 'ModelFk',
								name: 'Model Description',
								name$tr$: 'cloud.common.entityModelDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'modelProjectModelTreeLookupDataService',
									dataServiceName: 'modelProjectModelTreeLookupDataService',
									displayMember: 'Description'
								}
							},
							{
								afterId: 'estimateheaderfk',
								id: 'estimateDescription',
								field: 'EstimateHeaderFk',
								name: 'Estimate Description',
								name$tr$: 'cloud.common.entityEstimateHeaderDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estimateMainHeaderLookupDataService',
									dataServiceName: 'estimateMainHeaderLookupDataService',
									displayMember: 'DescriptionInfo.Translated'
								}
							},{
								afterId: 'psdschedulefk',
								id: 'scheduleDescription',
								field: 'PsdScheduleFk',
								name: 'Schedule Description',
								name$tr$: 'cloud.common.entityScheduleDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'schedulingLookupScheduleDataService',
									dataServiceName: 'schedulingLookupScheduleDataService',
									displayMember: 'DescriptionInfo.Translated'
								}
							},{
								afterId: 'boqheaderfk',
								id: 'BoqDescription',
								field: 'BoqHeaderFk',
								name: 'Boq Description',
								name$tr$: 'cloud.common.entityBoqOutlineDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'boqProjectLookupDataService',
									dataServiceName: 'boqProjectLookupDataService',
									displayMember: 'BoqRootItem.BriefInfo.Translated'
								}
							}
						])
					}
				};
			}

		}
	]);
})(angular);
