/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

// Related ALM Task: 133369

// This file will be not included while bundling. To run the tests, you need to patch your local gulpfile.js
// (located angular.debug|release folder). Add following pattern to the listOfFolders array in srcListBuilder function:
// '%pre%*.*/tests-unit/**/*.js'
//
// !!! This environment is used temporary. All tests will be migrated to jest test environment once it is available. !!!

//
// TODO:
//  - extract common parts from test service => later reuse
//  - ...
(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);
	salesBidModule.factory('salesBidValidationServiceTest', [
		'_',
		'$injector',
		'$translate',
		'salesBidValidationService',
		function (_, $injector, $translate, salesBidValidationService) {
			function it(expectation, fn) {
				console.log('%cit ' + expectation, 'font-weight:bold');
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

			function getBid() {
				var bidEntity = {OrdPrbltyPercent: null, OrdPrbltyWhoupd: null, OrdPrbltyLastvalDate: null, OrdPrbltyLastvalDateAndWhoupd: null};
				return bidEntity;
			}

			var service = {
				runAllTests: function () {
					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.valueInRange()
					 * @description provides validation methods for bid header entities and checking for value should be in range(1-100)
					 * not negative
					 * @Return pass if value is between 1 - 100.
					 */
					it('should return pass if value is in Range', function valueInRange() {
						var bidEntity = getBid();
						var res = salesBidValidationService.validateOrdPrbltyPercent(bidEntity, 55, 'OrdPrbltyPercent');
						var errorMsg = 'Contract Probability (in %) should be in 1-100';
						assert(res, true, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.valueNotInRange
					 * @description provides validation methods for bid header entities and checking for value should be in range(1-100)
					 *  not negative
					 * @Return pass if value less than 1 or greater than 100.
					 */
					it('should return pass if value is not in Range', function valueNotInRange() {
						var bidEntity = getBid();
						var res = salesBidValidationService.validateOrdPrbltyPercent(bidEntity, 0, 'OrdPrbltyPercent');
						var errorMsg = 'Contract Probability (in %) should be in 1-100';
						assert(_.get(res, 'valid'), false, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.valueNegative
					 * @description provides validation methods for bid header entities and checking for value should be in range(1-100)
					 *  not negative
					 * @Return pass if value is negative.
					 */
					it('should return pass if value is negative', function valueNegative() {
						var bidEntity = getBid();
						var res = salesBidValidationService.validateOrdPrbltyPercent(bidEntity, -1, 'OrdPrbltyPercent');
						var errorMsg = 'Contract Probability (in %) should be in 1-100';
						assert(_.get(res, 'valid'), false, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.overValue
					 * @description provides validation methods for bid header entities and checking for value should be in range(1-100)
					 *  not negative
					 * @Return pass if value is more than 100.
					 */
					it('should return pass if value is greater than 100', function overValue() {
						var bidEntity = getBid();
						var res = salesBidValidationService.validateOrdPrbltyPercent(bidEntity, 101, 'OrdPrbltyPercent');
						var errorMsg = 'Contract Probability (in %) should be in 1-100';
						assert(_.get(res, 'valid'), false, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.emptyValue
					 * @description provides validation methods for bid header entities and checking for value should be in range(1-100)
					 *  not negative
					 * @Return pass if value is null | empty string.
					 */
					it('should return pass if value is null or empty', function emptyValue() {
						var bidEntity = getBid();
						var res = salesBidValidationService.validateOrdPrbltyPercent(bidEntity, '', 'OrdPrbltyPercent');
						var errorMsg = 'Contract Probability (in %) should be in 1-100';
						assert(res, true, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.checkDate
					 * @description once the user enters the contract probability percentage and hover somewhere else then the date should be in (dd-mm-yyyy) format in last Valuation field.
					 * @Return pass if date is in (dd-mm-yyyy) format..
					 */
					it('should return pass if Last Valuation date is correct', function checkDate() {
						var bidEntity = getBid();
						var currentDate = $injector.get('moment')().format('L | LTS ');
						salesBidValidationService.validateOrdPrbltyPercent(bidEntity, '', 'OrdPrbltyPercent');
						bidEntity.OrdPrbltyLastvalDate = bidEntity.OrdPrbltyLastvalDate.format('L | LTS ');
						var errorMsg = 'The last valuation date should be current date with local time';
						assert(bidEntity.OrdPrbltyLastvalDate, currentDate, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.checkUser
					 * @description once the user enters the contract probability percentage and hover somewhere else then the username should be displayed along with the date in the Last Valuation field.
					 * @Return pass if username is displayed in the Last Valuation field.
					 */
					it('should return pass if current user id is logged in user id', function checkUser() {
						var bidEntity = getBid();
						var currentUserId = $injector.get('platformUserInfoService').getCurrentUserInfo().UserId;
						salesBidValidationService.validateOrdPrbltyPercent(bidEntity, '', 'OrdPrbltyPercent');
						bidEntity.OrdPrbltyLastvalDate = bidEntity.OrdPrbltyLastvalDate.format('L | LTS ');
						var errorMsg = 'Current user is not logged in user';
						assert(bidEntity.OrdPrbltyWhoupd, currentUserId, errorMsg);
					});

					/**
					 * @ngdoc service
					 * @name salesBidValidationServiceTest.checkErrorMessage
					 * @description add some case for checking the error message.
					 *  => error message should be shown like "The Contract probability (in %) should be in 1-100".
					 *  => error message is showing like "The ordprbltypercent should be in 1-100"
					 * @Return pass if username is displayed in the Last Valuation field.
					 */
					it('Should return pass if validation message is correct', function checkErrorMessage() {
						var bidEntity = getBid();
						var res = salesBidValidationService.validateOrdPrbltyPercent(bidEntity, -1, 'OrdPrbltyPercent');
						var validationMessage = $translate.instant('cloud.common.amongValueErrorMessage', {'object': res.error$tr$param$['object'], 'rang': res.error$tr$param$['rang']});
						var actualMessage = $translate.instant('cloud.common.amongValueErrorMessage', {'object': 'Contract Probability (in %)', 'rang': '1-100'});
						var errorMsg = 'This should be display the validation message like "' + actualMessage + '" but currently showing the wrong message "' + validationMessage + '"';
						assert(validationMessage, actualMessage, errorMsg);
					});
				}
			};
			return service;
		}
	]);
})();
