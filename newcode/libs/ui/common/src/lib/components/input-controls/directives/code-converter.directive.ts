/*
 * $Id$
 * Copyright(c) RIB Software GmbH
*/

import { Directive, HostListener } from '@angular/core';
import * as _ from 'lodash';
import { IEvent } from '../model/interfaces/code-converter.interface';

/**
 * class implementing the code conversion from model to view and from view to model.
 */
@Directive({
	selector: '[uiCommonCodeConverter]'
})
export class UiCommonCodeConverterDirective {

  /**
   * This method is called to write to the model when there is change in the view value,
   * this function is automatically called when view value changes.
   *
   * @param {IEvent} $event
   */
  @HostListener('input', ['$event'])
	private onInput($event: IEvent): void {
		const viewValue: string = $event.target.value;
		if (viewValue) {
			if (_.isString(viewValue)) {
				let trans = viewValue.toUpperCase();
				if (trans !== viewValue) {
					trans = viewValue.toUpperCase();
				}
				$event.target.value = trans;
			} else {
				$event.target.value = viewValue;
			}

		} else {
			$event.target.value = '';
		}

	}
}
