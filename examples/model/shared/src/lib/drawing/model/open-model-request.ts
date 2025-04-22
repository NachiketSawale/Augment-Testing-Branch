/*
 * Copyright(c) RIB Software GmbH
 */
import {IIdentificationData} from '@libs/platform/common';
import {DrawingModelConfig} from './drawing-model-config';
import {DrawingDisplayMode} from './enums';

/**
 * Request to show drawing in drawing viewer component
 */
export class OpenModelRequest {
    /**
     * Model configuration
     */
    public modelConfig?: DrawingModelConfig;
    /**
     * model object uuids to be selected after drawing opened
     */
    public modelObjectUuids?: string[];
    /**
     * model object uuids to be selected after drawing opened
     */
    public modelObjectIds?: IIdentificationData[];
    /**
     * Open model in which display mode
     */
    public displayMode: DrawingDisplayMode;

    /**
     * The constructor
     * @param modelId
     */
    public constructor(public modelId: number) {
        this.displayMode = DrawingDisplayMode.D2;
    }
}