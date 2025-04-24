/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';
	/* global _, globals */
	let moduleName = 'estimate.main';
	let estModule = angular.module(moduleName);

	estModule.factory('estimateMainLineitemParamertersService', ['$injector', 'platformGridAPI', 'platformDataServiceFactory',
		'estimateMainService', 'estimateMainLineitemParameterProcessService','estimateMainParamStructureConstant','estMainParamItemNames',
		function($injector, platformGridAPI, platformDataServiceFactory,
			estimateMainService, estimateMainLineitemParameterProcessService, estimateMainParamStructureConstant,estMainParamItemNames){
		   let currentLineItem = null;
			let grid = null;
			let option = {
				flatLeafItem:{
					module: estModule,
					serviceName: 'estimateMainLineitemParamertersService',
					entityNameTranslationID: 'estimate.main.lineItemParameterContainer',
					httpRead:{
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
						endRead: 'getlineitemparameter',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.Dto = estimateMainService.getSelected();
							readData.ParamLevel = 3;
							currentLineItem = readData.Dto;
						}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								let list = readData.parameters;
								let structureDetails = readData.structureDetails || [];
								let structureCount = structureDetails.length;
								_.forEach(structureDetails, function (item){
									item.level = structureCount;
									structureCount--;
								});
								let i=1;
								// regenerate Id of entities.
								list = _.uniqBy(list, 'Id');
								_.forEach(list, function (item){
									item.RealyId = item.Id;
									item.Id = i++;
									item.isLineItemParamContainerParam = true;

									switch (item.AssignedStructureId){
										case estimateMainParamStructureConstant.Project:
											item.level = structureDetails.length + 2;
											break;
										case estimateMainParamStructureConstant.EstHeader:
											item.level = structureDetails.length + 1;
											break;
										case estimateMainParamStructureConstant.LineItem:
											item.level = 0;
											break;
										default:
											item.level = !item.CostGroupCatCode
												? _.find(structureDetails, {EstStructureFk: item.AssignedStructureId}).level
												: _.find(structureDetails, {EstStructureFk: item.AssignedStructureId, Code: item.CostGroupCatCode}).level;
											break;
									}

									// item.DescriptionInfo.Translated = 'level:' + item.level;
								});

								$injector.get('estimateMainCommonCalculationService').resetParameterDetailValueByCulture(list);

								return serviceContainer.data.handleReadSucceeded(list, data);
							}
						}
					},
					dataProcessor: [estimateMainLineitemParameterProcessService],
					entityRole: {
						node: { codeField: 'Code', itemName: 'EstLineItemParameters', moduleName: 'Estimate Main',  parentService: estimateMainService}
					},
					actions: {},
					modification: 'none'
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(option);
			serviceContainer.data.doesRequireLoadAlways = false;

			let service = serviceContainer.service;

			service.mergeNewData = function (newList){
				if(!newList || newList.length === 0){
					return;
				}

				let list = service.getList();
				if(!list || list.length === 0){
					return;
				}

				_.forEach(newList, function (item){
					let oldItem = _.find(list, {RealyId: item.MainId});
					if(oldItem){
						let originalId = oldItem.Id;
						let originalRealyId = oldItem.RealyId;
						let originalAssignedStructureId = oldItem.AssignedStructureId;
						angular.extend(oldItem, item);
						oldItem.Id = originalId;
						oldItem.RealyId = originalRealyId;
						oldItem.AssignedStructureId = originalAssignedStructureId;
					}
				});

				service.gridRefresh();
			};

			service.isReadonly = function (){
				return false;
			};

			let isLoading = false;
			service.refreshToLineItemParams = function(response, mandatory) {
				// if line item parameter container has open, and selected lineitem
				if (grid && platformGridAPI.grids.exist(grid) && currentLineItem) {
					let reLoad = false;
					// update main data
					if(response) {
						_.forEach(estMainParamItemNames, function (itemName) {
							// while update data exist itemNames params, then reload the line item parameter container
							if (!reLoad && (response[itemName + 'ParamToSave'] || response[itemName + 'ParamToDelete'])) {
								reLoad = true;
							}
						});
					}
					if (!isLoading && (reLoad || mandatory)) {
						isLoading = true;
						service.load().then(() => {
							isLoading = false;
						});
					}
				}
			};

			service.setGrid = function(uuid){
				grid = uuid;
			};

			return service;

		}
	]);

})(angular);
