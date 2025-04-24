/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.simulation.directive:modelSimulationTimelineSelector
	 *
	 * @description A control for selecting one of the loaded simulation timelines.
	 */
	angular.module('model.simulation').directive('modelSimulationTimelineSelector',
		modelSimulationTimelineSelector);

	modelSimulationTimelineSelector.$inject = ['_', '$translate',
		'modelSimulationTimelineRequestService', 'modelSimulationTimelineLoadingService'];

	function modelSimulationTimelineSelector(_, $translate, modelSimulationTimelineRequestService, modelSimulationTimelineLoadingService) { // jshint ignore:line
		return {
			scope: {
				entity: '=',
				model: '=',
				timelineRequest: '=',
				showDefaultItem: '<',
				allowAdd: '<'
			},
			templateUrl: globals.appBaseUrl + 'model.simulation/partials/model-simulation-timeline-selector.html',
			compile: function () {
				return {
					pre: function (scope) {
						if (!scope.model) {
							scope.model = 0;
						}
						scope.selectOptions = {
							items: _.map(modelSimulationTimelineRequestService.createItemList(modelSimulationTimelineRequestService.isPinningContextSufficient()), function (item) {
								return {
									id: item.id,
									name: item.getDisplayName(),
									getTimelineRequest: item.getRequest
								};
							}),
							valueMember: 'id',
							displayMember: 'name'
						};
						if (scope.showDefaultItem) {
							scope.selectOptions.items.unshift({
								id: 0,
								name: $translate.instant('model.simulation.timelineSelectorDefault'),
								getTimelineRequest: function () {
									return null;
								}
							});
						}
						if (_.isNil(scope.allowAdd)) {
							scope.allowAdd = true;
						}
					},
					post: function (scope) {
						scope.loadTimeline = function () {
							modelSimulationTimelineLoadingService.loadTimeline().then(function (tl) {
								if (tl) {
									scope.$evalAsync(function () {
										scope.selectOptions.items.push({
											id: tl.id,
											name: tl.getDisplayName(),
											getTimelineRequest: tl.getRequest
										});
										scope.model = tl.id;
									});
								}
							});
						};

						scope.$watch('model', function (newValue) {
							if (_.isNil(newValue)) {
								scope.timelineRequest = null;
							} else {
								const selItem = _.find(scope.selectOptions.items, {id: newValue});
								scope.timelineRequest = selItem.getTimelineRequest();
							}
						});
					}
				};
			}
		};
	}
})(angular);
