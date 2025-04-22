/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { IModuleTabView } from '../tab/module-tab-view.interface';
import { IModuleTabViewConfig } from '../tab/module-tab-view-config.interface';
import { ILayoutExportItem } from '../layout-export-item.interface';
import { HttpResponse } from '@angular/common/http';

/**
 * Represents the proxy to the endpoint in the backend server.
 */
export interface ILayoutApi {
	/**
	 * Save the view.
	 * @param view The view to be saved.
	 * @param asRole Indicates whether the view save as role view.
	 */
	saveView: (view: IModuleTabView, asRole: boolean) => Observable<IModuleTabView>;

	/**
	 * Save view configs.
	 * @param configs The configs to be saved.
	 */
	saveConfig: (configs: IModuleTabViewConfig[]) => Observable<void>;

	/**
	 * Api for importing layouts
	 * @param tabId
	 * @param fileReaderData
	 */
	importLayouts: (tabId: number, fileReaderData: string | ArrayBuffer) => Observable<void>;

	/**
	 * Api for exporting layouts
	 * @param items
	 * @param tabId
	 */
	exportLayouts: (items: ILayoutExportItem[], tabId: number) => Observable<HttpResponse<object>>;

	/**
	 * Api for renaming layouts
	 * @param viewId
	 * @param newName
	 */
	renameView: (viewId: number, newName: string) => Observable<void>;

	/**
	 * Api for deleting layouts
	 * @param viewId
	 */
	deleteView: (viewId: number) => Observable<void>;

	/**
	 * Api for set default view
	 * @param viewId
	 */
	setViewAsDefault: (viewId: number) => Observable<boolean>;
}