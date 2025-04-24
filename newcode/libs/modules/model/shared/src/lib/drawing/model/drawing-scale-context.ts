/*
 * Copyright(c) RIB Software GmbH
 */

import {Subject} from 'rxjs';
import {DrawingLayoutConfig} from './drawing-layout-config';

export class DrawingScaleContext {
    public uomChanged = new Subject<number>();

    public constructor(public layoutConfig: DrawingLayoutConfig) {

    }
}