(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);
	controllingStructureModule.factory('controllingStructureValidationServiceTest', [
		'_',
		'$injector',
		'$translate',
		'moment',
		'controllingStructureValidationService',
		function (_, $injector, $translate, moment, controllingStructureValidationService) {
			function it(expectation, fn) {
				console.log('%cit Expectations : ' + expectation, 'font-weight:bold');
				fn();
			}

			function assert(value, expected, errorMsg) {
				if (value === expected) {
					console.log('%c\tTest Case Passed', 'color:green');
				} else {
					if (errorMsg) {
						console.log('%c\t Test Failed : ' + errorMsg, 'color:red');
					} else {
						console.log('%c\tTest Case Failed: expected "' + JSON.stringify(expected) + '" but was "' + JSON.stringify(value) + '"', 'color:red');
					}
				}
			}

			function getControllingUnit() {
				var controllingUnitEntity = { PlannedStart: null, PlannedEnd: null, PlannedDuration: null /*ControllingunitFk: 1028167*/ };
				return controllingUnitEntity;
			}

			function getMultipleControllingUnit() {
				var controllingUnitEntity = [
					{ PlannedStart: moment('01-09-2022'), PlannedEnd: moment('10-09-2022'), PlannedDuration: null },
					{ PlannedStart: moment('29-08-2022'), PlannedEnd: moment('15-09-2022'), PlannedDuration: null }
				];
				return controllingUnitEntity;
			}

			var service = {
				runAllTests: function () {
					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.startDateValidate()
					 * @description provides validation methods for planned start date
					 * not negative
					 * @Return pass if planned start should be less than planned end date.
					 */
					it('Planend start date should be less than planned end date', function startDateValidate() {
						var controllingUnitEntity = getControllingUnit();
						var startDate = moment('01-09-22');
						controllingUnitEntity.PlannedEnd = moment('10-09-22');
						var res = controllingStructureValidationService.validatePlannedStart(controllingUnitEntity, startDate);
						var errorMsg = 'Planned start date i.e. ' + startDate.format('L') + ' must be before planned end date i.e. ' + controllingUnitEntity.PlannedEnd.format('L');
						assert(res, true, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.endDateValidate()
					 * @description provides validation methods for planned end date
					 * not negative
					 * @Return pass if planned end should be greater than planned start date.
					 */
					it('Planned end date should be greater than planned start date', function endDateValidate() {
						var controllingUnitEntity = getControllingUnit();
						var endDate = moment('10-09-22');
						controllingUnitEntity.PlannedStart = moment('01-09-22');
						var res = controllingStructureValidationService.validatePlannedEnd(controllingUnitEntity, endDate);
						var errorMsg = 'Planned end date i.e. ' + endDate.format('L') + ' must be before planned start date i.e. ' + controllingUnitEntity.PlannedStart.format('L');
						assert(res, true, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.durationValidate()
					 * @description provides validation methods for planned duration
					 * not negative
					 * @Return pass if planned duration is calculated according to planned start and end date.
					 */
					it('Planned duration should be calculated on the basis of Planned end and start date', function durationValidate() {
						var controllingUnitEntity = getControllingUnit();
						controllingUnitEntity.PlannedStart = moment('01-09-22');
						controllingUnitEntity.PlannedEnd = moment('10-09-22');
						var res = controllingStructureValidationService.validatePlannedEnd(controllingUnitEntity, controllingUnitEntity.PlannedEnd);
						var errorMsg = 'Planned duration should be non empty if planned start and planned end is provided';
						assert(res, true, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.negativeValidate()
					 * @description provides validation methods for planned duration (+ve or -ve)
					 * not negative
					 * @Return pass if planned duration is not negative
					 */
					it('Planned duration should be non negative', function negativeValidate() {
						var controllingUnitEntity = getControllingUnit();
						controllingUnitEntity.PlannedDuration = 20;
						var res = controllingStructureValidationService.validatePlannedDuration(controllingUnitEntity, controllingUnitEntity.PlannedDuration);
						var errorMsg = 'Planned duration should be non negative, Supplied duration is ' + controllingUnitEntity.PlannedDuration;
						assert(res, true, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.startDateAutoSelection()
					 * @description auto select planned start date if planned duration change
					 * not negative
					 * @Return pass if planned start date is autoselected if duration is change
					 */
					it('Planned start date should be auto fill if we change planned duration', function startDateAutoSelection() {
						var controllingUnitEntity = getControllingUnit();
						controllingUnitEntity.PlannedEnd = moment('09-15-2022');
						controllingUnitEntity.PlannedDuration = 20;
						controllingStructureValidationService.validatePlannedDuration(controllingUnitEntity, controllingUnitEntity.PlannedDuration).then(function () {
							console.log('planned start date', controllingUnitEntity.PlannedStart);
							var errorMsg = 'Planned start date should be auto fill if we change planned duration ';
							assert(controllingUnitEntity.PlannedStart, moment('08-18-2022'), errorMsg);
						});
					});

					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.startDateAutoSelection()
					 * @description auto select planned end date if planned duration change
					 * not negative
					 * @Return pass if planned end date is autoselected if duration is change
					 */
					it('Planned end date should be auto fill if we change planned duration', function startDateAutoSelection() {
						var controllingUnitEntity = getControllingUnit();
						controllingUnitEntity.PlannedStart = moment('09-01-2022');
						controllingUnitEntity.PlannedDuration = 20;
						var res = controllingStructureValidationService.validatePlannedDuration(controllingUnitEntity, controllingUnitEntity.PlannedDuration);
						console.log('planned end date', controllingUnitEntity.PlannedEnd);
						var errorMsg = 'Planned end date should be auto fill if we change planned duration ';
						assert(controllingUnitEntity.PlannedEnd, moment('09-28-2022'), errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name controllingStructureValidationServiceTest.checkParentNode()
					 * @description check parent node
					 * not negative
					 * @Return check parent node
					 */
					it('Check parent record is updating', function checkParentNode() {
						var controllingUnitEntity = getControllingUnit();
						var res = controllingStructureValidationService.validatePlannedDuration(controllingUnitEntity, controllingUnitEntity.PlannedDuration);
						var errorMsg = 'Parent record is not updating';
						var parent = _.find($injector.get('controllingStructureMainService').getList()); //, { Id: controllingUnitEntity.ControllingunitFk }) || null;
						console.log(parent);
						assert(res, true, errorMsg);
					});
				}
			};
			return service;
		}
	]);
})();