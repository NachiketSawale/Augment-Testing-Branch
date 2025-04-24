/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import type { Parchment as TypeParchment } from 'quill';

import { TableRow } from './table-row';

/**
 * Container Bolt
 */
const Container = Quill.import('blots/container') as typeof TypeParchment.ContainerBlot;

/**
 * Genrate text editor Table Body Bolt
 */
export class TableBody extends Container {
	/**
	 * Bolt Name
	 */
	public static override blotName = 'table-body';

	/**
	 * Tag Name
	 */
	public static override tagName = 'TBODY';

	/**
	 * Childer list of Table Body
	 */
	public declare children: TypeParchment.LinkedList<TableRow>;
}
