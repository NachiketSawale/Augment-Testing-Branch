/**
 * Created by ford on 3/9/2017.
 */
(function (ng, $) {
	'use strict';

	var GROUPED_ITEM_CNTR = 0;
	var GRP_COLORS = [
		'#9acafe', '#97d3ce',
		'#aaaddd', '#ffa7ad',
		'#f497c4', '#d6a2dc',
		'#aad9ae', '#e4eea3',
		'#fdf5c5', '#ffffff',
		'#caada6', '#bad8f1',
		'#bebdbd', '#afbec7',
		'#d3eef0'];

	PlatformGroupedItemController.$inject = ['$element', '$scope', '$translate'];

	function PlatformGroupedItemController($element, $scope, $translate) {
		var ctrl = this;
		var _defaultColor = GRP_COLORS.shift();
		var _currentColor;
		var __itemsDate__ = [
			{
				'label': $translate.instant('platform.groupedItems.groupingOptions'),
				'type': 'header',             // header,checkbox,radiobutton and button.
				'itemCss': '',
				'value': '',
				'initialState': ''
			},
			{
				'label': $translate.instant('platform.groupedItems.date'),
				'type': 'radio',               // header,checkbox,radiobutton and button.
				'itemCss': '',
				'value': 'date',
				'initialState': 'checked'
			},
			{
				'label': $translate.instant('platform.groupedItems.breakdown'),
				'type': 'radio',               // header,checkbox,radiobutton and button.
				'itemCss': '',
				'value': 'brkdwn',
				'initialState': '',
				'children': [
					{
						'label': $translate.instant('platform.groupedItems.year'),
						'type': 'checkbox',               // header,checkbox,radiobutton and button.
						'value': 'year',
						'initialState': '',
						'disabled': true
					},
					{
						'label': $translate.instant('platform.groupedItems.month'),
						'type': 'checkbox',               // header,checkbox,radiobutton and button.
						'value': 'month',
						'initialState': '',
						'disabled': true
					},
					{
						'label': $translate.instant('platform.groupedItems.calendarWeek'),
						'type': 'checkbox',               // header,checkbox,radiobutton and button.
						'value': 'calwk',
						'initialState': '',
						'disabled': true
					},
					{
						'label': $translate.instant('platform.groupedItems.weekday'),
						'type': 'checkbox',               // header,checkbox,radiobutton and button.
						'value': 'wkday',
						'initialState': '',
						'disabled': true
					},
					{
						'label': $translate.instant('platform.groupedItems.day'),
						'type': 'checkselect',               // header,checkbox,radiobutton and button.
						'value': 'day',
						'selected': 'day',
						'options': {
							'day': $translate.instant('platform.groupedItems.dayMonth'),
							'dayYear': $translate.instant('platform.groupedItems.dayYear')
						},
						'initialState': '',
						'disabled': true,
						'divider': true
					}
				]// Children
			}
		];
		var __selectToday__ = {
			'label': ($translate.instant('platform.groupedItems.today')) ? $translate.instant('platform.groupedItems.today') : '*Today',
			'type': 'checkbox',
			'value': 'selectToday',
			'initialState': 0
		};
		var __colorSelect__ = {
			'label': $translate.instant('platform.groupedItems.color'),
			'type': 'color',
			'value': 'grpColor',
			'initialState': '|' + _defaultColor
		};
		var __sortBy__ = {
			'label': $translate.instant('platform.groupedItems.sortDesc'),
			'type': 'checkbox',
			'value': 'sortDesc',
			'initialState': 0
		};
		var __strictTillSelect__ = {
			'label': 'Strict Till Level',
			'label$tr$': 'platform.groupedItems.strictTillLevel',
			'type': 'checkbox',
			'value': 'strictTillLevel',
			'initialState': 0
		};

		function setupPopupOptions(colDef) {
			if (colDef.formatter === 'date' || colDef.formatter === 'dateutc' || colDef.formatter === 'datetime' || colDef.formatter === 'datetimeutc' ||
				(colDef.formatter === 'history' && (colDef.id === 'insertedat' || colDef.id === 'updatedat'))) {
				ctrl.ddItems.items = __itemsDate__;
				if (GROUPED_ITEM_CNTR === 1) {
					ctrl.ddItems.items.push(__selectToday__);
				}
			} else if (colDef.domain === 'date' || colDef.domain === 'dateutc' || colDef.domain === 'datetime' || colDef.domain === 'datetimeutc') {
				ctrl.ddItems.items = __itemsDate__;
				if (GROUPED_ITEM_CNTR === 1) {
					ctrl.ddItems.items.push(__selectToday__);
				}
			} else if (ctrl.isGeneric) {
				const items = [
					{
						label: $translate.instant('platform.groupedItems.groupingOptions'),
						type: 'header',             // header,checkbox,radiobutton and button.
						itemCss: '',
						value: '',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.allLevels'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						itemCss: '',
						value: 'allLvls',
						initialState: 'checked',     // Children
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel1'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_1',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel2'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_2',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel3'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_3',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel4'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_4',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel5'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_5',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel6'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_6',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel7'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_7',
						initialState: '',
						divider: false
					},
					{
						label: $translate.instant('platform.groupedItems.tillLevel8'),
						type: 'radio',               // header,checkbox,radiobutton and button.
						value: 'till_8',
						initialState: '',
						divider: false
					}
				];

				ctrl.ddItems.items = items.slice(0, ctrl.maxLevels + 2);
				ctrl.ddItems.items[ctrl.maxLevels + 1].divider = true;
			}

			ctrl.ddItems.items.push(__strictTillSelect__);
			ctrl.ddItems.items.push(__sortBy__);
			ctrl.ddItems.items.push(__colorSelect__);
		}

		/*****************************************************************************************
		 *      Controller public properties
		 *****************************************************************************************/

		ctrl.ddItems = {
			items: [],
			showResultBtn: true
		};

		/*****************************************************************************************
		 *      Controller public methods
		 *****************************************************************************************/

		ctrl.onResult = function onResult(result) {
			if (result.value === 'OK') {
				ctrl.onStateChange({'cid': ctrl.colinfo.id, 'state': result.state});
				if (result.state.grpColor.state === 'checked') {
					$element.find('.color-field').show();
					$element.find('.color-field').css('background-color', result.state.grpColor.color);
				} else {
					$element.find('.color-field').hide();
				}
				GRP_COLORS.push(_defaultColor);
			}
		};

		ctrl.remove = function remove(e) {
			GROUPED_ITEM_CNTR--;
			$(e.target).unbind('click');
			ctrl.onClose({'cid': ctrl.colinfo.id});
			delete ctrl.colinfo.state;
			$element.remove();
			GRP_COLORS.push(_defaultColor);
		};

		/*****************************************************************************************
		 *      Lifecycle hooks
		 *****************************************************************************************/

		ctrl.$onInit = function onInit() {
			GROUPED_ITEM_CNTR++;
			setupPopupOptions(ctrl.colinfo);
			if (ctrl.colinfo.state && !_.isEmpty(ctrl.colinfo.state)) {
				ctrl.ddItems.state = ctrl.colinfo.state;
				_currentColor = ctrl.ddItems.state.grpColor.color;
				if (ctrl.ddItems.state.grpColor.state !== 'checked') {
					$element.find('.color-field').hide();
				}
			} else {
				_currentColor = angular.copy(_defaultColor);
				$element.find('.color-field').hide();
			}
		};

		ctrl.$postLink = function () {
			$element.find('.color-field').css('background-color', _currentColor);
		};

		ctrl.$onDestroy = function () {
			GROUPED_ITEM_CNTR = 0;
			GRP_COLORS.push(_defaultColor);
		};
	}

	var groupItemConfig = {
		bindings: {
			isGeneric: '<',
			maxLevels: '<',
			colinfo: '<',
			onStateChange: '&',
			onClose: '&'
		},
		'template': ['$templateCache', function ($templateCache) {
			return $templateCache.get('platform/generic-struct-groupitem.html');
		}],
		'controller': PlatformGroupedItemController
	};

	ng.module('platform').component('platformGenericGroupitem', groupItemConfig);

})(angular, jQuery);
