/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { ProcurementTicketSystemOrderQueryParam } from '../model/order-query-param';
import { ProcurementTicketSystemOrderQueryResponse } from '../model/order-query-response';
import { IPrcItemEntity } from '../model/interfaces/prc-item-entity.interface';
import { IItemBlobEntity } from '../model/interfaces/item-blob-entity.interface';
import { IProcurementQueryParam } from '../model/interfaces/prc-order-query-param.interface';
import { IPrcOrderQueryItemEntity } from '../model/interfaces/prc-order-query-item-entity.interface';

export class OrderBaseService {
	protected readonly http = inject(PlatformHttpService);

	public constructor(public config: IProcurementQueryParam) {}

	/**
	 * Initialize load
	 * @param request
	 */
	public async load(request: ProcurementTicketSystemOrderQueryParam) {
		request.EntityType = this.config.entityType;
		const response = await this.http.post<ProcurementTicketSystemOrderQueryResponse>(this.config.orderList, request);
		return this.createResponse(response);
	}

	/**
	 * get response from order request http
	 */
	private createResponse(response: ProcurementTicketSystemOrderQueryResponse) {
		const result = response.Result;
		result.forEach((v) => {
			const prcItems = v.PrcItems;
			let total = 0;
			prcItems?.forEach((item) => {
				total += item.Total;
				item.Image = '';
				this.setImage(item);
			});
			v.Total = total;
		});
		return response;
	}

	/**
	 * show Item image
	 */
	private async setImage(item: IPrcItemEntity): Promise<void> {
		if (!item.MdcMaterialFk) {
			return;
		}
		try {
			await this.http
				.get<IItemBlobEntity>(this.config.commodity, {
					params: { materialId: item.MdcMaterialFk },
				})
				.then((resContent) => {
					if (resContent?.Content) {
						item.Image = `data:image/png;base64,${resContent.Content}`;
					}
				});
		} catch (error) {
			console.error('Failed to fetch image for material:', item.MdcMaterialFk, error);
		}
	}

	/**
	 * Delete Item
	 */
	public async DeleteItem$(item: IPrcOrderQueryItemEntity) {
		return await this.http.get(this.config.requisition, { params: { Id: item.Id } });
	}
}
