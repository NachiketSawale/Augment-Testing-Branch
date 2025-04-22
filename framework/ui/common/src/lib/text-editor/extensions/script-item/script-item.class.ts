/*
 * Copyright(c) RIB Software GmbH
 */
import { Root } from 'parchment';
import Quill from 'quill';
import type Script from 'quill/formats/script';

const ScriptItem = Quill.import('formats/script') as typeof Script;

/**
 * scripts to set the style on delta in  editor section
 */
export class scripts extends ScriptItem {
	public constructor(scroll: Root, domNode: Node) {
		super(scroll, domNode);
		this.domNode.style.lineHeight = '100%';
	}
}
