
(function (angular) {
	'use strict';
	/* global  _  */

	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectControlsControllingCostCodesMainService', ['platformDataServiceFactory', 'platformModalService','$q','platformRuntimeDataService',
		'basicsCommonMandatoryProcessor', 'basicsLookupdataLookupDescriptorService','controllingProjectcontrolsDashboardService','basicsLookupdataTreeHelper','cloudCommonGridService', 'controllingProjectControlsConfigService', 'projectControlsColumnType',
		function (platformDataServiceFactory, platformModalService,$q,platformRuntimeDataService, basicsCommonMandatoryProcessor, basicsLookupdataLookupDescriptorService,parentService,basicsLookupdataTreeHelper,cloudCommonGridService, configService, projectControlsColumnType) {
			let controllingCostCodeService = {
				hierarchicalNodeItem: {
					module: moduleName,
					serviceName: 'controllingProjectControlsControllingCostCodesMainService',
					entityNameTranslationID: 'basics.controllingcostcodes.controllingCostCodes',
					httpRead: {
						useLocalResource: true,
						resourceFunction: resourceReadFunction,
					},
					entityRole: {
						node: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'ContrCostCodes',
							parentService: parentService,
							moduleName: 'controlling.projectcontrols.ControllingCostCodes'
						}
					},
					presenter: {
						tree: {
							parentProp: 'ParentFk', childProp: 'Children'
						}
					},
					translation: {
						uid: 'controllingProjectControlsControllingCostCodesMainService',
						title: 'controlling.projectcontrols.ControllingCostCodes',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(controllingCostCodeService);

			serviceContainer.data.markItemAsModified = angular.noop;
			serviceContainer.service.markItemAsModified = angular.noop;
			serviceContainer.data.usesCache = false;
			let service = serviceContainer.service;

			function boundData(result){
				let entities = [];
				let groupList = _.groupBy(result, 'Code');
				let cols = service.getGridColumns();

				_.forEach(groupList, function (d) {
					let entity = {};
					let items = angular.copy(d);
					let sacFields = _.map(configService.getSACColumns(), 'field');

					if (items.length > 1) {
						_.forEach(items, function (item) {
							delete item.nodeInfo;
							entity.Id = item.StructureIdId;
							entity.StructureParentId = item.StructureParentId < 0 ? null : item.StructureParentId;
							entity.StructureIdId = item.StructureIdId;
							entity.StructureLevel = item.StructureLevel;
							entity.StructureLevel1Id = item.StructureLevel1Id;
							entity.StructureLevel2Id = item.StructureLevel2Id;

							_.forEach(cols, function (col) {
								if (!_.isUndefined(item[col.field]) && col.field !== 'SPI' && col.field !== 'CPI') {

									if (item.hasOwnProperty(col.field) && !_.isNaN(parseFloat(item[col.field])) && typeof (parseFloat(item[col.field])) === 'number') {
										if (_.isUndefined(entity[col.field])) {
											entity[col.field] = 0;
										}

										if(_.indexOf(sacFields, col.field) >= 0){
											let inFieldName = col.field + '_IN_RP';
											let toFieldName = col.field + '_TO_RP';

											if (_.isUndefined(entity[inFieldName])) {
												entity[inFieldName] = 0;
											}
											entity[inFieldName] = entity[inFieldName] + item[inFieldName];

											if (_.isUndefined(entity[toFieldName])) {
												entity[toFieldName] = 0;
											}
											entity[toFieldName] = entity[toFieldName] + item[toFieldName];
										}else{
											entity[col.field] = entity[col.field] + parseFloat(item[col.field]);
										}

									} else if (item.hasOwnProperty(col.field)) {
										entity[col.field] = item[col.field];
										entity.Children = [];
									}
								}
							});
						});

						let tAC_to_RP = typeof (entity.TAC_to_RP) === 'number' ? entity.TAC_to_RP : 0;
						let wP_to_RP = typeof (entity.WP_to_RP) === 'number' ? entity.WP_to_RP : 0;
						let wS_to_RP = typeof (entity.WS_to_RP) === 'number' ? entity.WS_to_RP : 0;

						entity.CPI = tAC_to_RP === 0 ? 0 : wP_to_RP / tAC_to_RP;
						entity.SPI = wS_to_RP === 0 ? 0 : wP_to_RP / wS_to_RP;

						entities.push(entity);
					} else {
						delete items[0].nodeInfo;
						delete items[0].$$indColor;
						items[0].Children=[];
						items[0].Id = items[0].StructureIdId;
						items[0].StructureParentId = items[0].StructureParentId < 0 ? null : items[0].StructureParentId;
						entities = entities.concat(items);
					}
				});
				let context = {
					treeOptions:{
						parentProp : 'StructureParentId',
						childProp : 'Children'
					},
					IdProperty: 'Id'
				};

				let readonlyFieldTypes = [projectControlsColumnType.SAC, projectControlsColumnType.WCF, projectControlsColumnType.BCF, projectControlsColumnType.CUSTOM_FACTOR];
				_.forEach(entities,function (item){
					_.forEach(configService.getEditableColumnFieldByType(readonlyFieldTypes), function(code){
						platformRuntimeDataService.readonly(item, [{field: code, readonly: true}]);
					})
				});

				entities = basicsLookupdataTreeHelper.buildTree(entities, context);
				return entities;
			}

			function prepareCuCostCode (costAnalysisTree,data,groupingColumns,onReadSucceeded){


				let selectedParent = parentService.getSelected();
				let result = [];

				let matchCostAnalysis = _.find(costAnalysisTree,function (d){
					for(let i =1; i<=selectedParent.StructureLevel; i++){
						if(d['StructureLevel'+i+'Id'] !== selectedParent['StructureLevel'+i+'Id']  || selectedParent.StructureIdId!== d.StructureIdId  || selectedParent.StructureLevel!== d.StructureLevel ){
							return false;
						}
					}
					return true;
				});


				let costAnalysisList=[];
				if (matchCostAnalysis) {
					cloudCommonGridService.flatten([matchCostAnalysis], costAnalysisList, 'Children');
				}

				if(_.isNull(selectedParent.ParentFk)){
					_.forEach(costAnalysisTree, function (cd) {
						let groupingCol = groupingColumns[cd.StructureLevel - 1];
						if ((groupingCol && groupingCol.groupColumnId === 'REL_COSTCODE_CO')) {
							result.push(cd);
						}
					});

				}else{
					_.forEach(costAnalysisList, function (cd) {
						let groupingCol = groupingColumns[cd.StructureLevel - 1];
						if ((groupingCol && groupingCol.groupColumnId === 'REL_COSTCODE_CO')) {
							result.push(cd);
						}
					});
				}

				let entities = boundData(result);
				onReadSucceeded(entities, data);
			}

			function getControllingCostCodePromise(data, onReadSucceeded) {
				let groupingColumns = parentService.getGroupColumnForExtendControlCostCode();
				let groupColumnIdString = _.map(groupingColumns,'groupColumnId').toString();
				let costAnalysisCache= basicsLookupdataLookupDescriptorService.getData(groupColumnIdString);

				if(costAnalysisCache && _.size(costAnalysisCache)>0){

					prepareCuCostCode (costAnalysisCache,data,groupingColumns,onReadSucceeded);

					return $q.when(true);
				}else {
					return parentService.loadDashBorad().then(function (response) {

						let costAnalysisTree = [];
						if (response && response.length) {
							cloudCommonGridService.flatten(response, costAnalysisTree, 'Children');
						}

						basicsLookupdataLookupDescriptorService.updateData(groupColumnIdString, costAnalysisTree);
						prepareCuCostCode(costAnalysisTree, data, groupingColumns, onReadSucceeded);
						return $q.when(true);
					});
				}
			}

			function  resourceReadFunction(data, readData, onReadSucceeded){

				let groupingColumns = parentService.getGroupingColumns();
				let isHasContrCostCodeGroup = _.find(groupingColumns,{groupColumnId:'REL_COSTCODE_CO'});

				if(isHasContrCostCodeGroup){
					let result = [];
					let selectedParent = parentService.getSelected();

					let allGroupingColumns = parentService.getAllGroupingColumns();
					let cuCostCodeGroupingLevel = _.findIndex(allGroupingColumns,{groupColumnId:'REL_COSTCODE_CO'})+1;

					let childTreeList = parentService.getTreeList(selectedParent);
					childTreeList.push(selectedParent);

					_.forEach(childTreeList, function (cd) {
						let groupingCol = groupingColumns[cd.StructureLevel - 1];
						if ((groupingCol && groupingCol.groupColumnId === 'REL_COSTCODE_CO') ||  cd.StructureLevel === cuCostCodeGroupingLevel) {
							result.push(cd);
						}
					});
					return  boundData(result);

				}else {
					return getControllingCostCodePromise(data, onReadSucceeded);
				}
			}

			let gridColumns =[];
			service.setGridColumns = function setGridColumns(cols){
				gridColumns = cols;
			};

			service.getGridColumns = function getGridColumns() {
				return gridColumns;
			};
			return service;

		}]);

})(angular);