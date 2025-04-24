/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


/**
 * The Interface for State.
 */
export interface IState {
     /**
     * The State.
     */
     State: number;

     /**
      * The Downloading Process.
      */
     Progress: number;
 
     /**
      * Messages when download file.
      */
     Message: string;
 
     /**
      * Start time for download.
      */
     StartTime: string;
 
     /**
      * End Time for download.
      */
     EndTime: string;
 
     /**
      * Logs for download.
      */
     Logs: [];
}