/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Indicates the status of the current transmission.
 */
export enum BidderSendStatus {
    /**
     * Indicates that the transmission is still in progress.
     */
    Loading = -1,

    /**
     * Indicates that there was an error with the transmission.
     */
    Error = 1,

    /**
     * Indicates the transmission completed successfully.
     */
    Success = 2 
}