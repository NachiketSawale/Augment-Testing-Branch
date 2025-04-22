/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IEntityContext, IIdentificationDataMutable, PlatformTranslateService } from '@libs/platform/common';
import { PrcSharedTotalTypeLookupFilter, PrcSharedTotalTypeLookupService } from '@libs/procurement/shared';
import { Observable, of, Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IPrcPackageTotalEntity } from '../../model/entities/procurement-package-total-entity.interface';
import { ProcurementPackageTotalDataService } from '../package-total-data.service';

type PrcPackageTotalLookup = IPrcPackageTotalEntity & { Code: string; Translated?: string };

/**
 * Procurement package total lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class PackageTotalLookupService extends UiCommonLookupReadonlyDataService<object, object> {
	private readonly translate = inject(PlatformTranslateService);
	private readonly prcTotalTypeLookupService = inject(PrcSharedTotalTypeLookupService);
	private readonly prcPackageTotalDataService = inject(ProcurementPackageTotalDataService);

	private lookupCache: PrcPackageTotalLookup[] = [];

	/**
	 * The constructor
	 */
	protected constructor() {
		super({
			uuid: 'a079122b367f4db98f9435282185ac0d',
			displayMember: 'Code',
			valueMember: 'Id',
			descriptionMember: 'ValueNetOc',
			gridConfig: {
				columns: [
					{
						id: 'TotalTypeFk',
						model: 'TotalTypeFk',
						type: FieldType.Lookup,
						sortable: true,
						visible: true,
						readonly: true,
						label: 'procurement.common.reqTotalTotalTypeFk',
						lookupOptions: createLookup({
							dataServiceToken: PrcSharedTotalTypeLookupService,
							serverSideFilter: new PrcSharedTotalTypeLookupFilter(),
						}),
						width: 120,
					},
					{
						id: 'Description',
						model: 'Translated',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 150,
					},
					{
						id: 'ValueNetOc',
						model: 'ValueNetOc',
						type: FieldType.Decimal,
						label: { text: 'Net Value(Currency)', key: 'procurement.common.reqTotalValueNetOc' },
						sortable: false,
						visible: true,
						readonly: true,
						width: 80,
					},
					{
						id: 'GrossOc',
						model: 'GrossOc',
						type: FieldType.Decimal,
						label: { text: 'Gross Value(Currency)', key: 'procurement.common.reqTotalGrossOC' },
						sortable: false,
						visible: true,
						readonly: true,
						width: 80,
					},
				],
			},
		});
	}

	public getItemByKey$ = new Subject<[PrcPackageTotalLookup | undefined, number, number | undefined]>();

	public getList(context?: IEntityContext<object>): Observable<PrcPackageTotalLookup[]> {
		this.lookupCache = [];
		return of(this.getItems());
	}

	public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<object>): Observable<ILookupSearchResponse<PrcPackageTotalLookup>> {
		return of(new LookupSearchResponse(this.getItems()));
	}

	public getItemByKey(key: Readonly<IIdentificationDataMutable>, context?: IEntityContext<{ TotalCost: number }>): Observable<PrcPackageTotalLookup> {
		const list = this.getItems();
		const cost = parseFloat(context?.entity?.TotalCost?.toFixed(2) ?? '');
		const found = list.find((item) => {
			return item.ValueNetOc === cost;
		});

		const valOc = found ? found.ValueNetOc : cost;
		const grossOc = found ? found.GrossOc : undefined;

		this.getItemByKey$.next([found, valOc, grossOc]);


		return found ? of(found) : of();
	}

	private getItems() {
		if (this.lookupCache.length > 0) {
			return this.lookupCache;
		}

		const list = this.prcPackageTotalDataService.getList() as PrcPackageTotalLookup[];
		list.forEach((item: PrcPackageTotalLookup) => {
			const type = this.prcPackageTotalDataService.getTotalType(item);
			if (type) {
				item.Code = type.Code;
				item.Translated = type.DescriptionInfo?.Translated;
			} else {
				//TODO: getTotalType not working currently, remove below logic after getTotalType is completed.
				const totalType = this.prcTotalTypeLookupService.cache.getItem({ id: item.TotalTypeFk });
				if (totalType) {
					item.Code = totalType.Code;
					item.Translated = totalType.DescriptionInfo?.Translated;
				}
			}
		});

		this.lookupCache = list;
		return list;
	}
}
