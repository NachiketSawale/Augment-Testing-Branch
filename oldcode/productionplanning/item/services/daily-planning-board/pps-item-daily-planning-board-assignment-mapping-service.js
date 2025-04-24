(() => {
	'use strict';
	/* global angular, _ */

	/**
	 * @ngdoc service
	 * @name ppsItemDailyPlanningBoardAssignmentMappingService
	 * @function
	 *
	 * @description
	 * ppsItemDailyPlanningBoardAssignmentMappingService is the mapping service for all productionSet to standard demands in planning boards
	 */
	let moduleName = 'productionplanning.item';

	let itemModule = angular.module(moduleName);

	itemModule.service('ppsItemDailyPlanningBoardAssignmentMappingService', DailyPlanningBoardAssignmentMappingService);

	DailyPlanningBoardAssignmentMappingService.$inject = ['$q', '$http', '$translate', '$injector', 'moment',
		'platformPlanningBoardDataService',
		'ppsItemConstantValues',
		'basicsLookupdataConfigGenerator',
		'productionplanningItemDataService',
		'platformDateshiftPlanningboardHelperService',
		'productionPlanningItemPlanningBoardStatusService'];

	function DailyPlanningBoardAssignmentMappingService($q, $http, $translate, $injector, moment,
		platformPlanningBoardDataService,
		ConstantValues,
		basicsLookupdataConfigGenerator,
		productionplanningItemDataService,
		platformDateshiftPlanningboardHelperService,
		productionPlanningItemPlanningBoardStatusService) {

		let _self = this;

		const addProperty = (entity, property, array) => {
			if (_.isObject(entity) && _.isString(property) && _.isArray(array) && _.has(entity, property)) {
				array.push(_.get(entity, property));
			}
		};

		const implementMemberAccess = (field, entity, value) => {
			// nullable values are accepted
			if (!_.isUndefined(value)) {
				entity[field] = value;
			}
			return entity[field];
		};

		function implementNumberMemberAccess(field, reservation, value) {
			// nullable values are accepted
			if (_.isNumber(value) || value === null) {
				reservation[field] = value;
			}
			return reservation[field];
		}

		this.id = (productionSet) => {
			return productionSet.Id;
		};

		this.description = (productionSet, desc) => {
			//Project: Drawing
			let descriptionsArr = [];
			addProperty(productionSet, 'DataType', descriptionsArr);
			addProperty(productionSet, 'Project.ProjectName', descriptionsArr);
			addProperty(productionSet, 'Drawing.Code', descriptionsArr);
			return descriptionsArr.join(': ');
		};

		this.infoField = (productionSet, infoField) => {
			return _.has(productionSet, infoField) ? _.get(productionSet, infoField) : '';
		};

		this.assignmentTypeDescription = function (phase, assignmentType) {
			return implementMemberAccess('Type', phase, assignmentType);
		};

		this.from = (productionSet, from) => {
			return implementMemberAccess('PlannedStart', productionSet, from);
		};

		this.to = (productionSet, to) => {
			return implementMemberAccess('PlannedFinish', productionSet, to);
		};

		this.quantity = (productionSet, quantity) => {
			if (productionSet.PlanQty > 0) {
				return implementMemberAccess('PlanQty', productionSet, quantity);
			} else if (productionSet.RealQty > 0) {
				return implementMemberAccess('RealQty', productionSet, quantity);
			}
			return 0;
		};

		// this.aggregateType = function materialGroup(reservation) {
		// 	return _.get(reservation, 'MaterialGroup.Code');
		// };

		this.unitOfMeasurement = function unitOfMeasurementOfReservation(reservation, unit) {
			return implementMemberAccess('BasUomFk', reservation, unit);
		};

		this.assignmentType = () => {
			return -1;
		};

		this.forMaintenance = () => {
			return false;
		};

		this.supplier = (productionSet, siteId) => {
			return implementMemberAccess('Supplier', productionSet, siteId);
		};

		this.demand = (productionSet, demand) => {
			//implementMemberAccess('Supplier', productionSet, demand.Id);

			//return productionSet;
		};

		this.project = (productionSet) => {
			return _.get(productionSet, 'Project.Id');
		};

		this.areRelated = () => {
			return false;
		};

		this.createAssignment = (productionSet, newProductionSet) => {
			return newProductionSet;
		};

		this.validateAssignment = () => {

		};

		this.getTypeService = () => {
			return {
				getAssignmentTypeIcons: function () {
					return $q.when([]);
				},
				getAssignmentType: function () {
					return $q.when([]);
				}
			};
		};

		this.getStatusService = () => {
			return productionPlanningItemPlanningBoardStatusService;
		};

		this.status = (productionSet) => {
			if (productionSet.ProductionSetStatus && productionSet.ProductionSetStatus.Id && productionSet.ProductionSetStatus.Id > 0) {
				return productionSet.ProductionSetStatus.Id;
			}
			return -1;
		};

		this.statusKey = () => {
			return '';
		};

		this.statusPanelText = () => {
			return '';
		};

		this.isLocked = (productionSet) => {
			return productionSet.IsLocked || false;
		};

		this.headerColor = (productionSet) => {
			return ((productionSet.DataTypeId % 100) / 10);
		};

		this.validateAgainst = () => {
			return [];
		};

		this.isReadOnly = (productionSet) => {
			return productionSet.DataTypeId === ConstantValues.values.NestedTypeId;
		};

		// don't use aggregateType in case you want to use custom aggregations
		// this.aggregateType = function materialGroup(productionSet, dataTypeId) {
		// 	return implementMemberAccess('PlanQto', productionSet, dataTypeId);
		// };

		this.useCapacities = () => {
			return false;
		};

		this.uomFactor = function uomFactor(productionSet) {
			return (productionSet.Unit !== null && productionSet.Unit.Factor) ? productionSet.Unit.Factor : 1;
		};

		this.aggregationUomFactor = function aggregationUomFactor(productionSet) {
			//jshint ignore:line
			return (productionSet.SiteUnit !== null && productionSet.SiteUnit.Factor) ? productionSet.SiteUnit.Factor : 1;
		};

		this.aggregationUomDescription = function aggregationUomDescription(productionSet) {
			return (productionSet.SiteUnit !== null && productionSet.SiteUnit.LowerUnit) ? productionSet.SiteUnit.LowerUnit : '';
		};

		this.getAggregationProperties = () => {
			return ['FixedPlanQty', 'RealQty', 'PlannedResidual', 'UnnestedQty', 'MesAndUnnestedQty'];
		};

		this.getCustomAggregationDropdownOptions = () => {
			return [
				{value: 'FixedPlanQty', id: 'FixedPlanQty', caption: $translate.instant('productionplanning.item.dailyProduction.planQty')},
				{value: 'RealQty', id: 'RealQty', caption: $translate.instant('productionplanning.item.dailyProduction.realQty')},
				{value: 'PlannedResidual', id: 'plannedResidual', caption: $translate.instant('productionplanning.item.dailyProduction.plannedResidual')},
				{value: 'UnnestedQty', id: 'unnestedQty', caption: $translate.instant('productionplanning.item.dailyProduction.unnestedQty')},
				{value: 'MesAndUnnestedQty', id: 'mesAndUnnestedQty', caption: $translate.instant('productionplanning.item.dailyProduction.mesAndUnnestedQty')}
			];
		};

		this.getAggregationText = (option, productionSet) => {
			let text = '';
			switch (option) {
				case 'FixedPlanQty':
				case 'RealQty':
				case 'PlannedResidual':
				case 'UnnestedQty':
				case 'MesAndUnnestedQty':
					text = `${((productionSet.sums[option]) / productionSet.displayFactor).toFixed(2)} ${productionSet.uomDescription}`;
					break;
				default:
					break;
			}

			return text;
		};

		this.isDraggable = (productionSet) => {
			return productionSet.DataTypeId === ConstantValues.values.UnassignedTypeId || productionSet.DataTypeId === ConstantValues.values.LockedTypeId;
		};

		this.areRelated = function () {
			return false;
		};

		this.dragInformation = (productionSet) => {
			return productionSet.Description;
		};

		this.canDragVertically = (productionSet) => {
			return productionSet.DataTypeId === ConstantValues.values.UnassignedTypeId || productionSet.DataTypeId === ConstantValues.values.LockedTypeId;
		};

		this.onDrop = (assignment, assignments, planningBoardDataService) => {
			const defer = $q.defer();
			if (assignment.Supplier > 0 && assignment.DataTypeId === ConstantValues.values.UnassignedTypeId) {
				assignment.PlanQty = assignment.RemainingQty;
				assignment.State = 2;
				assignment.DataType = 'Assigned';
				assignment.DataTypeId = 1;
				defer.resolve(assignment);
			}
			else if (assignment.Supplier > 0 && assignment.DataTypeId === ConstantValues.values.LockedTypeId){
				if(assignment.PlannedStart.isBefore(assignment.MinStart)){
					assignment.PlannedStart = assignment.MinStart;
				}else if(assignment.PlannedStart.isAfter(assignment.MaxStart)){
					assignment.PlannedStart = assignment.MaxStart;
				}
				assignment.PlannedFinish = _.cloneDeep(assignment.PlannedStart).add(86399, 'seconds');

				// Correct TriggerEntity startDate>endDate issue when drop on exceptionDay
				synTiggerEntity(planningBoardDataService, assignment);
				fixAssignments(planningBoardDataService, [assignment]);

				defer.resolve(assignment);
			}
			return defer.promise;
		};

		this.getAssignmentModalFormConfig = (productionSet) => {
			let columnReadonly = productionSet.DataTypeId !== ConstantValues.values.LockedTypeId;

			let productionStatusRow = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ppsproductstatus', '',
				{
					gid: 'default',
					rid: 'productionStatus',
					label: '*Production Status',
					label$tr$: 'productionplanning.item.dailyProduction.productionStatus',
					type: 'lookup',
					model: 'FabricationProductStatusFk',
					readonly: true
				}, true, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				});

			return {
				fid: 'example',
				version: '1.0.0',
				showGrouping: true,
				groups: [{
					gid: 'default',
					header: 'Details',
					isOpen: true
				}],
				rows: [
					{
						gid: 'default',
						rid: 'deliveryDate',
						label: '*Delivery Date',
						label$tr$: 'productionplanning.item.dailyProduction.deliveryDate',
						model: 'DeliveryDate',
						type: 'datetimeutc',
						readonly: true
					},
					productionStatusRow,
					{
						gid: 'default',
						rid: 'sumPlanQty',
						label: '*Sum Plan Quantity',
						label$tr$: 'productionplanning.item.dailyProduction.sumPlanQty',
						model: 'SumQuantity',
						type: 'directive',
						directive: 'pps-item-fabrication-product-directive',
						options: {
							property: 'SumQuantity'
						}
					},
					{
						gid: 'default',
						rid: 'sumArea',
						label: '*Sum Area',
						label$tr$: 'productionplanning.item.dailyProduction.sumArea',
						model: 'SumArea',
						type: 'directive',
						directive: 'pps-item-fabrication-product-directive',
						options: {
							property: 'SumArea'
						}
					},
					{
						gid: 'default',
						rid: 'sumVolume',
						label: '*Sum Volume',
						label$tr$: 'productionplanning.item.dailyProduction.sumVolume',
						model: 'SumVolume',
						type: 'directive',
						directive: 'pps-item-fabrication-product-directive',
						options: {
							property: 'SumVolume'
						}
					},
					{
						gid: 'default',
						rid: 'planQty',
						label: '*Plan Quantity',
						label$tr$: 'productionplanning.item.dailyProduction.planQty',
						model: 'PlanQty',
						type: 'decimal',
						readonly: productionSet.DataTypeId === ConstantValues.values.NestedTypeId, //Nested set readonly
						change: (entity) => {
							let boardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService');
							let list = boardDataService.assignmentDataService.getList();

							if (entity.DataTypeId === ConstantValues.values.LockedTypeId) {
								let selected = boardDataService.assignments.get(entity.Id); //_.find(list, {Id: productionSet.Id});
								entity.InfoField1 = entity.PlanQty;
								let unassign = _.find(list, (set) => {
									return set.Supplier === -1 && set.PlannedStart.isSame(entity.PlannedStart) && set.ItemFk === entity.ItemFk;
								});
								if (unassign) {
									unassign.RemainingQty = unassign.RemainingQty - (entity.PlanQty - selected.PlanQty);
									unassign.InfoField1 = unassign.RemainingQty;
								}
							} else if (entity.DataTypeId === ConstantValues.values.UnassignedTypeId) {
								let selectedUnassign = boardDataService.assignments.get(entity.Id); //_.find(list, {Id: productionSet.Id});
								selectedUnassign.RemainingQty = selectedUnassign.RemainingQty + (entity.PlanQty - selectedUnassign.PlanQty);
								entity.InfoField1 = selectedUnassign.RemainingQty;
							}
						}
					},
					{
						gid: 'default',
						rid: 'supplier',
						label: '*Supplier',
						label$tr$: 'productionplanning.item.dailyProduction.supplier',
						model: 'Supplier',
						readonly: columnReadonly,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-daily-supplier-filter'
							},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'default',
						rid: 'project1',
						label: '*Project Name',
						label$tr$: 'cloud.common.entityProjectName',
						model: 'Project.Id',
						type: 'directive',
						directive: 'basics-lookup-data-project-project-dialog',
						options: {
							displayMember: 'ProjectName'
						},
						readonly: true
					},
					{
						gid: 'default',
						rid: 'project2',
						label: '*Project Name2',
						label$tr$: 'cloud.common.entityProjectName2',
						model: 'Project.Id',
						type: 'directive',
						directive: 'basics-lookup-data-project-project-dialog',
						options: {
							displayMember: 'ProjectName2'
						},
						readonly: true
					}, {
						gid: 'default',
						rid: 'ppsitem',
						label: '*Item',
						label$tr$: 'productionplanning.item.entityItem',
						model: 'PpsItem.Id',
						type: 'directive',
						directive: 'productionplanning-item-item-lookup-dialog',
						readonly: true
					}, {
						gid: 'default',
						rid: 'number',
						label: '*Number',
						label$tr$: 'productionplanning.item.dailyProduction.number',
						model: 'Number',
						type: 'description',
						readonly: true
					}, {
						gid: 'default',
						rid: 'commentText',
						label: '*Comment',
						label$tr$: 'cloud.common.entityComment',
						model: 'CommentText',
						type: 'comment',
						readonly: productionSet.DataTypeId === ConstantValues.values.UnassignedTypeId
					}, {
						gid: 'default',
						rid: 'userdefined1',
						label: '*User Defined1',
						label$tr$: 'cloud.common.entityUserDefined',
						label$tr$param$: {
							'p_0': '1'
						},
						model: 'UserDefined1',
						type: 'description',
						readonly: true
					}, {
						gid: 'default',
						rid: 'userdefined2',
						label: '*User Defined2',
						label$tr$: 'cloud.common.entityUserDefined',
						label$tr$param$: {
							'p_0': '2'
						},
						model: 'UserDefined2',
						type: 'description',
						readonly: true
					}, {
						gid: 'default',
						rid: 'userdefined3',
						label: '*User Defined3',
						label$tr$: 'cloud.common.entityUserDefined',
						label$tr$param$: {
							'p_0': '3'
						},
						model: 'UserDefined3',
						type: 'description',
						readonly: true
					}, {
						gid: 'default',
						rid: 'userdefined4',
						label: '*User Defined4',
						label$tr$: 'cloud.common.entityUserDefined',
						label$tr$param$: {
							'p_0': '4'
						},
						model: 'UserDefined4',
						type: 'description',
						readonly: true
					}, {
						gid: 'default',
						rid: 'userdefined5',
						label: '*User Defined5',
						label$tr$: 'cloud.common.entityUserDefined',
						label$tr$param$: {
							'p_0': '5'
						},
						model: 'UserDefined5',
						type: 'description',
						readonly: true
					}, {
						gid: 'default',
						rid: 'targetStatus',
						label: '*Changing Status to',
						label$tr$: 'productionplanning.item.dailyProduction.changingStatus',
						model: 'TargetStatus',
						type: 'select',
						readonly: productionSet.DataTypeId === ConstantValues.values.NestedTypeId,
						options: {
							displayMember: 'Description',
							valueMember: 'Id',
							items: $injector.get('ppsItemDailyPlanningBoardAssignmentService').getStatusList(productionSet.DataTypeId)
						},
						change: function (entity) {
							let cache = $injector.get('ppsItemDailyPlanningBoardAssignmentService').getAssignmentCache();
							entity.UpdateStatus = !_.find(cache, {Id: entity.Id, TargetStatus: entity.TargetStatus});
						}
					}]
			};
		};

		this.filteredAssignmentsOnProductionSet = function filteredAssignmentsOnProductionSet(assignments) {
			let productionSetId = (productionplanningItemDataService.getSelected()) ? productionplanningItemDataService.getSelected().ProductionSetId : -1;
			let highlightAssignmentKeys = [];
			assignments.forEach(function f(assignment) {
				assignment.highlightAssignmentFlag = false;
				if (assignment.ProductionSetId === productionSetId) {
					highlightAssignmentKeys.push(assignment.Id);
				}
			});
			return highlightAssignmentKeys;

		};

		this.canMultiShiftAssignment = function canMultiShiftAssignment(selectedAssignments){
			let supplierId = _self.supplier(selectedAssignments[0]);
			let filterDifferentSupplier = selectedAssignments.filter(assignment => _self.supplier(assignment) !== supplierId);
			return filterDifferentSupplier.length <= 0 ? true : false;

		};

		this.dateShift = (dateshiftData) => {
			dateshiftData.mappingService = _self;
			platformDateshiftPlanningboardHelperService.shiftDate(dateshiftData, true);
		};

		function synTiggerEntity(planningBoardDataService, assignment){
			const dataServiceForDateshift = planningBoardDataService.getDateshiftConfig().dataService;
			let triggerEntity = dataServiceForDateshift.getList().find(entity => entity.EntityName === 'DailyProduction' && entity.Id === assignment.Id);
			if(triggerEntity){
				triggerEntity.StartDate = _.cloneDeep(assignment.PlannedStart);
				triggerEntity.EndDate = _.cloneDeep(assignment.PlannedFinish);
				planningBoardDataService.getDateshiftConfig().dataService.markEntitiesAsModified([triggerEntity], {'hasChanged': true});
			}
		}

		function fixAssignments(planningBoardDataService, changedAssignments){
			let assignments = planningBoardDataService.assignments;
			assignments.forEach((assignment,key) => {
				const changedAssignment = _.find(changedAssignments, {Id: assignment.Id});
				if(assignment.pBoardModified && assignment.DataType === 'Assigned' && !assignment.isDragging && changedAssignment){
					assignment.PlannedStart._d = new Date(changedAssignment.PlannedStart._i);
					assignment.PlannedFinish._d = _.cloneDeep(changedAssignment.PlannedStart).add(86399, 'seconds')._d;
					assignments.set(key, assignment);
					synTiggerEntity(planningBoardDataService, assignment);
				}
			});
		}

		this.ppsHeaderColor = function ppsHeaderColor(productionSet) {
			var ppsHeaderColor = implementNumberMemberAccess('PPSHeaderColor', productionSet);
			return ppsHeaderColor ? ppsHeaderColor : null;
		};

		this.manipulateDefaultConfigValues = (defaultConfigValues) => {
			let tagConfig = Object.values(defaultConfigValues)[0].tagConfig;
			let currentMaxSort = Math.max(...tagConfig.map(i => i.sort));
			tagConfig.push({
				id: 'ppsHeader',
				name: $translate.instant('platform.planningboard.ppsHeader'),
				color: '#786735',
				customColor: false,
				icon: true,
				visible: true,
				sort: ++currentMaxSort
			});

			return defaultConfigValues;
		};
	}

})();
