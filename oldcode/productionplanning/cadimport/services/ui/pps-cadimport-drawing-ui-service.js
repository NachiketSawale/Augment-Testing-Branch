(function () {
	'use strict';
	/*global angular, _*/

	var moduleName = 'productionplanning.cadimport';
	angular.module(moduleName).factory('ppsCadimportDrawingUIService', [
		'platformUIStandardConfigService', '$injector',
		'productionplanningDrawingTranslationService', 'platformUIStandardExtentService',
		'platformObjectHelper', 'basicsLookupdataConfigGenerator',
		'platformSchemaService', '$translate', 'PlatformMessenger', 'ppsCommonCustomColumnsServiceFactory',
		'basicsLookupdataLookupFilterService', 'platformModuleNavigationService',
		function (platformUIStandardConfigService, $injector,
				  ppsDrawingTranslationService, platformUIStandardExtentService,
				  platformObjectHelper, basicsLookupdataConfigGenerator,
				  platformSchemaService, $translate, PlatformMessenger, customColumnsServiceFactory,
				  basicsLookupdataLookupFilterService, platformModuleNavigationService) {
			var drawingLayout = $injector.get('productionplanningDrawingContainerInformationService').getPpsDrawingLayout();
			drawingLayout.change = 'onPropertyChange';

			//overload code
			var codeOV ={code: {
				'navigator': {
				moduleName: 'productionplanning.drawing',
					registerService: 'productionplanningDrawingMainService',
					hide: function (entity) {
						return _.isNil(entity.DrawingId);
					},
					navFunc: function (options, entity) {
						if (entity && entity.DrawingId > 0) {
							platformModuleNavigationService.navigate(options.navigator, entity, 'DrawingId');
						}
					}
				}}};

			angular.extend(drawingLayout.overloads, codeOV);

			var schemaOption = {typeName: 'EngCadImportDto', moduleSubModule: 'ProductionPlanning.CadImport'};
			var attributeDomains = platformSchemaService.getSchemaFromCache(schemaOption);
			var dtoScheme = attributeDomains.properties;
			if (dtoScheme) {
				var customColumnsService = customColumnsServiceFactory.getService('productionplanning.drawing');
				_.merge(dtoScheme, customColumnsService.attributes);
			}
			var BaseService = platformUIStandardConfigService;
			var service = new BaseService(drawingLayout, dtoScheme, ppsDrawingTranslationService);
			service.onSelectedItemChanged = new PlatformMessenger();

			function getIcon(iconUrl, titleStr) {
				return '<i class="pane-r block-image ' + iconUrl + (titleStr ? '" title="' + translate(titleStr) : '') + '"></i>';
			}

			function translate(str) {
				return $translate.instant(str);
			}

			var filter = {
				key: 'cad-import-import-model-lookup-filter',
				serverSide: false,
				fn: function (item) {
					return !_.includes([1, 2, 3], item.Id);
				}
			};
			basicsLookupdataLookupFilterService.registerFilter(filter);


			var addition = {
				grid: platformObjectHelper.extendGrouping(
					[basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						gridLess: true,
						dataServiceName: 'ppsCadimportconfigLookupDataService',
						valMember: 'Id',
						dispMember: 'Description'
					}, {
						id: 'engcadimportconfigfk',
						field: 'EngCadImportConfigFk',
						name: '*Import Configuration',
						name$tr$: 'productionplanning.cadimportconfig.importConfig',
						readonly: true,
						sortable: true
					}), {
						afterId: 'code',
						id: 'isSuccessfully',
						field: 'IsSuccessfully',
						name: '*Summary',
						name$tr$: 'productionplanning.common.summary',
						width: 100,
						sortable: true,
						formatter: function (row, cell, value, columnDef, dataContext, flag) {
							if (flag) {
								return dataContext.IsSuccessfully + '' + dataContext.SummaryType;
							}
							var format = '';
							if (dataContext.isImporting) {
								format += '<div class="spinner-sm" title="' + translate('productionplanning.cadimport.importing') + '"></div>&nbsp;&nbsp;';
							}
							switch (dataContext.IsSuccessfully) {
								case 0:
									format += getIcon('control-icons ico-flatbox-checked', 'productionplanning.cadimport.ok');
									break;
								case 1:
									format += getIcon('status-icons ico-status28', 'productionplanning.cadimport.warning');
									break;
								case 2:
									format += getIcon('status-icons ico-status29', 'productionplanning.cadimport.error');
									break;
							}
							switch (dataContext.EntityStatus) {
								case 1:
									format += getIcon('tlb-icons ico-db-delete', 'productionplanning.cadimport.notExisted');
									break;
								case 2:
									format += getIcon('tlb-icons ico-db-new', 'productionplanning.cadimport.existedWithDiff');
									break;
								case 3:
									format += getIcon('tlb-icons ico-db', 'productionplanning.cadimport.existedWithoutDiff');
									break;
							}
							if (dataContext.DocState) {
								format += getIcon('control-icons ico-folder-empty', 'productionplanning.cadimport.docOK');
							} else {
								format += getIcon('control-icons ico-folder-overlay1', 'productionplanning.cadimport.docMissing');
							}
							if(dataContext.InTransport) {
								format += getIcon('type-icons ico-resource18', 'productionplanning.cadimport.inTransport');
							}
							return format;
						}
					}, {
						afterId: 'isSuccessfully',
						id: 'importMode',
						field: 'ImportModel',
						name: '*Import Mode',
						name$tr$: 'productionplanning.cadimport.importMode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CadImportModel',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'pps-cad-import-import-model-combobox',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.ImportModel = args.selectedItem.Id;
										args.col = 'ImportModel';
										service.onSelectedItemChanged.fire(e, args);
									}
								}],
								filterKey: 'cad-import-import-model-lookup-filter'
							}
						},
						isTransient: true,
						sortable: true
					}, {
						afterId: 'importModel',
						id: 'pUForCreateProducts',
						field: 'PUForCreateProducts',
						name: '*Create Products In PU',
						name$tr$: 'productionplanning.cadimport.pUForCreateProducts',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PPSItem',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'pps-item-complex-lookup',
							displayMember: 'Code',
							lookupOptions: {
								showClearButton: true,
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'DescriptionInfo.Translated',
									width: 150,
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								defaultFilter: {
									ProjectId: 'PrjProjectFk',
									JobId: 'LgmJobFk'
								},
								additionalFilters: [{
									'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing': 'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing',
									getAdditionalEntity: function () {
										return {'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing': true};
									}
								}]
							}
						},
						isTransient: true,
						sortable: true
					}]),
				detail: [
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						gridLess: true,
						dataServiceName: 'ppsCadimportconfigLookupDataService',
						valMember: 'Id',
						dispMember: 'Description'
					}, {
						gid: 'basicData',
						rid: 'engcadimportconfigfk',
						model: 'EngCadImportConfigFk',
						label: '*Import Configuration',
						label$tr$: 'productionplanning.cadimportconfig.importConfig',
						required: true
					}),
					{
						gid: 'basicData',
						rid: 'importModel',
						model: 'ImportModel',
						label: '*Import Model',
						label$tr$: 'productionplanning.cadimport.importModel',
						type: 'directive',
						required: true,
						directive: 'pps-cad-import-import-model-combobox',
						isTransient: true,
						options: {
							filterKey: 'cad-import-import-model-lookup-filter'
						}
					},
					{
						gid: 'basicData',
						rid: 'pUForCreateProducts',
						model: 'PUForCreateProducts',
						label: '*Create Products in PU',
						label$tr$: 'productionplanning.cadimport.pUForCreateProducts',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'pps-item-complex-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								defaultFilter: {
									ProjectId: 'PrjProjectFk',
									JobId: 'LgmJobFk'
								}
							}
						},
						isTransient: true
					}
				]
			};
			platformUIStandardExtentService.extend(service, addition);
			return service;
		}
	]);
})();