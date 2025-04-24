(function (angular) {
	'use strict';
	let timekeepingModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeeping common service
	 * @function
	 *
	 * @description
	 * timekeepingRecordingRoundingDataService is the data service for all timekeeping rounding functions.
	 */
	timekeepingModule.factory('timekeepingRecordingRoundingDataService', ['platformDataServiceFactory', 'timekeepingCommonRoundingService', '_',
		function (platformDataServiceFactory, timekeepingCommonRoundingService, _) {

			let service = {};
			let roundingConfigDetailDefault = {Field: 'Duration', Id: 1, TksRoundingConfigFk: 1, ColumnId: 1, IsWithoutRounding: true,
				BasRoundToFk: 2, BasRoundingMethodFk: 1, RoundTo: 6, Sorting: 1, UiDisplayTo: 3 };

			let roundingConfigDetails = roundingConfigDetailDefault;

			service.setRoundingConfigDetailDefault = function setRoundingConfigDetailDefault(){
				roundingConfigDetails = roundingConfigDetailDefault;
			};
			/**
			 * @ngdoc function
			 * @name setRoundingConfigDetails
			 * @function
			 * @methodOf timekeepingRecordingRoundingDataService
			 * @description Set the currently loaded rounding config details
			 * @returns  {Array} with objects of rounding config details
			 */
			service.setRoundingConfigDetails = function setRoundingConfigDetails(newRoundingConfigDetails) {
				roundingConfigDetails = newRoundingConfigDetails;
			};

			/**
			 * @ngdoc function
			 * @name getRoundingConfigDetails
			 * @function
			 * @methodOf timekeepingRecordingRoundingDataService
			 * @description Return the currently loaded rounding config details
			 * @returns  {Array} with objects of rounding config details
			 */
			service.getRoundingConfigDetails = function getRoundingConfigDetails() {
				return roundingConfigDetails;
			};

			/**
			 * @ngdoc function
			 * @name roundValue
			 * @function
			 * @methodOf timekeepingRecordingRoundingDataService
			 * @description Return the currently loaded rounding config details
			 * @param {Number} value to be rounded
			 * @param {string} field of boq item telling which type of rounding config detail to use
			 * @returns  {number} rounded value
			 */
			service.roundValue = function roundValue(value, field, entity) {
				let roundedValue = value;

				if (_.isNil(value)) {
					return value;
				}
				if (entity && entity.RoundingConfigDetail){
					roundingConfigDetails = entity.RoundingConfigDetail;
				}

				roundedValue = timekeepingCommonRoundingService.doRoundingValue(field, value, service);

				return roundedValue;
			};


			// local helper to do rounding of initial, atomic values of boqItem
			service.roundInitialValues = function roundInitialValues(item) {
				timekeepingCommonRoundingService.roundInitialValues(item, service);
			};

			return service;
		}]);
})(angular);
