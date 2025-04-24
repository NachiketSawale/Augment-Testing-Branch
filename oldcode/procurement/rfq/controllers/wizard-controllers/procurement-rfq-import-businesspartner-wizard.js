/**
 * Created by lst on 1/16/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(moduleName).controller('procurementRfqSelectImportBusinessPartnerController', [
		'platformGridControllerService',
		'$scope',
		'$translate',
		'platformGridAPI',
		'procurementRfqWizardService',
		'procurementRfqBusinessPartnerUIStandardService',
		'$timeout',
		'platformTranslateService',
		'platformModalService',
		'basicsLookupdataLookupDataService',
		function (
			gridControllerService,
			$scope,
			$translate,
			platformGridAPI,
			procurementRfqWizardService,
			procurementRfqBusinessPartnerUIStandardService,
			$timeout,
			platformTranslateService,
			platformModalService,
			basicsLookupdataLookupDataService
		) {

			var settings = procurementRfqBusinessPartnerUIStandardService.getStandardConfigForListView();

			$scope.modalOptions = angular.extend($scope.modalOptions, {
				CancelButtonText: 'Cancel',
				OKButtonText: 'OK',
				headerText: $translate.instant('procurement.rfq.importBp.title'),
				rfqLabelText: $translate.instant('procurement.rfq.importBp.rfqLabelText'),
				rfqBodyLabelText: $translate.instant('procurement.rfq.importBp.rfqBodyLabelText')
			});

			$scope.rfq = {
				lookup: {
					lookupDirective: 'procurement-rfq-header-dialog',
					descriptionMember: 'Description',
					lookupOptions: {
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								$scope.selectedItemChanged(args.selectedItem);
							}
						}],
						filterOptions: {
							serverSide: true,
							serverKey:'import-business-partner-filter',
							fn: function (context) {
								return {};
							}
						},
						formContainerOptions: {
							entity: function (entity){
								return {
									ProjectFk: $scope.modalOptions.currentItem.ProjectFk,
									PrcStructureFk: $scope.modalOptions.currentItem.PrcStructureFk
								};
							},
							formOptions: {
								configure: {
									showGrouping: false,
									groups: [{
										gid: 'baseGroup',
										isOpen: true
									}],
									rows: [{
										gid: 'baseGroup',
										rid: 'project',
										label$tr$: 'cloud.common.entityProject',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'procurement-project-lookup-dialog',
											descriptionMember: 'ProjectName',
											lookupOptions: {
												lookupType: 'PrcProject',
												showClearButton: true
											}
										},
										model: 'ProjectFk'
									}, {
										gid: 'baseGroup',
										rid: 'structurefk',
										label$tr$: 'basics.common.entityPrcStructureFk',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'basics-procurementstructure-structure-dialog',
											descriptionMember: 'DescriptionInfo.Translated',
											lookupOptions: {
												lookupType: 'prcstructure',
												showClearButton: true
											}
										},
										model: 'PrcStructureFk'
									}, {
										gid: 'baseGroup',
										rid: 'businessPartkerFk',
										label$tr$: 'procurement.common.entityBusinessPartnerName1',
										type: 'directive',
										directive: 'filter-business-partner-dialog-lookup',
										options: {
											displayMember: 'BusinessPartnerName1',
											showClearButton: true
										},
										model: 'BusinessPartnerFk'
									}]
								}
							}
						}
					}
				},
				selectedValue: -1
			};

			$scope.data = [];

			$scope.gridId = 'DE6AFC61AB3C488BB79592ED461CF877';
			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.onContentResized = function () {
			};
			$scope.setTools = function () {
			};

			function getGridCloumn(columns, showColumns) {
				if (showColumns && showColumns.length > 0) {
					for (var i = columns.length; i > 0; i--) {
						var c = columns[i - 1];
						c.navigator = undefined;
						if (showColumns.indexOf(c.field.toLowerCase()) === -1) {
							columns.splice(i - 1, 1);
						}
					}
				}
				return columns;
			}

			function setupMappingGrid() {

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var showColumns = ['id', 'rfqbusinesspartnerstatusfk', 'businesspartnerfk', 'subsidiaryfk', 'supplierfk', 'contactfk', 'daterequested', 'daterejected', 'rfqrejectionreasonfk'];

					var tempColumns = angular.copy(settings.columns);
					tempColumns = getGridCloumn(tempColumns, showColumns);
					tempColumns.unshift({
						id: 'IsChecked',
						field: 'IsChecked',
						name: 'All',
						name$tr$: 'procurement.rfq.importBp.checkAll',
						formatter: 'boolean',
						editor: 'boolean',
						width: 60,
						headerChkbox: true
					});
					platformTranslateService.translateGridConfig(tempColumns);
					var grid = {
						columns: tempColumns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							editable: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

			}

			$scope.onOK = function () {
				var options = {
					DestRfqHeaderId: $scope.modalOptions.currentItem.Id,
					SourceRfqBidderIds: []
				};

				var dataList = platformGridAPI.items.data($scope.gridId);
				for (var i = dataList.length; i > 0; i--) {
					var item = dataList[i - 1];
					if (item.IsChecked === true) {
						options.SourceRfqBidderIds.push(item.Id);
					}
				}

				procurementRfqWizardService.copyBidders(options).then(function (response) {
					if (response.data === true) {
						platformModalService.showDialog({
							headerTextKey: $translate.instant('procurement.rfq.importBp.title'),
							bodyTextKey: $translate.instant('procurement.rfq.importBp.success'),
							iconClass: 'ico-info'
						}).then(function (dialogResult) {
							if (dialogResult.ok) {
								$scope.modalOptions.ok();
							}
						});
					}
				});
			};

			$scope.onCancel = function () {

				$scope.modalOptions.cancel();
			};

			$scope.selectedItemChanged = function (selectedItem) {
				var selectedRfq = $scope.modalOptions.selectedItem = selectedItem;
				procurementRfqWizardService.getDialogBidders(selectedRfq.Id).then(function (response) {
					updateGridData(response.data.Main);

				});
			};

			function updateGridData(dataList) {
				angular.forEach(dataList, function (item) {
					item.IsChecked = true;
				});
				platformGridAPI.items.data($scope.gridId, dataList);
				platformGridAPI.grids.invalidate($scope.gridId);
			}

			// init
			var init = function () {
				if ($scope.modalOptions.currentItem && $scope.modalOptions.currentItem.RfqHeaderFk > 0) {
					basicsLookupdataLookupDataService.getItemByKey('RfqHeaderLookup', $scope.modalOptions.currentItem.RfqHeaderFk).then(rfq => {
						$scope.selectedItemChanged(rfq);
						$scope.rfq.selectedValue = rfq.Id;
					});
				}

				setupMappingGrid();
			};

			init();
		}
	]);

})(angular);