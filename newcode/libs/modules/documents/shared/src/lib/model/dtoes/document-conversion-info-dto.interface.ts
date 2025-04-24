/*
 * Copyright(c) RIB Software GmbH
 */

import {DocumentConversionState} from '../enum/document-conversion-state.enum';

export interface IDocumentConversionInfoDto {
    ModelFk?: number;
    JobState?: DocumentConversionState;
    LoggingMessage?: string;
}