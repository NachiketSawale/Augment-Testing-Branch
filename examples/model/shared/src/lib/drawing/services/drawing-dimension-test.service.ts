/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ModelSharedDimensionServiceBase} from './drawing-dimension-base.service';
import {IDimensionServiceConfig} from '../model/interfaces/dimension-service-config.interface';
import {IObjectTemplate} from '../model/interfaces/object-template.interface';

/**
 * Test dimension service
 */
@Injectable({
    providedIn: 'root'
})
export class ModelSharedDrawingDimensionTestService extends ModelSharedDimensionServiceBase {
    protected config: IDimensionServiceConfig = {
        objectUsageContract: 'Cos.Main.ObjectUsage',
        objectTemplateContract: 'Cos.Main.ObjectTemplate'
    };

    protected override getHeaderId() {
        return {id: 1007089, pKey1: 1001393};
    }

    protected override getHeaderIds() {
        return [{id: 1007089, pKey1: 1001393}];
    }

    public override async getObjectTemplate(): Promise<IObjectTemplate> {
        return {
            id: 1,
            mode: 2,
            name: 'test',
            height: 1,
            multiplier: 1,
            offset: 1,
            positiveColor: 1,
            negativeColor: 1,
            positiveTexture: 1,
            negativeTexture: 1,
        };
    }
}