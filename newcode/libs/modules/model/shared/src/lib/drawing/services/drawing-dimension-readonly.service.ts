/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ModelSharedDimensionServiceBase} from './drawing-dimension-base.service';
import {IDimensionServiceConfig} from '../model/interfaces/dimension-service-config.interface';

@Injectable({
    providedIn: 'root'
})
export class ModelSharedDimensionReadonlyService extends ModelSharedDimensionServiceBase {
    protected config: IDimensionServiceConfig = {
        readonly: true,
        disableHeaderFilter: true
    };
}