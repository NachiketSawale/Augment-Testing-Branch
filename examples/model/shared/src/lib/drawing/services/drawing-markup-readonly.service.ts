/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IMarkupServiceConfig} from '../model/interfaces/markup-service-config.interface';
import {ModelSharedMarkupServiceBase} from '../services/drawing-markup-base.service';

@Injectable({
    providedIn: 'root'
})
/**
 * ModelSharedMarkupReadonlyService
 */
export class ModelSharedMarkupReadonlyService extends ModelSharedMarkupServiceBase {
    protected config: IMarkupServiceConfig = {
        readonly: false,
        disableHeaderFilter: false
    };
}