(function () {

	'use strict';

	angular.module('platform').service('platformPlanningBoardSettingDefaultValuesService', platformPlanningBoardSettingDefaultValuesService);

	platformPlanningBoardSettingDefaultValuesService.$inject = [
		'$translate'];

	function platformPlanningBoardSettingDefaultValuesService($translate) {
		var self = this;
		self.getDefaultValues = function () {
			return {
				'planningBoard.chart.presentation.settings': {
					mainInfoLabel: 'Description',
					info1Label: 'InfoField1',
					info2Label: 'InfoField2',
					info3Label: 'InfoField3',
					showHeaderBackground: true,
					validateAssignments: true,
					showDemandPreview: false,
					useFlexibleRowHeight: false,
					rowHeight: 55,
					useTaggingSystem: true,
					showExtendedDemands: true,
					showSameAssignments: true,
					showMainText: true,
					showInfo1Text: true,
					showInfo2Text: true,
					showInfo3Text: true,
					showHeaderColor: true,
					snapToDays: false,
					backgroundColorConfig:  {
						value: 'default',
						id: 'defaultcolor',
						caption: $translate.instant('platform.planningboard.backgroundColorConfig.default')
					},
					showStatusIcon: true,
					showInTransportIcon: true,
					showTypeIcon: true,
					showAggregations: false,
					showSumAggregations: false,
					sumAggregationLine1: { value: 'empty', id: 'empty', caption: ' ' },
					sumAggregationLine2: { value: 'actualValue', id: 'actualValue', caption: $translate.instant('platform.planningboard.actualValue') },
					sumAggregationLine3: { value: 'empty', id: 'empty', caption: ' ' },
					sumAggregationPropertyLine1: { value: 'empty', id: 'empty', caption: ' ' },
					sumAggregationPropertyLine2: { value: 'empty', id: 'empty', caption: ' ' },
					sumAggregationPropertyLine3: { value: 'empty', id: 'empty', caption: ' ' },
					useMinAggregation: false,
					saveLastZoom: false,
					minAggregationLevel: {
						value: 1,
						type: 'hour',
						id: 'onehour',
						caption: $translate.instant('platform.planningboard.minAggregationLevel.hour')
					},
					selectedZoomLevel: {
						value: 1,
						type: 'month',
						id: 'onemonth',
						caption: $translate.instant('platform.planningboard.zoomOneMonth')
					},

					collectionConfig: {
						'background': 16777215, // '#FFFFFF'
						'font': 0, // '#000000'
						'border': 0 // '#000000'
					},

					useDemandTimesForReservation: false,
					aggregationTrafficLightsConfig: {
						'underload': 1552423, // '#17B027'
						'goodload': 14840846, // '#E2740E'
						'maxload': 14031900, // '#D61C1C'
						'overload': 7537154 // '#730202'
					},
					aggregationTrafficLightsValuesConfig: {
						'underload': 50, // 0-50
						'goodload': 90, // 51-90
						'maxload': 100, // 91-100
						'overload': 110 // 101-110
					},
					useFixedAssignmentHeight: false,
					tagConfig: [{
						id: 'project',
						name: $translate.instant('platform.planningboard.project'),
						color: '#FFFFFF',
						customColor: false,
						icon: false,
						visible: true,
						sort: 0
					}, {
						id: 'status',
						name: $translate.instant('platform.planningboard.status'),
						color: '#FFFFFF',
						customColor: false,
						icon: true,
						visible: true,
						sort: 1
					}, {
						id: 'type',
						name: $translate.instant('platform.planningboard.type'),
						color: '#786735',
						customColor: true,
						icon: true,
						visible: true,
						sort: 2
					}, {
						id: 'validation',
						name: $translate.instant('platform.planningboard.validation'),
						color: '#FFFFFF',
						customColor: false,
						icon: true,
						visible: true,
						sort: 3
					}],
				},
				'planningBoard.chart.gridSettings': {
					validateDemandAgainstSuppliers: false,
					filterDemands: false
				},
			};

		};
	}
})(angular);