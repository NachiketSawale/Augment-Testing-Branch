/*
 * Copyright(c) RIB Software GmbH
 */

import BlotFormatter from '../BlotFormatter';

/**
 * Action Class
 */
export default abstract class Action {
	/**
	 * BlotFormatter
	 */
	public formatter: BlotFormatter;

	public constructor(formatter: BlotFormatter) {
		this.formatter = formatter;
	}

	/**
	 * on Create Action
	 */
	public abstract onCreate(): void;

	/**
	 * on Destroy Action
	 */
	public abstract onDestroy(): void;
}
