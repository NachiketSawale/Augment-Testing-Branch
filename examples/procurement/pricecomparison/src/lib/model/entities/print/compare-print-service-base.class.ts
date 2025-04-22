/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BasicsShareFileDownloadService } from '@libs/basics/shared';
import { FieldType, UiCommonMessageBoxService } from '@libs/ui/common';
import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { ICompareTreeResponseBase } from '../compare-tree-response-base.interface';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../../services/compare-data-base.service';
import { IComparePrintContext } from './compare-print-context.interface';
import { ProcurementPricecomparisonUtilService } from '../../../services/util.service';
import { IComparePrintPageInfo, IComparePrintView } from './compare-print-view.interface';
import { ComparePrintSettingServiceBase } from './compare-print-setting-service-base.class';
import { IComparePrintCustomInfo, IComparePrintGenericProfile, IComparePrintRowBase } from './compare-print-generic-profile.interface';
import { CompareGridColumn } from '../compare-grid-column.interface';
import { ComparePrintConstants } from '../../constants/print/compare-print-constats';
import { ProcurementPricecomparisonBidderIdentityService } from '../../../services/bidder-identity.service';
import { IComparePrintTemplateData } from './compare-print-template-data.interface';
import { IComparePrintAdditionalInfo } from './compare-print-additional-info.interface';
import { ILookupDataEntity } from '../boq/custom-item-type.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { UnitRateBreakDownFields } from '../../constants/boq/unit-rate-break-down-fields';
import { CompareFields } from '../../constants/compare-fields';
import { ICustomQuoteItemBase } from '../custom-quote-item-base.interface';

