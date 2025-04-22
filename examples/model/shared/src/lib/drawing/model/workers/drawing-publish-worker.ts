/*
 * Copyright(c) RIB Software GmbH
 */

import {DrawingWorkerBase} from './drawing-worker-base';
import {DrawingViewer} from './drawing-viewer';

/**
 * Publish worker for drawing
 */
export class DrawingPublishWorker extends DrawingWorkerBase {
    public constructor(viewer: DrawingViewer) {
        super(viewer);
    }
}