/*
 * Copyright(c) RIB Software GmbH
 */

import { SafeHtml } from '@angular/platform-browser';
export interface IError {
	show: boolean;
	messageCol: number;
	message: SafeHtml;
	type: number;
	showReq: boolean;
}
