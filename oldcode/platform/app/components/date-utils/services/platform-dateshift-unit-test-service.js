((angular) => {
	'use strict';

	const moduleName = 'platform';
	angular.module(moduleName).service('platformDateshiftUnitTestService', PlatformDateshiftUnitTestService);
	PlatformDateshiftUnitTestService.$inject = ['platformDateshiftService', '_'];

	function PlatformDateshiftUnitTestService(platformDateshiftService, _) {
		let service = this;

		service.runTest = (testData, testNo) => {


			if (platformDateshiftService) {

				const calendarMap = new Map(Object.entries(testData.calendarDataObj).filter(x => x[0] !== 'default' ? x[0] = +x[0] : true));
				const originalData = _.cloneDeep(testData);
				const shiftResult = platformDateshiftService.shiftDate(testData.activities, testData.relations, testData.trigger, testData.config, calendarMap, testData.shiftOptions);

				const expectedResultMap = new Map(testData.expectedResult.map(expAct => [expAct.CompositeId, expAct]));
				let isResultAsExpected = true;
				let failedAct = [];
				expectedResultMap.forEach((expAct, id) => {
					let changedAct = shiftResult.activities.find(act => act.CompositeId === id);

					if (!changedAct) {
						isResultAsExpected = false;
					} else if (new Date(changedAct[testData.config.start]).getTime() !== new Date(expAct[testData.config.start]).getTime()
						|| new Date(changedAct[testData.config.end]).getTime() !== new Date(expAct[testData.config.end]).getTime()) {
						let changedClone = _.cloneDeep(changedAct);
						changedClone[testData.config.end] = new Date(changedAct[testData.config.end]).toISOString();
						changedClone[testData.config.start] = new Date(changedAct[testData.config.start]).toISOString();
						failedAct.push({ changedActivity: changedClone, expectedActivity: expAct });
						isResultAsExpected = false;
					}
				});

				shiftResult.activities.forEach(act => {
					act[testData.config.end] = new Date(act[testData.config.end]).toISOString();
					act[testData.config.start] = new Date(act[testData.config.start]).toISOString();
				});

				if (failedAct.length > 0) {
					isResultAsExpected = false;
				}

				const expResultString = failedAct.length === 0 && isResultAsExpected ? 'successfull' : 'failed';
				const resultString = shiftResult.messages.filter(msg => msg.type === 'error').length === 0 ? 'successfull' : 'failed';

				shiftResult.originalData = originalData;
				shiftResult.originalData.activities.forEach(act => {
					act[testData.config.end] = new Date(act[testData.config.end]).toISOString();
					act[testData.config.start] = new Date(act[testData.config.start]).toISOString();
				});

				shiftResult.unexpectedResults = [];
				if (!isResultAsExpected) {
					shiftResult.unexpectedResults = failedAct;
				}

				return {
					testNo: testNo,
					groupText: `Expected Result : ${expResultString.toUpperCase()}, Shift : ${resultString} - #### Dateshift test nr ${testNo} ${!!testData.ticketNo ? testData.ticketNo : ''} ####`,
					shiftResult: _.cloneDeep(shiftResult)
				};
			}

			return null;
		}
	}

})(angular);

/**
 * @description Function running type of unit tests on DS
 * @name runDateshiftTests
 * @see https://ribgroup.sharepoint.com/:x:/r/teams/PPS-AUT-DevelopmentInt/Fileshare%20Documents/DS%20Calendar%20Issue%20Brainstorming/DS%20cal%20mit%20georg.xlsx?d=wfc713d8512b1437899dbb52a6e9e2676&csf=1&web=1&e=xNVOzA
 * 	Link to the file containing all the test cases implemented in this service. Feel free to add more into the file and create test data for this new usecase!
 *
 * @param {Object} angular: angularJs framwork for instantiating of Uni Test service and Dateshift service
 *
 * @param {number} testCaseNo: Optional - Number representing the test case that should be executed. If not delivered ALL tests are going to be excecuted.
 * @param {Object} customTestData: Optional - Object with data for dateshift operation. The results will not be validated if correct with this option!
 * 											If not delivered, exsisting test data will be used and results are going to be tested for correct values.
 *
 * Optional params (otherwise will take the data from first test case)
 * @param customTestData.activities: List of activities to shift
 * @param customTestData.relations: List of reletions between activities
 * @param customTestData.trigger: Activitiy triggering the shift
 * @param customTestData.calendarDataObj: Object with calendars for activities
 * @param customTestData.config: Config for the activities
 * @param customTestData.shiftOptions: Shift options for the dateshift
 *
 * @returns {void}: Result of tests will be printed in the console of web browser
 */
