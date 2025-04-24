/*
 * Copyright(c) RIB Software GmbH
 */

import { ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCustomizeEstimateRoundingConfigurationTypeEntity, IBasicsCustomizeLineItemContextEntity } from '@libs/basics/interfaces';
import { inject, Injectable } from '@angular/core';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { IEntityContext } from '@libs/platform/common';
import { map, Observable } from 'rxjs';

/**
 * Service for totals config type lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class RoundingConfigTypeLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstimateRoundingConfigurationTypeEntity, TEntity> {
	private readonly isFilterByMdcContext = false;
	private readonly roundingConfigTypeQueryPath = this.configService.webApiBaseUrl + 'basics/customize/estimateroundingconfigurationtype/list';
	private selectedItemId: number | null = null;
	private mdcContextId: number | null = null;
	private readonly contextService: EstimateMainContextService = inject(EstimateMainContextService);

	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/estimateroundingconfigurationtype/', endPointRead: 'list', usePostForRead: true },
			},
			{
				uuid: 'ad1caa33bb954dfe934afbf2e78f30f5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
			},
		);
	}

	/**
	 * get list
	 * @param context
	 */
	public override getList(context?: IEntityContext<TEntity>): Observable<IBasicsCustomizeEstimateRoundingConfigurationTypeEntity[]> {
		return new Observable<IBasicsCustomizeEstimateRoundingConfigurationTypeEntity[]>((o) => {
			this.getLineItemContextIds().then((lineItemContexts) => {
				this.http.post<IBasicsCustomizeEstimateRoundingConfigurationTypeEntity[]>(this.roundingConfigTypeQueryPath, {}).subscribe((res) => {
					let list = res as IBasicsCustomizeEstimateRoundingConfigurationTypeEntity[];
					if(this.isFilterByMdcContext && lineItemContexts && lineItemContexts.length > 0 && this.mdcContextId){
						const lineItemContextIds = lineItemContexts.filter(e => e.ContextFk === this.mdcContextId).map((e) => e.Id);
						if(lineItemContextIds && lineItemContextIds.length > 0){
							list = list.filter((item) => {
								return lineItemContextIds.includes(item.LineItemContextFk);
							});
						}
					}
					list = this.filterList(list);
					o.next(list);
					o.complete();
				});
			});
		});
	}

	/**
	 * get search list
	 * @param request
	 * @param context
	 */
	public override getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<IBasicsCustomizeEstimateRoundingConfigurationTypeEntity>> {
		return this.getList(context).pipe(
			map((list) => {
				return new LookupSearchResponse(list);
			}),
		);
	}

	/**
	 * Converts the list of column config types.
	 * @param list
	 */
	public override filterList(list: IBasicsCustomizeEstimateRoundingConfigurationTypeEntity[]): IBasicsCustomizeEstimateRoundingConfigurationTypeEntity[] {
		let data = list;
		if(!this.isFilterByMdcContext){
			const estHeaderContext = this.contextService.getSelectedEstHeaderItem();
			if(estHeaderContext && estHeaderContext.MdcLineItemContextFk){
				data = data.filter(item => item.LineItemContextFk === estHeaderContext.MdcLineItemContextFk);
			}
		}
		data = data.filter((item) => item.IsLive || item.Id === this.selectedItemId);
		return data;
	}

	/**
	 * get lineItemContext ids
	 */
	public getLineItemContextIds():Promise<IBasicsCustomizeLineItemContextEntity[]>{
		const lineItemContextQueryPath = this.configService.webApiBaseUrl + 'basics/customize/lineitemcontext/list';
		return new Promise((resolve, reject) => {
			this.http.post<IBasicsCustomizeLineItemContextEntity[]>(lineItemContextQueryPath, {}).subscribe( result => {
				resolve(result);
			});
		});
	}

	/**
	 * Sets the selected item ID for filtering.
	 * @param itemId
	 */
	public setSelectedItemId(itemId: number | null): void {
		this.selectedItemId = itemId;
	}

	/**
	 * Sets the MDC context ID for further filtering.
	 * @param id
	 */
	public setMdcContextId(id: number): void {
		if (id !== 0) {
			this.mdcContextId = id;
		}
	}

	/**
	 * Clears the MDC context ID.
	 */
	public clearMdcContextId(){
		this.mdcContextId = null;
	}
}
