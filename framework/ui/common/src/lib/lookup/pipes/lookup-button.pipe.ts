import { Pipe, PipeTransform } from '@angular/core';
import { IUiCommonLookupBtn } from '../model/interfaces/lookup-btn.interface';

@Pipe({
	name: 'uiCommonLookupButtonPipe'
})
export class UiCommonLookupButtonPipe<TItem extends object, TEntity extends object> implements PipeTransform {

	public transform(value: IUiCommonLookupBtn<TItem, TEntity>[], readonly?: boolean): IUiCommonLookupBtn<TItem, TEntity>[] {
		return value.filter(i => i.shownOnReadonly || !readonly);
	}

}
