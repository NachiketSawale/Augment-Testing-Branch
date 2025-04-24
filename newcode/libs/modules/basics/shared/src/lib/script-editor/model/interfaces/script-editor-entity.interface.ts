/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * script editor entity
 */
export interface IScriptEditorEntity extends IEntityBase {
    Id: number;
    ScriptData: string,
    ValidateScriptData: string;
}