/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export class ResizeEvent {
	public constructor(public originalEvent: MouseEvent, public width: number, public height: number) {
	}
}