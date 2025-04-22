/*
 * Copyright(c) RIB Software GmbH
 */

import {DimensionData} from './dimension-data';
import {DimensionSetting} from './dimension-setting';
import {IDimensionEntity} from './interfaces/dimension-entity.interface';
import {IDimensionData} from './interfaces/dimension-data.interface';
import {IDimensionSetting} from './interfaces/dimension-setting.interface';

export class DimensionEntity implements IDimensionEntity {
    public Layout: string = '';
    public Name: string = '';
    public Uuid: string = '';
    public ModelObjectFk: number = -1;
    public IsNegative: boolean = false;
    public Scale?: number;
    public Geometry: string = '';
    public Data: IDimensionData = new DimensionData();
    public Setting: IDimensionSetting = new DimensionSetting();

    public constructor(public ModelFk: number) {

    }
}