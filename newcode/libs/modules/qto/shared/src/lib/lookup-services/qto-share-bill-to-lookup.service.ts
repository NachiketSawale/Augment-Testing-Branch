/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { get } from 'lodash';
import {
	createLookup,
	FieldType,
	ILookupSearchRequest,
	ILookupSearchResponse,
	LookupSearchResponse,
	UiCommonLookupReadonlyDataService
} from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { BasicsSharedCustomerAbcLookupService } from '@libs/basics/shared';
import {CompleteIdentification, IEntityIdentification, IIdentificationData} from '@libs/platform/common';
import {QtoShareDetailDataService} from '../services/qto-share-detail-data.service';
import {QtoShareDetailGridComplete} from '../model/qto-share-detail-complete.class';
import {IQtoShareDetailEntity} from '../model/entities/qto-share-detail-entity.interface';

/**
 * data for get bill to by contract and project
 */
export class BillToEntity {
	public Id: number = 0;
	public Code: string = '';
	public Description: string = '';
	public SubsidiaryFk: number = 0;
	public BusinesspartnerFk: number = 0;
	public CustomerFk: number = 0;
	public Comment: string = '';
	public Remark: string = '';
}

/**
 * Lookup service for the bill to lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class QtoShareBillToLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<BillToEntity, TEntity> {
	// TODO: Temporarily set dataService extend class to resolve eslint the error.
	public constructor(protected readonly dataService: QtoShareDetailDataService<IQtoShareDetailEntity, QtoShareDetailGridComplete, IEntityIdentification, CompleteIdentification<IEntityIdentification>>) {
		super({
			uuid: '3B11EE3589E34A45BA8BDC92F132E0B0',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '3B11EE3589E34A45BA8BDC92F132E0B0',
				columns: [
					{
						id: 'code',
						model: 'Code',
						label: { text: 'Code', key: 'cloud.common.entityReferenceCode' },
						type: FieldType.Code,
						readonly: true,
						sortable: true,
					},
					{
						id: 'Description',
						model: 'Description',
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						type: FieldType.Description,
						readonly: true,
						sortable: true,
					},
					{
						id: 'businesspartner',
						model: 'BusinesspartnerFk',
						label: { text: 'Businesspartner', key: 'cloud.common.entityBusinesspartner' },
						type: FieldType.Lookup,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BusinessPartnerLookupService,
						}),
					},
					{
						id: 'SubsidiaryFk',
						model: 'SubsidiaryFk',
						label: { text: 'Branch', key: 'cloud.common.entitySubsidiary' },
						type: FieldType.Lookup,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						}),
					},
					{
						id: 'CustomerFk',
						model: 'CustomerFk',
						label: { text: 'Customer', key: 'cloud.common.entityCustomer' },
						type: FieldType.Lookup,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedCustomerAbcLookupService,
						}),
					},
					{
						id: 'Comment',
						model: 'Comment',
						label: { text: 'Comment', key: 'cloud.common.entityComment' },
						type: FieldType.Comment,
						readonly: true,
						sortable: true,
					},
					{
						id: 'Remark',
						model: 'Remark',
						label: { text: 'Remarks', key: 'cloud.common.entityRemark' },
						type: FieldType.Remark,
						readonly: true,
						sortable: true,
					},
				],
			},
		});
	}

	public override getList(): Observable<BillToEntity[]> {
		return this.getBillToList();
	}

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<BillToEntity>> {
		const filterValueByProtject = get(request.additionalParameters, 'PrjProjectFk');
		const filterValueByContract = get(request.additionalParameters, 'OrdHeaderFk');
		const projectId = filterValueByProtject ? (filterValueByProtject as number) : 0;
		const ordHeaderFk = filterValueByContract ? (filterValueByContract as number) : 0;

		return new Observable((observer) => {
			if (projectId > 0) {
				this.getBillToList(projectId, ordHeaderFk).subscribe((res) => {
					const items = res as BillToEntity[];
					const filteredItems = request.searchText === '' ? items : items.filter((item) => item.Code?.includes(request.searchText));
					observer.next(new LookupSearchResponse(filteredItems));
					observer.complete();
				});
			} else {
				observer.next(new LookupSearchResponse([]));
				observer.complete();
			}
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<BillToEntity> {
		return new Observable((observer) => {
			const item = this.cache.getItem(key);
			if (item) {
				observer.next(item);
			} else {
				this.getBillToList().subscribe((response) => {
					const item = this.cache.getItem(key);
					if (item) {
						this.processItems([item]);
						this.cache.setItem(item);
						observer.next(item);
						observer.complete();
					} else {
						observer.next();
						observer.complete();
					}
				});
			}
		});
	}

	private getBillToList(projectId?: number, ordHeaderFk?: number): Observable<BillToEntity[]> {
		return new Observable((observer) => {
			if (this.cache.loaded) {
				observer.next(this.cache.list);
				observer.complete();
			} else {
				const url = this.configService.webApiBaseUrl + 'project/main/billto/getBillToByContractNProject?projectId=' + projectId + '&ordHeaderFk=' + ordHeaderFk;
				this.http.get(url).subscribe(
					(res) => {
						const items = res as BillToEntity[];
						if (this.cache.enabled) {
							this.cache.setList(items);
						}
						observer.next(items);
						observer.complete();
					},
					(error) => {
						observer.error(error);
					},
				);
			}
		});
	}
}
