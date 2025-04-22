/*
 * Copyright(c) RIB Software GmbH
 */

import {IDimensionSetting} from './interfaces/dimension-setting.interface';

export class DimensionSetting implements IDimensionSetting{
    public PositiveColor?: number;
    public PositiveTexture?: number;
    public NegativeColor?: number;
    public NegativeTexture?: number;
}