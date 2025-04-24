/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
	BasicsSharedLookupOverloadProvider,
	BasicsSharedUomLookupService,
} from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPPSEventEntity, PpsItemLookupService, ProductionplanningSharedPpsEventLookupService } from '@libs/productionplanning/shared';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IPPSItemEntity, IPpsUpstreamItemEntity } from '../../model/models';

/**
 * PPS UpstreamItem layout service
 */
@Injectable({
	providedIn: 'root'
})
export class PpsUpstreamItemLayoutService {

	public generateLayout(): ILayoutConfiguration<IPpsUpstreamItemEntity> {
		return <ILayoutConfiguration<IPpsUpstreamItemEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PpsItemFk', 'PpsUpstreamStatusFk', 'PpsUpstreamTypeFk', 'UpstreamResult', 'UpstreamResultStatus',
						'PpsUpstreamGoodsTypeFk', 'UpstreamGoods', 'Quantity', 'UomFk', 'Comment', 'PpsEventReqforFk', 'AvailableQuantity',
						'OpenQuantity', 'SplitQuantity', 'RemainingQuantity', 'PpsEventtypeReqforFk', 'IsForTransport', 'IsImported',
						'TrsOpenQuantity', 'TrsAssignedQuantity', 'EngDrawingFk']
				},
				{
					gid: 'planningGroup',
					attributes: ['DueDate']
				},
				{
					gid: 'userDefTextGroup',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
				},
				{
					gid: 'userDefDateGroup',
					attributes: ['UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']
				},
				{
					gid: 'userDefDateTimeGroup',
					attributes: ['UserDefinedDateTime1', 'UserDefinedDateTime2', 'UserDefinedDateTime3', 'UserDefinedDateTime4', 'UserDefinedDateTime5']
				},
			],
			overloads: {
				PpsItemFk: {
					// navigator
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPpsUpstreamItemEntity, IPPSItemEntity>({
						dataServiceToken: PpsItemLookupService,
						showClearButton: true
					})
				},
				PpsEventReqforFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPpsUpstreamItemEntity, IPPSEventEntity>({
						dataServiceToken: ProductionplanningSharedPpsEventLookupService,
						showClearButton: true,
						clientSideFilter: {
							execute(item: IPPSEventEntity, context: ILookupContext<IPPSEventEntity, IPpsUpstreamItemEntity>): boolean {
								return (item.ItemFK === context?.entity?.PpsItemFk);
							}
						}
					})
				},
				PpsUpstreamStatusFk: BasicsSharedLookupOverloadProvider.providePpsUpstreamItemStatusReadonlyLookupOverload(),
				PpsUpstreamGoodsTypeFk: BasicsSharedLookupOverloadProvider.providePpsUpstreamGoodsTypeReadonlyLookupOverload(),
				PpsUpstreamTypeFk: BasicsSharedLookupOverloadProvider.providePpsUpstreamTypeReadonlyLookupOverload(),
				UpstreamGoods: {
					// todo
				},
				UpstreamResult: {
					// todo
				},
				UomFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showClearButton: true,
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					PpsUpstreamStatusFk: 'entityStatus',
					Userdefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
					UserDefinedDate1: { key: 'entityUserDefinedDate', params: { p_0: '1' } },
					UserDefinedDate2: { key: 'entityUserDefinedDate', params: { p_0: '2' } },
					UserDefinedDate3: { key: 'entityUserDefinedDate', params: { p_0: '3' } },
					UserDefinedDate4: { key: 'entityUserDefinedDate', params: { p_0: '4' } },
					UserDefinedDate5: { key: 'entityUserDefinedDate', params: { p_0: '5' } }
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					EngDrawingFk: 'product.drawing',
				}),
				...prefixAllTranslationKeys('productionplanning.item.', {
					PpsItemFk: 'entityItem',
					Quantity: 'quantity',
					UomFk: 'uomFk',
					userDefDateTimeGroup: 'userDefDateTimeGroup',
					UserDefinedDateTime1: { key: 'entityUserDefinedDateTime', params: { p_0: '1' } },
					UserDefinedDateTime2: { key: 'entityUserDefinedDateTime', params: { p_0: '2' } },
					UserDefinedDateTime3: { key: 'entityUserDefinedDateTime', params: { p_0: '3' } },
					UserDefinedDateTime4: { key: 'entityUserDefinedDateTime', params: { p_0: '4' } },
					UserDefinedDateTime5: { key: 'entityUserDefinedDateTime', params: { p_0: '5' } },
				}),
				...prefixAllTranslationKeys('productionplanning.item.upstreamItem.', {
					PpsUpstreamTypeFk: 'ppsUpstreamTypeFk',
					PpsEventReqforFk: 'ppseventreqfor',
					PpsUpstreamGoodsTypeFk: 'ppsupstreamgoodstype',
					UpstreamResult: 'upstreamresult',
					UpstreamGoods: 'upstreamgoods',
					UpstreamResultStatus: 'upstreamresultstatus',
					AvailableQuantity: 'availableQuantity',
					OpenQuantity: 'openQuantity',
					PpsUpstreamItemFk: 'ppsUpstreamItemFk',
					SplitQuantity: 'splitQuantity',
					RemainingQuantity: 'remainingQuantity',
					PpsEventtypeReqforFk: 'ppsEventtypeReqforFk',
					UpstreamItemQuantity: 'upstreamItemQuantity',
					IsForTransport: 'isForTransport',
					IsImported: 'isImported',
					TrsOpenQuantity: 'TrsOpenQuantity',
					TrsAssignedQuantity: 'TrsAssignedQuantity',
					planningGroup: 'planningGroup',
					DueDate: 'dueDate',
				}),

			},
		};
	}
}