(function (angular) {
	/* global */
	'use strict';

	var qtoMainModule = 'qto.main';
	var boqMainModule = 'boq.main';
	var estimateMainModule = 'estimate.main';
	var cloudCommonModule = 'cloud.common';
	var qtoFormula = 'qto.formula';
	var salesWipModule = 'sales.wip';

	angular.module(qtoMainModule).service('qtoMainTranslationService',
		['$q','platformUIBaseTranslationService',
			function ($q, platformUIBaseTranslationService) {

				var qtoMainTranslations = {
					translationInfos: {
						'extraModules': [qtoMainModule, boqMainModule, estimateMainModule, cloudCommonModule, qtoFormula, salesWipModule],
						'extraWords': {
							V: {location: qtoMainModule, identifier: 'v', initial: 'V'},
							Description: {location: qtoMainModule, identifier: 'qtoDetailPageNumber', initial: 'Page Number'},
							From: {location: qtoMainModule, identifier: 'from', initial: 'From'},
							To: {location: qtoMainModule, identifier: 'to', initial: 'To'},
							Date: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
							moduleName: {location: 'qto.main', identifier: 'moduleName', initial: 'qto'},
							boq: {location: qtoMainModule, identifier: 'boq', initial: 'boq'},
							QtoTypeFk: {location: qtoMainModule, identifier: 'qtoTypeFk', initial: 'qtoTypeFk'},
							QtoTargetType: {location: qtoMainModule, identifier: 'QtoTargetType', initial: 'QtoTargetType'},
							BasRubricCategoryFk: {location: qtoMainModule, identifier: 'BasRubricCategoryFk', initial: 'BasRubricCategoryFk'},
							QTOStatusFk: {location: qtoMainModule, identifier: 'entityQTOStatusFk', initial: 'QTOStatusFk'},
							Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
							ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'entityProject'},
							BoqHeaderFk: {location: qtoMainModule, identifier: 'headerBoq', initial: 'headerBoq'},
							QtoDate: {location: qtoMainModule, identifier: 'qtoDate', initial: 'qtoDate'},
							IsLive: {location: qtoMainModule, identifier: 'isLive', initial: 'isLive'},
							PerformedFrom: {location: qtoMainModule, identifier: 'performedFrom', initial: 'performedFrom'},
							PerformedTo: {location: qtoMainModule, identifier: 'performedTo', initial: 'performedTo'},
							ClerkFk: {location: qtoMainModule, identifier: 'customerCode', initial: 'customerCode'},
							BasGoniometerTypeFk: {location: qtoMainModule, identifier: 'goniometer', initial: 'goniometer'},
							NoDecimals: {location: qtoMainModule, identifier: 'noDecimals', initial: 'noDecimals'},
							UseRoundedResults: {location: qtoMainModule, identifier: 'useRoundedResults', initial: 'useRoundedResults'},
							Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'entityRemark'},
							ConHeaderFk: {location: qtoMainModule, identifier: 'ConHeaderFk', initial: 'conheaderfk'},
							BusinessPartnerFk: {location: qtoMainModule, identifier: 'BusinessPartnerFk', initial: 'BusinessPartnerFk'},
							ContractCode: {location: qtoMainModule, identifier: 'ContractCode', initial: 'ContractCode'},
							PrcStructureFk: {location: qtoMainModule, identifier: 'PrcStructureFk', initial: 'PrcStructureFk'},
							Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'entityQuantity'},
							QuantityPercent: {location: cloudCommonModule, identifier: 'entityPercent', initial: 'entityPercent'},
							Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
							UoMFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
							BoqItemFk: {location: qtoMainModule, identifier: 'boqItem', initial: 'boqItem'},
							BoqItemCode: {location: qtoMainModule, identifier: 'boqItem', initial: 'boqItem'},
							BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'entityUoM'},
							PrjLocationFk: {location: qtoMainModule, identifier: 'PrjLocation', initial: 'PrjLocation'},
							AssetMasterFk: {location: qtoMainModule, identifier: 'AssetMaster', initial: 'AssetMaster'},
							BudgetCodeFk: {location: qtoMainModule, identifier: 'BudgetCode', initial: 'BudgetCode'},
							BudgetCodeDesc: {location: qtoMainModule, identifier: 'BudgetCodeDesc', initial: 'BudgetCodeDesc'},
							ClassificationFk: {location: qtoMainModule, identifier: 'Classification', initial: 'Classification'},
							ClassificationDesc: {location: qtoMainModule, identifier: 'ClassificationDesc', initial: 'ClassificationDesc'},
							QtoLineTypeFk: {location: qtoMainModule, identifier: 'QtoLineType', initial: 'QtoLineType'},

							QtoLineTypeCode: {location: qtoMainModule, identifier: 'QtoLineType', initial: 'QtoLineType'},

							QtoLineTypeDesc: {location: qtoMainModule, identifier: 'QtoLineTypeDesc', initial: 'QtoLineTypeDesc'},
							QtoFormulaFk: {location: qtoMainModule, identifier: 'QtoFormulaCode', initial: 'QtoFormulaCode'},
							QtoFormulaDesc: {location: qtoMainModule, identifier: 'QtoFormulaDesc', initial: 'QtoFormulaDesc'},
							Factor: {location: qtoMainModule, identifier: 'Factor', initial: 'Factor'},
							Value1Detail: {location: qtoMainModule, identifier: 'Value1', initial: 'Value1'},
							Operator1: {location: qtoMainModule, identifier: 'Operator1', initial: 'Operator1'},
							Value2Detail: {location: qtoMainModule, identifier: 'Value2', initial: 'Value2'},
							Operator2: {location: qtoMainModule, identifier: 'Operator2', initial: 'Operator2'},
							Value3Detail: {location: qtoMainModule, identifier: 'Value3', initial: 'Value3'},
							Operator3: {location: qtoMainModule, identifier: 'Operator3', initial: 'Operator3'},
							Value4Detail: {location: qtoMainModule, identifier: 'Value4', initial: 'Value4'},
							Operator4: {location: qtoMainModule, identifier: 'Operator4', initial: 'Operator4'},
							Value5Detail: {location: qtoMainModule, identifier: 'Value5', initial: 'Value5'},
							Operator5: {location: qtoMainModule, identifier: 'Operator5', initial: 'Operator5'},
							FormulaResult: {location: qtoMainModule, identifier: 'FormulaResult', initial: 'FormulaResult'},
							FormulaResultUI: {location: qtoMainModule, identifier: 'FormulaResult', initial: 'FormulaResult'},
							Result: {location: qtoMainModule, identifier: 'Result', initial: 'Result'},
							SubTotal: {location: qtoMainModule, identifier: 'SubTotal', initial: 'SubTotal'},
							IsBlocked: {location: qtoMainModule, identifier: 'IsBlocked', initial: 'IsBlocked'},
							IsReadonly: {location: qtoMainModule, identifier: 'IsReadonly', initial: 'IsReadonly'},
							IsEstimate: {location: qtoMainModule, identifier: 'IsEstimate', initial: 'IsEstimate'},
							IsOK: {location: qtoMainModule, identifier: 'IsOK', initial: 'IsOK'},
							SpecialUse: {location: qtoMainModule, identifier: 'SpecialUse', initial: 'SpecialUse'},
							PerformedDate: {location: qtoMainModule, identifier: 'PerformedDate', initial: 'PerformedDate'},
							RemarkText: {location: qtoMainModule, identifier: 'RemarkText', initial: 'RemarkText'},
							Remark1Text: {location: qtoMainModule, identifier: 'Remark1Text', initial: 'Remark1Text'},
							PageNumber: {location: qtoMainModule, identifier: 'PageNumber', initial: 'PageNumber'},
							LineReference: {location: qtoMainModule, identifier: 'LineReference', initial: 'LineReference'},
							LineIndex: {location: qtoMainModule, identifier: 'LineIndex', initial: 'LineIndex'},
							QtoDetailReference: {location: qtoMainModule, identifier: 'QtoDetailReference', initial: 'QtoDetailReference'},
							WipHeaderFk: {location: qtoMainModule, identifier: 'WipHeaderCode', initial: 'WipHeaderCode'},
							WipHeaderDescription: {location: qtoMainModule, identifier: 'WipHeaderDescription', initial: 'WipHeaderDescription'},
							PesHeaderFk: {location: qtoMainModule, identifier: 'PesHeaderCode', initial: 'PesHeaderCode'},
							OrdHeaderFk: {location: qtoMainModule, identifier: 'OrdHeaderFk', initial: 'OrdHeaderCode'},
							PesHeaderDescription: {location: qtoMainModule, identifier: 'PesHeaderDescription', initial: 'PesHeaderDescription'},
							LineText: {location: qtoMainModule, identifier: 'LineText', initial: 'LineText'},
							QtoDetailStatusFk: {location: qtoMainModule, identifier: 'detailStatus', initial: 'QtoDetailStatus'},
							IsWQ: {location: qtoMainModule, identifier: 'isWq', initial: 'IsWQ'},
							IsAQ: {location: qtoMainModule, identifier: 'isAq', initial: 'IsAQ'},
							IsIQ: {location: qtoMainModule, identifier: 'isIq', initial: 'IsIQ'},
							IsBQ: {location: qtoMainModule, identifier: 'isBq', initial: 'IsBQ'},
							IsGQ: {location: qtoMainModule, identifier: 'isGq', initial: 'IsGQ'},
							BilHeaderFk: {location: qtoMainModule, identifier: 'bilheaderfk', initial: 'Bill No'},
							DocumentDescription: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
							CommentDescription: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
							QtoDetailDocumentTypeFk: {location: qtoMainModule, identifier: 'document.qtoDetailDocumentType', initial: 'Qto Detail Document Type'},
							DocumentTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Document Type'},
							QtoDetailSplitFromReference: {location: qtoMainModule, identifier: 'qtodetailsplitfromreference', initial: 'Split From Line Reference'},

							BasQtoCommentsTypeFk: {location: qtoMainModule, identifier: 'basQtoCommentsTypeFk', initial: 'Type'},

							DocumentDate: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
							OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Document Origin File Name'},
							BoqSplitQuantityFk: {location: qtoMainModule, identifier: 'splitQtyNo', initial: 'SplitQty No.'},
							MdcControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnitCode', initial: 'entityControllingUnitCode'},
							UserDefined1: {
								location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 1}, initial: 'User-Defined 1'
							},
							UserDefined2: {
								location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 2}, initial: 'User-Defined 2'
							},
							UserDefined3: {
								location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 3}, initial: 'User-Defined 3'
							},
							UserDefined4: {
								location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 4}, initial: 'User-Defined 4'
							},
							UserDefined5: {
								location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: 5}, initial: 'User-Defined 5'
							},
							SortCode01Fk: {location: qtoMainModule, identifier: 'sortCode01', initial: 'Sort Code 1'},
							SortCode02Fk: {location: qtoMainModule, identifier: 'sortCode02', initial: 'Sort Code 2'},
							SortCode03Fk: {location: qtoMainModule, identifier: 'sortCode03', initial: 'Sort Code 3'},
							SortCode04Fk: {location: qtoMainModule, identifier: 'sortCode04', initial: 'Sort Code 4'},
							SortCode05Fk: {location: qtoMainModule, identifier: 'sortCode05', initial: 'Sort Code 5'},
							SortCode06Fk: {location: qtoMainModule, identifier: 'sortCode06', initial: 'Sort Code 6'},
							SortCode07Fk: {location: qtoMainModule, identifier: 'sortCode07', initial: 'Sort Code 7'},
							SortCode08Fk: {location: qtoMainModule, identifier: 'sortCode08', initial: 'Sort Code 8'},
							SortCode09Fk: {location: qtoMainModule, identifier: 'sortCode09', initial: 'Sort Code 9'},
							SortCode10Fk: {location: qtoMainModule, identifier: 'sortCode10', initial: 'Sort Code 10'},
							BriefInfo: {location: qtoMainModule, identifier: 'BriefInfo', initial: 'Outline Specification'},
							BillToFk: {location: qtoMainModule, identifier: 'BillToFk', initial: 'Bill To Code'},
							PerformedFromWip: {location: qtoMainModule, identifier: 'performedFromWip', initial: 'Performed From(WIP)'},
							PerformedToWip: {location: qtoMainModule, identifier: 'performedToWip', initial: 'Performed To(WIP)'},
							PerformedFromBil: {location: qtoMainModule, identifier: 'performedFromBil', initial: 'Performed From(Bil)'},
							PerformedToBil: {location: qtoMainModule, identifier: 'performedToBil', initial: 'Performed To(Bil)'},
							ProgressInvoiceNo: {location: qtoMainModule, identifier: 'entityProgressInvoiceNo', initial: 'Progress Invoice(Bil)'},
							CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment'},
							PrjProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'entityProject'},

							SheetArea: {location: qtoMainModule, identifier: 'sheetArea', initial: 'Sheet Area'},
							LineArea: {location: qtoMainModule, identifier: 'lineArea', initial: 'Line Area'},
							IndexArea: {location: qtoMainModule, identifier: 'indexArea', initial: 'Index Area'},
							BasClerkRoleFk: {location: qtoMainModule, identifier: 'basClerkRoleFk', initial: 'Role'},
							BasClerkFk: {location: qtoMainModule, identifier: 'basClerkFk', initial: 'Clerk'},
							QtoSheetStatusFk: {location: qtoMainModule, identifier: 'qtoSheetStatus', initial: 'Qto Sheet Status'},
							Comment: {location: qtoMainModule, identifier: 'Comment', initial: 'Comment'},
							CustomerFk: {location: qtoMainModule, identifier: 'customerFk', initial: 'Customer'},
							QuantityPortion: {location: qtoMainModule, identifier: 'quantityPortion', initial: 'Quantity Portion'},
							TotalQuantity: {location: qtoMainModule, identifier: 'totalQuantity', initial: 'Total Quantity'},
							SubsidiaryFk: {location: qtoMainModule, identifier: 'subsidiaryFk', initial: 'Subsidiary'},

							EstLineItemFk: {location: qtoMainModule, identifier: 'estLineItemFk', initial: 'Line Item'}
						}
					}
				};

				var translationService = {};
				platformUIBaseTranslationService.call(this, [qtoMainTranslations], translationService);
			}
		]);
})(angular);
