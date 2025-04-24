/*
 * Copyright(c) RIB Software GmbH
 */

import { MailActionEditorParams } from '../enum/actions/mail-action-editor-params.enum';
import { SqlActionEditorParams } from '../enum/actions/sql-action-editor-params.enum';

export type AllActionParams = MailActionEditorParams | SqlActionEditorParams;