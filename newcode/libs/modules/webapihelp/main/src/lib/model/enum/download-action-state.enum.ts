/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


/**
 * For Download Prepairing State
 */
export enum DownloadActionState {

    /**
     * for Preparing
     */
    Preparing = 'Preparing ',

    /**
     * for Preparing
     */
    ProgressPercent = 'Preparing ...',

    /**
     * For 1% preparing
     */
    ProgressPercent_1 = 'Preparing 1% ...',

    /**
     * For 2% preparing
     */
    ProgressPercent_2 = 'Preparing 2% ...',

    /**
     * For 3% preparing
     */
    ProgressPercent_3 = 'Preparing 3%...',

    /**
     * For download canceled
     */
    Canceled = 'Download was canceled!',

    /**
     * For download start
     */
    Downloaded = 'The download has started, please check your browser.',

}