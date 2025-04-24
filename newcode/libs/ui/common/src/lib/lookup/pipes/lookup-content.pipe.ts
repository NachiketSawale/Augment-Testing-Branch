/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Pipe, PipeTransform } from '@angular/core';
import { ILookupContext } from '../model/interfaces/lookup-context.interface';
import { LookupFormatterService } from '../services/lookup-formatter.service';

/**
 * The lookup display content pipe
 */
@Pipe({
	name: 'uiCommonLookupContent'
})
export class UiCommonLookupContentPipe<TItem extends object, TEntity extends object> implements PipeTransform {
	private readonly formatter = inject(LookupFormatterService);

	/**
	 * Transform data to html content.
	 * @param dataItem
	 * @param context
	 */
	public transform(dataItem: TItem | null | undefined, context: ILookupContext<TItem, TEntity>) {
		if(dataItem) {
			return this.formatter.getFormattedText(dataItem, context);
		}
		return this.formatter.getPlaceholder(context.lookupConfig);
	}
}
