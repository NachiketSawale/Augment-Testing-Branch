/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IEntityContext, IIdentificationDataMutable, PlatformTranslateService } from '@libs/platform/common';
import { PrcSharedTotalTypeLookupService, PrcTotalKindLookupService } from '@libs/procurement/shared';
import { map, Observable, of, zip } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ProcurementPackageTotalDataService } from '../package-total-data.service';

type PrcPackagesTotalLookup = { Id: number; TypeCodes: string; TotalKindFk: number; Description: string; TypeObj: string[] };

/**
 * Procurement package total lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class PackagesTotalLookupService extends UiCommonLookupReadonlyDataService<object, object> {
	private readonly translate = inject(PlatformTranslateService);
	private readonly prcTotalTypeLookupService = inject(PrcSharedTotalTypeLookupService);
	private readonly prcPackageTotalDataService = inject(ProcurementPackageTotalDataService);
	private readonly prcTotalKindLookupService = inject(PrcTotalKindLookupService);

	private lookupCache: PrcPackagesTotalLookup[] = [];

	/**
	 * The constructor
	 */
	protected constructor() {
		super({
			uuid: '49f54e0a71f34363bc77d4f54e9b8a12',
			displayMember: 'Description',
			valueMember: 'TotalKindFk',
			descriptionMember: 'TotalKindFk',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: 'procurement.common.wizard.generatePaymentSchedule.totalKind',
						sortable: true,
						visible: true,
						readonly: true,
						width: 150,
					},
					{
						id: 'TypeCodes',
						model: 'TypeCodes',
						type: FieldType.Description,
						label: 'procurement.common.reqTotalTotalTypeFk',
						sortable: true,
						visible: true,
						readonly: true,
						width: 150,
					},
				],
			},
		});
	}

	public getList(context?: IEntityContext<{ Ids: number[] }>): Observable<PrcPackagesTotalLookup[]> {
		this.lookupCache = [];
		return this.getItems(context?.entity?.Ids ?? []);
	}

	public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<{ Ids: number[] }>): Observable<ILookupSearchResponse<PrcPackagesTotalLookup>> {
		return this.getItems().pipe(map((list) => new LookupSearchResponse(list)));
	}

	public getItemByKey(key: Readonly<IIdentificationDataMutable>, context?: IEntityContext<{ Ids: number[]; MultipleTotalType: number }>): Observable<PrcPackagesTotalLookup> {
		return this.getItems(context?.entity?.Ids ?? []).pipe(
			map((list) => {
				let found: undefined | PrcPackagesTotalLookup;
				if (list && list.length) {
					found = list[0];

					if (context?.entity && context?.entity?.MultipleTotalType !== -1) {
						found = list.find((item) => item.TotalKindFk === key.id) ?? list[0];
						//context.entity.MultipleTotalType = context.entity.MultipleTotalType === -1 ? list[0].TotalKindFk : context.entity.MultipleTotalType;
					}
				}
				return found as PrcPackagesTotalLookup;
			}),
		);
	}

	private getItems(ids?: number[]) {
		if (this.lookupCache.length > 0) {
			return of(this.lookupCache);
		}
		if (!ids || ids.length === 0) {
			return of([] as PrcPackagesTotalLookup[]);
		}
		const getData = zip([this.prcPackageTotalDataService.getSameTotalsFromPackages(ids), this.prcTotalKindLookupService.getList(), this.prcTotalTypeLookupService.getList()]);

		return new Observable<PrcPackagesTotalLookup[]>((observer) => {
			getData.subscribe(([p1]) => {
				const result = new Map<number, PrcPackagesTotalLookup>();
				if (!p1) {
					observer.next([] as PrcPackagesTotalLookup[]);
					observer.complete();
					return;
				}
				p1.forEach((item) => {
					const type = this.prcTotalTypeLookupService.cache.getItem({ id: item.TotalTypeFk });
					const totalKind = this.prcTotalKindLookupService.cache.getItem({ id: item.TotalKindFk ?? 0 });
					if (item.TotalKindFk && totalKind && type) {
						const itemTotalKind = result.get(item.TotalKindFk);
						if (!itemTotalKind) {
							const i: PrcPackagesTotalLookup = {
								Id: item.TotalKindFk,
								TypeCodes: '',
								TotalKindFk: item.TotalKindFk,
								Description: totalKind.Description,
								TypeObj: [],
							};
							i.TypeObj.push(type.Code);
							result.set(item.TotalKindFk, i);
						} else {
							itemTotalKind.TypeObj = itemTotalKind.TypeObj.concat(type.Code);
						}
					}
				});
				result.forEach((value) => {
					value.TypeCodes = value.TypeObj.join(' / ');
				});
				const array = Array.from(result.values());
				this.lookupCache = array;
				observer.next(array);
				observer.complete();
			});
		});
	}
}
