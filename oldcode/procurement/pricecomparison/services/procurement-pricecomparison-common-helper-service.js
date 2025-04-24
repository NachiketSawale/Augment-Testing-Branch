/**
 * Created by wed on 9/27/2018.
 */

(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonCommonHelperService', [
		'_',
		'$',
		'globals',
		'$q',
		'$http',
		'$injector',
		'platformGridAPI',
		'platformObjectHelper',
		'platformGridDomainService',
		'platformRuntimeDataService',
		'basicsLookupdataTreeHelper',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonLineTypes',
		'boqMainLineTypes',
		'procurementPriceComparisonCheckBidderService',
		'PlatformMessenger',
		'mainViewService',
		'basicsLookupdataSimpleLookupService',
		'accounting',
		'platformContextService',
		'platformLanguageService',
		'platformDomainService',
		'basicsCostGroupAssignmentService',
		'cloudDesktopNavigationPermissionService',
		'boqMainItemTypes',
		'boqMainItemTypes2',
		'ServiceDataProcessDatesExtension',
		'basicsCommonRoundingService',
		'platformStatusIconService',
		'basicsCommonSimpleUploadService',
		function (
			_,
			$,
			globals,
			$q,
			$http,
			$injector,
			platformGridAPI,
			platformObjectHelper,
			platformGridDomainService,
			platformRuntimeDataService,
			basicsLookupdataTreeHelper,
			lookupDescriptorService,
			commonService,
			boqCompareRows,
			compareLineTypes,
			boqMainLineTypes,
			checkBidderService,
			PlatformMessenger,
			mainViewService,
			simpleLookupService,
			accounting,
			platformContextService,
			platformLanguageService,
			platformDomainService,
			basicsCostGroupAssignmentService,
			naviPermissionService,
			boqMainItemTypes,
			boqMainItemTypes2,
			ServiceDataProcessDatesExtension,
			roundingService,
			platformStatusIconService,
			basicsCommonSimpleUploadService) {

			const service = {};
			const compareConfig = {
				isExcludeEvaluatedTotal: false
			};

			service.loadCompareConfig = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isexcludeevaluatedtotal').then(r => {
					compareConfig.isExcludeEvaluatedTotal = r.data;
				});
			};

			service.endRunningReadRequest = function (data) {
				if (data && data.runningReadCall) {
					data.runningReadCall = null;
				}
			};

			service.killRunningReadRequest = function (data) {
				if (data && data.runningReadCall) {
					data.runningReadCall.resolve('User Cancelled');
				}
			};

			service.provideReadRequestToken = function (data) {
				if (data) {
					data.runningReadCall = $q.defer();
					return data.runningReadCall.promise;
				}
				return null;
			};

			service.isExcludedCompareRowOnBoqPosition = function (row) {
				let excludeRows = [
					boqCompareRows.discount,
					boqCompareRows.discountPercentIT,
					boqCompareRows.lumpsumPrice,
					boqCompareRows.isLumpsum,
					boqCompareRows.boqTotalRank,
					commonService.constant.Generals,
					commonService.constant.Characteristics
				];
				return _.includes(excludeRows, row);
			};

			service.isIncludedCompareRowOnBoqLevel = function (row) {
				let includeRows = [
					boqCompareRows.discount,
					boqCompareRows.discountPercentIT,
					boqCompareRows.lumpsumPrice,
					boqCompareRows.isLumpsum,
					boqCompareRows.itemTotal,
					boqCompareRows.itemTotalOc,
					boqCompareRows.externalCode,
					boqCompareRows.percentage,
					boqCompareRows.absoluteDifference,
					boqCompareRows.prcItemEvaluationFk,
					boqCompareRows.finalPrice,
					boqCompareRows.finalPriceOc
				];
				return _.includes(includeRows, row);
			};

			service.isIncludedCompareRowOnBoqRoot = function (row) {
				let includeRows = [
					boqCompareRows.discount,
					boqCompareRows.discountPercentIT,
					boqCompareRows.lumpsumPrice,
					boqCompareRows.isLumpsum,
					boqCompareRows.itemTotal,
					boqCompareRows.itemTotalOc,
					boqCompareRows.boqTotalRank,
					boqCompareRows.externalCode,
					boqCompareRows.percentage,
					boqCompareRows.absoluteDifference,
					boqCompareRows.prcItemEvaluationFk,
					boqCompareRows.finalPrice,
					boqCompareRows.finalPriceOc
				];
				return _.includes(includeRows, row);
			};

			service.isExcludedCompareRowInVerticalMode = function (row) {
				let excludeRows = [
					boqCompareRows.bidderComments,
					boqCompareRows.urBreakdown1,
					boqCompareRows.urBreakdown2,
					boqCompareRows.urBreakdown3,
					boqCompareRows.urBreakdown4,
					boqCompareRows.urBreakdown5,
					boqCompareRows.urBreakdown6,
					commonService.constant.Generals,
					commonService.constant.Characteristics
				];
				return _.includes(excludeRows, row);
			};

			service.isBoqCompareCellEditable = function (row, column) {
				let quoteKey = column.isVerticalCompareRows ? column.quoteKey : column.field,
					compareField = this.getBoqCompareField(row, column);
				return (row.BoqLineTypeFk === compareLineTypes.compareField || service.isBoqRow(row.BoqLineTypeFk)) &&
					_.includes(commonService.boqEditableCompareFields, compareField) &&
					column.isDynamic &&
					checkBidderService.boq.isNotReference(quoteKey) &&
					row[column.field + '_$hasBidder'] === true;
			};

			service.isPrcCompareCellEditable = function (row, column) {
				let quoteKey = column.isVerticalCompareRows ? column.quoteKey : column.field,
					compareField = this.getPrcCompareField(row, column);
				return (row.LineType === compareLineTypes.compareField || row.LineType === compareLineTypes.prcItem) &&
					_.includes(commonService.itemEditableCompareFields, compareField) &&
					column.isDynamic &&
					checkBidderService.item.isNotReference(quoteKey) &&
					row[column.field + '_$hasBidder'] === true &&
					(!column.isIdealBidder || compareField === commonService.itemCompareFields.prcItemEvaluationFk);
			};

			service.getBoqCompareField = function (row, column) {
				return column && column.isVerticalCompareRows && service.isBoqRow(row.BoqLineTypeFk) ? column.originalField : row.rowType;
			};

			service.getPrcCompareField = function (row, column) {
				return column && column.isVerticalCompareRows && row.LineType === compareLineTypes.prcItem ? column.originalField : row.rowType;
			};

			service.getCombineCompareField = function (quoteKey, originalField) {
				return quoteKey + '_' + originalField;
			};

			service.extractCompareInfoFromFieldName = function (fieldName) {
				// todo: It should be taken from data structure not the field name.
				let values = fieldName.split('_'),
					result = {quoteKey: fieldName, field: fieldName, isVerticalCompareRows: false};
				if (values.length === 5) {
					result.field = values.pop();
					result.quoteKey = values.join('_');
					result.isVerticalCompareRows = result.quoteKey !== result.field;
				}
				return result;
			};

			service.tryGetParentItem = function (entity, isSelf) {
				return isSelf ? entity : entity.parentItem;
			};

			service.textPadding = function (text, p, l, s) {
				for (let i = 0; i < l; i++) {
					switch (s) {
						case 'l':
							text = p + text;
							break;
						case 'r':
							text = text + p;
							break;
						default:
							text = p + text + p;
							break;
					}
				}
				return text;
			};

			service.isDataPropReadonly = function (item, field) {
				return item.__rt$data && !!_.find(item.__rt$data.readonly, {field: field, readonly: true});
			};

			service.addGeneralTotalRow2RequisitionRow = function addGeneralTotalRow2RequisitionRow(parentItem, compareRowsCache, configService, lineType, children) {
				let generalsConfig = _.find(compareRowsCache, {Field: commonService.constant.Generals});
				if (parentItem[lineType] === compareLineTypes.requisition && generalsConfig && generalsConfig.Visible) {
					let totalRow = {};
					totalRow.Id = 'general_total_row_' + parentItem.ReqHeaderId;
					totalRow.RfqHeaderId = parentItem.RfqHeaderId;
					totalRow.ReqHeaderId = parentItem.ReqHeaderId;
					totalRow[lineType] = compareLineTypes.generalTotal;
					totalRow.parentItem = parentItem;
					totalRow.HasChildren = false;
					totalRow[children] = [];
					totalRow[commonService.constant.compareDescription] = ''; // show nothing

					// add general item compare rows if the requisition has general items, else do not add it.
					/** @namespace parentItem.QuoteGeneralItems */
					let generalItems = _.filter(parentItem.QuoteGeneralItems || [], {QuoteKey: checkBidderService.constant.targetKey});
					if (_.isEmpty(generalItems)) {
						return;
					}

					_.forEach(generalItems, function (item) {
						let itemRow = {};
						itemRow.Id = 'general_item_row_' + item.Id;
						itemRow.GeneralTypeId = item.GeneralTypeId; // row type identifier (important: used to filter the exact bidder's quote value)
						itemRow[lineType] = compareLineTypes.generalItem;
						itemRow.parentItem = totalRow;
						itemRow.RfqHeaderId = parentItem.RfqHeaderId;
						itemRow.ReqHeaderId = parentItem.ReqHeaderId;
						itemRow.HasChildren = false;
						itemRow[children] = [];

						itemRow[commonService.constant.compareDescription] = _.result(_.find(configService.generalTypesCache, {Id: item.GeneralTypeId}), 'DescriptionInfo.Translated');

						totalRow[children].push(itemRow);
						totalRow.HasChildren = true;
					});

					parentItem[children].unshift(totalRow); // insert at the first
					parentItem.HasChildren = true;
				}
			};

			service.extraMergeCompareConfigData = function (configRow) {
				return {
					DefaultDescription: configRow.DefaultDescription,
					FieldName: configRow.FieldName,
					UserLabelName: configRow.UserLabelName,
					DisplayName: configRow.DisplayName
				};
			};

			service.mergeCompareConfig = function (item, mergeOptions) {
				_.each(mergeOptions, function (option) {
					_.each(item[option.prop], function (row) {
						let configRow = _.find(option.source, {Field: row.Field});
						if (configRow) {
							angular.extend(row, service.extraMergeCompareConfigData(configRow));
						}
					});
				});
			};

			service.bidderCompatible = function (bidders) {
				let columnNames = [];
				_.each(bidders, function (column) {
					let names = _.filter(columnNames, function (name) {
						return name === column.Description;
					});
					columnNames.push(column.Description);
					if (names.length > 0) {
						column.Description = service.textPadding(column.Description, ' ', names.length);
					}
				});
			};

			service.checkMaxBidderWidth = function (item, allBidders, allBidderWidth) {
				let currencyTotalSize = 0;
				_.forEach(allBidders, function (bidder) {
					if (!bidder.Width && bidder.Visible) {
						bidder.Width = 0;
					}
					if (bidder.Visible === true && bidder.GroupSequence === item.GroupSequence) {
						if (!bidder.CompareColumnFk) {
							let tempTotalSize = currencyTotalSize + bidder.Width;
							if (tempTotalSize > allBidderWidth) {
								// leave width
								bidder.Width = Math.round((allBidderWidth - currencyTotalSize) * 100) / 100;
							}
							currencyTotalSize += bidder.Width;
						} else {
							let parent = _.find(allBidders, function (item) {
								return bidder.CompareColumnFk === item.Id;
							});
							bidder.Width = parent.Width;
						}
					}
				});
			};

			service.addBidderMessage = function (maxBidderNum, bidderWidth, allBidders) {
				let index = 1;
				_.forEach(allBidders, function (item) {
					if (item.Visible && !item.CompareColumnFk) {
						item.GroupSequence = Math.ceil(index / maxBidderNum);
						item.Width = bidderWidth;
						index++;
					} else if (item.Visible && !!item.CompareColumnFk) {
						let parent = _.find(allBidders, function (bidder) {
							return bidder.Id === item.CompareColumnFk;
						});
						item.GroupSequence = parent.GroupSequence;
						item.Width = parent.Width;
					} else {
						item.GroupSequence = null;
						item.Width = null;
					}
				});
			};

			service.updateBidderMessage = function updateBidderMessage(maxBidderNum, bidderWidth, allBidders, item) {
				if (item && item.CompareColumnFk > 0) {
					if (item.Visible) {
						let parent = _.find(allBidders, {Id: item.CompareColumnFk});
						item.GroupSequence = parent.GroupSequence;
						item.Width = parent.Width;
					} else {
						item.GroupSequence = null;
						item.Width = null;
					}
				} else {
					this.addBidderMessage(maxBidderNum, bidderWidth, allBidders);
				}
			};

			service.getCompareColumns = function getCompareColumns(compareType, quoteIds) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getcomparecolumns?comparetype=' + compareType + '&headers=' + quoteIds.join('_'));
			};

			service.setBidderReadonly = function setReadonly(item) {
				let readonlyField = [{field: 'Width', readonly: (!item.Visible || !!item.CompareColumnFk)}];
				platformRuntimeDataService.readonly(item, readonlyField);
			};

			service.getAllBidders = function getAllBidders(baseBidders, bidders) {
				let cloneBidders = _.clone(bidders) || [];
				if (baseBidders) {
					_.remove(cloneBidders, function (bidder) {
						return checkBidderService.item.isReference(bidder.Id);
					});
				}
				return (baseBidders || []).concat(cloneBidders);
			};

			service.getVisibleBidderLength = function getVisibleBidderLength(bidders) {
				let visibleBidders = _.filter(bidders, {Visible: true});
				return visibleBidders.length;
			};

			service.getBaseBidders = function (bidders) {
				return _.filter(bidders, function (item) {
					return checkBidderService.item.isReference(item.Id);
				});
			};

			service.reorderCompareColumns = function (compareQuoteRows, compareColumns, items, compareType) {
				if (_.isEmpty(items)) {
					return compareColumns;
				}
				let lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType',
					childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children';
				let grandRankField = _.find(compareQuoteRows, {Field: commonService.quoteCompareFields.grandTotalRank});
				if (grandRankField && grandRankField.IsSorting) {
					let grandRow = _.find(items, function (item) {
							return item[lineTypeProp] === compareLineTypes.grandTotal;
						}),
						rankRow = _.find(grandRow[childProp], function (item) {
							return item[lineTypeProp] === compareLineTypes.grandTotalRank;
						}),
						rankValues = _.map(compareColumns, function (column) {
							return {key: column.Id, rank: rankRow[column.Id]};
						});

					compareColumns = _.sortBy(compareColumns, function (item) {
						return _.find(rankValues, {key: item.Id}).rank;
					});
				}
				return compareColumns;
			};

			service.addTotalTypeRows = function (compareColumns, rfqRows, compareType, totalTypes, qtnTotals) {

				if (!angular.isArray(totalTypes) || totalTypes.length === 0 || !angular.isArray(qtnTotals) || qtnTotals.length === 0) {
					return;
				}
				let childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children',
					lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';
				let totalTypeRows = _.orderBy(totalTypes, 'Sorting', 'desc');
				angular.forEach(totalTypeRows, function (totalType, index) {
					let totalTypeRow = {
						Id: 'total_type_row_' + totalType.Id,
						LineName: totalType.Code,
						HasChildren: false,
					};
					totalTypeRow[commonService.constant.compareDescription] = totalType.DescriptionInfo.Translated || totalType.DescriptionInfo.Description || totalType.Code;
					totalTypeRow[lineTypeProp] = compareLineTypes.totalType;
					totalTypeRow[childProp] = [];

					if (rfqRows && rfqRows.length === 1) {
						totalTypeRow.RfqHeaderId = rfqRows[0].RfqHeaderId;
					}

					totalTypeRow.totals = {};
					totalTypeRow.ranks = {};
					totalTypeRow.percentages = {};
					totalTypeRow.totalValues = [];
					totalTypeRow.totalValuesExcludeTarget = [];

					_.each(compareColumns, function (visibleColumn) {
						const quoteId = visibleColumn.Id.split('_')[1];
						const total = _.find(qtnTotals, {HeaderFk: parseInt(quoteId), TotalTypeFk: totalType.Id});
						if (total) {
							totalTypeRow[visibleColumn.Id] = total.ValueNet;
						} else {
							totalTypeRow[visibleColumn.Id] = 0;
						}
					});

					_.each(compareColumns, function (visibleColumn) {
						if (checkBidderService.isNotReference(visibleColumn.Id)) {
							totalTypeRow.totals[visibleColumn.Id] = totalTypeRow[visibleColumn.Id];
							totalTypeRow.totalValues.push(totalTypeRow[visibleColumn.Id]);
							if (!visibleColumn.IsIdealBidder) {
								totalTypeRow.totalValuesExcludeTarget.push(totalTypeRow[visibleColumn.Id]);
							}
						}
					});

					totalTypeRow.totalValues = _.sortBy(totalTypeRow.totalValues); // sort by ascending for calculate rank.
					totalTypeRow.totalValuesExcludeTarget = _.sortBy(totalTypeRow.totalValuesExcludeTarget);

					// set Max/ Min/ Average value
					totalTypeRow[commonService.constant.maxValueIncludeTarget] = _.max(totalTypeRow.totalValues) || 0;
					totalTypeRow[commonService.constant.minValueIncludeTarget] = _.min(totalTypeRow.totalValues) || 0;
					totalTypeRow[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(totalTypeRow.totalValues) || 0;
					totalTypeRow[commonService.constant.maxValueExcludeTarget] = _.max(totalTypeRow.totalValuesExcludeTarget) || 0;
					totalTypeRow[commonService.constant.minValueExcludeTarget] = _.min(totalTypeRow.totalValuesExcludeTarget) || 0;
					totalTypeRow[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(totalTypeRow.totalValuesExcludeTarget) || 0;

					rfqRows.unshift(totalTypeRow);
				});

			}

			service.addQuoteCompareFieldRows = function (configService, quoteCompareRows, compareType, itemList, isChangeOrder, rfqHeaderId, reqHeaderId, isVerticalCompareRows) {

				let compareColumns = configService.visibleCompareColumnsCache;
				let visibleCompareRowsCache = configService.visibleCompareRowsCache;
				let evaluationTotal = commonService.collectEvalValue(compareColumns, rfqHeaderId);
				let evalTotalValues = evaluationTotal.totalValues;
				let evalTotalExcludeTarget = evaluationTotal.excludeTarget;
				let excludeFields = [commonService.quoteCompareFields.grandTotalRank, commonService.constant.Characteristics, commonService.quoteCompareFields.evaluatedTotal, commonService.quoteCompareFields.offeredTotal];

				let childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children';
				let lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';

				let quoteHeaderRow = {
					Id: 'quote_row_' + rfqHeaderId,
					LineName: '',
					HasChildren: true,
					LineType: -1,
					cssClass: 'font-bold'
				};
				quoteHeaderRow[lineTypeProp] = compareLineTypes.quoteTotal;
				quoteHeaderRow[childProp] = [];

				let quoteItems = [];
				_.each(quoteCompareRows, function (quoteRow) {
					if (quoteRow.Visible && !_.includes(excludeFields, quoteRow.Field)) {
						let newRow = {
							Id: 'quote_row_' + rfqHeaderId + '_' + quoteRow.Field,
							LineName: '',
							CompareDescription: quoteRow.DisplayName,
							HasChildren: false,
							RfqHeaderId: rfqHeaderId,
							ReqHeaderId: reqHeaderId,
							QuoteField: quoteRow.Field
						};
						newRow[childProp] = [];
						setValueForLineType(quoteRow, newRow);
						quoteHeaderRow[childProp].push(newRow);

						if (commonService.quoteCompareFields.evaluationResult === quoteRow.Field) {
							commonService.recalculateValue(newRow, evalTotalValues, evalTotalExcludeTarget);
						}
						_.forEach(compareColumns, function (baseCol) {
							if (commonService.quoteCompareFields.evaluationResult === quoteRow.Field) {
								commonService.evalResultStructure(rfqHeaderId, baseCol, newRow, evalTotalExcludeTarget);
								return;
							} else if (commonService.quoteCompareFields.evaluationRank === quoteRow.Field) {
								commonService.evalRankStructure(rfqHeaderId, baseCol, newRow, evalTotalExcludeTarget);
								return;
							} else if (commonService.quoteCompareFields.turnover === quoteRow.Field) {
								commonService.evalTurnover(newRow, baseCol.Id, quoteRow.Field, baseCol.BusinessPartnerId, baseCol.IsIdealBidder);
								return;
							} else if (commonService.quoteCompareFields.avgEvaluationRank === quoteRow.Field) {
								commonService.evalAvgEvaluationRank(newRow, baseCol.Id, compareColumns, quoteCompareRows, baseCol.IsIdealBidder);
								return;
							} else if (_.includes([
								commonService.quoteCompareFields.avgEvaluationA,
								commonService.quoteCompareFields.avgEvaluationB,
								commonService.quoteCompareFields.avgEvaluationC
							], quoteRow.Field)) {
								commonService.evalAvgEvaluationValue(newRow, baseCol.Id, quoteRow.Field, baseCol.BusinessPartnerId, baseCol.IsIdealBidder);
								return;
							}

							if (isChangeOrder) {
								let childCol = _.find(baseCol['Children'] || [], {
									RfqHeaderId: rfqHeaderId,
									BusinessPartnerId: baseCol.BusinessPartnerId
								});
								newRow[baseCol.Id] = childCol ? commonService.setColumnValuesForQuoteCompareFieldRows(rfqHeaderId, childCol.QuoteHeaderId, baseCol.Id, quoteRow.Field) : '';
							} else {
								newRow[baseCol.Id] = commonService.setColumnValuesForQuoteCompareFieldRows(rfqHeaderId, baseCol.QuoteHeaderId, baseCol.Id, quoteRow.Field);
							}
							let quoteItem = _.find(quoteItems, {QuoteHeaderId: baseCol.QuoteHeaderId});
							if (!quoteItem) {
								quoteItems.push({
									QuoteHeaderId: baseCol.QuoteHeaderId,
									QuoteKey: baseCol.Id
								});
							}
						});
					}
				});
				if (isVerticalCompareRows) {
					_.forEach(quoteItems, function (quoteItem) {
						_.forEach(quoteHeaderRow[childProp], function (newRow) {
							_.forEach(visibleCompareRowsCache, function (row) {
								let column = quoteItem.QuoteKey + '_' + row.Field;
								newRow[column] = commonService.setColumnValuesForQuoteCompareFieldRows(rfqHeaderId, quoteItem.QuoteHeaderId, quoteItem.QuoteKey, row.Field);
								if (!newRow[column]) {
									newRow[column] = '';
								}
							});
						});
					});
				}
				itemList.unshift(quoteHeaderRow);

				function setValueForLineType(quoteRow, newRow) {
					switch (quoteRow.Field) {
						case commonService.quoteCompareFields.code:
							newRow[lineTypeProp] = compareLineTypes.quoteCode;
							break;
						case commonService.quoteCompareFields.description:
							newRow[lineTypeProp] = compareLineTypes.quoteDescription;
							break;
						case commonService.quoteCompareFields.receiveDate:
							newRow[lineTypeProp] = compareLineTypes.receiveDate;
							break;
						case commonService.quoteCompareFields.priceFixingDate:
							newRow[lineTypeProp] = compareLineTypes.priceFixingDate;
							break;
						case commonService.quoteCompareFields.quoteDate:
						case commonService.quoteCompareFields.userDefinedDate01:
							newRow[lineTypeProp] = compareLineTypes.quoteDate;
							break;
						case commonService.quoteCompareFields.quoteStatus:
							newRow[lineTypeProp] = compareLineTypes.quoteStatus;
							break;
						case commonService.quoteCompareFields.quoteVersion:
							newRow[lineTypeProp] = compareLineTypes.quoteVersion;
							break;
						case commonService.quoteCompareFields.exchangeRate:
							newRow[lineTypeProp] = compareLineTypes.quoteExchangeRate;
							break;
						case commonService.quoteCompareFields.currency:
							newRow[lineTypeProp] = compareLineTypes.quoteCurrency;
							break;
						case commonService.quoteCompareFields.incoterms:
							newRow[lineTypeProp] = compareLineTypes.incoterms;
							break;
						case commonService.quoteCompareFields.paymentTermFI:
							newRow[lineTypeProp] = compareLineTypes.quotePaymentTermFI;
							break;
						case commonService.quoteCompareFields.paymentTermPA:
							newRow[lineTypeProp] = compareLineTypes.quotePaymentTermPA;
							break;
						case commonService.quoteCompareFields.paymentTermFiDesc:
							newRow[lineTypeProp] = compareLineTypes.quotePaymentTermFiDesc;
							break;
						case commonService.quoteCompareFields.paymentTermPaDesc:
							newRow[lineTypeProp] = compareLineTypes.quotePaymentTermPaDesc;
							break;
						case commonService.quoteCompareFields.evaluationRank:
							newRow[lineTypeProp] = compareLineTypes.evaluationRank;
							break;
						case commonService.quoteCompareFields.evaluationResult:
							newRow[lineTypeProp] = compareLineTypes.evaluationResult;
							break;
						case commonService.quoteCompareFields.userDefined1:
						case commonService.quoteCompareFields.userDefined2:
						case commonService.quoteCompareFields.userDefined3:
						case commonService.quoteCompareFields.userDefined4:
						case commonService.quoteCompareFields.userDefined5:
							newRow[lineTypeProp] = compareLineTypes.quoteUserDefined;
							break;
						case commonService.quoteCompareFields.remark:
							newRow[lineTypeProp] = compareLineTypes.quoteRemark;
							break;
						case commonService.quoteCompareFields.overallDiscount:
							newRow[lineTypeProp] = compareLineTypes.overallDiscount;
							break;
						case commonService.quoteCompareFields.overallDiscountOc:
							newRow[lineTypeProp] = compareLineTypes.overallDiscountOc;
							break;
						case commonService.quoteCompareFields.overallDiscountPercent:
							newRow[lineTypeProp] = compareLineTypes.overallDiscountPercent;
							break;
						case commonService.quoteCompareFields.turnover:
							newRow[lineTypeProp] = compareLineTypes.turnover;
							break;
						case commonService.quoteCompareFields.avgEvaluationA:
							newRow[lineTypeProp] = compareLineTypes.avgEvaluationA;
							break;
						case commonService.quoteCompareFields.avgEvaluationB:
							newRow[lineTypeProp] = compareLineTypes.avgEvaluationB;
							break;
						case commonService.quoteCompareFields.avgEvaluationC:
							newRow[lineTypeProp] = compareLineTypes.avgEvaluationC;
							break;
						case commonService.quoteCompareFields.avgEvaluationRank:
							newRow[lineTypeProp] = compareLineTypes.avgEvaluationRank;
							break;
						case commonService.quoteCompareFields.discountBasis:
							newRow[lineTypeProp] = compareLineTypes.discountBasis;
							break;
						case commonService.quoteCompareFields.discountBasisOc:
							newRow[lineTypeProp] = compareLineTypes.discountBasisOc;
							break;
						case commonService.quoteCompareFields.discountPercent:
							newRow[lineTypeProp] = compareLineTypes.discountPercent;
							break;
						case commonService.quoteCompareFields.discountAmount:
							newRow[lineTypeProp] = compareLineTypes.discountAmount;
							break;
						case commonService.quoteCompareFields.discountAmountOc:
							newRow[lineTypeProp] = compareLineTypes.discountAmountOc;
							break;
						default:
							break;
					}
				}
			};

			service.setRowValuesForStructureColumn = function (itemList, parentItem, compareType) {
				let lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType',
					childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children';
				_.each(itemList, function (item) {
					let image = '';
					let level = 0;

					if (parentItem) {
						level = parentItem.nodeInfo.level + 1;
					}
					switch (item[lineTypeProp]) {
						case compareLineTypes.grandTotal:
						case compareLineTypes.turnover:
						case compareLineTypes.evaluatedTotal:
						case compareLineTypes.offeredTotal:
						case compareLineTypes.totalType:
							image = commonService.icons.lineTypes.grandTotal; // calculate by all rfq total rows
							break;
						case compareLineTypes.rfq:
							image = commonService.icons.lineTypes.rfqTotal; // calculate by it's requisition total rows
							break;
						case compareLineTypes.quoteDate:
							image = commonService.icons.lineTypes.quoteDate;
							break;
						case compareLineTypes.quoteVersion:
							image = commonService.icons.lineTypes.quoteVersion;
							break;
						case compareLineTypes.quoteStatus:
							image = commonService.icons.lineTypes.quoteStatus;
							break;
						case compareLineTypes.quoteCode:
							image = commonService.icons.lineTypes.code;
							break;
						case compareLineTypes.quoteDescription:
							image = commonService.icons.lineTypes.description;
							break;
						case compareLineTypes.quoteExchangeRate:
							image = commonService.icons.lineTypes.exchangeRate;
							break;
						case compareLineTypes.quoteCurrency:
							image = commonService.icons.lineTypes.currency;
							break;
						case compareLineTypes.quotePaymentTermPA:
						case compareLineTypes.quotePaymentTermPaDesc:
							image = commonService.icons.lineTypes.paymentTermPA;
							break;
						case compareLineTypes.quotePaymentTermFI:
						case compareLineTypes.quotePaymentTermFiDesc:
							image = commonService.icons.lineTypes.paymentTermFI;
							break;
						case compareLineTypes.evaluationRank:
							image = commonService.icons.lineTypes.evaluationRank;
							break;
						case compareLineTypes.evaluationResult:
							image = commonService.icons.lineTypes.evaluationResult;
							break;
						case compareLineTypes.billingSchemaChildren:
							image = commonService.icons.lineTypes.description;
							break;
						case compareLineTypes.characteristicTotal:
							image = commonService.icons.lineTypes.characteristicTotal;
							break;
						case compareLineTypes.characteristicGroup:
							image = commonService.icons.lineTypes.characteristicGroup; // according to the rfq's characteristic group
							break;
						case compareLineTypes.characteristic:
							image = commonService.icons.lineTypes.characteristicItem; // according to the rfq's characteristic item
							break;
						case compareLineTypes.requisition:
							image = commonService.icons.lineTypes.requisitionTotal; // calculated by it's boq root item rows
							break;
						case compareLineTypes.generalTotal:
							image = commonService.icons.lineTypes.generalTotal;
							break;
						case compareLineTypes.generalItem:
							image = commonService.icons.lineTypes.generalItem; // according to the requisition's generals item
							break;
						case compareLineTypes.prcItem:
						case compareLineTypes.quoteNewItem:
							image = commonService.icons.lineTypes.procurementItem; // item (position -> only this item has compare field row)
							break;
						case boqMainLineTypes.root:
							image = commonService.icons.lineTypes.boqRoot; // boq item (root)
							break;
						case boqMainLineTypes.level1: // boq item (division, has possible 9 level)
						case boqMainLineTypes.level2:
						case boqMainLineTypes.level3:
						case boqMainLineTypes.level4:
						case boqMainLineTypes.level5:
						case boqMainLineTypes.level6:
						case boqMainLineTypes.level7:
						case boqMainLineTypes.level8:
						case boqMainLineTypes.level9:
							image = commonService.icons.lineTypes.boqLevel;
							break;
						case boqMainLineTypes.position:
							image = commonService.icons.lineTypes.boqItem;
							break;
						case compareLineTypes.compareField:
							image = commonService.icons.lineTypes.compareField;
							break;
						case  compareLineTypes.grandTotalRank:
							image = commonService.icons.lineTypes.evaluationRank;
							break;
						case compareLineTypes.quoteUserDefined:
							image = commonService.icons.lineTypes.description;
							break;
						case compareLineTypes.quoteRemark:
							image = commonService.icons.lineTypes.description;
							break;
						case compareLineTypes.overallDiscount:
						case compareLineTypes.overallDiscountOc:
						case compareLineTypes.overallDiscountPercent:
							image = commonService.icons.lineTypes.overallDiscount;
							break;
						case compareLineTypes.quoteTotal:
							image = commonService.icons.lineTypes.quoteTotal;
							break;
						case compareLineTypes.discountBasis:
						case compareLineTypes.discountBasisOc:
						case compareLineTypes.discountPercent:
						case compareLineTypes.discountAmount:
						case compareLineTypes.discountAmountOc:
							image = commonService.icons.lineTypes.description;
							break;
						default:
							break;
					}
					item.image = image;
					item.HasChildren = !_.isEmpty(item[childProp]);
					item.nodeInfo = {
						children: item.HasChildren,
						collapsed: true,
						level: level,
						lastElement: !item.HasChildren
					};

					if (item[childProp] && item[childProp].length > 0) {
						service.setRowValuesForStructureColumn(item[childProp], item, compareType);
					}
				});
			};

			service.setColumnValuesForGrandTotalRow = function (compareColumns, grandTotalRow, rootRows, compareType) {
				const lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';
				const childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children';
				const isExcludeEvaluatedTotal = compareConfig.isExcludeEvaluatedTotal;

				grandTotalRow.totals = {};
				grandTotalRow.ranks = {};
				grandTotalRow.percentages = {};
				grandTotalRow.totalValues = [];
				grandTotalRow.totalValuesExcludeTarget = [];

				_.each(compareColumns, function (visibleColumn) {
					const idKey = visibleColumn.Id;
					const rfqRows = _.filter(rootRows, function (item) {
						return item[lineTypeProp] === compareLineTypes.rfq;
					});

					let sum = _.sumBy(rfqRows, function (rfq) {
						let rfqTotals = rfq.totals[idKey] === commonService.constant.tagForNoQuote ? 0 : rfq.totals[idKey];
						const finalBillingSchemas = rfq.finalBillingSchemas;
						const evaluatedTotalRow = isExcludeEvaluatedTotal ? service.setColumnValuesForEvaluatedTotalRow(compareColumns, {}, [rfq], compareType) : null;
						if (isExcludeEvaluatedTotal && checkBidderService.isNotReference(idKey) && !finalBillingSchemas[idKey]) {
							rfqTotals = rfqTotals - evaluatedTotalRow.totals[idKey];
						}
						return rfqTotals;
					});

					grandTotalRow.totals[idKey] = sum;
					// exclude ideal bidders.
					if (!visibleColumn.IsIdealBidder) {
						service.concludeTargetValue(idKey, grandTotalRow.totalValues, grandTotalRow.totalValuesExcludeTarget, sum, compareType, compareColumns);
					}
				});

				// Grant total rank
				if (grandTotalRow[childProp] && grandTotalRow[childProp].length > 0) {
					let rankRow = _.find(grandTotalRow[childProp], function (item) {
							return item[lineTypeProp] === compareLineTypes.grandTotalRank;
						}),
						rankValues = [],
						referRankValues = [],
						quoteRankValues = [];
					if (rankRow) {
						_.each(compareColumns, function (visibleColumn) {
							rankValues.push({key: visibleColumn.Id, value: grandTotalRow.totals[visibleColumn.Id]});
						});
						rankValues = _.sortBy(rankValues, 'value');
						referRankValues = _.filter(rankValues, function (rank) {
							return checkBidderService.item.isReference(rank.key);
						});
						quoteRankValues = _.filter(rankValues, function (rank) {
							return checkBidderService.item.isNotReference(rank.key);
						});
						_.each(referRankValues, function (rank, i) {
							rankRow[rank.key] = 0 - i;
						});
						_.each(quoteRankValues, function (rank, i) {
							rankRow[rank.key] = i + 1;
						});
					}
				}

				grandTotalRow.totalValues = _.sortBy(grandTotalRow.totalValues); // sort by ascending for calculate rank.
				grandTotalRow.totalValuesExcludeTarget = _.sortBy(grandTotalRow.totalValuesExcludeTarget);

				// set Max/ Min/ Average value
				grandTotalRow[commonService.constant.maxValueIncludeTarget] = 0;
				grandTotalRow[commonService.constant.minValueIncludeTarget] = 0;
				grandTotalRow[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(grandTotalRow.totalValues) || 0;
				grandTotalRow[commonService.constant.maxValueExcludeTarget] = 0;
				grandTotalRow[commonService.constant.minValueExcludeTarget] = 0;
				grandTotalRow[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(grandTotalRow.totalValuesExcludeTarget) || 0;

				let minValueField = _.min(grandTotalRow.totalValuesExcludeTarget) || 0;
				// set Percentage/ Rank value (currently they don't needed, just only for using in the feature).
				_.each(compareColumns, function (visibleColumn) {
					if (minValueField === 0) {
						grandTotalRow.percentages[visibleColumn.Id] = 0;
					} else {
						grandTotalRow.percentages[visibleColumn.Id] = grandTotalRow.totals[visibleColumn.Id] / minValueField * 100;
					}
				});
				_.each(compareColumns, function (visibleColumn) {
					let rank = _.indexOf(grandTotalRow.totalValuesExcludeTarget, grandTotalRow.totals[visibleColumn.Id]);
					grandTotalRow.ranks[visibleColumn.Id] = rank + 1;
				});

				// set Percentage/ Rank value (currently they don't needed, just only for using in the feature).
				// set Percentage value (the bidder's cheapest quote value is always 100%, other bidder's percentage value calculated base on it)
				angular.forEach(compareColumns, function (visibleColumn) {
					if (checkBidderService.item.isNotReference(visibleColumn.Id)) {
						if (minValueField === 0) {
							grandTotalRow.percentages[visibleColumn.Id] = 0;
						} else {
							grandTotalRow.percentages[visibleColumn.Id] = grandTotalRow.totals[visibleColumn.Id] / minValueField * 100;
						}
					}
				});

				// set Rank value
				angular.forEach(compareColumns, function (visibleColumn) {
					if (checkBidderService.item.isNotReference(visibleColumn.Id)) {
						let rank = _.indexOf(grandTotalRow.totalValuesExcludeTarget, grandTotalRow.totals[visibleColumn.Id]);
						grandTotalRow.ranks[visibleColumn.Id] = rank + 1;
					}
				});

				// set Max/ Min/ Average value
				let children = _.filter(rootRows, function (item) {
					return item[lineTypeProp] === compareLineTypes.rfq;
				});
				commonService.combinedMaxMin(grandTotalRow, children);
			};

			service.addGrantTotalCompareRows = function (quoteCompareRows, grantTotalRow, compareType) {
				let childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children',
					lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';
				let grandTotalRank = _.find(quoteCompareRows, {Field: commonService.quoteCompareFields.grandTotalRank});
				if (grandTotalRank) {
					let node = {
						Id: 'grand_total_row_rank',
						HasChildren: false,
						CompareDescription: grandTotalRank.DisplayName
					};
					node[lineTypeProp] = compareLineTypes.grandTotalRank;
					grantTotalRow[childProp].push(node);
				}
			};

			service.restructureQuoteCompareColumns = function (mainDtos, rfqQuotes, enableBoqTarget, baseColumns) {

				let basicQuotes = [];
				// set rows 'BaseBoq/Target' readonly and  set the BusinessPartnerFk data
				_.forEach(mainDtos, function (item) {
					if (checkBidderService.item.isReference(item.Id)) {
						if (baseColumns) {
							if (baseColumns.length === 0) {
								item.Visible = true;
							}
							if (baseColumns.length > 0) {
								let baseColumn = _.find(baseColumns, {QtnHeaderFk: item.QtnHeaderFk});
								if (baseColumn) {
									item.Visible = baseColumn.Visible;
									item.IsCountInTarget = baseColumn.IsCountInTarget;
									item.DescriptionInfo.Translated = baseColumn.DescriptionInfo.Translated;
									item.ApplyReqChangesToQuote = baseColumn.ApplyReqChangesToQuote;
								}
							}
						}

						if (!item.DescriptionInfo.Translated) {
							item.DescriptionInfo.Translated = commonService.translateTargetOrBaseBoqName(item.Id);
						}
						let basicQuote = {
							Id: item.QtnHeaderFk,
							Description: commonService.translateTargetOrBaseBoqName(item.Id)
						};
						basicQuotes.push(basicQuote);
						let readonlyFields = [
							{field: 'Visible', readonly: enableBoqTarget !== false},
							{field: 'BackgroundColor', readonly: true},
							{field: 'DescriptionInfo', readonly: false},
							{field: 'QtnHeaderFk', readonly: true},
							{field: 'IsHighlightChanges', readonly: true},
							{field: 'IsDeviationRef', readonly: true},
							{field: 'IsCountInTarget', readonly: !checkBidderService.item.isTarget(item.Id)}
						];
						platformRuntimeDataService.readonly(item, readonlyFields);
					}

					// set the BusinessPartnerFk data
					item.BusinessPartnerFk = null;
					let quote = _.find(rfqQuotes, function (quote) {
						return quote.Id === item.QtnHeaderFk;
					});
					if (quote) {
						item.BusinessPartnerFk = quote.BusinessPartnerFk;
					}
					// set Highlight readonly
					commonService.highlightColumnReadonly(item);

					if (item.IsIdealBidder) {
						platformRuntimeDataService.readonly(item, [{field: 'IsCountInTarget', readonly: true}]);
					}

					platformRuntimeDataService.readonly(item, [{field: 'ApplyReqChangesToQuote', readonly: !checkBidderService.item.isTarget(item.Id)}]);
				});

				lookupDescriptorService.updateData('quote', basicQuotes);
				// Visible is false about some data while coming from dataBase, so here set their IsDeviationRef to readonly.
				commonService.setReadonlyForNotVisible(mainDtos);

				let mainData = angular.copy(mainDtos);
				let baseQuotes = [];
				let changeQuotes = [];

				_.forEach(mainData, function (item) {
					if (!item.CompareColumnFk) {
						baseQuotes.push(item);
					} else {
						changeQuotes.push(item);
					}
				});

				_.forEach(baseQuotes, function (baseRfq) {
					baseRfq.Children = _.filter(changeQuotes, function (rfq) {
						return rfq.CompareColumnFk === baseRfq.Id && rfq.BusinessPartnerFk === baseRfq.BusinessPartnerFk;
					});
				});

				// if have deviation, fire a message
				commonService.highlightColumnChangedFire(baseQuotes);

				return baseQuotes;
			};

			service.setQuoteCompareFieldsReadOnly = function (readData, gridId) {
				_.forEach(readData, function (item) {
					let readonlyFields = [];
					if (item.Field !== commonService.quoteCompareFields.grandTotalRank) {
						readonlyFields.push({field: 'IsSorting', readonly: true});
					} else {
						readonlyFields.push({
							field: 'IsSorting',
							readonly: service.isDataPropReadonly(item, 'Visible') || !item.Visible
						});
					}
					platformRuntimeDataService.readonly(item, readonlyFields);
				});
				if (gridId) {
					platformGridAPI.grids.invalidate(gridId);
				}
			};

			service.getReqCount = function (reqCounts, quoteId) {
				let reqCountItem = _.find(reqCounts, {QtnId: quoteId});
				return reqCountItem ? reqCountItem.ReqCount : null;
			};

			service.getSubTotal = function (totals, quoteId) {
				let subTotalItem = _.find(totals, {QtnId: quoteId});
				return subTotalItem ? subTotalItem.subTotal : null;
			};

			service.getGrandTotal = function (quotes, totals, businessPartnerId, version) {
				let kinds = _.filter(quotes, function (item) {
						return item.BusinessPartnerFk === businessPartnerId && item.QuoteVersion === version;
					}),
					subItems = _.filter(totals, function (total) {
						return !!_.find(kinds, {Id: total.QtnId});
					});
				return _.sumBy(subItems, 'subTotal');
			};

			service.addBoqTotalRank = function (parentItem, boqConfigService, isVerticalCompareRows) {
				let visibleRow = _.find(boqConfigService.visibleCompareRowsCache, {Field: boqCompareRows.boqTotalRank});
				if (visibleRow) {
					let currentItem = parentItem;
					if (!isVerticalCompareRows) {
						let id = parentItem.Id + '_' + visibleRow.Field;
						let totalRankItem = _.find(parentItem.BoqItemChildren, {Id: id});
						if (!totalRankItem) {
							totalRankItem = {};
							totalRankItem.Id = id;
							totalRankItem.BoqLineTypeFk = compareLineTypes.compareField;
							totalRankItem[commonService.constant.rowType] = visibleRow.Field;
							totalRankItem.LineType = compareLineTypes.compareField;
							totalRankItem.LineName = '';
							totalRankItem.parentItem = parentItem;
							totalRankItem.BoqItemChildren = [];
							totalRankItem.HasChildren = false;
							totalRankItem.CompareDescription = visibleRow.DisplayName;
							totalRankItem.RfqHeaderId = parentItem.RfqHeaderId;
							totalRankItem.ReqHeaderId = parentItem.ReqHeaderId;
							parentItem.BoqItemChildren.unshift(totalRankItem);
						}
						currentItem = totalRankItem;
					}
					let bidderTotalRanks = _.filter(parentItem.finalPriceFields, function (item, key) {
						return checkBidderService.boq.isNotReference(key);
					});
					let totalRankValues = _.sortBy(_.values(bidderTotalRanks));
					_.forEach(parentItem.finalPriceFields, function (value, key) {
						if (checkBidderService.boq.isNotReference(key)) {
							let propName = isVerticalCompareRows ? service.getCombineCompareField(key, visibleRow.Field) : key,
								rank = _.indexOf(totalRankValues, value);
							currentItem[propName] = rank + 1;
						}
					});

				}
			};

			service.getRepairNumeric = function (number, defaultValue) {
				if (number === Infinity || number === -Infinity || _.isNaN(number)) {
					return _.isNumber(defaultValue) ? defaultValue : 0;
				}
				return number;
			};

			service.concludeTargetValue = function (bidderColumnId, includedValues, excludedValues, value, compareType, bidderColumns, isCountInTargetFn) {
				let targetFn = _.isFunction(isCountInTargetFn) ? isCountInTargetFn : function (bidders, bidderId) {
					let temp = _.find(bidders, function (bidder) {
						return bidder.Id === bidderId || bidder.id === bidderId;
					}) || {};
					return temp.IsCountInTarget !== false;
				};

				let checkService = compareType === commonService.constant.compareType.boqItem ? checkBidderService.boq : checkBidderService.item;
				let temp = _.find(bidderColumns, function (bidder) {
					return bidder.Id === bidderColumnId || bidder.id === bidderColumnId;
				}) || {};
				if (checkService.isIncludedTargetCalculationColumn(bidderColumnId) && targetFn(bidderColumns, bidderColumnId) && temp.IsIdealBidder !== true && temp.PrcItemEvaluationId !== 2) {
					includedValues.push(value);
				}

				if (checkService.isExcludedTargetCalculationColumn(bidderColumnId) && temp.IsIdealBidder !== true && temp.PrcItemEvaluationId !== 2) {
					excludedValues.push(value);
				}
			};

			service.copyAndExtend = function (source, extentObj) {
				let cloneObj = angular.copy(source);
				return angular.extend(cloneObj, extentObj);
			};

			service.isCompareFieldRow = function (boqLineTypeFk) {
				return boqLineTypeFk === compareLineTypes.compareField;
			};

			service.isBoqRow = function (boqLineTypeFk) {
				return (boqLineTypeFk === boqMainLineTypes.root || (boqLineTypeFk >= boqMainLineTypes.position && boqLineTypeFk <= boqMainLineTypes.level9));
			};

			service.isBoqRootRow = function (boqLineTypeFk) {
				return boqLineTypeFk === boqMainLineTypes.root;
			};

			service.isBoqLevelRow = function (boqLineTypeFk) {
				return boqLineTypeFk >= boqMainLineTypes.level1 && boqLineTypeFk <= boqMainLineTypes.level9;
			};

			service.isBoqPositionRow = function (boqLineTypeFk) {
				return boqLineTypeFk === boqMainLineTypes.position;
			};

			service.isPrcItemRow = function (lineType) {
				return lineType === compareLineTypes.prcItem;
			};

			service.isQuoteFieldRow = function (row) {
				return !_.isNil(row.QuoteField);
			};

			service.registerEvent = function (scopeName, eventName, eventHandler) {
				let scopes = this.__eventScope || {},
					scope = scopes[scopeName] || {},
					event = scope[eventName] || new PlatformMessenger();

				event.register(eventHandler);

				scope[eventName] = event;
				scopes[scopeName] = scope;

				this.__eventScope = scopes;
			};

			service.unregisterEvent = function (scopeName, eventName, eventHandler) {
				let scopes = this.__eventScope;
				if (scopes && scopes[scopeName] && scopes[scopeName][eventName]) {
					let event = scopes[scopeName][eventName];
					event.unregister(eventHandler);
				}
			};

			service.fireEvent = function (scopeName, eventName, args) {
				let scopes = this.__eventScope;
				if (scopes && scopes[scopeName] && scopes[scopeName][eventName]) {
					let event = scopes[scopeName][eventName];
					event.fire(args);
				}
			};

			service.moveSelectedItemTo = function (type, gridId, treeOptions) {

				function isChildren(selectedItems) {
					return treeOptions && _.every(selectedItems, function (s) {
						return s[treeOptions.parentProp];
					});
				}

				function getParent(items, child) {
					return treeOptions ? _.find(items, function (p) {
						return p[treeOptions.idProp] === child[treeOptions.parentProp];
					}) : null;
				}

				function getGridSelectedInfos(gridId) {
					// platformGridAPI.rows.selection -> only for single items
					// but, multi-selection get not a toolbar function, this is maybe the solution
					let selectedInfo = {};
					let gridInstance = platformGridAPI.grids.element('id', gridId).instance;
					let gridItems = angular.isDefined(gridInstance) ? gridInstance.getData().getItems() : [];
					let targetItems = gridItems;

					// one or multiple selection
					selectedInfo.selectedRows = angular.isDefined(gridInstance) ? gridInstance.getSelectedRows() : [];

					// need for selection in grid
					selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
						// get row-data
						return gridInstance.getDataItem(row);
					});

					if (isChildren(selectedInfo.selectedItems)) {
						let parent = getParent(gridItems, selectedInfo.selectedItems[0]);
						if (parent) {
							targetItems = parent[treeOptions.childrenProp];
						}
					}

					selectedInfo.selectedRows = selectedInfo.selectedItems.map(function (item) {
						return _.findIndex(targetItems, item);
					});

					return selectedInfo;
				}

				let items = platformGridAPI.items.data(gridId);
				let selectedData = getGridSelectedInfos(gridId);
				let targetItems = items;
				let i, j;

				selectedData.selectedRows = selectedData.selectedRows.sort(function (a, b) {
					return a - b;
				});

				if (treeOptions && isChildren(selectedData.selectedItems)) {
					let parent = getParent(items, selectedData.selectedItems[0]);
					if (parent) {
						targetItems = parent[treeOptions.childrenProp];
					}
				}

				switch (type) {
					case 1:
						// moveUp
						for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
							targetItems.splice(selectedData.selectedRows[i] - 1, 0, targetItems.splice(selectedData.selectedRows[i], 1)[0]);
						}
						break;
					case 2:
						// push upwards
						for (i = 1, j = 0; i <= selectedData.selectedRows.length; i++, j++) {
							targetItems.splice((j), 0, targetItems.splice(selectedData.selectedRows[i - 1], 1)[0]);
						}
						break;
					case 3:
						// moveDown
						selectedData.selectedRows = selectedData.selectedRows.reverse();
						for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] + 1 < targetItems.length); i++) {
							targetItems.splice(selectedData.selectedRows[i] + 1, 0, targetItems.splice(selectedData.selectedRows[i], 1)[0]);
						}
						break;
					case 4:
						// push down
						for (i = 1, j = selectedData.selectedRows.length; i <= selectedData.selectedRows.length; i++, j--) {
							targetItems.splice(targetItems.length - i, 0, targetItems.splice(selectedData.selectedRows[j - 1], 1)[0]);
						}
						break;
				}

				// refresh grid content
				platformGridAPI.items.data(gridId, items);
				platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});

			};

			service.mergeGridColumnWithConfiguration = function (gridId, columns) {
				let config = mainViewService.getViewConfig(gridId);
				if (config && config.Propertyconfig) {
					let configColumns = _.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
					_.each(columns, function (col) {
						let target = _.find(configColumns, {id: col.id});
						if (target) {
							col.width = target.width;
							col.pinned = target.pinned;
						}
					});
				}
				return columns;
			};

			service.flatTree = function (itemTree, childProp, results) {
				results = results || [];
				_.each(itemTree, function (item) {
					results.push(item);
					if (item[childProp] && item[childProp].length > 0) {
						service.flatTree(platformObjectHelper.getValue(item, childProp), childProp, results);
					}
				});
				return results;
			};

			service.attachValueFromParent = function (tree, childProp, attachOptions) {
				let dataTree = _.isArray(tree) ? tree : [tree];
				_.each(dataTree, function (n) {
					if (_.isArray(n[childProp])) {
						_.each(n[childProp], function (c) {
							_.each(attachOptions, function (opt) {
								if (opt.sourceProp && opt.targetProp) {
									if (_.isFunction(opt['attachFn'])) {
										opt['attachFn'](c, n, opt.sourceProp, opt.targetProp, childProp, tree);
									} else {
										c[opt.targetProp] = n[opt.sourceProp];
									}
								}
							});

						});
						service.attachValueFromParent(n[childProp], childProp, attachOptions);
					}
				});
			};

			service.getBoqItemTypeCodes = function () {
				return service.__boqItemTypeCodes;
			};

			service.setBoqItemTypeCodes = function () {
				if (!service.__boqItemTypeCodes) {
					service.__boqItemTypeCodes = [];
				}
				return simpleLookupService.getList({
					lookupModuleQualifier: 'basics.lookup.boqitemtypecode',
					displayMember: 'Code',
					valueMember: 'Id'
				}).then(function (result) {
					service.__boqItemTypeCodes = result;
				});
			};

			service.getBoqItemType2Codes = function () {
				return service.__boqItemType2Codes;
			};

			service.setBoqItemType2Codes = function () {
				if (!service.__boqItemType2Codes) {
					service.__boqItemType2Codes = [];
				}
				return simpleLookupService.getList({
					lookupModuleQualifier: 'basics.lookup.boqitemtype2code',
					displayMember: 'Code',
					valueMember: 'Id'
				}).then(function (result) {
					service.__boqItemType2Codes = result;
				});
			};

			service.getBoqLineTypes = function () {
				return service.__boqLineTypes;
			};

			service.setBoqLineTypes = function () {
				if (!service.__boqLineTypes) {
					service.__boqLineTypes = [];
				}
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getboqlinetypes').then(function (response) {
					service.__boqLineTypes = _.filter(response.data.BoqLineType, function (item) {
						return (item.Id >= 1 && item.Id <= 9) || item.Id === 103;
					});
				});
			};

			service.setProjectChangeStatus = function () {
				if (!service.__projectChangeStatus) {
					service.__projectChangeStatus = [];
				}
				return simpleLookupService.getList({
					lookupModuleQualifier: 'basics.customize.projectchangestatus',
					displayMember: 'Description',
					valueMember: 'Id',
					filter: {
						field: 'RubricCategoryFk',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
					}
				}).then(function (result) {
					service.__projectChangeStatus = result;
				});
			};

			service.reorderToolbarItems = function reorderToolbarItems(items) {
				let boundaryEle = null;
				_.each(items, function itemIterator(item, i) {
					if (item.type === 'divider' && _.isUndefined(item.sort)) {
						if (i > 0) {
							boundaryEle = items[i - 1];
							item.sort = boundaryEle.sort;
						} else {
							item.sort = 0;
						}
					}
				});
				return _.sortBy(items, 'sort');
			};

			service.updateOverflowToolbar = function updateOverflowToolbar(items) {
				let overflowItem = _.find(items, {type: 'overflow-btn'});
				if (overflowItem) {
					let actionItems = _.filter(items, function actionItemsFilter(item) {
						return item.type !== 'overflow-btn';
					});
					while (actionItems.length > 0 && actionItems[actionItems.length - 1].type === 'divider') {
						actionItems.pop();
					}
					overflowItem.list.items = actionItems;
				}
			};

			service.refactorToolbarItems = function refactorToolbarItems(items) {
				let sortItems = this.reorderToolbarItems(items);

				this.updateOverflowToolbar(sortItems);

				return sortItems;
			};

			service.collectGeneralModifiedData = function (quoteGeneralItems, id, value, field, reqHeaderId, generalTypeId, prcHeaderId, oldPrcHeaderId, quoteId) {
				if (!commonService.PrcGeneralsToSave) {
					commonService.PrcGeneralsToSave = [];
				}
				let generalItems = _.filter(quoteGeneralItems, {
					QuoteKey: field,
					ReqHeaderId: reqHeaderId,
					GeneralTypeId: generalTypeId
				});
				if (generalItems && generalItems.length) {
					_.each(generalItems, function (generalItem) {
						generalItem.Value = value;
						let modifiedItem = _.find(commonService.PrcGeneralsToSave, {Id: generalItem.Id});
						if (modifiedItem) {
							modifiedItem.Value = value;
							return;
						}
						let item = {
							Id: generalItem.Id,
							QuoteHeaderId: quoteId,
							PrcHeaderFk: prcHeaderId,
							ReqHeaderId: reqHeaderId,
							PrcGeneralstypeFk: generalTypeId,
							Value: value
						};
						commonService.PrcGeneralsToSave.push(item);
					});
				} else {
					let newItemToSave = _.find(commonService.PrcGeneralsToSave, {Id: -id});
					if (newItemToSave) {
						newItemToSave.Value = value;
						return;
					}
					let newItem = {
						Id: -id,
						QuoteHeaderId: quoteId,
						OldPrcHeaderId: oldPrcHeaderId,
						PrcHeaderFk: prcHeaderId,
						ReqHeaderId: reqHeaderId,
						PrcGeneralstypeFk: generalTypeId,
						Value: value
					};
					commonService.PrcGeneralsToSave.push(newItem);
				}
			};

			service.generalModifiedDataChange = function (item, field, qtnMatchCache, visibleCompareColumnsCache, fromRefresh) {
				let qtnMatch = _.find(qtnMatchCache[item.RfqHeaderId], function (item) {
					return item.QuoteKey === field;
				});
				item.totals[field] = item[field];
				item.totalValues = [];
				item.totalValuesExcludeTarget = [];
				_.forIn(item.totals, function (val, key) {
					service.concludeTargetValue(key, item.totalValues, item.totalValuesExcludeTarget, val, commonService.constant.compareType.boqItem, visibleCompareColumnsCache);
				});
				commonService.recalculateValue(item, item.totalValues, item.totalValuesExcludeTarget); // recalculate max,min,avg
				if (!fromRefresh) {
					let generalId = item.Id.split('_')[3];
					let reqGeneralItem = _.find(commonService.generalItems[item.RfqHeaderId], {QuoteKey: checkBidderService.constant.targetKey});
					let quoteGenerals = commonService.generalItems[item.RfqHeaderId];
					if (quoteGenerals && item.parentItem && item.parentItem.parentItem && item.parentItem.parentItem.QuoteGeneralItems) {
						_.each(item.parentItem.parentItem.QuoteGeneralItems, function (general) {
							quoteGenerals.push(general);
						});
					}
					service.collectGeneralModifiedData(quoteGenerals, generalId, item[field], field, item.ReqHeaderId, item.GeneralTypeId, qtnMatch.PrcHeaderId, reqGeneralItem.PrcHeaderId, qtnMatch.QtnHeaderId);
				}
			};

			service.resetGenerals = function (tree, children, lineType, eventValue, qtnMatchCache, visibleCompareColumnsCache) {
				let subTree = _.find(tree, function (item) {
					return item[lineType] === compareLineTypes.rfq && item.RfqHeaderId === eventValue.entity.RfqHeaderId;
				});

				if (!subTree) {
					return;
				}
				let qtnTree = _.find(subTree[children], function (item) {
					return item[lineType] === compareLineTypes.requisition && item.ReqHeaderId === eventValue.entity.ReqHeaderId;
				});

				if (!qtnTree) {
					return;
				}
				let generalTotal = _.find(qtnTree[children], function (item) {
					return item[lineType] === compareLineTypes.generalTotal;
				});

				if (!generalTotal) {
					return;
				}
				let currGeneral = _.find(generalTotal[children], function (item) {
					return item[lineType] === compareLineTypes.generalItem && item.Id === eventValue.entity.Id;
				});
				if (!currGeneral) {
					return;
				}
				currGeneral[eventValue.key] = eventValue.value;
				service.generalModifiedDataChange(currGeneral, eventValue.field, qtnMatchCache, visibleCompareColumnsCache, true);
			};

			service.itemTypeReadonlyFire = function (itemObj, rows, itemType, tryTimes) {
				let checkedItems = _.filter(rows, {'IsChecked': true});
				if (checkedItems.length <= 0) {
					commonService.onItemTypeReadonly.fire({
						itemType: itemType,
						readonly: true,
						tryTimes
					});
				} else if (!itemObj || !itemObj.item || (checkedItems.length === 1 && itemObj.item.IsChecked)) {
					commonService.onItemTypeReadonly.fire({
						itemType: itemType,
						readonly: false,
						tryTimes
					});
				}
			};

			service.itemTypeReadonlyRegister = function (eventInfo, gridId, itemType, headerCheckHelperService) {
				if (eventInfo.itemType === itemType) {
					if (eventInfo.readonly) {
						headerCheckHelperService.disabledHeaderCheckBox(gridId, ['IsChecked'], true, eventInfo.tryTimes);
					} else {
						headerCheckHelperService.enabledHeaderCheckBox(gridId, ['IsChecked'], true, eventInfo.tryTimes);

					}
					platformGridAPI.grids.refresh(gridId, true);
				}
			};

			service.itemTypeReadonlyOnload = function itemTypeReadonlyOnload() {
				let rows1 = platformGridAPI.items.data('F47D1AA927604D7EAABE5CBCC0DEDFC9');
				let rows2 = platformGridAPI.items.data('4759D4BC86CC454FABA90BB287CD9D58');
				let checkedItems1 = _.filter(rows1, {'IsChecked': true});
				let checkedItems2 = _.filter(rows2, {'IsChecked': true});
				if (checkedItems1.length <= 0 && checkedItems2.length > 0) {
					service.itemTypeReadonlyFire(null, rows1, 'itemType1', 10);
				} else if (checkedItems2.length <= 0 && checkedItems1.length > 0) {
					service.itemTypeReadonlyFire(null, rows2, 'itemType2', 10);
				}
			};

			service.setConfigFieldReadonly = function (field, key, item, qtnMatchCache, quoteItem, isIdealBidder, isVerticalCompareRows) {
				if (_.includes(commonService.configReadonlyFields, field)) {
					let qtnStatus = commonService.getQtnStatusById(qtnMatchCache, key, item.RfqHeaderId);
					if (checkBidderService.item.isReference(key) || (qtnStatus && qtnStatus.IsReadonly) || (qtnStatus && qtnStatus.IsProtected) || isIdealBidder) {
						let readonlyFields = [
							{field: key, readonly: true}
						];
						commonService.setFieldReadOnly(item, readonlyFields);
					}
				}
				// note: to do #135815 ,quantity field should not rely 'is free quantity' field.
				/* if (field === commonService.itemCompareFields.quantity && !quoteItem.IsFreeQuantity) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				} */

				if (field === boqCompareRows.lumpsumPrice && !quoteItem.IsLumpsum) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				}

				if (field === boqCompareRows.notSubmitted && quoteItem.Price === 0 && quoteItem.NotSubmitted) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				}

				if (field === boqCompareRows.included && quoteItem.Price === 0) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				}

				if (field === commonService.itemCompareFields.exQtnIsEvaluated) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				}

				if (field === commonService.itemCompareFields.isFreeQuantity && quoteItem.ItemTypeFk === 7) {
					commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
				}

				if (isVerticalCompareRows) {
					if (field === boqCompareRows.isLumpsum || field === boqCompareRows.included || field === boqCompareRows.notSubmitted) {
						if (_.includes(['QuoteCol_-1_-1_-1', 'QuoteCol_-2_-2_-2'], quoteItem.QuoteKey)) {
							commonService.setFieldReadOnly(item, [{field: key, readonly: true}]);
						}
					}
				}
			};

			service.recalculateBillingSchema = function (dataService, quoteHeaderId, exchangeRate, prcItemModifiedItems, boqModifiedItems, prcItemModifiedData, boqModifiedData, billingSchema) {
				if ((!prcItemModifiedItems || prcItemModifiedItems.length <= 0) && (!boqModifiedItems || boqModifiedItems.length <= 0) && !billingSchema) {
					return;
				}
				if (quoteHeaderId < 0) {
					return;
				}
				let billingSchemaService = $injector.get('priceComparisonBillingSchemaService');
				let selectQuote = dataService.selectedQuote;
				let tempBillingSchema = billingSchema || billingSchemaService.getList();
				let schema = _.cloneDeep(tempBillingSchema);
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/recalculatebillingschema', {
					prcItemModifiedItems: !_.isEmpty(prcItemModifiedItems) ? prcItemModifiedItems : [],
					boqModifiedItems: !_.isEmpty(boqModifiedItems) ? boqModifiedItems : [],
					prcItemModifiedData: prcItemModifiedData,
					boqModifiedData: boqModifiedData,
					quoteHeaderId: quoteHeaderId,
					exchangeRate: exchangeRate,
					billingSchema: schema,
					prcGenerals: commonService.PrcGeneralsToSave ? commonService.PrcGeneralsToSave : []
				}).then(function (response) {
					if (response.data['BillingSchemas']) {
						billingSchemaService.updateBillingSchemaData(response.data['BillingSchemas']);
						dataService.resetBillingSchemaValue(response.data['BillingSchemaTypes'], selectQuote, response.data['BillingSchemas']);
					}
					return billingSchemaService.getList();
				});
			};

			service.getOriginalQuoteItems = function getOriginalQuoteItems(dataService, children, quoteId) {
				let itemTree = dataService.getTree();
				return _.filter(commonService.getAllQuoteItems(itemTree, children), function (i) {
					return i.QtnHeaderId === quoteId;
				});
			};

			service.getNumericFormattedValue = function getNumericFormattedValue(value, domain) {
				let culture = platformContextService.culture();
				let cultureInfo = platformLanguageService.getLanguageInfo(culture);
				let domainInfo = platformDomainService.loadDomain(domain);

				if (_.isNumber(value)) {
					value = accounting.formatNumber(value, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
				}
				return value;
			};

			service.attachCostGroupValueToEntity = function attachCostGroupValueToEntity(roots, costGroupValues, childrenProp, identityGetter, findPredicate) {
				let flatList = _.filter(this.flatTree(roots, childrenProp), findPredicate);
				_.each(flatList, function (item) {
					let target = _.find(item.QuoteItems, {QuoteKey: 'QuoteCol_-1_-1_-1'});
					item.ReqBoqHeaderId = target ? target.BoqHeaderId : null;
					item.ReqBoqItemId = target ? target.BoqItemId : null;
				});
				basicsCostGroupAssignmentService.attachCostGroupValueToEntity(flatList, costGroupValues, identityGetter);
			};

			service.attachExtraValueToTreeRows = function attachExtraValueToTreeRows(roots, processors, childProp) {
				let flatList = this.flatTree(roots, childProp);
				_.each(flatList, function (row) {
					let matches = _.filter(processors, function (item) {
						return item.isMatched(row);
					});
					_.each(matches, function (match) {
						match.process(row, flatList);
					});
				});
			};

			service.createRowProcessor = function (quoteKey, fields, isMatchedFn, findTarget, defaultValue) {
				let getTargetValue = function (row, target, targetProp, defValue) {
					let returnValue;
					if (target) {
						returnValue = target[targetProp];
					} else {
						if (_.isObject(defValue)) {
							let valueGetter = defValue[targetProp];
							returnValue = _.isFunction(valueGetter) ? valueGetter(row, target) : valueGetter;
						} else {
							returnValue = defValue;
						}
					}
					return returnValue;
				};
				let fieldAssignFn = function (row, target, assignFields, defValue) {
					if (_.isArray(assignFields)) {
						_.each(assignFields, function (field) {
							fieldAssignFn(row, target, field, defValue);
						});
					} else if (_.isObject(assignFields)) {
						row[assignFields['rowProp']] = getTargetValue(row, target, assignFields['targetProp'], defValue);
					} else {
						row[assignFields] = getTargetValue(row, target, assignFields, defValue);
					}
				};
				return {
					isMatched: function (row) {
						return isMatchedFn(row);
					},
					process: function (row) {
						let target;
						if (findTarget && _.isFunction(findTarget)) {
							target = findTarget(row);
						} else {
							target = _.find(row.QuoteItems, {QuoteKey: quoteKey});
						}
						fieldAssignFn(row, target, fields, defaultValue);
					}
				};
			};

			service.encodeEntity = function encodeEntity(text) {
				return text ? text.replace(/</g, '&lt;').replace(/>/g, '&gt;') : text;
			};

			service.tryGetQuoteHeader = function (headerFk) {
				let headers = lookupDescriptorService.getData('Quote');
				return _.find(headers, {Id: headerFk});
			};

			service.tryGetQuoteConfigurationId = function (headerFk) {
				let header = this.tryGetQuoteHeader(headerFk);
				return header ? header.PrcConfigurationFk : null;
			};

			service.tryGetTaxCodeFK = function (row, tree, quoteKey, childProp, defaultTaxCodeFk, isFlatTree) {
				let targetItem = _.find(row.QuoteItems, {QuoteKey: quoteKey});
				let taxCodeFk = targetItem ? targetItem.TaxCodeFk : null;

				if (!taxCodeFk) {
					let flatTree = isFlatTree ? tree : service.flatTree(tree, childProp);
					while (!taxCodeFk && row && row.ParentId) {
						row = _.find(flatTree, {Id: row.ParentId});
						targetItem = row ? _.find(row.QuoteItems, {QuoteKey: quoteKey}) : null;
						if (targetItem) {
							taxCodeFk = targetItem.TaxCodeFk;
						}
					}
				}

				return taxCodeFk || defaultTaxCodeFk;
			};

			service.tryGetTaxCodeFromMatrix = function (taxCodeFk, vatGroupFk) {
				let taxCode = null;
				let taxCodeMatrix = lookupDescriptorService.getData('TaxCodeMatrix');

				if (taxCodeMatrix) {
					taxCode = _.find(taxCodeMatrix, {
						VatGroupFk: vatGroupFk,
						TaxCodeFk: taxCodeFk
					});
				}

				if (!taxCode) {
					let taxCodes = lookupDescriptorService.getData('TaxCode');
					taxCode = _.find(taxCodes, {Id: taxCodeFk});
				}

				return taxCode;
			};

			service.isLayoutBidderLineValueColumn = function (column) {
				let id = '_rt$bidder_linevalue';
				return column === id || column.id === id;
			};

			service.sortQuoteColumns = function (quoteColumns, columnBidder) {
				if (columnBidder && columnBidder.children) {
					quoteColumns.sort(function (a, b) {
						let aCol = service.extractCompareInfoFromFieldName(a.field);
						let bCol = service.extractCompareInfoFromFieldName(b.field);
						let aField = aCol.quoteKey === aCol.field ? 'LineValue' : aCol.field;
						let bField = bCol.quoteKey === bCol.field ? 'LineValue' : bCol.field;
						let aIndex = columnBidder.children.findIndex(function (m) {
							return m.field === aField;
						});
						let bIndex = columnBidder.children.findIndex(function (n) {
							return n.field === bField;
						});

						return aIndex !== -1 && bIndex !== -1 ? aIndex - bIndex : 0;
					});
				}
				return quoteColumns;
			};

			service.getDefaultConditionalFormat = function () {
				let objConditionalFormat = {
					'MAX()': 'color:red;',
					'AVG()': 'color:blue;',
					'MIN()': 'color:green;'
				};
				return angular.toJson(objConditionalFormat);
			};

			service.getConditionalFormatterList = function (customFormatter) {
				let formatterObj;
				let formatterList = [];

				if (customFormatter && Object.getOwnPropertyNames(customFormatter).length > 0) {
					formatterObj = angular.fromJson(customFormatter);
				} else {
					formatterObj = angular.fromJson(service.getDefaultConditionalFormat());
				}

				_.forEach(formatterObj, function (value, key) {
					formatterList.push({'Script': key, 'Style': value});
				});

				return formatterList;
			};

			service.hasPermissionForModule = function (moduleName) {
				return naviPermissionService.hasPermissionForModule(moduleName);
			};

			service.getColumnsFromViewConfig = function (gridId) {
				let config = mainViewService.getViewConfig(gridId);
				let columns = [];
				if (config && config.Propertyconfig) {
					columns = angular.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
				}

				let bidderColumn = _.find(columns, col => col.id === '_rt$bidder');
				if (bidderColumn) {
					if (bidderColumn.children && bidderColumn.children.length > 0) {
						service.bidderChildrenCache = bidderColumn.children;
					} else {
						bidderColumn.children = service.bidderChildrenCache || [];
					}
				}
				return columns;
			};

			service.setStyleForCellValueUsingTagDiv = function (styleList, value, formattedValue, column, dataContext, highlightQtn, deviationRow, minValue, maxValue, avgValue, compareType, isVerticalCompareRows) {
				let styles = '';
				let styleListObj = _.isString(styleList) ? JSON.parse(styleList) : styleList;
				_.map(styleListObj, function (style, script) {
					if (service.parseConditionalFormatScript(column, script, value, dataContext, minValue, maxValue, avgValue, compareType, isVerticalCompareRows)) {
						styles += style;
					}
				});
				let isCompareItem = compareType === commonService.constant.compareType.prcItem;
				let compareField = isCompareItem ? service.getPrcCompareField(dataContext, column) : service.getBoqCompareField(dataContext, column);
				let deviationFields = isCompareItem ? commonService.itemDeviationFields : commonService.boqDeviationFields;
				if (_.includes(deviationFields, compareField) && deviationRow === true) {
					formattedValue = '<i class="block-image control-icons ico-pricecomp-deviation" title="Highlight Changes From Deviation"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
				}
				if (_.includes(commonService.highlightFields, compareField) && highlightQtn === true) {
					formattedValue = '<i class="block-image control-icons ico-pricecomp-various" title="Highlight Changes Among QTN"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
				}
				if (commonService.itemCompareFields.price === compareField || commonService.itemCompareFields.priceOc === compareField) { // ico-evaluation-max ico-evaluation-min
					let parentItem = dataContext;
					if (!isVerticalCompareRows) {
						parentItem = dataContext.parentItem;
					}
					let targetItem = _.find(parentItem.QuoteItems, item => item.QuoteKey === column.field);
					if (targetItem && targetItem.ExQtnIsEvaluated) {
						if (targetItem.PrcItemEvaluationId && targetItem.PrcItemEvaluationId === 5) { //average
							formattedValue = '<i class="block-image control-icons ico-evaluation-average"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
						} else if (targetItem.PrcItemEvaluationId && targetItem.PrcItemEvaluationId === 6) { //min
							formattedValue = '<i class="block-image control-icons ico-evaluation-min"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
						} else if (targetItem.PrcItemEvaluationId && targetItem.PrcItemEvaluationId === 7) { //max
							formattedValue = '<i class="block-image control-icons ico-evaluation-max"></i>' + '<span class="pane-r">' + formattedValue + '</span>';
						}
					}
				}
				if (styles) {
					styles = '<div style="' + styles + '">' + formattedValue + '</div>';
				} else {
					styles = formattedValue;
				}
				return styles;
			};

			service.setStyleForCellValueUsingTagSpan = function (styleList, value, formattedValue, column, dataContext, minValue, maxValue, avgValue, compareType, isVerticalCompareRows) {
				let styles = '';
				let styleListObj = _.isString(styleList) ? JSON.parse(styleList) : styleList;
				_.map(styleListObj, function (style, script) {
					if (service.parseConditionalFormatScript(column, script, value, dataContext, minValue, maxValue, avgValue, compareType, isVerticalCompareRows)) {
						styles += style;
					}
				});
				if (styles) {
					styles = '<span style="' + styles + '">' + formattedValue + '</span>';
				} else {
					styles = formattedValue;
				}

				return styles;
			};

			service.parseConditionalFormatScript = function (column, script, value, dataContext, minValue, maxValue, avgValue, compareType, isVerticalCompareRows) {
				let isCompareItem = compareType === commonService.constant.compareType.prcItem;
				let isCompareRow = isCompareItem ? dataContext.LineType === compareLineTypes.prcItem : service.isBoqRow(dataContext.BoqLineTypeFk);
				let compareRowPrefix = isVerticalCompareRows && column.isVerticalCompareRows && isCompareRow ? column.originalField + '_' : '';

				minValue = minValue ? minValue : (dataContext[compareRowPrefix + commonService.constant.minValueExcludeTarget] ? dataContext[compareRowPrefix + commonService.constant.minValueExcludeTarget] : 0);
				maxValue = maxValue ? maxValue : (dataContext[compareRowPrefix + commonService.constant.maxValueExcludeTarget] ? dataContext[compareRowPrefix + commonService.constant.maxValueExcludeTarget] : 0);
				avgValue = avgValue ? avgValue : (dataContext[compareRowPrefix + commonService.constant.averageValueExcludeTarget] ? dataContext[compareRowPrefix + commonService.constant.averageValueExcludeTarget] : 0);

				// Fixed issue # 133350 # Price Comparison: Highlight Color is twisted for Quote Evaluation Result. Best is "Red" and worst is "green" - should be the other way around
				// Fixed issue # 139159 # Colors are wrong for BP Evaluation in Price Comparison - please turn it around higher=better
				// This is just workaround, the best practice is every row has owner color setting.
				let rowType = isCompareItem ? dataContext.LineType : dataContext.BoqLineTypeFk;
				if (_.includes([
					compareLineTypes.evaluationResult,
					compareLineTypes.avgEvaluationA,
					compareLineTypes.avgEvaluationB,
					compareLineTypes.avgEvaluationC], rowType)) {
					value = -value;

					const minValueTemp = minValue;
					const maxValueTemp = maxValue;
					minValue = -maxValueTemp;
					maxValue = -minValueTemp;

					avgValue = -avgValue;
				}

				let scope = $injector.get('$rootScope').$new(true);
				let result;
				let expression = {
					MAX: function () {
						return value - maxValue >= 0; // for each cell in that row, it's the Maximum value
					},
					MIN: function () {
						return value - minValue <= 0; // for each cell in that row, it's the Minimum value
					},
					AVG: function () {
						return value - avgValue === 0; // for each cell in that row, it's the Average value
					},
					// usage: VAL() > 100 && VAL() < 200, which means,
					// for each cell in that row, is the cell value between 100 and 200
					VAL: function (field) {
						if (angular.isDefined(field) && angular.isDefined(dataContext[field])) {
							return dataContext[field];
						} else {
							return value;
						}
					}
				};

				// assign the method to scope
				_.map(expression, function (val, key) {
					scope[key] = val;
				});

				try {
					// TODO: Replace with new Function(....)?
					result = scope.$eval(script.toUpperCase());
				} catch (e) {
					result = false;
				}

				return result;
			};

			service.postAsForm = function (url, formData) {
				return $http.post(url, formData, {
					headers: {
						'Content-Type': undefined
					},
					transformRequest: _.identity
				});
			};

			service.lookupFormatter = function (row, cell, value, dataContext, column, formatterOptions) {
				if (_.includes([commonService.constant.tagForNoQuote, '', null, undefined], value)) {
					return value;
				}
				let formatterColumn = _.mergeWith(_.clone(column), formatterOptions ? {
					formatterOptions: formatterOptions
				} : null);

				let entity = _.clone(dataContext);
				entity[column.field] = value;

				let lookupFn = platformGridDomainService.formatter('lookup');
				return lookupFn(row, cell, value, formatterColumn, entity);
			};

			service.uomLookupFormatter = function (row, cell, uomValue, dataContext, column) {
				return service.lookupFormatter(row, cell, uomValue, dataContext, column, {
					lookupType: 'PCUom',
					displayMember: 'UnitInfo.Translated'
				});
			};

			service.projectChangeFormatter = function (row, cell, value) {
				let items = lookupDescriptorService.getData('projectchange');
				let item = _.find(items, item => item.Id === value);
				return item ? item.Code : '';
			};

			service.projectChangeStatusFormatter = function (row, cell, value) {
				let status = _.find(service.__projectChangeStatus, item => item.Id === value);
				let formatString = '';
				if (status) {
					let imageUrl = platformStatusIconService.select(status);
					let isCss = platformStatusIconService.hasOwnProperty('isCss') ? platformStatusIconService.isCss() : false;
					formatString = (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
						'<span style="padding-left: .1em;">' + status.Description + '</span>';
				}
				return formatString;
			};

			service.statisticValue = function (items) {
				return {
					minValue: _.min(items),
					maxValue: _.max(items),
					avgValue: commonService.calculateAverageValue(items)
				};
			};

			service.isBidderColumn = function (column) {
				return _.startsWith(column.field, 'QuoteCol_');
			};

			service.isLineValueColumn = function (column) {
				return /QuoteCol_-?\d+_-?\d+_-?\d+$/.test(column.field);
			};

			service.clearButtonTag = function (text) {
				if (angular.isString(text)) {
					text = text.replace(/<\/?button[^>]*>/g, '');
				}
				return text;
			};

			service.createRowReader = function (options) {
				let reader = _.mergeWith({
					compareValue: function (/* dataContext, isVerticalCompareRows */) {
						return true;
					},
					cell: []
				}, options);

				// Push the default reader to the last.
				reader.cell.push(this.createCellReader());

				return reader;
			};

			service.createCellReader = function (options) {
				return _.mergeWith({
					compareValue: function (/* columnDef, isVerticalCompareRows */) {
						return true;
					},
					readValue: function (dataContext, columnDef) {
						return dataContext[columnDef.field];
					},
					readFormattedValue: function (row, cell, dataContext, columnDef) {
						return _.toString(this.readValue(dataContext, columnDef));
					},
					isInvalidValue: function (originalValue) {
						return _.includes([undefined], originalValue);
					},
					valueType: null
				}, options);
			};

			service.registerDataReader = function (registerService, columnValueFunctions, compareType, isVerticalCompareRowsFn, isShowInSummaryActivatedFn) {
				let prop = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';

				registerService.getRowReader = function (dataContext) {
					return _.find(columnValueFunctions, r => {
						return _.isFunction(r.compareValue) ? r.compareValue(dataContext, isVerticalCompareRowsFn()) : dataContext[prop] === r.compareValue;
					});
				};

				registerService.getCellReader = function (dataContext, columnDef, rowReader) {
					if (!rowReader) {
						rowReader = this.getRowReader(dataContext);
					}
					return _.find(rowReader.cell, r => {
						return _.isFunction(r.compareValue) ? r.compareValue(columnDef, isVerticalCompareRowsFn()) : columnDef.field === r.compareValue;
					});
				};

				registerService.readCellValue = function (dataContext, columnDef, cellReader, rowReader) {
					if (!cellReader) {
						cellReader = this.getCellReader(dataContext, columnDef, rowReader);
					}
					return cellReader ? cellReader.readValue(dataContext, columnDef) : null;
				};

				registerService.readCellFormattedValue = function (row, cell, dataContext, columnDef, cellReader, rowReader) {
					if (!cellReader) {
						cellReader = this.getCellReader(dataContext, columnDef, rowReader);
					}
					return cellReader ? cellReader.readFormattedValue(row, cell, dataContext, columnDef) : null;
				};

				registerService.readCellValueType = function (dataContext, columnDef, cellReader, rowReader) {
					if (!cellReader) {
						cellReader = this.getCellReader(dataContext, columnDef, rowReader);
					}
					return cellReader ? (_.isFunction(cellReader.readValueType) ? cellReader.readValueType(dataContext, columnDef, isShowInSummaryActivatedFn()) : cellReader.valueType) : null;
				};

				registerService.readCellFormatCode = function (dataContext, columnDef, cellReader, rowReader) {
					if (!cellReader) {
						cellReader = this.getCellReader(dataContext, columnDef, rowReader);
					}
					return cellReader ? (_.isFunction(cellReader.readFormatCode) ? cellReader.readFormatCode(dataContext, columnDef, isShowInSummaryActivatedFn()) : cellReader['formatCode']) : null;
				};
			};

			service.updateCompareConfig = function (items, compareRows, billingSchemaRows, quoteRows, compareType) {
				if (items && items.length > 0) {
					let isCompareBoq = compareType === commonService.constant.compareType.boqItem;
					_.each(items, function (item) {
						service.mergeCompareConfig(item, [{
							prop: isCompareBoq ? 'BoqCustomRow' : 'ItemCustomRow',
							source: compareRows
						}, {
							prop: isCompareBoq ? 'BoqCustomQuoteRow' : 'ItemCustomQuoteRow',
							source: quoteRows
						}, {
							prop: isCompareBoq ? 'BoqCustomSchemaRow' : 'ItemCustomSchemaRow',
							source: billingSchemaRows
						}]);
						service.bidderCompatible(isCompareBoq ? item['BoqCustomColumn'] : item['ItemCustomColumn']);
					});
				}
			};

			service.getVatPercentExpressionValue = function getVatPercentExpressionValue(taxCodeFk, vatGroupFk, dataSource) {
				let rowIndex = -1;
				let taxCode = _.get(dataSource, 'MdcTaxCode') || _.values(lookupDescriptorService.getData('MdcTaxCode'));
				let taxCodeMatrixes = _.get(dataSource, 'TaxCodeMatrixs') || _.values(lookupDescriptorService.getData('TaxCodeMatrixs'));
				if (!!taxCodeFk && !!vatGroupFk) {
					rowIndex = _.findIndex(taxCodeMatrixes, item => item.MdcTaxCodeFk === taxCodeFk && item.BpdVatgroupFk === vatGroupFk);
				}
				if (rowIndex > -1) {
					rowIndex = taxCode.length + rowIndex;
				} else if (taxCodeFk) {
					rowIndex = _.findIndex(taxCode, item => item.Id === taxCodeFk);
				} else {
					rowIndex = taxCode.length + taxCodeMatrixes.length; // vatPercent : 0
				}
				return rowIndex !== -1 ? service.formatExpressionValue(rowIndex, 2) : null;
			};

			service.getFieldCellIndex = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, leadingField) {
				let rowIndex;
				if (isVerticalCompareRows) {
					rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
					colIndex = _.findIndex(columns, column => column.id === col.quoteKey + '_' + leadingField);
				} else {
					rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.LineType === compareLineTypes.compareField && row.ParentId === currRow.ParentId);
				}
				return rowIndex !== -1 && colIndex !== -1 ? service.formatExpressionValue(rowIndex, colIndex) : null;
			};

			service.getDeviationReferenceFieldIndex = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, compareType) {
				let leadingField = userData.leadingFieldCache;
				if (compareType === commonService.constant.compareType.boqItem) {
					let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
					if (service.isBoqRootRow(boqRow.BoqLineTypeFk) || service.isBoqLevelRow(boqRow.BoqLineTypeFk)) {
						leadingField = boqCompareRows.itemTotal;
					}
				}
				let visibleRow = _.find(userData.visibleCompareRowsCache, {Field: commonService.itemCompareFields.absoluteDifference});
				let indexStr = commonService.getSelectedLookupMes(visibleRow.DeviationReference);
				let quoteItems = isVerticalCompareRows ? currRow.QuoteItems : currRow.parentItem.QuoteItems;
				let differentFields = commonService.checkHighlightQtn(userData.visibleCompareColumnsCache, quoteItems);
				let basicQuoteKey = differentFields.markFieldQtn;
				let rowIndex = -1;
				if (isVerticalCompareRows) {
					rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
					if (indexStr === commonService.constant.deviationColumn && !!basicQuoteKey) {
						colIndex = _.findIndex(columns, item => item.field === basicQuoteKey + '_' + leadingField);
					} else {
						if (checkBidderService.isReference(indexStr)) {
							switch (visibleRow.DeviationReference) {
								case 4: {
									colIndex = _.findIndex(columns, item => item.field === indexStr + '_' + leadingField);
									break;
								}
								case 10: {
									colIndex = _.findIndex(columns, item => item.field === commonService.itemCompareFields.budgetPerUnit);
									break;
								}
								case 11: {
									colIndex = _.findIndex(columns, item => item.field === commonService.itemCompareFields.budgetTotal);
									break;
								}
								default:
									break;
							}
						}
					}
				} else {
					if (indexStr === commonService.constant.deviationColumn && !!basicQuoteKey) {
						indexStr = basicQuoteKey;
						rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.ParentId === currRow.ParentId && (row.LineType === compareLineTypes.compareField || row.BoqLineTypeFk === compareLineTypes.compareField));
					} else {
						switch (visibleRow.DeviationReference) {
							case 4: {
								rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.ParentId === currRow.ParentId && (row.LineType === compareLineTypes.compareField || row.BoqLineTypeFk === compareLineTypes.compareField));
								break;
							}
							case 10: {
								indexStr = commonService.itemCompareFields.budgetPerUnit;
								rowIndex = _.findIndex(rows, row => row.Id === currRow.ParentId);
								break;
							}
							case 11: {
								indexStr = commonService.itemCompareFields.budgetTotal;
								rowIndex = _.findIndex(rows, row => row.Id === currRow.ParentId);
								break;
							}
							default:
								break;
						}
					}
					colIndex = _.findIndex(columns, item => item.field === indexStr);
				}
				return rowIndex !== -1 && colIndex !== -1 ? service.formatExpressionValue(rowIndex, colIndex) : null;
			};

			service.getBidderReferenceFieldIndex = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, compareType) {
				let leadingField = userData.leadingFieldCache;
				if (compareType === commonService.constant.compareType.boqItem) {
					let boqRow = isVerticalCompareRows ? currRow : currRow.parentItem;
					if (service.isBoqRootRow(boqRow.BoqLineTypeFk) || service.isBoqLevelRow(boqRow.BoqLineTypeFk)) {
						leadingField = boqCompareRows.itemTotal;
					}
				}
				let rowIndex = -1;
				let results;
				if (isVerticalCompareRows) {
					rowIndex = _.findIndex(rows, row => row.Id === currRow.Id);
					results = _.filter(columns, column => {
						return checkBidderService.isNotReference(column.quoteKey) && column.originalField === leadingField;
					}).map(c => {
						let columnIndex = _.findIndex(columns, column => {
							return column.field === c.field;
						});
						return [rowIndex, columnIndex];
					});
				} else {
					rowIndex = _.findIndex(rows, row => row.rowType === leadingField && row.LineType === compareLineTypes.compareField && row.ParentId === currRow.ParentId);
					results = _.filter(columns, column => {
						return checkBidderService.isNotReference(column.field) && service.isBidderColumn(column);
					}).map(c => {
						let columnIndex = _.findIndex(columns, column => {
							return column.field === c.field;
						});
						return [rowIndex, columnIndex];
					});
				}
				return results.map(m => service.formatExpressionValue(m[0], m[1])).join(',');
			};

			service.deviationDifferenceFormula = function (currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData) {
				let visibleRow = _.find(userData.visibleCompareRowsCache, {Field: commonService.itemCompareFields.absoluteDifference});
				let indexStr = commonService.getSelectedLookupMes(visibleRow.DeviationReference);
				let differentFields = commonService.checkHighlightQtn(userData.visibleCompareColumnsCache, isVerticalCompareRows ? currRow.QuoteItems : currRow.parentItem.QuoteItems);
				let basicQuoteKey = differentFields.markFieldQtn;
				if (indexStr === commonService.constant.deviationColumn && !!basicQuoteKey) {
					let targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === basicQuoteKey) : _.find(currRow.parentItem.QuoteItems, item => item.QuoteKey === basicQuoteKey);
					return targetItem ? '{leadingField}-{deviationReference}' : '{leadingField}';
				} else {
					if (checkBidderService.isReference(indexStr)) {
						let targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === indexStr) : _.find(currRow.parentItem.QuoteItems, item => item.QuoteKey === indexStr);
						return targetItem ? '{leadingField}-{deviationReference}' : '{leadingField}';
					} else {
						if (indexStr === commonService.constant.averageValueExcludeTarget) {
							return '{leadingField}-AVERAGE({bidderReference})';
						} else if (indexStr === commonService.constant.minValueExcludeTarget) {
							return '{leadingField}-MIN({bidderReference})';
						} else if (indexStr === commonService.constant.maxValueExcludeTarget) {
							return '{leadingField}-MAX({bidderReference})';
						} else { // unset DeviationReference
							return 'IF(MIN({bidderReference})=0,0,{leadingField}-MIN({bidderReference}))';
						}
					}
				}
			};

			service.percentageFormula = function (currRow, columns, currCol, colIndex, isVerticalCompareRows, lookupMap, userData) {
				let visibleRow = _.find(userData.visibleCompareRowsCache, {Field: commonService.itemCompareFields.absoluteDifference});
				let indexStr = commonService.getSelectedLookupMes(visibleRow.DeviationReference);
				let differentFields = commonService.checkHighlightQtn(userData.visibleCompareColumnsCache, isVerticalCompareRows ? currRow.QuoteItems : currRow.parentItem.QuoteItems);
				let basicQuoteKey = differentFields.markFieldQtn;
				if (indexStr === commonService.constant.deviationColumn && !!basicQuoteKey) {
					let targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === basicQuoteKey) : _.find(currRow.parentItem.QuoteItems, item => item.QuoteKey === basicQuoteKey);
					return targetItem ? 'IF({deviationReference}=0,0,{leadingField}/{deviationReference})' : '0';
				} else {
					if (checkBidderService.isReference(indexStr)) {
						let targetItem = isVerticalCompareRows ? _.find(currRow.QuoteItems, item => item.QuoteKey === indexStr) : _.find(currRow.parentItem.QuoteItems, item => item.QuoteKey === indexStr);
						return targetItem ? 'IF({deviationReference}=0,0,{leadingField}/{deviationReference})' : '0';
					} else {
						if (indexStr === commonService.constant.averageValueExcludeTarget) {
							return 'IF(AVERAGE({bidderReference})=0,0,{leadingField}/AVERAGE({bidderReference}))';
						} else if (indexStr === commonService.constant.minValueExcludeTarget) {
							return 'IF(MIN({bidderReference})=0,0,{leadingField}/MIN({bidderReference}))';
						} else if (indexStr === commonService.constant.maxValueExcludeTarget) {
							return 'IF(MAX({bidderReference})=0,0,{leadingField}/MAX({bidderReference}))';
						} else { // unset DeviationReference
							return 'IF(MIN({bidderReference})=0,0,{leadingField}/MIN({bidderReference}))';
						}
					}
				}
			};

			service.createQuoteRowFinder = function (compareField) {
				return function (rows, currRow, columns, col, colIndex, isVerticalCompareRows) {
					const rowIndex = _.findIndex(rows, (row) => {
						return row.LineType === compareField || row.BoqLineTypeFk === compareField;
					});
					const targetColIndex = isVerticalCompareRows ? _.findIndex(columns, c => {
						return c.field === col.quoteKey;
					}) : colIndex;
					return rowIndex !== -1 && targetColIndex !== -1 ? service.formatExpressionValue(rowIndex, targetColIndex) : null;
				};
			};

			service.formatExpressionValue = function formatExpressionValue(row, cell) {
				return '[' + row + ',' + cell + ']';
			};

			service.setColumnValuesForStatisticalRow = function (compareColumns, totalRow, rootRows, compareType, statisticalPredicateFn) {
				const lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';
				const childProp = compareType === commonService.constant.compareType.boqItem ? 'BoqItemChildren' : 'Children';
				const positionType = compareType === commonService.constant.compareType.boqItem ? boqMainLineTypes.position : compareLineTypes.prcItem;
				const childTotal = compareType === commonService.constant.compareType.boqItem ? commonService.boqCompareFields.itemTotal : commonService.itemCompareFields.total;

				totalRow.totals = {};
				totalRow.ranks = {};
				totalRow.percentages = {};
				totalRow.totalValues = [];
				totalRow.totalValuesExcludeTarget = [];

				_.each(compareColumns, function (visibleColumn) {
					totalRow[visibleColumn.Id] = 0;
				});

				let childRows = _.filter(service.flatTree(rootRows, childProp), item => item[lineTypeProp] === positionType && checkBidderService.isNotReference(item.QuoteKey));
				_.each(compareColumns, function (visibleColumn) {
					_.each(childRows, childRow => {
						let quoteItem = _.find(childRow.QuoteItems, item => item.QuoteKey === visibleColumn.Id);
						if (quoteItem) {
							if (_.isFunction(statisticalPredicateFn) && statisticalPredicateFn(quoteItem) && Object.hasOwnProperty.call(totalRow, visibleColumn.Id)) {
								totalRow[visibleColumn.Id] += quoteItem[childTotal];
							}
						}
					});
				});

				_.each(compareColumns, function (visibleColumn) {
					if (checkBidderService.isNotReference(visibleColumn.Id)) {
						totalRow.totals[visibleColumn.Id] = totalRow[visibleColumn.Id];
						totalRow.totalValues.push(totalRow[visibleColumn.Id]);
						if (!visibleColumn.IsIdealBidder) {
							totalRow.totalValuesExcludeTarget.push(totalRow[visibleColumn.Id]);
						}
					}
				});

				totalRow.totalValues = _.sortBy(totalRow.totalValues); // sort by ascending for calculate rank.
				totalRow.totalValuesExcludeTarget = _.sortBy(totalRow.totalValuesExcludeTarget);

				// set Max/ Min/ Average value
				totalRow[commonService.constant.maxValueIncludeTarget] = _.max(totalRow.totalValues) || 0;
				totalRow[commonService.constant.minValueIncludeTarget] = _.min(totalRow.totalValues) || 0;
				totalRow[commonService.constant.averageValueIncludeTarget] = commonService.calculateAverageValue(totalRow.totalValues) || 0;
				totalRow[commonService.constant.maxValueExcludeTarget] = _.max(totalRow.totalValuesExcludeTarget) || 0;
				totalRow[commonService.constant.minValueExcludeTarget] = _.min(totalRow.totalValuesExcludeTarget) || 0;
				totalRow[commonService.constant.averageValueExcludeTarget] = commonService.calculateAverageValue(totalRow.totalValuesExcludeTarget) || 0;
				return totalRow;
			};

			service.setColumnValuesForEvaluatedTotalRow = function (compareColumns, evaluatedTotalRow, rootRows, compareType) {
				return service.setColumnValuesForStatisticalRow(compareColumns, evaluatedTotalRow, rootRows, compareType, (quoteItem) => {
					return quoteItem.PrcItemEvaluationId && quoteItem.ExQtnIsEvaluated;
				});
			};

			service.setColumnValuesForOfferedTotalRow = function (compareColumns, offeredTotalRow, rootRows, compareType) {
				return service.setColumnValuesForStatisticalRow(compareColumns, offeredTotalRow, rootRows, compareType, (quoteItem) => {
					return !quoteItem.ExQtnIsEvaluated;
				});
			};

			service.buildEvaluatedTotalExpress = function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, compareType) {
				let totalProp = compareType === commonService.constant.compareType.boqItem ? boqCompareRows.itemTotal : commonService.itemCompareFields.total;
				let lineTypeProp = compareType === commonService.constant.compareType.boqItem ? 'BoqLineTypeFk' : 'LineType';
				let itemProp = compareType === commonService.constant.compareType.boqItem ? boqMainLineTypes.position : compareLineTypes.prcItem;
				let results;
				let targetRows;
				if (isVerticalCompareRows) {
					targetRows = _.filter(rows, item => item[lineTypeProp] === itemProp);
					results = targetRows.map(r => {
						let rowIndex = _.findIndex(rows, row => {
							return row.Id === r.Id;
						});
						let quoteItem = _.find(r.QuoteItems, quoteItem => quoteItem.QuoteKey === col.id);
						colIndex = _.findIndex(columns, column => column.id === col.id + '_' + totalProp && quoteItem && quoteItem.PrcItemEvaluationId && quoteItem.ExQtnIsEvaluated);
						return [rowIndex, colIndex];
					});
				} else {
					targetRows = _.filter(rows, row => {
						return row[lineTypeProp] === compareLineTypes.compareField && row.rowType === totalProp;
					});
					targetRows = _.filter(targetRows, row => {
						let quoteItem = _.find(row.parentItem.QuoteItems, quoteItem => quoteItem.QuoteKey === col.id);
						return quoteItem && quoteItem.PrcItemEvaluationId && quoteItem.ExQtnIsEvaluated;
					});
					results = targetRows.map(r => {
						let rowIndex = _.findIndex(rows, row => {
							return row.Id === r.Id;
						});
						return [rowIndex, colIndex];
					});
				}
				results = _.filter(results, r => {
					return r[0] > -1 && r[1] > -1;
				});
				return results.map(m => service.formatExpressionValue(m[0], m[1])).join(',');
			};

			service.removeDataRowsRecursively = function (dataTree, predicate, isSoftRemove, compareType) {
				let removeItems = [];
				let items = angular.isArray(dataTree) ? dataTree : [dataTree];
				let childProp = compareType === commonService.constant.compareType.prcItem ? 'Children' : 'BoqItemChildren';

				if (isSoftRemove) {
					let predicatedItems = _.filter(items, predicate);
					_.each(predicatedItems, function itemIterator(item) {
						item._rt$Deleted = true;
					});
					removeItems = removeItems.concat(predicatedItems);
				} else {
					removeItems = removeItems.concat(_.remove(items, predicate));
				}

				_.each(items, function (node) {
					if (node[childProp] && node[childProp].length > 0) {
						removeItems = removeItems.concat(service.removeDataRowsRecursively(node[childProp], predicate, isSoftRemove));
					}

					if (isSoftRemove) {
						node.HasChildren = !_.isNil(node[childProp]) && _.filter(node[childProp], function (item) {
							return !item._rt$Deleted;
						}).length > 0;
					} else {
						node.HasChildren = !_.isNil(node[childProp]) && node[childProp].length > 0;
					}

					if (node.nodeInfo) {
						node.nodeInfo.children = node.HasChildren;
						node.nodeInfo.lastElement = !node.HasChildren;
					}
				});
				return removeItems;
			};

			service.isStandardBoq = function (basItemTypeFk, basItemType2Fk) {
				return basItemTypeFk === boqMainItemTypes.standard && _.includes([boqMainItemTypes2.normal, boqMainItemTypes2.base, boqMainItemTypes2.alternativeAwarded], basItemType2Fk);
			};

			service.isOptionalWithItBoq = function (basItemTypeFk, basItemType2Fk) {
				return basItemTypeFk === boqMainItemTypes.optionalWithIT && _.includes([boqMainItemTypes2.normal, boqMainItemTypes2.base, boqMainItemTypes2.alternativeAwarded], basItemType2Fk);
			};

			service.isOptionalWithoutItBoq = function (basItemTypeFk) {
				return basItemTypeFk === boqMainItemTypes.optionalWithoutIT;
			};

			service.isAlternativeBoq = function (basItemType2Fk) {
				return basItemType2Fk === boqMainItemTypes2.alternative;
			};

			service.isItemWithITBoq = function (basItemTypeFk, basItemType2Fk) {
				return (basItemTypeFk === 0 || basItemTypeFk === boqMainItemTypes.standard || basItemTypeFk === boqMainItemTypes.optionalWithIT)
					&& (basItemType2Fk === null || basItemType2Fk === boqMainItemTypes2.normal || basItemType2Fk === boqMainItemTypes2.base || basItemType2Fk === boqMainItemTypes2.alternativeAwarded);
			};

			service.isBoqDisabledOrNA = function (item) {
				return item.IsDisabled || item.IsNotApplicable;
			};

			service.processQuote = function (items) {
				let dateFields = ['DateDelivery', 'DateEffective', 'DateQuoted', 'DatePricefixing', 'DateReceived', 'UserDefinedDate01'];

				// translate additional quotes(Id<0) #135243
				_.forEach(items, function (item) {
					if (checkBidderService.isReference(item.Id)) {
						item.Description = commonService.translateTargetOrBaseBoqName(item.Id);
					}
					if (item.PaymentTermFiFk) {
						let paymentTerm = lookupDescriptorService.getItemByIdSync(item.PaymentTermFiFk, {lookupType: 'PaymentTerm'});
						item.PaymentTermFiDesc = platformObjectHelper.getValue(paymentTerm, 'Description') || '';
					}
					if (item.PaymentTermPaFk) {
						let paymentTerm = lookupDescriptorService.getItemByIdSync(item.PaymentTermPaFk, {lookupType: 'PaymentTerm'});
						item.PaymentTermPaDesc = platformObjectHelper.getValue(paymentTerm, 'Description') || '';
					}
				});

				return service.processDate(items, dateFields);
			};

			service.processDate = function (items, dateFields) {
				if (!_.isEmpty(items) && !_.isEmpty(dateFields)) {
					let dateProcessor = new ServiceDataProcessDatesExtension(dateFields);
					items.forEach(item => {
						dateProcessor.processItem(item);
					});
				}
				return items;
			};

			service.isAverageMaxMinCol = function (columnDef) {
				return columnDef.field === commonService.constant.maxValueIncludeTarget ||
					columnDef.field === commonService.constant.minValueIncludeTarget ||
					columnDef.field === commonService.constant.averageValueIncludeTarget ||
					columnDef.field === commonService.constant.maxValueExcludeTarget ||
					columnDef.field === commonService.constant.minValueExcludeTarget ||
					columnDef.field === commonService.constant.averageValueExcludeTarget;
			};

			service.getAverageMaxMinValue = function (dataContext, columnDef) {
				switch (columnDef.field) {
					case commonService.constant.maxValueIncludeTarget:
						return _.max(dataContext.totalValues);
					case commonService.constant.minValueIncludeTarget:
						return _.min(dataContext.totalValues);
					case commonService.constant.averageValueIncludeTarget:
						return commonService.calculateAverageValue(dataContext.totalValues);
					case commonService.constant.maxValueExcludeTarget:
						return _.max(dataContext.totalValuesExcludeTarget);
					case commonService.constant.minValueExcludeTarget:
						return _.min(dataContext.totalValuesExcludeTarget);
					case commonService.constant.averageValueExcludeTarget:
						return commonService.calculateAverageValue(dataContext.totalValuesExcludeTarget);
				}
			};

			service.createStatisticCells = function (compareType) {
				return [
					service.createStatisticCell(commonService.constant.maxValueIncludeTarget, compareType),
					service.createStatisticCell(commonService.constant.maxValueExcludeTarget, compareType),
					service.createStatisticCell(commonService.constant.minValueIncludeTarget, compareType),
					service.createStatisticCell(commonService.constant.minValueExcludeTarget, compareType),
					service.createStatisticCell(commonService.constant.averageValueIncludeTarget, compareType),
					service.createStatisticCell(commonService.constant.averageValueExcludeTarget, compareType)
				];
			};

			service.createStatisticCell = function (field, compareType) {
				return {
					formula: (function () {
						switch (field) {
							case commonService.constant.maxValueIncludeTarget:
							case commonService.constant.maxValueExcludeTarget:
								return 'MAX({total})';
							case commonService.constant.minValueIncludeTarget:
							case commonService.constant.minValueExcludeTarget:
								return 'MIN({total})';
							case commonService.constant.averageValueIncludeTarget:
							case commonService.constant.averageValueExcludeTarget:
								return 'IF(ISNUMBER(AVERAGE({total})),AVERAGE({total}),0)';
						}
					})(),
					cell: function (row, column) {
						return column.field === field;
					},
					expression: {
						total: function (rows, currRow, columns, col, colIndex, isVerticalCompareRows, lookupMap, userData, dataRowDic) {
							let results;
							let rowIndex = service.findIndexByKeyFromDicCache(currRow.Id, dataRowDic.rows);
							let isBoqItem = compareType === commonService.constant.compareType.boqItem;
							let lineTypeProp = isBoqItem ? 'BoqLineTypeFk' : 'LineType';
							let childProp = isBoqItem ? 'BoqItemChildren' : 'Children';
							let totalProp = isBoqItem ? boqCompareRows.itemTotal : commonService.itemCompareFields.total;

							if (isVerticalCompareRows) {
								let targetColumns;
								if (service.isBoqPositionRow(currRow[lineTypeProp]) || currRow[lineTypeProp] === compareLineTypes.prcItem) {
									targetColumns = _.filter(columns, column => column.field === column.quoteKey + '_' + boqCompareRows.itemTotal && !column.isIdealBidder && checkBidderService.isNotReference(column.quoteKey));
								} else {
									targetColumns = dataRowDic.bidderColumns;
								}
								if (!service.isExcludeTargetColumn(col)) {
									let countInTargetColumnIds = _.filter(userData.visibleCompareColumnsCache, item => item.IsCountInTarget).map(item => item.Id);
									targetColumns = _.filter(targetColumns, bidderColumn => {
										return _.indexOf(countInTargetColumnIds, bidderColumn.field) > -1 || _.indexOf(countInTargetColumnIds, bidderColumn.quoteKey) > -1;
									});
								}
								results = targetColumns.map(targetColumn => {
									colIndex = service.findIndexByKeyFromDicCache(targetColumn.field, dataRowDic.columns)
									return [rowIndex, colIndex];
								});
							} else {
								let bidderColumns = dataRowDic.bidderColumns;
								if (!service.isExcludeTargetColumn(col)) {
									bidderColumns = dataRowDic.countInTargetColumns;
								}
								if (service.isBoqPositionRow(currRow[lineTypeProp]) || currRow[lineTypeProp] === compareLineTypes.prcItem) {
									let itemTotalRow = _.find(currRow[childProp], childRow => {
										return childRow.rowType === totalProp;
									});
									if (itemTotalRow) {
										rowIndex = service.findIndexByKeyFromDicCache(itemTotalRow.Id, dataRowDic.rows);
									}
									results = bidderColumns.map(bidderColumn => {
										const colIndex = service.findIndexByKeyFromDicCache(bidderColumn.field, dataRowDic.columns)
										return [rowIndex, colIndex];
									});
								} else {
									results = bidderColumns.map(bidderColumn => {
										const colIndex = service.findIndexByKeyFromDicCache(bidderColumn.field, dataRowDic.columns)
										return [rowIndex, colIndex];
									});
								}
							}
							return results.map(m => service.formatExpressionValue(m[0], m[1])).join(',');
						}
					}
				};
			};

			service.isExcludeTargetColumn = function (col) {
				let excludeColumns = [commonService.constant.maxValueExcludeTarget, commonService.constant.minValueExcludeTarget, commonService.constant.averageValueExcludeTarget];
				return _.indexOf(excludeColumns, col.id) > -1 || _.indexOf(excludeColumns, col.field) > -1;
			};

			service.createGridCellButtonTemplateAsNavigator = function (column, entity, toolTip, callbackFn, options) {
				let navOptions = {
					field: column.field,
					navigator: {
						moduleName: 'procurement.pricecomparison',
						navFunc: callbackFn,
						toolTip: toolTip,
						toolTip$tr$: toolTip
					}
				};

				let createOptions = _.extend({
					disabled: false,
					icon: 'ico-goto'
				}, options);

				let navEntity = {};
				navEntity[column.field] = true;

				let navBtnHtml = platformGridDomainService.getNavigator(navOptions, navEntity);
				// need css-class navigator-dynamic for the context-menu function. Without the css, hover-button is not shown in grid-cell.
				let navDom = $(navBtnHtml).css('position', 'relative').removeClass('ico-goto').addClass(createOptions.icon).addClass('navigator-dynamic');

				if (createOptions.disabled) {
					navDom.attr('disabled', createOptions.disabled);
				}

				return $('<div></div>').append(navDom).html();
			};

			service.isEvaluatedTotalVisible = function (visibleQuoteCompareRowsCache) {
				let evaluatedTotal = _.find(visibleQuoteCompareRowsCache, {Field: commonService.quoteCompareFields.evaluatedTotal});
				return evaluatedTotal && evaluatedTotal.Visible;
			};

			service.isOfferedTotalVisible = function (visibleQuoteCompareRowsCache) {
				let offeredTotal = _.find(visibleQuoteCompareRowsCache, {Field: commonService.quoteCompareFields.offeredTotal});
				return offeredTotal && offeredTotal.Visible;
			};

			service.clearItemEvaluationRecalculateRowCache = function (itemEvaluationNodes, modifiedData, isVerticalCompareRows) {
				let modifiedKeys = _.keys(modifiedData);
				let targetEvaluationNodes = _.filter(itemEvaluationNodes, node => {
					let targetRow = isVerticalCompareRows ? node : node.parentItem;
					return _.some(targetRow.QuoteItems, item => {
						return _.includes(modifiedKeys, _.toString(item.QtnHeaderId));
					});
				});
				_.each(targetEvaluationNodes, node => {
					if (node.allRecaluclateRows) {
						node.allRecaluclateRows = null;
					}
				});
			};

			service.getCompareFieldNode = function (dataService, compareType, quoteItem, quoteKey, itemKey, compareField) {
				let compareFieldNode = {};
				let grid = platformGridAPI.grids.element('id', dataService.gridId).instance;
				let rows = platformGridAPI.rows.getRows(dataService.gridId);

				if (dataService.isVerticalCompareRows()) {
					compareFieldNode.item = quoteItem;
					let compareFieldCol = _.find(grid.getColumns(), function (col) {
						return col.id === quoteKey + '_' + compareField;
					});
					if (compareFieldCol) {
						let index = compareFieldCol._index;
						let targetRow = _.find(rows, function (row) {
							return row.Id === itemKey;
						});
						let rowIndex = _.indexOf(rows, targetRow);
						compareFieldNode.node = grid.getCellNode(rowIndex, index);
					}
					return compareFieldNode;
				}

				let Children = compareType === commonService.constant.compareType.prcItem ? quoteItem.Children : quoteItem.BoqItemChildren;
				if (Children) {
					let compareFieldItem = _.find(Children, function (item) {
						return item.Id === quoteItem.Id + '_' + compareField;
					});
					compareFieldNode.item = compareFieldItem;
					if (compareFieldItem) {
						let index = Children.indexOf(compareFieldItem);
						let activeCell = grid.getActiveCell();
						if (activeCell) {
							compareFieldNode.node = grid.getCellNode(activeCell.row + index, activeCell.cell);
						}
					}
				}
				return compareFieldNode;
			};

			service.setCompareFieldReadOnly = function (dataService, compareType, parentItem, quoteKey, itemKey, compareField, checked) {
				let node = service.getCompareFieldNode(dataService, compareType, parentItem, quoteKey, itemKey, compareField);
				if (node && node.item) {
					// includedNode.node[0].childNodes[0].checked = includeChecked;
					if (dataService.isVerticalCompareRows()) {
						platformRuntimeDataService.readonly(node.item, [{field: quoteKey + '_' + compareField, readonly: checked}]);
					} else {
						platformRuntimeDataService.readonly(node.item, [{field: quoteKey, readonly: checked}]);
					}
				}
			};

			service.normalizeField = function (field) {
				return field;
			};

			service.assignDecimalPlacesOptions = function (options, specifiedField) {
				const normalizedField = service.normalizeField(specifiedField);
				const roundingDataService = roundingService.getService('basics.material');
				const roundFields = roundingDataService.getFieldsRoundType();
				return Object.hasOwn(roundFields, normalizedField) ? _.extend({}, options, {
					decimalPlaces: function () {
						return roundingDataService.getDecimalPlaces(normalizedField);
					}
				}) : options;
			};

			service.toDictionary = function (items, keySelector, includeIndex) {
				const map = new Map();

				if (!_.isFunction(keySelector)) {
					const propName = keySelector || 'Id';
					keySelector = (item) => item[propName];
				}

				items.forEach((item, index) => {
					const key = keySelector(item);
					map.set(key, includeIndex ? {
						value: item,
						index: index
					} : item);
				});

				return map;
			};

			service.shrinkBoqTree = function (tree, maxSize) {
				_.each(tree, item => {
					const targets = _.filter(item.BoqItemChildren, child => _.includes([103, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], child.BoqLineTypeFk));
					if (targets.length > maxSize) {
						const results = targets.slice(0, maxSize + 1);
						_.remove(item.BoqItemChildren, child => _.includes([103, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], child.BoqLineTypeFk) && !_.includes(results, child));
					} else {
						service.shrinkBoqTree(item.BoqItemChildren, maxSize);
					}
				});
			};

			service.stringToFile = function (text, fileName, mimeType) {
				const blob = new Blob([text], {type: mimeType});
				return new File([blob], fileName, {type: mimeType});
			};

			service.uploadLargeObjectAsFile = function (obj, fileName, mineType) {
				const text = JSON.stringify(obj);
				const file = this.stringToFile(text, fileName || 'default', mineType || 'text/plain');
				return basicsCommonSimpleUploadService.uploadFile(file, {
					basePath: 'procurement/pricecomparison/upload/',
					customRequest: {
						OriginalFileName: file.name
					}
				});
			};

			service.findIndexFromDicCache = function (predicate, rows, caches, keyProp) {
				let index = -1;
				const target = _.find(rows, predicate);
				if (target) {
					index = service.findIndexByKeyFromDicCache(target[keyProp], caches);
				}
				return index;
			};

			service.findIndexByKeyFromDicCache = function (key, caches) {
				const cache = caches.get(key);
				return cache ? cache.index : -1;
			};

			service.getCostLineTypeId = function (key) {
				return key.split('_').pop();
			};

			return service;
		}]);

})(angular);