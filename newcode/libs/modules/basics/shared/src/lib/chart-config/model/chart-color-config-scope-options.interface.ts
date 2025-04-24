import {InjectionToken} from '@angular/core';
import {RgbColor} from '@libs/platform/common';

export const CHAT_COLOR_CONFIG_SCOPR_OPTION = new InjectionToken<IChatColorConfigScopeOptions>('CHAT_COLOR_CONFIG_SCOPR_OPTION');

export interface IChatColorConfigScopeOptions {
	maxValue?: RgbColor;
	minValue?: RgbColor;
	avgValue?: RgbColor;
	viewDatakey?: string;
}
