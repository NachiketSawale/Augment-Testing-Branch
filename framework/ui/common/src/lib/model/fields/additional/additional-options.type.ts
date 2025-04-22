/*
 * Copyright(c) RIB Software GmbH
 */

import { IAdditionalStringOptions } from './additional-string-options.interface';
import { IAdditionalNumericOptions } from './additional-numeric-options.interface';
import { IAdditionalCustomComponentOptions } from './additional-custom-component-options.interface';
import { IAdditionalSelectOptions } from './additional-select-options.interface';
import { IAdditionalFileSelectOptions } from './additional-file-select-options.interface';
import { IAdditionalScriptOptions } from './additional-script-options.interface';
import { IAdditionalGridOptions } from './additional-grid-options.interface';
import { IAdditionalActionOptions } from './additional-action-options.interface';

/**
 * An alias for available additional options.
 */
export type AdditionalOptions<T extends object> =
    IAdditionalStringOptions |
    IAdditionalNumericOptions |
    IAdditionalCustomComponentOptions |
    IAdditionalSelectOptions |
    IAdditionalFileSelectOptions |
    IAdditionalScriptOptions |
    IAdditionalGridOptions |
	 IAdditionalActionOptions<T>;