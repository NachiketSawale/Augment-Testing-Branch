/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Drawing viewer status interface
 */
export interface IDrawingViewerStatus {
    /**
     * Is viewer working
     */
    isWorking: boolean;
    /**
     * Message
     */
    message: string;
}