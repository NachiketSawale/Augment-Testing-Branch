/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export class OverviewInfo {
	public Id: number | undefined;
	public Title: string | undefined;
	public Count: number | undefined;
	public Uuid: string | undefined;
	public ChildItem: OverviewInfo[];

	public constructor() {
		this.ChildItem = [];
	}
}
