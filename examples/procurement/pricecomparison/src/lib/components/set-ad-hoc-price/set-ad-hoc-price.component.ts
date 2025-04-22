/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { createLookup, FieldType, FieldValidationInfo, IGridConfiguration } from '@libs/ui/common';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { ValidationResult } from '@libs/platform/data-access';
import {
	ProcurementSharedItemEvaluationLookupService,
	ProcurementSharedQuoteTypeLookupService
} from '@libs/procurement/shared';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../../services/rfq-header-data.service';
import { IItemEvaluationResponse } from '../../model/entities/IItemEvaluationResponse';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IItemEvaluationBoqItemEntity } from '../../model/entities/item-evaluation-boq-item.entity.interface';
import { IItemEvaluationPrcItemEntity } from '../../model/entities/item-evaluation-prc-item.entity.interface';
import { ProcurementPriceComparisonItemEvaluationService, } from '../../services/evaluation/item-evaluation.service';
import { IItemEvaluationOption } from '../../model/entities/compare-item-evaluation-option.interface';
import { ICustomCompareColumnEntity } from '../../model/entities/custom-compare-column-entity.interface';
@Component({
	selector: 'procurement-pricecomparison-set-ad-hoc-price',
	templateUrl: './set-ad-hoc-price.component.html',
	styleUrls: ['./set-ad-hoc-price.component.scss'],
})
export class ProcurementPriceComparisonSetAdHocPriceComponent implements OnInit {
	protected readonly fieldType = FieldType;
	private readonly httpService = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly parentService = inject(ProcurementPricecomparisonRfqHeaderDataService);
	private readonly itemEvaluationService = inject(ProcurementPriceComparisonItemEvaluationService);
	public readonly itemEvaluationLookupService = inject(ProcurementSharedItemEvaluationLookupService);

	public modalOptions = {
		selectQuotes: this.translateService.instant('procurement.pricecomparison.itemEvaluation.selectQuotes').text,
		selectTargetItems: this.translateService.instant('procurement.pricecomparison.itemEvaluation.selectTargetItems').text,
		selectTargetBoqItems: this.translateService.instant('procurement.pricecomparison.itemEvaluation.selectTargetBoqItems').text,
		targetItem: this.translateService.instant('procurement.pricecomparison.itemEvaluation.targetItem').text,
		noteTitle: this.translateService.instant('procurement.pricecomparison.itemEvaluation.noteTitle').text,
		noteText1: this.translateService.instant('procurement.pricecomparison.itemEvaluation.noteText1').text,
		noteText2: this.translateService.instant('procurement.pricecomparison.itemEvaluation.noteText2').text,
		itemEvaluation: this.translateService.instant('procurement.pricecomparison.itemEvaluation.itemEvaluation').text,
		notSubmitted: true,
		isEvaluated: true,
		itemEvaluationValue: 0,
		step: 'step1'
	};

	public quotes: ICustomCompareColumnEntity[] = [];
	public prcItems: IItemEvaluationPrcItemEntity[] = [];
	public boqItems: IItemEvaluationBoqItemEntity[] = [];

