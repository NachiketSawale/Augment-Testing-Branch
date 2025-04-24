/* global globals, _ */
/**
 * Created by sprotte on 27.02.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainTemplatesDialogController', ['$scope', '$injector', '$timeout', 'schedulingMainChartSettingsService', '$sce', '$translate', '$modalInstance', 'schedulingMainGANTTService', 'platformGridAPI', function Controller($scope, $injector, $timeout, settingsservice, $sce, t, $modalInstance, gs, platformGridAPI) {
	'use strict';
	var icons, selectedtemplate, selectedgriditem, stateWithoutTemplate, externalsetswitch;
	$scope.modalOptions = {
		headerText: t.instant('scheduling.main.chart-settings.headerTemplates'),
		actionButtonText: t.instant('cloud.common.ok'),
		ok: OK,
		closeButtonText: t.instant('cloud.common.cancel'),
		cancel: cancel,
		tabTemplate: t.instant('scheduling.main.chart-settings.tab-Templates'),
		width: '700px'
	};

	setupTabs();
	setupDropdowns();
	setupMatrix();
	setupDeleteButton();
	$timeout(function () { // dimi-select-methods are not ready at the beginning. therefore timeout.
		selectTemplate();
	}, 0);

	function templatemap() {
		return settingsservice.getTemplatemap(gs.lastContainerID);
	}

	function setupTabs() {
		$scope.tabs = [
			{
				title: $scope.modalOptions.tabTemplate,
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-template.html',
				gridid: '7FB5C2C9D0794DEEA037ACF35E193956', // Please do not copy and paste this UUID
				reloadTab: true
			}
		];
	}

	function OK() {
		settingsservice.saveTemplates().then(function () {
			gs.load(gs.lastContainerID); // we only load if we changed more than just settings.
			gs.update();
		});
		$modalInstance.close({ok: true});
	}

	function cancel() {
		// gs.lastContainerID = null;
		$modalInstance.close({cancel: true});
	}

	function lookupTemplate(template) {
		var barkey;
		externalsetswitch = true;
		barkey = [template.up, template.down];
		$scope.selections.bar = getItemForModel($scope.barOpt.items, barkey).id;
		$scope.selections.color = getItemForModel($scope.colorOpt.items, template.fill).id;
		$scope.selections.iconstart = getItemForModel($scope.iconstartOpt.items, template.iconstart).id;
		$scope.selections.iconend = getItemForModel($scope.iconendOpt.items, template.iconend).id;
		$timeout(function () {
			externalsetswitch = false;
		}, 500);
	}

	function getItemForModel(items, parameter) {
		return _.find(items, {'name': parameter}) || {id: -1, name: ''};
	}

	/* Workflow
	 *  Change Activity Type --> change property collection, change selected Property
	 *  (Special case milestone --> remove collections for bar, iconstart or make those readonly)
	 *
	 *  Change Selected Property --> change selected bar, iconstart, iconend, color
	 *
	 * */

	function setupMatrix() {
		let templategrid;
		let columns;
		let activitystatus = settingsservice.activitystates
			.map(function (state) {
				return {id: state.Id, sym: state.Description, isLive: state.isLive};
			})
			.filter(function (state) {
				return state.isLive === true;
			});
		var activitytypes = [
			{child: [], parent: null, Id: 1, sym: t.instant('scheduling.main.barInformation.activity'), tmpl: 1},
			{child: [], parent: null, Id: 2, sym: t.instant('scheduling.main.barInformation.summary'), tmpl: 2},
			{child: [], parent: null, Id: 3, sym: t.instant('scheduling.main.barInformation.milestone'), tmpl: 3},
			{child: [], parent: null, Id: 4, sym: t.instant('scheduling.main.barInformation.subschedule'), tmpl: 4},
		];

		// COMBINE for GRID....
		$scope.templateGrid = {
			state: $scope.tabs[0].gridid
		};

		function hasSubtemplate(type, state) {
			return $scope.selections.template.templates.filter(function (el) {
				return el.state === state && el.type === type;
			}).length === 0;
		}

		// Check if grid existId
		templategrid = platformGridAPI.grids.element('id', $scope.tabs[0].gridid);

		columns = [
			{
				id: 100,
				domain: 'description',
				field: 'sym',
				name: t.instant('scheduling.main.chart-settings.activityTypeAndState'),
				width: 200
			},
			{
				id: 200,
				domain: 'action',
				field: 'xaction',
				formatter: 'action',
				editor: 'action',
				name: t.instant(''),
				width: 4
			}
		];
		// Do not initialize grid when grid instance exist
		if (!templategrid) {
			activitytypes.forEach(function (type) {
				type.HasChildren = activitystatus.length > 0;
				activitystatus.forEach(function (status) {
					type.child.push(_.merge({
						parent: type.Id,
						type: type.tmpl,
						child: [],
						state: status.id
					}, status, {Id: type.Id + '-' + status.id}, {
						xaction: {
							Action: 'xaction', actionList: [
								{
									callbackFn: deleteTemplate, icon: 'tlb-icons ico-delete', readonly: function () {
										return hasSubtemplate(type.Id, status.id);
									}, toolTip: type.Id + '-' + status.id
								}
							]
						}
					}));
				});
			});

			platformGridAPI.grids.config({
				data: activitytypes,
				columns: columns,
				id: $scope.tabs[0].gridid,
				options: {
					tree: true,
					parentProp: 'parent',
					childProp: 'child',
					showFooter: false,
					hierarchyEnabled: true,
					enableColumnReorder: false
				}
			});
		}
		platformGridAPI.events.register($scope.tabs[0].gridid, 'onSelectedRowsChanged', function () {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.tabs[0].gridid
			});

			if (angular.isDefined(selected)) {
				selectedgriditem = selected;
				selectTemplate();
			}
		});

		$scope.$on('$destroy', function cleanupHandlers() {
			// stop recycling of GRID
			platformGridAPI.grids.unregister($scope.tabs[0].gridid);
			platformGridAPI.events.unregister($scope.tabs[0].gridid, 'onRowCountChanged', highlightModifiedTemplates);
		});
		platformGridAPI.events.register($scope.tabs[0].gridid, 'onRowCountChanged', highlightModifiedTemplates);
	}

	function deleteTemplate(item) {
		var tlgroup = $scope.selections.template.templates;
		// find template and delete it
		_.remove(tlgroup, {type: item.type, state: item.state});
		$timeout(function () { // grid refresh without timeout results in grid error
			selectTemplate();
		}, 0);
	}

	function highlightModifiedTemplates() {
		// new template, just created
		if (!$scope.selections.template.templates) {
			return;
		}

		// 1. Find out which templates are changed
		var changedIds = [];
		var changedtmpls = $scope.selections.template.templates.filter(function (el) {
			return el.state;
		});
		_.forEach(changedtmpls, function (el) {
			changedIds.push(el.type + '');
		});
		_.uniq(changedIds);
		_.forEach(changedtmpls, function (el) {
			changedIds.push(el.type + '-' + el.state);
		});

		// 2. Find all rows with changed templates
		if (gridIsReady($scope.tabs[0].gridid)) {
			var localgrid = platformGridAPI.grids.element('id', $scope.tabs[0].gridid);
			var cssobject = {};
			_.forEach(changedIds, function (element) {
				var rowid = localgrid.instance.getData().getRowById(element);
				cssobject[rowid] = {100: 'font-italic'};
			});
			// 3. Add CSS classes for italic for all changed templates
			localgrid.instance.setCellCssStyles('changedTmpl', cssobject);
			platformGridAPI.grids.refresh($scope.tabs[0].gridid);
		}
	}

	function newActivityTypeTemplate() {
		var sg, tlgroup, newtemplate;
		if (externalsetswitch) {
			return;
		}

		sg = selectedgriditem;
		// check if selectedgriditem is not a root object
		if (sg.parent === null || sg.tmpl) {
			return;
		}

		if (stateWithoutTemplate) {
			tlgroup = $scope.selections.template.templates;

			// take stateless template (which must be the current template)
			newtemplate = {type: sg.type, state: sg.state, bartype: angular.copy(selectedtemplate)};


			// copy it and set state to current state
			tlgroup.push(newtemplate);

			// set select item to copy
			selectedtemplate = newtemplate.bartype;
			stateWithoutTemplate = false;
		}
	}

	function setupDropdowns() {
		$scope.selections = {};
		$scope.templatenameOpt = {
			items: settingsservice.templates,
			valueMember: 'id',
			displayMember: 'name',
			inputDomain: 'description',
			selected: settingsservice.templates[0]
		};
		$scope.selections.template = settingsservice.templates[0];
		$scope.templatenameChanged = selectTemplate;

		// BAR TYPE ICONSTART
		icons = [
			{name: undefined, text: '', id: -1},
			{name: 'triangle-up', text: t.instant('scheduling.main.chart-settings.triangle-up'), id: 1, res: 'control-icons ico-triangle-up'},
			{name: 'triangle-down', text: t.instant('scheduling.main.chart-settings.triangle-down'), id: 2, res: 'control-icons ico-triangle-down'},
			{name: 'circle', text: t.instant('scheduling.main.chart-settings.circle'), id: 3, res: 'control-icons ico-circle'},
			{name: 'diamond', text: t.instant('scheduling.main.chart-settings.diamond'), id: 4, res: 'control-icons ico-diamond'}
		];
		$scope.iconstartOpt = {
			items: icons,
			useLocalIcons: true,
			valueMember: 'name',
			displayMember: 'text'
		};

		// BAR TYPE ICONEND
		$scope.iconendOpt = {
			items: icons,
			useLocalIcons: true,
			valueMember: 'name',
			displayMember: 'text'
		};
		$scope.selections.iconendChanged = function selectedIconendChanged(id) {
			if (selectedtemplate === null) {
				return;
			}
			newActivityTypeTemplate();
			$scope.selections.iconend = id;
			var item = getItemForModel($scope.iconendOpt.items, _.find($scope.iconendOpt.items, {'id': id}).name);
			selectedtemplate.iconend = item.name;
		};

		$scope.selections.iconstartChanged = function selectedIconstartChanged(id) {
			if (selectedtemplate === null) {
				return;
			}
			newActivityTypeTemplate();
			$scope.selections.iconstart = id;
			var item = getItemForModel($scope.iconstartOpt.items, _.find($scope.iconstartOpt.items, {'id': id}).name);
			selectedtemplate.iconstart = item.name;
		};

		// BAR TYPE BAR
		$scope.barOpt = {
			items: [
				{name: [0, 0], id: 1, text: '0% - 0%', res: 'control-icons ico-linetype-0-0'},
				{name: [0.2, 0.8], id: 2, text: '20% - 80%', res: 'control-icons ico-linetype-20-80'},
				{name: [0.45, 0.55], id: 3, text: '45% - 55%', res: 'control-icons ico-linetype-45-55'},
				{name: [0.3, 0.5], id: 4, text: '30% - 50%', res: 'control-icons ico-linetype-30-50'},
				{name: [0, 0.9], id: 5, text: '0% - 90%', res: 'control-icons ico-linetype-0-90'},
				{name: [0, 0.2], id: 6, text: '0% - 20%', res: 'control-icons ico-linetype-0-20'},
				{name: [0.2, 0.4], id: 7, text: '20% - 40%', res: 'control-icons ico-linetype-20-40'},
				{name: [0.4, 0.6], id: 8, text: '40% - 60%', res: 'control-icons ico-linetype-40-60'},
				{name: [0.6, 0.8], id: 9, text: '60% - 80%', res: 'control-icons ico-linetype-60-80'},
				{name: [0.8, 1], id: 10, text: '80% - 100%', res: 'control-icons ico-linetype-80-100'},
				{name: [0, 1], id: 11, text: '0% - 100%', res: 'control-icons ico-linetype-0-100'}
			],
			useLocalIcons: true,
			valueMember: 'name',
			displayMember: 'text',
			inputDomain: 'description',
			popupCssClass: 'img-40-20'
		};
		$scope.selectedBarChanged = function selectedBarChanged(id) {
			if (selectedtemplate === null) {
				return;
			}
			newActivityTypeTemplate();
			var item = getItemForModel($scope.barOpt.items, _.find($scope.barOpt.items, {'id': id}).name);
			$scope.selections.bar = id; // ngModel does not work
			if (item.name.length === 2) {
				selectedtemplate.up = item.name[0];
				selectedtemplate.down = item.name[1];
			}
		};

		// Bar TYPE COLOR
		$scope.colorOpt = {
			items: [
				{name: '#BFDDF2', id: 1, text: t.instant('scheduling.main.colors.ico-color-blue-light'), res: 'control-icons ico-color-blue-light'},
				{name: '#7FB2D7', id: 2, text: t.instant('scheduling.main.colors.ico-color-blue-dark'), res: 'control-icons ico-color-blue-dark'},
				{name: '#E1BEE7', id: 3, text: t.instant('scheduling.main.colors.ico-color-purple-light'), res: 'control-icons ico-color-purple-light'},
				{name: '#BA68C8', id: 4, text: t.instant('scheduling.main.colors.ico-color-purple-dark'), res: 'control-icons ico-color-purple-dark'},
				{name: '#C5CAE9', id: 5, text: t.instant('scheduling.main.colors.ico-color-indigo-light'), res: 'control-icons ico-color-indigo-light'},
				{name: '#7986CB', id: 6, text: t.instant('scheduling.main.colors.ico-color-indigo-dark'), res: 'control-icons ico-color-indigo-dark'},
				{name: '#B2EBF2', id: 7, text: t.instant('scheduling.main.colors.ico-color-cyan-light'), res: 'control-icons ico-color-cyan-light'},
				{name: '#4DD0E1', id: 8, text: t.instant('scheduling.main.colors.ico-color-cyan-dark'), res: 'control-icons ico-color-cyan-dark'},
				{name: '#C8E6C9', id: 9, text: t.instant('scheduling.main.colors.ico-color-green-light'), res: 'control-icons ico-color-green-light'},
				{name: '#81C784', id: 10, text: t.instant('scheduling.main.colors.ico-color-green-dark'), res: 'control-icons ico-color-green-dark'},
				{name: '#FFE0B2', id: 11, text: t.instant('scheduling.main.colors.ico-color-orange-light'), res: 'control-icons ico-color-orange-light'},
				{name: '#FFB74D', id: 12, text: t.instant('scheduling.main.colors.ico-color-orange-dark'), res: 'control-icons ico-color-orange-dark'},
				{name: '#E0E0E0', id: 13, text: t.instant('scheduling.main.colors.ico-color-grey-light'), res: 'control-icons ico-color-grey-light'},
				{name: '#BDBDBD', id: 14, text: t.instant('scheduling.main.colors.ico-color-grey-dark'), res: 'control-icons ico-color-grey-dark'},
				{name: '#000000', id: 15, text: t.instant('scheduling.main.colors.ico-color-black'), res: 'control-icons ico-color-black'},
				{name: '#FF0000', id: 16, text: t.instant('scheduling.main.colors.ico-color-red'), res: 'control-icons ico-color-red'}
			],
			useLocalIcons: true,
			valueMember: 'name',
			displayMember: 'text',
			inputDomain: 'description',
			popupCssClass: 'img-40-20'
		};
		$scope.selectedColorChanged = function selectedColorChanged(id) {
			if (selectedtemplate === null) {
				return;
			}
			var item = getItemForModel($scope.colorOpt.items, _.find($scope.colorOpt.items, {'id': id}).name);
			newActivityTypeTemplate();
			$scope.selections.color = id;
			selectedtemplate.fill = item.name;
		};
	}

	function selectTemplate() {
		highlightModifiedTemplates();

		var tlgroup, match, newtemplate;
		var act = selectedgriditem;
		stateWithoutTemplate = false;

		newtemplate = $scope.selections.template;
		// Detect NEW template (we count no. of properties for that)
		if (newtemplate && Object.keys(newtemplate).length === 2) {
			createNewTemplateGroup(newtemplate);
		}

		if (!$scope.selections.template || !selectedgriditem) {
			selectedtemplate = null;
			return;
		}

		// first filter: templategroup
		tlgroup = $scope.selections.template.templates;

		if (act.parent === null && act.tmpl) // case 1: parent node
		{
			match = tlgroup.filter(function (tl1) {
				return tl1.type === act.tmpl && tl1.state === null;
			});
		}
		else { // case 2: child node
			// I search for my type and state.
			match = tlgroup.filter(function (tl1) {
				return tl1.type === act.type && tl1.state === act.state;
			});
			if (match.length === 0) { // If I do not find type and state I search just for type.
				match = tlgroup.filter(function (tl1) {
					return tl1.type === act.type && tl1.state === null;
				});
				if (match.length > 0) {
					stateWithoutTemplate = true;
				}
			}
		}

		if (match.length > 0) {
			selectedtemplate = match[0].bartype;
			lookupTemplate(selectedtemplate);
		}
	}

	function createNewTemplateGroup(tmpl) {
		var newtemplategroup = _.cloneDeep(settingsservice.templates[0]);

		// determine new ID
		var lastid = _.max(settingsservice.templates.map(function (item) {
			return item.id;
		}));
		newtemplategroup.id = lastid + 1;
		newtemplategroup.name = tmpl.name;
		newtemplategroup.userDefined = true;

		settingsservice.templates.push(newtemplategroup);
		$scope.selections.template = newtemplategroup;
	}

	function gridIsReady(gridid) {
		var localgrid;
		var result = false;
		if (platformGridAPI.grids.exist(gridid)) {
			localgrid = platformGridAPI.grids.element('id', gridid);
			if (localgrid.instance && localgrid.dataView) {
				result = true;
			}
		}

		return result;
	}

	function setupDeleteButton() {
		// Note: button 'goto' is actually without function, just gives the user a click-target so that
		// the inputselect control loses focus.
		$scope.templategroup = {
			delete: function deleteTemplategroup() {
				var i;
				var selectedgroup = $scope.selections.template;
				if (selectedgroup && selectedgroup.userDefined) {
					i = settingsservice.templates.indexOf(selectedgroup);
					if (i !== -1) {
						settingsservice.templates.splice(i, 1);
					}
					$scope.selections.template = settingsservice.templates[0];
				}
				// now change templatemap entries
				templatemap().forEach(function (tmplmap) {
					tmplmap.templatekey = 1;
				});
			},
			canDelete: function canDeleteTemplategroup() {
				if ($scope.selections.template) {
					return $scope.selections.template.userDefined;
				} else {
					return false;
				}
			}
		};
	}
}
]);