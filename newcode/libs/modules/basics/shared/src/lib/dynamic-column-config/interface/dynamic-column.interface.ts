/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef } from '@libs/ui/common';

export interface IBasicsSharedDynamicColumnService<T extends object>{

	/*
	 * initial data for dynamic column and entity value
	 */
	initialData(readData: object): void;

	/*
	 * generate columns
	 */
	generateColumns(): ColumnDef<T>[];

	/*
	* set relative dynamic value to lineItem entity
	*/
	appendValue2Entity(entities: T[]): void;

	/*
	 * generate dynamic value structure to Save/update/delete
	 */
	provideUpdateData(updateData: object): void;

	/*
	* clear updated/deleted data after saving change
	* */
	clearUpdatedData(): void;
}
