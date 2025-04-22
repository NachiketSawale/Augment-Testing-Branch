/*
 * Copyright(c) RIB Software GmbH
 */

import { ILanguageOptions } from './language-options.interface';
import { IVariableOptions } from './variable-options.interface';

/**
 * editor options for language and variable item.
 */
export interface IEditorOptions {
    /**
     * langugae button dropdown  options
     */
    language: ILanguageOptions;

    /**
     * variable button dropdown options
     */
    variable: IVariableOptions
}