/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { IData, ITplServiceInterface } from '../model/interfaces/tpl.interface';
@Injectable({
	providedIn: 'root',
})
export class TplService implements ITplServiceInterface {
	public parse(tpl: string, data: IData): string {
		const regExp = /<%(.+?)%>/g;
		let match;
		while ((match = regExp.exec(tpl)) !== null) {
			tpl = tpl.replace(match[0], data[match[1]]);
			regExp.lastIndex = 0;
		}
		return tpl;
	}
}
