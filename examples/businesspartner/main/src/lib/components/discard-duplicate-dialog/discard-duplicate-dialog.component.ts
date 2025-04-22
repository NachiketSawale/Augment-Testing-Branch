/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject, inject, ViewChild } from '@angular/core';
import { ColumnDef, FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { IBusinessPartnerEntity, IDuplicateBusinessPartnerResponse, IDuplicateSimpleRequest } from '@libs/businesspartner/interfaces';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { DISCARD_DUPLICATE_DIALOG_DATA_TOKEN, IDiscardDuplicateDialogData } from '../../model/discard-duplicate-dialog/discard-duplicate-dialog-data.model';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'businesspartner-main-discard-duplicate-dialog',
	templateUrl: './discard-duplicate-dialog.component.html',
	styleUrls: ['./discard-duplicate-dialog.component.scss'],
})
export class BusinesspartnerMainDiscardDuplicateDialogComponent {
	private readonly translationService = inject(PlatformTranslateService);
	private selections: IBusinessPartnerEntity[] = [];
	private checkDuplicateData?: IDuplicateSimpleRequest | null = null;
	private readonly http = inject(PlatformHttpService);
	private readonly columns: ColumnDef<IBusinessPartnerEntity>[] = [
		{
			id: 'BusinessPartnerName1',
			model: 'BusinessPartnerName1',
			label: 'businesspartner.main.name1',
			sortable: true,
			type: FieldType.Description,
			width: 180,
			visible: true
		},
		{
			id: 'BusinessPartnerName2',
			model: 'BusinessPartnerName2',
			label: 'businesspartner.main.name2',
			sortable: true,
			type: FieldType.Description,
			width: 180,
			visible: true
		},
		{
			id: 'city',
			model: 'SubsidiaryDescriptor.AddressDto.City',
			label: 'basics.common.entityCity',
			type: FieldType.Description,
			sortable: true,
			width: 200,
			visible: true
		},
		{
			id: 'address',
			model: 'SubsidiaryDescriptor.AddressDto.Address',
			label: 'basics.common.entityAddress',
			type: FieldType.Description,
			sortable: true,
			width: 200,
			visible: true
		},
		{
			id: 'telepone',
			model: 'SubsidiaryDescriptor.TelephoneNumber1Dto.Telephone',
			label: 'businesspartner.main.telephoneNumber',
			type: FieldType.Description,
			sortable: true,
			width: 200,
			visible: true
		},
		{
			id: 'fax',
			model: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto.Telephone',
			label: 'businesspartner.main.Telefax',
			type: FieldType.Description,
			sortable: true,
			width: 200,
			visible: true
		},
		{
			id: 'Email',
			model: 'Email',
			label: 'businesspartner.main.email',
			sortable: true,
			type: FieldType.Description,
			width: 180,
			visible: true
		}
	];

	private fields: Record<string, string> = {
		CrefoNo: this.translationService.instant('businesspartner.main.creFoNo').text,
		BedirektNo: this.translationService.instant('businesspartner.main.beDirectNo').text,
		DunsNo: this.translationService.instant('businesspartner.main.dunsNo').text,
		VatNo: this.translationService.instant('businesspartner.main.vatNo').text,
		TaxNo: this.translationService.instant('businesspartner.main.taxNo').text,
		TradeRegisterNo: this.translationService.instant('businesspartner.main.tradeRegisterNo').text,
		TelephoneNumber1Dto: this.translationService.instant('businesspartner.main.telephoneNumber').text,
		TelephoneNumberTelefaxDto: this.translationService.instant('businesspartner.main.telephoneFax').text,
		'SubsidiaryDescriptor.TelephoneNumber1Dto': this.translationService.instant('businesspartner.main.telephoneNumber').text,
		'SubsidiaryDescriptor.TelephoneNumberTelefaxDto': this.translationService.instant('businesspartner.main.telephoneFax').text,
		Email: this.translationService.instant('businesspartner.main.email').text
	};

	protected htmlTranslate = {
		description: ''
	};

