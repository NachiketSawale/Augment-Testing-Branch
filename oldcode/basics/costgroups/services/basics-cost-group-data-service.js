/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/* global angular, globals, _ */
	'use strict';
	var myModule = angular.module('basics.costgroups');

	/**
	 * @ngdoc service
	 * @name basicsCostGroupDataService
	 * @description pprovides methods to access, create and update basics costGroup entities
	 */
	myModule.service('basicsCostGroupDataService', BasicsCostGroupDataService);

	BasicsCostGroupDataService.$inject = ['$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'basicsCostGroupsConstantValues', 'basicsCostGroupCatalogDataService','cloudCommonGridService','platformRuntimeDataService'];

	function BasicsCostGroupDataService($http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                         basicsCommonMandatoryProcessor, basicsCostGroupsConstantValues, basicsCostGroupCatalogDataService,cloudCommonGridService,platformRuntimeDataService) {
		var self = this;
		let serviceContainer = {};
		var basicsCostGroupServiceOption = {
			hierarchicalLeafItem: {
				module: myModule,
				serviceName: 'basicsCostGroupDataService',
				entityNameTranslationID: 'basics.costgroups.costGroup',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/CostGroups/costgroup/',
					endRead: 'tree',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsCostGroupCatalogDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'hierarchical'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					basicsCostGroupsConstantValues.schemes.costGroup)],
				presenter: {
					tree: {
						parentProp: 'CostGroupFk', childProp: 'ChildItems',
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = basicsCostGroupCatalogDataService.getSelected().Id;
							var parentId = creationData.parentId;
							delete creationData.MainItemId;
							delete creationData.parentId;
							if (!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
								creationData.PKey2 = parentId;
							}
						},
						incorporateDataRead: function (readData, data) {
							var output=[];
							cloudCommonGridService.flatten(readData, output, 'ChildItems');
							_.each(output, function (item) {
								var readonlyFields = [];
								readonlyFields.push({field: 'Quantity', readonly: item.LeadQuantityCalc || item.LeadQuantityCalc});
								platformRuntimeDataService.readonly(item,readonlyFields);
							});
							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CostGroups', parentService: basicsCostGroupCatalogDataService}
				},
				translation: {
					uid: 'basicsCostGroupDataService',
					title: 'basics.costgroups.listCostGroupTitle',
					columns: [{
						header: 'cloud.common.entityDescription',
						field: 'DescriptionInfo'
					}],
					dtoScheme: basicsCostGroupsConstantValues.schemes.costGroup
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(basicsCostGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'basicsCostGroupValidationService'
		}, basicsCostGroupsConstantValues.schemes.costGroup));

		serviceContainer.service.createDeepCopy = function createDeepCopy() {
			$http.post(globals.webApiBaseUrl + 'basics/CostGroups/costgroup/deepcopy', serviceContainer.service.getSelected())
				.then(function (response) {
					var copy = response.data;
					var creationData = {parent: null};
					if (copy.CostGroupFk) {
						creationData.parent = serviceContainer.data.getItemById(copy.CostGroupFk, serviceContainer.data);
					}
					serviceContainer.data.onCreateSucceeded(copy, serviceContainer.data, creationData);
				},
				function (/* error */) {
				});
		};

		serviceContainer.service.getStyleOptions = function getStyleOptions(){
			var costGroupCatalogs = basicsCostGroupCatalogDataService.getList();
			var styleOptions = [];
			_.each(costGroupCatalogs, function(costGroupCatalog){
				styleOptions.push({id: costGroupCatalog.Id, value: costGroupCatalog.Code});
			});

			return styleOptions;
		};


		serviceContainer.service.deleteEntities = function deleteEntities(entities) {
			var output =[];
			cloudCommonGridService.flatten(entities, output, 'ChildItems');
			_.forEach(output,function(item){
				item.ChildItems = null;
			});
			return serviceContainer.data.deleteEntities(output, serviceContainer.data);
		};

		function getLeadQuantityCalcParentLevel(parentLevel){
			if(parentLevel.HasChildren && parentLevel.LeadQuantityCalc && !parentLevel.NoLeadQuantity){
				return parentLevel;
			}else if(parentLevel.HasChildren && parentLevel.ChildItems && parentLevel.ChildItems.length){
				return getLeadQuantityCalcParentLevel(parentLevel.ChildItems[0]);
			}
		}

		serviceContainer.service.calculateQuantity = function calculateQuantity(entity,field) {

			var costGroupList = serviceContainer.service.getList();
			var parentCostGroup = _.find(costGroupList, {'Id': entity.CostGroupFk});

			parentCostGroup = parentCostGroup ? parentCostGroup: entity;

			var parentLevel = getLeadQuantityCalcParentLevel(costGroupList[0]);

			if(field === 'NoLeadQuantity'){

				calculateNoLeadQuantity(entity, entity.HasChildren,entity.Quantity,entity.UomFk);

				platformRuntimeDataService.readonly(parentCostGroup, [{field: 'Quantity', readonly: entity.NoLeadQuantity || entity.LeadQuantityCalc}]);
				platformRuntimeDataService.readonly(entity, [{field: 'Quantity', readonly: entity.NoLeadQuantity|| entity.LeadQuantityCalc}]);

			}else{
				var items =[];
				cloudCommonGridService.flatten([entity], items, 'ChildItems');
				items =_.reverse(items);

				_.forEach(items, function (d) {
					if(field === 'LeadQuantityCalc'){
						d.LeadQuantityCalc = entity.LeadQuantityCalc;

						platformRuntimeDataService.readonly(parentLevel, [{field: 'Quantity', readonly: d.NoLeadQuantity|| d.LeadQuantityCalc}]);
						platformRuntimeDataService.readonly(d, [{field: 'Quantity', readonly: d.NoLeadQuantity|| d.LeadQuantityCalc}]);
					}
				});
				serviceContainer.service.markEntitiesAsModified(items);


				items = _.filter(items,function (d) {
					return d.HasChildren;
				});
				if(items.length) {
					_.forEach(items, function (d) {
						calculateLeadQuantityCalcQuantity(d, d.HasChildren, d.Quantity, d.UomFk, field);
					});
				}else{
					calculateLeadQuantityCalcQuantity(entity, entity.HasChildren,entity.Quantity,entity.UomFk,field);
					serviceContainer.service.markItemAsModified(entity);
				}
			}
			serviceContainer.service.gridRefresh();
		};


		function getNoLeadQtyParent(entity) {
			if(entity && entity.HasChildren && entity.NoLeadQuantity){
				return entity;
			}else {
				if (entity && entity.CostGroupFk) {
					var list = serviceContainer.service.getList();
					var parent = _.find(list, {'Id': entity.CostGroupFk});
					if (parent && parent.NoLeadQuantity) {
						return parent;
					} else {
						return getNoLeadQtyParent(parent);
					}
				} else {
					return null;
				}
			}
		}

		function calculateLeadQuantityCalcQuantity(entity, isParent,qty,uomFk,field) {
			// If child is checked
			var parent ={};
			var gparent ={};
			if (entity && entity.HasChildren){
				if (!entity.LeadQuantityCalc){
					// Parent
					parent = entity;
					parent.Quantity = !parent.NoLeadQuantity && parent.LeadQuantityCalc ? parent.Quantity:0;

					gparent = getEntityParent(parent);
					if (gparent){
						if (gparent.HasChildren){
							if(gparent.ChildItems.length === 1){
								gparent.Quantity = 0;
								updateParentQty(gparent);
							}else {

								var clist = [];
								var clist2 =[];
								cloudCommonGridService.flatten([gparent], clist, 'ChildItems');

								clist = _.filter(clist, function (d) {
									return d.Id !== gparent.Id;
								});

								clist = _.filter(clist, function (c) {
									var invalidChild = getNoLeadQtyParent(c);

									if(invalidChild && invalidChild.ChildItems){
										if(invalidChild.Id !== parent.Id ) {
											clist2 = [];
											cloudCommonGridService.flatten([invalidChild], clist2, 'ChildItems');
											clist2 = _.filter(clist2, function (d) {
												return d.HasChildren;
											});

											var cids = _.map(clist2, 'Id');
											if (cids.indexOf(parent.Id) >= 0) {
												invalidChild = null;
											}
										}else{
											invalidChild = null;
										}
									}

									return !c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && c.UomFk === gparent.UomFk && !invalidChild;
								});

								gparent.Quantity = gparent.LeadQuantityCalc ?  _.sum(_.map(clist, 'Quantity')):gparent.Quantity;
								calculateLeadQuantityCalcQuantity(gparent,gparent.HasChildren,qty,uomFk,field);
							}

						}else{
							gparent.Quantity =  parent.Quantity;
						}
						serviceContainer.service.markItemAsModified(gparent);
					}

				}else{
					// A7202
					parent = entity;
					// var childItems = entity.ChildItems;

					if (isParent){
						let  clist = [];
						let  clist2 = [];
						cloudCommonGridService.flatten([entity], clist, 'ChildItems');
						clist = _.filter(clist,function (c) {
							var invalidChild = getNoLeadQtyParent(c);
							if(invalidChild && invalidChild.ChildItems) {
								if (invalidChild.Id !== parent.Id) {
									clist2 = [];
									cloudCommonGridService.flatten([invalidChild], clist2, 'ChildItems');
									clist2 = _.filter(clist2, function (d) {
										return d.HasChildren;
									});

									var cids = _.map(clist2, 'Id');
									if (cids.indexOf(parent.Id) >= 0) {
										invalidChild = null;
									}
								}else{
									invalidChild = null;
								}
							}
							return  !c.HasChildren &&   c.LeadQuantityCalc && !c.NoLeadQuantity &&  c.UomFk === entity.UomFk && !invalidChild;
						});

						// parent.Quantity = !parent.NoLeadQuantity ?( parent.LeadQuantityCalc   ? _.sum(_.map(clist,'Quantity')):parent.Quantity ):0;

						parent.Quantity =  parent.LeadQuantityCalc   ? _.sum(_.map(clist,'Quantity')):parent.Quantity;

						serviceContainer.service.markItemAsModified(parent);
					}
					gparent = getEntityParent(parent);
					if (gparent){
						if (gparent.HasChildren){

							let  clist = [];
							let  clist2 =[];
							cloudCommonGridService.flatten([gparent], clist, 'ChildItems');
							clist = _.filter(clist,function (c) {
								var invalidChild = getNoLeadQtyParent(c);
								if(invalidChild && invalidChild.ChildItems) {
									if (invalidChild.Id !== parent.Id) {
										clist2 = [];
										cloudCommonGridService.flatten([invalidChild], clist2, 'ChildItems');

										clist2 = _.filter(clist2, function (d) {
											return d.HasChildren;
										});

										var cids = _.map(clist2, 'Id');
										if (cids.indexOf(parent.Id) >= 0) {
											invalidChild = null;
										}
									}else{
										invalidChild = null;
									}
								}
								return  !c.HasChildren &&  c.LeadQuantityCalc && !c.NoLeadQuantity &&  c.UomFk === gparent.UomFk && !invalidChild;
							});

							gparent.Quantity = gparent.LeadQuantityCalc ? _.sum(_.map(clist,'Quantity')):gparent.Quantity;
							calculateLeadQuantityCalcQuantity(gparent,gparent.HasChildren,qty,uomFk,field);

						}else{
							gparent.Quantity = parent.Quantity;
						}
						serviceContainer.service.markItemAsModified(gparent);
					}
				}
			}
			else{
				// Child
				if (entity && !entity.LeadQuantityCalc){
					parent = getEntityParent(entity);

					if(field === 'UomFk'){

						if(parent && parent.LeadQuantityCalc  && parent.UomFk === entity.UomFk  && !entity.NoLeadQuantity  && entity.LeadQuantityCalc){
							parent.Quantity  -= entity.Quantity;
							serviceContainer.service.markItemAsModified(parent);
						}

					}else if(parent && parent.LeadQuantityCalc && parent.UomFk === entity.UomFk) {

						if(!entity.NoLeadQuantity ){
							parent.Quantity -= entity.Quantity;
							serviceContainer.service.markItemAsModified(parent);
						}
					}
					calculateLeadQuantityCalcQuantity(parent,false,0,entity.UomFk,field);
				}else{
					parent = getEntityParent(entity);
					if(parent && parent.LeadQuantityCalc && !entity.NoLeadQuantity  && entity.LeadQuantityCalc) {
						if(parent.UomFk === entity.UomFk){
							parent.Quantity  += entity.Quantity;
							serviceContainer.service.markItemAsModified(parent);
						}else{
							if(field === 'UomFk'){
								parent.Quantity  -= entity.Quantity;
								serviceContainer.service.markItemAsModified(parent);
							}
						}
					}
					if(entity) {
						calculateLeadQuantityCalcQuantity (parent, false, entity.Quantity, entity.UomFk, field);
					}
				}
			}
		}


		function calculateNoLeadQuantity(entity, isParent,qty,uomFk){
			// If child is checked
			var parent ={};
			var gparent ={};
			if (entity && entity.HasChildren){
				if (entity.NoLeadQuantity){
					// Parent
					parent = entity;
					// parent.Quantity = !parent.NoLeadQuantity ? parent.Quantity:0 ;

					gparent = getEntityParent(parent);
					if (gparent){
						if (gparent.HasChildren){
							if(gparent.ChildItems.length === 1){
								gparent.Quantity = 0;
								updateParentQty(gparent);
							}else {

								var clist = [];
								var clist2 =[];
								cloudCommonGridService.flatten([gparent], clist, 'ChildItems');

								clist = _.filter(clist, function (d) {
									return d.Id !== gparent.Id;
								});

								clist = _.filter(clist, function (c) {
									var invalidChild = getNoLeadQtyParent(c);
									if(invalidChild && invalidChild.ChildItems){
										if(invalidChild.Id !== parent.Id ) {
											clist2 = [];
											cloudCommonGridService.flatten([invalidChild], clist2, 'ChildItems');
											clist2 = _.filter(clist2, function (d) {
												return d.HasChildren;
											});

											var cids = _.map(clist2, 'Id');
											if (cids.indexOf(parent.Id) >= 0) {
												invalidChild = null;
											}
										}
									}

									return !c.HasChildren && c.LeadQuantityCalc && !c.NoLeadQuantity && c.UomFk === gparent.UomFk && !invalidChild;
								});

								gparent.Quantity = gparent.LeadQuantityCalc ?  _.sum(_.map(clist, 'Quantity')):gparent.Quantity;
								calculateNoLeadQuantity(gparent,false,qty,uomFk);
							}

						}else{
							gparent.Quantity =  parent.Quantity;
						}
						serviceContainer.service.markItemAsModified(gparent);
					}

				}else{
					// A7202
					parent = entity;
					// var childItems = entity.ChildItems;

					if (isParent){
						let  clist = [];
						let  clist2 = [];
						cloudCommonGridService.flatten([entity], clist, 'ChildItems');
						clist = _.filter(clist,function (c) {
							var invalidChild = getNoLeadQtyParent(c);
							if(invalidChild && invalidChild.ChildItems) {
								if (invalidChild.Id !== parent.Id) {
									clist2 = [];
									cloudCommonGridService.flatten([invalidChild], clist2, 'ChildItems');
									clist2 = _.filter(clist2, function (d) {
										return d.HasChildren;
									});

									var cids = _.map(clist2, 'Id');
									if (cids.indexOf(parent.Id) >= 0) {
										invalidChild = null;
									}
								}
							}
							return  !c.HasChildren &&   c.LeadQuantityCalc && !c.NoLeadQuantity &&  c.UomFk === entity.UomFk && !invalidChild;
						});

						parent.Quantity = !parent.NoLeadQuantity ?( parent.LeadQuantityCalc   ? _.sum(_.map(clist,'Quantity')):parent.Quantity ):0;
						serviceContainer.service.markItemAsModified(parent);
					}
					gparent = getEntityParent(parent);
					if (gparent){
						if (gparent.HasChildren){

							let  clist = [];
							let  clist2 =[];
							cloudCommonGridService.flatten([gparent], clist, 'ChildItems');
							clist = _.filter(clist,function (c) {
								var invalidChild = getNoLeadQtyParent(c);
								if(invalidChild && invalidChild.ChildItems) {
									if (invalidChild.Id !== parent.Id) {
										clist2 = [];
										cloudCommonGridService.flatten([invalidChild], clist2, 'ChildItems');

										clist2 = _.filter(clist2, function (d) {
											return d.HasChildren;
										});

										var cids = _.map(clist2, 'Id');
										if (cids.indexOf(parent.Id) >= 0) {
											invalidChild = null;
										}
									}
								}
								return  !c.HasChildren &&  c.LeadQuantityCalc && !c.NoLeadQuantity &&  c.UomFk === gparent.UomFk && !invalidChild;
							});

							gparent.Quantity =gparent.LeadQuantityCalc ? _.sum(_.map(clist,'Quantity')):gparent.Quantity;
							calculateNoLeadQuantity(gparent,false,qty,uomFk);

						}else{
							gparent.Quantity = parent.Quantity;
						}

						serviceContainer.service.markItemAsModified(gparent);
					}
				}
			}
			else{
				// Child
				if (entity && entity.NoLeadQuantity){
					parent = getEntityParent(entity);
					if(parent && parent.LeadQuantityCalc && entity.LeadQuantityCalc && parent.UomFk === entity.UomFk) {
						parent.Quantity -= entity.Quantity;
						serviceContainer.service.markItemAsModified(parent);
					}
					calculateNoLeadQuantity(parent,false,0,entity.UomFk);
				}else{
					parent = getEntityParent(entity);
					if(parent && parent.LeadQuantityCalc && entity.LeadQuantityCalc  && parent.UomFk === entity.UomFk) {
						parent.Quantity  += entity.Quantity;
						serviceContainer.service.markItemAsModified(parent);
					}

					if(entity) {
						calculateNoLeadQuantity (parent, false, entity.Quantity, entity.UomFk);
					}
				}
			}
		}

		function getEntityParent(entity){
			if (entity && entity.CostGroupFk){
				var list = serviceContainer.service.getList();
				return _.find(list,{'Id': entity.CostGroupFk});
			}
			return null;
		}

		function updateParentQty(entity) {
			if (entity && entity.CostGroupFk){
				var list = serviceContainer.service.getList();
				var parent = _.find(list,{'Id': entity.CostGroupFk});
				if(parent && parent.ChildItems.length ===1){
					parent.Quantity =0;
					if(parent.UomFk === entity.UomFk ){
						parent.Quantity = parent.ChildItems[0].Quantity;
					}

					updateParentQty(parent);
				}else{
					var clist = parent.ChildItems;

					clist = _.filter(clist, function (c) {
						return  c.LeadQuantityCalc && !c.NoLeadQuantity && c.UomFk === parent.UomFk && c.Id !== entity.Id;
					});

					parent.Quantity = !parent.NoLeadQuantity ? (parent.LeadQuantityCalc ?  _.sum(_.map(clist, 'Quantity')):parent.Quantity ):0;
					updateParentQty(parent);
				}
			}
		}

		return serviceContainer.service;
	}
})(angular);