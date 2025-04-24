/**
 * Created by baf on 17.11.2017
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentMaintenanceValidationService
	 * @description provides validation methods for resource equipment maintenance entities
	 */
	angular.module(moduleName).service('resourceEquipmentMaintenanceValidationService', ResourceEquipmentMaintenanceValidationService);

	ResourceEquipmentMaintenanceValidationService.$inject = [
		'$q', '_', 'moment','resourceEquipmentMaintenanceDataService', 'resourceEquipmentPlantComponentDataService',
		'resourceMaintenanceSchemaRecordDataService'];

	function ResourceEquipmentMaintenanceValidationService(
		$q, _, moment, resourceEquipmentMaintenanceDataService, resourceEquipmentPlantComponentDataService,
		resourceMaintenanceSchemaRecordDataService) {
		let self = this;


		let asyncValidateSuccessorFields = function asyncValidateSuccessorFields(entity, value, model) {
			if (entity[model] === value || !['Quantity', 'IsRecalcPerformance'].includes(model)) {
				return Promise.resolve(true);
			}

			let newQuantity = model === 'Quantity' ? value : entity.Quantity;
			let newIsRecalcPerformance = model === 'IsRecalcPerformance' ? value : entity.IsRecalcPerformance;

			if (_.isNil(newQuantity)) {
				return $q.resolve(false);
			}

			if (!newIsRecalcPerformance) {
				return $q.resolve(true);
			}

			let plantComponent = _.find(resourceEquipmentPlantComponentDataService.getList(), ['Id', entity.PlantComponentFk]);
			if (_.isNil(plantComponent.MaintenanceSchemaFk)) {
				return $q.resolve(true);
			}

			return resourceMaintenanceSchemaRecordDataService.asyncListByParentId(plantComponent.MaintenanceSchemaFk).then(function(maintenanceSchemeRecords) {
				newQuantity = model === 'Quantity' ? value : entity.Quantity;

				let maintenanceSchemeRecordsById = _.keyBy(maintenanceSchemeRecords, 'Id');
				let maintenanceRecords = resourceEquipmentMaintenanceDataService.getList();
				let orderedMaintenanceRecords = _.sortBy(maintenanceRecords, 'Code');

				let newDeltaBase = 0;
				let newDeltaAdjustment = 0;
				let lastSchemeQuantity = 0;
				let prevMaintenanceRecordQuantity = 0;

				for (let i = 0; i < orderedMaintenanceRecords.length; i++) {
					let maintenanceRecord = orderedMaintenanceRecords[i];

					if (!_.isNil(maintenanceRecord.MaintSchemaRecFk)) {
						lastSchemeQuantity = maintenanceSchemeRecordsById[maintenanceRecord.MaintSchemaRecFk].Quantity;
					} else if (maintenanceRecord.IsRecalcPerformance) {
						newDeltaAdjustment += maintenanceRecord.Quantity - prevMaintenanceRecordQuantity;
					}

					// Since the entity list doesn't have the currently validated entity, or has it's old version,
					// this case has to be processed separately
					if (maintenanceRecord.Code.localeCompare(entity.Code) === 0) {
						if (lastSchemeQuantity === undefined) {
							// This should not happen:
							// At least one of the predecessors (or the current value) should have had a maintenanceSchemeRecordFk
							return false;
						}

						// The new delta for the successors is defined by the edited entity
						prevMaintenanceRecordQuantity =  entity.Quantity; // newQuantity;
						if (newIsRecalcPerformance) {
							newDeltaBase = newQuantity - lastSchemeQuantity;
							newDeltaAdjustment = 0;
						}

						continue;
					}

					prevMaintenanceRecordQuantity = maintenanceRecord.Quantity;

					if (maintenanceRecord.Code.localeCompare(entity.Code) < 0 || !maintenanceRecord.IsRecalcPerformance) {
						// Not a successor - skip
						continue;
					}

					let oldDelta = maintenanceRecord.Quantity - lastSchemeQuantity;

					// If the successor's Recalculation flag is set to false - reset to the "default" value, i.e. the newDeltaBase is 0, still needs to recheck the calculation result
					let newMaintenanceRecordQuantity = maintenanceRecord.Quantity + (maintenanceRecord.IsRecalcPerformance ? newDeltaBase : 0) + newDeltaAdjustment - oldDelta;
					if (maintenanceRecord.Quantity !== newMaintenanceRecordQuantity) {
						maintenanceRecord.Quantity = newMaintenanceRecordQuantity;
						resourceEquipmentMaintenanceDataService.markItemAsModified(maintenanceRecord);
						resourceEquipmentMaintenanceDataService.fireItemModified(maintenanceRecord);
					}
				}

				return true;
			});
		};

		let validateTimeChange = function validateTimeChange(entity, value, model){
			if(entity.MaintenanceSchemaFk && entity.IsRecalcDates){
				// preprocessing data and caching
				let filterSucessors = rec => rec.Code > entity.Code && rec.IsRecalcDates && rec.MaintenanceSchemaFk === entity.MaintenanceSchemaFk;
				let filterPredecessors = rec => rec.Code < entity.Code && rec.IsRecalcDates && rec.MaintenanceSchemaFk === entity.MaintenanceSchemaFk;
				let orderedMaintenaceRecords = _.orderBy(resourceEquipmentMaintenanceDataService.getList(),['Code']);
				let successorMaintenaceRecords = _.filter(orderedMaintenaceRecords,filterSucessors);
				let predecessors = _.filter(_.reverse(orderedMaintenaceRecords),filterPredecessors); // next predecessor is first element, farrest is last element
				let predecessorStartDate = _.some(predecessors) && !_.isNil(_.first(predecessors).StartDate) ?
					_.first(predecessors).StartDate.clone():
					entity.StartDate.clone().subtract(entity.DaysAfter, 'd');

				// proccessing own fields
				if(model === 'DaysAfter'){
					entity.StartDate = predecessorStartDate.clone().add(value,'d');
					entity.EndDate = entity.StartDate.clone().add(entity.Duration,'d');
					predecessorStartDate = entity.StartDate.clone();
				}
				else if(model === 'StartDate'){
					entity.DaysAfter = value.diff(predecessorStartDate,'d');
					entity.EndDate = value.clone().add(entity.Duration,'d');
					predecessorStartDate = value.clone();
				}
				// processing successor MaintenanceRecords
				_.forEach(successorMaintenaceRecords,function (succRec) {
					if(succRec){
						succRec.StartDate = predecessorStartDate.clone().add(succRec.DaysAfter,'d');
						succRec.EndDate = succRec.StartDate.clone().add(succRec.Duration,'d');
						// mark as changed for the client update process
						resourceEquipmentMaintenanceDataService.markItemAsModified(succRec);
						// update changes in UI
						resourceEquipmentMaintenanceDataService.fireItemModified(succRec);
						predecessorStartDate = succRec.StartDate.clone();
					}
				});
			}
			return true;
		};

		self.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
			return asyncValidateSuccessorFields(entity, value, model);
		};

		self.asyncValidateIsRecalcPerformance = function asyncValidateIsRecalcPerformance(entity, value, model){
			return asyncValidateSuccessorFields(entity, value, model);
		}

		self.validateDaysAfter = function validateDaysAfter(entity, value, model) {
			return validateTimeChange(entity,value,model);
		};

		self.validateStartDate = function validateStartDate(entity, value, model) {
			return validateTimeChange(entity,value,model);
		};
		self.validateEndDate = function validateEndDate(entity, value) {
			if(value.diff(entity.StartDate) > 0){
				entity.Duration = value.diff(entity.StartDate.clone(),'d');
				return true;
			}
			else{
				return false;
			}
		};
		self.validateCode = function validateCode(entity, value, model) {
			let maintenaceRecords = resourceEquipmentMaintenanceDataService.getList();
			let recalQuantity = 0;
			_.forEach(maintenaceRecords, function (listRec) {
				if (listRec.IsRecalcPerformance ===  true) {
					recalQuantity = (recalQuantity) + (listRec.Quantity);
					if (listRec.Id === entity.Id) {
						listRec.Quantity = recalQuantity;
					}
				}
			});
			resourceEquipmentMaintenanceDataService.gridRefresh();
			return true;
		};
	}
})(angular);