	protected isLoading = false;
	private pageSize: number = 100;
	private page = {
		number: 0,
		totalLength: 0,
		currentLength: 0,
		count: Math.ceil(0 / this.pageSize)
	};

	public configuration!: IGridConfiguration<IBusinessPartnerEntity>;

	@ViewChild('gridHost')
	protected gridHost: GridComponent<IBusinessPartnerEntity> | undefined;

	public constructor(@Inject(DISCARD_DUPLICATE_DIALOG_DATA_TOKEN) protected discardData: IDiscardDuplicateDialogData) {
		if (discardData.page) {
			this.page.totalLength = discardData.page.totalLength || 0;
			this.page.currentLength = discardData.page.currentLength || 0;
			this.page.count = Math.ceil(this.page.totalLength / this.pageSize);
		}
		this.checkDuplicateData = cloneDeep(discardData.checkData);
		this.htmlTranslate.description = this.translationService.instant('businesspartner.main.dialog.discardDuplicateBusinessPartnerDescription',
			{invalidModel: this.fields[this.discardData.model]}).text;
		const items = discardData.duplicateBps || [];
		this.updateGrid(items);
		this.gotoFirst(items);
	}


	public getSelections() {
		return this.selections;
	}

	protected onSelectionChanged(selectedItems: IBusinessPartnerEntity[]) {
		this.selections = selectedItems;
	}

	protected getPageText() {
		const startIndex = this.page.number * this.pageSize,
			endIndex = ((this.page.count - (this.page.number + 1) > 0 ? startIndex + this.pageSize : this.page.totalLength));

		if (this.isLoading) {
			return this.translationService.instant('cloud.common.searchRunning').text;
		}
		if (this.page.currentLength === 0) {
			return this.translationService.instant('cloud.common.noSearchResult').text;
		}
		return (startIndex + 1) + ' - ' + endIndex + ' / ' + this.page.totalLength;
	}

	protected async getFirstPage() {
		this.page.number = 0;
		await this.getListByPage();
	}

	protected async getLastPage() {
		this.page.number = this.page.count - 1;
		await this.getListByPage();
	}

	protected async getPrevPage() {
		if (this.page.number <= 0) {
			return;
		}
		this.page.number--;
		await this.getListByPage();
	}

	protected async getNextPage() {
		if (this.page.count <= this.page.number) {
			return;
		}
		this.page.number++;
		await this.getListByPage();
	}

	protected canFirstOrPrevPage() {
		return this.page.number > 0;
	}

	protected canLastOrNextPage() {
		return this.page.count > (this.page.number + 1);
	}

	protected canShowPage() {
		return this.discardData.showPage;
	}

	private updateGrid(items: IBusinessPartnerEntity[]) {
		this.configuration = {
			uuid: '5137dcec39ef49c1ac0342e4da3016bf',
			columns: this.columns,
			items: [...items],
		};
	}

	private gotoFirst(items: IBusinessPartnerEntity[]) {
		if (!items || items.length === 0) {
			return;
		}
		const firstOne = items[0];
		setTimeout(() => {
			if (firstOne) {
				if (this.gridHost) {
					this.gridHost.selection = [firstOne];
					this.selections = this.gridHost.selection;
				}
			}
		});
	}

	private async getListByPage() {
		if (!this.checkDuplicateData || !this.discardData.url) {
			return;
		}

		this.checkDuplicateData.PageSize = this.pageSize;
		this.checkDuplicateData.PageIndex = this.page.number;

		this.isLoading = true;
		const result = await this.http.post<IDuplicateBusinessPartnerResponse>(this.discardData.url, this.checkDuplicateData);
		this.isLoading = false;
		if (!result) {
			this.page.currentLength = 0;
			this.updateGrid([]);
			return;
		}

		this.page.currentLength = result.RecordsRetrieved;
		this.page.totalLength = result.RecordsFound;
		this.updateGrid(result.Items ?? []);
		this.gotoFirst(result.Items ?? []);
	}
}
