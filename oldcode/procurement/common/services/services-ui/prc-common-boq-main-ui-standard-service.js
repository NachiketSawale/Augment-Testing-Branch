/**
 * Created by sus on 2015/4/30.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var modName = 'procurement.common';

	angular.module(modName).factory('procurementCommonPrcBoqMainUIStandardService',
		['$translate', '$injector', 'boqMainStandardConfigurationServiceFactory', 'procurementContextService', 'prcBoqMainService',
			'platformTranslateService', 'boqMainDetailFormConfigService',
			function ($translate, $injector, boqMainStandardConfigurationServiceFactory, moduleContext, prcBoqMainService,
				platformTranslateService, boqMainDetailFormConfigService) {

				let cellHighlightColor = '#ffa';

				var copyData = function (data) {
					return angular.element.extend(true, {}, data);
				};
				var isReadonly = function getCellEditable(item) {
					var canEditFields = ['Cost', 'UnitRate', 'UnitRateFrom', 'UnitRateTo', 'Urb1', 'Urb2', 'Urb3', 'Urb4',
						'Urb5', 'Urb6', 'Price', 'DiscountPercent', 'DiscountedUnitprice', 'DiscountedPrice', 'Discount',
						'DiscountText', 'CommentContractor', 'CommentClient', 'Quantity', 'Reference', 'BriefInfo',
						'IsLumpsum', 'LumpsumPrice', 'DiscountPercentIt', 'IsFreeQuantity'];
					return canEditFields.indexOf(item.model || item.field) === -1;
				};

				return getConfigurationsAboutReadonly(isReadonly);

				// get configuration some field or model is readonly
				function getConfigurationsAboutReadonly(isReadonly) {
					var result = {isReadonly: isReadonly};
					var currentBoqMainService = null;

					result.setCurrentBoqMainService = function setCurrentBoqMainService(prcBoqMainService) {
						currentBoqMainService = prcBoqMainService;
					};

					result.getStandardConfigForDetailView = function (moduleName) {

						moduleName = moduleName || moduleContext.getModuleName();

						// Hint: Moved the creation  of the boqMainStandardConfigurationService to this place to be able to dynamically react on
						// the current value of the module name that changes between the different modules this general UI service is used in.
						var boqMainStandardConfigurationServiceOption = {isBaseBoq: false};
						if (moduleName === 'procurement.package') {
							boqMainStandardConfigurationServiceOption.isBaseBoq = true;
						}
						boqMainStandardConfigurationServiceOption.currentBoqMainService = currentBoqMainService;
						var configurationsService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService(boqMainStandardConfigurationServiceOption);

						var allDetailColumns = configurationsService.getStandardConfigForDetailView().rows;
						var findIndex = -1;
						if (allDetailColumns && allDetailColumns.length) {
							findIndex = _.findIndex(allDetailColumns, {'rid': 'rule'});
							allDetailColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allDetailColumns, {'rid': 'param'});
							allDetailColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allDetailColumns, {'rid': 'ruleformula'});
							allDetailColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allDetailColumns, {'rid': 'ruleformuladesc'});
							allDetailColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allDetailColumns, {'rid': 'divisiontypeassignment'});
							allDetailColumns.splice(findIndex, 1);

							findIndex = _.findIndex(configurationsService.getStandardConfigForDetailView().groups, {'gid': 'ruleAndParam'});
							configurationsService.getStandardConfigForDetailView().groups.splice(findIndex, 1);

						}

						result.isReadonly = result.isReadonly || configurationsService.isReadonly;

						let detailCopied = copyData(configurationsService.getStandardConfigForDetailView());
						addValidator(detailCopied);

						if (moduleName === 'procurement.quote') {
							// eslint-disable-next-line no-tabs
							//	return patchStandardConfigForDetailView(getConfigure(configurationsService,result.isReadonly || function(){return true;},!result.isReadonly));
							addRowIsContracted(detailCopied.rows);
							return patchStandardConfigForDetailView(detailCopied);
						} else {

							if (!boqMainStandardConfigurationServiceOption.isBaseBoq) {
								enhanceReferenceByInputSelectForDetailView(detailCopied);
							}

							// todo: temp fix
							if (moduleContext.getModuleName() === 'procurement.pes') {
								addRows(detailCopied.rows);
								enhancePriceForDetailView(detailCopied);
							}

							if (moduleContext.getModuleName() === 'procurement.package' ||
								moduleContext.getModuleName() === 'procurement.requisition') {
								addRowIsContracted(detailCopied.rows);
							}
							platformTranslateService.translateFormConfig(detailCopied);
							return detailCopied;
						}
					};

					result.getStandardConfigForListView = function (moduleName) {

						moduleName = moduleName || moduleContext.getModuleName();

						// Hint: Moved the creation  of the boqMainStandardConfigurationService to this place to be able to dynamically react on
						// the current value of the module name that changes between the different modules this general UI service is used in.
						var boqMainStandardConfigurationServiceOption = {
							isBaseBoq: false,
							moduleName: moduleName
						};
						if (moduleName === 'procurement.package') {
							boqMainStandardConfigurationServiceOption.isBaseBoq = true;
						}
						boqMainStandardConfigurationServiceOption.currentBoqMainService = currentBoqMainService;
						var configurationsService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService(boqMainStandardConfigurationServiceOption);

						// hidden the column rule and param on Package module
						var allListColumns = configurationsService.getStandardConfigForListView().columns;

						var findIndex = -1;
						if (allListColumns && allListColumns.length) {
							findIndex = _.findIndex(allListColumns, {'id': 'rule'});
							allListColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allListColumns, {'id': 'param'});
							allListColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allListColumns, {'id': 'ruleformula'});
							allListColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allListColumns, {'id': 'ruleformuladesc'});
							allListColumns.splice(findIndex, 1);

							findIndex = _.findIndex(allListColumns, {'id': 'divisiontypeassignment'});
							allListColumns.splice(findIndex, 1);

							var controllingUnit = _.find(allListColumns, {id: 'mdccontrollingunitfk'});
							if (controllingUnit) {
								var currentboqMainService = prcBoqMainService.getService(moduleContext.getMainService());
								controllingUnit.editorOptions.lookupOptions.filterKey = 'prc-boq-controlling-unit-filter';
								controllingUnit.editorOptions.lookupOptions.selectableCallback = function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, currentboqMainService);
								};
							}
						}

						result.isReadonly = result.isReadonly || configurationsService.isReadonly;

						if (moduleName === 'procurement.quote') {
							// eslint-disable-next-line no-tabs
							//	return patchStandardConfigForListView(getColumns(configurationsService,result.isReadonly || function(){return true;},!result.isReadonly));
							let gridCopied = copyData(configurationsService.getStandardConfigForListView());
							addColIsContracted(gridCopied.columns);
							addColExQtnIsEvaluated(gridCopied.columns);
							return patchStandardConfigForListView(gridCopied);
						} else {
							var listView = copyData(configurationsService.getStandardConfigForListView());

							if (!boqMainStandardConfigurationServiceOption.isBaseBoq) {
								enhanceReferenceByInputSelectForListView(listView);
							}

							if (moduleName === 'procurement.pes') {
								addColumns(listView.columns);
								enhancePriceForListView(listView);
							}

							if (moduleName === 'procurement.package' ||
								moduleName === 'procurement.requisition') {
								addColIsContracted(listView.columns);
							}

							return listView;
						}
					};

					result.getDtoScheme = function () {
						// Reroot this call to boqMainStandardConfigurationServiceFactory
						var configurationsService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService();
						var dtoScheme = null;
						if (configurationsService) {
							dtoScheme = configurationsService.getDtoScheme();
						}
						return dtoScheme;
					};

					return result;

					function patchStandardConfigForListView(grids) {
						var itemEvaluation = {
							id: 'prcitemevaluationfk',
							field: 'PrcItemEvaluationFk',
							name: 'Procurement Item Evaluation',
							name$tr$: 'boq.main.PrcItemEvaluationFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcItemEvaluation',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'procurement-common-prc-item-evaluation-combobox'
							},
							width: 100
						};
						var column = _.find(grids.columns, {field: 'PrcItemEvaluationFk'});
						if (column) {
							// noinspection JSUnusedAssignment
							column = angular.extend(column, itemEvaluation);
						} else {
							grids.columns.push(column);
						}

						return grids;
					}

					function patchStandardConfigForDetailView(details) {
						var itemEvaluation = {
							gid: 'PrcItemEvaluationFk',
							rid: 'prcitemevaluationfk',
							model: 'PrcItemEvaluationFk',
							// label: 'Procurement Item Evaluation', //note: already translated before merger
							label$tr$: 'boq.main.PrcItemEvaluationFk',
							type: 'directive',
							directive: 'procurement-common-prc-item-evaluation-combobox',
							options: {
								showClearButton: true
							}
						};
						var detail = _.find(details.rows, {model: 'PrcItemEvaluationFk'});
						if (detail) {
							// noinspection JSUnusedAssignment
							detail = angular.extend(detail, itemEvaluation);
						} else {
							details.rows.push(detail);
						}
						return details;
					}

					function addColumns(cols) {
						var newCols = [
							{
								field: 'PrevQuantity',
								formatter: 'quantity',
								id: 'previousquantity',
								name: 'Previous Quantity',
								name$tr$: 'boq.main.previousQuantity',
								sortable: true,
								toolTip: 'Previous Quantity',
								toolTip$tr$: 'boq.main.previousQuantity'
							},
							{
								editor: 'quantity',
								field: 'TotalQuantity',
								// formatter: 'quantity',
								formatter: boqMainDetailFormConfigService.totalQuantityFormatter,
								id: 'totalquantity',
								name: 'Total Quantity',
								name$tr$: 'boq.main.totalQuantity',
								sortable: true,
								toolTip: 'Total Quantity',
								toolTip$tr$: 'boq.main.totalQuantity'
							},
							{
								field: 'OrdQuantity',
								formatter: 'quantity',
								id: 'ordquantity',
								name: 'Contract Quantity',
								name$tr$: 'boq.main.contractQuantity',
								sortable: true,
								toolTip: 'Contract Quantity',
								toolTip$tr$: 'boq.main.contractQuantity'
							},
							{
								field: 'PercentageQuantity',
								formatter: 'percent',
								editor: 'percent',
								sortable: true,
								bulkSupport: false,
								id: 'percentagequantity',
								name: 'Percentage Quantity',
								name$tr$: 'procurement.pes.percentageQuantity'
							},
							{
								field: 'QuantityTarget',
								formatter: 'quantity',
								editor: 'quantity',
								id: 'quantitytarget',
								name$tr$: 'boq.main.QuantityTarget',
								sortable: true
							},
							{
								field: 'CumulativePercentage',
								formatter: 'percent',
								editor: 'percent',
								sortable: true,
								bulkSupport: false,
								id: 'cumulativepercentage',
								name: 'Cumulative Percentage',
								name$tr$: 'boq.main.CumulativePercentage'
							},
							{
								field: 'RemQuantity',
								formatter: 'quantity',
								id: 'remquantity',
								name: 'Remaining Quantity',
								name$tr$: 'boq.main.remainingQuantity',
								sortable: true,
								toolTip: 'Remaining Quantity',
								toolTip$tr$: 'boq.main.remainingQuantity'
							},
							{
								field: 'PreEscalationTotal',
								formatter: 'money',
								id: 'preescalationtotal',
								name: 'Pre Escalation Total',
								name$tr$: 'boq.main.PreEscalationTotal',
								sortable: true,
								toolTip: 'Pre Escalation Total',
								toolTip$tr$: 'boq.main.PreEscalationTotal'
							},
							{
								field: 'ExtraPrevious',
								formatter: 'money',
								id: 'extraprevious',
								name: 'Extra Previous',
								name$tr$: 'boq.main.ExtraPrevious',
								sortable: true,
								toolTip: 'Extra Previous',
								toolTip$tr$: 'boq.main.ExtraPrevious'
							},
							{
								field: 'ExtraTotal',
								formatter: 'money',
								id: 'extratotal',
								name: 'Extra Total',
								name$tr$: 'boq.main.ExtraTotal',
								sortable: true,
								toolTip: 'Extra Total',
								toolTip$tr$: 'boq.main.ExtraTotal'
							},
							{
								field: 'TotalPrice',
								formatter: 'money',
								editor: 'money',
								id: 'totalprice',
								name: 'Total Price',
								name$tr$: 'boq.main.totalPrice',
								sortable: true,
								toolTip: 'Total Price',
								toolTip$tr$: 'boq.main.totalPrice'
							},
							{
								field: 'TotalPriceOc',
								id: 'totalpriceoc',
								formatter: 'money',
								name$tr$: 'boq.main.TotalPriceOc',
								sortable: true
							},
							{
								field: 'ItemTotalEditable',
								formatter: 'money',
								editor: 'money',
								id: 'itemtotaleditable',
								name: 'Item Total Editable',
								name$tr$: 'boq.main.ItemTotalEditable',
								sortable: true,
								toolTip: 'Item Total Editable',
								toolTip$tr$: 'boq.main.ItemTotalEditable'
							},
							{
							field: 'ItemTotalEditableOc',
							formatter: 'money',
							editor: 'money',
							id: 'itemtotaleditableoc',
							name: 'Item Total Editable (OC)',
							name$tr$: 'boq.main.ItemTotalEditableOc',
							sortable: true,
							toolTip: 'Item Total Editable (OC)',
							toolTip$tr$: 'boq.main.ItemTotalEditableOc'
							},
							{
								field: 'PreviousPrice',
								formatter: 'money',
								id: 'previousprice',
								name: 'Previous Price',
								name$tr$: 'boq.main.previousPrice',
								sortable: true
							},
							{
								field: 'TotalHours',
								formatter: 'quantity',
								id: 'totalhours',
								name: 'Total Hours',
								name$tr$: 'boq.main.totalHours',
								sortable: true,
								toolTip: 'Total Hours',
								toolTip$tr$: 'boq.main.totalHours'
							}];
						boqMainDetailFormConfigService.attachDecimalPlacesBasedOnRoundingConfigForRowsOrColumns(newCols, false, currentBoqMainService);
						angular.forEach(newCols, function (col) {
							cols.push(col);
						});
						return cols;
					}

					function addRows(rows) {
						var rowCount = _.isArray(rows) ? rows.length : 0;
						var newRows = [
							{
								gid: 'QuantityPrice',
								label: 'Previous Quantity',
								label$tr$: 'boq.main.previousQuantity',
								model: 'PrevQuantity',
								readonly: true,
								required: false,
								rid: 'prevquantity',
								sortOrder: ++rowCount,
								type: 'quantity'
							},
							{
								gid: 'QuantityPrice',
								label: 'Total Quantity',
								label$tr$: 'boq.main.totalQuantity',
								model: 'TotalQuantity',
								required: false,
								rid: 'totalquantity',
								sortOrder: ++rowCount,
								type: 'quantity'
							},
							{
								gid: 'QuantityPrice',
								label: 'Contract Quantity',
								label$tr$: 'boq.main.contractQuantity',
								model: 'OrdQuantity',
								readonly: true,
								required: false,
								rid: 'ordquantity',
								sortOrder: ++rowCount,
								type: 'quantity'
							},
							{
								gid: 'QuantityPrice',
								rid: 'percentagequantity',
								label: 'Percentage Quantity',
								label$tr$: 'procurement.pes.percentageQuantity',
								model: 'PercentageQuantity',
								required: false,
								sortOrder: ++rowCount,
								type: 'percent'
							},
							{
								gid: 'QuantityPrice',
								label$tr$: 'boq.main.QuantityTarget',
								model: 'QuantityTarget',
								readonly: true,
								required: false,
								rid: 'quantitytarget',
								sortOrder: ++rowCount,
								type: 'quantity'
							},
							{
								gid: 'QuantityPrice',
								rid: 'cumulativepercentage',
								label: 'Cumulative Percentage',
								label$tr$: 'boq.main.CumulativePercentage',
								model: 'CumulativePercentage',
								required: false,
								sortOrder: ++rowCount,
								type: 'percent'
							},
							{
								gid: 'QuantityPrice',
								label: 'Remaining Quantity',
								label$tr$: 'boq.main.remainingQuantity',
								model: 'RemQuantity',
								readonly: true,
								required: false,
								rid: 'remquantity',
								sortOrder: ++rowCount,
								type: 'quantity'
							},
							{
								gid: 'QuantityPrice',
								label: 'Pre Escalation Total',
								label$tr$: 'boq.main.PreEscalationTotal',
								model: 'PreEscalationTotal',
								readonly: true,
								required: false,
								rid: 'preescalationtotal',
								sortOrder: ++rowCount,
								type: 'money'
							},
							{
								gid: 'QuantityPrice',
								label: 'Extra Previous',
								label$tr$: 'boq.main.ExtraPrevious',
								model: 'ExtraPrevious',
								readonly: true,
								required: false,
								rid: 'extraprevious',
								sortOrder: ++rowCount,
								type: 'money'
							},
							{
								gid: 'QuantityPrice',
								label: 'Extra Total',
								label$tr$: 'boq.main.ExtraTotal',
								model: 'ExtraTotal',
								readonly: true,
								required: false,
								rid: 'extratotal',
								sortOrder: ++rowCount,
								type: 'money'
							},
							{
								gid: 'QuantityPrice',
								label: 'Total Price',
								label$tr$: 'boq.main.totalPrice',
								model: 'TotalPrice',
								required: false,
								rid: 'totalprice',
								sortOrder: ++rowCount,
								type: 'money'
							},
							{
								gid: 'QuantityPrice',
								label$tr$: 'boq.main.TotalPriceOc',
								model: 'TotalPriceOc',
								rid: 'totalpriceoc',
								type: 'money',
								readonly: true,
								sortOrder: ++rowCount
							},
							{
								gid: 'QuantityPrice',
								label: 'Item Total Editable',
								label$tr$: 'boq.main.ItemTotalEditable',
								model: 'ItemTotalEditable',
								required: false,
								rid: 'itemtotaleditable',
								sortOrder: ++rowCount,
								type: 'money'
							},
							{
								gid: 'QuantityPrice',
								rid: 'previousprice',
								label: 'Previous Price',
								label$tr$: 'boq.main.previousPrice',
								model: 'PreviousPrice',
								readonly: true,
								required: false,
								sortOrder: ++rowCount,
								type: 'money'
							},
							{
								gid: 'QuantityPrice',
								label: 'Total Hours',
								label$tr$: 'boq.main.totalHours',
								model: 'TotalHours',
								readonly: true,
								required: false,
								rid: 'totalhours',
								sortOrder: ++rowCount,
								type: 'quantity'
							}];
						boqMainDetailFormConfigService.attachDecimalPlacesBasedOnRoundingConfigForRowsOrColumns(newRows, true, currentBoqMainService);
						angular.forEach(newRows, function (row) {
							rows.push(row);
						});
					}

					function onValueApplied(item, field, boqMainService) {

						var boqMainCommonService = $injector.get('boqMainCommonService');
						var boqMainChangeService = $injector.get('boqMainChangeService');

						boqMainChangeService.reactOnChangeOfBoqItem(item, field, boqMainService, boqMainCommonService);
					}

					function enhanceReferenceByInputSelectForListView(grids) {

						var referenceColumn = _.find(grids.columns, {field: 'Reference'});

						var currentPrcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());

						if (referenceColumn) {
							referenceColumn.editor = 'directive';
							referenceColumn.editorOptions = {
								directive: 'boq-main-base-boq-reference-input',
								boqMainService: currentPrcBoqMainService,
								inputDomain: 'description'
							};

							// The following callback is called when the validation of the field succeeded and the value was applied.
							// This is very helpful when having asynchronous validations added to a property.
							// The '$$' prefix usually denotes a function not meant for official use, but after asking Kris about my problems
							// with asynchronous validation in the grid he allowed me to use it for it currently seems to be the only way to get
							// around the problems.
							referenceColumn.$$postApplyValue = function (grid, item, column) {
								onValueApplied(item, column.field, currentPrcBoqMainService);
							};
						}
					}

					function buildPriceForListView(col, fieldIsChanged) {
						if (col) {
							let originalPriceFormatter = col.formatter;
							col.formatter = function (row, cell, value, columnDef, dataContext) {
								// To be compatible for reporting print
								if (value === null) {
									value = dataContext[columnDef.field];
								}
								columnDef.domain='money';
								var highlightBg = '';
								var formatterVal = angular.isString(originalPriceFormatter) ?
									$injector.get('platformGridDomainService').formatter(originalPriceFormatter)(0, 0, value, {}) :
									originalPriceFormatter(row, cell, value, columnDef, dataContext);

								if (columnDef.field === 'Finalprice' || columnDef.field === 'FinalpriceOc') {
									return formatterVal;
								}

								if (dataContext[fieldIsChanged]) {
									highlightBg = 'background: ' + cellHighlightColor + ';';
								}
								return '<div style="' + highlightBg + 'width: 100%; height: 100%; top: 0;left: 0; text-align: right;box-sizing: border-box; /*padding-right: 4px; padding-top: 2px;*/">' + formatterVal + '</div>';
							};
						}
					}

					function buildPriceForDetailView(row, fieldIsChanged) {
						if (row) {
							row.type = 'directive';
							row.directive = 'procument-pes-item-highlight-cell-input';
							row.options = {
								'judgeIsHighlightField': fieldIsChanged,
								'hightlightColor': cellHighlightColor
							};
						}
					}

					function enhancePriceForListView(grids) {
						let priceCol = _.find(grids.columns, {field: 'Price'});
						let priceOcCol = _.find(grids.columns, {field: 'PriceOc'});

						buildPriceForListView(priceCol, 'IsPriceChanged');
						buildPriceForListView(priceOcCol, 'IsPriceOcChanged');
					}

					function enhanceReferenceByInputSelectForDetailView(details) {

						var referenceRow = _.find(details.rows, {'model': 'Reference'});

						var currentPrcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());

						if (referenceRow) {
							referenceRow.type = 'directive';
							referenceRow.directive = 'boq-main-base-boq-reference-input';
							referenceRow.options = {
								boqMainService: currentPrcBoqMainService,
								inputDomain: 'description',
								onValueApplied: onValueApplied
							};
						}
					}

					function enhancePriceForDetailView(details) {
						let priceRow = _.find(details.rows, {'model': 'Price'});
						let priceOcRow = _.find(details.rows, {'model': 'PriceOc'});

						buildPriceForDetailView(priceRow, 'IsPriceChanged');
						buildPriceForDetailView(priceOcRow, 'IsPriceOcChanged');
					}

					function addColIsContracted(cols) {
						cols.push({
							field: 'IsContracted',
							formatter: 'boolean',
							id: 'isContracted',
							name: 'Contracted in other PKG',
							name$tr$: 'procurement.common.entityIsContractedInOtherPkg',
							sortable: true,
							toolTip: 'Contracted in other PKG',
							toolTip$tr$: 'procurement.common.entityIsContractedInOtherPkg',
							width: 150
						});
					}

					function addColExQtnIsEvaluated(cols) {
						cols.push({
							field: 'ExQtnIsEvaluated',
							formatter: 'boolean',
							id: 'ExQtnIsEvaluated',
							editor:'boolean',
							name: 'Is Evaluated',
							name$tr$: 'procurement.common.entityExQtnIsEvaluated',
							sortable: true,
							toolTip: 'IsEvaluated',
							toolTip$tr$: 'procurement.common.entityExQtnIsEvaluated',
							readonly: false,
							width: 150
						});
					}

					function addRowIsContracted(rows) {
						var rowCount = _.isArray(rows) ? rows.length : 0;
						rows.push({
							gid: 'AdditionsBoq',
							label: 'Contracted in other PKG',
							label$tr$: 'procurement.common.entityIsContractedInOtherPkg',
							model: 'IsContracted',
							readonly: true,
							required: false,
							rid: 'isContracted',
							sortOrder: ++rowCount,
							type: 'boolean'
						});
					}

					function addValidator(formConfig) {
						let boqMainValidationServiceProvider = $injector.get('boqMainValidationServiceProvider');
						var currentboqMainService = prcBoqMainService.getService(moduleContext.getMainService());
						var validationService = boqMainValidationServiceProvider.getInstance(currentboqMainService);
						if (formConfig.addValidationAutomatically && !!validationService) {
							_.forEach(formConfig.rows, function (row) {
								var rowModel = row.model.replace(/\./g, '$');

								var syncName = 'validate' + rowModel;
								var asyncName = 'asyncValidate' + rowModel;

								if (validationService[syncName]) {
									row.validator = validationService[syncName];
								}

								if (validationService[asyncName]) {
									row.asyncValidator = validationService[asyncName];
								}
							});
						}
					}
				}
			}]);

})(angular);
