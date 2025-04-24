/**
 * Created by zov on 22/04/2019.
 */
(function () {
	/*jshint sub:true*/
	/*global angular*/

	'use strict';
	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).service('productionplanningDrawingContainerInformationService', [
		'platformLayoutHelperService',
		'ppsCommonLayoutOverloadService',
		'basicsLookupdataConfigGenerator',
		'productionplanningDrawingMainService',
		'basicsLookupdataLookupFilterService',
		'$injector',
		'productionplanningDrawingComponentDataService',
		'productionplanningDrawingComponentUIStandardService',
		'productionplanningDrawingComponentValidationService',
		'productionplanningDrawingtypeLookupOverloadProvider',
		'basicsCommonUomDimensionFilterService',
		'ppsCommonCustomColumnsServiceFactory',
		'$translate',
		'ppsCommonClipboardService',
		function (platformLayoutHelperService,
				  ppsCommonLayoutOverloadService,
				  basicsLookupdataConfigGenerator,
				  drawingMainService,
				  basicsLookupdataLookupFilterService,
				  $injector,
				  drawingComponentDataService,
				  drawingComponentUIStandardService,
				  drawingComponentValidationService,
				  drawingtypeLookupOverloadProvider,
				  uomFilterService,
				  customColumnsServiceFactory,
				  $translate,
				  ppsCommonClipboardService) {
			var self = this;
			var cuFilterKey = 'pps-drawing-controlling-unit-filter';

			const characteristic2SectionId = 62;
			let drwProdTemplateDataService, validationService, uiService;

			var filters = [{
				key: cuFilterKey,
				serverSide: true,
				serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
				fn: function (entity) {
					return 'ProjectFk=' + drawingMainService.getProjectId(entity);
				}
			}, {
				key: 'pps-item-drawing-filter',
				serverSide: true,
				fn: function (entity) {
					return {
						ProjectId: entity.PrjProjectFk,
						JobId: entity.LgmJobFk
					};
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			self.getContainerInfoByGuid = function (guid) {
				var config = {};
				switch (guid) {
					case 'a9d9591baf2d4e58b5d21cd8a6048dd1': //productionplanningDrawingListController
						config = getPpsDrawingServiceInfo();
						config.layout = self.getPpsDrawingLayout();
						config.ContainerType = 'Grid';
						config.listConfig = {initCalled: false, columns: [], pinningContext: true, type: 'productionplanning.drawing', dragDropService: ppsCommonClipboardService};
						break;
					case 'b43f4d685979413e9ca350b38ced33af': //productionplanningDrawingDetailController
						config = getPpsDrawingServiceInfo();
						config.layout = self.getPpsDrawingLayout();
						config.ContainerType = 'Detail';
						break;
					case '5g340a9d7e8b4rg2f76dfdd9d2670856':
					case '6g340a9d7e8b8r5rf76dfdd9y267u856':
						var dataService = drawingComponentDataService.getService(
							{
								serviceKey: 'productionplanning.drawing.component',
								parentService: 'productionplanningDrawingMainService'
							}
						);
						config = {
							standardConfigurationService: drawingComponentUIStandardService.getService(dataService),
							dataServiceName: dataService,
							validationServiceName: drawingComponentValidationService.getService(dataService)
						};
						switch (guid) {
							case '5g340a9d7e8b4rg2f76dfdd9d2670856':
								config.listConfig = {initCalled: false, columns: []};
								config.ContainerType = 'Grid';
								break;
							case '6g340a9d7e8b8r5rf76dfdd9y267u856':
								config.ContainerType = 'Detail';
								break;
						}
						break;
					case '67340a9d7e8b4rg2d5gdfgn9d26ff856':
					case 'dfg40a9d7e8b8r5rf76dtd59y267uy56':
						var dataService2 = drawingComponentDataService.getService(
							{
								serviceKey: 'productionplanning.drawing.productiondescription.component',
								parentService: getProductDescService(),
								parentFilter: 'Id',
								endRead: 'getbyproductdesc'
							}
						);
						config = {
							standardConfigurationService: drawingComponentUIStandardService.getService(dataService2),
							dataServiceName: dataService2,
							validationServiceName: drawingComponentValidationService.getService(dataService2)
						};
						switch (guid) {
							case '67340a9d7e8b4rg2d5gdfgn9d26ff856':
								config.listConfig = {initCalled: false, columns: []};
								config.ContainerType = 'Grid';
								break;
							case 'dfg40a9d7e8b8r5rf76dtd59y267uy56':
								config.ContainerType = 'Detail';
								break;
						}
						break;
					case '6f7933de9fgc42arb69a044f8c4d41gf':
						config = {
							mainService: drawingMainService,
							parentService: getProductDescService(),
							enableCache: true,
							foreignKey: 'ClobsFk',
							readonly: true
						};
						break;
					case '2a74717f7e774c1f8817ed70c7d7f490':
						config = getPpsDrawingStackServiceInfo();
						config.layout = self.getPpsDrawingStackLayout();
						config.ContainerType = 'Grid';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '9df6588657114a41bd800e4c6a04bf5c':
						config = getPpsDrawingStackServiceInfo();
						config.layout = self.getPpsDrawingStackLayout();
						config.ContainerType = 'Detail';
						break;
					case 'd143f62beac7481288fdae7d0ec99e6a':
						config.standardConfigurationService = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService').getService('forStack');
						config.dataServiceName = getProductDescService2();
						config.listConfig = {initCalled: false, columns: [], idProperty: 'UniqueId'};
						config.ContainerType = 'Grid';
						break;
					case '7c0fdef1f8c4447abe524ee7130e7d6e': // Drawing Revision
						config.standardConfigurationService = $injector.get('ppsDrawingRevisionUIStandardService');
						config.dataServiceName = 'ppsDrawingRevisionDataService';
						config.listConfig = {initCalled: false, columns: []};
						config.ContainerType = 'Grid';
						break;
					case '8b1e1f1f6beb4b5790cc64a52fe07862':
					case 'c490cfd649c94d02851bded0e77d2411': // Template Revision
						config.standardConfigurationService = $injector.get('ppsDrawingTmplRevisionUIStandardService');
						config.dataServiceName = 'ppsDrawingTmplRevisionDataServiceFactory';
						config.listConfig = {initCalled: false, columns: []};
						config.ContainerType = 'Grid';
						config.validationService = null;
						break;
					case '6000ad4e0e934a23958349a0c3e24ba8': // production template list controller
						drwProdTemplateDataService = getProductDescService();
						validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationServiceFactory').getService(drwProdTemplateDataService);
						uiService = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService');

						config.layout = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceName = drwProdTemplateDataService;
						config.validationServiceName = validationService;
						config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
							.getService(drwProdTemplateDataService, uiService, validationService, guid);
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '6ab72263fd7d49b98ca55ecdaf21e3fd': // productionplanningDrawingSkillListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getDrawingSkillServiceInfo(), self.getDrawingSkillLayoutInfo);
						break;
					case '55031220d38b4abd858c2301acebbace': // productionplanningDrawingSkillDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getDrawingSkillServiceInfo(), self.getDrawingSkillLayoutInfo);
						break;
				}
				return config;
			};

			self.getParentServiceByParams = function (para) {
				if (para) {
					return $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
				}
			};

			function getProductDescService() {
				var para = {
					'serviceName': 'productionplanningDrawingProductDescriptionDataService',
					'parentService': 'productionplanningDrawingMainService',
					'parentFilter': 'engDrawingId',
					'endRead': 'listbyengdrawing',
					'translationIdentifier': 'productionplanning.drawing.productDescription.translationIdentifier',
					'uiServiceKey': 'forDrawing',
					'hasCharacteristic': true,
					'gridContainerGuid': '6000ad4e0e934a23958349a0c3e24ba8',
				};
				return $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
			}

			self.getProductDescService = getProductDescService;

			function getProductDescService2() {
				var para = {
					'serviceName': 'productionplanningDrawingStackProductTempalteDataService',
					'parentService': getPpsDrawingStackServiceInfo().dataServiceName,
					'parentFilter': 'engStackId',
					'endRead': 'listbyengstack',
					'translationIdentifier': 'productionplanning.drawing.stack.productDescription.translationIdentifier',
					'readOnly': true,
					'idProperty': 'UniqueId',
					'uiServiceKey': 'forStack'
				};
				return $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
			}

			function getPpsDrawingServiceInfo() {
				return {
					standardConfigurationService: 'productionplanningDrawingUIStandardService',
					dataServiceName: 'productionplanningDrawingMainService',
					validationServiceName: 'productionplanningDrawingValidationService'
				};
			}

			function getPpsDrawingUserDefineGroup() {
				var res = platformLayoutHelperService.getUserDefinedTextGroup(10, 'userDefTextGroup', 'userdefined', '');
				res.attributes.unshift('remark');
				return res;
			}

			self.getPpsDrawingLayout = function () {
				var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.drawing',
					['engdrawingstatusfk', 'code', 'description', 'engdrawingtypefk', 'prjprojectfk', 'lgmjobfk', 'islive', 'ppsitemfk', 'isfullyaccounted',
					'engdrawingfk'],
					[
						{
							gid: 'PlanningInformation',
							attributes: ['basclerkfk']
						},
						{
							gid: 'Assignment',
							attributes: ['prjlocationfk', 'mdccontrollingunitfk']
						}, getPpsDrawingUserDefineGroup()]);
				res.overloads = getOverloads(['engdrawingstatusfk', 'engdrawingtypefk', 'prjprojectfk',
					'lgmjobfk', 'basclerkfk', 'prjlocationfk',
					'mdccontrollingunitfk', 'islive', 'ppsitemfk', 'isfullyaccounted', 'doccolor', 'engdrawingfk']);
				res.addAdditionalColumns = true;

				var customColumnService = customColumnsServiceFactory.getService(moduleName);
				customColumnService.setClerkRoleConfig(res);

				return res;
			};

			function getPpsDrawingStackServiceInfo() {
				var ds = $injector.get('productionplanningDrawingStackDataService').getService();
				return {
					standardConfigurationService: 'productionplanningDrawingStackUIStandardService',
					dataServiceName: ds,
					validationServiceName: $injector.get('productionplanningDrawingStackValidationService').getService(ds)
				};
			}

			self.getPpsDrawingStackLayout = function () {
				var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.drawing.stack',
					['dbid', 'code', 'description', 'type', 'length', 'uomlengthfk', 'width', 'uomwidthfk', 'height', 'uomheightfk', 'weight', 'uomweightfk', 'islive', 'restypefk']);
				layout.overloads = getOverloads(['dbid', 'code', 'islive', 'uomlengthfk', 'uomwidthfk', 'uomheightfk', 'uomweightfk', 'restypefk']);

				return layout;
			};

			function getOverloads(overloads) {
				var ovls = {};
				if (overloads) {
					_.forEach(overloads, function (ovl) {
						var ol = getOverload(ovl);
						if (ol) {
							ovls[ovl] = ol;
						}
					});
				}

				return ovls;
			}

			function getOverload(overload) {
				var ovl = null;
				switch (overload) {
					case 'code':
						ovl = {
							grid:{
								sortOptions: {
									numeric: true
								}
							}
						};
						break;
					case 'islive':
					case 'isfullyaccounted':
						ovl = {readonly: true};
						break;
					case 'engdrawingstatusfk':
						ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.engineeringdrawingstatus', null, {
							showIcon: true,
							imageSelectorService: 'platformStatusSvgIconService',
							svgBackgroundColor: 'BackgroundColor',
							backgroundColorType: 'dec',
							backgroundColorLayer: [1, 2, 3, 4, 5, 6]
						});
						break;
					case 'engdrawingtypefk':
						ovl = drawingtypeLookupOverloadProvider.provideDrawingtypeLookupOverload();
						break;
					case 'prjprojectfk':
						ovl = ppsCommonLayoutOverloadService.getProjectOverload([{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedProject = args.selectedItem;
							}
						}]);
						break;
					case 'lgmjobfk':
						ovl = ppsCommonLayoutOverloadService.getJobOverload('PrjProjectFk');
						ovl.grid.editorOptions.lookupOptions.events = ovl.detail.options.lookupOptions.events = [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedLgmJob = args.selectedItem;
							}
						}];
						break;
					case 'basclerkfk':
						ovl = ppsCommonLayoutOverloadService.getClerkOverload();
						break;
					case 'prjlocationfk':
						ovl = ppsCommonLayoutOverloadService.getProjectLocationOverload(drawingMainService.getProjectId);
						break;
					case 'mdccontrollingunitfk':
						ovl = ppsCommonLayoutOverloadService.getControlUnitOverload(cuFilterKey);
						break;
					case 'ppsitemfk':
						ovl = {
							navigator: {
								moduleName: 'productionplanning.item'
							},
							grid: {
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
								}
							},
							detail: {
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
										},
										additionalFilters: [{
											'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing': 'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing',
											getAdditionalEntity: function () {
												return {'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing': true};
											}
										}]
									}
								}
							}
						};
						break;
					case 'uomlengthfk':
					case 'uomwidthfk':
					case 'uomheightfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							filterKey: uomFilterService.registerLengthDimensionFilter(1)
						});
						break;
					case 'uomweightfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							filterKey: uomFilterService.registerMassDimensionFilter(1)
						});
						break;
					case 'doccolor':
						ovl = {readOnly: true};
						break;
					case 'dbid':
						ovl = {
							formatter: function (row, cell, value, columnDef, dataContext, flag) {
								var format = '';
								if (dataContext.Version > 0) {
									format += flag ? '2' : getIcon('tlb-icons ico-db-delete', 'productionplanning.cadimport.delete');
								} else if (dataContext.DbId) {
									format += flag ? '3' : getIcon('tlb-icons ico-db', 'productionplanning.cadimport.existed');
								} else {
									format += flag ? '1' : getIcon('tlb-icons ico-db-new', 'productionplanning.cadimport.new');
								}
								return format;
							}
						};
						break;

					case 'restypefk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceTypeLookupDataService',
							showClearButton: true
						});
						break;
					case 'engdrawingfk':
						ovl = {
							navigator: {
								moduleName: 'productionplanning.drawing'
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									directive: 'productionplanning-drawing-dialog-lookup',
									lookupOptions: {
										showClearButton: true,
										additionalColumns: true,
										addGridColumns: [{
											id: 'Description',
											field: 'Description',
											name: 'Description',
											width: 300,
											formatter: 'description',
											name$tr$: 'cloud.common.entityDescription'
										}],
										displayMember: 'Code',
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									version: 3,
									lookupType: 'EngDrawing',
									displayMember: 'Code'
								},
								width: 70
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'productionplanning-drawing-dialog-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										defaultFilter: { projectId: 'PrjProjectFk'}
									}
								}
							}
						};
						break;
				}
				return ovl;
			}

			function getIcon(iconUrl, titleStr) {
				return '<i class="pane-r block-image ' + iconUrl + (titleStr ? '" title="' + $translate.instant(titleStr) : '') + '"></i>';
			}

			self.getPpsDrawingRevisionLayout = function () {
				var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.drawing.revision',
					['description', 'commenttext', 'revision']);

				return layout;
			};

			self.getPpsDrawingTmplRevisionLayout = function () {
				var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.drawing.template.revision',
					['description', 'commenttext', 'revision']);

				return layout;
			};


			self.getDrawingSkillLayoutInfo = function getDrawingSkillLayoutInfo () {
				return {
					fid: 'productionplanning.drawingskill',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['resskillfk', 'commenttext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						'resskillfk' : basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceCommonSkillLookupDataService'
						}),
					}
				};
			};

			self.getDrawingSkillServiceInfo = function getDrawingSkillServiceInfo() {
				return {
					standardConfigurationService: 'productionplanningDrawingSkillUIConfigurationService',
					dataServiceName: 'productionplanningDrawingSkillDataService',
					validationServiceName: 'productionplanningDrawingSkillValidationService'
				};
			};

		}
	]);
})();