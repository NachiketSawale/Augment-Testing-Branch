/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IState } from './initialize-state.interface';

/**
 * The Interface for Initialize
 */
export interface IDownloadInitialize {
    /**
     *  Is success or not.
     */
    IsSuccess: boolean;

    /**
    *  Token For export
    */
    ExportToken: string;

    /**
    *  state.
    */
    State: IState;

    /**
    *  Message for downpload complete or cancel.
    */
    Message: string;
}