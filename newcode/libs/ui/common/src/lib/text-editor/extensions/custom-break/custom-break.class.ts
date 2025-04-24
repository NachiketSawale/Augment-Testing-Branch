/*
 * Copyright(c) RIB Software GmbH
 */
import Quill from 'quill';
import type Breaks from 'quill/blots/break';

const Break = Quill.import('blots/break') as typeof Breaks;

/**
 * CustomBreak to extend the exist Break functionality in quill
 */
export class CustomBreak extends Break {
	/**
	 * boltName
	 */
	public blotName = 'break';
	/**
	 * ClassName
	 */
	public className = 'break';
	/**
	 * Tag Name
	 */
	public tagName = 'BR';

	/**
	 * get the length
	 * @returns length
	 */
	public override length() {
		return 1;
	}

	/**
	 * get the value
	 * @returns value
	 */
	public override value() {
		return '\n';
	}
}
