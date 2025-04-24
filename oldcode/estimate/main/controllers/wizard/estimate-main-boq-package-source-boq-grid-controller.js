
(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainBoqPackageSourceBoqGridController', ['$scope','$injector','platformGridAPI', 'platformTranslateService','estimateMainTriStateCheckboxService','basicsLookupdataLookupControllerFactory',
		'platformGridDomainService', 'platformModalService',
		'globals',
		'estimateMainCreatePackageWizardSelectionPageCommonService',
		function ($scope,$injector, platformGridAPI, platformTranslateService, estimateMainTriStateCheckboxService,basicsLookupdataLookupControllerFactory,
				  platformGridDomainService, platformModalService,
				  globals,
				  estimateMainCreatePackageWizardSelectionPageCommonService) {

			let gridId = '784CB9C7C5024B80BCBF2641C622B7A4';
			$scope.gridData = {
				state: gridId
			};
			$scope.gridId = gridId;
			$scope.titleLabel = $scope.entity.packageSourceType === 1 ? 'estimate.main.createBoqPackageWizard.selectProjectBoqTitle' : 'estimate.main.createBoqPackageWizard.selectWicBoQTitle';
			$scope.note2 = 'estimate.main.createBoqPackageWizard.boqSelectionPage.onlyPositionNote';

			let columns = [
				{
					id: 'ref',
					field: 'Reference',
					name: 'Reference',
					toolTip: 'Reference',
					formatter: 'description',
					name$tr$: 'boq.main.Reference',
					width:142
				},
				{
					id: 'brief',
					field: 'BriefInfo',
					name: 'Brief',
					toolTip: 'Brief',
					formatter: function (row, cell, value, columnDef, dataContext) {
						let result = '';
						if (value) {
							result = value.Translated || '';
						}
						if (!dataContext.BasBlobsSpecificationFk) {
							return result;
						}

						let navOptions = {
							field: columnDef.field,
							navigator: {
								moduleName: moduleName,
								navFunc: callbackFunc,
								toolTip$tr$: 'estimate.main.boqSpecification'
							}
						};

						let createOptions = {
							disabled: false,
							icon: 'ico-menu'
						};

						let navEntity = {};
						navEntity[columnDef.field] = true;

						let navBtnHtml = platformGridDomainService.getNavigator(navOptions, navEntity);
						// need css-class navigator-dynamic for the context-menu function. Without the css, hover-button is not shown in grid-cell.
						let navDom = $(navBtnHtml).removeClass('navigator-button').removeClass('tlb-icons').removeClass('ico-goto')
							.addClass('cell-navigator-btn').addClass('tlb-icons').addClass(createOptions.icon).addClass('navigator-dynamic');

						if (createOptions.disabled) {
							navDom.attr('disabled', createOptions.disabled);
						}

						return result + ' ' + $('<div></div>').append(navDom).html();

						function callbackFunc() {
							let modalOptions = {
								backdrop: false,
								height: '400px',
								templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/create-package-boq/create-package-boq-boq-spec-display-dialog.html',
								data: dataContext,
								resizeable: true
							};
							platformModalService.showDialog(modalOptions);
						}
					},
					name$tr$: 'boq.main.BriefInfo',
					width:200
				},
				{
					id: 'qty',
					field: 'Quantity',
					name: 'Quantity',
					toolTip: 'Quantity',
					formatter: 'number',
					name$tr$: 'cloud.common.entityQuantity',
					width:105
				},
				{
					id: 'commentClient',
					field: 'CommentClient',
					name: 'CommentClient',
					toolTip: 'CommentClient',
					formatter: 'remark',
					name$tr$: 'boq.main.CommentClient',
					width:200
				},
				{
					id: 'externalcode',
					field: 'ExternalCode',
					name: 'ExternalCode',
					toolTip: 'External Code',
					formatter: 'remark',
					name$tr$: 'boq.main.ExternalCode',
					width:200
				},
				{
					id: 'BasItemTypeFk',
					field: 'BasItemTypeFk',
					name: 'BasItemTypeFk',
					name$tr$: 'boq.main.BasItemTypeFk',
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.lookup.boqitemtype',
						lookupSimpleLookup: true,
						valueMember: 'Id'
					},
					width: 100
				},
				{
					id: 'basUomFk',
					field: 'BasUomFk',
					name: 'BasUomFk',
					toolTip: 'QuantityUoM',
					name$tr$: 'cloud.common.entityUoM',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					width:170
				},
				{
					id: 'mdccontrollingunitfk',
					field: 'MdcControllingUnitFk',
					name: 'Controlling Unit',
					name$tr$: 'estimate.main.mdcControllingUnitFk',
					toolTip: 'Controlling Unit',
					toolTip$tr$: 'estimate.main.mdcControllingUnitFk',
					type: 'directive',
					directive:  'basics-lookupdata-lookup-composite',
					editor: null,
					'options': {
						lookupDirective: 'controlling-structure-dialog-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'controllingunit',
						displayMember: 'Code'
					}
				},
				{
					id: 'MdcControllingUnitDes',
					field: 'MdcControllingUnitFk',
					name: 'Controlling unit des.',
					name$tr$: 'cloud.common.entityControllingUnitDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'controllingunit',
						displayMember: 'DescriptionInfo.Translated'
					},
					width: 150
				},
				{
					id: 'Userdefined1',
					field: 'Userdefined1',
					name: 'Userdefined1',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '1'},
					width: 100
				},
				{
					id: 'Userdefined2',
					field: 'Userdefined2',
					name: 'Userdefined2',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '2'},
					width: 100
				},
				{
					id: 'Userdefined3',
					field: 'Userdefined3',
					name: 'Userdefined3',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '3'},
					width: 100
				},
				{
					id: 'Userdefined4',
					field: 'Userdefined4',
					name: 'Userdefined4',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '4'},
					width: 100
				},
				{
					id: 'Userdefined5',
					field: 'Userdefined5',
					name: 'Userdefined5',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '5'},
					width: 100
				}];

			estimateMainCreatePackageWizardSelectionPageCommonService.init($scope, {
				gridId: gridId,
				parentProp: 'BoqItemFk',
				childProp: 'BoqItems',
				additionalCols: columns
			});

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			const gridConfig = $scope.getGridConfig();
			$scope.tools = null;
			if (platformGridAPI.grids.exist(gridId)) {
				$scope.unregisterHeaderCheckBoxChanged(gridId);
				platformGridAPI.grids.unregister(gridId);
			}
			basicsLookupdataLookupControllerFactory.create ({grid: true, dialog: true, search: false}, $scope, gridConfig);
			$scope.registerHeaderCheckBoxChanged(gridId);

			let toolItems = [];
			toolItems.push (
				{
					id: 't7',
					sort: 60,
					caption: 'cloud.common.toolbarCollapse',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: function collapseSelected() {
						platformGridAPI.rows.collapseNode ($scope.gridId);
					}
				},
				{
					id: 't8',
					sort: 70,
					caption: 'cloud.common.toolbarExpand',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand',
					fn: function expandSelected() {
						platformGridAPI.rows.expandNode ($scope.gridId);
					}
				},
				{
					id: 't9',
					sort: 80,
					caption: 'cloud.common.toolbarCollapseAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: function collapseAll() {
						platformGridAPI.rows.collapseAllSubNodes ($scope.gridId);
					}
				},
				{
					id: 't10',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						platformGridAPI.rows.expandAllSubNodes ($scope.gridId);
					}
				});

			$scope.tools.items = toolItems.concat ($scope.tools.items);
			$scope.tools.items = _.filter ($scope.tools.items, function (d) {
				return d.id !== 't12';
			});
		}
	]);
})();