	protected gridConfig: IGridConfiguration<ICustomCompareColumnEntity> = {
		uuid: '11f29762f8ab4e8ab39ab6cb3da231df',
		columns: [
			{
				id: 'Selected',
				label: {
					text: 'Selected',
					key: 'cloud.common.entitySelected',
				},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				width: 35,
				visible: true,
				validator: info => this.onSelected(info)
			}, {
				id: 'code',
				label: { key: 'cloud.common.entityReference', text: 'Reference' },
				model: 'Code',
				sortable: true,
				type: FieldType.Description,
				visible: true,
				readonly: true
			}, {
				id: 'description',
				model: 'Description',
				type: FieldType.Description,
				label: { key: 'cloud.common.entityDescription', text: 'Description' },
				readonly: true,
				visible: true,
				sortable: false,
			}, {
				id: 'businessPartnerFk',
				label: { key: 'basics.common.BusinessPartner', text: 'Business Partner' },
				model: 'BusinessPartnerId',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService
				})
			}, {
				id: 'quoteVersion',
				label: { key: 'procurement.quote.headerVersion', text: 'Version' },
				model: 'QuoteVersion',
				sortable: true,
				type: FieldType.Integer,
				visible: true,
				readonly: true
			}
		],
		items: this.quotes
	};

	protected prcItemGridConfig: IGridConfiguration<IItemEvaluationPrcItemEntity> = {
		uuid: '11f29762f8ab4e8ab39ab6cb3dadddf1',
		columns: [
			{
				id: 'IsChecked',
				label: {
					text: 'Selected',
					key: 'cloud.common.entitySelected',
				},
				model: 'IsChecked',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				width: 35,
				visible: true,
				validator: info => this.onPrcItemSelected(info)
			}, {
				id: 'qtnCode',
				label: { key: 'procurement.common.quoteCode', text: 'Quote Code' },
				model: 'QuoteHeaderId',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharedQuoteTypeLookupService
				})
			}, {
				id: 'ItemNo',
				label: { key: 'procurement.common.prcItemItemNo', text: 'Item No.' },
				model: 'Itemno',
				sortable: true,
				type: FieldType.Description,
				visible: true,
				readonly: true
			}, {
				id: 'ItemDescription',
				label: { key: 'procurement.common.prcItemDescription', text: 'Item Description' },
				model: 'Description1',
				sortable: true,
				type: FieldType.Description,
				visible: true,
				readonly: true
			}, {
				id: 'Price',
				label: { key: 'cloud.common.entityPrice', text: 'Price' },
				model: 'Price',
				sortable: true,
				type: FieldType.Integer,
				visible: true,
				readonly: true
			}, {
				id: 'UoM',
				label: { key: 'cloud.common.entityUoM', text: 'UoM' },
				model: 'BasUomFk',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService
				})
			}, {
				id: 'Specification',
				label: { key: 'cloud.common.EntitySpec', text: 'Specification' },
				model: 'Specification',
				sortable: true,
				type: FieldType.Description,
				visible: true,
				readonly: true
			}
		],
		items: this.prcItems
	};

	protected boqItemGridConfig: IGridConfiguration<IItemEvaluationBoqItemEntity> = {
		uuid: '11f29762f8ab4e8ab39ab6cb3dadddf2',
		columns: [
			{
				id: 'IsChecked',
				label: {
					text: 'Selected',
					key: 'cloud.common.entitySelected',
				},
				model: 'IsChecked',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				width: 35,
				visible: true,
				validator: info => this.onBoqItemSelected(info)
			}, {
				id: 'qtnCode',
				label: { key: 'procurement.common.quoteCode', text: 'Quote Code' },
				model: 'QuoteHeaderId',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharedQuoteTypeLookupService
				})
			},
			//TODO: boqLineTypeLookupDataService
			/*{
				id: 'BoqLineTypeFk',
				label: { key: 'cloud.common.boqLineType', text: 'BoQ Line Type' },
				model: 'BoqLineTypeFk',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: boqLineTypeLookupDataService
				})
			}*/
			{
				id: 'Reference',
				label: { key: 'cloud.common.referenceNo', text: 'Reference No.' },
				model: 'Reference',
				sortable: true,
				type: FieldType.Description,
				visible: true,
				readonly: true
			}, {
				id: 'Brief',
				label: { key: 'cloud.common.entityBriefInfo', text: 'Outline Specification' },
				model: 'BriefInfo.Translated',
				sortable: true,
				type: FieldType.Description,
				visible: true,
				readonly: true
			}, {
				id: 'UoM',
				label: { key: 'cloud.common.entityUoM', text: 'UoM' },
				model: 'BasUomFk',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService
				})
			}, {
				id: 'Quantity',
				label: { key: 'basics.common.Quantity', text: 'Quantity' },
				model: 'Quantity',
				sortable: true,
				type: FieldType.Integer,
				visible: true,
				readonly: true
			}
		],
		items: this.boqItems
	};

	private onSelected(info: FieldValidationInfo<ICustomCompareColumnEntity>) {
		return new ValidationResult();
	}

	private onPrcItemSelected(info: FieldValidationInfo<IItemEvaluationPrcItemEntity>) {
		return new ValidationResult();
	}

	private onBoqItemSelected(info: FieldValidationInfo<IItemEvaluationBoqItemEntity>) {
		return new ValidationResult();
	}

	public onOKBtnClicked() {
		const evaluationOptions: IItemEvaluationOption = {
			notSubmitted: this.modalOptions.notSubmitted,
			isEvaluated: this.modalOptions.isEvaluated,
			itemEvaluationValue: this.modalOptions.itemEvaluationValue,
			quotes: this.quotes,
			prcItems: this.prcItems,
			boqItems: this.boqItems
		};
		this.itemEvaluationService.doEvaluate(evaluationOptions);
		return true;
	}

	public onNextBtnClicked() {
		this.modalOptions.step = 'step2';
		const payload = {
			IsEvaluated: true,
			IsNotSubmitted: true,
			QtnHeaderIds: this.quotes.map(item => item.QuoteHeaderId)
		};
		const itemResp = this.httpService.post<IItemEvaluationPrcItemEntity[]>('procurement/pricecomparison/item/prcItems4wizarditemevaluation', payload);
		itemResp.then(items => {
			items.forEach(item => item.IsChecked = true);
			this.prcItems = items;
		});

		const boqResp = this.httpService.post<IItemEvaluationBoqItemEntity[]>('procurement/pricecomparison/boq/boqItems4wizarditemevaluation', payload);
		boqResp.then(boqItems => {
			boqItems.forEach(item => item.IsChecked = true);
			this.boqItems = boqItems;
		});
	}

	public onPreviousBtnClicked(){
		this.modalOptions.step = 'step1';
	}

	public notSubmittedChange($event: boolean) {
		this.modalOptions.notSubmitted = $event;
	}

	public isEvaluatedChange($event: boolean) {
		this.modalOptions.isEvaluated = $event;
	}

	public onSelectedChange($event: number) {
		this.modalOptions.itemEvaluationValue = $event;
	}

	public ngOnInit() {
		const payload = {
			compareType: 3,
			filter: '',
			rfqHeaderFk: this.parentService.getSelection()[0].Id
		};
		const resp = this.httpService.post<IItemEvaluationResponse>('procurement/pricecomparison/comparecolumn/quotes4wizarditemevaluation', payload);
		resp.then(resp => {
			this.quotes = resp.Main;
		});
	}
}
