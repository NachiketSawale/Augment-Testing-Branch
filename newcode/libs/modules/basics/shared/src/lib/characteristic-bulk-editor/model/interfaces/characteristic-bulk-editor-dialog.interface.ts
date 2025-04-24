/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { ICharacteristicBulkEditorOptions } from './characteristic-bulk-editor-options.interface';

export const CHARACTERISTIC_BULK_EDITOR_DIALOG_OPTIONS_TOKEN = new InjectionToken<ICharacteristicBulkEditorOptions>('characteristic-bulk-editor-dialog-options-token');
