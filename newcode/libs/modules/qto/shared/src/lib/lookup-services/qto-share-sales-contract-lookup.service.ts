/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import _ from 'lodash';
import { BasicsSharedCustomerAbcLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IIdentificationData } from '@libs/platform/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';

/**
 * data for get sales contract by portal
 */
export class SalesContractsEntity {
	public Id: number = 0;
	public Code: string = '';
	public Description: string = '';
	public OrdStatusFk: number = 0;
	public BusinesspartnerFk: number = 0;
	public ClerkFk: number = 0;
	public PrcStructureFk: number = 0;
	public BillToFk: number | null = null;
}

/**
 * Lookup service for the sales contract lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class QtoShareSalesContractLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<SalesContractsEntity, TEntity> {
	public constructor() {
		super({
			uuid: '8CDDAEFEF07B4E0EB46B4BCDE225A8FC',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '8CDDAEFEF07B4E0EB46B4BCDE225A8FC',
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
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						readonly: true,
						sortable: true,
					},
					{
						id: 'status',
						model: 'OrdStatusFk',
						label: { text: 'Status', key: 'cloud.common.entityStatus' },
						sortable: true,
						...BasicsSharedCustomizeLookupOverloadProvider.provideOrderStatusReadonlyLookupOverload(),
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
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Sales Contract',
					key: 'sales.common.dialogTitleAssignContract',
				},
			},
			showDialog: true,
			buildSearchString: (searchText: string) => {
				let searchString = '';
				if (searchText) {
					const filterString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
					searchString = filterString.replace(/%SEARCH%/g, searchText);
				}
				return searchString;
			},
		});
	}

	public override getList(): Observable<SalesContractsEntity[]> {
		return this.getDataList('', false, 0, 0);
	}

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<SalesContractsEntity>> {
		const isQtoLineParam = _.get(request.additionalParameters, 'IsQtoLine');
		const billToFkParam = _.get(request.additionalParameters, 'BillToFk');
		const PrjBoqFkParam = _.get(request.additionalParameters, 'PrjBoqFk');
		const filtersParam = _.get(request.additionalParameters, 'Filters');

		return new Observable((observer) => {
			const isQtoLine = isQtoLineParam ? (isQtoLineParam as boolean) : false;
			const billToFk = billToFkParam ? (billToFkParam as number) : 0;
			const PrjBoqFk = PrjBoqFkParam ? (PrjBoqFkParam as number) : 0;
			const filters = filtersParam ? (filtersParam as string) : '';
			const filterString = request.filterString;
			const searchString = filters !== '' ? (filterString !== '' ? '(' + filterString + ') AND ' + filters : filters) : '';

			this.getDataList(searchString, isQtoLine, billToFk, PrjBoqFk).subscribe((res) => {
				observer.next(new LookupSearchResponse(res));
				observer.complete();
			});
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<SalesContractsEntity> {
		return new Observable((observer) => {
			const item = this.cache.getItem(key);
			if (item) {
				observer.next(item);
			} else {
				this.getDataList('', false, 0, 0).subscribe((res) => {
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

	public getDataList(searchString: string, isQtoLine: boolean, bollToFk: number, prjBoqFk: number): Observable<SalesContractsEntity[]> {
		return new Observable((observer) => {
			if (this.cache.loaded) {
				observer.next(this.cache.list);
				observer.complete(); // Ensure the observable completes
			} else {
				const postParam = {
					Filter: searchString,
					BillToFk: isQtoLine && bollToFk > 0 ? bollToFk : null,
					PrjBoqFk: !isQtoLine && prjBoqFk > 0 ? prjBoqFk : null,
				};
				this.http.post(this.configService.webApiBaseUrl + 'sales/contract/GetSalesContractByPortal', postParam).subscribe(
					(res) => {
						const items = res as SalesContractsEntity[];
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
