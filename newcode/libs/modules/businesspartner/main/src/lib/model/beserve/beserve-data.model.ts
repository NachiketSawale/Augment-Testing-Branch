import {InjectionToken} from '@angular/core';

export interface IBeserveData {
	crefoBaseUrl: string;
	appctxtoken: string;
}

export const BESERVE_DATA_TOKEN = new InjectionToken<IBeserveData>('beserve-data-token');
