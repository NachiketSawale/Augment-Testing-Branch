/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import {Injectable} from '@angular/core';
import { ICostcodePriceVerEntity } from '@libs/basics/interfaces';

/**
 * Basic costcodes price version service
 */
@Injectable({
	providedIn: 'root'
})

export class BasicsCostCodesPriceVersionLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ICostcodePriceVerEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		super({            
			httpRead: { route: 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=costcodepriceversion', usePostForRead: false }
		}, {
			uuid: '4E398F47B18D4966BD79346215781E8A',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
            gridConfig: {
                columns: [
                    {
                        id: 'priceverdesc',
                        model: 'DescriptionInfo.Translated',                                            
                        width: 200,
                        type: FieldType.Description,
                        label: {
                            text: 'Price Version Description',
                            key: 'basics.costcodes.priceList.priceVersionDescription'
                        }, 
                        sortable:true,
                        visible: true,
						readonly: true
                    },
                    {
                        id: 'pricelistfk',
                        model: 'PriceListDescription',
                        type: FieldType.Description,
                        label: {
                            text: 'Price List Description',
                            key: 'basics.costcodes.priceList.priceListDescription'
                        }, 
                       sortable:true,
                       visible: true,
                       readonly: true
                    }
                ]
            }
		});
	}
}