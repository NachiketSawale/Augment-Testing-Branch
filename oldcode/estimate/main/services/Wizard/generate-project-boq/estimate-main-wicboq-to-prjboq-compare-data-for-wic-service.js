/**
 * Created by wul on 4/18/2018.
 */
(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/* jslint nomen:true */
	/* global globals, _, Platform */
	estimateMainModule.factory('estimateMainWicboqToPrjboqCompareDataForWicService', ['$q','$injector','$translate','platformDataValidationService','platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor', 'lookupZeroToNullProcessor', 'platformModalService', 'estimateMainService','boqMainCommonService','platformRuntimeDataService','estimateMainGeneratePrjboqStructureService', 'cloudCommonGridService',
		function ($q, $injector, $translate, platformDataValidationService, platformDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor, lookupZeroToNullProcessor, platformModalService, estimateMainService, boqMainCommonService,platformRuntimeDataService, estimateMainGeneratePrjboqStructureService, cloudCommonGridService) {

			let projectId = estimateMainService.getSelectedProjectId(),
				filterData = {},
				flatProjBoqs = [],
				flatWicBoqs = [],
				myCreationData = {},
				divisionTemplate = {};

			let boqServiceOption = {
				hierarchicalRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainWicboqToPrjboqCompareDataForWicService',
					httpCreate: {route: globals.webApiBaseUrl + 'boq/main/'},
					// httpUpdate: {route: globals.webApiBaseUrl + 'boq/main/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'boq/project/',
						endRead: 'generateboqbylineitems',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData = angular.merge(readData, filterData);
							readData.ConfigData.GroupCriteria = _.map(readData.ConfigData.GroupCriteria, function (item) {
								return item.Code;
							}).join(', ');
							readData.ConfigData.FilterRequest = estimateMainService.getLastFilter();
							readData.ConfigData.StructureName = $injector.get('estimateMainGroupCriteriaTypeService').getSelectedStructureName(readData.ConfigData.GrpStructureType);
							readData.ConfigData = handleGroupingColumns(readData.ConfigData);
							readData.ConfigData.DescCriteria = $injector.get('estimateMainDescriptionCriteriaComplexService').convertDescStr2CodeStr(readData.ConfigData.DescCriteria);
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor, lookupZeroToNullProcessor],
					useItemFilter: true,
					presenter: {
						tree: {
							parentProp: 'BoqItemFk',
							childProp: 'BoqItems',
							incorporateDataRead: function (readData, data) {
								divisionTemplate = readData.newWicDivisionTemplate;
								flatProjBoqs = [];
								flatWicBoqs = [];
								_.forEach(readData.prjBoqs, function(prjBoq){
									boqMainCommonService.setBoqItemLevel(prjBoq);
									cloudCommonGridService.flatten([prjBoq], flatProjBoqs, 'BoqItems');
								});

								let boqHeaderIds = [];
								_.forEach(readData.sourceBoqs, function(wicBoq){
									cloudCommonGridService.flatten([wicBoq], flatWicBoqs, 'BoqItems');
									boqHeaderIds.push(wicBoq.OriginalBoqHeaderId);
									if(wicBoq && wicBoq.TargetBoqHeaderId && wicBoq.TargetBoqHeaderId > 0){
										boqHeaderIds.push(wicBoq.TargetBoqHeaderId);
									}

									handleWicBoqsBeforeAddToView(wicBoq);

									// validate repeated root reference No.
									if(wicBoq){
										let sameRootRefNo = _.find(readData.sourceBoqs, function(item){
											if(item.Reference === wicBoq.Reference && item.Id !== wicBoq.Id){
												return item;
											}
										});
										let result ={
											valid: true,
											apply: true
										};

										if(sameRootRefNo){
											result.valid = false;
											result.error = $translate.instant('estimate.main.generateProjectBoQsWizard.repeatedRootNo');
										}

										platformRuntimeDataService.applyValidationResult(result, wicBoq, 'Reference');
										let relatePrjRootBoq = _.find(flatProjBoqs, function (item) {
											if(item.Reference === wicBoq.Reference && boqMainCommonService.isRoot(item)){
												return item;
											}
										});
										if(relatePrjRootBoq){
											let toCheckFlatWicBoqs = [],
												toCheckFlatPrjBoqs = [];
											cloudCommonGridService.flatten(wicBoq.BoqItems || [], toCheckFlatWicBoqs, 'BoqItems');
											cloudCommonGridService.flatten(relatePrjRootBoq.BoqItems || [], toCheckFlatPrjBoqs, 'BoqItems');
											result.valid = true;
											_.forEach(toCheckFlatWicBoqs, function (item) {
												if(!item.MatchRefNo && result.valid){
													if(_.find(toCheckFlatPrjBoqs, {Reference:item.Reference})){
														result.valid = false;
														result.error = $translate.instant('boq.main.referenceInUse');
													}
													platformRuntimeDataService.applyValidationResult(result, item, 'Reference');
												}
											});
										}
									}
								});
								// generateStyle();
								estimateMainGeneratePrjboqStructureService.loadBoqStuctures(boqHeaderIds);
								return data.handleReadSucceeded(readData.sourceBoqs, data);
							},
							initCreationData: function initCreationData(creationData) {
								if (creationData && !_.isEmpty(myCreationData)) {

									creationData.boqHeaderFk = myCreationData.boqHeaderFk;
									creationData.parentItemId = myCreationData.parentItemId;
									creationData.parentId = myCreationData.parentItemId;
									creationData.parent = myCreationData.parent;
									creationData.selectedItemId = myCreationData.selectedItem ? myCreationData.selectedItem.Id : -1;
									creationData.lineType = myCreationData.lineType;
									creationData.BoqItemPrjBoqFk = myCreationData.parent.BoqItemPrjBoqFk;
									creationData.DivisionType = myCreationData.DivisionType;
									creationData.refCode = myCreationData.refCode;
									creationData.DoSave = myCreationData.doSave;
								}
							},
							handleCreateSucceeded: function (newItem) {
								let parentBoq = _.find(flatWicBoqs, {Id: newItem.BoqItemFk, BoqHeaderFk: newItem.BoqHeaderFk});
								newItem.OriginalBoqHeaderId = parentBoq.OriginalBoqHeaderId;
								flatWicBoqs.push(newItem);
							}
						}
					},
					actions: {
						create: 'hierarchical'// ,
						// canCreateCallBackFunc: function (/*selectedItem, data*/) {
						//     return (service.getReadOnly()) ? false : service.createNewItem(false);
						// },
						// canCreateChildCallBackFunc: function (/*selectedItem, data*/) {
						//     return (service.getReadOnly()) ? false : service.createNewSubDivision(false);
						// }
					},
					entityRole: {root: {
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						codeField: 'Reference',
						descField: 'BriefInfo.Description',
						itemName: 'EstBoq',
						moduleName: 'Estimate Main'
					}}
				}
			};

			function handleGroupingColumns(configData) {
				if(configData.GrpStructureType === 1)  {return configData;}
				else if(configData.GrpStructureType === 0) {
					if(configData.CreateOneBoqForOneLI || !configData.GroupCriteria){
						configData.GroupingColumns.push({
							Depth: 1,
							GroupColumnId: 'Code',
							GroupType: 1
						});
					}else{
						let groups = configData.GroupCriteria.split(',');
						_.forEach(groups, function (item) {
							if(!!item && item.toLowerCase().indexOf('sortcode') > -1){
								configData.GroupingColumns.push({
									Depth: 1,
									GroupColumnId: 'Project.Main.SortCode' + (item === 'SortCode10' ? '10' : '0' + item.replace('SortCode', '').trim()),
									GroupType: 2
								});
							}
						});
					}
				}
				else if(configData.GrpStructureType === 16){
					configData.groupingColumns = $injector.get('estimateMainBidCreationService').handleGroupColumns();
				}
				return configData;
			}

			function handleWicBoqsBeforeAddToView(wicBoq) {

				if(wicBoq && wicBoq.TargetBoqHeaderId && wicBoq.TargetBoqHeaderId > 0){
					boqMainCommonService.setBoqItemLevel(wicBoq);
				}

				// check wherther some same Referenece No. in different level between Wic and project Boq.
				if(wicBoq){
					checkSameRefNoInDifferentLevel(wicBoq, flatProjBoqs);
				}

				if(wicBoq && wicBoq.TargetBoqHeaderId && wicBoq.TargetBoqHeaderId > 0){
					reGenerateMatchBoqsRefNo(wicBoq, flatProjBoqs);
				}


				if(wicBoq){
					treeHandler(wicBoq, function (item) {
						item.IsWicItem = true;
					});
				}
			}

			let container = platformDataServiceFactory.createNewComplete(boqServiceOption);
			container.data.updateOnSelectionChanging = null;
			container.data.entityDeleted = new Platform.Messenger();
			container.data.doUpdate = null;
			let service = container.service;
			service.markItemAsModified = null;

			service.loadToolsChange = new Platform.Messenger();
			container.data.processNewParent = function processNewWicRefNo(newParent) {
				// update image of parent item
				let root = service.getCurrentRootItem(newParent);
				checkSameRefNoInDifferentLevel(root, flatProjBoqs);
				reGenerateMatchBoqsRefNo(root, flatProjBoqs);
			};

			service.loadData = function(filterConfigData) {
				filterData = {};
				filterData.ConfigData = angular.copy(filterConfigData);

				if(projectId){
					return service.load();
				}else{
					let defer = $q.defer();
					defer.resolve([]);
					return defer.promise;
				}

			};

			service.getCurrentRootItem = function(selectedItem){
				let list = service.getList();
				if(!selectedItem){
					selectedItem = service.getSelected();
				}
				if(!list || !selectedItem){
					return;
				}

				let root = {};
				_.forEach(list, function(item){
					if(boqMainCommonService.isRoot(item) && item.BoqHeaderFk === selectedItem.BoqHeaderFk){
						root = item;
					}
				});

				return root;
			};

			function reGenerateMatchBoqsRefNo(wicBoqRoot, prjBoqs) {
				let relatePrjRootBoq = _.find(prjBoqs, function (item) {
					if(item.Reference === wicBoqRoot.Reference && boqMainCommonService.isRoot(item)){
						return item;
					}
				});

				if(!relatePrjRootBoq){ return;}

				setMatchReference(wicBoqRoot, _.filter(flatProjBoqs, {BoqHeaderFk: relatePrjRootBoq.BoqHeaderFk}));
			}

			function setMatchReference(wicBoqRoot, relatePrjRootBoq){
				let wicChilds = wicBoqRoot.BoqItems,
					temp = [];

				while(wicChilds && wicChilds.length > 0){
					temp = [];
					_.forEach(wicChilds, function(item) {
						let matchBoq = _.find(relatePrjRootBoq, function (chilDItem) {
							let isMatch,
								wicRefNoFullPath = getRefNoFullPath(item, true) || '',
								prjRefNoFullPath = getRefNoFullPath(chilDItem, false) || '';

							if(filterData.ConfigData.CompareType.toString() !== '2'){
								isMatch = wicRefNoFullPath === prjRefNoFullPath;
							}else{
								let wicRefNo2FullPath = getRefNo2FullPath(item, true) || '';
								let prjRefNo2FullPath = getRefNo2FullPath(chilDItem, false) || '';

								if(wicRefNo2FullPath === '' && prjRefNo2FullPath === ''){
									isMatch = wicRefNoFullPath === prjRefNoFullPath;
								}else{
									isMatch = wicRefNo2FullPath === prjRefNo2FullPath;
								}
							}
							if(!isMatch) {return false;}

							if(filterData.ConfigData.CompareWithUom){
								isMatch = (item.BasUomFk || 0) === (chilDItem.BasUomFk || 0);
							}
							if(!isMatch) {return false;}

							if(filterData.ConfigData.CompateWithOutSp){
								isMatch = (item.BriefInfo.Translated || '') === (chilDItem.BriefInfo.Translated || '');
							}
							let parentBoq = getParentBoq(item, true);
							return isMatch && item.BoqLineTypeFk === chilDItem.BoqLineTypeFk && parentBoq.MatchRefNo!=='';

						});
						if(matchBoq && matchBoq.Reference){
							item.MatchRefNo = matchBoq.Reference;
							platformRuntimeDataService.applyValidationResult(true, item, 'Reference');
						}else{
							item.MatchRefNo = '';
						}
						if(item.BoqItems && item.BoqItems.length >0){
							_.forEach(item.BoqItems, function (boqItem) {
								temp.push(boqItem);
							});
						}
					});
					wicChilds = temp;
				}
			}

			service.validateRootRefNo= function (entity, newRefNo){
				if(!flatProjBoqs) {
					return true;
				}

				if(boqMainCommonService.isRoot(entity)){
					let result = platformDataValidationService.isMandatory(newRefNo, 'Reference');
					if(!result.valid){
						return result;
					}


					// check if exist same root reference No.
					let sameRootNo = _.find(flatWicBoqs, function(item){
						return boqMainCommonService.isRoot(item) && item.Id !== entity.Id && item.Reference === newRefNo;
					});

					if(sameRootNo){
						return {
							valid: false,
							apply: true,
							error:$translate.instant('estimate.main.generateProjectBoQsWizard.repeatedRootNo')
						};
					}
				}
				return true;
			};

			function onEntityChanged(entity) {
				entity = entity || service.getSelected();

				if(boqMainCommonService.isRoot(entity)){
					if(!entity.Reference){
						return;
					}
					let sameRootNo = _.find(flatWicBoqs, function(item){
						return boqMainCommonService.isRoot(item) && item.Id !== entity.Id && item.Reference === entity.Reference;
					});

					if(sameRootNo){
						platformModalService.showYesNoDialog('estimate.main.generateProjectBoQsWizard.sameRootNoContent', 'estimate.main.generateProjectBoQsWizard.sameRootNoTitle').then(function (response) {
							if (response.yes) {
								let modalOptions = {
									templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/generate-project-boq/estimate-main-wicboq-moveing-dialog.html',
									iconClass: 'ico-info',
									dataItems: sameRootNo,
									resizeable: true,
									width: '530px',
									height: '280px'
								};

								platformModalService.showDialog(modalOptions);
							}
						});
					}else{
						let rootPrjBoq = _.find(flatProjBoqs, function(item){
							return boqMainCommonService.isRoot(item) && item.Reference === entity.Reference;
						});

						let boqHeaderFk = rootPrjBoq ? rootPrjBoq.BoqHeaderFk : entity.OriginalBoqHeaderId;

						$injector.get('estimateMainGeneratePrjboqStructureService').getBoqStructure(boqHeaderFk).then(function (data) {
							reGenerateBoqTreeRefNoByNewRootNo(entity, data, rootPrjBoq);
						});
					}
				}
			}

			function reGenerateBoqTreeRefNoByNewRootNo(rootEntity, boqHeader, rootPrjBoq) {
				let structureService = $injector.get('generateWipBoqStructureService');
				structureService.setSelectedHeaderFkByHeader(boqHeader);

				let list = service.getList();
				let newStructureFreeState = structureService.isFreeBoq();
				if(newStructureFreeState){
					let oldBoqHeaderFk = rootEntity.BoqHeaderFk;
					_.forEach(list, function(item){
						if(item.BoqHeaderFk === oldBoqHeaderFk){
							item.BoqHeaderFk = boqHeader.Id;
							if(boqMainCommonService.isRoot(item)){
								item.TargetBoqHeaderId = rootPrjBoq ? boqHeader.Id : 0;
								item.MatchRefNo = rootPrjBoq ? rootPrjBoq.Reference : '';
							}else{
								item.Reference = item.OriginalRefNo || item.Reference;
								if(!rootPrjBoq){
									item.MatchRefNo = '';
								}

							}

						}
					});

					reGenerateMatchBoqsRefNo(rootEntity, flatProjBoqs);
					service.checkRepeatedForNoMatched(rootEntity, structureService);
					service.gridRefresh();
					return;
				}

				let refNo = rootEntity.Reference;
				treeHandler(rootEntity, function (item) {
					item.Reference = '0';
					item.MatchRefNo = '';
					platformRuntimeDataService.applyValidationResult(true, item, 'Reference');
				});
				rootEntity.Reference = refNo;

				reFormatWicStructure(rootEntity, boqHeader.BoqStructureEntity, false);

				for(let i = 0; i< rootEntity.BoqItems.length; i++){
					structureService.renumberReferences(rootEntity, rootEntity, rootEntity.BoqItems[i]);
					let j = i+1;
					while (j < rootEntity.BoqItems.length){
						rootEntity.BoqItems[j].Reference =  rootEntity.BoqItems[i].Reference;
						j ++;
					}
				}
				let newBoqHeaderFk = rootPrjBoq ? rootPrjBoq.BoqHeaderFk : rootEntity.OriginalBoqHeaderId;
				rootEntity.TargetBoqHeaderId = rootPrjBoq ? rootPrjBoq.BoqHeaderFk : 0;
				rootEntity.MatchRefNo = rootPrjBoq ? rootPrjBoq.Reference : '';
				treeHandler(rootEntity,function(item){item.BoqHeaderFk = newBoqHeaderFk;});

				let newTree = _.filter(list, function (item) {
					return boqMainCommonService.isRoot(item);
				});
				flatWicBoqs = [];
				_.forEach(newTree, function(wicBoq){
					cloudCommonGridService.flatten([wicBoq], flatWicBoqs, 'BoqItems');
					if(wicBoq.BoqHeaderFk === rootEntity.BoqHeaderFk){
						handleWicBoqsBeforeAddToView(wicBoq);
					}
				});
				service.checkRepeatedForNoMatched(rootEntity, structureService);

				service.gridRefresh();
			}

			service.reGenerateMatchBoqsRefNoByNo = function (entity) {
				if(!flatProjBoqs) {
					return;
				}

				if(boqMainCommonService.isRoot(entity)){
					onEntityChanged(entity);
					return;
				}

				let wicRootBoq = service.getCurrentRootItem(entity),
					relatePrjRootBoq = _.find(flatProjBoqs, function (item) {
						if(item.Reference === wicRootBoq.Reference && boqMainCommonService.isRoot(item)){
							return item;
						}
					});

				if(!relatePrjRootBoq){ return;}

				setMatchReference(wicRootBoq, _.filter(flatProjBoqs, {BoqHeaderFk: relatePrjRootBoq.BoqHeaderFk}));
			};

			service.checkRepeatedForNoMatched = function (entity, structureService) {

				let relatePrjRootBoq = _.find(flatProjBoqs, function (item) {
					if(item.BoqHeaderFk === entity.BoqHeaderFk && boqMainCommonService.isRoot(item)){
						return item;
					}
				});

				if(!relatePrjRootBoq){
					// clear error info
					treeHandler(entity, function (item) {
						platformRuntimeDataService.applyValidationResult(true, item, 'Reference');
					});

					return;
				}

				let matchFlatProjBoqs = _.filter(flatProjBoqs, {BoqHeaderFk: relatePrjRootBoq.BoqHeaderFk});
				let isMatch = _.filter(matchFlatProjBoqs, {Reference: entity.Reference}).length > 0;
				if(isMatch && !entity.MatchRefNo && !boqMainCommonService.isRoot(entity) && !boqMainCommonService.isDivision(entity)){
					let result = {
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'boq.main.referenceInUse',
						error$tr$param: {}
					}; // The new reference i
					platformRuntimeDataService.applyValidationResult(result, entity, 'Reference');
				}

				if (boqMainCommonService.isDivision(entity) || boqMainCommonService.isRoot(entity)){
					let isFreeBoq = structureService.isFreeBoq();
					treeHandler(entity, function (item) {
						if(_.filter(matchFlatProjBoqs, {Reference: item.Reference}).length > 0) {
							if(!item.MatchRefNo && !boqMainCommonService.isRoot(item)){
								if(isFreeBoq || (!isFreeBoq && !boqMainCommonService.isRoot(item) && !boqMainCommonService.isDivision(item))){
									addReferenceNoIndex(item, matchFlatProjBoqs, true);
									addReferenceNo2Index(item, matchFlatProjBoqs);
									platformRuntimeDataService.applyValidationResult(true, item, 'Reference');
								}
							}
						}
					});
				}
			};

			service.expandBoqTree = function(){
				$injector.get('platformGridAPI').rows.expandAllNodes(service.gridId);
			};

			service.resetMatchRefNoByCompareCondition = function(filterConfigData){
				filterData.ConfigData = angular.copy(filterConfigData);

				if(!flatProjBoqs) {
					return;
				}

				let wicRootBoqs = service.getList();
				if(!wicRootBoqs){
					return;
				}

				wicRootBoqs = _.filter(wicRootBoqs, function (item) {
					return item.TargetBoqHeaderId > 0;
				});
				if(!wicRootBoqs){
					return;
				}

				_.forEach(wicRootBoqs, function(wicRootBoq){
					let relatePrjRootBoq = _.find(flatProjBoqs, function (item) {
						if(item.Reference === wicRootBoq.Reference && boqMainCommonService.isRoot(item)){
							return item;
						}
					});
					if(relatePrjRootBoq){
						setMatchReference(wicRootBoq, _.filter(flatProjBoqs, {BoqHeaderFk: relatePrjRootBoq.BoqHeaderFk}));
						service.checkRepeatedForNoMatched(wicRootBoq, $injector.get('generateWipBoqStructureService'));
					}
				});
			};

			function getRefNoFullPath(boq, forWic){
				let fullPath = boq.Reference;
				let parent = getParentBoq(boq, forWic);
				while (parent){
					fullPath = (parent.Reference || '') + '/' + fullPath;
					parent = getParentBoq(parent, forWic);
				}

				return fullPath;
			}

			function getRefNo2FullPath(boq, forWic){
				let fullPath = boq.Reference2 || boq.Reference;
				let parent = getParentBoq(boq, forWic);
				while (parent){
					if(!boqMainCommonService.isRoot(parent)){
						fullPath = (parent.Reference2 && parent.Reference2 !== '' ? parent.Reference2 : parent.Reference) + '/' + fullPath;
					}
					parent = getParentBoq(parent, forWic);
				}

				return fullPath;
			}

			function checkSameRefNoInDifferentLevel(wicBoqRoot, prjBoqs) {
				let relatePrjRootBoq = _.find(prjBoqs, function (item) {
					if(item.Reference === wicBoqRoot.Reference && boqMainCommonService.isRoot(item)){
						return item;
					}
				});

				if(!relatePrjRootBoq){ return;}

				let wicChilds = wicBoqRoot.BoqItems,
					temp = [];

				let flatPrjBoq =prjBoqs,
					flatWicBoq = [];
				cloudCommonGridService.flatten(wicBoqRoot.BoqItems || [], flatWicBoq, 'BoqItems');

				while(wicChilds && wicChilds.length > 0){
					temp = [];
					_.forEach(wicChilds, function(item) {
						_.forEach(flatWicBoq, function (chilDItem) {
							if(item.Reference === chilDItem.Reference && item.Id > chilDItem.Id){
								addReferenceNoIndex(item, flatWicBoq);
							}
						});

						if(!item.MatchRefNo || item.MatchRefNo === ''){
							_.forEach(flatPrjBoq, function (chilDItem) {
								if(item.Reference === chilDItem.Reference && (item.LevelCount !== chilDItem.LevelCount || item.BoqLineTypeFk !== chilDItem.BoqLineTypeFk) && !boqMainCommonService.isDivision(item)){
									addReferenceNoIndex(item, flatWicBoq);
								}
							});
						}

						if(item.BoqItems && item.BoqItems.length >0){
							_.forEach(item.BoqItems, function (boqItem) {
								temp.push(boqItem);
							});
						}
					});
					wicChilds = temp;
				}
			}

			function addReferenceNoIndex(wicBoq, flatPrjBoq, ignoreType){
				let refNo = '',
					i = 1,
					step = 1;
				if(filterData.ConfigData && filterData.ConfigData.GenerateRefNo){
					i = filterData.ConfigData.RefNoStartValue;
					step = filterData.ConfigData.RefNoIncrementValue;
				}
				refNo = wicBoq.Reference + i;
				let matchBoq = existBoq(wicBoq, refNo);

				while (matchBoq){
					i = i+ step;
					refNo = wicBoq.Reference + i;
					matchBoq = existBoq(wicBoq, refNo);
				}

				function existBoq(wicBoq, refNo){
					let matchBoq = _.find(flatPrjBoq, function (chilDItem) {
						if(refNo === chilDItem.Reference && (wicBoq.LevelCount !== chilDItem.LevelCount || wicBoq.BoqLineTypeFk !== chilDItem.BoqLineTypeFk || ignoreType)){
							return chilDItem;
						}
					});
					if(!matchBoq){
						let parent = getParentBoq(wicBoq, true);
						matchBoq = _.find(parent.BoqItems, function (chilDItem) {
							if(refNo === chilDItem.Reference){
								return chilDItem;
							}
						});
					}
					return matchBoq;
				}

				wicBoq.Reference += i;
			}

			function addReferenceNo2Index(wicBoq, flatPrjBoq) {
				if(!wicBoq.Reference2){
					return;
				}

				let ref2,
					i = 1,
					step = 1,
					len = 3;
				if(filterData.ConfigData && filterData.ConfigData.GenerateRefNo2){
					i = filterData.ConfigData.RefNo2StartValue;
					step = filterData.ConfigData.RefNo2IncrementValue;
					len = filterData.ConfigData.WicRefNo2Length;
				}
				let ref2Left = wicBoq.Reference2.length > len ? wicBoq.Reference2.substr(0,wicBoq.Reference2.length - len) : '';
				let index = wicBoq.Reference2.length > len ? wicBoq.Reference2.substr(wicBoq.Reference2.length - len, len) : wicBoq.Reference2;

				ref2 = ref2Left + padLeft(parseInt(index) + step, len);

				let matchBoq = existBoq(wicBoq, ref2);

				while (matchBoq){
					i = i+ step;
					ref2 = ref2Left + padLeft(parseInt(index) + i, len);
					matchBoq = existBoq(wicBoq, ref2);
				}

				function existBoq(wicBoq, refNo){
					let matchBoq = _.find(flatPrjBoq, function (chilDItem) {
						if(refNo === chilDItem.Reference2){
							return chilDItem;
						}
					});
					if(!matchBoq){
						let parent = getParentBoq(wicBoq, true);
						matchBoq = _.find(parent.BoqItems, function (chilDItem) {
							if(refNo === chilDItem.Reference2){
								return chilDItem;
							}
						});
					}
					return matchBoq;
				}

				function padLeft(num, n) {
					let len = num.toString().length;
					while (len < n) {
						num = '0' + num;
						len++;
					}
					return num;
				}

				wicBoq.Reference2 = ref2Left + padLeft(parseInt(index) + i, len);
			}

			let scope = {};

			service.setScope = function ($scope) {
				scope = $scope;
			};

			service.setLoadingState = function(state){
				scope.isLoading = state;
			};

			service.deleteEntities = function deleteRootItems(entities) {
				// platformModalService.showYesNoDialog('qto.main.sheetDelete', 'qto.main.sheetDeleteTitle').then(function (response) {
				//     if (response.yes) {
				//     }
				// });

				entities = entities || service.getSelectedEntities();
				if(!entities){
					return;
				}
				let  data = container.data;
				// if (platformRuntimeDataService.isBeingDeleted(entities)) {
				//     return $q.when(true);
				// }

				let deleteParams = {},
					flatEntities = [];
				_.forEach(entities, function(entity){
					cloudCommonGridService.flatten(entity.BoqItems || [], flatEntities, 'BoqItems');
					flatEntities.push(entity);
				});

				// platformRuntimeDataService.markListAsBeingDeleted(flatEntities);
				deleteParams.entities = flatEntities;
				deleteParams.service = service;
				_.forEach(flatEntities, function (item) {
					item.index = data.itemList.indexOf(item);
				});
				platformDataValidationService.removeDeletedEntityFromErrorList(entities, service);
				data.doPrepareDelete(deleteParams, data);

				data.onDeleteDone(deleteParams, data, null);
				_.forEach(flatEntities, function (entity) {
					let i = flatWicBoqs.indexOf(entity);
					if(i>-1){
						flatWicBoqs.splice(i,1);
					}
				});
			};

			service.setCreationData = function setCreationData(data){
				myCreationData = data;
			};

			function getParentBoq(selectedItem, forWic){
				if(!selectedItem){return null;}

				if(forWic){
					return _.find(flatWicBoqs, {Id: selectedItem.BoqItemFk, BoqHeaderFk: selectedItem.BoqHeaderFk});
				}

				return _.find(flatProjBoqs, {Id: selectedItem.BoqItemFk, BoqHeaderFk: selectedItem.BoqHeaderFk});
			}


			// mergeOption (1: merge item if its Ref No. is same, 2 add all items as news
			service.moveSeletedItemTo = function moveSelectedItemTo(targetItem, mergeOption) {
				let boqStructureService = $injector.get('generateWipBoqStructureService');
				let sourceItem = service.getSelected();
				let isFreeStructure = false;
				if(!sourceItem || !targetItem){
					return;
				}
				sourceItem.MatchRefNo = '';

				if(targetItem.BoqHeaderFk === sourceItem.BoqHeaderFk && targetItem.Id === sourceItem.BoqItemFk){
					return;
				}
				if(boqMainCommonService.isRoot(sourceItem) && !boqMainCommonService.isRoot(targetItem)){
					return;
				}
				if(!boqMainCommonService.isRoot(targetItem) && !boqMainCommonService.isDivision(targetItem)){
					return;
				}

				$injector.get('estimateMainGeneratePrjboqStructureService').getBoqStructure(targetItem.BoqHeaderFk).then(function (boqHeader) {
					boqStructureService.setSelectedHeaderFkByHeader(boqHeader);

					// if boqHeader is empty, its mean the Boq Tree isn't from wic, it is generated by leading structure template
					isFreeStructure = boqHeader && boqHeader !== '' && boqHeader.Id ? boqStructureService.isFreeBoq() : true;

					let parent = getParentBoq(sourceItem, true);
					let list = service.getList();
					if(parent){
						parent.BoqItems.splice(parent.BoqItems.indexOf(sourceItem),1);
					}else{
						list.splice(list.indexOf(sourceItem),1);
					}

					if(!boqMainCommonService.isRoot(sourceItem) && !boqMainCommonService.isDivision(sourceItem)){
						targetItem.BoqItems = targetItem.BoqItems || [];
						sourceItem.Reference = !isFreeStructure ? '0' : (sourceItem.OriginalRefNo || sourceItem.Reference);
						sourceItem.BoqHeaderFk = targetItem.BoqHeaderFk;
						sourceItem.BoqItemFk = targetItem.Id;
						targetItem.BoqItems.push(sourceItem);
						platformRuntimeDataService.applyValidationResult(true, sourceItem, 'Reference');
					}else if(boqMainCommonService.isRoot(sourceItem)){ // if source is root, then target must be root
						mergeTwoWicTree(sourceItem, targetItem);
					}else if(sourceItem.nodeInfo.level > targetItem.nodeInfo.level || boqMainCommonService.isRoot(targetItem)){
						let sameSibling = _.find(targetItem.BoqItems, {Reference: sourceItem.Reference});
						if(sameSibling && mergeOption === 1){
							mergeTwoWicTree(sourceItem, sameSibling);
						}else{
							targetItem.BoqItems.push(sourceItem);
							sourceItem.BoqItemFk = targetItem.Id;
							treeHandler(sourceItem, function (item) {
								item.Reference = !isFreeStructure ? '0' : (item.OriginalRefNo || item.Reference);
								item.MatchRefNo = '';
								item.BoqHeaderFk = targetItem.BoqHeaderFk;
								platformRuntimeDataService.applyValidationResult(true, item, 'Reference');
							});
						}
					}else{
						mergeTwoWicTree(sourceItem, targetItem);
					}

					if(!isFreeStructure){
						reFormatWicStructure(service.getCurrentRootItem(targetItem), boqHeader.BoqStructureEntity, true);
					}

					let data = container.data;
					let newTree = _.filter(list, function (item) {
						return boqMainCommonService.isRoot(item);
					});
					flatWicBoqs = [];
					_.forEach(newTree, function(wicBoq){
						cloudCommonGridService.flatten([wicBoq], flatWicBoqs, 'BoqItems');
						if(wicBoq.BoqHeaderFk === targetItem.BoqHeaderFk){
							treeHandler(wicBoq, function (item) {
								let p = getParentBoq(item, true);
								if(p){
									item.nodeInfo.level = p.nodeInfo.level + 1;
								}

							});
							handleWicBoqsBeforeAddToView(wicBoq);
						}
					});
					service.checkRepeatedForNoMatched(targetItem, boqStructureService);

					data.handleReadSucceeded(newTree, data);

					service.setSelected(targetItem);

				});

				function mergeTwoWicTree(sourceItem, targetItem) {
					if(!sourceItem || !sourceItem.BoqItems || sourceItem.BoqItems.length===0){
						return;
					}

					_.forEach(sourceItem.BoqItems, function (item) {
						targetItem.BoqItems = targetItem.BoqItems || [];
						let sameSibling = _.find(targetItem.BoqItems, {Reference: item.Reference});
						if(sameSibling && isSameType(item, sameSibling) && mergeOption === 1){
							mergeTwoWicTree(item, sameSibling);
						}
						else{
							item.BoqItemFk = targetItem.Id;
							targetItem.BoqItems.push(item);
							treeHandler(item, function (i) {
								i.Reference = !isFreeStructure ? '0' : (i.OriginalRefNo || i.Reference);
								i.MatchRefNo = '';
								i.BoqHeaderFk = targetItem.BoqHeaderFk;
								platformRuntimeDataService.applyValidationResult(true, i, 'Reference');
							});
						}
					});
				}
			};

			function reFormatWicStructure(rootBoqItem, boqStructure, resetRefNo) {
				let boqStructureService = $injector.get('generateWipBoqStructureService');
				let flatlist = [],
					maxDivisionLevle = boqStructure.BoqStructureDetailEntities.length - 2;
				cloudCommonGridService.flatten([rootBoqItem], flatlist, 'BoqItems');

				flatlist = _.filter(flatlist, {Reference: '0'});
				if(flatlist.length === 0) {return;}

				let ignoreList = [];
				_.forEach(flatlist, function (boqItem) {
					let inIgnorelist = _.find(ignoreList, {BoqHeaderFk: rootBoqItem.BoqHeaderFk, Id: boqItem.Id});
					if(!inIgnorelist){
						let parent = getParentBoq(boqItem, true);
						if(boqMainCommonService.isDivision(boqItem)){
							parent.BoqItems.splice(parent.BoqItems.indexOf(boqItem),1);
							if(parent.nodeInfo.level === maxDivisionLevle){
								boqItem.BoqItems = boqItem.BoqItems || [];
								_.forEach(boqItem.BoqItems, function (item) {
									item.BoqItemFk = parent.Id;
									parent.BoqItems.push(item);
								});
								boqItem.BoqItems = [];

							}else{
								let otherZeroRefBoqs = _.filter(parent.BoqItems, function (i) {
									return i.Reference === '0' && i.Id !== boqItem.Id;
								}) || [];
								_.forEach(otherZeroRefBoqs, function (i) {
									parent.BoqItems.splice(parent.BoqItems.indexOf(i),1);
								});

								boqItem.BoqLineTypeFk = parent.nodeInfo.level + 1;
								boqItem.nodeInfo.level = parent.nodeInfo.level + 1;
								boqItem.Reference = resetRefNo ? boqStructureService.getNewDivisionReference(parent) : boqItem.Reference;
								parent.BoqItems.push(boqItem);
								_.forEach(otherZeroRefBoqs, function (i) {
									parent.BoqItems.push(i);
								});
							}
						}else{
							let allSiblingItem = _.filter(parent.BoqItems, function (i) {
								return !boqMainCommonService.isRoot(i) && !boqMainCommonService.isDivision(i) && i.Reference === '0';
							});
							_.forEach(allSiblingItem, function (moveNode) {
								parent.BoqItems.splice(parent.BoqItems.indexOf(moveNode),1);
							});
							let newParent = parent;
							if(parent.nodeInfo.level < maxDivisionLevle){
								newParent = createNewDivision(parent, resetRefNo);
								while(newParent.nodeInfo.level < maxDivisionLevle){
									newParent = createNewDivision(newParent, resetRefNo);
								}
							}
							_.forEach(allSiblingItem, function (moveNode) {
								ignoreList.push(moveNode);
								newParent.BoqItems = newParent.BoqItems || [];
								moveNode.BoqItemFk = newParent.Id;
								let newRef = resetRefNo ? boqStructureService.getNewItemReference(newParent) : boqItem.Reference;
								newParent.BoqItems.push(moveNode);
								// moveNode.BoqLineTypeFk = boqMainLineTypes.position;
								moveNode.nodeInfo.level = newParent.nodeInfo.level + 1;
								moveNode.Reference = newRef;
							});
						}
					}
				});

				function createNewDivision(parent, resetRefNo) {
					let newDivision = {};
					newDivision = _.merge(newDivision, divisionTemplate);
					divisionTemplate.Id--;
					newDivision.BoqLineTypeFk = parent.nodeInfo.level + 1;
					newDivision.HasChildren = true;
					newDivision.nodeInfo = {
						level: parent.nodeInfo.level + 1,
						collapsed: false,
						lastElement: false,
						children: true
					};

					newDivision.BoqItemFk = parent.Id;
					newDivision.OriginalBoqHeaderId = parent.OriginalBoqHeaderId;
					newDivision.BoqHeaderFk = parent.BoqHeaderFk;
					newDivision.Reference = resetRefNo ? boqStructureService.getNewDivisionReference(parent) : '0';
					parent.BoqItems = parent.BoqItems || [];
					parent.BoqItems.push(newDivision);
					parent.HasChildren = true;

					return newDivision;
				}
			}

			function isSameType(sourceItem, targetItem) {
				if(boqMainCommonService.isDivision(sourceItem) && boqMainCommonService.isDivision(targetItem)){
					return true;
				}

				return !!(boqMainCommonService.isItem(sourceItem) && boqMainCommonService.isItem(targetItem));
			}

			function treeHandler(rootNode, handleFun) {
				if(!rootNode){return;}

				handleFun(rootNode);
				rootNode.BoqItems = rootNode.BoqItems || [];

				_.forEach(rootNode.BoqItems, function (item) {
					treeHandler(item, handleFun);
				});

			}

			let isOpening = false;

			service.setIsOpening = function (val){
				isOpening = val;
			};

			service.getIsOpening = function (){
				return isOpening;
			};

			return service;
		}]);
})();
