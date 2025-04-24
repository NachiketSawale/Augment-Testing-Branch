/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickEditor } from '../slick-grid/slick-editor.interface';
import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IBeforeCellEditorDestroyEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	editor: ISlickEditor;
}

