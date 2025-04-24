/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { IScriptEditorEntity } from './script-editor-entity.interface';
import { ScriptDefProvider } from '@libs/ui/common';

/**
 * Script Editor Option
 */
export interface IScriptEditorEntityOption {

    ScriptProvider: ScriptDefProvider;

    // create main entity, default new script
    isNewDefaultScript?: () => boolean;
    newDefaultScript?: string;

    lockMessage?: Translatable;

    isReadonly?: () => boolean;

    scriptField: string;

    getUrl?: string | ((item: object) => string);

    mainItemIdField?: string;

    mainItemIdKeyName: string;

    setItemAsModified?: (item: IScriptEditorEntity) => void;

    getPostRequestBody?: (item: object, mainItemIdField: string) => object;
}