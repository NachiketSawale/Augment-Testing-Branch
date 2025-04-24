/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsCustomizeSiteTypeEntity } from '@libs/basics/interfaces';
import { ILookupContext, ILookupImageSelector, LookupImageIconType } from '@libs/ui/common';

/**
 * Image selector for site type
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsSiteTypeIconService<TEntity extends object> implements ILookupImageSelector<IBasicsCustomizeSiteTypeEntity, TEntity> {

    public getIconType() {
        return LookupImageIconType.Css;
    }

    public select(item: IBasicsCustomizeSiteTypeEntity, context: ILookupContext<IBasicsCustomizeSiteTypeEntity, TEntity>): string {
		const imageCssPrefix = 'block-image type-icons ico-facilities-';
		return `${imageCssPrefix}${item.Icon?.toString().padStart(2, '0') || '01'}`; // Default icon if Icon is undefined
    }
}
