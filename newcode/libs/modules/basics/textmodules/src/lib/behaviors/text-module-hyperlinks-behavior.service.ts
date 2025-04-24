/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ITextModuleHyperlinkEntity } from '../model/entities/textmodulehyperlink-entity.interface';

@Injectable({
    providedIn: 'root',
})
export class TextModulesHyperlinkBehaviorService implements IEntityContainerBehavior<IGridContainerLink<ITextModuleHyperlinkEntity>, ITextModuleHyperlinkEntity> {

    public onCreate(containerLink: IGridContainerLink<ITextModuleHyperlinkEntity>): void {

    }

}
