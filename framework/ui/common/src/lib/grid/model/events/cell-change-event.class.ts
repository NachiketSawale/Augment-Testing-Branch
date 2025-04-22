import { ColumnDef } from '../column-def.type';

/**
 * Cell change event type
 */
export class CellChangeEvent<T extends object> {

	/**
	 * Constructor
	 */
	public constructor(public row: number, public cell: number, public column: ColumnDef<T>, public item: T ) {
	}
}