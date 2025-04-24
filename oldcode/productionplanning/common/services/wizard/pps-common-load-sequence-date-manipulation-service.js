/**
 * Created by mik on 09/12/2021.
 */

/* global _ */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.common';

	angular.module(moduleName).service('productionplanningCommonLoadSequenceDateManipulationService', ProductionplanningCommonLoadSequenceDateManipulationService);

	ProductionplanningCommonLoadSequenceDateManipulationService.$inject = ['moment', 'productionplanningCommonLoadSequenceDataService'];

	function ProductionplanningCommonLoadSequenceDateManipulationService(moment, productionplanningCommonLoadSequenceDataService) {
		let service = this;

		service = {
			moveDays,
			getMaxAddTo,
			isAddAble,
		};

		// region public functions

		/**
		 * @name moveDays
		 * @type function
		 *
		 * @param from {Moment}
		 * @param to {Moment}
		 */
		function moveDays(from, to) {
			from = from.startOf('day');
			to = to.startOf('day');

			let sequence = productionplanningCommonLoadSequenceDataService.getLoadSequence();

			// get trigger day
			let skipList = sequence.filter((day) => {
				return day.PlannedStart.isSame(from) || day.PlannedStart.isAfter(from);
			});

			const finalOldDay = _.max(_.map(skipList, 'PlannedStart')).startOf('d');
			let currentNewDay = moment(to);
			let currentdOldDay = moment(from);

			let breakLoop = false;

			// shift all other days after to a new date
			// existing skip days must be evaluated
			while(!breakLoop){
				// always determine currentNewDay by skipping to next available day
				currentNewDay = productionplanningCommonLoadSequenceDataService.getNextFreeDay(currentNewDay);

				// for current old date, find day in skip list and set new day if available
				let skippedDay = _.find(skipList, (day) => {
					return moment(day.PlannedStart).startOf('d').isSame(currentdOldDay);
				});
				if (!_.isNil(skippedDay)) {
					let diff = currentNewDay.diff(currentdOldDay, 'd');

					// todo: ticket to correctly move day + loads!
					skippedDay.moveDayBy(diff, 'd');
					// ensure that the skippedDay is not found again!
					_.remove(skipList, skippedDay);
				}

				// if no skippedDay was found, determine if old day was exception day
				let originalDayException = _.isNil(skippedDay);
				if (originalDayException) {
					let alternativeOldDay = productionplanningCommonLoadSequenceDataService.getNextFreeDay(currentdOldDay);
					originalDayException = alternativeOldDay.isAfter(currentdOldDay);
				}

				// if old day was no excpetion day, progress new day by one
				if (!originalDayException) {
					currentNewDay.add(1, 'd');
				}

				// always progress orignal day by one!
				currentdOldDay.add(1, 'd');

				breakLoop = currentdOldDay.isAfter(finalOldDay);
			}

			productionplanningCommonLoadSequenceDataService.loadSequenceChanged();
		}

		function getMaxAddTo(day) {
			let sequence = productionplanningCommonLoadSequenceDataService.getLoadSequence();
			let dayIdx = getDayIdx(day);

			if (dayIdx !== 0 && sequence[dayIdx-1]) {
				const firstOccupiedDay = moment(sequence[dayIdx-1].PlannedStart).startOf('day');
				return productionplanningCommonLoadSequenceDataService.getNextFreeDay(firstOccupiedDay.add(1, 'day'));
			}

			return day.PlannedStart.startOf('day');
		}

		function isAddAble(day) {
			let isAddAble = false;
			let sequence = productionplanningCommonLoadSequenceDataService.getLoadSequence();

			let dayIdx = getDayIdx(day);

			if (dayIdx !== 0 && sequence[dayIdx-1]) {
				const previousDay = moment(sequence[dayIdx].PlannedStart).startOf('day').add(-1, 'd');
				const nextFreeDayInPast = productionplanningCommonLoadSequenceDataService.getNextFreeDay(previousDay, true);
				const previousOccupiedDay = moment(sequence[dayIdx-1].PlannedStart).startOf('day');
				const diff = nextFreeDayInPast.diff(previousOccupiedDay, 'd');
				isAddAble = diff >= 1;
			}

			return isAddAble;
		}

		// endregion

		// region private functions

		function getDayIdx(day) {
			return  productionplanningCommonLoadSequenceDataService.getLoadSequence().findIndex(sequenceDay => {
				return sequenceDay.Id === day.Id;
			});
		}
		// endregion

		return service;
	}
})(angular);
