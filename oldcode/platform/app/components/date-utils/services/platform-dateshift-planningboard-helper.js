/* global moment */
((angular) => {
	'use strict';

	let moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformDateshiftPlanningboardHelperService
	 * @description
	 * platformDateshiftPlanningboardHelperService provides functions for special behaviour in the planningboard
	 */
	angular.module(moduleName).service('platformDateshiftPlanningboardHelperService', PlatformDateshiftPlanningboardHelperService);
	PlatformDateshiftPlanningboardHelperService.$inject = ['platformDateshiftService', '_', 'ppsVirtualDataServiceFactory', '$timeout', 'platformDateshiftHelperService'];

	function PlatformDateshiftPlanningboardHelperService(platformDateshiftService, _, ppsVirtualDataServiceFactory, $timeout, platformDateshiftHelperService) {
		let service = {
			shiftDate: shiftSingle,
			entityChanged: entityChanged,
			shiftMultiple: shiftMultiple,
			resetMultishift: resetMultishift
		};

		const multishiftData = {
			lastDraggedAssignment: {},
			lastSelectedAssignments: [],
			addedRelations: [],
			lastDurationOfMove: 0,
			isShiftFinished: true
		};

		function shiftDate(dateshiftObject, isVirtualShift = false, shiftStatus = { isShiftFinished: false }) {
			let tempStart = moment(dateshiftObject.startMoment).utc();
			let tempEnd = moment(dateshiftObject.endMoment).utc();
			let cloneAssignment = JSON.parse(JSON.stringify(dateshiftObject.el));
			dateshiftObject.mappingService.from(cloneAssignment, tempStart);
			dateshiftObject.mappingService.to(cloneAssignment, tempEnd);

			let shiftedAssignment, shiftedData;
			let dataService = dateshiftObject.dataService;

			if (dateshiftObject.type === 'mid') {
				if (isVirtualShift) {
					shiftedData = dateshiftObject.dateShiftConfig.dataService.shiftVirtualEntity(cloneAssignment,
						dateshiftObject.dateShiftConfig.entityName,
						dateshiftObject.dateShiftConfig.dateshiftId,
						'fullShift',
						true,
						false,
						shiftStatus);
				} else {
					shiftedData = dateshiftObject.dateShiftConfig.dateShiftHelperService.shiftDate(dateshiftObject.dateShiftConfig.dataService.getServiceName(), cloneAssignment, false, 'fullShift', shiftStatus);
				}
			} else {
				if (isVirtualShift) {
					shiftedData = dateshiftObject.dateShiftConfig.dataService.shiftVirtualEntity(cloneAssignment,
						dateshiftObject.dateShiftConfig.entityName,
						dateshiftObject.dateShiftConfig.dateshiftId,
						undefined,
						true,
						false,
						shiftStatus);
				} else {
					shiftedData = dateshiftObject.dateShiftConfig.dateShiftHelperService.shiftDate(dateshiftObject.dateShiftConfig.dataService.getServiceName(), cloneAssignment, undefined, undefined, shiftStatus);
				}
			}

			let fromIsMoment = false;
			let toIsMoment = false;
			if (shiftedData) {
				shiftedData.forEach(function f(val) {
					let shiftedAssignmentObj = dateshiftObject.dataService.assignments.get(val.Id);

					if (typeof [...dateshiftObject.dataService.assignments.keys()][0] === 'string') {
						shiftedAssignmentObj = new Map([...dateshiftObject.dataService.assignments.values()].map(x => [x.originalEntity ? x.originalEntity.Id : x.Id, x])).get(val.Id);
					}

					if (shiftedAssignmentObj) {

						// for angular elements
						const shiftedAssignment = shiftedAssignmentObj.originalEntity ? shiftedAssignmentObj.originalEntity : shiftedAssignmentObj;
						//

						fromIsMoment = moment.isMoment(dateshiftObject.mappingService.from(shiftedAssignment));
						toIsMoment = moment.isMoment(dateshiftObject.mappingService.to(shiftedAssignment));
						dateshiftObject.mappingService.from(shiftedAssignment, fromIsMoment ? dateshiftObject.mappingService.from(val) : dateshiftObject.mappingService.from(val).toDate());
						dateshiftObject.mappingService.to(shiftedAssignment, toIsMoment ? dateshiftObject.mappingService.to(val) : dateshiftObject.mappingService.to(val).toDate());
						dataService.updateAssignment(shiftedAssignmentObj);
					}
				});
			}

			shiftedAssignment = shiftedData.find(shiftedAssignment => shiftedAssignment.Id === dateshiftObject.el.Id);

			if (_.isUndefined(shiftedAssignment)) {
				return;
			}

			dateshiftObject.mappingService.from(dateshiftObject.el, fromIsMoment ? dateshiftObject.mappingService.from(shiftedAssignment) : dateshiftObject.mappingService.from(shiftedAssignment).toDate());
			dateshiftObject.mappingService.to(dateshiftObject.el, toIsMoment ? dateshiftObject.mappingService.to(shiftedAssignment) : dateshiftObject.mappingService.to(shiftedAssignment).toDate());

			// what is this? what does it do?
			/* if (shiftedAssignment.nearestBounds) {
				dateshiftObject.el.nearestBounds = shiftedAssignment.nearestBounds;
			} */
			return shiftedData
		}

		function entityChanged(dateshiftObject, isVirtualShift = false) {
			let cloneAssignment = JSON.parse(JSON.stringify(dateshiftObject.el));
			return dateshiftObject.dateShiftConfig.dataService.virtualEntityChanged(cloneAssignment, dateshiftObject.dateShiftConfig.entityName, true);
		}

		function shiftSingle(dateshiftObject, isVirtualShift = false, shiftStatus = { isShiftFinished: false }) {
			if (multishiftData.addedRelations.length > 0) {
				const vdsService = dateshiftObject.dateShiftConfig.dataService;
				resetMultishift(vdsService);
			}
			return shiftDate(dateshiftObject, isVirtualShift, shiftStatus);
		}

		function shiftMultiple(dateshiftObject, isVirtualShift = false) {
			const vdsService = dateshiftObject.dateShiftConfig.dataService;
			const dataService = dateshiftObject.dataService;

			const countOfSelectedAssignments = dateshiftObject.selectedAssignments.length;

			let relationsToAdd = [];

			let assignmentsToShift = dateshiftObject.selectedAssignments;
			let draggedAssignment = dateshiftObject.el;

			if (countOfSelectedAssignments <= 1) {
				resetMultishift(vdsService);
				return shiftSingle(dateshiftObject, isVirtualShift, multishiftData);
			}

			const needsReset = isMultishiftDataResetNeeded(multishiftData, dateshiftObject);
			const isMultishiftDataEmpty = multishiftData.addedRelations.length === 0;

			if (needsReset || isMultishiftDataEmpty) {
				resetMultishift(vdsService);

				const sequencesOfShifted = findSequencesToShift(dateshiftObject.selectedAssignments, draggedAssignment, vdsService);

				if (sequencesOfShifted.length > 0) {
					assignmentsToShift = findAssignmentsToShift(sequencesOfShifted, dataService, draggedAssignment);

					if (assignmentsToShift.every(assignment => assignment)) { // if all assignments are defined
						if (vdsService.getContainerData().relations.length > 0) {
							let relationToAdd = Object.assign({}, vdsService.getContainerData().relations[0]);

							relationsToAdd = createRelationsToAdd(
								{
									assignmentsToShift: assignmentsToShift,
									relationToAdd: relationToAdd,
									draggedAssignment: draggedAssignment,
									vdsService: vdsService,
									mappingService: dataService.getAssignmentConfig().mappingService
								});

						}
						multishiftData.addedRelations = relationsToAdd;
						vdsService.addRelations(multishiftData.addedRelations);
						platformDateshiftHelperService.resetDateshift(vdsService.getServiceName());
					}
				}
			}

			if (assignmentsToShift.every(assignment => assignment)) {  // if all assignments are defined
				multishiftData.lastSelectedAssignments = [...dateshiftObject.selectedAssignments];
				multishiftData.lastDurationOfMove = dateshiftObject.durationOfMove.asMilliseconds();
				multishiftData.lastDraggedAssignment = draggedAssignment;
				multishiftData.isShiftFinished = false;

				let shiftedData = shiftDate(dateshiftObject, true, multishiftData);

				return shiftedData;
			}
		}

		function resetMultishift(vdsService) {
			if (multishiftData.addedRelations.length > 0) {
				vdsService.removeRelations(multishiftData.addedRelations); //fn resets the dateshift data if any relation has been removed. no need for extra reset!
				platformDateshiftHelperService.updateSequenceData(vdsService.getServiceName());
				multishiftData.addedRelations = [];
				multishiftData.lastSelectedAssignments = [];
				multishiftData.lastDraggedAssignment = {};
				multishiftData.lastDurationOfMove = 0;
				multishiftData.isShiftFinished = true;
			}
		}

		function isMultishiftDataResetNeeded(multishiftData, dateshiftObject) {
			const draggedAssignmentChanged = multishiftData.lastDraggedAssignment !== dateshiftObject.el;

			const idsOfLastSelected = multishiftData.lastSelectedAssignments.map(x => x.Id);
			const idsOfCurrentlySelected = dateshiftObject.selectedAssignments.map(y => y.Id);
			const selectionChanged = idsOfLastSelected.filter(x => !idsOfCurrentlySelected.includes(x)).lenght > 0;

			return draggedAssignmentChanged || selectionChanged;
		}

		function findSequencesToShift(selectedAssignments, draggedAssignment, vdsService) {
			const selecetedAssignmentIds = selectedAssignments.filter(s => s.Id !== draggedAssignment.Id).map((s) => s.Id);

			// sequences of selected but not dragged
			const otherSequencesToShift = vdsService.getSequenceData()
				.filter((sequence) =>
					selecetedAssignmentIds
						.some((sId) => sequence.actualData.activities.map((a) => a.Id).includes(sId)
							&& !sequence.actualData.activities.map((a) => a.Id).includes(draggedAssignment.Id)));

			return otherSequencesToShift;
		}

		function findAssignmentsToShift(sequencesOfShifted, dataService, draggedAssignment) {
			const activitiesOfShiftedSequences = sequencesOfShifted
				.flatMap(sequance => sequance.actualData.activities)
				.filter(activity => activity.Id !== draggedAssignment.Id);

			const assignmentsToActivities = activitiesOfShiftedSequences
				.map(activity => {
					let value = dataService.assignments.get(activity.Id) || dataService.assignments.get(activity.CompositeId);
					if (value.originalEntity) {
						value = value.originalEntity;
					}
					return value;
				});

			return assignmentsToActivities;
		}

		/*
		RelationKindFk:

					1 - Finish-Start
								  __[2]
							[1]__|

					2 - Finish-Finish
										[2]_
							[1]__________|

					3 - Start-Finish
									[2]_
						_[1]  ______|
						|______|

					4 - Start-Start
							_[2]
						_[1] |
						|____|
		*/
		function createRelationsToAdd(creationData) {
			const relationToAdds = [];
			const activities = creationData.vdsService
				.getContainerData()
				.getList();
			const mappingService = creationData.mappingService;
			const draggedAssignment = creationData.draggedAssignment;

			const activityOfDragged = activities
				.find((activity) => activity.Id === creationData.draggedAssignment.Id);

			creationData.assignmentsToShift.forEach((selectedAssignment) => {
				const activityOfSelected = activities
					.find((activity) => activity.Id === selectedAssignment.Id);

				const relationToDragged = Object.assign({}, creationData.relationToAdd);

				if (mappingService.from(draggedAssignment).isSameOrAfter(mappingService.to(selectedAssignment))) {
					relationToDragged.PredecessorFk = activityOfSelected.CompositeId;
					relationToDragged.SuccessorFk = activityOfDragged.CompositeId;
				}

				if (mappingService.to(draggedAssignment).isSameOrBefore(mappingService.from(selectedAssignment))) {
					relationToDragged.PredecessorFk = activityOfDragged.CompositeId;
					relationToDragged.SuccessorFk = activityOfSelected.CompositeId;
				}

				relationToDragged.RelationKindFk = 1; // Finish-Start

				if (mappingService.from(draggedAssignment).isSame(mappingService.from(selectedAssignment))) { // is start date the same?
					relationToDragged.PredecessorFk = activityOfDragged.CompositeId;
					relationToDragged.SuccessorFk = activityOfSelected.CompositeId;

					relationToDragged.RelationKindFk = 4; // Start-Start
				}

				if (mappingService.to(draggedAssignment).isSame(mappingService.to(selectedAssignment))) { // is end date the same?
					relationToDragged.PredecessorFk = activityOfSelected.CompositeId;
					relationToDragged.SuccessorFk = activityOfDragged.CompositeId;

					relationToDragged.RelationKindFk = 2; // Finish-Finish
				}

				relationToDragged.PropagateShiftForRelated = true;

				relationToAdds.push(relationToDragged);
			});

			return relationToAdds;
		}

		return service;
	}
})(angular);
