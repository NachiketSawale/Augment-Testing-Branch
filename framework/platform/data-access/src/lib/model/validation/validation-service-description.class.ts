/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export class TimeSpanProperty<T extends object> {
	public From!: keyof T;
	public To!: keyof T;
}

export class ValidationServiceDescription<T extends object> {

	public constructor(public Mandatories: (keyof T)[], public Uniques: (keyof T)[], public TimeSpans: TimeSpanProperty<T>[]) {
	}
}