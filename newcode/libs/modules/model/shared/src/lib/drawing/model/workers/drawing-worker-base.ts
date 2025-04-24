/*
 * Copyright(c) RIB Software GmbH
 */

import {Subscription} from 'rxjs';
import {IgeViewer} from '@rib-4.0/ige-viewer';
import {DrawingViewer} from './drawing-viewer';

export class DrawingWorkerBase {
    protected closed = false;
    protected subscriptions: Subscription[] = [];
    protected igeViewer: IgeViewer;

    public constructor(protected viewer: DrawingViewer) {
        this.igeViewer = viewer.igeViewer;
    }

    public dispose() {
        this.onDispose();
        this.closed = true;
    }

    protected onDispose() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];
    }
}