runDateshiftTests = async function runDateshiftTests(angular, testCaseNo = null, customTestData = null) {
	const unitTestServ = angular.element(document.body).injector().get('platformDateshiftUnitTestService');
	const testDataMap = await getTestData();

	if (customTestData) {
		const customTestDataGenerated = generateTestData(customTestData);
		let result = unitTestServ.runTest(customTestDataGenerated, 'custom');
		if (result) {
			logResult(result);
		}
	} else {

		if (testCaseNo && testDataMap.has(testCaseNo)) {
			let result = unitTestServ.runTest(generateTestData(testDataMap.get(testCaseNo)), testCaseNo);
			if (result) {
				logResult(result);
			}
		} else {
			const logMap = new Map();
			testDataMap.forEach((testData, testCaseNo) => {
				let result = unitTestServ.runTest(generateTestData(testData), testCaseNo);
				if (result) {
					logMap.set(result.testNo, result);
				}
			});
			logMap.forEach(logResult)
		}
	}

	function logResult(result) {
		console.groupCollapsed(result.groupText);
		console.log(result.shiftResult);
		console.groupEnd();
	}

	function generateTestData(testDataObj) {
		const shiftOptions = {
			shiftVariant: "fullShift",
			fullShift: true
		};

		const config = {
			id: "CompositeId",
			start: "StartDate",
			end: "EndDate",
			nextEdgeKey: "SuccessorFk",
			prevEdgeKey: "PredecessorFk",
			relationKind: "RelationKindFk",
			relationType: "RelationTypeFk",
			isLocked: "IsLocked",
			IsLockedStart: "IsLockedStart",
			IsLockedFinish: "IsLockedFinish",
			IsLockedStartVirtual: "IsLockedStartVirtual",
			IsLockedFinishVirtual: "IsLockedFinishVirtual",
			calendar: "CalendarId",
			propagateShiftForRelated: "PropagateShiftForRelated",
			mode: "both"
		};

		const activityDefaultObj = {
			EntityName: "Event",
			Id: 1,
			StartDate: new Date().toISOString(),
			EndDate: new Date().toISOString(),
			CompositeId: "1",
			EventCode: null,
			SequenceOrder: null,
			EventTypeFk: null,
			HeaderFk: null,
			ItemFk: null,
			PsdActivityFk: null,
			ProductFk: null,
			ProductDescriptionFk: null,
			OrdHeaderFk: null,
			ProductionSetFk: null,
			TrsProductBundleFk: null,
			TrsPackageFk: null,
			CalCalendarFk: 1,
			CalendarId: 1,
			PlannedStart: null,
			PlannedFinish: null,
			EarliestStart: null,
			LatestStart: null,
			EarliestFinish: null,
			LatestFinish: null,
			PrjLocationFk: null,
			MdcControllingunitFk: null,
			LgmJobFk: null,
			Version: null,
			ActualStart: null,
			ActualFinish: null,
			Quantity: null,
			BasUomFk: null,
			PpsEventFk: null,
			IsLeaf: null,
			Userflag1: null,
			Userflag2: null,
			IsLive: null,
			DateshiftMode: null,
			Updated: null,
			Inserted: null,
			IsLocked: false
		};

		const calendarDefaultObj = {
			Id: 1,
			ExceptionDays: [],
			NonExceptionDays: [],
			WeekendDays: [],
			WeekendDaysIso: []
		};

		const relationDefaultObj = {
			Id: 0,
			CompositePredecessorFk: null,
			CompositeSuccessorFk: null,
			PredecessorFk: "1",
			SuccessorFk: "2",
			RelationKindFk: 1,
			RelationTypeFk: 0,
			MinTime: 0,
			CalendarId: 1
		};

		const testData = {
			activities: [],
			relations: [],
			calendarDataObj: {},
			expectedResult: [],
			trigger: {},
			config: config,
			shiftOptions: shiftOptions
		}

		testDataObj.activities.forEach(activity => {
			let tempAct = _.cloneDeep(activityDefaultObj);
			if (activity.Id && activity.StartDate && activity.EndDate && activity.CalendarId) {
				tempAct.Id = activity.Id;
				tempAct.CompositeId = '' + activity.Id;
				tempAct.StartDate = activity.StartDate + '.000Z';
				tempAct.EndDate = activity.EndDate + '.000Z';
				tempAct.CalendarId = activity.CalendarId;
				tempAct.CalCalendarFk = activity.CalendarId;
				tempAct.IsLocked = !!activity.IsLocked;
			}

			testData.activities.push(tempAct);
		});

		testDataObj.calendarDataObj.forEach(calendar => {
			let tempCal = _.cloneDeep(calendarDefaultObj);

			if (calendar.Id) {
				tempCal.Id = calendar.Id;

				if (calendar.ExceptionDays) {
					tempCal.ExceptionDays = calendar.ExceptionDays;
				}

				if (calendar.NonExceptionDays) {
					tempCal.NonExceptionDays = calendar.NonExceptionDays;
				}

				if (calendar.WeekendDays) {
					tempCal.WeekendDays = calendar.WeekendDays;
					tempCal.WeekendDaysIso = calendar.WeekendDays.map(day => day - 1);
				}

				testData.calendarDataObj['' + tempCal.Id] = tempCal;

				if (calendar.isDefault) {
					let defaultCal = _.cloneDeep(tempCal);
					testData.calendarDataObj['default'] = defaultCal;
				}
			}
		});

		testDataObj.relations.forEach(relation => {
			let tempRel = _.cloneDeep(relationDefaultObj);

			if (relation.PredecessorFk && relation.SuccessorFk) {
				tempRel.PredecessorFk = '' + relation.PredecessorFk;
				tempRel.SuccessorFk = '' + relation.SuccessorFk;

				if (!_.isNil(relation.RelationKindFk)) {
					tempRel.RelationKindFk = relation.RelationKindFk;
				}

				if (!_.isNil(relation.MinTime)) {
					tempRel.MinTime = relation.MinTime;
				}

				if (!_.isNil(relation.RelationTypeFk)) {
					tempRel.RelationTypeFk = relation.RelationTypeFk;
				}

				if (!_.isNil(relation.CalendarId)) {
					tempRel.CalendarId = relation.CalendarId;
				}

				if (!_.isNil(relation.PropagateShiftForRelated)) {
					tempRel.PropagateShiftForRelated = relation.PropagateShiftForRelated;
				}

				testData.relations.push(tempRel);
			}
		});

		testDataObj.expectedResult.forEach(expAct => {
			let tempExp = _.cloneDeep(activityDefaultObj);

			if (expAct.Id && expAct.StartDate && expAct.EndDate) {
				tempExp.Id = expAct.Id;
				tempExp.CompositeId = '' + expAct.Id;
				tempExp.StartDate = expAct.StartDate + '.000Z';
				tempExp.EndDate = expAct.EndDate + '.000Z';
			}

			testData.expectedResult.push(tempExp);
		})

		if (testDataObj.trigger) {
			let tempTrigger = _.cloneDeep(activityDefaultObj);

			if (testDataObj.trigger.Id && testDataObj.trigger.StartDate && testDataObj.trigger.EndDate) {
				tempTrigger.Id = testDataObj.trigger.Id;
				tempTrigger.CompositeId = '' + testDataObj.trigger.Id;
				tempTrigger.StartDate = testDataObj.trigger.StartDate + '.000Z';
				tempTrigger.EndDate = testDataObj.trigger.EndDate + '.000Z';

				let findActOfTrigger = testData.activities.find(act => act.Id === tempTrigger.Id);
				tempTrigger.CalendarId = findActOfTrigger.CalendarId;
				tempTrigger.CalCalendarFk = findActOfTrigger.CalendarId;
				tempTrigger.IsLocked = !!findActOfTrigger.IsLocked;

				testData.trigger = tempTrigger;
			}
		}

		if (testDataObj.mode) {
			testData.config.mode = testDataObj.mode;
		}

		if (testDataObj.shiftVariant) {
			testData.shiftOptions.shiftVariant = testDataObj.shiftVariant;
			testData.shiftOptions.fullShift = testData.shiftOptions.shiftVariant === 'fullshift';
		}

		if (!_.isUndefined(testDataObj.fullshift)) {
			testData.shiftOptions.fullShift = !!testDataObj.fullshift;
		}

		if (!!testDataObj.ticketNo) {
			testData.ticketNo = testDataObj.ticketNo;
		}

		return testData;
	}

	async function getTestData() {
		const testDataMap = new Map();

		const testData = await fetchDataFromJSON();
		testData.forEach((testCase, index) => {
			testDataMap.set(index + 1, testCase);
		});

		return testDataMap;
	};
}

function fetchDataFromJSON() {
	return fetch(globals.clientUrl + 'app/components/date-utils/services/dsTestData.json')
		.then((res) => {
			if (!res.ok) {
				throw new Error
					(`HTTP error! Status: ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			return data;
		})
		.catch((error) =>
			console.error("Unable to fetch data:", error));
}