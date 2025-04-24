/**
 * Created by janas on 11.11.2014.
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name controllingStructureMainService
	 * @function
	 *
	 * @description
	 * controllingStructureMainService is the data service for all structure related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	controllingStructureModule.factory('controllingStructureMainService', ['globals', '$http', '$rootScope', 'cloudDesktopSidebarService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', '$injector', 'projectMainForCOStructureService', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'ServiceDataProcessDatesExtension', 'controllingStructureImageProcessor', 'controllingStructureReadonlyProcessor', 'basicsCommonMandatoryProcessor', 'controllingStructureGenerateService', '$timeout', '_', 'PlatformMessenger', 'platformPermissionService', 'permissions', 'platformRuntimeDataService',
		function (globals, $http, $rootScope, cloudDesktopSidebarService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService, $injector, projectMainForCOStructureService, platformDataServiceFactory, ServiceDataProcessArraysExtension, ServiceDataProcessDatesExtension, controllingStructureImageProcessor, controllingStructureReadonlyProcessor, basicsCommonMandatoryProcessor, controllingStructureGenerateService, $timeout, _, PlatformMessenger, platformPermissionService, permissions, platformRuntimeDataService) {

			var service = {};
			var serviceContainer = {};

			// The instance of the main service - to be filled with functionality below
			var controllingStructureServiceOption = {
				hierarchicalNodeItem: {
					module: controllingStructureModule,
					serviceName: 'controllingStructureMainService',
					entityNameTranslationID: 'controlling.structure.containerTitleControllingUnitsTable',
					httpCRUD: {route: globals.webApiBaseUrl + 'controlling/structure/'},
					presenter: {
						tree: {
							parentProp: 'ControllingunitFk',
							childProp: 'ControllingUnits',
							initCreationData: function initCreationData(creationData) {
								if (creationData.parent && creationData.parent.ControllingUnits && creationData.parent.ControllingUnits.length > 1000) { //   TODO: Suggested calculated
									creationData.parent.ControllingUnits = []; //   TODO: Check for solution onCreateSucceeded missing Children
								}
								creationData.ProjectId = projectMainForCOStructureService.getSelected().Id;
								creationData.ControllingUnitParentId = (creationData.parentId > 0) ? creationData.parentId : null;
								creationData.ControllingUnitParent = creationData.parent;
								creationData.ControllingUnitParent.ControllingUnitChildren = creationData.parent.ControllingUnits; // TODO: check with large amounts of data => payload limit

								// added logic to remove unnessesary data, in order to reduce the payload size.
								reducePayloadSize(creationData);
							},
							incorporateDataRead: function (readData, data) {
								var response = serviceContainer.data.handleReadSucceeded(readData, data);
								selectControllingStructure();
								return response;
							},
							handleCreateSucceeded:function (item) {
								let controllingList = service.getList();
								let parentItem = _.find(controllingList,{'Id':item.ControllingunitFk});
								if(parentItem){
									parentItem.ContrFormulaPropDefFk = null;
									platformRuntimeDataService.readonly(parentItem, [
										{field: 'ContrFormulaPropDefFk', readonly: true},
										{field: 'PlannedStart', readonly: true},
										{field: 'PlannedEnd', readonly: true}
									]);
								}

								// check code if generating correct (if not get the new code)
								item.Code = $injector.get('controllingStructureNumberGenerationServiceProvider').checkCode(item);
								item.isCreate = true;

								// check if code is unique
								if (item.ControllingunitFk !== null) {
									$injector.get('controllingStructureNumberGenerationServiceProvider').asyncCheckUniqueCode(item.Code, item.ProjectFk).then(function (response) {
										if (response.data !== '') {
											var isUnique = response.data;
											if (!isUnique) {
												// if found non unique code then generate new one
												item.Code = $injector.get('controllingStructureNumberGenerationServiceProvider').generateNewCode(item.Code, item.ProjectFk);
											}
											return item;
										}
									});
								}
							}
						}
					},
					actions: {
						delete: {}, create: 'hierarchical',
						canCreateCallBackFunc: function (/* item, data */) {
							// if no units available yet, user is allowed to create a controlling unit on root level
							// or if the selected unit is not the root element but child unit the user is also allowed
							var selected = service.getSelected();
							var canCreate = (_.size(service.getList()) === 0) || _.get(selected, 'ControllingunitFk') > 0;
							return true;
						},
						canCreateChildCallBackFunc: function () {
							var canCreateChild = _.size(service.getList()) >= 1 || _.get(service.getSelected(), 'Id') > 0;
							return true;
						},
						canDeleteCallBackFunc: function (unit) {
							// we check current unit and also its kids
							var anyReadOnly = function (unit) {
								var output = [];
								serviceContainer.data.flatten([unit], output, serviceContainer.data.treePresOpt.childProp);
								return true;
							};
							return true;
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['PlannedStart', 'PlannedEnd']),
						new ServiceDataProcessArraysExtension(['ControllingUnits']),
						controllingStructureImageProcessor,
						controllingStructureReadonlyProcessor],
					translation: {
						uid: 'controllingStructureMainService',
						title: 'controlling.structure.containerTitleControllingUnitsTable',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ControllingUnitDto',
							moduleSubModule: 'Controlling.Structure'
						}
					},
					entityRole: {
						node: {
							itemName: 'ControllingUnits',
							parentService: projectMainForCOStructureService
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(controllingStructureServiceOption);
			service = serviceContainer.service;


			projectMainForCOStructureService.doPrepareUpdateCall = function (updateData) {
				if (updateData) {
					_.each(updateData.ControllingUnitsToSave, function (item) {
						if (item.ControllingUnits) {
							item.ControllingUnits.ControllingUnits = [];

							if(item.ControllingUnits.ProjectStock){
								$http.post(globals.webApiBaseUrl + 'project/stock/save', item.ControllingUnits.ProjectStock).then(function (response) {
									if(response && response.data){
										basicsLookupdataLookupDescriptorService.updateData('projectStockLookupDataService', [response.data]);
									}
								});
							}
						}
					});
					_.each(updateData.ControllingUnitsToDelete, function (item) {
						item.ControllingUnits = [];
					});

					let data = service.getList();
					if(_.find(data,{isCreate: true})){
						_.each(data,function (item) {
							item.isCreate = false;
						});
					}
				}
			};

			// newEntityValidator (validation processor)
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ControllingUnitDto',
				moduleSubModule: 'Controlling.Structure',
				validationService: 'controllingStructureValidationService',
				mustValidateFields: ['Code', 'Quantity', 'UomFk', 'PlannedStart', 'PlannedEnd']
			});

			let originalCreateItem = serviceContainer.service.createItem;
			let isCreationState = false;
			serviceContainer.service.createItem = function createItem() {
				// if we're waiting still for the promise,
				// no creation is allowed and we stop here (#118687)
				if (isCreationState) {
					return;
				}
				if (_.size(service.getList()) === 0 || _.get(service.getSelected(), 'ControllingunitFk') > 0) {
					isCreationState = true;
					originalCreateItem().then(function () {
						isCreationState = false;
					});
				}
			};

			serviceContainer.data.processNewParent = function processNewParentControllingUnit(newParent) {
				// update image of parent item
				controllingStructureImageProcessor.processItem(newParent);
			};
			service.registerEntityDeleted(function (e, entites) {
				_.forEach (entites, function (entity) {
					let parentId = entity.ControllingunitFk;
					let parentItem = _.find (serviceContainer.data.itemList, {Id: parentId});
					if (parentItem) {
						parentItem.HasChildren = _.size (parentItem.ControllingUnits) > 0;
						controllingStructureImageProcessor.processItem (parentItem);

						platformRuntimeDataService.readonly (parentItem, [
							{field: 'ContrFormulaPropDefFk', readonly: parentItem.HasChildren},
							{field: 'PlannedStart', readonly: parentItem.HasChildren},
							{field: 'PlannedEnd', readonly: parentItem.HasChildren}]);
					}
				});
			});

			service.registerSelectionChanged(function (e, unit) {
				if (unit) {
					var containerGUIDs = [ // TODO: make more generic!
						'64632455ab734d10986f71dd1cecd0ce', // characteristic
						'9e5b5809635c45de90e27a567ff6b0e9', // ControllingGroupAssignments
						'9dcd60856ab34626963f5f6db332fb90'  // Translations
					];
					// TODO: reset to previous value!
					var permission = platformRuntimeDataService.isReadonly(unit) ? permissions.read : false;
					platformPermissionService.restrict(containerGUIDs, permission);
				}
			});

			service.cellChangeCallBack = function cellChangeCallBack(arg) {
				let field = arg.grid.getColumns()[arg.cell].field;
				let item = arg.item;

				if(field.startsWith('Assignment')){
					let assignmentsService = $injector.get('controllingStructureDynamicAssignmentsService');
					assignmentsService.onCellChangeCallBack(item, field);
				}
			};

			// bind to generation service
			service.bulkCreateOnServer = function (list) {controllingStructureGenerateService.bulkCreateOnServer(list, serviceContainer);};
			service.bulkCreate = function (list) {controllingStructureGenerateService.bulkCreate(list, serviceContainer);};
			service.setAndSavePrjCodetemplate = controllingStructureGenerateService.setAndSavePrjCodetemplate;

			var selectedControllingStructureId;
			service.navigateTo = function (item, triggerField) {
				let controllingUnit = null;
				if (((triggerField === 'MdcControllingUnitFk'  || triggerField === 'ControllingUnitFk' || triggerField === 'MdcControllingunitFk') && _.isNumber(item[triggerField])) ||  triggerField === 'Code') {

					let controllingUnits = basicsLookupdataLookupDescriptorService.getData('ControllingUnit');
					let controllingUnitsProm = null;

					if(triggerField === 'Code' && item[triggerField]){
						let code = item[triggerField];
						if (controllingUnits) {
							controllingUnit = _.find (controllingUnits, {Code: code});
							selectedControllingStructureId = controllingUnit? controllingUnit.Id : item.Id;
						}else{
							selectedControllingStructureId =  item.Id;
						}
					}else {
						selectedControllingStructureId = item[triggerField];
						if (controllingUnits) {
							controllingUnit = _.find (controllingUnits, {Id: selectedControllingStructureId});
						}
					}
					if (controllingUnit) {
						controllingUnitsProm = basicsLookupdataLookupDescriptorService.getItemByKey('ControllingUnit', selectedControllingStructureId); // $q.resolve(controllingUnit);
					}
					else {
						controllingUnitsProm = basicsLookupdataLookupDescriptorService.getItemByKey('ControllingUnit', selectedControllingStructureId);
					}
					// Added timeout to call in next cycle.
					$timeout(function () {
						controllingUnitsProm.then(function(data) {
							if(data){
								if (data.PrjProjectFk) {
									var filterRequest = cloudDesktopSidebarService.getFilterRequestParams();
									var flag = false;
									if (!filterRequest.projectContextId ) {
										cloudDesktopSidebarService.filterRequest.projectContextId = data.PrjProjectFk;
										flag = true;
									}
									projectMainForCOStructureService.load();
									if(flag){
										cloudDesktopSidebarService.filterRequest.projectContextId = filterRequest.projectContextId;
									}
								}
							}
						});
					});
				}
				else if (triggerField === 'Id' && item) {
					// from workflow entityLink
					if (_.isObject(item)) {
						controllingUnit = item;
						selectedControllingStructureId = item.Id;
						if(controllingUnit.ProjectFk){
							var filterRequest = cloudDesktopSidebarService.getFilterRequestParams();
							var flag = false;
							if (!filterRequest.projectContextId ) {
								cloudDesktopSidebarService.filterRequest.projectContextId = controllingUnit.ProjectFk;
								flag = true;
							}
							projectMainForCOStructureService.load();
							if(flag){
								cloudDesktopSidebarService.filterRequest.projectContextId = filterRequest.projectContextId;
							}
						}
					}
					else if (_.isString(item)) {
						selectedControllingStructureId = parseInt(item);
						$http.post(globals.webApiBaseUrl + 'controlling/structure/getcontrollingunit?Id=' + selectedControllingStructureId).then(function(response){
							if(response && response.data  ){
								controllingUnit = response.data;
								if(controllingUnit.ProjectFk){
									var filterRequest = cloudDesktopSidebarService.getFilterRequestParams();
									var flag = false;
									if (!filterRequest.projectContextId ) {
										cloudDesktopSidebarService.filterRequest.projectContextId = controllingUnit.ProjectFk;
										flag = true;
									}
									projectMainForCOStructureService.load();
									if(flag){
										cloudDesktopSidebarService.filterRequest.projectContextId = filterRequest.projectContextId;
									}
								}
							}else{
								return '';
							}
						});
					}
				}

			};

			service.calculateBudget = function calculateBudget(curUnit){
				if(!curUnit){return;}

				var list = serviceContainer.service.getList();
				if(!angular.isArray(list)){
					return;
				}
				function getChildren(parent){
					return _.filter(list, function(item) {return item.ControllingunitFk === parent.Id;});
				}

				function getParent(childItem){
					return _.find(list, function(item) {return item.Id === childItem.ControllingunitFk;});
				}

				if (!curUnit.IsFixedBudget) {
					var children = getChildren(curUnit);
					var totalBudget = children && children.length ? _.sumBy(children, 'Budget') : 0;
					curUnit.Budget = totalBudget  ? totalBudget : curUnit.Budget;
				}
				calculateBudgetDiff(curUnit, getChildren);
				calculateControllingUnitTree(curUnit, getParent, getChildren);
			};

			service.findParentRoot = function(item) {
				return findParentRoot(item);
			};

			service.changeCompany = function changeCompany(companyId, unit) {
				if (companyId > 0 && _.isObject(unit)) {
					unit.CompanyFk = companyId;
					_.each(service.getDataProcessor(), function (proc) {
						proc.processItem(unit);
					});
					service.markItemAsModified(unit);

					// #100166: if selection is not changed, canDelete callback function will be not called
					// so we have to set and update the state of the toolbar button 'delete' on our own
					var canDelete = controllingStructureServiceOption.hierarchicalNodeItem.actions.canDeleteCallBackFunc(unit);
					service.onToolsInvalid.fire(canDelete); // update delete button state (update tools)
				}
			};

			serviceContainer.service.onToolsInvalid = new PlatformMessenger();
			serviceContainer.service.onRowExpand = new PlatformMessenger();
			serviceContainer.service.asyncGetById = function asyncGetById (controllingUnitId) {
				var params = '?Id=' + controllingUnitId;
				var command = 'getcontrollingunit';
				return $http.post(globals.webApiBaseUrl + 'controlling/structure/'+command+params)
					.then(function (result) {
						return result.data;
					});
			};

			service.calculateEstimateCost = function calculateEstimateCost(curUnit){
				if(!curUnit){return;}

				var list = serviceContainer.service.getList();
				if (!angular.isArray(list)) {
					return;
				}
				function getChildren(parent){
					return _.filter(list, function(item) {return item.ControllingunitFk === parent.Id;});
				}

				function getParent(childItem){
					return _.find(list, function(item) {return item.Id === childItem.ControllingunitFk;});
				}

				var parent = getParent(curUnit);
				if (!parent) {
					return;
				}
				var children = getChildren(parent);
				var totalEstimateCost = children && children.length ? _.sumBy(children, 'EstimateCost') : 0;
				parent.EstimateCost = totalEstimateCost;

				service.markItemAsModified(parent);
				calculateEstimateCost(parent, getParent, getChildren);
			};

			let filters = [
				{
					key: 'controlling-structure-contr-formula-prop-def-lookup-filter',
					serverSide: false,
					fn: function (item) {
						return  item.BasContrColumnTypeFk === 3;
					}
				}
			];

			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter (filters);
			};

			service.unregisterFilters = function unregisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			return serviceContainer.service;

			function selectControllingStructure() {
				$timeout(function () {
					if (_.isNumber(selectedControllingStructureId)) {
						var item = serviceContainer.service.getItemById(selectedControllingStructureId);
						if (_.isObject(item)) {
							var parentRoot = null;
							if (item.ControllingunitFk) {
								parentRoot = findParentRoot(item);
								serviceContainer.service.onRowExpand.fire(parentRoot);
							}
							serviceContainer.service.setSelected(item);
							selectedControllingStructureId = null;
						}
					}
				});
			}
			function findParentRoot(item){

				var controllingUnitFk = item.ControllingunitFk;
				if(controllingUnitFk === null){
					controllingUnitFk = item.Id;
				}// already root structure
				var parentRoot = serviceContainer.service.getItemById(controllingUnitFk);
				if( parentRoot.ControllingunitFk){
					return findParentRoot(parentRoot);
				}
				else {
					return parentRoot;
				}
			}

			function calculateControllingUnitTree(curUnit, getParent, getChildren) {
				var parent = getParent(curUnit);
				if (!parent) {
					return;
				}
				if (parent.IsFixedBudget && (parent.BudgetDifference !== null || parent.BudgetDifference !== 0)) {
					calculateBudgetDiff(parent, getChildren);
				} else {
					var children = getChildren(parent);
					var totalBudget = children && children.length ? _.sumBy(children, 'Budget') : 0;
					// var totalEstimateCost = children && children.length ? _.sumBy(children, 'EstimateCost') : 0;
					parent.Budget = totalBudget ? totalBudget : parent.Budget;
					parent.BudgetCostDiff = parent.Budget - parent.EstimateCost;
				}
				service.markItemAsModified(parent);
				calculateControllingUnitTree(parent, getParent, getChildren);
			}

			function calculateBudgetDiff(curUnit, getChildren) {
				if (!curUnit) {
					return;
				}
				if(curUnit.IsFixedBudget){
					var children = getChildren(curUnit);
					curUnit.BudgetDifference = children && children.length ? curUnit.Budget - _.sumBy(children, 'Budget') : 0;
				}
				else {
					curUnit.BudgetDifference = 0;
				}
				curUnit.BudgetCostDiff = curUnit.Budget - curUnit.EstimateCost;
			}
			function reducePayloadSize(payload) {
				if (payload.ControllingUnitParent.ControllingUnitChildren && payload.ControllingUnitParent.ControllingUnitChildren.length > 1000) {
					payload.ControllingUnitParent.ControllingUnitChildren.forEach(function (child) {
						if (child) {
							delete child.ControllingUnitChildren;
							delete child.ControllingUnits;
						}
					});
				}
			}

		}]);
})();
