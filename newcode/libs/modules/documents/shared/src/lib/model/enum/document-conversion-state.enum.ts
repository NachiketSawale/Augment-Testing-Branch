/*
 * Copyright(c) RIB Software GmbH
 */

export enum DocumentConversionState {
    Waiting = 0,
    Starting = 1,
    Converting = 2,
    Stopped = 3,
    Converted = 4,
    Failed = 5,
    Stopping = 6,
    History = 7,
    Aborted = 8
}