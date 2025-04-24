/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Observable, of, tap } from 'rxjs';
import { BasicsSharedConStatusLookupService } from '@libs/basics/shared';

/**
 * Contract lookup entity interface
 */
export interface IContractLookupEntity {
	Id: number;
	Code: string;
	ConStatusFk: number;
	Description: string;
	BPName1: string;
	BpName2: string;
	SupplierCode: string;
	Supplier2Code: string;
	ProjectNo: string;
	ProjectName: string;
	ProjectFk?: number;
	BusinessPartnerFk: number;
	BusinessPartner2Fk?: number;
	PrcHeaderId: number;
	IsFreeItemsAllowed: boolean;
	ConHeaderFk: number;
	ProjectChangeFk?: number;
	ControllingUnitFk?: number;
	PrcStructureFk?: number;
	ClerkPrcFk?: number;
	ClerkReqFk?: number;
	SalesTaxMethodFk?: number;
	TaxCodeFk?: number;
	PrcPackageFk?: number;
	PaymentTermPaFk?: number;
	PaymentTermFiFk?: number;
	BpdSupplierFk?: number;
	BpdSubsidiaryFk?: number;
	BpdContactFk?: number;
	BpdVatGroupFk?: number;
	CurrencyFk?: number;
	PrcConfigHeaderFk?: number;
	MdcBillingSchemaFk?: number;
}

/**
 * Contract lookup data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementShareContractLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IContractLookupEntity, TEntity> {
	public constructor() {
		super('ConHeaderView', {
			uuid: '32deafa53c5d4477a94dcdd9affb93a2',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'description',
						model: 'Description',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'status',
						model: 'ConStatusFk',
						type: FieldType.Lookup,
						label: { text: 'Description', key: 'cloud.common.entityStatus' },
						sortable: true,
						visible: true,
						readonly: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedConStatusLookupService,
						}),
					},
					{
						id: 'BPName1',
						model: 'BPName1',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityBusinessPartnerName1' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'BpName2',
						model: 'BpName2',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityBusinessPartnerName2' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Basis Contract',
					key: 'procurement.common.assignContract',
				},
			},
			showDialog: true,
		});
	}

	public getItemByKeys(keys: number[]): Observable<IContractLookupEntity[]> {
		const resultInCache = this.cache.getList().filter((entity) => keys.some((k) => k === entity.Id));
		if (resultInCache.length === keys.length) {
			return of(resultInCache);
		}

		return this.http.post<IContractLookupEntity[]>(this.configService.webApiBaseUrl + 'procurement/contract/header/listall', keys).pipe(
			tap((result) => {
				this.cache.setItems(result);
			}),
		);
	}
}
