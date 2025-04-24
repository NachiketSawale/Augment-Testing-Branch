/**
 * Created by xia on 3/5/2018.
 */
(function (angular) {
	'use strict';
	/* global _ */

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqDivisionTypeAssignmentUpdateService', [
		function () {
			var service = {},
				Boq2DivisionTypeToSave = [],
				Boq2DivisionTypeDelete = [];

			var number = 0;

			service.getNumber = function getNumber() {
				return number++;
			};

			service.addBoq2DivisionTypeToUpdateByDivisionType = function addBoq2DivisionTypeToUpdateByDivisionType(boqItem, divisionTypeItem, isAdd) {

				service.updateBoq2DivisionTypeByFilter(
					boqItem,
					divisionTypeItem.Id,
					{'BoqDivisionTypeFk': divisionTypeItem.Id, 'BoqItemFk': boqItem.Id, 'BoqHeaderFk': boqItem.BoqHeaderFk},
					isAdd
				);
			};

			service.addBoq2DivisionTypeToUpdateByAssignment = function addBoq2DivisionTypeToUpdateByAssignment(boqItem, divisionTypeAssignment, isAdd) {

				service.updateBoq2DivisionTypeByFilter(
					boqItem,
					divisionTypeAssignment.BoqDivisionTypeFk,
					{'BoqDivisionTypeFk': divisionTypeAssignment.BoqDivisionTypeFk, 'BoqItemFk': boqItem.Id, 'BoqHeaderFk': boqItem.BoqHeaderFk},
					isAdd
				);
			};

			service.updateBoq2DivisionTypeByFilter = function updateBoq2DivisionTypeByFilter(boqItem, divisionTypeItemId, filterObj, isAdd) {

				var Boq2DivisionToRemove = isAdd ? Boq2DivisionTypeDelete : Boq2DivisionTypeToSave;
				_.remove(Boq2DivisionToRemove, filterObj);

				var Boq2DivisionToAdd = isAdd ? Boq2DivisionTypeToSave : Boq2DivisionTypeDelete;
				if (_.findIndex(Boq2DivisionToAdd, filterObj) === -1) {
					Boq2DivisionToAdd.push(
						{
							'Id': service.getNumber(),
							'BoqDivisionTypeFk': divisionTypeItemId,
							'BoqItemFk': boqItem.Id,
							'BoqHeaderFk': boqItem.BoqHeaderFk
						});
				}
			};

			service.updateDivisionTypeAssignmentToSave = function updateDivisionTypeAssignmentToSave(updateData/* , boqHeaderId */) {
				updateData.Boq2DivisionTypeToSave = Boq2DivisionTypeToSave;
				updateData.Boq2DivisionTypeDelete = Boq2DivisionTypeDelete;
				updateData.EntitiesCount += Boq2DivisionTypeToSave.length + Boq2DivisionTypeDelete.length;

				return updateData;
			};

			service.clear = function clear() {
				Boq2DivisionTypeToSave = [];
				Boq2DivisionTypeDelete = [];
			};

			service.getBoq2DivisionTypeToSave = function getBoq2DivisionTypeToSave() {
				return Boq2DivisionTypeToSave;
			};

			service.getBoq2DivisionTypeDelete = function getBoq2DivisionTypeDelete() {
				return Boq2DivisionTypeDelete;
			};

			return service;
		}
	]);
})(angular);
