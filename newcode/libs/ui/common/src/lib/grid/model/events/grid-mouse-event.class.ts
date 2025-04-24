/**
 * Grid click event
 */
export class MouseEvent<T extends object> {

	/**
	 * Constructor
	 */
	public constructor(public originalEvent: Event, public row: number, public cell: number, public item: T) {
	}
}