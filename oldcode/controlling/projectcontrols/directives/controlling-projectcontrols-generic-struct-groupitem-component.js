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

	ControllingProjectcontrolsGroupedItemController.$inject = ['$element', '$scope', '$translate'];

	function ControllingProjectcontrolsGroupedItemController($element, $scope, $translate) {
		var ctrl = this;
		var _defaultColor = GRP_COLORS.shift();
		var _currentColor;
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
			if (ctrl.isGeneric) {
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

			if(colDef && colDef.id === 'Package'){
				ctrl.ddItems.items.push({
					'label': 'Show Package Description',
					'label$tr$': 'controlling.projectcontrols.showPackgeDesc',
					'type': 'checkbox',
					'value': 'showPackageDesc',
					'initialState': 0
				});

				ctrl.ddItems.items.push({
					'label': 'Show BusinessPartner Name',
					'label$tr$': 'controlling.projectcontrols.showBPName',
					'type': 'checkbox',
					'value': 'showBP',
					'initialState': 0
				});
			}
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
		'controller': ControllingProjectcontrolsGroupedItemController
	};

	ng.module('controlling.projectcontrols').component('controllingProjectcontrolsGenericGroupitem', groupItemConfig);

})(angular, jQuery);
