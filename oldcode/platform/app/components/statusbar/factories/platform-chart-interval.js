/**
 * Created by sprotte on 08.11.2021
 */
/* global _, moment */
(function () {
	'use strict';
	angular.module('platform').factory('platformChartInterval', platformChartInterval);
	
	platformChartInterval.$inject = ['$injector'];

	/* selectedItem, setSelectedItem, 
		selectedItemChartIntervalFk, selectedItemChartIntervalStartDate, selectedItemChartIntervalEndDate */
	
	function platformChartInterval($injector, setSelectedItem, 
		selectedItemChartIntervalFk, selectedItemChartIntervalStartDate, selectedItemChartIntervalEndDate) {
		let initialized = false;
		var scope, containerScope;
		let factory = {};
		var selectedItem;

		function init(myscope, myselectedItem, mysetSelectedItem, myselectedItemChartIntervalFk, 
			myselectedItemChartIntervalStartDate, myselectedItemChartIntervalEndDate) {
			scope = myscope;
			selectedItem = myselectedItem;
			setSelectedItem = mysetSelectedItem;
			selectedItemChartIntervalFk = myselectedItemChartIntervalFk;
			selectedItemChartIntervalStartDate = myselectedItemChartIntervalStartDate;
			selectedItemChartIntervalEndDate = myselectedItemChartIntervalEndDate;
			containerScope = scope.$parent;
			initialized = true;
			return factory;
		}
		
		function buildFromToString() {
			if (selectedItemChartIntervalFk === 4 && moment.isMoment(selectedItem[selectedItemChartIntervalStartDate]) &&
				moment.isMoment(selectedItem[selectedItemChartIntervalEndDate])) {
				return selectedItem[selectedItemChartIntervalStartDate].format('L') + '–' + selectedItem[selectedItemChartIntervalEndDate].format('L');
			}
		}

		function extendStatusBar() {
			if (!initialized) throw new Error('need to call init first');
			let sb = scope.getUiAddOns().getStatusBar();
			function setChartInterval(input) {
				// jshint -W040 
				let self = this || input;
				scope.statusBarConfig[1].value = self.caption;
				scope.statusBarConfig[1].iconClass = self.iconClass;
				scope.statusBarConfig[2].visible = true;
				scope.statusBarConfig[2].value = '';
				selectedItem[selectedItemChartIntervalFk] = self.chartIntervalFk;
				setSelectedItem(selectedItem);
				sb.updateFields(scope.statusBarConfig);
				if (_.isFunction(containerScope.resetZoom)) {
					containerScope.resetZoom();
				}
			}

			if (!scope.statusBarConfig) {
				scope.statusBarConfig = [{
					id: 'chartIntervalLabel',
					type: 'text',
					value: 'Chart Interval:'
				},
				{
					id: 'chartIntervalDropdown',
					caption: 'Chart Interval',
					type: 'dropdown-btn',
					iconClass: 'status-icons ico-status58',
					value: 'Project start',
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 'project',
							type: 'item',
							disabled: false,
							caption: 'Project start', // tr 15210
							iconClass: 'status-icons ico-status58',
							chartIntervalFk: 1,
							fn: setChartInterval
						},
						{
							id: 'year',
							type: 'item',
							disabled: false,
							caption: 'Start of year', // tr15211
							iconClass: 'status-icons ico-status161',
							chartIntervalFk: 2,
							fn: setChartInterval
						},
						{
							id: 'quarter',
							type: 'item',
							disabled: false,
							caption: 'Start of quarter', // tr 15212
							iconClass: 'status-icons ico-status164',
							chartIntervalFk: 3,
							fn: setChartInterval
						}, {
							id: 'custom',
							type: 'item',
							disabled: false,
							caption: 'Custom date', // tr 15213
							iconClass: 'status-icons ico-status57',
							chartIntervalFk: 4,
							fn: function () {
								var dialogConfig;
								var formconfig = {
									fid: 'chartIntervalForm',
									version: '0.0.1',
									showGrouping: false,
									groups: [
										{
											gid: 'group1',
											attributes: []
										}
									],
									rows: [{
										gid: 'group1',
										rid: selectedItemChartIntervalStartDate,
										label: 'Chart Interval Start Date',
										label$tr$: 'ChartIntervalEndDate',
										type: 'date',
										model: selectedItemChartIntervalStartDate,
										visible: true,
										readonly: false,
										sortOrder: 1
									}, {
										gid: 'group1',
										rid: selectedItemChartIntervalEndDate,
										label: 'Chart Interval End Date',
										label$tr$: 'ChartIntervalEndDate',
										type: 'date',
										model: selectedItemChartIntervalEndDate,
										visible: true,
										readonly: false,
										sortOrder: 2
									},]
								};
								dialogConfig = {
									title: 'Start and end', // translate.instant('Start and end'),
									dataItem: selectedItem,
									position: '400px',
									formConfiguration: formconfig,
									handleOK: function () {
										var sb = scope.getUiAddOns().getStatusBar();
										scope.statusBarConfig[2].visible = true;
										scope.statusBarConfig[2].value = buildFromToString();
										setSelectedItem(selectedItem);
										sb.updateFields(scope.statusBarConfig);
										if (_.isFunction(containerScope.resetZoom)) {
											containerScope.resetZoom();
										}
									},
									handleCancel: function () {
										setSelectedItem(selectedItem);
										if (_.isFunction(containerScope.resetZoom)) {
											containerScope.resetZoom();
										}
									},
									scope: scope
								};
								setChartInterval(this);
								$injector.get('platformModalFormConfigService').showDialog(dialogConfig);
							}
						}
						]
					}
				},
				{
					id: 'customfromto',
					type: 'text',
					align: 'right',
					disabled: false,
					cssClass: '',
					toolTip: '',
					visible: true,
					ellipsis: true,
					value: ''
				}];
			}

			if (selectedItem) {
				switch (selectedItem[selectedItemChartIntervalFk]) {
					case 2:
						scope.statusBarConfig[1].value = scope.statusBarConfig[1].list.items[1].caption;
						scope.statusBarConfig[1].iconClass = scope.statusBarConfig[1].list.items[1].iconClass;
						break;
					case 3:
						scope.statusBarConfig[1].value = scope.statusBarConfig[1].list.items[2].caption;
						scope.statusBarConfig[1].iconClass = scope.statusBarConfig[1].list.items[2].iconClass;
						break;
					case 4:
						scope.statusBarConfig[1].value = scope.statusBarConfig[1].list.items[3].caption;
						scope.statusBarConfig[1].iconClass = scope.statusBarConfig[1].list.items[3].iconClass;
						break;
					default:
						scope.statusBarConfig[1].value = scope.statusBarConfig[1].list.items[0].caption;
						scope.statusBarConfig[1].iconClass = scope.statusBarConfig[1].list.items[0].iconClass;
				}
			}
			sb.setVisible(true);
			sb.addFields(scope.statusBarConfig);
		}

		factory.init = init;
		factory.extendStatusBar = extendStatusBar;
		return factory; 
	}
})();