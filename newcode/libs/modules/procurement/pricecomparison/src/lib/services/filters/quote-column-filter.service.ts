/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContext, IIdentificationData } from '@libs/platform/common';
import { ILookupContext, ILookupSearchRequest, ILookupSearchResponse, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IQuoteHeaderLookUpEntity, ProcurementShareQuoteLookupService } from '@libs/procurement/shared';
import { ICustomCompareColumnEntity } from '../../model/entities/custom-compare-column-entity.interface';
import { map, firstValueFrom, Observable } from 'rxjs';

export class ProcurementPricecomparisonQuoteLookupService<TEntity extends {
	QtnHeaderFk: number,
	RfqHeaderId: number,
	Id: string,
	BusinessPartnerFk: number
}> extends ProcurementShareQuoteLookupService<TEntity> {
	public constructor(
		protected quoteSvc: ProcurementShareQuoteLookupService<TEntity>,
		protected getEntities: () => TEntity[]
	) {
		super();
	}

	private handleResponse(response: ILookupSearchResponse<IQuoteHeaderLookUpEntity>, context?: IEntityContext<TEntity>) {
		const selectedItem = context?.entity as TEntity;

		const bpName = response.items.find(e => e.QtnHeaderFk === selectedItem.QtnHeaderFk)?.BusinessPartnerName1 ?? '';
		let treeItem = this.getEntities();

		treeItem = treeItem.filter((item) => {  // different version of currency QTN in tree data
			return item.RfqHeaderId === selectedItem.RfqHeaderId && item.Id.toString() !== selectedItem.Id.toString() && item.BusinessPartnerFk === selectedItem.BusinessPartnerFk;
		});
		const treeItemIds = treeItem.map(e => e.QtnHeaderFk);
		// do filter
		response.items = response.items.filter((item) => {
			return selectedItem.BusinessPartnerFk === item.BusinessPartnerFk && item.RfqHeaderFk === selectedItem.RfqHeaderId && !treeItemIds.includes(item.Id);
		});

		// sort by name first
		response.items.sort((a, b) => {
			if (!a.BusinessPartnerName1 || !b.BusinessPartnerName1) {
				return 0;
			}
			return a.BusinessPartnerName1 < b.BusinessPartnerName1 ? 1 : (a.BusinessPartnerName1 > b.BusinessPartnerName1 ? -1 : 0);
		});

		// after the sort, put the current name at the beginning
		response.items = response.items.sort((a, b) => {
			const sortA = a.BusinessPartnerName1 === bpName ? 0 : response.items.findIndex(e => e.Id === a.Id) + 1;
			const sortB = b.BusinessPartnerName1 === bpName ? 0 : response.items.findIndex(e => e.Id === b.Id) + 1;
			return sortA < sortB ? 1 : (sortA > sortB ? -1 : 0);
		});

		this.quoteSvc.cache.setItems(response.items);
		this.cache.setItems(this.quoteSvc.syncService?.getListSync() ?? []);
		return response;
	}

	private getItemByKeyInternal(key: IIdentificationData) {
		this.cache.setItems(this.quoteSvc.syncService?.getListSync() ?? []);
		return super.getItemByKey(key);
	}

	public override getItemByKey(key: IIdentificationData): Observable<IQuoteHeaderLookUpEntity> {
		return this.getItemByKeyInternal(key);
	}

	public override async getItemByKeyAsync(key: IIdentificationData, context?: IEntityContext<TEntity>): Promise<IQuoteHeaderLookUpEntity> {
		return firstValueFrom(this.getItemByKeyInternal(key));
	}

	/**
	 * Should use client-side filter instead.
	 * @param request
	 * @param context
	 */
	public override getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>) {
		return super.getSearchList(request).pipe(
			map(r => this.handleResponse(r, context))
		);
	}

	public override async getSearchListAsync(request: ILookupSearchRequest, context?: IEntityContext<TEntity>) {
		const response = await super.getSearchListAsync(request, context);
		return this.handleResponse(response);
	}
}

/**
 * Represents the Quote lookup filter binding to the context ICustomCompareColumnEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonQuoteColumnFilter implements ILookupServerSideFilter<IQuoteHeaderLookUpEntity, ICustomCompareColumnEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-price-comparison-item-quote-lookup-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IQuoteHeaderLookUpEntity, ICustomCompareColumnEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			RfqHeaderFk: (context.entity as ICustomCompareColumnEntity).RfqHeaderId
		};
	}
}
