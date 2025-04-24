import { IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs';

/**
 * Interface for managing selection in entity data services
 * @typeParam T - entity type handled by the data service
 */
export interface IEntitySelection<T> {
	/**
	 * Gets the current selection set
	 * @return all selected elements, in case of none selected, an empty array
	 */
	getSelection(): T[]

	/**
	 * Get the current selected entity
	 * @return the selected entity null in case none selected
	 */
	getSelectedEntity(): T | null

	/**
	 * Checks if currenty at least one entity is selected
	 * @return true iff at least one element is selected
	 */
	hasSelection(): boolean

	/**
	 * Selects the passed entities.
	 * @param toSelect
	 */
	select(toSelect: T[] | T | null): Promise<T | null>

	/**
	 * Selects entities matching the passed ids.
	 * @param toSelect identifier (array) for the elements to select
	 */
   selectById(toSelect: IIdentificationData[] | IIdentificationData | null): Promise<T | null>

	/**
	 * Deselects all currently selected entities
	 */
	deselect(): void

	/**
	 * Selects the next element. In case none is selected, the first entity is selected
	 * @return The selected element, null in case, no selection was possible
	 */
   selectNext(): Promise<T | null>

	/**
	 * Selects the previous element. In case none is selected, the last entity is selected
	 * @return The selected element, null in case, no selection was possible
	 */
   selectPrevious(): Promise<T | null>

	/**
	 * Selects the first element
	 * @return The selected element, null in case, no selection was possible
	 */
   selectFirst(): Promise<T | null>

	/**
	 * Selects the last element
	 * @return The selected element, null in case, no selection was possible
	 */
   selectLast(): Promise<T | null>

	/**
	 * selectionChanged$ observable
	 */
	 get selectionChanged$(): Observable<T[]>;

	 /**
		* Returns selected ids in the format of identification data.
		*/
	getSelectedIds(): IIdentificationData[];
}
