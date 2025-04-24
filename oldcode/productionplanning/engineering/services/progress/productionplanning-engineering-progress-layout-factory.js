/**
 * Created by zov on 27/06/2019.
 */


(function () {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('ppsEngineeringProgressLayoutFactory', ppsEngineeringProgressLayoutFactory);
	ppsEngineeringProgressLayoutFactory.$inject = ['platformLayoutHelperService',
		'basicsLookupdataConfigGenerator',
		'productionplanningCommonLayoutHelperService'];
	function ppsEngineeringProgressLayoutFactory(platformLayoutHelperService,
												 basicsLookupdataConfigGenerator,
												 ppsCommonLayoutHelperService) {

		function getUserDefineGroup() {
			var res = platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', '');
			return res;
		}
		
		function getUserFlagGroup() {
			return {
				gid: 'userFlagGroup',
				attributes: ['userflag1', 'userflag2']
			};
		}

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
				case 'engdrawingfk':
					ovl = {
						readonly: true,
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'productionplanning-drawing-lookup',
								lookupOptions: {
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 300,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									displayMember: 'Code'
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
								lookupDirective: 'productionplanning-drawing-lookup',
								descriptionMember: 'Description'
							}
						}
					};
					break;
				case 'engtaskfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						//additionalColumns: false,
						filter: function (entity) {
							return {
								engDrawingFk: entity.EngDrawingFk
							};
						},
						dataServiceName: 'ppsEngineeringTaskLookupDataService',
						showClearButton: true
					});
					break;
				case 'lgmjobrecvfk':
					ovl = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload();
					break;
				case 'basclerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'mdccontrollingunitfk':
					ovl = ppsCommonLayoutHelperService.providePrjControllingUnitLookupOverload();
					break;
				case 'quantity':
					ovl = { disallowNegative: true };
					break;
			}
			return ovl;
		}

		function create4Drawing() {
			return createLayout('engtaskfk');
		}

		function create4Task() {
			return createLayout('engdrawingfk');
		}

		function doCreateLayout(dynamicColumn) {
			var basicColumns = ['description', 'lgmjobrecvfk', 'basclerkfk', 'mdccontrollingunitfk', 'performancedate', 'actualstartdate', 'actualenddate', 'ismanualquantity', 'quantity', 'remark'];
			basicColumns.splice(1, 0, dynamicColumn);
			var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.engineering.progress',
				basicColumns, [getUserDefineGroup(), getUserFlagGroup()]);
			layout.overloads = getOverloads(['engdrawingfk', 'engtaskfk', 'lgmjobrecvfk', 'basclerkfk', 'mdccontrollingunitfk', 'quantity']);
			return layout;
		}

		var cache = {};
		function createLayout(dynamicColumn){
			if(!cache[dynamicColumn]){
				cache[dynamicColumn] = doCreateLayout(dynamicColumn);
			}

			return cache[dynamicColumn];
		}

		return{
			createProgressLayout4Drawing: create4Drawing,
			createProgressLayout4Task: create4Task
		};
	}
})();