export abstract class ComparePrintServiceBase<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>
> {
	private readonly httpSvc = ServiceLocator.injector.get(PlatformHttpService);
	private readonly msgDlgSvc = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly downloadSvc = ServiceLocator.injector.get(BasicsShareFileDownloadService);
	private readonly bidderIdentitySvc = ServiceLocator.injector.get(ProcurementPricecomparisonBidderIdentityService);
	protected readonly utilSvc = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);

	protected constructor(
		private viewDataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>,
		private printDataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>,
		private printSettingSvc: ComparePrintSettingServiceBase<T, RT>,
	) {
	}

	private static template: string = '<div class="print-content"><table><thead>[HEAD_ROWS]</thead><tbody>[BODY_ROWS]</tbody></table><div style="page-break-after:always;"></div></div>';

	public async checkQuoteModifiedState() {
		const result = await this.viewDataSvc.checkModifiedState();
		if (result.hasModified) {
			// TODO-DRIZZLE: To be checked.
			/*return option.platformModalService.showDialog({
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
			}).then(function (result_2) {
				if (result_2 && result_2.ok) {
					if (result_2.isNewVersion) {
						if (option.updateBidders) {
							return option.updateBidders(printType, result_2.OriginalToQuoteHeaderNews, result_2.QuoteHeaderNews);
						}
					}
				}
			});*/
		}
	}

	protected abstract getPrintName(): string;

	protected abstract getPrintType(): string;

	protected abstract getPrintColumns(generic: IComparePrintGenericProfile, defaultColumns: CompareGridColumn<T>[]): CompareGridColumn<T>[];

	protected abstract getRowSetting(generic: IComparePrintGenericProfile): IComparePrintRowBase;

	protected abstract loadDependencies(): Promise<void>;

	private getPaperSizeName(value: number): string {
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
	}

	private getOrientationName(value: string) {
		return value.toString() === '2' ? 'landscape' : 'portrait';
	}

	private createCoverSheet(additionalInfo: IComparePrintAdditionalInfo, coverHtml: string, templateData: IComparePrintTemplateData, context: IComparePrintContext, rootBidders: ICustomCompareColumnEntity[], bidderNames: string[]) {
		const result = /<body>([\s\S]*)<\/body>/.exec(coverHtml || '');
		if (result && result.length > 1) {
			templateData = _.extend({
				'&[_PrintType]': this.getPrintType(),
				'&[_PaperSize]': this.getPaperSizeName(context.generic.pageLayout.paperSize),
				'&[_Orientation]': this.getOrientationName(context.generic.pageLayout.orientation),
				'&[_AnonmBidder]': context.generic.report.bidderNameTemplate ? 'yes' : 'no',
				'&[_BidderSize]': context.generic.report.bidderPageSizeCheck ? context.generic.report.bidderPageSize : rootBidders.length,
				'&[_Bidders]': _.map(bidderNames, (name) => {
					return '<li>' + name + '</li>';
				}).join(''),
				'&[Page]': '[webpage]',
				'&[Pages]': '[toPage]',
				'&[_BoQClass]': 'hidden',
				'&[_ItemClass]': 'hidden'
			}, templateData);

			templateData = this.processCoverSheetTemplateData(templateData, context, additionalInfo);

			coverHtml = this.utilSvc.parseTemplate(result[1], templateData);
		}
		return '<div class="cover-sheet">' + coverHtml + '</div>';
	}

	private createCompletelySheetPage(body: string) {
		return ('<!DOCTYPE html>' +
			'<html lang="en">' +
			'<head>' +
			'<meta charset="utf-8" />' +
			'<title></title>' +
			'</head>' +
			'<body>{{BODY}}</body>' +
			'</html>').replace('{{BODY}}', body);
	}

	private toPreview(pages: IComparePrintPageInfo[]): string {
		return '<div class="print-body">' + pages.map(page => {
			return this.utilSvc.parseTemplate(ComparePrintServiceBase.template, {
				'[HEAD_ROWS]': page.headRows,
				'[BODY_ROWS]': page.bodyRows.join('')
			});
		}).join('') + '</div>';
	}

	private toPrint(pages: IComparePrintPageInfo[]): string[] {
		const maxRowLength = 10000;
		const maxPageSize = 1000;
		if (_.sumBy(pages, page => {
			return page.bodyRows.length;
		}) > maxRowLength) {
			return _.reduce<IComparePrintPageInfo, string[]>(pages, (result, page) => {
				const total = Math.ceil(page.bodyRows.length / maxPageSize);
				for (let i = 0; i < total; i++) {
					result.push('<div class="print-body">' + this.utilSvc.parseTemplate(ComparePrintServiceBase.template, {
						'[HEAD_ROWS]': page.headRows,
						'[BODY_ROWS]': page.bodyRows.slice(i * maxPageSize, (i + 1) * maxPageSize).join('')
					}) + '</div>');
				}
				return result;
			}, []);
		} else {
			return [this.toPreview(pages)];
		}
	}

	private getPrintTemplateData(rfqHeaderId: number, quoteHeaderIds: number[]) {
		return this.httpSvc.post<IComparePrintTemplateData>('procurement/pricecomparison/print/getcontextdata', {
			RfqHeaderId: rfqHeaderId,
			QuoteHeaderIds: quoteHeaderIds
		});
	}

	private getPrintCoverSheet(rfqHeaderId: number, templateId: number | null | undefined) {
		if (templateId) {
			return this.httpSvc.get<{
				html: string
			}>('procurement/pricecomparison/print/getcoversheet?rfqId=' + rfqHeaderId + '&templateId=' + templateId);
		}
		return Promise.resolve({html: ''});
	}

	private getData(): Promise<T[]> {
		return this.printDataSvc.load({
			id: this.printDataSvc.getParentSelectedIdElse()
		});
	}

	private async getAdditionalInfo(): Promise<IComparePrintAdditionalInfo> {
		const itemTypes = await this.httpSvc.get<{
			ItemTypes: ILookupDataEntity[],
			ItemTypes2: ILookupDataEntity[]
		}>('procurement/pricecomparison/print/getitemtypes');
		return {
			itemTypes: itemTypes.ItemTypes,
			itemTypes2: itemTypes.ItemTypes2
		};
	}

	private createPageHeaderOrFooter(setting: IComparePrintCustomInfo, templateData: IComparePrintTemplateData) {
		let leftView = setting.leftTemplate;
		let middleView = setting.middleTemplate;
		let rightView = setting.rightTemplate;

		const containerStyles = ['padding:0px 10px !important;', 'font-size:12px;', 'font-weight:normal;', 'overflow:hidden !important;'];
		const floatStyles = ['float: left;', 'width:33.33%;', 'padding:10px 0;', 'line-height:25px;', 'min-height:10px;'];
		if (leftView) {
			if (setting.leftPicture) {
				templateData['&[Picture]'] = '<img class="user-img" style="max-height:50px;margin: 0 2px;" src="data:image/png;base64,' + setting.leftPicture + '" alt="" />';
			}
			leftView = this.utilSvc.parseTemplate(leftView, templateData);
		}
		if (middleView) {
			if (setting.middlePicture) {
				templateData['&[Picture]'] = '<img class="user-img" style="max-height:50px;margin: 0 2px;" src="data:image/png;base64,' + setting.middlePicture + '" alt=""/>';
			}
			middleView = this.utilSvc.parseTemplate(middleView, templateData);
		}
		if (rightView) {
			if (setting.rightPicture) {
				templateData['&[Picture]'] = '<img class="user-img" style="max-height:50px;margin: 0 2px;" src="data:image/png;base64,' + setting.rightPicture + '" alt=""/>';
			}
			rightView = this.utilSvc.parseTemplate(rightView, templateData);
		}
		return '<div class="header-footer" style="' + containerStyles.join('') + '"><div style="' + floatStyles.join('') + 'text-align:left;">' + (_.trim(leftView) || '&nbsp;') + '</div><div style="' + floatStyles.join('') + 'width:33.34%;text-align:center;">' + (_.trim(middleView) || '&nbsp;') + '</div><div style="' + floatStyles.join('') + 'text-align: right;">' + (_.trim(rightView) || '&nbsp;') + '</div></div>';
	}

	private bidderNameFormatter(tmpl: string, prefix: string, name?: string, index?: number) {
		return tmpl.replace('{{PREFIX}}', prefix).replace('{{BIDDERNAME}}', name ?? '').replace('{{INDEX}}', (index ?? 0).toString());
	}

	private isShortenField(field: string) {
		return _.indexOf(['Brief'], field) > -1;
	}

	private getWidthPercent(tableWidth?: number, tdWidth?: number) {
		if (tdWidth && tableWidth) {
			return ((tdWidth / tableWidth) * 100).toFixed(2) + '%';
		}
		return 'auto;';
	}

	private isUrbField(rowType: string) {
		return _.includes(UnitRateBreakDownFields, rowType);
	}

	private isDiscountField(rowType: string) {
		return _.includes([
			CompareFields.discountPercentIT,
			CompareFields.discount,
			CompareFields.discountPercent,
			CompareFields.discountedPrice,
			CompareFields.discountedUnitPrice,
			CompareFields.discount,
			CompareFields.discountAbsolute,
			CompareFields.discountAbsoluteOc,
			CompareFields.discountAbsoluteGross,
			CompareFields.discountAbsoluteGrossOc
		], rowType);
	}

	private sliceContent(value: string, len: number) {
		const originalValue = value;
		if (originalValue.constructor === String && originalValue !== '' && originalValue.length > len) {
			value = originalValue.slice(0, len) + '...';
		}
		return value;
	}

	private loadCssStyles(document: Document, urls: string[]) {
		const url = window.location.href;
		const clientIndex = url.indexOf('/client/');
		const clientPath = url.substring(0, clientIndex) + '/client/';
		urls.forEach((url) => {
			const link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = clientPath + 'cloud.style/content/' + url;
			document.getElementsByTagName('head')[0].appendChild(link);
		});
	}

	private async loadCssTexts(document: Document, appendRules?: string[]) {
		const cssRules = await this.httpSvc.get<string[]>('procurement/pricecomparison/print/printcssresources');
		cssRules.forEach((cssRule) => {
			const styleElement = document.createElement('style');
			document.getElementsByTagName('head')[0].appendChild(styleElement);
			styleElement.textContent = cssRule + (appendRules || []).join(' ');
		});
		return cssRules;
	}

	private getPreviewWidth(tableWidth: number) {
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
	}

	private createTableHeader(columns: CompareGridColumn<T>[], context: IComparePrintContext, isVerticalCompareRows: boolean) {
		const columnView: string[] = [];
		const groupView: string[] = [];
		const tableWidth = this.utilSvc.getPrintPaperWidth(context.generic.pageLayout.paperSize, context.generic.pageLayout.orientation);
		if (isVerticalCompareRows) {
			let groupIndex = -1;
			let groupName: string | undefined = undefined;
			const groups: Array<{
				name: string,
				columns: CompareGridColumn<T>[]
			}> = [];
			_.each(columns, (col) => {
				if (!col.isDynamic) {
					groupIndex++;
					col.groupName = this.utilSvc.textPadding('', '-', groupIndex + 1);
				} else {
					if (col.groupName !== groupName) {
						groupIndex++;
					}
				}
				let group = groups[groupIndex];
				if (!group) {
					group = {
						name: '',
						columns: []
					};
					groups.push(group);
				}
				group.name = groupName = col.groupName as string;
				group.columns.push(col);
			});
			_.each(groups, (group) => {
				groupView.push('<th class="cell-center" colspan="' + group.columns.length + '">' + (/^.*-$/.test(group.name) ? ' ' : group.name) + '</th>');
			});
		}
		_.each(columns, (col) => {
			columnView.push('<th style="width:' + this.getWidthPercent(tableWidth, col.width) + ';">' + col.name + '</th>');
		});
		return [(groupView.length > 0 ? '<tr>' + groupView.join('') + '</tr>' : '') + '<tr>' + columnView.join('') + '</tr>'];
	}

	private createTableContent(columns: CompareGridColumn<T>[], dataRows: T[], context: IComparePrintContext) {
		const views: string[] = [];
		const isSlice = context.generic.report.shortenOutlineSpecCheck;
		const sliceLen = context.generic.report.shortenOutlineSpecValue;
		_.each(dataRows, (row, rindex) => {
			const fieldViews: string[] = [];
			const compareField = this.printDataSvc.getCompareFieldName(row);
			let isEmptyRow = true;
			let isIgnoreRow = false;

			const isUrbField = this.isUrbField(compareField);
			const isDiscountField = this.isDiscountField(compareField);
			const isOptionalWithoutITSummaryField = this.isOptionalWithoutITSummaryField(row);

			if (isUrbField) {
				const quoteItems = row.parentItem ? row.parentItem.QuoteItems : [];
				const isIncluding = !!_.find(quoteItems, (item) => {
					return this.isUrb(item);
				});
				isIgnoreRow = !isIncluding;
			}

			if (!isIgnoreRow) {
				_.each(columns, (col, cindex) => {
					// using formatter to get the dynamic cell value which has domain format style or custom css style.
					let originalValue = row[col.field as string] as string;
					let formatter = col['formatter'] as (string | ((rIndex: number, cIndex: number, value: unknown, col: CompareGridColumn<T>, row: T) => string));
					const cssClasses: string[] = [];
					const isBidderColumn = this.utilSvc.isBidderColumn(col);
					if (null === originalValue || _.isUndefined(originalValue)) {
						originalValue = '';
					}
					if (isSlice && !!sliceLen) {
						if (this.isShortenField(col.field as string)) {
							originalValue = this.sliceContent(originalValue, sliceLen);
						}
					}
					if (formatter && _.isString(formatter)) {
						formatter = (rIndex: number, cIndex: number, value: unknown, col: CompareGridColumn<T>, row: T) => {
							return this.utilSvc.formatValue(formatter as FieldType, rIndex, cIndex, value, col, row);
						};
					}
					let formattedValue = _.isFunction(formatter) ? (formatter(rindex, cindex, originalValue, col, row)) : originalValue;
					if (isDiscountField) {
						if (isBidderColumn) {
							isEmptyRow = isEmptyRow && ((row[col.field as string] as number) === 0);
						}
					} else if (isOptionalWithoutITSummaryField) {
						formattedValue = isBidderColumn && _.isNumber(formattedValue) ? '(' + formattedValue + ')' : formattedValue;
						isEmptyRow = false;
					} else {
						formattedValue = this.utilSvc.clearButtonTag(formattedValue);
						isEmptyRow = isEmptyRow && _.trim(formattedValue) === '';
					}
					if (((isUrbField || isDiscountField) && isBidderColumn && ((row[col.field as string] as number) === 0)) || _.isUndefined(formattedValue) || null === formattedValue) {
						formattedValue = '';
					}
					if (col.cssClass) {
						cssClasses.push(col.cssClass);
					}
					fieldViews.push('<td class="' + cssClasses.join(' ') + '"><div class="print-value">' + formattedValue + '</div></td>');
				});
			}
			if (!isEmptyRow) {
				const rowClasses = [row.cssClass ? row.cssClass : ''];
				if (row.Children && row.Children.length > 0) {
					rowClasses.push('tree-node');
				}
				views.push('<tr class="' + rowClasses.join(' ') + '">' + fieldViews.join('') + '</tr>');
			}
		});

		return views;
	}

	private getViewContent(rfqHeaderId: number, context: IComparePrintContext): Promise<IComparePrintView> {
		const coverTemplateId = context.generic.report.coverSheetTemplateId;
		const bidders = context.rfq.bidder.quotes.filter(e => e.Visible === true && !e.CompareColumnFk);
		const quoteIds = bidders.map((bidder) => {
			return bidder.QtnHeaderFk;
		});

		return Promise.all([
			this.getData(),
			this.getPrintTemplateData(rfqHeaderId, quoteIds),
			this.getPrintCoverSheet(rfqHeaderId, coverTemplateId),
			this.getAdditionalInfo()
		]).then((result) => {
			const itemSource = result[0];
			const templateData = result[1];
			const coverHtml = result[2].html;
			const addition = result[3];
			const rowSetting = this.getRowSetting(context.generic);
			const nameTpl = context.generic.report.bidderNameTemplate;
			const views: IComparePrintView = {
				header: this.createPageHeaderOrFooter(context.generic.report.header, templateData),
				coverSheet: '',
				footer: this.createPageHeaderOrFooter(context.generic.report.footer, templateData),
				pages: []
			};
			const allColumns = this.printDataSvc.columnBuilder.buildColumns();
			const printColumns = this.getPrintColumns(context.generic, allColumns);
			const bidderColumns = this.printDataSvc.compareCache.columns;
			const bidderPageSize = context.generic.report.bidderPageSizeCheck ? Math.min(Math.max(context.generic.report.bidderPageSize, 1), bidders.length) : bidders.length;
			const isVerticalCompareRows = rowSetting.isVerticalCompareRows;
			const pages = Math.floor(bidders.length / bidderPageSize) + (bidders.length % bidderPageSize === 0 ? 0 : 1);
			const compareBidderNames: string[] = [];
			let bidderIndex = 0;
			const dataRows = this.utilSvc.flatTree(itemSource);

			for (let i = 0; i < pages; i++) {
				let currColumns: CompareGridColumn<T>[] = [];
				const currBidders = bidders.splice(0, bidderPageSize);
				_.each(printColumns, (column) => {
					if (!column['isOverSize']) {
						if (column.id === ComparePrintConstants.bidderFieldName) {
							_.each(currBidders, (bidder) => {
								const quote = _.find(bidderColumns, {QuoteHeaderId: bidder.QtnHeaderFk});
								const item = quote ? _.find(allColumns, {id: quote.Id}) : null;
								if (item && quote) {
									const isReference = this.bidderIdentitySvc.isReference(quote.Id);
									if (!isReference) {
										bidderIndex++;
										compareBidderNames.push(isVerticalCompareRows ? (item.groupName as string) : (item.name as string));
										if (nameTpl) {
											if (isVerticalCompareRows) {
												item.groupName = this.bidderNameFormatter(nameTpl, this.utilSvc.getTranslationText('procurement.pricecomparison.printing.bidder'), (this.utilSvc.getTranslationText(item.name$tr$) || item.name), bidderIndex);
											} else {
												item.name = this.bidderNameFormatter(nameTpl, this.utilSvc.getTranslationText('procurement.pricecomparison.printing.bidder'), (this.utilSvc.getTranslationText(item.name$tr$) || item.name), bidderIndex);
											}
										}
									}

									const compareColumns: CompareGridColumn<T>[] = [];
									if (isVerticalCompareRows) {
										_.each(allColumns, (c) => {
											if (quote && (quote.Id === (c.quoteKey || c.field) && c.isDynamic && !c.hidden)) {
												compareColumns.push(c);
											}
										});
									} else {
										if (!item.hidden) {
											compareColumns.push(item);
										}
									}
									_.each(compareColumns, (c) => {
										const terms = (c.field || '').split('_');
										const field = terms.length === 5 ? terms[4] : 'LineValue';
										const configCol = _.find(column.children, {field: field});
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
								const item = _.find(allColumns, {id: column.id});
								if (item) {
									item.width = column.width;
									item.name = column.userLabelName || this.utilSvc.getTranslationText(item.name$tr$) || item.name;
									currColumns.push(item);
								}
							}
						}
					}
				});

				currColumns = this.processColumns(currColumns, context);

				views.pages.push({
					headRows: this.createTableHeader(currColumns, context, isVerticalCompareRows),
					bodyRows: this.createTableContent(currColumns, dataRows, context)
				});
			}

			if (coverHtml) {
				views.coverSheet = this.createCoverSheet(addition, coverHtml, templateData, context, bidders, compareBidderNames);
			}
			return views;
		});
	}

	protected processColumns(columns: CompareGridColumn<T>[], context: IComparePrintContext): CompareGridColumn<T>[] {
		return columns;
	}

	protected processCoverSheetTemplateData(templateData: IComparePrintTemplateData, context: IComparePrintContext, additionalInfo: IComparePrintAdditionalInfo): IComparePrintTemplateData {
		return templateData;
	}

	protected isOptionalWithoutITSummaryField(row: T): boolean {
		return false;
	}

	protected isUrb(item: ICustomQuoteItemBase): boolean {
		return false;
	}

	public async preview() {
		await this.loadDependencies();

		const viewWin = window.open('', 'viewWin' + Date.now().toString());
		if (!viewWin) {
			return;
		}

		viewWin.document.title = 'Printing - Preview';
		this.loadCssStyles(viewWin.document, ['css/cloud.css', 'css-hacks/webkit.css']);
		if (viewWin.document.body.style) {
			viewWin.document.body.style.cssText = ['background-color:#525659;', 'height:auto;', 'padding:60px 0;'].join('');
		}
		viewWin.document.body.innerHTML = '<p style="padding:20px;font-size:14px;font-weight:bold;text-align:center;color:#fff;">Loading ...</p>';

		const rfqHeaderId = this.printDataSvc.getParentSelectedIdElse();
		const context: IComparePrintContext = this.printSettingSvc.getCurrentSetting();
		return Promise.all([
			this.loadCssTexts(viewWin.document),
			this.getViewContent(rfqHeaderId, context)
		]).then((result) => {
			const viewData = result[1];
			const viewDoc = viewWin.document;

			const paperWidth = this.utilSvc.getPrintPaperWidth(context.generic.pageLayout.paperSize, context.generic.pageLayout.orientation);
			const previewWidth = this.getPreviewWidth(paperWidth);
			const previewBody = this.toPreview(viewData.pages);

			viewDoc.body.innerHTML = '<div class="print-container-preview" style="width:' + previewWidth + 'px;">' + viewData.coverSheet + '<div class="container">' + viewData.header + previewBody + viewData.footer + '</div></div>';

			// Disabled checkbox
			viewDoc.body.querySelectorAll('input[type="checkbox"]').forEach(elem => elem.setAttribute('disabled', 'true'));
		});
	}

	public async print() {
		await this.loadDependencies();
		const rfqHeaderId = this.printDataSvc.getParentSelectedIdElse();
		const context: IComparePrintContext = this.printSettingSvc.getCurrentSetting();
		const view = await this.getViewContent(rfqHeaderId, context);
		const formData = {
			FileName: this.getPrintName(),
			Header: view.header,
			Pages: this.toPrint(view.pages),
			Footer: view.footer,
			Cover: view.coverSheet ? this.createCompletelySheetPage(view.coverSheet) : '',
			PaperSize: this.getPaperSizeName(context.generic.pageLayout.paperSize),
			Orientation: this.getOrientationName(context.generic.pageLayout.orientation)
		};
		const result = await this.utilSvc.uploadLargeObjectAsFile(formData);
		const uploaded = await this.httpSvc.post<{
			Success: boolean;
			FileName: string;
			Path: string;
			Message: string;
		}>('procurement/pricecomparison/print/itemorboqtree/' + result.Uuid, null);
		if (uploaded.Success) {
			this.downloadSvc.download(undefined, undefined, uploaded.FileName, uploaded.Path);
		} else {
			await this.msgDlgSvc.showErrorDialog(uploaded.Message);
		}
		return uploaded;
	}
}