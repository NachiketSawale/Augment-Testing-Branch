(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonCreateWicFromBoqController', createWicFromBoqController);

	createWicFromBoqController.$inject = ['$http', '$scope', '$translate', '$injector', 'platformGridAPI', 'platformModalService', 'platformTranslateService', 'basicsLookupdataLookupFilterService','procurementQuoteHeaderDataService','basicsLookupdataLookupDescriptorService'];

	function createWicFromBoqController($http, $scope, $translate, $injector, platformGridAPI, platformModalService, platformTranslateService, basicsLookupdataLookupFilterService,procurementQuoteHeaderDataService,basicsLookupdataLookupDescriptorService) {

		var wicBoqGridUuid = '67ae2c09330849efbe0c4886df6928f0';
		$scope.wicBoqGrid = {
			state: wicBoqGridUuid
		};
		$scope.updateBtnDisabled=true;
		$scope.modalOptions = $scope.modalOptions || {};
		$scope.customOptions = {

			okBtnDisabled: okBtnDisabled,
			ok: OK,
			quoteChange: quoteChange,
			updateBtn: updateBtn
		};

		var filters = [
			{
				key: 'procurement-price-comparison-copy-boq-qtn-filter',
				serverKey: 'procurement-price-comparison-copy-boq-qtn-filter',
				serverSide: true,
				fn: function () {

					var procurementPriceComparisonService = $injector.get('procurementPriceComparisonMainService');
					var rfqHeader = procurementPriceComparisonService.getSelected();
					var rfqHeaderId = rfqHeader ? rfqHeader.Id : -1;

					return {RfqHeaderFk: rfqHeaderId};
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
		// ///////////////////////
		/*
		* please don`t leave registerFilter after $scope.lookupOptions definition.
		* */
		$scope.lookupOptions = {
			quote: {
				lookupDirective: 'procurement-quote-header-lookup',
				descriptionMember: 'Description',
				lookupOptions: {
					filterKey: 'procurement-price-comparison-copy-boq-qtn-filter',
					showClearButton: false
				}
			},
			sourceBoq: {
				lookupDirective: 'basics-lookup-data-by-custom-data-service',
				descriptionMember: 'BriefInfo.Translated',
				lookupOptions: {
					valueMember: 'Id',
					displayMember: 'Reference',
					showClearButton: false,
					lookupModuleQualifier: 'prcCommonRootBoqItemLookupService',
					dataServiceName: 'prcCommonRootBoqItemLookupService',
					lookupType: 'prcCommonRootBoqItemLookupService',
					columns: [
						{
							id: 'reference',
							field: 'Reference',
							name: 'Reference',
							formatter: 'description',
							name$tr$: 'boq.main.Reference'
						},
						{
							id: 'brief',
							field: 'BriefInfo',
							name: 'Outline Specification',
							formatter: 'translation',
							name$tr$: 'boq.main.BriefInfo'
						}
					],
					uuid: '49b49742451d430ca63453b7d9d03487',
					filter: function () {
						// currently, PKey1 means qtnHeaderId, PKey2 means conHeaderId.
						var qtnHeaderId = $scope.currentItem.QtnHeaderFk || -1;
						var conHeaderId = $scope.currentItem.ConHeaderFk || -1;

						return {PKey1: qtnHeaderId, PKey2: conHeaderId};
					},
					disableDataCaching: true,
					// enableCache: false,
					isClientSearch: false,
					isTextEditable: false,
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								var selectedItem = args.entity;
								var selectedLookupItem = args.selectedItem;

								if (selectedItem && selectedLookupItem) {
									selectedItem.BoqHeaderFk = selectedLookupItem.BoqHeaderFk;
									// set ReferenceNo and outline specification to xxx.
									selectedItem.boqRef = selectedLookupItem.Reference;
									selectedItem.boqOutlineSpec = selectedLookupItem.BriefInfo.Translated;
								}
							}
						}
					]
				}
			},
			wicGroup: {
				lookupDirective: 'basics-lookup-data-by-custom-data-service',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					valueMember: 'Id',
					displayMember: 'Code',
					lookupModuleQualifier: 'estimateAssembliesWicGroupLookupDataService',
					dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
					showClearButton: false,
					lookupType: 'estimateAssembliesWicGroupLookupDataService',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					uuid: 'aee374374c634e27ba45e6e145f872ae',
					isTextEditable: false,
					treeOptions: {
						parentProp: 'WicGroupFk',
						childProp: 'WicGroups',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								var selectedItem = args.entity;
								var selectedLookupItem = args.selectedItem;

								// to get wic boqs.
								if (selectedItem && selectedLookupItem) {
									$scope.modalOptions.dialogLoading = true;
									$http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + selectedLookupItem.Id).then(function (response) {
										var data = response.data || [];
										platformGridAPI.items.data(wicBoqGridUuid, data);
									}, function () {
										// if failed, set to empty.
										platformGridAPI.items.data(wicBoqGridUuid, []);
									}).finally(function () {
										$scope.modalOptions.dialogLoading = false;
									});
								} else {
									platformGridAPI.items.data(wicBoqGridUuid, []);
								}
							}
						}
					]
				}
			}
		};

		$scope.fieldConfigs = {
			sourceBoq: {
				rt$readonly: function () {
					// currently, it would check the readonly in module prcPriceComparison.
					return $scope.modalOptions.isShowQtnLookup && !$scope.modalOptions.quoteHasBoq;
				}
			}
		};

		$scope.currentItem = {
			QtnHeaderFk: $scope.modalOptions.QtnHeaderFk || null,
			ConHeaderFk: $scope.modalOptions.ConHeaderFk || null,
			BoQItemFk: null,
			WicGroupFk: null,
			BoqHeaderFk: null,
			boqRef: null,
			boqOutlineSpec: null,
			currencyFk: $scope.modalOptions.CurrencyFk
		};

		function okBtnDisabled() {

			var entity = $scope.currentItem;

			// if  entity.QtnHeaderFk > 0 && entity.BoQItemFk > 0 && entity.WicGroupFk > 0 , OK button can be enabled.
			// return !(entity.QtnHeaderFk > 0 && entity.BoQItemFk > 0 && entity.WicGroupFk > 0);
			return !(entity.BoQItemFk > 0 && entity.WicGroupFk > 0);
		}

		/*
		* create wic boq.
		* **/
		function OK() {

			var entity = $scope.currentItem;
			$scope.modalOptions.dialogLoading = true;

			var requestData = {
				BoqItemFk: entity.BoQItemFk,
				BoqHeaderFk: entity.BoqHeaderFk,
				WicGroupFk: entity.WicGroupFk,
				ReferenceNo: entity.boqRef,
				OutlineSpec: entity.boqOutlineSpec
			};
			$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/createorupdatewicfromboqofqtn?', requestData).then(function (res) {

				var result = res.data;
				var message = null;
				var title = 'cloud.common.informationDialogHeader';
				if (result.created) {

					message = 'procurement.common.createSuccessfully';
				} else if (result.reduplicative) {

					var objStr = $translate.instant('boq.main.Reference');
					message = $translate.instant('procurement.common.shouldBeUnique', {field: objStr, value: result.reduplicative.referenceNo});

				} else {

					message = $translate.instant('procurement.common.notingToCreate');
				}

				platformModalService.showMsgBox(message, title, 'info').then(function () {
					// close dialog.
					// $scope.$close(true);
				});
			}).finally(function () {

				$scope.modalOptions.dialogLoading = false;
			});
		}

		initDataGrid();

		// boq/wic/boq/list?wicGroupId=54
		function initDataGrid() {
			var wicBoqGrids = [
				{
					id: 'reference',
					field: 'BoqRootItem.Reference',
					name: 'Reference No.',
					name$tr$: 'boq.main.Reference',
					formatter: 'code',
					readonly: true,
					width: 100
				},
				{
					id: 'briefinfo',
					field: 'BoqRootItem.BriefInfo',
					name: 'Outline Specification',
					name$tr$: 'boq.main.BriefInfo',
					formatter: 'translation',
					readonly: true,
					width: 120
				},
				{
					id: 'externalcode',
					field: 'BoqRootItem.ExternalCode',
					name: 'External Code',
					name$tr$: 'boq.main.ExternalCode',
					formatter: 'code',
					readonly: true,
					width: 120
				},
				{
					id: 'mdcmaterialcatalogfk',
					field: 'WicBoq.MdcMaterialCatalogFk',
					name: 'WIC Framework',
					name$tr$: 'boq.main.MdcMaterialCatalogFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialCatalog',
						displayMember: 'Code'
					},
					readonly: true,
					width: 120
				},
				{
					id: 'isdisabled',
					field: 'BoqRootItem.IsDisabled',
					name: 'Disabled',
					name$tr$: 'boq.main.IsDisabled',
					formatter: 'boolean',
					readonly: true,
					width: 110
				},
				{
					id: 'bascurrencyfk',
					field: 'BoqHeader.BasCurrencyFk',
					name: 'Currency',
					name$tr$: 'cloud.common.entityCurrency',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'currency',
						displayMember: 'Currency'
					},
					readonly: true,
					width: 110
				}
			];
			//
			if (!platformGridAPI.grids.exist(wicBoqGridUuid)) {
				var gridConfig = {
					columns: angular.copy(wicBoqGrids),
					data: [],
					id: wicBoqGridUuid,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id'
					}
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);
				platformGridAPI.events.register(wicBoqGridUuid, 'onSelectedRowsChanged', isShowUpdateBtn);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(wicBoqGridUuid, 'onSelectedRowsChanged', isShowUpdateBtn);
				});

			}
		}

		function quoteChange() {

			// disable $scope.currentItem.BoQItemFk.
			$scope.modalOptions.quoteHasBoq = false;
			// clear $scope.currentItem.BaoQItemFk.
			$scope.currentItem.BoQItemFk = null;
			$scope.currentItem.BoqHeaderFk = null;

			// get boqItems of the selected quote.
			var qtnHeaderFk = $scope.currentItem.QtnHeaderFk;
			if (qtnHeaderFk > 0) {

				var reqData = {PKey1: qtnHeaderFk};
				// enable refresh circle.
				$scope.modalOptions.dialogLoading = true;
				$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/getrootboqitemsbyfilter', reqData).then(function (res) {

					var resultList = res.data || [];
					if (resultList.length > 0) {
						// enable $scope.currentItem.BoQItemFk.
						$scope.modalOptions.quoteHasBoq = true;

					} else {
						var title = 'cloud.common.informationDialogHeader';
						var message = 'procurement.pricecomparison.noBoqItemsOfSelectedQtn';
						platformModalService.showMsgBox(message, title, 'info');
					}

				}).finally(function () {
					// disable refresh circle.
					$scope.modalOptions.dialogLoading = false;
				});
			}
		}

		/*
		* update wic boq.
		* **/
		function updateBtn() {
			let entity = $scope.currentItem;
			let currency=basicsLookupdataLookupDescriptorService.getData('currency');
			const selected = platformGridAPI.rows.selection({gridId: wicBoqGridUuid});
			let source=_.find(currency,{Id:entity.currencyFk});
			let target=_.find(currency,{Id:selected.BoqHeader.BasCurrencyFk});
			const message =$translate.instant('procurement.common.updateWicFromBoq.updateCurrency',
				{
					Source: source.Currency,
					Target: target.Currency
				});
			const title = 'cloud.common.informationDialogHeader';
			platformModalService.showYesNoDialog(message,title,'yes').then(function(result){
				if(result.yes)
				{
					// show dialog.
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/common-update-wic-from-boq.html',
						width: '700px',
						resizeable: true,
						headerText: $translate.instant('procurement.common.updateWicFromBoq.title'),
						requestData: entity
					});}

			});
		}

		function isShowUpdateBtn()
		{
			$scope.modalOptions.dialogLoading = true;
			$scope.updateBtnDisabled=true;
			const selected = platformGridAPI.rows.selection({gridId: wicBoqGridUuid});
			const requestData={
				BoqItemWicBoqFk: selected.WicBoq.BoqHeaderFk,
				BoqHeaderFk: $scope.currentItem.BoqHeaderFk
			};
			$scope.currentItem.BoqItemWicBoqFk=selected.WicBoq.BoqHeaderFk;
			$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/GetBoqItemWicItemCount?', requestData).then(function (res) {
				const result = res.data;
				if(result>0)
				{
					$scope.updateBtnDisabled=false;
				}
			}).finally(function () {
				$scope.modalOptions.dialogLoading = false;
			});
		}
	}

})(angular);