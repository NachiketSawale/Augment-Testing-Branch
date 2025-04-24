/**
 * Created by zov on 23/04/2019.
 */
(function () {
	/*global angular,_*/
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonLayoutOverloadService', [
		'platformLayoutHelperService',
		'basicsLookupdataConfigGenerator',
		'$injector',
		'productionplanningCommonLayoutHelperService',
		'$translate',
		function (platformLayoutHelperService,
				  basicsLookupdataConfigGenerator,
			$injector,
			ppsCommonLayoutHelperService,
			$translate) {
			var service = {};
			service.getProjectOverload = function (events) {
				return {
					navigator: {
						moduleName: 'project.main'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookup-data-project-project-dialog',
							lookupOptions: {
								initValueField: 'ProjectNo',
								events : events
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionField: 'ProjectName',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								initValueField: 'ProjectNo',
								events : events
							}
						}
					}
				};
			};
			service.getClerkOverload = function () {
				return {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'cloud-clerk-clerk-dialog',
							'lookupOptions': {'showClearButton': true}
						},
						'formatter': 'lookup',
						'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code', 'version': 3,},
						'width': 100
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'cloud-clerk-clerk-dialog',
							'descriptionMember': 'Description',
							'lookupOptions': {'showClearButton': true}
						}
					}
				};
			};
			service.getJobOverload = function (prjFieldName) {
				return ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: prjFieldName});
			};
			service.addPrjCostGroupsOverload = function (layout, count, prjFilterFn) {
					if(!_.isNil(layout)){
						for (var i = 1; i <= count; i++) {
							layout.overloads['prjcostgroup' + i + 'fk'] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectCostGroup' + i + 'LookupDataService',
								showClearButton: true,
								filter: prjFilterFn
							});
						}
					}
			};
			service.addLicCostGroupsOverload = function (layout, count) {
				if(!_.isNil(layout)) {
					for (var i = 1; i <= count; i++) {
						layout.overloads['liccostgroup' + i + 'fk'] = basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
							moduleQualifier: 'estLicCostGroups' + i + 'LookupDataService',
							dataServiceName: 'basicsCostGroups' + i + 'LookupDataService',
							valMember: 'Id',
							dispMember: 'Code'
						});
					}
				}
			};
			service.getProjectLocationOverload = function (prjFilterFn) {
				return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					cacheEnable: true,
					additionalColumns: true,
					filter: prjFilterFn,
					showClearButton: true
				});
			};
			service.getControlUnitOverload = function (filterKey) {
				var addColumns = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];
				return {
					navigator: {
						moduleName: 'controlling.structure'
					},
					'detail': {
						'type': 'directive',
						'directive': 'controlling-Structure-Prj-Controlling-Unit-Lookup',

						'options': {
							'eagerLoad': true,
							'showClearButton': true,
							'filterKey': filterKey,
							'additionalColumns': true,
							'displayMember': 'Code',
							'addGridColumns': addColumns
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: filterKey,
								'additionalColumns': true,
								'displayMember': 'Code',
								'addGridColumns': addColumns
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'controllingunit',
							displayMember: 'Code'
						}
					}
				};
			};

			function translateAdditionalColumns(uiStandardSrv) {
				$injector.get('productionplanningCommonTranslationService'); //ensure to load translation service

				findAndTranslate(uiStandardSrv, 'length ft', 'productionplanning.common.additionalColumns.lengthFt');
				findAndTranslate(uiStandardSrv, 'width ft', 'productionplanning.common.additionalColumns.widthFt');
				findAndTranslate(uiStandardSrv, 'height ft', 'productionplanning.common.additionalColumns.heightFt');
				findAndTranslate(uiStandardSrv, 'uomlengthfkdescription', 'productionplanning.common.additionalColumns.uomLengthFkDescription');
				findAndTranslate(uiStandardSrv, 'uomwidthfkdescription', 'productionplanning.common.additionalColumns.uomWidthFkDescription');
				findAndTranslate(uiStandardSrv, 'uomheightfkdescription', 'productionplanning.common.additionalColumns.uomHeightFkDescription');
				findAndTranslate(uiStandardSrv, 'prjcostgroup1fkdescription', 'productionplanning.common.additionalColumns.prjCG1FkDescription');
				findAndTranslate(uiStandardSrv, 'prjcostgroup2fkdescription', 'productionplanning.common.additionalColumns.prjCG2FkDescription');
				findAndTranslate(uiStandardSrv, 'prjcostgroup3fkdescription', 'productionplanning.common.additionalColumns.prjCG3FkDescription');
				findAndTranslate(uiStandardSrv, 'prjcostgroup4fkdescription', 'productionplanning.common.additionalColumns.prjCG4FkDescription');
				findAndTranslate(uiStandardSrv, 'prjcostgroup5fkdescription', 'productionplanning.common.additionalColumns.prjCG5FkDescription');
				findAndTranslate(uiStandardSrv, 'liccostgroup1fkdescription', 'productionplanning.common.additionalColumns.licCG1FkDescription');
				findAndTranslate(uiStandardSrv, 'liccostgroup2fkdescription', 'productionplanning.common.additionalColumns.licCG2FkDescription');
				findAndTranslate(uiStandardSrv, 'liccostgroup3fkdescription', 'productionplanning.common.additionalColumns.licCG3FkDescription');
				findAndTranslate(uiStandardSrv, 'liccostgroup4fkdescription', 'productionplanning.common.additionalColumns.licCG4FkDescription');
				findAndTranslate(uiStandardSrv, 'liccostgroup5fkdescription', 'productionplanning.common.additionalColumns.licCG5FkDescription');
				findAndTranslate(uiStandardSrv, 'prjlocationfkdescription', 'productionplanning.common.additionalColumns.prjLocationFkDescription');
				findAndTranslate(uiStandardSrv, 'mdccontrollingunitfkdescription', 'productionplanning.common.additionalColumns.mdcCUFkDescription');
			}
			function findAndTranslate(uiStandardSrv, colId, translateIdentifier) {
				$injector.get('productionplanningCommonTranslationService'); //ensure to load translation service

				var listConfig = uiStandardSrv.getStandardConfigForListView();
				var detailConfig = uiStandardSrv.getStandardConfigForDetailView();
				var addiColumn =  _.find(listConfig.columns, {id:colId});
				if(addiColumn && !addiColumn.name$tr$){
					addiColumn.name$tr$ = translateIdentifier;
				}

				var addiColumnDetail =  _.find(detailConfig.rows, {rid:colId});
				if(addiColumnDetail && !addiColumnDetail.label$tr$){
					addiColumnDetail.label$tr$ = translateIdentifier;
				}
			}
			service.translateAdditionalColumns = translateAdditionalColumns;
			service.findAndTranslate = findAndTranslate;
			service.translateCustomUom = (uiStandardSrv) => {
				findAndTranslate(uiStandardSrv, 'length uom', 'productionplanning.common.additionalColumns.lengthCustomUom');
				findAndTranslate(uiStandardSrv, 'width uom', 'productionplanning.common.additionalColumns.widthCustomUom');
				findAndTranslate(uiStandardSrv, 'height uom', 'productionplanning.common.additionalColumns.heightCustomUom');
				findAndTranslate(uiStandardSrv, 'area uom', 'productionplanning.common.additionalColumns.areaCustomUom');
				findAndTranslate(uiStandardSrv, 'area2 uom', 'productionplanning.common.additionalColumns.area2CustomUom');
				findAndTranslate(uiStandardSrv, 'area3 uom', 'productionplanning.common.additionalColumns.area3CustomUom');
				findAndTranslate(uiStandardSrv, 'weight uom', 'productionplanning.common.additionalColumns.weightCustomUom');
				findAndTranslate(uiStandardSrv, 'weight2 uom', 'productionplanning.common.additionalColumns.weight2CustomUom');
				findAndTranslate(uiStandardSrv, 'weight3 uom', 'productionplanning.common.additionalColumns.weight3CustomUom');
				findAndTranslate(uiStandardSrv, 'actualweight uom', 'productionplanning.common.additionalColumns.actualWeightCustomUom');
			};

			Object.freeze(service);
			return service;
		}]);
})();