(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');
	const boqRoute = 'boq/main/quantityinspector/';
	const salesModuleIds = ['boq.project','sales.bid','sales.contract','sales.wip','sales.billing'];
	const procuModuleIds = ['procurement.package','procurement.requisition','procurement.quote','procurement.contract','procurement.pes'];
	const moduleIds      = salesModuleIds.concat(procuModuleIds);

	angularModule.factory('boqMainQuantityInspectorService', ['$http', 'platformPermissionService', 'platformDialogService', 'cloudDesktopQuickstartSettingsService',
		function($http, platformPermissionService, platformDialogService, cloudDesktopQuickstartSettingsService) {
			var service = {};
			var hasWritePermission;

			service.start = function(boqMainService) {
				const accessGuid = '222caa409d21408f8516636b217fb494';
				platformPermissionService.loadPermissions([accessGuid]).then(function() {
					hasWritePermission = platformPermissionService.hasWrite(accessGuid);
				});

				var currentBoqHeaderId = boqMainService.getRootBoqItem().BoqHeaderFk;

				cloudDesktopQuickstartSettingsService.getSettings(false).then(function(result) {
					let moduleInfoItems = _.cloneDeep(result.desktopItems);
					_.find(moduleInfoItems, {'id':'project.main'}).id = 'boq.project';

					$http.get(globals.webApiBaseUrl + boqRoute + 'boqheadercontextitems' + '?currentBoqHeaderId='+currentBoqHeaderId).then(function(response) {
						var boqHeaderContextItems = [];
						_.forEach(moduleIds, function(moduleId) {
							var boqHeaderContextItemsPerModule = _.filter(response.data, {'ModuleId':moduleId});
							_.forEach(boqHeaderContextItemsPerModule, function(boqHeaderContextItem) {
								boqHeaderContextItem.Description = (boqHeaderContextItem.ContextIsReadOnly ? '*' : '') + boqHeaderContextItem.ContextCode + ' ' + boqHeaderContextItem.ContextDescription;
							});
							if (_.some(boqHeaderContextItemsPerModule)) {
								const moduleInfo = _.find(moduleInfoItems, {'id':moduleId});
								boqHeaderContextItems.push({
									Label:    moduleInfo.displayName || moduleId,
									ModuleId: moduleId,
									Value:    { valueMember:'BoqHeaderId', displayMember:'Description', items:boqHeaderContextItemsPerModule },
									Current:  _.find(boqHeaderContextItemsPerModule, {'BoqHeaderId':currentBoqHeaderId}) || boqHeaderContextItemsPerModule[0]
								});
							}
						});

						var filter = [];
						filter += '<div class="margin-top-ld">';
						for (var i=0; i < boqHeaderContextItems.length; i++) {
							const isReadonly = boqHeaderContextItems[i].Value.items.length===1 || boqHeaderContextItems[i].Current.BoqHeaderId===currentBoqHeaderId;
							const boqHeaderContextItem = 'dialog.modalOptions.boqHeaderContextItems['+i+']';
							filter += '<div class="margin-bottom-ld' + (i===boqHeaderContextItems.length-1 ? '">' : ' margin-right-ld_">');
							filter +=    '<div style="padding-bottom: 4px;">{{'+boqHeaderContextItem+'.Label}}</div>';
							filter +=    '<div>';
							filter +=       '<div data-domain-control data-domain="select" class="form-control" readonly="'+isReadonly+'" data-change="onSelectedOptionChanged()" data-options="'+boqHeaderContextItem+'.Value" data-model="'+boqHeaderContextItem+'.Current"></div>';
							filter +=    '</div>';
							filter += '</div>';
						}
						filter += '</div>';

						let bodyTemplate = `<div data-ng-controller="boqMainQuantityInspectorMainController">
						 <div data-platform-kendo-splitter-adjust class="flex-element filler border-none" option="{panes: [ { collapsible: true, size: '20%' },{ collapsible: true, size: '80%' }],orientation:'horizontal'}">
							<div id="ui-layout-east" class="flex-box flex-column">
								<div class="subview-container flex-element flex-box flex-column" style="padding: 10px;">
									<h4>Settings</h4>

						 		   ${filter}
								</div>
							</div>
							<div id="ui-layout-west" class="flex-box flex-column">
								<div class="subview-container flex-element flex-box flex-column fullheight" style="padding: 6px 10px;">
									<div class="flex-box flex-align-center">
										<h4 class="flex-element">BoQ Structure</h4>
										<div class="input-group-btn">
											<button class="btn block-image tlb-icons ico-settings" data-ng-click="layoutClickFn()" title="{{::'boq.main.QuantityInspector.Layout'|translate}}"></button>
										</div>
									</div>

									<div class="flex-box flex-column flex-element overflow-hidden margin-top-ld">
						            <platform-Grid data="gridData"></platform-Grid>
	                        </div>
								</div>
							</div>

						</div>
						</div>`;

						var modalOptions =
						{
							id: 'db0bd096e6b34888ab2766b03667ad5c',
							headerText$tr$: 'boq.main.QuantityInspector.Title',
							bodyTemplate: bodyTemplate,
							customButtons: [{id:'synchronize', caption$tr$:'boq.main.QuantityInspector.Synchronize'}],
							showOkButton: true,
							resizeable: true,
							minWidth: 600,
							width: 1000,
							height: 600,
							boqMainService: boqMainService,
							currentBoqHeaderId: currentBoqHeaderId,
							boqHeaderContextItems: boqHeaderContextItems,
							moduleInfoItems: moduleInfoItems,
							hasWritePermission: hasWritePermission
						};

						platformDialogService.showDialog(modalOptions);
					});
				});
			};

			return service;
		}
	]);

	angularModule.controller('boqMainQuantityInspectorMainController', ['$scope', '$http', '$timeout', '$translate', 'platformDialogService', 'platformGridAPI', 'cloudCommonGridService', 'boqMainImageProcessor',
		function($scope, $http, $timeout, $translate, platformDialogService, platformGridAPI, cloudCommonGridService, boqMainImageProcessor) {
			var boqHeaderContextDic;
			const boqMainService        = $scope.dialog.modalOptions.boqMainService;
			const moduleInfoItems       = $scope.dialog.modalOptions.moduleInfoItems;
			const currentBoqHeaderId    = $scope.dialog.modalOptions.currentBoqHeaderId;
			const boqHeaderContextItems = $scope.dialog.modalOptions.boqHeaderContextItems;
			const hasWritePermission    = $scope.dialog.modalOptions.hasWritePermission;
			var synchronizableQuantities = [];
			const allQuantityColumns = [
				{ field:'Quantity',                modules:['boq.project','sales.bid','sales.contract','sales.wip','sales.billing'] },
				{ field:'QuantityDetail',          modules:['boq.project','sales.bid','sales.contract','sales.wip','sales.billing'] },
				{ field:'QuantityAdj',             modules:['boq.project'] },
				{ field:'QuantityAdjDetail',       modules:['boq.project'] },
				{ field:'TotalQuantity',           modules:['sales.wip','sales.billing'] },
				{ field:'TotalQuantityAccepted',   modules:['sales.wip'] },
				{ field:'ExWipIsFinalQuantity',    modules:['sales.wip'] },
				{ field:'OrdQuantity',             modules:['sales.wip'] },
				{ field:'PercentageQuantity',      modules:['sales.wip','sales.billing'] },
				{ field:'CumulativePercentage',    modules:['sales.wip','sales.billing'] },
				{ field:'PrevQuantity',            modules:['sales.wip','sales.billing'] },
				{ field:'RemQuantity',             modules:['sales.wip','sales.billing'] },
				{ field:'ExSalesRejectedQuantity', modules:['sales.wip','sales.billing'] },
				{ field:'PrevRejectedQuantity',    modules:['sales.wip','sales.billing'] },
				{ field:'TotalRejectedQuantity',   modules:['sales.wip','sales.billing'] },
				{ field:'QuantityTarget',          modules:['sales.wip'] }
			];

			function updateGrid() {
				synchronizableQuantities = [];
				updateGridCore(false).then(function() { // for performannce reasons the slowly loaded transient fields (wip, bill) will be loaded delayed
					updateGridCore(true);
				});
			}

			function updateGridCore(inclTransientFields) {
				var correspondingBoqHeaderIds = [];
				_.forEach(boqHeaderContextItems, function(item) {
					if (item.Current.BoqHeaderId !== currentBoqHeaderId) {
						correspondingBoqHeaderIds.push(item.Current.BoqHeaderId);
					}
				});

				const params = '?currentBoqHeaderId='+currentBoqHeaderId + '&correspondingBoqHeaderIds='+JSON.stringify(correspondingBoqHeaderIds) + '&inclTransientFields='+inclTransientFields;
				return $http.get(globals.webApiBaseUrl + boqRoute + 'content' + params).then(function(response) {
					boqHeaderContextDic               = response.data.BoqHeaderContextDic;
					var quantityInspectorTree         = response.data.Tree;
					var quantityInspectorConfigLayout = JSON.parse(response.data.Layout || '[]');

					function addQuantityColumns(gridColumns) {
						_.forEach(_.filter(salesModuleIds, function(moduleId) { return boqHeaderContextDic[moduleId]; }), function(moduleId) {
							_.forEach(_.filter(allQuantityColumns, function(quantityColumn) { return quantityColumn.modules.includes(moduleId); }), function(quantityColumn) {
								const field = quantityColumn.field;
								const moduleInfo = _.find(moduleInfoItems, {'id':moduleId});
								const boqHeaderId = boqHeaderContextDic[moduleId].BoqHeaderId;
								var qiConfigColumn;
								var gridColumn = {
									'id':        moduleInfo.id+'.'+field,
									'field':     boqHeaderId  +'.'+field,
									'origin':    field,
									'name':      $translate.instant('boq.main.'+field)+' ['+(moduleInfo.displayName||moduleInfo.id)+']',
									'formatter': ['QuantityDetail','QuantityAdjDetail'].includes(field) ? 'description' : field==='ExWipIsFinalQuantity' ? 'boolean' : 'quantity',
								};
								gridColumns.push(gridColumn);

								qiConfigColumn = _.find(quantityInspectorConfigLayout, {'id':gridColumn.id});
								gridColumn.moduleId = moduleId;
								gridColumn.width    = qiConfigColumn ? qiConfigColumn.width : 150;
								gridColumn.visible  = qiConfigColumn ? qiConfigColumn.visible : true;
								gridColumn.hidden   = !gridColumn.visible || !boqHeaderContextDic[moduleId];

								if (boqHeaderContextDic[moduleId] && ['Quantity','QuantityAdj','TotalQuantity'].includes(quantityColumn.field) && !_.find(synchronizableQuantities, {'id':gridColumn.id})) {
									synchronizableQuantities.push({'id':gridColumn.id, 'name':gridColumn.name, 'origin':gridColumn.origin, 'moduleId':gridColumn.moduleId});
								}
							});
						});
					}

					// Prepares for the appearance in the UI and attaches additional transient properties
					var quantityInspectorFlatItems = [];
					cloudCommonGridService.flatten(quantityInspectorTree, quantityInspectorFlatItems, 'Children');
					_.forEach(quantityInspectorFlatItems, function(qiItem) {
						boqMainImageProcessor.processItem(qiItem);
						for (var quantityProperty in qiItem.QuantityDic) {
							qiItem[quantityProperty] = qiItem.QuantityDic[quantityProperty];

							var qiContextItem = qiItem[quantityProperty];
							if (_.has(qiContextItem, 'ExSalesRejectedQuantity')) { // is 'sales.wip' or 'sales.billing' ?
								qiContextItem.BoqLineTypeFk = qiItem.BoqLineTypeFk; // Needed for the calculation of transient properties
								qiContextItem.TotalQuantity = 0;
								boqMainService.calcTotalQuantity(        qiContextItem);
								boqMainService.calcTotalRejectedQuantity(qiContextItem);
								boqMainService.calcRemQuantity(          qiContextItem);
								boqMainService.calcPercentageQuantity(   qiContextItem);
								boqMainService.calcCumulativePercentage( qiContextItem);
							}
						}
						delete qiItem.QuantityDic;
					});

					let gridColumns = [
						{id:'Reference', field:'Reference', name:$translate.instant('boq.main.Reference'), width:100},
						{id:'Brief',     field:'Brief',     name:$translate.instant('boq.main.BriefInfo'), width:150},
					];
					addQuantityColumns(gridColumns);

					platformGridAPI.columns.configuration($scope.gridId, gridColumns);
					platformGridAPI.items.data(           $scope.gridId, quantityInspectorTree);
					$timeout(function() {
						platformGridAPI.grids.resize($scope.gridId);
					});
				});
			}

			$scope.gridId   = 'c202ed752f444949b78bffe451a7d477';
			$scope.gridData = {state: $scope.gridId};
			platformGridAPI.grids.config({'id':$scope.gridId, 'options':{tree:true, childProp:'Children'}, 'columns':[]});

			$scope.onSelectedOptionChanged = function() {
				updateGrid();
			};

			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({ok:true});
				boqMainService.refreshBoqData();
			};

			$scope.layoutClickFn = function() {
				let bodyTemplate = [];
				bodyTemplate += '<section class="modal-body">';
				bodyTemplate +=    '<div data-ng-controller="boqMainQuantityInspectorLayoutController">';
				bodyTemplate +=       '<div class="modal-wrapper" style="margin-top:10px">';
				bodyTemplate +=          '<div class="modal-wrapper grid-wrapper_ subview-container">';
				bodyTemplate +=             '<platform-Grid data="gridData"/>';
				bodyTemplate +=          '</div>';
				bodyTemplate +=       '</div>';
				bodyTemplate +=    '</div>';
				bodyTemplate += '</section>';

				var modalOptions =
				{
					headerText$tr$: 'boq.main.QuantityInspector.Layout',
					bodyTemplate: bodyTemplate,
					showOkButton:     true,
					showCancelButton: true,
					resizeable: true,
					quantityInspectorGridId: $scope.gridId,
					boqHeaderContextDic: boqHeaderContextDic
				};

				platformDialogService.showDialog(modalOptions);
			};

			var syncButton = $scope.dialog.getButtonById('synchronize');
			syncButton.disabled = function() {
				return !hasWritePermission;
			};
			syncButton.fn = function() {
				const selectedBoqItems = platformGridAPI.rows.selection({'gridId':$scope.gridId, 'wantsArray':true});
				if (!_.some(selectedBoqItems)) {
					platformDialogService.showInfoBox('boq.main.QuantityInspector.NoSelection');
					return;
				}

				var bodyTemplate = [];
				bodyTemplate += '<div data-ng-controller="boqMainQuantityInspectorSynchronizeController">';
				bodyTemplate +=    '<div class="platform-form-group">';
				bodyTemplate +=       '<div class="platform-form-row">';
				_.forEach(['Source','Target'], function(group) {
					var radioItemCount = 0;
					bodyTemplate +=       '<div class="platform-form-label" style="padding-right:10px;">';
					bodyTemplate +=          '<div style="margin-bottom:10px"><b>{{"boq.main.QuantityInspector.Synchronize'+group+'" | translate}}</b></div>';
					_.forEach(synchronizableQuantities, function(quantity) {
						bodyTemplate +=       '<div class="radio spaceToUp margin-bottom-ld">';
						bodyTemplate +=          '<label>';
						bodyTemplate +=             '<input type="radio" name="'+group+'" ng-model="selectedQuantity'+group+'" ng-value="'+(radioItemCount++)+'" data-ng-change="onQuantityChanged'+group+'()">';
						bodyTemplate +=             quantity.name;
						bodyTemplate +=          '</label>';
						bodyTemplate +=       '</div>';
					});
					bodyTemplate +=          '<div data-domain-control data-domain="select" class="form-control" readonly="isReadonlyQuantityBoqHeaderContext'+group+'" data-options="quantityBoqHeaderContext'+group+'" data-model="selectedQuantityBoqHeaderContextItem'+group+'"></div>'; //  style="max-width:100px;"></div>';
					bodyTemplate +=       '</div>';
				});
				bodyTemplate +=       '</div>';
				bodyTemplate +=    '</div>';
				bodyTemplate += '</div>';

				var modalOptions =
				{
					headerText$tr$: 'boq.main.QuantityInspector.Synchronize',
					bodyTemplate: bodyTemplate,
					showOkButton:     true,
					showCancelButton: true,
					resizeable: true,
					synchronizableQuantities: synchronizableQuantities,
					boqHeaderContextItems: boqHeaderContextItems,
					selectedBoqItems: selectedBoqItems,
					onSynchronized: updateGrid
				};

				platformDialogService.showDialog(modalOptions);
			};

			updateGrid();
		}
	]);

	angularModule.controller('boqMainQuantityInspectorLayoutController', ['math', '$scope', '$http', '$timeout', '$translate', 'platformGridAPI',
		function(math, $scope, $http, $timeout, $translate, platformGridAPI) {
			const boqHeaderContextDic         = $scope.dialog.modalOptions.boqHeaderContextDic;
			const quantityInspectorGridId     = $scope.dialog.modalOptions.quantityInspectorGridId;
			var quantityInspectorConfigLayout = platformGridAPI.columns.configuration(quantityInspectorGridId).current;
			var quantityInspectorVisibles     = platformGridAPI.columns.configuration(quantityInspectorGridId).visible;
			var configRows = [];
			var boqContextModules = [];

			const configColumns = [
				{id:'id',      field:'name',    name:$translate.instant('cloud.desktop.formConfigLabelName'),  width:250, formatter:'description'},
				{id:'visible', field:'visible', name:$translate.instant('cloud.desktop.formConfigVisibility'), width: 80, formatter:'boolean', editor:'boolean'},
				{id:'width',   field:'width',   name:$translate.instant('basics.customize.width'),             width: 80, formatter:'integer', editor:'integer'},
			];


			for (var moduelId in boqHeaderContextDic) {
				boqContextModules.push(moduelId);
			}
			_.forEach(quantityInspectorConfigLayout, function(qiColumn) {
				const qiVisibleColumn = _.find(quantityInspectorVisibles, {'id':qiColumn.id});
				if (boqContextModules.includes(qiColumn.moduleId)) {
					configRows.push({
						'id':      qiColumn.id,
						'name':    qiColumn.name,
						'width':   math.round(qiVisibleColumn ? qiVisibleColumn.width : qiColumn.width),
						'visible': qiColumn.visible
					});
				}
			});

			$scope.gridId       = 'cded582058a74c9ca0bd23a0f0b53466';
			$scope.gridData     = {state:      $scope.gridId};
			platformGridAPI.grids.config({'id':$scope.gridId, 'options': {idProperty:'id'}, 'columns':configColumns});
			platformGridAPI.items.data(        $scope.gridId, configRows);
			$timeout(function() {
				platformGridAPI.grids.resize($scope.gridId);
			});

			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({ok:true});

				_.forEach(quantityInspectorConfigLayout, function(qiColumn) {
					var configRow = _.find(configRows, {'id':qiColumn.id});
					if (configRow) {
						qiColumn.hidden  = !configRow.visible;
						qiColumn.visible =  configRow.visible;
						qiColumn.width   =  configRow.width;
					}
				});

				platformGridAPI.columns.configuration(quantityInspectorGridId, quantityInspectorConfigLayout);
				platformGridAPI.grids.refresh(        quantityInspectorGridId);
				platformGridAPI.grids.invalidate(     quantityInspectorGridId);

				_.forEach(quantityInspectorConfigLayout, function(qiColumn) {
					delete qiColumn.hidden;
				});
				$http.post(globals.webApiBaseUrl + boqRoute + 'savelayout', JSON.stringify(quantityInspectorConfigLayout));
			};
		}
	]);

	angularModule.controller('boqMainQuantityInspectorSynchronizeController', ['$scope', '$http', 'platformDialogService',
		function($scope, $http, platformDialogService) {
			const synchronizableQuantities = $scope.dialog.modalOptions.synchronizableQuantities;
			const boqHeaderContextItems    = $scope.dialog.modalOptions.boqHeaderContextItems;
			const selectedBoqItems         = $scope.dialog.modalOptions.selectedBoqItems;
			const onSynchronized           = $scope.dialog.modalOptions.onSynchronized;

			function indexOf(field) {
				return _.indexOf(synchronizableQuantities, _.find(synchronizableQuantities, {'id':field}));
			}

			function updateQuantityBoqHeaderContextSource() {
				$scope.quantityBoqHeaderContextSource.items       = _.find(boqHeaderContextItems, {'ModuleId':synchronizableQuantities[$scope.selectedQuantitySource].moduleId}).Value.items;
				$scope.selectedQuantityBoqHeaderContextItemSource = $scope.quantityBoqHeaderContextSource.items[0];
				$scope.isReadonlyQuantityBoqHeaderContextSource   = $scope.quantityBoqHeaderContextSource.items.length===1;
			}
			function updateQuantityBoqHeaderContextTarget() {
				$scope.quantityBoqHeaderContextTarget.items       = _.find(boqHeaderContextItems, {'ModuleId':synchronizableQuantities[$scope.selectedQuantityTarget].moduleId}).Value.items;
				$scope.selectedQuantityBoqHeaderContextItemTarget = $scope.quantityBoqHeaderContextTarget.items[0];
				$scope.isReadonlyQuantityBoqHeaderContextTarget   = $scope.quantityBoqHeaderContextTarget.items.length===1;
			}

			$scope.onQuantityChangedSource = function() {
				updateQuantityBoqHeaderContextSource();
			};
			$scope.onQuantityChangedTarget = function() {
				updateQuantityBoqHeaderContextTarget();
			};

			$scope.dialog.getButtonById('ok').fn = function() {
				const request = {
					sourceBoqHeaderId:  $scope.selectedQuantityBoqHeaderContextItemSource.BoqHeaderId,
					targetBoqHeaderId:  $scope.selectedQuantityBoqHeaderContextItemTarget.BoqHeaderId,
					sourceQuantityName: synchronizableQuantities[$scope.selectedQuantitySource].origin,
					targetQuantityName: synchronizableQuantities[$scope.selectedQuantityTarget].origin,
					sourceBoqItemIds:   _.map(selectedBoqItems, function(boqItem) { return boqItem.BoqItemPrjItemFk || boqItem.Id; })
				};

				if ($scope.selectedQuantityBoqHeaderContextItemTarget.ContextIsReadOnly) {
					platformDialogService.showInfoBox('boq.main.QuantityInspector.TargetReadonly');
				}
				else if (request.sourceBoqHeaderId===request.targetBoqHeaderId && request.sourceQuantityName===request.targetQuantityName) {
					platformDialogService.showInfoBox('boq.main.QuantityInspector.SourceEqualTarget');
				}
				else {
					$http.post(globals.webApiBaseUrl + boqRoute + 'synchronizequantities', request).then(function(response) {
						if (response) {
							onSynchronized();
							$scope.$close({ok:true});
							platformDialogService.showInfoBox('boq.main.QuantityInspector.SynchronizationSucceeded');
						}
					});
				}
			};

			// Initializations
			$scope.quantityBoqHeaderContextSource = {valueMember:'BoqHeaderId', displayMember:'Description'};
			$scope.quantityBoqHeaderContextTarget = {valueMember:'BoqHeaderId', displayMember:'Description'};
			$scope.selectedQuantitySource = indexOf('boq.project.Quantity');
			$scope.selectedQuantityTarget = indexOf('boq.project.QuantityAdj');
			updateQuantityBoqHeaderContextSource();
			updateQuantityBoqHeaderContextTarget();
		}
	]);

})();
