(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonWizardService', [
		'globals',
		'_',
		'$q',
		'$http',
		'$document',
		'mainViewService',
		'platformTranslateService',
		'platformSidebarWizardConfigService',
		'platformModalService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonCreateContractWizardGridService',
		'$translate',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonExportMaterialWizardGridService',
		'basicsCommonFileDownloadService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonItemDataStructureServiceFactory',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonItemConfigFactory',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonBoqDataStructureFactory',
		'procurementPriceComparisonBoqConfigFactory',
		'platformGridDomainService',
		'boqMainLineTypes',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonCommonHelperService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonItemEvaluationService',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonCheckBidderService',
		'pricecomparisonBoqFormulaService',
		'pricecomparisonItemFormulaService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonTranslationDescriptionService',
		'procurementQuoteWizardsService',
		function (
			globals,
			_,
			$q,
			$http,
			$document,
			mainViewService,
			platformTranslateService,
			platformSidebarWizardConfigService,
			platformModalService,
			mainDataService,
			createContractWizardGridService,
			$translate,
			itemService,
			boqService,
			exportMaterialWizardGridService,
			basicsCommonFileDownloadService,
			commonService,
			itemStructureFactory,
			itemHelperService,
			itemConfigFactory,
			boqHelperService,
			boqStructureFactory,
			boqConfigFactory,
			platformGridDomainService,
			boqMainLineTypes,
			bidderCheckService,
			commonHelperService,
			basicsLookupDescriptorService,
			boqCompareRows,
			itemEvaluationService,
			compareLineTypes,
			checkBidderService,
			boqFormulaService,
			itemFormulaService,
			lookupDescriptorService,
			translationDescriptionService,
			quoteWizardsService) {

			let service = {};
			let wizardID = 'procurementPriceComparisonSidebarWizards';

			let itemConfigService = itemConfigFactory.getService('export.item.config.service');
			let itemDataStructureService = itemStructureFactory.getService(itemConfigService, 'export.item.structure.service');

			let boqConfigService = boqConfigFactory.getService('export.boq.config.service');
			let boqDataStructureService = boqStructureFactory.getService(boqConfigService, 'export.boq.structure.service');

			// Additional export table for calculate such as billing schema and price condition.
			let lookupMap = {
				Quote: [],
				VatPercent: []
			};

			const buildAdditionalCompareField = (field, description, sorting) => {
				return {
					AllowEdit: false,
					CompareViewFk: -1,
					ConditionalFormat: '{"MAX()":"color:red;","AVG()":"color:blue;","MIN()":"color:green;"}',
					DefaultDescription: description,
					DescriptionInfo: {
						Description: '',
						DescriptionModified: false,
						DescriptionTr: null,
						Modified: false,
						OtherLanguages: null,
						Translated: description,
						VersionTr: 0
					},
					DeviationField: false,
					DeviationPercent: null,
					DeviationReference: null,
					DisplayName: description,
					Field: field,
					FieldName: description,
					FieldType: 0,
					Id: 'CompareField_' + field,
					IsLeading: false,
					IsQuoteField: false,
					IsSorting: false,
					ShowInSummary: false,
					Sorting: sorting,
					UserLabelName: '',
					Visible: false,
				};
			};

			const boqConfig = {
				required: {
					quoteFields: [commonService.quoteCompareFields.exchangeRate],
					compareFields: [
						boqCompareRows.price,
						boqCompareRows.priceOc,
						boqCompareRows.priceGross,
						boqCompareRows.priceGrossOc,
						boqCompareRows.discountPercent,
						boqCompareRows.discountPercentIT,
						boqCompareRows.discount,
						boqCompareRows.discountedPrice,
						boqCompareRows.discountedUnitPrice,
						boqCompareRows.finalPrice,
						boqCompareRows.finalPriceOc,
						boqCompareRows.finalGross,
						boqCompareRows.finalGrossOc,
						boqCompareRows.itemTotal,
						boqCompareRows.itemTotalOc,
						boqCompareRows.percentage,
						boqCompareRows.absoluteDifference,
						boqCompareRows.cost,
						boqCompareRows.lumpsumPrice,
						boqCompareRows.quantity,
						boqCompareRows.factor,
						boqCompareRows.extraIncrement,
						boqCompareRows.extraIncrementOc,
						boqCompareRows.quantityAdj
					],
					additionalFields: [
						buildAdditionalCompareField(boqCompareRows.factor, 'Factor', 47),
						buildAdditionalCompareField(boqCompareRows.extraIncrement, 'Extra Increment', 48),
						buildAdditionalCompareField(boqCompareRows.extraIncrementOc, 'Extra Increment OC', 49)
					],
				},
				hide: {
					quoteFields: [],
					compareFields: [],
					columns: []
				},
				formula: {
					excludeRows: [
						boqCompareRows.rank,
						boqCompareRows.commentContractor,
						boqCompareRows.commentClient,
						boqCompareRows.prcItemEvaluationFk,
						boqCompareRows.bidderComments,
						boqCompareRows.userDefined1,
						boqCompareRows.userDefined2,
						boqCompareRows.userDefined3,
						boqCompareRows.userDefined4,
						boqCompareRows.userDefined5,
						boqCompareRows.alternativeBid,
						boqCompareRows.isLumpsum,
						boqCompareRows.boqTotalRank,
						boqCompareRows.externalCode,
						boqCompareRows.notSubmitted,
						boqCompareRows.included,
						boqCompareRows.uomFk,
						boqCompareRows.factor,
						boqCompareRows.exQtnIsEvaluated,
						boqCompareRows.prjChangeFk,
						boqCompareRows.prjChangeStatusFk
					],
					excludeColumns: [
						'tree',
						'CompareDescription',
						'Reference',
						'BasItemTypeFk',
						'BasItemType2Fk',
						'Quantity',
						'QuantityAdjustment',
						'LineName',
						'BoqLineType',
						'IsFreeQuantity',
						'IsNoLeadQuantity',
						'Aan',
						'Agn',
						'IsContracted',
						'IsDisabled',
						'ExternalCode',
						'ItemInfo',
						'IsLeadDescription',
						'IsNotApplicable',
						'Brief',
						'UomFk',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5'
					]
				}
			};

			const itemConfig = {
				required: {
					quoteFields: [commonService.quoteCompareFields.exchangeRate],
					compareFields: [
						commonService.itemCompareFields.price,
						commonService.itemCompareFields.priceOc,
						commonService.itemCompareFields.priceExtra,
						commonService.itemCompareFields.priceExtraOc,
						commonService.itemCompareFields.priceUnit,
						commonService.itemCompareFields.priceGross,
						commonService.itemCompareFields.priceOCGross,
						commonService.itemCompareFields.totalPrice,
						commonService.itemCompareFields.total,
						commonService.itemCompareFields.totalOC,
						commonService.itemCompareFields.totalNoDiscount,
						commonService.itemCompareFields.totalOcNoDiscount,
						commonService.itemCompareFields.totalGross,
						commonService.itemCompareFields.totalOCGross,
						commonService.itemCompareFields.totalPriceGross,
						commonService.itemCompareFields.totalPriceOCGross,
						commonService.itemCompareFields.discount,
						commonService.itemCompareFields.discountAbsolute,
						commonService.itemCompareFields.quantity,
						commonService.itemCompareFields.totalPriceOc,
						commonService.itemCompareFields.priceUnit,
						commonService.itemCompareFields.factorPriceUnit,
						commonService.itemCompareFields.discountSplit,
						commonService.itemCompareFields.discountSplitOc,
						commonService.itemCompareFields.percentage,
						commonService.itemCompareFields.absoluteDifference,
						commonService.itemCompareFields.charge,
						commonService.itemCompareFields.chargeOc
					],
					additionalFields: [
						buildAdditionalCompareField(commonService.itemCompareFields.factorPriceUnit, 'Factor Price Unit', 45)
					],
				},
				hide: {
					quoteFields: [],
					compareFields: [],
					columns: []
				},
				formula: {
					excludeRows: [],
					excludeColumns: []
				}
			};

			const exportRequiredColumns = ['BudgetTotal', 'BudgetPerUnit'];

			const doExportCompareDataToExcel = function (isExportedFormula, showProgressMessage) {
				showProgressMessage($translate.instant('procurement.pricecomparison.wizard.loadingRfqData'));
				return $q.all([getItemData(), getBoqData()]).then(function (result) {
					lookupMap.Quote = _.values(lookupDescriptorService.getData('Quote'));
					lookupMap.VatPercent = (function () {
						let list = _.values(lookupDescriptorService.getData('MdcTaxCode'));
						return _.concat(list, _.values(lookupDescriptorService.getData('TaxCodeMatrixs')));
					})();

					let boqDataRows = commonHelperService.flatTree(result[1], 'BoqItemChildren');
					let boqVerticalCompareRows = boqService.isVerticalCompareRows();
					let boqAllColumns = loadAllColumns(commonService.constant.compareType.boqItem);
					let boqExportColumns = buildColumns(boqAllColumns, boqConfig.hide.compareFields, boqConfig.hide.columns);
					let boqHeaders = buildHeader(boqExportColumns, boqConfig.hide.columns);
					let filteredBoqRows = filterBoqRows(boqDataRows);
					let boqHeaderGroups = [];
					if (boqService.isVerticalCompareRows()) {
						boqHeaderGroups = buildHeaderGroup(boqExportColumns);
					}

					let itemDataRows = commonHelperService.flatTree(result[0], 'Children');
					let itemVerticalCompareRows = itemService.isVerticalCompareRows();
					let itemAllColumns = loadAllColumns(commonService.constant.compareType.prcItem);
					let itemExportColumns = buildColumns(itemAllColumns, itemConfig.hide.compareFields, itemConfig.hide.columns);
					let itemHeaders = buildHeader(itemExportColumns, itemConfig.hide.columns);

					return buildDataRow(boqExportColumns, filteredBoqRows, commonService.constant.compareType.boqItem, boqVerticalCompareRows, {
						showInSummaryRows: boqConfigService.showInSummaryCompareRowsCache,
						isFinalPriceRowActivated: boqConfigService.isShowInSummaryActivated(),
						decimalCompareFields: boqConfigService.decimalCompareFields,
						booleanCompareFields: boqConfigService.booleanCompareFields,
						integerCompareFields: boqConfigService.integerCompareFields,
						boqRows: filteredBoqRows,
						leadingFieldCache: boqConfigService.leadingFieldCache,
						visibleCompareRowsCache: boqConfigService.visibleCompareRowsCache,
						visibleCompareColumnsCache: boqConfigService.visibleCompareColumnsCache,
						isCalculateAsPerAdjustedQuantity: boqService.isCalculateAsPerAdjustedQuantity()
					}, isExportedFormula, 'boq', showProgressMessage).then(boqRows => {
						return buildDataRow(itemExportColumns, itemDataRows, commonService.constant.compareType.prcItem, itemVerticalCompareRows, {
							isFinalPriceRowActivated: itemConfigService.isShowInSummaryActivated(),
							leadingFieldCache: itemConfigService.leadingFieldCache,
							visibleCompareRowsCache: itemConfigService.visibleCompareRowsCache,
							visibleCompareColumnsCache: itemConfigService.visibleCompareColumnsCache
						}, isExportedFormula, 'item', showProgressMessage).then(itemRows => {
							let itemHeaderGroups = [];
							if (itemService.isVerticalCompareRows()) {
								itemHeaderGroups = buildHeaderGroup(itemExportColumns);
							}

							let params = {
								RfqHeaderId: mainDataService.getIfSelectedIdElse(-1),
								Sheets: [{
									SheetName: 'BoQ',
									Columns: boqHeaders,
									Rows: boqRows,
									ColumnGroups: boqHeaderGroups
								}, {
									SheetName: 'Item',
									Columns: itemHeaders,
									Rows: itemRows,
									ColumnGroups: itemHeaderGroups
								}, {
									SheetName: 'VatPercent',
									Columns: [{
										Field: 'Code',
										Name: 'Code'
									}, {
										Field: 'Description',
										Name: 'Description'
									}, {
										Field: 'VatPercent',
										Name: 'Value'
									}],
									Rows: buildVatPercentLookupDataRows(lookupMap.VatPercent),
									ColumnGroups: []
								}]
							};
							showProgressMessage($translate.instant('procurement.pricecomparison.wizard.uploadingRfqData'));
							return commonHelperService.uploadLargeObjectAsFile(params).then(result => {
								showProgressMessage($translate.instant('procurement.pricecomparison.wizard.exportingToExcel'));
								return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/export/excel/' + result.Uuid).then(function (response) {
									basicsCommonFileDownloadService.download(null, {
										FileName: response.data.FileName,
										Path: response.data.Path
									});
								});
							});
						});
					});
				}).finally(() => {
					resetExportConfig();
				});
			};

			service.createContract = function createContract() {
				let modalOptions = {
					headerTextKey: 'cloud.common.informationDialogHeader',
					bodyTextKey: 'procurement.pricecomparison.wizard.info.noHeader',
					showOkButton: true,
					iconClass: 'ico-info'
				};
				// no rfq selected
				if (!mainDataService.hasSelection()) {
					return platformModalService.showDialog(modalOptions);
				}
				// no quotes for the rfq
				createContractWizardGridService.load().then(function () {
					let quotes = createContractWizardGridService.getTree();
					if (_.isEmpty(quotes)) {
						modalOptions.bodyTextKey = 'procurement.pricecomparison.wizard.info.noQuoteData';
						return platformModalService.showDialog(modalOptions);
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/boq/isexqtnevaluated?rfqId=' + mainDataService.getSelected().Id).then(function (res) {
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/create-contract-wizard-view.html',
								backdrop: false,
								width: '1200px',
								resizeable: true,
								isFilterEvaluated: res.data ? 2 : 0
							});
						});
					}
				});
			};

			service.updateEstimate = function updateEstimate() {
				let modalOptions = {
					headerTextKey: 'cloud.common.informationDialogHeader',
					bodyTextKey: 'procurement.pricecomparison.wizard.info.noHeader',
					showOkButton: true,
					iconClass: 'ico-info'
				};

				// no rfq selected
				if (!mainDataService.hasSelection()) {
					return platformModalService.showDialog(modalOptions);
				}
				createContractWizardGridService.load().then(function () {
					let quotes = createContractWizardGridService.getTree();
					if (_.isEmpty(quotes)) {
						modalOptions.bodyTextKey = 'procurement.pricecomparison.wizard.info.noQuoteData';
						return platformModalService.showDialog(modalOptions);
					} else {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/update-estimate-wizard-view.html',
							backdrop: false,
							width: '70%',
							resizeable: true
						});
					}
				});
			};

			service.exportCompareData2Excel = function exportCompareData2Excel() {
				if (!mainDataService.hasSelection()) {
					return $q.when(null, null, null, null);
				}

				return platformModalService.showDialog({
					template: [
						'<header class="modal-header main-color" data-ng-include="\'modaldialog/modaldialog-header-template.html\'"></header>',
						'<section class="modal-body">',
						'  <div class="checkbox spaceToUp" style="display: inline;">',
						'     <label><input type="checkbox" data-ng-model-options="{debounce: { default: 0, blur: 0}}" data-ng-change="isExportedFormulaChanged()" data-ng-model="isExportedFormula">{{\'procurement.pricecomparison.wizard.exportWithFormulas\' | translate}}</label>',
						'  </div>',
						'</section>',
						'<footer class="modal-footer" style="height: auto;">',
						'  <div class="flex-element" style="line-height: 30px;"><span id="expert-excel-lbl"></span></div>',
						'  <button type="button" class="btn btn-default" data-ng-click="modalOptions.ok()"> {{\'cloud.common.ok\' | translate}}</button>',
						'  <button type="button" class="btn btn-default" data-ng-click="modalOptions.cancel()"> {{\'cloud.common.cancel\' | translate}}</button>',
						'</footer>',
						'<div cloud-common-overlay data-loading="isLoading"></div>'
					].join(''),
					width: '700px',
					height: '160px',
					controller: ['$scope', function controller($scope) {
						$scope.isExportedFormula = true;
						$scope.isExportedFormulaChanged = function () {
							$scope.isExportedFormula = !$scope.isExportedFormula;
						};
						$scope.isLoading = false;
						$scope.modalOptions = {
							headerText: $translate.instant('procurement.pricecomparison.wizard.exportPriceComparison'),
							ok: function () {
								$scope.isLoading = true;
								const ctrLbl = angular.element('#expert-excel-lbl');
								doExportCompareDataToExcel($scope.isExportedFormula, (message) => {
									ctrLbl.text(message);
								}).then(() => {
									$scope.$close({
										ok: true,
										isExportedFormula: $scope.isExportedFormula
									});
								}).finally(() => {
									$scope.isLoading = false;
								});
							},
							cancel: function () {
								$scope.$close({
									ok: false
								});
							}
						};
					}]
				});
			};

			service.exportMaterial = function () {
				let modalOptions = {
					headerTextKey: 'cloud.common.informationDialogHeader',
					bodyTextKey: 'procurement.pricecomparison.wizard.info.noHeader',
					showOkButton: true,
					iconClass: 'ico-info'
				};
				// no rfq selected
				if (!mainDataService.hasSelection()) {
					return platformModalService.showDialog(modalOptions);
				}
				// no quotes for the rfq
				exportMaterialWizardGridService.load().then(function () {
					let quotes = exportMaterialWizardGridService.getTree();
					if (_.isEmpty(quotes)) {
						modalOptions.bodyTextKey = 'procurement.pricecomparison.wizard.info.noQuoteData';
						return platformModalService.showDialog(modalOptions);
					} else {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/export-material-wizard-view.html',
							backdrop: false,
							width: '1200px',
							resizeable: true
						});
					}
				});
			};

			let wizards = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [
					{
						id: 1,
						text: 'Create Wizard',
						text$tr$: 'procurement.common.wizard.group.create',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							{
								id: 11,
								groupId: 1,
								text: 'Create Contract',
								text$tr$: 'procurement.common.wizard.item.createContract',
								type: 'item',
								showItem: true,
								fn: service.createContract
							},
							{
								id: 12,
								groupId: 1,
								text: 'Export Compare Data',
								text$tr$: 'procurement.common.wizard.exportCompareData',
								type: 'item',
								showItem: true,
								fn: service.exportCompareData2Excel
							}
						]
					}
				]
			};

			service.active = function () {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
			};

			service.deactive = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};

			// loads or updates translated strings
			let loadTranslations = function () {
				platformTranslateService.translateObject(wizards, ['text']);
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule(moduleName)) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			service.copyBoqItemToWIC = function () {

				let rfqHeader = mainDataService.getSelected();
				if (!rfqHeader) {

					platformModalService.showMsgBox('procurement.pricecomparison.selectOnRfqFirstly', 'cloud.common.informationDialogHeader', 'info');
					return;
				}
				// check if existed boqItems of qtn_header.
				// show dialog.
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/common-create-wic-from-boq.html',
					width: '700px',
					resizeable: true,
					isShowQtnLookup: true,
					CurrencyFk: rfqHeader.CurrencyFk,
					headerText: $translate.instant('procurement.common.createWicFromBoqWizardTitle')
				});
			};

			service.itemEvaluation = function () {
				let rfqHeader = mainDataService.getSelected();
				if (!rfqHeader) {
					platformModalService.showMsgBox('procurement.pricecomparison.selectOnRfqFirstly', 'cloud.common.informationDialogHeader', 'info');
					return;
				}
				itemEvaluationService.load().then(function () {
					// show dialog.
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/price-comparison-item-evaluation-wizard-view.html',
						width: '800px',
						resizeable: true,
						headerText: $translate.instant('procurement.pricecomparison.itemEvaluation.setAdHocPrice')
					});
				});
			};

			service.copyNewBoqItem = function () {
				const quote = boqService.selectedQuote;
				return quoteWizardsService.doCopyNewBoqItem({
					Id: quote && quote.QtnHeaderId ? quote.QtnHeaderId : null,
					RfqHeaderFk: quote && quote.RfqHeaderId ? quote.RfqHeaderId : -1,
					IsIdealBidder: !!(quote && quote.IsIdealBidder)
				}).then((result) => {
					return result && result.copied ? commonService.showReloadInfoDialog([boqService, itemService], 'procurement.pricecomparison.savedAskReload') : result;
				});
			};

			service.copyMaterialItem = function (){
				const quote = itemService.selectedQuote;
				return quoteWizardsService.doCopyMaterialItem({
					RfqHeaderFk: quote && quote.RfqHeaderId ? quote.RfqHeaderId : -1
				}).then((result) => {
					return result && result.copied ? commonService.showReloadInfoDialog([boqService, itemService], 'procurement.pricecomparison.savedAskReload') : result;
				});
			}

			function resetExportConfig() {
				boqConfig.hide.columns = [];
				boqConfig.hide.quoteFields = [];
				boqConfig.hide.compareFields = [];

				itemConfig.hide.columns = [];
				itemConfig.hide.quoteFields = [];
				itemConfig.hide.compareFields = [];
			}

			function mergeWithRequiredFields(rows, requiredFields, additionalFields, exportHideRows) {
				if (additionalFields) {
					rows = _.concat(rows, additionalFields);
				}
				return _.map(rows, row => {
					let cloneRow = _.clone(row);
					let isRequired = _.includes(requiredFields, cloneRow.Field);
					if (isRequired && !cloneRow.Visible) {
						exportHideRows.push(cloneRow.Field);
					}
					cloneRow.Visible = isRequired ? true : cloneRow.Visible;
					return cloneRow;
				});
			}

			function updateCompareConfig(items, additionalFields, compareType) {
				let isItemCompareType = compareType === commonService.constant.compareType.prcItem;
				let lookupName = isItemCompareType ? 'ItemCustomRow' : 'BoqCustomRow';
				_.each(items, item => {
					let rows = item[lookupName];
					if (rows) {
						_.each(rows, row => {
							let target = _.find(additionalFields, {Id: row.Id});
							if (target) {
								if (isItemCompareType) {
									row.FieldName = translationDescriptionService.getItemDisplayText(row.Field, null, row.DefaultDescription);
									row.DisplayName = translationDescriptionService.getItemDisplayText(row.Field, row.UserLabelName, row.DefaultDescription);
								} else {
									row.FieldName = translationDescriptionService.getBoqDisplayText(row.Field, null, row.DefaultDescription);
									row.DisplayName = translationDescriptionService.getBoqDisplayText(row.Field, row.UserLabelName, row.DefaultDescription);
								}
							}
						});
					}
				});
			}

			function filterBoqRows(items) {
				let summaryTypes = boqService.getCustomSettingsTypeSummaryFields();
				return summaryTypes.checkedLineTypes.length ? items : items.filter(item => !_.includes(commonService.boqSummaryFileds, item.BoqLineTypeFk));
			}

			function getItemData() {
				let readData = {
					rfqHeaderId: mainDataService.getIfSelectedIdElse(-1),
					compareType: commonService.constant.compareType.prcItem,
					CompareQuoteRows: mergeWithRequiredFields(itemService.getCustomSettingsCompareQuoteRows(), itemConfig.required.quoteFields, null, itemConfig.hide.quoteFields),
					CompareBillingSchemaRows: itemService.getCustomSettingsCompareBillingSchemaRows(),
					CompareRows: mergeWithRequiredFields(itemService.getCustomSettingsCompareRows(), itemConfig.required.compareFields, itemConfig.required.additionalFields, itemConfig.hide.compareFields),
					CompareBaseColumns: itemService.getCustomSettingsCompareColumns()
				};
				return itemHelperService.loadData(readData, itemConfigService, itemDataStructureService, {
					isVerticalCompareRows: itemService.isVerticalCompareRows(),
					isFinalShowInTotal: itemService.isFinalShowInTotal(),
					onReadSuccess: function (items) {
						commonHelperService.updateCompareConfig(items, itemService.getCustomSettingsCompareRows(), itemService.getCustomSettingsCompareBillingSchemaRows(), itemService.getCustomSettingsCompareQuoteRows(), commonService.constant.compareType.prcItem);
						updateCompareConfig(items, itemConfig.required.additionalFields, commonService.constant.compareType.prcItem);
					}
				}).then(tree => {
					itemHelperService.reorderCompareColumns(itemConfigService, tree);
					return tree;
				});
			}

			function getBoqData() {
				let readData = {
					rfqHeaderId: mainDataService.getIfSelectedIdElse(-1),
					compareType: commonService.constant.compareType.boqItem,
					CompareQuoteRows: mergeWithRequiredFields(boqService.getCustomSettingsCompareQuoteRows(), boqConfig.required.quoteFields, null, boqConfig.hide.quoteFields),
					CompareBillingSchemaRows: boqService.getCustomSettingsCompareBillingSchemaRows(),
					CompareRows: mergeWithRequiredFields(boqService.getCustomSettingsCompareRows(), boqConfig.required.compareFields, boqConfig.required.additionalFields, boqConfig.hide.compareFields),
					CompareBaseColumns: boqService.getCustomSettingsCompareColumns(),
					RecalculateDisabled: !boqService.isCalculateAsPerAdjustedQuantity() && globals['loadBoQWithRecalculateDisabled'] !== false,
					IsCalculateAsPerAdjustedQuantity: boqService.isCalculateAsPerAdjustedQuantity()
				};
				return boqHelperService.loadData(readData, boqConfigService, boqDataStructureService, {
					onReadSuccess: function (items) {
						commonHelperService.updateCompareConfig(items, boqService.getCustomSettingsCompareRows(), boqService.getCustomSettingsCompareBillingSchemaRows(), boqService.getCustomSettingsCompareQuoteRows(), commonService.constant.compareType.boqItem);
						updateCompareConfig(items, boqConfig.required.additionalFields, commonService.constant.compareType.boqItem);
					},
					isVerticalCompareRows: boqService.isVerticalCompareRows(),
					isFinalShowInTotal: boqService.isFinalShowInTotal()
				}).then(tree => {
					boqHelperService.reorderCompareColumns(boqConfigService, tree);
					boqHelperService.recombineTreeByOptions(tree, boqService.getCustomSettingsTypeSummaryFields(), boqDataStructureService, boqConfigService);
					return tree;
				});
			}

			function loadAllColumns(compareType) {
				let configColumns = [];
				let grids = {
					boq: '8b9a53f0a1144c03b8447a99f7b38448',
					item: 'ef496d027ad34b1f8fe282b1d6692ded'
				};

				let isItemCompare = compareType === commonService.constant.compareType.prcItem;
				let gridId = isItemCompare ? grids.item : grids.boq;

				let config = mainViewService.getViewConfig(gridId);
				if (config && config.Propertyconfig) {
					configColumns = _.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
				}

				let option = {
					columnDomainFn: isItemCompare ? itemService.domainFn : boqService.domainFn,
					isVerticalCompareRows: isItemCompare ? itemService.isVerticalCompareRows() : boqService.isVerticalCompareRows(),
					isLineValueColumn: true,
					isFinalShowInTotal: false
				};

				return isItemCompare ? itemHelperService.loadColumns(itemConfigService, itemDataStructureService, configColumns, option) : boqHelperService.loadColumns(boqConfigService, boqDataStructureService, configColumns, option);
			}

			function buildColumns(columns, hideCompareFields, hideColumns) {
				let currColumns = [];
				_.forEach(columns, function columnIterator(col) {
					let column = _.clone(col);
					if (commonHelperService.isBidderColumn(column)) {
						let compareColumns = [];
						if (!column.hidden) {
							const columnInfo = commonHelperService.extractCompareInfoFromFieldName(column.field);
							if (_.includes(hideCompareFields, columnInfo.field)) {
								hideColumns.push(column.field);
							}
							compareColumns.push(column);
						}
						_.each(compareColumns, function (c) {
							let terms = c.field.split('_');
							let field = terms.length === 5 ? terms[4] : 'LineValue';
							let configCol = _.find(column.children, {field: field});
							if (configCol) {
								c.width = configCol.width;
							}
							c.groupName = column.groupName;
						});
						currColumns = currColumns.concat(compareColumns);
					} else {
						if (column.id && column.id !== 'indicator' && (!column.hidden || _.includes(exportRequiredColumns, column.field))) {
							if (_.includes(exportRequiredColumns, column.field) && column.hidden) {
								hideColumns.push(column.field);
							}
							let item = column;
							item.width = column.width;
							item.name = column.userLabelName || $translate.instant(item.name$tr$) || item.name;
							currColumns.push(item);
						}
					}
				});
				return currColumns;
			}

			function findRowRule(rows, currRow, rowIndex, columns, rules, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
				return rules.find(r => (_.isFunction(r.disabled) ? !r.disabled(rows, currRow, columns, null, -1, isVerticalCompareRows, lookupMap, userData, dataRowDic) : !r.disabled) && r.row(currRow, isVerticalCompareRows));
			}

			function findCellRule(rows, currRow, rowIndex, columns, currCol, colIndex, rowRule, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
				if (!rowRule) {
					return null;
				}
				return rowRule ? rowRule.cells.find(r => (_.isFunction(r.disabled) ? !r.disabled(rows, currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) : !r.disabled) && r.cell(currRow, currCol, isVerticalCompareRows)) : null;
			}

			function buildFormula(rows, currRow, rowIndex, columns, currCol, colIndex, rowRule, cellRule, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
				let formula = null;
				if (!rowRule || !cellRule) {
					return formula;
				}
				if (cellRule) {
					let result;
					let ruleExpReg = /{\s*(.+?)\s*}/g;
					let ruleFormula = _.isFunction(cellRule.formula) ? cellRule.formula(currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData) : cellRule.formula;
					formula = ruleFormula;
					while ((result = ruleExpReg.exec(ruleFormula))) {
						const matchValues = result[1].split('.');
						const lookupName = matchValues.length > 1 ? matchValues[0] : null;
						const dataRows = lookupName ? lookupMap[lookupName] : rows;
						const prop = matchValues.length > 1 ? matchValues[1] : matchValues[0];
						const propFn = cellRule.expression[prop];
						if (!_.isFunction(propFn)) {
							formula = null;
							if (globals.debugMode) {
								console.group(`error:formula: ${rowRule.label}`);
								console.error(`The function "${prop}" is not defined in rule "${rowRule.label}".`);
								console.groupEnd();
							}
							break;
						}
						let evaluatedValue = propFn(dataRows, currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic);
						if (_.includes([null, undefined, ''], evaluatedValue)) {
							formula = null;
							/*if (globals.debugMode) {
								console.groupCollapsed(`warn:formula: ${rowRule.label}`);
								console.warn(`The expression "${prop}" in rule "${rowRule.label}" does not hit the target.`);
								console.log(`row.index = ${rowIndex}, row.Id = "${currRow.Id}", col.index = ${colIndex}, col.field = "${currCol.field}", vertical = ${isVerticalCompareRows}`);
								console.groupEnd();
							}*/
							break;
						}
						formula = formula.replace(new RegExp('{\\s*' + (lookupName ? lookupName + '\\.' : '') + prop + '\\s*}', 'g'), (lookupName ? '\'' + lookupName + '\'!' : '') + evaluatedValue);
					}
				}

				return formula;
			}

			function getTreeImage(formattedValue) {
				let reg = /<i\s+class="([\s\S]+)">.*?<\/i>/;
				let imageValue = 'ico-folder-empty';
				if (formattedValue && _.isString(formattedValue) && reg.test(formattedValue)) {
					imageValue = _.last(reg.exec(formattedValue)[1].split(' '));
				}
				return imageValue;
			}

			function buildHeader(columns, hideColumns) {
				let headers = [];
				_.each(columns, function thIterator(col) {
					let width = 100;
					if (col.width) {
						width = col.width;
					}
					headers.push({
						Field: col.field,
						Name: col.name,
						Width: width,
						IsHidden: _.includes(hideColumns, col.field),
						Span: 1,
						IsDynamic: col.isDynamic ? col.isDynamic : false
					});
				});
				return headers;
			}

			function buildHeaderGroup(columns) {
				let groups = [];
				let bidderHeaders = [];

				let bidders = _.map(columns, function (column) {
					if (column.quoteKey) {
						return {quoteKey: column.quoteKey, name: column.groupName};
					}
				});
				bidders = _.uniqBy(_.filter(bidders, bidder => !!bidder), 'quoteKey');

				_.forEach(bidders, bidder => {
					let width = 100;
					let span = 1;
					let innerColumns = _.filter(columns, col => {
						return col.field.indexOf(bidder.quoteKey) > -1;
					});
					if (innerColumns && innerColumns.length > 0) {
						span = innerColumns.length;
						width = _.sumBy(innerColumns, item => {
							return item.width ? item.width : width;
						});
					}
					bidderHeaders.push({
						Field: bidder.quoteKey,
						Name: bidder.name,
						Span: span,
						Width: width,
						Visible: true
					});
				});

				_.forEach(columns, col => {
					if (col.isDynamic) {
						let bidderHeader = _.find(bidderHeaders, bidder => {
							return col.field.indexOf(bidder.Field) > -1;
						});
						let group = bidderHeader ? _.find(groups, group => {
							return group.Field === bidderHeader.Field;
						}) : null;
						if (bidderHeader && !group) {
							groups.push(bidderHeader);
						}
					} else {
						let width = 100;
						if (col.width) {
							width = col.width;
						}
						groups.push({
							Field: col.field,
							Name: col.name,
							Span: 1,
							Width: width,
							Visible: true
						});
					}
				});
				return groups;
			}

			function buildSimpleCell(cell, value, valueType, formattedValue, styles, formula, formatCode) {
				if (value !== null && value !== undefined && value !== '') {
					cell.v = value;
				}

				if (valueType) {
					cell.vt = buildSimpleValueType(valueType);
				}

				if (formattedValue !== '') {
					cell.fv = formattedValue;
				}

				if (styles && styles.length) {
					cell.st = styles;
				}

				if (formula) {
					cell.fm = formula;
				}

				if (formatCode) {
					cell.fc = formatCode;
				}

				return cell;
			}

			function buildSimpleRow(row, level, hidden, styles) {
				if (level > 0) {
					row.lv = level;
				}

				if (hidden) {
					row.h = hidden;
				}

				if (styles && styles.length) {
					row.st = styles;
				}

				return row;
			}

			function buildSimpleValueType(valueType) {
				switch (valueType) {
					case 'Decimal':
						return 0;
					case 'Integer':
						return 1;
					case 'Boolean':
						return 2;
					case 'Date':
						return 3;
					case 'Image':
						return 4;
					default :
						return null;
				}
			}

			function isPrcItemRowFormulaSupported(row, isVerticalCompareRows) {
				if (!isVerticalCompareRows) {
					return !itemConfig.formula.excludeRows.includes(row.rowType);
				}
				return true;
			}

			function isBoqItemRowFormulaSupported(row, isVerticalCompareRows) {
				if (!isVerticalCompareRows) {
					return !boqConfig.formula.excludeRows.includes(row.rowType);
				}
				return true;
			}

			function isPrcItemColumnFormulaSupported(column, isVerticalCompareRows) {
				if (!isVerticalCompareRows) {
					return !itemConfig.formula.excludeColumns.includes(column.field);
				}
				return true;
			}

			function isBoqItemColumnFormulaSupported(column, isVerticalCompareRows) {
				if (!isVerticalCompareRows) {
					return !boqConfig.formula.excludeColumns.includes(column.field);
				}
				return true;
			}

			function isRowFormulaSupported(row, isCompareItem, isVerticalCompareRows) {
				return isCompareItem ? isPrcItemRowFormulaSupported(row, isVerticalCompareRows) : isBoqItemRowFormulaSupported(row, isVerticalCompareRows);
			}

			function isColumnFormulaSupported(column, isCompareItem, isVerticalCompareRows) {
				return isCompareItem ? isPrcItemColumnFormulaSupported(column, isVerticalCompareRows) : isBoqItemColumnFormulaSupported(column, isVerticalCompareRows);
			}

			function buildDataRow(columns, dataRows, compareType, isVerticalCompareRows, userData, isExportedFormula, buildType, showProgressMessage) {
				let reg = /<[^<>]+>/g;
				let isCompareItem = compareType === commonService.constant.compareType.prcItem;
				let formulaRules = isCompareItem ? itemFormulaService.itemExportExcelFormulaRules : boqFormulaService.boqExportExcelFormulaRules;

				const bidderColumns = _.filter(columns, column => commonHelperService.isLineValueColumn(column) && checkBidderService.isNotReference(column.field) && !column.isIdealBidder);
				const countInTargetColumnIds = _.filter(userData.visibleCompareColumnsCache, item => item.IsCountInTarget).map(item => item.Id);
				const dataRowDic = {
					rows: commonHelperService.toDictionary(dataRows, 'Id', true),
					columns: commonHelperService.toDictionary(columns, 'field', true),
					bidderColumns: bidderColumns,
					countInTargetColumns: _.filter(bidderColumns, bidderColumn => {
						return _.includes(countInTargetColumnIds, bidderColumn.id);
					})
				}
				const chunks = _.chunk(dataRows, 1000).map(chunk => {
					return {status: false, rows: chunk};
				});

				const showBuildProgressMessage = function (buildType, chunks) {
					const complete = chunks.filter(c => c.status);
					const container = buildType === 'boq' ? 'procurement.pricecomparison.priceComparisonBoqTitle' : 'procurement.pricecomparison.priceCompareTitle';
					const percent = parseFloat(complete.length / chunks.length * 100).toFixed(2) + '%';
					showProgressMessage($translate.instant('procurement.pricecomparison.wizard.buildExportDataFor', {p1: $translate.instant(container), p2: percent}));
				}
				const buildQueues = chunks.map(chunk => {
					return () => {
						return new Promise((resolve) => {
							setTimeout(() => {
								let rows = [];
								_.each(chunk.rows, function dataRowIterator(row, rowIndex) {
									let isTargetRow = isCompareItem ? commonHelperService.isPrcItemRow(row.LineType) : commonHelperService.isBoqRow(row.BoqLineTypeFk);
									let rowReader = isCompareItem ? itemConfigService.getRowReader(row) : boqConfigService.getRowReader(row);
									const rowRule = isExportedFormula && isRowFormulaSupported(row, isCompareItem, isVerticalCompareRows) ? findRowRule(dataRows, row, rowIndex, columns, formulaRules, isVerticalCompareRows, lookupMap, userData, dataRowDic) : null;
									let cells = _.map(columns, function formatIterator(col, columnIndex) {
										let cellReader = isCompareItem ? itemConfigService.getCellReader(row, col, rowReader) : boqConfigService.getCellReader(row, col, rowReader);
										let originalValue = isCompareItem ? itemConfigService.readCellValue(row, col, cellReader) : boqConfigService.readCellValue(row, col, cellReader);
										let valueType = isCompareItem ? itemConfigService.readCellValueType(row, col, cellReader) : boqConfigService.readCellValueType(row, col, cellReader);
										let formatCode = isCompareItem ? itemConfigService.readCellFormatCode(row, col, cellReader) : boqConfigService.readCellFormatCode(row, col, cellReader);

										let formatter = col.formatter && _.isString(col.formatter) ? platformGridDomainService.formatter(col.formatter) : col.formatter;
										let formattedValue = _.isFunction(formatter) ? formatter(rowIndex, columnIndex, originalValue, col, row, null, null, col.formatterOptions) : originalValue;

										let styles = [];
										let colorValue = getColorValue(formattedValue);
										if (colorValue) {
											styles.push({Name: 'FONT.COLOR', Value: colorValue});
										}

										if (col.id === 'tree') {
											valueType = 'Image';
											originalValue = row.image || getTreeImage(formattedValue);
										}

										if (isTargetRow && _.includes([commonService.itemCompareFields.budgetPerUnit, commonService.itemCompareFields.budgetTotal], col.field)) {
											valueType = 'Decimal'; // TODO: Resolve ALM 137240 temporary, it should be determine in cell reader function.
										}

										if (commonHelperService.isAverageMaxMinCol(col)) {
											valueType = 'Decimal'; // average,max,min are always decimal.
											if (_.includes([commonService.itemCompareFields.uomFk, commonService.itemCompareFields.prcItemEvaluationFk, boqCompareRows.notSubmitted], row.rowType)) {
												originalValue = null;
											}

											if (row.rowType === commonService.itemCompareFields.percentage) {
												formatCode = '0.00%';
											}
										}

										if (_.isString(formattedValue)) {
											formattedValue = commonHelperService.clearButtonTag(formattedValue);
											formattedValue = formattedValue.replace(reg, '');
										}

										const cellRule = rowRule && _.includes(['Decimal', 'Integer'], valueType) && isColumnFormulaSupported(columns, isCompareItem, isVerticalCompareRows) ? findCellRule(dataRows, row, rowIndex, columns, col, columnIndex, rowRule, isVerticalCompareRows, lookupMap, userData, dataRowDic) : null;
										const cellFormula = cellRule ? buildFormula(dataRows, row, rowIndex, columns, col, columnIndex, rowRule, cellRule, isVerticalCompareRows, lookupMap, userData, dataRowDic) : '';
										const cellValue = _.includes([commonService.constant.tagForNoQuote], originalValue) ? null : originalValue;
										const cellFormattedValue = !_.includes([null, 'null', undefined, 'undefined'], formattedValue) ? formattedValue.toString().trim() : '';

										/*if (cellFormula) {
											styles.push({Name: 'FILL.BG.COLOR', Value: 'RGBA:239,59,239,1'});
										}*/

										return buildSimpleCell({
											f: col.field
										}, cellValue, valueType, cellFormattedValue, styles, cellFormula, formatCode);
									});

									let cssClasses = _.isString(row.cssClass) ? row.cssClass.split(' ') : [];
									let styles = [];
									if (cssClasses.length) {
										if (cssClasses.includes('font-bold')) {
											styles.push({Name: 'FONT.BOLD', Value: true});
										}
									}

									let hasChildren = row.nodeInfo && row.nodeInfo.children;
									if (hasChildren) {
										styles.push({Name: 'FILL.BG.COLOR', Value: 'RGBA:245,245,245,1'});
									}

									let isHidden = row._rt$Deleted;
									if (!row._rt$Deleted) {
										if (commonHelperService.isCompareFieldRow(isCompareItem ? row.LineType : row.BoqLineTypeFk)) {
											isHidden = _.includes(isCompareItem ? itemConfig.hide.compareFields : boqConfig.hide.compareFields, row.rowType);
										} else if (commonHelperService.isQuoteFieldRow(row)) {
											isHidden = _.includes(isCompareItem ? itemConfig.hide.quoteFields : boqConfig.hide.quoteFields, row.QuoteField);
										}
									}

									const level = row.nodeInfo ? row.nodeInfo.level : 0;
									const hidden = row._rt$Deleted || isHidden;

									rows.push(buildSimpleRow({
										cl: cells,
									}, level, hidden, styles));
								});
								chunk.status = true;
								showBuildProgressMessage(buildType, chunks);
								resolve(rows);
							}, 10);
						});
					};
				});
				return _.reduce(buildQueues, (chain, fn) => {
					return chain.then(results => {
						return fn().then(items => {
							return _.concat(results, items);
						});
					});
				}, Promise.resolve([]));
			}

			function getColorValue(value) {
				if (!value) {
					return null;
				}

				let colorValue = null;
				let regResult = null;
				let regExp = /color\s*:\s*([\s\S]+?);/g;
				while ((regResult = regExp.exec(value))) {
					colorValue = regResult[1];
				}
				if (colorValue) {
					let clearValue = colorValue.trim().toLowerCase();
					if (clearValue.startsWith('rgb')) {
						colorValue = 'RGB:' + clearValue.replace('rgb', '').replace('(', '').replace(')', '');
					} else if (clearValue.startsWith('rgba')) {
						colorValue = 'RGBA:' + clearValue.replace('rgba', '').replace('(', '').replace(')', '');
					} else if (clearValue.startsWith('#')) {
						colorValue = '#:' + clearValue.replace('#', '');
					} else {
						colorValue = 'N:' + clearValue;
					}
				}

				return colorValue;
			}

			function buildVatPercentLookupDataRows(lookupItems) {
				let list = _.map(lookupItems, item => {
					return {
						lv: 0,
						cl: [
							{
								f: 'Code',
								fv: item.Code
							},
							{
								f: 'Description',
								fv: item.DescriptionInfo ? item.DescriptionInfo.Translated : null
							},
							{
								f: 'VatPercent',
								v: item.VatPercent,
								vt: buildSimpleValueType('Decimal'),
								fv: item.VatPercent,
							}
						]
					};
				});

				list = _.concat(list, [
					{
						lv: 0,
						cl: [
							{
								f: 'Code',
								fv: '-'
							},
							{
								f: 'Description',
								fv: '-'
							},
							{
								f: 'VatPercent',
								v: 0,
								vt: buildSimpleValueType('Decimal'),
								fv: '0.00',
							}
						]
					}
				]);
				return list;
			}

			return service;
		}
	]);
})(angular);