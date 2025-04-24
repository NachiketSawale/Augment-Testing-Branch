/**
 * Created by wed on 9/20/2018.
 */

(function config(angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonPrintHelperService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$window',
		'$injector',
		'$translate',
		'platformGridAPI',
		'platformModalService',
		'platformObjectHelper',
		'PlatformMessenger',
		'platformContextService',
		'platformGridDomainService',
		'basicsCommonFileDownloadService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonLineTypes',
		'procurementPriceComparisonPrintSettingService',
		'boqMainLineTypes',
		'procurementPriceComparisonBoqCompareRows',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonItemConfigFactory',
		'procurementPriceComparisonItemDataStructureServiceFactory',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonBoqConfigFactory',
		'procurementPriceComparisonBoqDataStructureFactory',
		'procurementPriceComparisonBoqHelperService',
		function procurementPriceComparisonPrintHelperService(
			_,
			globals,
			$q,
			$http,
			$window,
			$injector,
			$translate,
			platformGridAPI,
			platformModalService,
			platformObjectHelper,
			PlatformMessenger,
			platformContextService,
			platformGridDomainService,
			basicsCommonFileDownloadService,
			basicsLookupDescriptorService,
			commonService,
			constants,
			lineTypes,
			settingService,
			boqMainLineTypes,
			boqCompareRows,
			boqService,
			itemService,
			commonHelperService,
			bidderCheckService,
			itemConfigFactory,
			itemStructureFactory,
			itemHelperService,
			boqConfigFactory,
			boqStructureFactory,
			boqHelperService) {

			let utils = {
				getClientPath: function () {
					let url = $window.location.href;
					let clientIndex = url.indexOf('/client/');
					return url.substring(0, clientIndex) + '/client/';
				},
				loadCssStyles: function (document, urls) {
					let clientPath = this.getClientPath();
					_.each(urls, function urlIterator(url) {
						let link = document.createElement('link');
						link.type = 'text/css';
						link.rel = 'stylesheet';
						link.href = clientPath + 'cloud.style/content/' + url;
						document.getElementsByTagName('head')[0].appendChild(link);
					});
				},
				loadCssTexts: function (document, appendRule) {
					return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/printcssresources').then(function responseCallback(response) {
						_.each(response.data, function cssIterator(cssText) {
							let styleElement = document.createElement('style');
							document.getElementsByTagName('head')[0].appendChild(styleElement);
							styleElement.textContent = cssText + (appendRule || []).join(' ');
						});
						return response.data;
					});
				},
				getPaperSizeName: function (value) {
					switch (value) {
						case 1:
							return 'A4';
						case 2:
							return 'A3';
						case 3:
							return 'letter';
						default:
							return 'A4';
					}
				},
				getOrientationName: function (value) {
					return value.toString() === '2' ? 'landscape' : 'portrait';
				},
				getWidthPercent: function (tableWidth, tdWidth) {
					if (tdWidth && tableWidth) {
						return ((tdWidth / tableWidth) * 100).toFixed(2) + '%';
					}
					return 'auto;';
				},
				getPreviewWidth: function (tableWidth) {
					switch (tableWidth.toString()) {
						case '1512': // A4-P
							return 796;
						case '2138.4':
							return 1122; // A4-L & A3-P
						case '3024':
							return 1589;
						case '1555.2':
							return 818;
						case '2008.8':
							return 1056;
						default:
							return 796;
					}
				},
				bidderNameFormatter: function (tmpl, prefix, name, index) {
					return tmpl.replace('{{PREFIX}}', prefix).replace('{{BIDDERNAME}}', name).replace('{{INDEX}}', index);
				},
				isUrbField: function (rowType) {
					return _.includes(commonService.unitRateBreakDownFields, rowType);
				},
				isDiscountField: function (rowType) {
					return _.includes([
						boqCompareRows.discountPercentIT,
						boqCompareRows.discount,
						boqCompareRows.discountPercent,
						boqCompareRows.discountedPrice,
						boqCompareRows.discountedUnitPrice,
						commonService.itemCompareFields.discount,
						commonService.itemCompareFields.discountAbsolute,
						commonService.itemCompareFields.discountAbsoluteOc,
						commonService.itemCompareFields.discountAbsoluteGross,
						commonService.itemCompareFields.discountAbsoluteGrossOc
					], rowType);
				},
				isOptionalWithoutITSummaryField: function (boqLineType) {
					return _.includes([
						boqCompareRows.summaryOptionalWITTotal,
						boqCompareRows.summaryOptionalWITABS,
						boqCompareRows.summaryOptionalWITPercent,
						boqCompareRows.summaryOptionalWITDiscountTotal
					], boqLineType);
				},
				parseTemplate: function (template, contextData) {
					if (contextData && template) {
						for (let name in contextData) {
							if (Object.hasOwn(contextData, name)) {
								let regPattern = name.replace('[', '\\[').replace(']', '\\]');
								template = template.replace(new RegExp(regPattern, 'gi'), contextData[name]);
							}
						}
					}
					return template;
				},
				createCompletelySheetPage: function (body) {
					return ('<!DOCTYPE html>' +
						'<html lang="en">' +
						'<head>' +
						'<meta charset="utf-8" />' +
						'<title></title>' +
						'</head>' +
						'<body>{{BODY}}</body>' +
						'</html>').replace('{{BODY}}', body);
				},
				isShortenField: function (field) {
					return _.indexOf(['Brief'], field) > -1;
				}
			};

			let itemConfigService = itemConfigFactory.getService('print.item.config.service');
			let itemStructureService = itemStructureFactory.getService(itemConfigService, 'print.item.structure.service');

			let boqConfigService = boqConfigFactory.getService('print.boq.config.service');
			let boqStructureService = boqStructureFactory.getService(boqConfigService, 'print.boq.structure.service');

			function createPageHeaderOrFooter(contextData, settings, configProp) {
				let setting = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.' + configProp, {});
				let leftView = setting.leftTemplate;
				let middleView = setting.middleTemplate;
				let rightView = setting.rightTemplate;

				let containerStyles = ['padding:0px 10px !important;', 'font-size:12px;', 'font-weight:normal;', 'overflow:hidden !important;'];
				let floatStyles = ['float: left;', 'width:33.33%;', 'padding:10px 0;', 'line-height:25px;', 'min-height:10px;'];
				if (leftView) {
					if (setting.leftPicture) {
						contextData['&[Picture]'] = '<img class="user-img" style="max-height:50px;margin: 0 2px;" src="data:image/png;base64,' + setting.leftPicture + '" alt="" />';
					}
					leftView = utils.parseTemplate(leftView, contextData);
				}
				if (middleView) {
					if (setting.middlePicture) {
						contextData['&[Picture]'] = '<img class="user-img" style="max-height:50px;margin: 0 2px;" src="data:image/png;base64,' + setting.middlePicture + '" alt=""/>';
					}
					middleView = utils.parseTemplate(middleView, contextData);
				}
				if (rightView) {
					if (setting.rightPicture) {
						contextData['&[Picture]'] = '<img class="user-img" style="max-height:50px;margin: 0 2px;" src="data:image/png;base64,' + setting.rightPicture + '" alt=""/>';
					}
					rightView = utils.parseTemplate(rightView, contextData);
				}
				return '<div class="header-footer" style="' + containerStyles.join('') + '"><div style="' + floatStyles.join('') + 'text-align:left;">' + (_.trim(leftView) || '&nbsp;') + '</div><div style="' + floatStyles.join('') + 'width:33.34%;text-align:center;">' + (_.trim(middleView) || '&nbsp;') + '</div><div style="' + floatStyles.join('') + 'text-align: right;">' + (_.trim(rightView) || '&nbsp;') + '</div></div>';
			}

			function createPageHeader(contextData, settings) {
				return createPageHeaderOrFooter(contextData, settings, 'header');
			}

			function createCoverSheet(printType, configData, coverHtml, contextData, settings) {
				let result = /<body>([\s\S]*)<\/body>/.exec(coverHtml || '');
				if (result && result.length > 1) {
					contextData = angular.extend({
						'&[_PrintType]': printType === constants.printType.item ? 'item' : 'boq',
						'&[_PaperSize]': utils.getPaperSizeName(settings.context.paperSize),
						'&[_Orientation]': utils.getOrientationName(settings.context.orientation),
						'&[_AnonmBidder]': settings.context.bidderNameTemplate ? 'yes' : 'no',
						'&[_BidderSize]': settings.context.bidderPageSizeCheck ? settings.context.bidderPageSize : settings.context.rootBidders.length,
						'&[_Bidders]': _.map(settings.context.bidderNames, function bidderNameMapper(name) {
							return '<li>' + name + '</li>';
						}).join(''),
						'&[Page]': '[webpage]',
						'&[Pages]': '[toPage]',
						'&[_BoQClass]': 'hidden',
						'&[_ItemClass]': 'hidden'
					}, contextData);

					let checkedTypeName = printType === constants.printType.item ? 'generic.PropertyConfig.item.checkedItemTypes' : 'generic.PropertyConfig.boq.checkedBoqItemTypes';
					let checkedType2Name = printType === constants.printType.item ? 'generic.PropertyConfig.item.checkedItemTypes2' : 'generic.PropertyConfig.boq.checkedBoqItemTypes2';
					let itemTypes = configData['ItemTypes'];
					let itemTypes2 = configData['ItemTypes2'];

					let checkedItemTypes = platformObjectHelper.getValue(settings, checkedTypeName, []);
					let checkedItemTypes2 = platformObjectHelper.getValue(settings, checkedType2Name, []);
					let itemTypesView = [], itemTypes2View = [], itemTypesCheckAll = true, itemTypes2CheckAll = true;
					_.each(itemTypes, function itemTypesIterator(item) {
						let isChecked = !!_.find(checkedItemTypes, function (x) {
							return item.Id === x;
						});
						itemTypesView.push('<tr><td><input type="checkbox" disabled="disabled" ' + (isChecked ? 'checked="checked"' : '') + '></td><td>' + item.DisplayMember + '</td></tr>');
						itemTypesCheckAll = itemTypesCheckAll && isChecked;
					});
					_.each(itemTypes2, function (item) {
						let isChecked = !!_.find(checkedItemTypes2, function (x) {
							return item.Id === x;
						});
						itemTypes2View.push('<tr><td><input type="checkbox" disabled="disabled" ' + (isChecked ? 'checked="checked"' : '') + '></td><td>' + item.DisplayMember + '</td></tr>');
						itemTypes2CheckAll = itemTypes2CheckAll && isChecked;
					});
					if (printType === constants.printType.item) {
						contextData['&[_ItemTypeCheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypesCheckAll ? 'checked="checked"' : '') + ' />';
						contextData['&[_ItemType]'] = itemTypesView.join('');
						contextData['&[_ItemType2CheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypes2CheckAll ? 'checked="checked"' : '') + ' />';
						contextData['&[_ItemType2]'] = itemTypes2View.join('');
						contextData['&[_ItemClass]'] = 'show';
					} else {
						contextData['&[_BoQItemTypeCheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypesCheckAll ? 'checked="checked"' : '') + ' />';
						contextData['&[_BoQItemType]'] = itemTypesView.join('');
						contextData['&[_BoQItemType2CheckedAll]'] = '<input type="checkbox" disabled="disabled" ' + (itemTypes2CheckAll ? 'checked="checked"' : '') + ' />';
						contextData['&[_BoQItemType2]'] = itemTypes2View.join('');

						// Ranges
						let boqRanges = configData.BoQRanges;
						let boqRangeView = [];
						_.each(boqRanges, function boqRangeIterator(range) {
							boqRangeView.push('<tr><td>' + (range.ReferenceNo || '') + '</td><td>' + (range['HeaderOutlineSpecification'] || '') + '</td><td>' + (range['FromReferenceNo'] || '') + '</td><td>' + (range['ToReferenceNo'] || '') + '</td></tr>');
						});
						contextData['&[_BoQRange]'] = boqRangeView.join('');
						contextData['&[_BoQClass]'] = 'show';
					}
					coverHtml = utils.parseTemplate(result[1], contextData);
				}
				return '<div class="cover-sheet">' + coverHtml + '</div>';
			}

			function createTableHeader(columns, settings) {
				let columnView = [],
					groupView = [],
					tableWidth = settings.context.printPaperWidth,
					printType = settings.context.printType,
					verticalProp = printType === constants.printType.item ? 'generic.PropertyConfig.row.item.isVerticalCompareRows' : 'generic.PropertyConfig.row.boq.isVerticalCompareRows',
					isVerticalCompareRows = platformObjectHelper.getValue(settings, verticalProp, false);
				if (isVerticalCompareRows) {
					let groupIndex = -1, groupName = null, groups = [];
					_.each(columns, function columnIterator(col) {
						if (!col.isDynamic) {
							groupIndex++;
							col.groupName = commonHelperService.textPadding('', '-', groupIndex + 1);
						} else {
							if (col.groupName !== groupName) {
								groupIndex++;
							}
						}
						let group = groups[groupIndex];
						if (!group) {
							group = {
								columns: []
							};
							groups.push(group);
						}
						group.name = groupName = col.groupName;
						group.columns.push(col);
					});
					_.each(groups, function groupIterator(group) {
						groupView.push('<th class="cell-center" colspan="' + group.columns.length + '">' + (/^.*-$/.test(group.name) ? ' ' : group.name) + '</th>');
					});
				}
				_.each(columns, function thIterator(col) {
					columnView.push('<th style="width:' + utils.getWidthPercent(tableWidth, col.width) + ';">' + col.name + '</th>');
					// columnView.push('<th style="width:' + col.width + 'px;">' + col.name + '</th>');
				});
				return (groupView.length > 0 ? '<tr>' + groupView.join('') + '</tr>' : '') + '<tr>' + columnView.join('') + '</tr>';
			}

			function createTableContent(columns, dataRows, printType, childProp, settings) {
				let views = [];
				let IsSlice = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.shortenOutlineSpecCheck', false);
				let sliceLen = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.shortenOutlineSpecValue', '');
				_.each(dataRows, function dataRowIterator(row, rindex) {
					let fieldViews = [],
						compareField = printType === constants.printType.item ? commonHelperService.getPrcCompareField(row) : commonHelperService.getBoqCompareField(row),
						isEmptyRow = true,
						isIgnoreRow = false,
						isUrbField = utils.isUrbField(compareField),
						isDiscountField = utils.isDiscountField(compareField),
						isOptionalWithoutITField = printType === constants.printType.boq ? utils.isOptionalWithoutITSummaryField(row.BoqLineTypeFk) : false;
					if (isUrbField) {
						let quoteItems = row.parentItem ? row.parentItem.QuoteItems : [],
							isIncluding = !!_.find(quoteItems, function urbFinder(item) {
								return item.IsUrb;
							});
						isIgnoreRow = !isIncluding;
					}
					if (!isIgnoreRow) {
						_.each(columns, function formatIterator(col, cindex) {
							// using formatter to get the dynamic cell value which has domain format style or custom css style.
							let originalValue = row[col.field], formatter = col.formatter, cssClasses = [],
								isBidderColumn = commonHelperService.isBidderColumn(col);
							if (null === originalValue || _.isUndefined(originalValue)) {
								originalValue = '';
							}
							if (IsSlice && !!sliceLen) {
								if (utils.isShortenField(col.field)) {
									originalValue = sliceContent(originalValue, sliceLen);
								}
							}
							if (formatter && angular.isString(formatter)) {
								formatter = platformGridDomainService.formatter(formatter);
							}
							let formattedValue = _.isFunction(formatter) ? (formatter(rindex, cindex, originalValue, col, row)) : originalValue;
							if (isDiscountField) {
								if (isBidderColumn) {
									isEmptyRow = isEmptyRow && row[col.field] === 0;
								}
							} else if (isOptionalWithoutITField) {
								formattedValue = isBidderColumn && _.isNumber(formattedValue) ? '(' + formattedValue + ')' : formattedValue;
								isEmptyRow = false;
							} else {
								formattedValue = commonHelperService.clearButtonTag(formattedValue);
								isEmptyRow = isEmptyRow && _.trim(formattedValue) === '';
							}
							if (((isUrbField || isDiscountField) && isBidderColumn && row[col.field] === 0) || _.isUndefined(formattedValue) || null === formattedValue) {
								formattedValue = '';
							}
							if (col.cssClass) {
								cssClasses.push(col.cssClass);
							}
							fieldViews.push('<td class="' + cssClasses.join(' ') + '"><div class="print-value">' + formattedValue + '</div></td>');
						});
					}
					if (!isEmptyRow) {
						let rowClasses = [row.cssClass ? row.cssClass : ''];
						if (row[childProp] && row[childProp].length > 0) {
							rowClasses.push('tree-node');
						}
						views.push('<tr class="' + rowClasses.join(' ') + '">' + fieldViews.join('') + '</tr>');
					}
				});

				return views;
			}

			function createPageFooter(contextData, settings) {
				return createPageHeaderOrFooter(contextData, settings, 'footer');
			}

			function getViewContent(rfqHeaderId, printType, settings) {
				let loadDataPromise,
					configDataPromise,
					columnFn,
					bidderColumnName = null,
					printColumnsName = null,
					childProp = '',
					verticalProp = '',
					coverTemplateId = settings.context.coverSheetTemplateId,
					bidders = settings.context.rootBidders,
					quoteIds = _.map(bidders, function headerMapper(bidder) {
						return bidder.QtnHeaderFk;
					});
				if (printType === constants.printType.item) {
					childProp = 'Children';
					bidderColumnName = 'itemcustomcolumn';
					printColumnsName = 'generic.PropertyConfig.column.item.printColumns';
					verticalProp = 'generic.PropertyConfig.row.item.isVerticalCompareRows';
					columnFn = getItemColumns;
					loadDataPromise = getItemData(rfqHeaderId, settings);
					configDataPromise = getItemConfigData();
				} else {
					childProp = 'BoqItemChildren';
					bidderColumnName = 'boqcustomcolumn';
					printColumnsName = 'generic.PropertyConfig.column.boq.printColumns';
					verticalProp = 'generic.PropertyConfig.row.boq.isVerticalCompareRows';
					columnFn = getBoQColumns;
					loadDataPromise = getBoQData(rfqHeaderId, settings);
					configDataPromise = getBoqConfigData(settings);
				}
				return $q.all([loadDataPromise, getPrintContextData(rfqHeaderId, quoteIds), getPrintCoverSheet(rfqHeaderId, coverTemplateId), configDataPromise]).then(function responseCallback(result) {
					let itemSource = result[0],
						contextData = result[1],
						coverHtml = result[2].html,
						configData = result[3],
						nameTpl = settings.context.bidderNameTemplate;
					bidders = reorderCompareColumns(printType, bidders);
					settings.context.BoQRanges = configData.BoQRanges;
					let views = {
							header: createPageHeader(contextData, settings),
							coverSheet: '',
							footer: createPageFooter(contextData, settings),
							pageInfo: {
								template: '<div class="print-content"><table><thead>[HEAD_ROWS]</thead><tbody>[BODY_ROWS]</tbody></table><div style="page-break-after:always;"></div></div>',
								pages: []
							},
							toPreview: function () {
								return '<div class="print-body">' + this.pageInfo.pages.map(page => {
									return utils.parseTemplate(this.pageInfo.template, {
										'[HEAD_ROWS]': page.headRows,
										'[BODY_ROWS]': page.bodyRows.join('')
									});
								}).join('') + '</div>';
							},
							toPrint: function () {
								const maxRowLength = 10000;
								const maxPageSize = 1000;
								if (_.sumBy(this.pageInfo.pages, page => {
									return page.bodyRows.length;
								}) > maxRowLength) {
									return _.reduce(this.pageInfo.pages, (result, page) => {
										const total = Math.ceil(page.bodyRows.length / maxPageSize);
										for (let i = 0; i < total; i++) {
											result.push('<div class="print-body">' + utils.parseTemplate(this.pageInfo.template, {
												'[HEAD_ROWS]': page.headRows,
												'[BODY_ROWS]': page.bodyRows.slice(i * maxPageSize, (i + 1) * maxPageSize).join('')
											}) + '</div>');
										}
										return result;
									}, []);
								} else {
									return [this.toPreview()];
								}
							}
						},
						allColumns = columnFn(settings),
						printColumns = platformObjectHelper.getValue(settings, printColumnsName, allColumns),
						bidderColumns = _.values(basicsLookupDescriptorService.getData(bidderColumnName));
					let bidderPageSize = settings.context.bidderPageSizeCheck ? Math.min(settings.context.bidderPageSize, bidders.length) : bidders.length,
						isVerticalCompareRows = platformObjectHelper.getValue(settings, verticalProp, false),
						pages = Math.floor(bidders.length / bidderPageSize) + (bidders.length % bidderPageSize === 0 ? 0 : 1),
						compareBidderNames = [],
						bidderIndex = 0;
					if (printType === constants.printType.boq) {
						let summaryInfo = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.boq', {});
						boqStructureService.addSummaryDataRows(itemSource, bidderColumns, summaryInfo);
					}
					let dataRows = filterDataRows(printType, itemSource, childProp, settings, bidderColumns);
					if (printType === constants.printType.boq && settings.rfq.PropertyConfig.analysis &&
						_.toNumber(settings.rfq.PropertyConfig.analysis.criteria.selectedValue) !== 1) {
						dataRows = getCriteriaData(dataRows, settings.rfq.PropertyConfig.analysis);
					}
					let percentCol = {
						field: 'singlePercent',
						formatter: function (row, cell, value) {
							if (!value) {
								return value;
							}
							return platformGridDomainService.formatter('percent')(0, 0, value * 100, {}) + ' %';
						},
						hidden: false,
						id: 'singlePercent',
						name: '%',
						width: 100
					};

					for (let i = 0; i < pages; i++) {
						let currColumns = [],
							currBidders = bidders.splice(0, bidderPageSize);
						_.each(printColumns, function printColumnIterator(column) {// jshint ignore : line
							if (!column.isOverSize) {
								if (column.id === constants.bidderFieldName) {
									_.each(currBidders, function currBidderIterator(bidder) {
										let quote = _.find(bidderColumns, {QuoteHeaderId: bidder.QtnHeaderFk});
										let item = quote ? _.find(allColumns, {id: quote.Id}) : null;
										if (item) {
											let checkService = printType === constants.printType.item ? bidderCheckService.item : bidderCheckService.boq;
											let isReference = checkService.isReference(quote.Id);
											if (!isReference) {
												bidderIndex++;
												compareBidderNames.push(isVerticalCompareRows ? item.groupName : item.name);
												if (nameTpl) {
													if (isVerticalCompareRows) {
														item.groupName = utils.bidderNameFormatter(nameTpl, $translate.instant('procurement.pricecomparison.printing.bidder'), ($translate.instant(item.name$tr$) || item.name), bidderIndex);
													} else {
														item.name = utils.bidderNameFormatter(nameTpl, $translate.instant('procurement.pricecomparison.printing.bidder'), ($translate.instant(item.name$tr$) || item.name), bidderIndex);
													}
												}
											}

											let compareColumns = [];
											if (isVerticalCompareRows) {
												compareColumns = _.filter(allColumns, function quoteFilter(c) {
													return (c.quoteKey || c.field) === quote.Id && c.isDynamic && !c.hidden;
												});
											} else {
												if (!item.hidden) {
													compareColumns.push(item);
												}
											}
											_.each(compareColumns, function compareColumnIterator(c) {
												let terms = c.field.split('_');
												let field = terms.length === 5 ? terms[4] : 'LineValue';
												let configCol = _.find(column.children, {field: field});
												if (configCol) {
													c.width = configCol.width;
												}
												c.groupName = item.groupName;
											});

											currColumns = currColumns.concat(compareColumns);
										}
									});
								} else {
									if (i === 0 || !_.includes(['minValueExcludeTarget', 'maxValueExcludeTarget', 'averageValueExcludeTarget'], column.id)) {
										let item = _.find(allColumns, {id: column.id});
										if (item) {
											item.width = column.width;
											item.name = column.userLabelName || $translate.instant(item.name$tr$) || item.name;
											currColumns.push(item);
										}
									}
								}
							}
						});
						if (printType === constants.printType.boq && settings.rfq.PropertyConfig.analysis &&
							_.toNumber(settings.rfq.PropertyConfig.analysis.criteria.selectedValue) !== 1) {
							currColumns.push(percentCol);
						}
						views.pageInfo.pages.push({
							headRows: createTableHeader(currColumns, settings),
							bodyRows: createTableContent(currColumns, dataRows, printType, childProp, settings)
						});
					}
					settings.context.bidderNames = compareBidderNames;
					if (coverHtml) {
						views.coverSheet = createCoverSheet(printType, configData, coverHtml, contextData, settings);
					}
					return views;
				});
			}

			function getCriteriaData(dataRows, analysis) {
				let newDataRows = [];
				let baseType = analysis.filterBasis.selectedItem;
				let total = _.find(dataRows, function grandTotalFinder(item) {
					return item.BoqLineTypeFk === lineTypes.grandTotal;
				});
				if (total) {
					let totalValue = 0;
					if (!baseType.isBidder) {
						totalValue = total[baseType.key];
					} else {
						totalValue = total.totals[baseType.key];
					}
					_.forEach(dataRows, function dataPercentSum(item) {
						if (commonHelperService.isBoqPositionRow(item.BoqLineTypeFk)) {
							if (baseType.isBidder) {
								let field = item.leadingFields[baseType.key];
								if (!_.isNumber(field)) {
									field = 0;
								}
								let finalPrice = field || 0;
								item.singlePercent = totalValue === 0 ? 0 : finalPrice / totalValue;
							} else {
								item.singlePercent = totalValue === 0 ? 0 : item[baseType.key] / totalValue;
							}
							newDataRows.push(item);
						}
					});
					newDataRows = _.orderBy(newDataRows, ['singlePercent', 'Reference'], ['desc', 'asc']);
				}
				let tempData = 0;
				_.forEach(newDataRows, function newDataPercentSum(item) {
					tempData += item.singlePercent;
					item.totalPercent = tempData;
				});
				newDataRows = filterByCriteria(newDataRows, analysis.criteria, analysis.filterBasis.selectedItem);
				newDataRows.unshift(total);
				return newDataRows;
			}

			function filterByCriteria(dataRows, criteria, baseType) {
				if (criteria) {
					switch (criteria.selectedValue) {
						case '2': {
							let totalPercent = Number.parseFloat(criteria.totalPercent) / 100;
							return _.filter(dataRows, function value2Filter(row) {
								return getRoundData(row.totalPercent) < totalPercent;
							});
						}
						case '3': {
							let singlePercent = Number.parseFloat(criteria.singlePercent) / 100;
							return _.filter(dataRows, function value3Filter(row) {
								return getRoundData(row.singlePercent) > singlePercent;
							});
						}
						case '4': {
							let amount = Number.parseFloat(criteria.amount);
							return _.filter(dataRows, function value4Filter(row) {
								if (baseType.isBidder) {
									let field = row.leadingFields[baseType.key];
									if (!_.isNumber(field)) {
										field = 0;
									}
									return getRoundData(field) > amount;
								} else {
									return getRoundData(row[baseType.key]) > amount;
								}

							});
						}
						default:
							return dataRows;
					}
				}
			}

			function getRoundData(num) {
				return Math.round(num * 10000) / 10000;
			}

			function reorderCompareColumns(printType, bidders) {
				let bidderCache = printType === constants.printType.item ? itemConfigService.visibleCompareColumnsCache : boqConfigService.visibleCompareColumnsCache;
				return _.sortBy(bidders, function bidderSortor(bidder) {
					return _.findIndex(bidderCache, {QuoteHeaderId: bidder.QtnHeaderFk});
				});
			}

			function parseSettings(settings, printType) {
				let paperSize = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.pageLayout.paperSize', 1),
					bidderPageSizeCheck = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.bidderPageSizeCheck', true),
					orientation = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.pageLayout.orientation', 1),
					printPaperWidth = settingService.getPrintPaperWidth(paperSize, orientation),
					bidders = platformObjectHelper.getValue(settings, 'rfq.PropertyConfig.bidder.quotes', []),
					rootBidders = _.filter(bidders, function quoteGetter(item) {
						return item.Visible === true && !item.CompareColumnFk;
					}),
					printPaperHeight = settingService.getPrintPaperWidth(paperSize, orientation === constants.orientation.portrait ? constants.orientation.landscape : constants.orientation.portrait);
				settings.context = {
					paperSize: paperSize,
					bidderPageSizeCheck: bidderPageSizeCheck,
					bidders: bidders,
					rootBidders: rootBidders,
					orientation: orientation,
					printPaperWidth: printPaperWidth,
					printPaperHeight: printPaperHeight,
					bidderPageSize: platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.bidderPageSize', 1),
					bidderNameTemplate: platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.bidderNameTemplate', null),
					coverSheetTemplateId: platformObjectHelper.getValue(settings, 'generic.PropertyConfig.report.coverSheetTemplateId', 0),
					printType: printType
				};
				return settings;
			}

			function preview(rfqHeaderId, printType, settings) {
				settings = parseSettings(settings, printType);
				let winName = 'viewWin' + Math.random().toString().replace('.', ''),
					viewWin = $window.open('', winName);
				viewWin.document.title = 'Printing - Preview';
				utils.loadCssStyles(viewWin.document, ['css/cloud.css', 'css-hacks/webkit.css']);
				if (viewWin.document.body.style) {
					viewWin.document.body.style.cssText = ['background-color:#525659;', 'height:auto;', 'padding:60px 0;'].join('');
				}
				viewWin.document.body.innerHTML = '<p style="padding:20px;font-size:14px;font-weight:bold;text-align:center;color:#fff;">Loading ...</p>';

				return $q.all([utils.loadCssTexts(viewWin.document), getViewContent(rfqHeaderId, printType, settings)]).then(function responseCallback(result) {
					let viewData = result[1];
					let viewDoc = viewWin.document;

					viewDoc.body.innerHTML = '<div class="print-container-preview" style="width:' + (utils.getPreviewWidth(settings.context.printPaperWidth)) + 'px;">' + viewData.coverSheet + '<div class="container">' + viewData.header + viewData.toPreview() + viewData.footer + '</div></div>';

					// Disabled checkbox
					viewDoc.body.querySelectorAll('input[type="checkbox"]').forEach(elem => elem.setAttribute('disabled', true));
				});
			}

			function print(rfqHeaderId, printType, settings) {
				settings = parseSettings(settings, printType);
				let fileName = printType === constants.printType.item ? 'item-price-comparison' : 'boq-price-comparison';
				return getViewContent(rfqHeaderId, printType, settings).then(function viewContextResponseCallback(viewData) {
					const formData = {
						FileName: fileName,
						Header: viewData.header,
						Pages: viewData.toPrint(),
						Footer: viewData.footer,
						Cover: viewData.coverSheet ? utils.createCompletelySheetPage(viewData.coverSheet) : '',
						PaperSize: utils.getPaperSizeName(settings.context.paperSize),
						Orientation: utils.getOrientationName(settings.context.orientation)
					};

					return commonHelperService.uploadLargeObjectAsFile(formData).then(result => {
						return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/print/itemorboqtree/' + result.Uuid).then(function responseCallback(response) {
						if (response.data['Success']) {
							basicsCommonFileDownloadService.download(null, {
								FileName: response.data.FileName,
								Path: response.data.Path
							});
						} else {
							platformModalService.showMsgBox(response.data['Message'], 'cloud.common.informationDialogHeader', 'ico-error');
						}
							return response.data;
						});
					});
				});
			}

			function correctColumns(columns, hidden) {
				let cloneColumns = _.map(columns, function cloneMap(col) {
					return angular.copy(col);
				});
				_.each(cloneColumns, function cloneIterator(cloneCol) {
					cloneCol.hidden = hidden;
				});
				return cloneColumns;
			}

			function getBoQColumns(settings) {
				let visibleColumns = correctColumns(platformObjectHelper.getValue(settings, 'generic.PropertyConfig.column.boq.printColumns', []), true),
					availableColumns = correctColumns(_.sortBy(settingService.getAvailableColumns(constants.printType.boq, visibleColumns), ['field']), false),
					configColumns = availableColumns.concat(visibleColumns),
					isVerticalCompareRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.isVerticalCompareRows', false),
					isLineValueColumn = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.isLineValueColumn', false),
					isFinalShowInTotal = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.isFinalShowInTotal', false);
				return boqHelperService.loadColumns(boqConfigService, boqStructureService, configColumns, {
					isVerticalCompareRows: isVerticalCompareRows,
					isLineValueColumn: isLineValueColumn,
					isFinalShowInTotal: isFinalShowInTotal
				});
			}

			function getBoQData(rfqHeaderId, settings) {
				let bidders = settings.context.bidders,
					quoteIds = _.map(bidders, function headerMapper(item) {
						return item.QtnHeaderFk;
					});
				return getCompareColumns(2, quoteIds).then(function columnResponseCallback(data) {
					let readData = {},
						quoteColumns = bidders.concat(_.filter(data['BaseColumn'], function baseCheckFilter(column) {
							return !_.some(bidders, {Id: column.Id});
						})),
						isVerticalCompareRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.isVerticalCompareRows', false),
						isFinalShowInTotal = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.isFinalShowInTotal', false);
					readData.compareColumns = commonHelperService.flatTree(boqHelperService.restructureQuoteCompareColumns(quoteColumns, data['Quotes']), 'Children');
					readData.rfqHeaderId = rfqHeaderId;
					readData.compareType = commonService.constant.compareType.boqItem;
					readData.CompareQuoteRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.quoteFields', []);
					readData.CompareBillingSchemaRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.billingSchemaFields', []);
					readData.CompareRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.itemFields', []);
					readData.CompareBaseColumns = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.bidder.boq', []);
					readData.isCalculateAsPerAdjustedQuantity = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.boq.isCalculateAsPerAdjustedQuantity', false);
					readData.RecalculateDisabled = !readData.isCalculateAsPerAdjustedQuantity && globals['loadBoQWithRecalculateDisabled'] !== false;
					return boqHelperService.loadData(readData, boqConfigService, boqStructureService, {
						onReadSuccess: function (items) {
							commonHelperService.updateCompareConfig(items, boqService.getCustomSettingsCompareRows(), boqService.getCustomSettingsCompareBillingSchemaRows(), boqService.getCustomSettingsCompareQuoteRows(), commonService.constant.compareType.boqItem);
						},
						isVerticalCompareRows: isVerticalCompareRows,
						isFinalShowInTotal: isFinalShowInTotal
					}).then(function dataResponseCallback(result) {
						boqHelperService.reorderCompareColumns(boqConfigService, result);
						return result;
					});
				});
			}

			function getItemColumns(settings) {
				let visibleColumns = correctColumns(platformObjectHelper.getValue(settings, 'generic.PropertyConfig.column.item.printColumns', []), true),
					availableColumns = correctColumns(_.sortBy(settingService.getAvailableColumns(constants.printType.item, visibleColumns), ['field']), false),
					configColumns = availableColumns.concat(visibleColumns),
					isVerticalCompareRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.isVerticalCompareRows', false),
					isLineValueColumn = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.isLineValueColumn', false),
					isFinalShowInTotal = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.isFinalShowInTotal', false);
				return itemHelperService.loadColumns(itemConfigService, itemStructureService, configColumns, {
					isVerticalCompareRows: isVerticalCompareRows,
					isLineValueColumn: isLineValueColumn,
					isFinalShowInTotal: isFinalShowInTotal
				});
			}

			function getItemData(rfqHeaderId, settings) {
				let bidders = settings.context.bidders,
					quoteIds = _.map(bidders, function headerMapper(item) {
						return item.QtnHeaderFk;
					});
				return getCompareColumns(1, quoteIds).then(function columnQueryCallback(data) {
					let readData = {},
						quoteColumns = bidders.concat(_.filter(data['BaseColumn'], function baseCheckFilter(column) {
							return !_.some(bidders, {Id: column.Id});
						})),
						isVerticalCompareRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.isVerticalCompareRows', false),
						isFinalShowInTotal = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.isFinalShowInTotal', false);
					readData.compareColumns = commonHelperService.flatTree(itemHelperService.restructureQuoteCompareColumns(quoteColumns, data['Quotes']), 'Children');
					readData.rfqHeaderId = rfqHeaderId;
					readData.compareType = commonService.constant.compareType.prcItem;
					readData.CompareQuoteRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.quoteFields', []);
					readData.CompareBillingSchemaRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.billingSchemaFields', []);
					readData.CompareRows = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.row.item.itemFields', []);
					readData.CompareBaseColumns = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.bidder.item', []);
					return itemHelperService.loadData(readData, itemConfigService, itemStructureService, {
						isVerticalCompareRows: isVerticalCompareRows,
						isFinalShowInTotal: isFinalShowInTotal,
						onReadSuccess: function (items) {
							commonHelperService.updateCompareConfig(items, itemService.getCustomSettingsCompareRows(), itemService.getCustomSettingsCompareBillingSchemaRows(), itemService.getCustomSettingsCompareQuoteRows(), commonService.constant.compareType.prcItem);
						},
					}).then(function responseCallback(result) {
						itemHelperService.reorderCompareColumns(itemConfigService, result);
						return result;
					});
				});
			}

			function getPrintContextData(rfqHeaderId, quoteHeaderIds) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getcontextdata', {
					RfqHeaderId: rfqHeaderId,
					QuoteHeaderIds: quoteHeaderIds
				}).then(function responseCallback(response) {
					return response.data;
				});
			}

			function getPrintCoverSheet(rfqHeaderId, templateId) {
				if (templateId) {
					return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getcoversheet?rfqId=' + rfqHeaderId + '&templateId=' + templateId).then(function responseCallback(response) {
						return response.data;
					});
				}
				return $q.when({html: ''});
			}

			function getCompareColumns(compareType, quoteIds) {
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getcomparecolumns?comparetype=' + compareType + '&headers=' + quoteIds.join('_')).then(function responseCallback(response) {
					return response.data;
				});
			}

			function getItemTypes() {
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getitemtypes').then(function itemTypesCallback(response) {
					return response.data;
				});
			}

			function getItemConfigData() {
				return getItemTypes();
			}

			function getBoqConfigData(settings) {
				return getItemTypes().then(function itemTypesCallback(itemTypes) {
					let checkedRanges = platformObjectHelper.getValue(settings, 'rfq.PropertyConfig.boq.checkedBoqRanges', []);
					let getParams = _.map(checkedRanges, function checkedRangeMapper(item) {
						return (item.boqHeaderId || 0) + ':' + (item.fromId || 0) + ':' + (item.fromBoqHeaderId || 0) + ':' + (item.toId || 0) + ':' + (item.toBoqHeaderId || 0);
					});
					return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getranges?values=' + getParams.join('_')).then(function rangeCallback(response) {
						return angular.extend(itemTypes, {
							BoQRanges: response.data
						});
					});
				});
			}

			function filterDataRows(printType, dataTree, childProp, settings, bidderColumns) {
				let itemTypes, itemTypes2;
				if (printType === constants.printType.item) {
					itemTypes = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.item.checkedItemTypes', []);
					itemTypes2 = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.item.checkedItemTypes2', []);
					itemStructureService.removeDataRowsByItemTypes(dataTree, itemTypes, itemTypes2);
				} else {

					// BoQ settings
					itemTypes = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.boq.checkedBoqItemTypes', []);
					itemTypes2 = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.boq.checkedBoqItemTypes2', []);

					// Item Type options
					boqStructureService.removeBoQDataRowsByItemTypes(dataTree, itemTypes, itemTypes2);

					// BoQ Range options
					boqStructureService.removeBoQDataRowsByRanges(dataTree, settings.context.BoQRanges);

					// Summary options
					let checkedLineTypes = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.boq.checkedLineTypes');
					boqStructureService.removeSummaryDataRows(dataTree, checkedLineTypes, bidderColumns);

					// Zero value options
					let hideZeroValueLines = platformObjectHelper.getValue(settings, 'generic.PropertyConfig.boq.hideZeroValueLines', true);
					if (hideZeroValueLines) {
						boqStructureService.removeZeroValueRows(dataTree, bidderColumns);
					}
				}

				return commonHelperService.flatTree(dataTree, childProp);
			}

			function sliceContent(value, len) {
				let originalValue = value;
				if (originalValue.constructor === String && originalValue !== '' && originalValue.length > len) {
					value = originalValue.slice(0, len) + '...';
				}
				return value;
			}

			function checkQuoteModifiedState(printType, printAction, option) {
				let modifiedCheckPromise;
				if (printType === constants.printType.item) {
					modifiedCheckPromise = $q.all([itemService.checkModifiedState(true), itemService.checkModifiedState(false)]);
				} else {
					modifiedCheckPromise = $q.all([boqService.checkModifiedState(true), boqService.checkModifiedState(false)]);
				}
				return modifiedCheckPromise.then(function (result) {
					if (result[0].hasModified || result[1].hasModified) {
						return option.platformModalService.showDialog({
							resolve: {
								controllerOptions: function () {
									return {
										printType: printType,
										printAction: printAction
									};
								}
							},
							width: '650px',
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-print-save-quote.html',
							controller: 'procurementPriceComparisonItemBoqPrintSaveQuoteController'
						}).then(function (result) {
							if (result && result.ok) {
								if (result.isNewVersion) {
									if (option.updateBidders) {
										return option.updateBidders(printType, result.OriginalToQuoteHeaderNews, result.QuoteHeaderNews);
									}
								}
							}
						});
					}
				});
			}

			return {
				preview: preview,
				print: print,
				checkQuoteModifiedState: checkQuoteModifiedState
			};

		}]);
})(angular);
