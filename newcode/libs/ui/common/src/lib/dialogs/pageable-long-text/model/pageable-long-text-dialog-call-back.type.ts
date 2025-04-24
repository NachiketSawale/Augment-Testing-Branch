/*
 * Copyright(c) RIB Software GmbH
 */

import { IPageableLongTextDialogData } from './interfaces/pageable-long-text-dialog-data.interface';

/**
 * Call back to retrieve the text for the index page.
 */
export type PageableLongTextDialogCallback = (pageIndex: number, determineTotalPageCount: boolean) => Promise<IPageableLongTextDialogData>;
