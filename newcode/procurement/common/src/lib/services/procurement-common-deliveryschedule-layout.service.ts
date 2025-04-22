/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProcurementCommonDeliveryScheduleEntity } from '../model/entities/procurement-common-deliveryschedule-entity.interface';
import { ProcurementCommonItemStatusEntity, ProcurementCommonItemStatusLookupService } from '../lookups/procurement-common-item-status-lookup.service';
/**
 * DeliverySchedule layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonDeliveryscheduleLayoutService {
	public async generateConfig<T extends IProcurementCommonDeliveryScheduleEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'DateRequired',
						'TimeRequired',
						'Description',
						'Quantity',
						'CommentText',
						'RunningNumber',
						'QuantityConfirm',
						'DeliverdateConfirm',
						'PrcItemstatusFk',
						'AddressDto'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					RunningNumber:{key:'delivery.runningNumber', text: 'Running Number'},
					QuantityConfirm:{key:'delivery.quantityConfirm', text: 'Confirmed Quantity'},
					DeliverdateConfirm:{key:'delivery.deliverdateConfirm', text: 'Confirmed Delivery Date'},
					AddressDto:{key:'delivery.addressdto', text: 'Address'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DateRequired: {key: 'entityRequiredBy', text: 'Required By'},
					TimeRequired: {key: 'entityTime', text: 'Time'},
					Description: {key: 'entityDescription', text: 'Description'},
					Quantity: {key: 'entityQuantity', text: 'Quantity'},
					CommentText: {key: 'entityCommentText', text: 'Comment'},
					PrcItemstatusFk:{key:'entityState', text: 'State'},
				})
			},
			overloads: {
				PrcItemstatusFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup<IProcurementCommonDeliveryScheduleEntity, ProcurementCommonItemStatusEntity>({
						dataServiceToken: ProcurementCommonItemStatusLookupService,
						readonly: true
					})
				},
				AddressDto:{
					//todo-use common address lookup
				}
			}
		};
	}
}