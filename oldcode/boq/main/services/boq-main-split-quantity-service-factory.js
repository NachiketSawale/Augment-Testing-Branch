(function () {
	/* global globals, _, Platform */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainSplitQuantityServiceFactory', [
		'platformDataServiceFactory',
		'boqMainCommonService',
		'$injector',
		'$http',
		'platformDataServiceProcessDatesBySchemeExtension','platformRuntimeDataService',
		function (platformDataServiceFactory,
			boqMainCommonService,
			$injector,
			$http,
			platformDataServiceProcessDatesBySchemeExtension,platformRuntimeDataService) {

			var serviceCache = [];

			function getServiceName(serviceKey) {
				return 'boqMainSplitQuantityService_' + serviceKey;
			}

			function createNewComplete(parentService, serviceKey) {

				var serviceFactoryOptions = {
					flatNodeItem: {
						serviceName: getServiceName(serviceKey),
						entityRole: {
							node: {itemName: 'BoqSplitQuantity', parentService: parentService}
						},
						httpCRUD: {
							route: globals.webApiBaseUrl + 'boq/main/splitquantity/',
							endRead: 'getcompositelist',
							usePostForRead: true,
							initReadData: function (readData) {
								var selectItem = parentService.getSelected();
								if (selectItem) {
									readData.BoqHeaderFk = selectItem.BoqHeaderFk;
									readData.BoqItemFk = selectItem.Id;
								}

								/* for qto module */
								var callingContext = parentService.getCallingContext();
								if (callingContext && angular.isDefined(callingContext.QtoHeader) && (callingContext.QtoHeader !== null)) {
									readData.IsQtoBoq = true;
									readData.QtoHeaderId = callingContext.QtoHeader.Id;
								}
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selectItem = parentService.getSelected();
									if (selectItem) {
										creationData.BoqHeaderFk = selectItem.BoqHeaderFk;
										creationData.BoqItemFk = selectItem.Id;
									}
								},
								incorporateDataRead: function incorporateDataRead(readData, data) {
									var projectId = parentService.getSelectedProjectId();
									_.each(readData.dtos, function (item) {
										item.ProjectFk = projectId;
										if (parentService.getServiceName() === 'estimateMainBoqService') {
											platformRuntimeDataService.readonly(item, true);
										}					
									});

									$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
										basicsCostGroupAssignmentService.process(readData, parentService, {
											mainDataName: 'dtos',
											attachDataName: 'BoqSplitQuantity2CostGroups',
											dataLookupType: 'BoqSplitQuantity2CostGroups',
											identityGetter: function identityGetter(entity) {
												return {
													BoqHeaderFk: entity.RootItemId,
													BoqItemFk: entity.NodeItemId,
													Id: entity.MainItemId
												};
											}
										});
									}]);

									// For loading from server and from sub entity cache deliver different results,
									// we have to do the following mapping to get the proper data array of split quantities.
									var splitQuantities;
									if (_.isObject(readData) && readData.dtos) {
										splitQuantities = readData.dtos;
										
									} else {
										splitQuantities = readData;
									}

									// Loads 'OrdQuantity' values asynchronously
									if (['SalesWip','SalesBilling'].includes(parentService.getCallingContextType()) && _.some(splitQuantities) && !_.some(splitQuantities, 'OrdQuantity')) {
										$http.get(globals.webApiBaseUrl+'boq/main/splitquantity/contractquantities' + '?boqHeaderId='+splitQuantities[0].BoqHeaderFk + '&boqItemId='+splitQuantities[0].BoqItemFk).then(function(response) {
											for (let i=0; i<splitQuantities.length; i++) {
												if (response.data.length > i) {
													splitQuantities[i].OrdQuantity = response.data[i];
												}
											}
											data.handleReadSucceeded(splitQuantities, data);
										});
									}

									return data.handleReadSucceeded(splitQuantities, data);
								}
							}
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function() {
								if (parentService.getServiceName() === 'estimateMainBoqService') {
									return  false;
								}else return boqMainCommonService.isItem(parentService.getSelected()) && !parentService.isOenBoq() && !parentService.isCrbBoq();

							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName:'BoqSplitQuantityDto', moduleSubModule:'Boq.Main'})]
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
				var service = serviceContainer.service;
				var data = serviceContainer.data;

				// not use cache in qto module
				if (serviceKey === 'qto.main') {
					data.usesCache = false;
				}

				service.getBoqService = function () {
					return parentService;
				};

				var originalDeleteEntities = data.deleteEntities;
				data.deleteEntities = function deleteBoqSplitQuantities(entities, data) {
					if (angular.isArray(entities)) {
						if (entities.length > 0) {
							var param = {
								Ids: _.map(entities, 'Id')
							};
							var postData = {
								mainItemId: entities[0].Id,
								moduleIdentifer: 'boq.main.splitquantity',
								projectId: parentService.getSelectedProjectId() || 0,
								headerId: entities[0].BoqHeaderFk
							};
							return $http.post(globals.webApiBaseUrl + 'boq/main/splitquantity/CanDeleteBoqSplitQuantities', param).then(function (response) {
								if (!response.data) {
									var modalOptions = {
										headerTextKey: 'cloud.common.errorMessage',
										bodyTextKey: 'boq.main.allSplitAssignedMessage',
										iconClass: 'ico-error',
										width: '800px'
									};
									// platformModalService.showDialog(modalOptions);
									if (entities.length === 1) {
										modalOptions.mainItemId = postData.mainItemId;
										modalOptions.headerId = postData.headerId;
										modalOptions.moduleIdentifer = postData.moduleIdentifer;
										modalOptions.showNoButton = false;
										modalOptions.prjectId = postData.projectId;
										modalOptions.yesBtnText = 'OK';
										return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions);
									}

								} else {
									originalDeleteEntities(entities, data);
								}
							});
						}
					}
				};

				service.hasItems = function () {
					var list = service.getList();
					return list && list.length>0;
				};

				var onEntityCreated = function onEntityCreated(e, newItem) {   // jshint ignore:line
					newItem.ProjectFk = parentService.getSelectedProjectId();

					// When a new entiy has been created signal this to the currently selected parent entity
					var selectedBoqItem = parentService.getSelected();
					var list = service.getList();
					var splitQuantityCount = 0;
					if (selectedBoqItem) {
						splitQuantityCount = _.isArray(list) ? list.length : 0;
						selectedBoqItem.HasSplitQuantities = true;
						selectedBoqItem.HasMultipleSplitQuantities = splitQuantityCount > 1;
						if (splitQuantityCount === 1) {
							dispatchValues('Quantity', selectedBoqItem.Quantity);
							dispatchValues('QuantityAdj', selectedBoqItem.QuantityAdj);
						}

						parentService.updateReadonlyStatus(selectedBoqItem);
					}
				};
				service.registerEntityCreated(onEntityCreated);

				var onEntityDeleted = function onEntityDeleted() {

					// If the last split quantity has been removed signal this to the currently selected parent entity
					var splitQuantityCount = 0;
					var list = service.getList();
					if (list) {
						var selectedBoqItem = parentService.getSelected();
						if (selectedBoqItem) {
							splitQuantityCount = _.isArray(list) ? list.length : 0;
							selectedBoqItem.HasSplitQuantities = splitQuantityCount > 0;
							selectedBoqItem.HasMultipleSplitQuantities = splitQuantityCount > 1;
							parentService.updateReadonlyStatus(selectedBoqItem);
						}
					}
				};
				service.registerEntityDeleted(onEntityDeleted);

				var onEntityChanged = function () {
					var entity = service.getSelected();
					if (entity) {
						entity.ProjectFk = parentService.getSelectedProjectId();
					}
				};
				service.registerSelectionChanged(onEntityChanged);

				function dispatchValues(propertyName, newValue) {
					var list = service.getList();
					var len = list ? list.length : 0;
					var sum = 0;
					var fraction = null;
					var platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
					// calc total
					for (var i = 0; i < len; i++) {
						sum += list[i][propertyName];
					}
					// dispatch  percental
					for (var j = 0; j < len; j++) {
						var pc;
						if (isNaN(sum) || sum === 0) {
							pc = 100 / len;
						} else {
							pc = list[j][propertyName] * 100 / (isNaN(sum) ? 1 : sum);
						}

						if (['Price', 'PriceOc'].includes(propertyName) && newValue === null) {
							fraction = null;
						} else {
							fraction = pc * newValue / 100;
						}

						list[j][propertyName] = fraction;
						platformDataServiceDataProcessorExtension.doProcessItem(list[j], data);
					}

					service.markEntitiesAsModified(list);
					service.onListChanged.fire();
				}

				service.dispatchQuantity = function (newQuantity) {
					dispatchValues('Quantity', newQuantity);
				};

				service.dispatchQuantityAdj = function (newQuantityAdj) {
					dispatchValues('QuantityAdj', newQuantityAdj);
				};

				service.dispatchPrice = function (newPrice) {
					dispatchValues('Price', newPrice);
				};

				service.dispatchPriceOc = function (newPriceOc) {
					dispatchValues('PriceOc', newPriceOc);
				};

				function onBoqItemChanged(changedBoqItemPropName, changedBoqItemPropValue) {
					let splitQuantities = service.getList();
					const isNoAssignment = ['PrjLocationFk','PrcStructureFk','MdcControllingUnitFk','DeliveryDate'].includes(changedBoqItemPropName) &&
													_.every(splitQuantities, [changedBoqItemPropName,null])
													||
													_.startsWith(changedBoqItemPropName, 'costgroup_') &&
													_.every(splitQuantities, function(sq) { return sq[changedBoqItemPropName]===null || !Object.prototype.hasOwnProperty.call(sq,changedBoqItemPropName); });
					if (isNoAssignment) {
						_.forEach(splitQuantities, function(splitQuantity) {
							splitQuantity[changedBoqItemPropName] = changedBoqItemPropValue;
							service.markItemAsModified(                   splitQuantity);
							service.setSelected(                          splitQuantity);
							service.costGroupService.createCostGroup2Save(splitQuantity, { 'field':changedBoqItemPropName, 'costGroupCatId':changedBoqItemPropName.replace(/\D/g,'') }); // 'costgroup_1234' => 1234
						});
					}
				}
				if(parentService.boqItemEdited){
					parentService.boqItemEdited.register(onBoqItemChanged);
				}

				service.onListChanged = new Platform.Messenger();

				var _costGroupCatalogs = parentService.costGroupCatalogs;

				service.onCostGroupCatalogsChanged = new Platform.Messenger();

				function costGroupCatalogsLoaded(costGroupCatalogs) {
					_costGroupCatalogs = costGroupCatalogs;
					service.onCostGroupCatalogsChanged.fire();
				}

				parentService.onCostGroupCatalogsLoaded.register(costGroupCatalogsLoaded);   // use cost groups form BoQ!

				service.getCostGroupCatalogs = function () {
					return _costGroupCatalogs;
				};

				service.synBoqSplitQuantity = function (items) {
					_.each(data.itemList, function (item) {
						var mapItem = _.find(items, {Id: item.Id});
						if (mapItem) {
							item.Quantity = mapItem.Quantity;
							item.QuantityAdj = mapItem.QuantityAdj;
							item.Version = mapItem.Version;
						}
					});
					data.listLoaded.fire();
				};

				service.getCellEditable = function getCellEditable(item, field) {
					var selectedBoqItem = parentService.getSelected();
					var quantityFieldsReadOnly = _.isObject(selectedBoqItem) ? selectedBoqItem.RecordingLevel === 1 : true;

					if (_.includes(['Quantity', 'QuantityAdj'], field)) {
						return !quantityFieldsReadOnly;
					}

					return true;
				};

				return service;
			}

			return {

				getService: function (parentService, serviceKey) {

					var serviceName = getServiceName(serviceKey);
					if (!serviceCache[serviceName]) {
						serviceCache[serviceName] = createNewComplete(parentService, serviceKey);
					}
					return serviceCache[serviceName];
				}
			};

		}]);
})(angular);
