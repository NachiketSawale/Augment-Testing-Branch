/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPopupConfig } from '../model/interfaces/popup-options.interface';

@Injectable({ providedIn: 'root' })
export class PopupConfigService implements IPopupConfig {
	public level = 0;
	public plainMode = false;
	public multiPopup = false;
	public showLastSize = false;
	public hasDefaultWidth = false;
	public alignment = 'vertical';
	public showHeader = false;
	public showFooter = false;
}