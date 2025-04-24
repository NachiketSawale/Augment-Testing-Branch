/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uiCommonLookupNullable'
})
export class uiCommonLookupNullablePipe implements PipeTransform {

	public transform(value: unknown, defaultValue: unknown): unknown {
		if (_.isNil(value)) {
			return defaultValue;
		}

		return value;
	}
}
