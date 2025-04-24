/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */



/**
 * The Interface for download.
 */
export interface IDownload {

    /**
     * The message for downloading progress.
     */
    Message: string;

    /**
     * The success state for downloading file.
     */
    Success: boolean;

    /**
     * The download file URL.
     */
    Url: string;
}