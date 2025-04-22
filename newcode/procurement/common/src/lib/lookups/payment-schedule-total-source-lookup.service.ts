/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IPrcCommonPaymentScheduleTotalSourceEntity } from '../model/entities';
import { IEntityContext, IIdentificationData, PlatformTranslateService } from '@libs/platform/common';
import { PrcSharedTotalTypeLookupService } from '@libs/procurement/shared';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MainDataDto } from '@libs/basics/shared';
import { inject, Injectable } from '@angular/core';
import { IPrcCommonPaymentScheduleTotalSourceContextEntity } from '../model/entities';
import { find } from 'lodash';

//TODO complete the lookup in DEV-18588
/**
 * Procurement common payment schedule total source lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class PrcCommonPaymentScheduleTotalSourceLookupService<T extends IPrcCommonPaymentScheduleTotalSourceContextEntity = IPrcCommonPaymentScheduleTotalSourceContextEntity> extends UiCommonLookupReadonlyDataService<IPrcCommonPaymentScheduleTotalSourceEntity, T> {
	private readonly translate = inject(PlatformTranslateService);
	private readonly prcTotalTypeLookupService = inject(PrcSharedTotalTypeLookupService);
	private readonly mainAndChangeOrderText = this.translate.instant('procurement.common.paymentSchedule.mainAndChangeOrder').text;
	public readonly totalSourceIdOfMainNChangeOrder = -1;

	/**
	 * The constructor
	 */
	protected constructor() {
		super({
			uuid: 'e0563ac3b37f4904953cfb9ac907f63f',
			displayMember: 'TypeCode',
			valueMember: 'Id',
			disableInput: true,
			gridConfig: {
			   columns: [
				   {
					   id: 'Type',
					   model: 'TypeCode',
					   type: FieldType.Code,
					   label: {text: 'Type', key: 'procurement.common.reqTotalTotalTypeFk'},
					   sortable: true,
					   visible: true,
					   readonly: true
				   }, {
					   id: 'Description',
					   model: 'TypeDescription',
					   type: FieldType.Description,
					   label: {text: 'Description', key: 'cloud.common.entityDescription'},
					   sortable: true,
					   visible: true,
					   readonly: true
				   }, {
					   id: 'ValueNetOc',
					   model: 'ValueNetOc',
					   type: FieldType.Decimal,
					   label: {text: 'Net Value(Currency)', key: 'procurement.common.reqTotalValueNetOc'},
					   sortable: false,
					   visible: true,
					   readonly: true
				   }, {
					   id: 'GrossOc',
					   model: 'GrossOc',
					   type: FieldType.Decimal,
					   label: {text: 'Gross Value(Currency)', key: 'procurement.common.reqTotalGrossOC'},
					   sortable: false,
					   visible: true,
					   readonly: true
				   }
			   ]
			}
		   });
	}

	/**
	 * clear cache
	 */
	public clearCache() {
		this.cache.clear();
	}

	/**
	 * Get list
	 * @param context
	 */
	public getList(context?: IEntityContext<T>): Observable<IPrcCommonPaymentScheduleTotalSourceEntity[]> {
		const filter = this.prepareListFilter(context);
		const url = this.getUrl(context);
		return this.getListByFilter(filter, url).pipe(map(e => e.items));
	}

	/**
	 * Get list sync
	 */
	public getListSync() {
		return this.cache.getList();
	}

	/**
	 * Get search list
	 * @param request
	 * @param context
	 */
	public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<T>): Observable<ILookupSearchResponse<IPrcCommonPaymentScheduleTotalSourceEntity>> {
		const filter = this.prepareListFilter(context);
		const url = this.getUrl(context);
		return this.getListByFilter(filter, url);
	}

	/**
	 * Get lookup entity by identification data
	 * @param key
	 * @param context
	 */
	public getItemByKey(key: IIdentificationData, context?: IEntityContext<T>): Observable<IPrcCommonPaymentScheduleTotalSourceEntity> {
		return new Observable<IPrcCommonPaymentScheduleTotalSourceEntity>(observer => {
			if (key.id === this.totalSourceIdOfMainNChangeOrder) {
				observer.next(this.mainNChangeOrderItem);
				observer.complete();
				return;
			}

			const cacheItem = this.cache.getItem(key);
			if (cacheItem) {
				observer.next(cacheItem);
				observer.complete();
			} else if (context) {
				this.getList(context).subscribe(list => {
					list.some(item => {
						const i = this.identify(item);
						if (i.id === key.id) {
							observer.next(item);
							observer.complete();
						}
					});
				});
			}
		});
	}

	private prepareListFilter(context?: IEntityContext<T>): string {
		if (context?.entity?.ParentId && context?.entity?.ParentConfigurationFk) {
			return `MainItemId=${context.entity.ParentId}&ConfigurationFk=${context.entity.ParentConfigurationFk}&ShowAll=true`;
		}
		return '';
	}

	private getUrl(context?: IEntityContext<T>): string {
		if (context?.entity?.Url) {
			return context.entity.Url;
		}
		return '';
	}

	private getListByFilter(filter: string, url: string): Observable<ILookupSearchResponse<IPrcCommonPaymentScheduleTotalSourceEntity>> {
		return new Observable<ILookupSearchResponse<IPrcCommonPaymentScheduleTotalSourceEntity>>(o => {
			if (this.cache.loaded) {
				o.next(new LookupSearchResponse(this.cache.list));
				o.complete();
			} else {
				const filterStr = filter ? `?${filter}` : '';
				this.get(`${url}/list${filterStr}`).subscribe(async (res) => {
					const dto = new MainDataDto<IPrcCommonPaymentScheduleTotalSourceEntity>(res);
					const list = await this.processList(dto.Main);
					this.cache.setList(list);
					o.next(new LookupSearchResponse(list));
					o.complete();
				});
			}
		});
	}

	private async processList(items: IPrcCommonPaymentScheduleTotalSourceEntity[]) {
		const totalTypes = await firstValueFrom(this.prcTotalTypeLookupService.getList());
		items?.forEach(item => {
			const type = totalTypes?.find(t => t.Id === item.TotalTypeFk);
			if (type) {
				item.TypeCode = type.Code;
				item.TypeDescription = type.DescriptionInfo?.Translated;
			}
		});

		const mainNChangeOrderItem = find(items, {Id: this.totalSourceIdOfMainNChangeOrder});
		if (!mainNChangeOrderItem) {
			items.push(this.mainNChangeOrderItem);
		}

		return items;
	}

	private get mainNChangeOrderItem() {
		return {
			Id: this.totalSourceIdOfMainNChangeOrder,
			TypeCode: this.mainAndChangeOrderText,
			TypeDescription: this.mainAndChangeOrderText,
			Gross: 0,
			GrossOc: 0,
			HeaderFk: 0,
			TotalTypeFk: 0,
			ValueNet: 0,
			ValueNetOc: 0,
			ValueTax: 0,
			ValueTaxOc: 0
		};
	}
}
