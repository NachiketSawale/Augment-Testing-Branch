import {ILookupViewResult} from '@libs/ui/common';
import { ICharacteristicEntity } from '@libs/basics/interfaces';

export interface ICharacteristicCodeLookupViewResult<TItem> extends ILookupViewResult<TItem> {
	/**
	 *  multiple selection ids except First
	 */
	selectionExceptFirst: ICharacteristicEntity[];
	/**
	 * handle multiple selection function
	 * @param multipleSelections
	 */
	selectionExceptFirstHandle?: (multipleSelectionIds: ICharacteristicEntity[]) => void
}