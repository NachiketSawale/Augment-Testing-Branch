/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareModifiedStateBase } from '../../classes/compare-modified-state-base.class';

export class CompareBoqModifiedState extends CompareModifiedStateBase {
	public boqModifiedData: object = {};

	public override clear() {
		super.clear();
		this.boqModifiedData = {};
	}
}