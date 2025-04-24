/**
 * Created by lnt on 05.06.2020.
 */

(function (angular) {
	/* global _, globals */

	'use strict';

	var modName = 'qto.main';

	angular.module(modName).factory('qtoReadOnlyProcessorFactory',
		['$injector','basicsCommonReadOnlyProcessor', 'basicsLookupdataLookupDescriptorService', 'qtoMainHeaderDataService', 'qtoHeaderReadOnlyProcessor', 'platformRuntimeDataService', 'qtoMainLineType', 'qtoMainFormulaType','qtoBoqType',
			function ($injector,commonReadOnlyProcessor, basicsLookupdataLookupDescriptorService, qtoMainHeaderDataService, qtoHeaderReadOnlyProcessor, runtimeDataService, qtoMainLineType, qtoMainFormulaType,qtoBoqType) {

				var factoryService = {};

				factoryService.createReadOnlyProcessorService = function (boqType) {
					let service = commonReadOnlyProcessor.createReadOnlyProcessor({
						uiStandardService: 'qtoMainUIStandardService',
						readOnlyFields: ['BoqItemFk', 'BasUomFk', 'PrjLocationFk', 'AssetMasterFk', 'BudgetCodeFk',
							'BudgetCodeDesc', 'ClassificationFk', 'ClassificationDesc', 'QtoLineTypeFk', 'QtoLineTypeDesc',
							'QtoFormulaFk', 'QtoFormulaDesc', 'Factor', 'Value1Detail', 'Operator1', 'Value2Detail',
							'Operator2', 'Value3Detail', 'Operator3', 'Value4Detail', 'Operator4', 'Value5Detail',
							'Operator5', 'FormulaResult', 'Result', 'SubTotal', 'IsBlocked', 'IsReadonly', 'IsEstimate',
							'IsOK', 'SpecialUse', 'PerformedDate', 'RemarkText', 'Remark1Text', 'PageNumber', 'LineReference',
							'LineIndex', 'QtoDetailReference', 'WipHeaderFk', 'PesHeaderFk', 'BoqSplitQuantityFk', 'EstLineItemFk'
						]
					});

					service.handlerItemReadOnlyStatus = function (item, detailStatus) {
						var qtoHeader = qtoMainHeaderDataService.getSelected();

						if(boqType !== qtoBoqType.QtoBoq) {
							let qtoDetailService = getDataService()

							if (qtoDetailService) {
								qtoHeader = qtoDetailService.getQtoHeader();
							}
						}

						let qtoStatusItem = item.QtoStatusItem ? item.QtoStatusItem : qtoHeaderReadOnlyProcessor.getItemStatus(qtoHeader);
						var readOnlyStatus = qtoStatusItem && qtoStatusItem.IsReadOnly;

						if ((detailStatus && detailStatus.IsReadOnly) || (!!qtoHeader && qtoHeader.PrjChangeStutasReadonly) || (!!item && item.PrjChangeStutasReadonly)) {
							readOnlyStatus = true;
							item.IsReadonly = true;
						}

						readOnlyStatus =  item.WipReadOnly ? item.WipReadOnly : readOnlyStatus;
						readOnlyStatus =  item.BillReadOnly ? item.BillReadOnly :readOnlyStatus;
						readOnlyStatus =  item.PesReadOnly ? item.PesReadOnly :readOnlyStatus;

						service.setRowReadonlyFromLayout(item, readOnlyStatus);
						return readOnlyStatus;
					};

					function getDataService(){
						let qtoDetailService = null;

						switch (boqType) {
							case qtoBoqType.QtoBoq:
								qtoDetailService = $injector.get('qtoMainDetailService');
								break;
							case qtoBoqType.PrcBoq:
								qtoDetailService = $injector.get('procurementPackageQtoDetailService');
								break;
							case qtoBoqType.PrjBoq:
								qtoDetailService = $injector.get('boqMainQtoDetailService');
								break;
							case qtoBoqType.WipBoq:
								qtoDetailService = $injector.get('salesWipQtoDetailService');
								break;
							case qtoBoqType.PesBoq:
								qtoDetailService = $injector.get('procurementPesQtoDetailService');
								break;
							case qtoBoqType.BillingBoq:
								qtoDetailService = $injector.get('salesBillingQtoDetailService');
								break;
						}

						return qtoDetailService;
					}

					function getLineItemReadonly(item) {
						let qtoDetailService = getDataService();
						if (qtoDetailService) {
							return qtoDetailService.getLineItemReadonly(item);
						}
					}

					service.getItemDetailStatus = function (item) {
						var detailStatuses = basicsLookupdataLookupDescriptorService.getData('QtoDetailStatus');
						return _.find(detailStatuses, {Id: item.QtoDetailStatusFk});
					};

					service.getItemStatus = function getItemStatus(item) {
						var conStatuses = basicsLookupdataLookupDescriptorService.getData('QtoStatus');
						return _.find(conStatuses, {Id: item.QTOStatusFk});
					};

					service.processItem = function processItem(qtoItem) {
						let qtostatusItem = qtoItem.QtoStatusItem ? qtoItem.QtoStatusItem : service.getItemStatus(qtoItem);

						if (!(qtostatusItem && qtostatusItem.IsReadOnly)) {
							var formulaUom = {
								QtoFormulaFk: qtoItem.QtoFormula ? qtoItem.QtoFormula.Id : 0,
								UomFk: qtoItem.BasUomFk
							};
							formulaUom = _.merge(formulaUom, qtoItem.QtoFormula);
							var formulaUoms = [];
							formulaUoms.push(formulaUom);

							service.updateReadOnlyDetail(qtoItem, formulaUoms);
						}else if(qtostatusItem && qtostatusItem.IsReadOnly){
							let fields = [];
							_.forOwn(qtoItem, function (value, key) {
								fields.push(key);
							});
							service.updateReadOnly(qtoItem, fields,qtostatusItem.IsReadOnly);
						}

						// set the boq item info on wip, bill and pes
						setBoqItemInfo(qtoItem);
					};

					function setBoqItemInfo(item) {
						let parentService;
						let isSet = false;
						switch (boqType) {
							case qtoBoqType.WipBoq:
								parentService = $injector.get('salesWipBoqStructureService');
								isSet = true;
								break;
							case qtoBoqType.PesBoq:
								parentService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
								isSet = true;
								break;
							case qtoBoqType.BillingBoq:
								parentService = $injector.get('salesBillingBoqStructureService');
								isSet = true;
								break;
						}

						if (isSet) {
							item.ParentBoqHeaderFk = parentService.getSelected().BoqHeaderFk;
							item.ParentBoqItemFk = parentService.getSelected().Id;
						}
					}

					var modelScriptArray = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5'];
					var detailArray = ['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
					var modelArray = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
						'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'
					];
					var flagColumns = ['IsBlocked', 'IsOK', 'IsReadonly'];


					service.updateLineReferenceReadOnly = function(entity, readonly){
						if (entity.IsSheetReadonly){
							service.updateReadOnly(entity, ['LineReference', 'LineIndex'], readonly);
						} else {
							service.updateReadOnly(entity, ['PageNumber', 'LineReference', 'LineIndex'], readonly);
						}
					};

					service.updateReadOnlyDetail = function (entity, QtoFormulaUoms) {
						if (entity && Object.hasOwnProperty.call(entity, 'Id')) {
							let qtoDetailStatus = service.getItemDetailStatus(entity);

							// if the qto header status is readOnly ,the all qtolineitem should be readonly
							let qtoHeaderReadOnlyStatus = service.handlerItemReadOnlyStatus(entity, qtoDetailStatus);
							if(qtoHeaderReadOnlyStatus){
								return;
							}

							let qtoLineType = entity.QtoLineTypeFk;
							let _isReadonly = entity.IsReadonly || entity.IsCopySource;

							let vColumnIsReadonly = false;

							if (_isReadonly) {
								let allFieldsReadOnly = [];
								_.forOwn(entity, function (value, key) {
									if (key !== 'IsReadonly') {
										let field = {field: key, readonly: true};
										allFieldsReadOnly.push(field);
									}
								});

								if (entity.IsCopySource){
									let field = {field: 'IsReadonly', readonly: true};
									allFieldsReadOnly.push(field);
								}

								runtimeDataService.readonly(entity, allFieldsReadOnly);
								vColumnIsReadonly = true;
							}
							else if ((qtoDetailStatus && !qtoDetailStatus.IsCoreData && !globals.portal) || (qtoDetailStatus && !qtoDetailStatus.IsCoreDataExt && globals.portal)) {
								let readonlyColByStutes = [];
								_.forOwn(entity, function (value, key) {
									if (flagColumns.indexOf(key) < 0) {
										readonlyColByStutes.push({field: key, readonly: true});
									}
								});

								runtimeDataService.readonly(entity, readonlyColByStutes);

								updateFlagColReadOnly(entity, qtoDetailStatus);
								vColumnIsReadonly = true;
							}
							else {
								let fieldstoEdit = [];
								_.forOwn(entity, function (value, key) {
									if (!modelScriptArray.includes(key) && !detailArray.includes(key) && !detailArray.includes(key)) {
										var field = {field: key, readonly: false};
										fieldstoEdit.push(field);
									}
								});

								runtimeDataService.readonly(entity, fieldstoEdit);

								service.updateWipOrPesReadOnly(entity);

								updateFlagColReadOnly(entity, qtoDetailStatus);

								// readOnly by status
								let readonlyColByStutes = [];

								readonlyColByStutes.push({field: 'LineText', readonly: true});

								/* if prc wq/aq and sales wq/aq, set the iswq and isaq column as readonly */

								let selectedQtoHeader = boqType === qtoBoqType.QtoBoq ? qtoMainHeaderDataService.getSelected() : qtoMainHeaderDataService.getCurrentHeader();
								let isWqAqReadonly = selectedQtoHeader && (selectedQtoHeader.QtoTargetType === 3 || selectedQtoHeader.QtoTargetType === 4);
								readonlyColByStutes.push({field: 'IsWQ', readonly: !isWqAqReadonly});
								readonlyColByStutes.push({field: 'IsAQ', readonly: !isWqAqReadonly});

								let isIQBQReadonly = selectedQtoHeader && (selectedQtoHeader.QtoTargetType === 1 || selectedQtoHeader.QtoTargetType === 2);
								readonlyColByStutes.push({field: 'IsIQ', readonly: !isIQBQReadonly});
								readonlyColByStutes.push({field: 'IsBQ', readonly: !isIQBQReadonly});

								let isGQReadonly = !qtoMainHeaderDataService.getGqIsAvailable(selectedQtoHeader);
								readonlyColByStutes.push({field: 'IsGQ', readonly: isGQReadonly});

								let isBillToReadonly = selectedQtoHeader && (selectedQtoHeader.QtoTargetType === 2);
								readonlyColByStutes.push({field: 'BillToFk', readonly: !isBillToReadonly});

								/* set the sales contract as readonly for qto header assigned contract */
								let isContractAssign = !selectedQtoHeader || (selectedQtoHeader && !!selectedQtoHeader.OrdHeaderFk);
								if(isContractAssign || (selectedQtoHeader.QtoTargetType === 1 || selectedQtoHeader.QtoTargetType === 3 || selectedQtoHeader.QtoTargetType === 4)){
									readonlyColByStutes.push({field: 'OrdHeaderFk', readonly: true});
									readonlyColByStutes.push({field: 'BillToFk', readonly: true});
								}

								// TODO: first step the lineitem will be only assigned to qto line with boq.
								// TODO: will be removed, next step, can be assigned to boq split
								let isHasSplitValue = entity.BoqSplitQuantityFk;
								let isHasEstLineItem = entity.EstLineItemFk;

								/* if BoqSplitQuantityFk is null, set as readonly */
								if(!entity.HasSplitQuantiy || isHasEstLineItem){
									readonlyColByStutes.push({field: 'BoqSplitQuantityFk', readonly: true});
								}

								/* if EstLineItemFk is null, set as readonly
								* only sales/wip&bill can be editor */
								if(getLineItemReadonly(entity) || !isBillToReadonly || isHasSplitValue) {
									readonlyColByStutes.push({field: 'EstLineItemFk', readonly: true});
								}

								/* If item is splitted */
								if(boqType === qtoBoqType.QtoBoq && (entity.IsSplitted || (entity.QtoDetailSplitFromFk && entity.QtoDetailSplitFromFk > 0))){
									if(entity.SplitItemIQReadOnly){
										readonlyColByStutes.push({field: 'IsIQ', readonly: true});
										readonlyColByStutes.push({field: 'WipHeaderFk', readonly: true});
									}

									if(entity.SplitItemBQReadOnly){
										readonlyColByStutes.push({field: 'IsBQ', readonly: true});
										readonlyColByStutes.push({field: 'BilHeaderFk', readonly: true});
									}
								}

								// set sheet as readonly with sheet flag
								readonlyColByStutes.push({field: 'PageNumber', readonly: entity.IsSheetReadonly});

								if (readonlyColByStutes.length > 0) {
									runtimeDataService.readonly(entity, readonlyColByStutes);
								}

								// remove readOnly configuration for values and opterators (added by wul at 16 Jan 2018)
								if (entity && entity.__rt$data && entity.__rt$data.readonly) {
									_.forEach(modelArray, function (field) {
										let idx = _.findIndex(entity.__rt$data.readonly, {'field': field});
										if (idx >= 0) {
											entity.__rt$data.readonly.splice(idx, 1);
										}
									});

									_.forEach(detailArray, function (field) {
										let idx = _.findIndex(entity.__rt$data.readonly, {'field': field});
										if (idx >= 0) {
											entity.__rt$data.readonly.splice(idx, 1);
										}
									});
								}

								switch (qtoLineType) {
									// 1-Pre define: No merge
									// 2-Free input: Merge all Value1~OP5
									// 3-Script: No merge, OP1,2,3,4,5 read only.
									case qtoMainLineType.Standard:
									case qtoMainLineType.Hilfswert:
									case qtoMainLineType.Subtotal:
									case qtoMainLineType.ItemTotal:
										service.updateReadOnly(entity, ['QtoFormulaFk'], false);

										var qtoFormulaFk = entity.QtoFormulaFk;
										var nowQtoFormula = _.find(basicsLookupdataLookupDescriptorService.getData('QtoFormula'), {Id: qtoFormulaFk}),
											qtoFormulaTypeFk;
										if (nowQtoFormula !== null && nowQtoFormula !== undefined) {
											qtoFormulaTypeFk = nowQtoFormula.QtoFormulaTypeFk;
										}

										if (qtoFormulaTypeFk === qtoMainFormulaType.FreeInput) {
											// 2-Free input: Merge all Value1~OP5 as LineText input,
											_isReadonly = true;
											service.updateReadOnly(entity, modelArray, _isReadonly);
											service.updateReadOnly(entity, detailArray, _isReadonly);
											service.updateReadOnly(entity, ['LineText', 'Value1Detail'], false);
										} else if (qtoFormulaTypeFk === qtoMainFormulaType.Predefine || qtoFormulaTypeFk === qtoMainFormulaType.Script) {
											// if QtoFormulaType is Predefine,so readyOnly rule from qto_formula_uom or qto_formula
											if (entity.QtoFormulaFk === null || entity.QtoFormulaFk === undefined) {
												service.updateReadOnly(entity, modelArray, _isReadonly);
												service.updateReadOnly(entity, detailArray, _isReadonly);
											} else {
												var result = service.getReadyOnlyListForPredefine(entity, modelArray, QtoFormulaUoms);
												if (angular.isArray(result)) {
													_.forEach(modelArray, function (model) {
														runtimeDataService.readonly(entity, [
															{
																field: model,
																readonly: _isReadonly ? true : !result[model]
															}
														]);
													});

													_.forEach(modelScriptArray, function (model) {
														runtimeDataService.readonly(entity, [
															{
																field: model + 'Detail',
																readonly: _isReadonly ? true : !result[model]
															}
														]);
													});
												}

											}
										}

										break;
									case qtoMainLineType.CommentLine:
										_isReadonly = true;
										service.updateReadOnly(entity, modelArray, _isReadonly);
										service.updateReadOnly(entity, detailArray, _isReadonly);
										service.updateReadOnly(entity, 'QtoFormulaFk', _isReadonly);
										service.updateReadOnly(entity, ['LineText'], false);
										break;

									// When line type=5-R-Reference or 6-L-Reference  or 7-I- Reference formula should be null and read only
									case qtoMainLineType.LRefrence:
									case qtoMainLineType.RRefrence:
									case qtoMainLineType.IRefrence:
										_isReadonly = true;
										service.updateReadOnly(entity, modelArray, _isReadonly);
										service.updateReadOnly(entity, detailArray, _isReadonly);
										service.updateReadOnly(entity, ['BoqItemReferenceFk','QtoDetailReferenceFk'], false);
										service.updateReadOnly(entity, ['QtoFormulaFk'], true);
										service.updateReadOnly(entity, ['LineText','Value1Detail'], false);
										if(qtoLineType === qtoMainLineType.LRefrence) {
											service.updateReadOnly (entity, ['Value1Detai2'], false);
										}
										break;
								}
							}

							let qtoHeader = qtoMainHeaderDataService.getSelected();
							if (qtoHeader && qtoHeader.BasRubricCategoryFk === 6 || vColumnIsReadonly) {  // BasRubricCategoryFk is "Live Take Off"
								service.updateReadOnly(entity, ['V'], true);
							} else {
								service.updateReadOnly(entity, ['V'], false);
							}

							switch (boqType){
								case qtoBoqType.PrcBoq:
								case qtoBoqType.PrjBoq:
									service.updateReadOnly(entity, ['IsWQ', 'IsAQ'], entity.IsReadonly);
									service.updateReadOnly(entity, ['BoqItemFk', 'BoqItemCode', 'WipHeaderFk', 'PesHeaderFk', 'OrdHeaderFk', 'V','BilHeaderFk','BillToFk'], true);
									break;
								case qtoBoqType.WipBoq:
								case qtoBoqType.PesBoq:
									var IsBQReadonly = boqType === qtoBoqType.WipBoq ? (entity.IsReadonly || (entity.IsSplitted || (entity.QtoDetailSplitFromFk && entity.QtoDetailSplitFromFk > 0))) : entity.IsReadonly;
									service.updateReadOnly(entity, ['IsBQ'], IsBQReadonly);
									service.updateReadOnly(entity, ['BoqItemFk', 'BoqItemCode', 'WipHeaderFk', 'PesHeaderFk', 'OrdHeaderFk', 'V','BilHeaderFk','IsIQ','BillToFk'], true);
									break;
								case qtoBoqType.BillingBoq:
									service.updateReadOnly(entity, ['IsIQ'], true);
									service.updateReadOnly(entity, ['BoqItemFk', 'BoqItemCode', 'WipHeaderFk', 'PesHeaderFk', 'OrdHeaderFk', 'V','BilHeaderFk','IsBQ','BillToFk'], true);
									break;
								case qtoBoqType.QtoBoq:

									break;

							}
						}
					};

					function updateFlagColReadOnly(entity, qtoDetailStatus){
						let readonlyColByStutes = [];
						if (qtoDetailStatus && !qtoDetailStatus.IsOk) {
							readonlyColByStutes.push({field: 'IsOK', readonly: true});
						}
						if (qtoDetailStatus && !qtoDetailStatus.IsDisable) {
							readonlyColByStutes.push({field: 'IsBlocked', readonly: true});
						}

						runtimeDataService.readonly(entity, readonlyColByStutes);
					}

					service.updateWipOrPesReadOnly = function (item) {
						let wipHeaderReadOnly = true;
						let pesHeaderReadOnly = true;
						let billToFkReadOnly = true;
						let qtoHeader = qtoMainHeaderDataService.getSelected();

						if (qtoHeader && qtoHeader.QtoTargetType === 1) {
							pesHeaderReadOnly = false;
						}else if(qtoHeader && qtoHeader.QtoTargetType === 2){
							wipHeaderReadOnly = false;
							billToFkReadOnly = false;
						}
						runtimeDataService.readonly(item, [
							{field: 'WipHeaderFk', readonly: item.IsReadonly ? item.IsReadonly : wipHeaderReadOnly},
							{field: 'PesHeaderFk', readonly: item.IsReadonly ? item.IsReadonly : pesHeaderReadOnly},
							{field: 'BilHeaderFk', readonly: item.IsReadonly ? item.IsReadonly : wipHeaderReadOnly},
							{field: 'BillToFk', readonly: item.IsReadonly ? item.IsReadonly : billToFkReadOnly},
						]);
					};


					service.updateReadOnly = function (item, modelArray, value) {
						_.forEach(modelArray, function (model) {
							runtimeDataService.readonly(item, [
								{field: model, readonly: value}
							]);
						});
					};


					service.getDetailReadyOnlyList = function (fieldArray, dataSource) {
						var editableList = [];
						angular.forEach(fieldArray, function (itemName) {
							var editable = true;
							switch (itemName) {
								case 'Value1' :
									editable = dataSource.Value1IsActive;
									break;
								case 'Operator1' :
									editable = dataSource.Value1IsActive && !!dataSource.Operator1;
									break;
								case 'Value2':
									editable = dataSource.Value2IsActive;
									break;
								case 'Operator2' :
									editable = dataSource.Value2IsActive && !!dataSource.Operator2;
									break;
								case 'Value3':
									editable = dataSource.Value3IsActive;
									break;
								case 'Operator3' :
									editable = dataSource.Value3IsActive && !!dataSource.Operator3;
									break;
								case 'Value4':
									editable = dataSource.Value4IsActive;
									break;
								case 'Operator4' :
									editable = dataSource.Value4IsActive && !!dataSource.Operator4;
									break;
								case 'Value5':
									editable = dataSource.Value5IsActive;
									break;
								case 'Operator5' :
									editable = dataSource.Value5IsActive && !!dataSource.Operator5;
									break;
							}
							editableList[itemName] = editable;
						});

						return editableList;
					};


					service.getReadyOnlyListForPredefine = function (item, modelArray, QtoFormulaUoms) {
						var editableList = [];
						var qtoFormulaFk = item.QtoFormulaFk;
						var BasUomFk = item.BasUomFk;

						var nowQtoFormula = _.find(basicsLookupdataLookupDescriptorService.getData('QtoFormula'), {Id: qtoFormulaFk});
						editableList = service.getDetailReadyOnlyList(modelArray, nowQtoFormula);
						// if the qto_formula type is Predefine,the readyOnly rule from qto_formula_uom or qto_formula
						var uomFk = item.BasUomFk;
						if (uomFk !== null) {
							var qtoFormulaUom = _.find(QtoFormulaUoms, {QtoFormulaFk: qtoFormulaFk, UomFk: BasUomFk});
							if (qtoFormulaUom) {
								editableList = service.getDetailReadyOnlyList(modelArray, qtoFormulaUom);
							}
						}
						return editableList;
					};

					return service;
				};

				return factoryService;
			}
		]);
})(angular);