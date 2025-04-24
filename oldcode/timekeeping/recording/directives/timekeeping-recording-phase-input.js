/*
 * $Id: timekeeping-recording-phase-input.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('timekeeping.recording').directive('timekeepingRecordingPhaseInput', ['_',
		function (_) {
			return {
				restrict: 'A',
				scope: {
					phase: '<',
					phaseInstance: '<',
					currentLayout: '<'
				},
				templateUrl: globals.appBaseUrl + 'timekeeping.recording/partials/timekeeping-recording-phase-input-partial.html',
				link: function (scope) {
					function getEligibleTimeSymbols() {
						if (scope.phase.InputPhase2TimeSymbolEntities) {
							return _.compact(_.map(scope.phase.InputPhase2TimeSymbolEntities, function (m) {
								return scope.currentLayout.def.TimeSymbols.byId[m.TimeSymbolFk];
							}));
						} else {
							return scope.currentLayout.def.TimeSymbols;
						}
					}

					scope.notAttachedToPrevious = (function determineNotAttachedToPrevious () {
						if (scope.phase.InputPhaseChainModeFk === 3) {
							if (!_.isNumber(scope.phase.TimeSymbolChainedFk)) {
								return false;
							}
						}
						return true;
					})();

					switch (scope.phase.DurationModeFk) {
						case 1: // time required
							scope.showTime = true;
							scope.showDuration = false;
							break;
						case 2: // time allowed
							scope.showTime = false;
							scope.showDuration = true;
							break;
						case 3: // duration only
							scope.showTime = false;
							scope.showDuration = true;
							break;
					}

					scope.timeSymbol = (function generateTimeSymbolSettings () {
						switch (scope.phase.TimeSymbolUserInterfaceFk) {
							case 1: // list
								return {
									showList: true,
									options: {
										displayMember: 'Code',
										valueMember: 'Id',
										items: getEligibleTimeSymbols()
									},
									selectedId: null
								};
							case 2: // checkmark
								return {
									showCheck: true,
									eligible: getEligibleTimeSymbols(),
									groupName: 'phase-input-' + scope.phase.Id + '#' + scope.phaseInstance.index + '-ts'
								};
							case 3: // others
								return {
									showText: true,
									text: (function () {
										if (scope.phase.TimeSymbolFk && scope.phase.InputPhase2TimeSymbolEntities) {
											if (!_.find(scope.phase.InputPhase2TimeSymbolEntities, {TimeSymbolFk: scope.phase.TimeSymbolFk})) {
												return scope.currentLayout.def.TimeSymbols.byId[scope.phase.TimeSymbolFk];
											}
										}
									})()
								};
							case 4: // fixed
								return {
									showText: true,
									text: (function () {
										if (scope.phase.TimeSymbolFk) {
											var ts = scope.currentLayout.def.TimeSymbols.byId[scope.phase.TimeSymbolFk];
											if (ts) {
												return ts.Code;
											}
										}
									})()
								};
						}
					})();


					console.log(scope.phase);
					console.log(scope.phaseInstance);
					console.log(scope.currentLayout.def.TimeSymbols.byId);
				}
			};
		}]);
})(angular);
