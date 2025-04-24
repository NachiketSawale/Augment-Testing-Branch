/*
 * Copyright(c) RIB Software GmbH
 */
import { Root, InlineBlot } from 'parchment';
import Quill from 'quill';
import Inline from 'quill/blots/inline';

const InlineBlock = Quill.import('blots/inline') as typeof Inline;

/**
 * Custom Attribute to extend the Inline Block functionality
 */
export class CustomAttributes extends InlineBlock {
	/**
	 * Bolt Name
	 */
	public blotName = 'customAttributes';
	/**
	 * Tag Name
	 */
	public tagName = 'FONT';

	public constructor(scroll: Root, domNode: HTMLElement) {
		super(scroll, domNode);

		// Replace the current node with a new span
		const span = this.replaceWith(new Inline(scroll, Inline.create())) as InlineBlot;

		Array.from(domNode.attributes).forEach((attr: Attr) => {
			if (attr.name !== 'style') {
				const value = attr.value;
				let name = attr.name;
				if (name === 'face') {
					name = 'font-family';
					span.domNode.style.fontFamily = value;
				} else if (name === 'size') {
					name = 'font-size';
				}
				span.format(name, value);
			}
		});
		if (domNode.parentElement?.childElementCount === 1) {
			domNode.parentElement.style.color = span.domNode.style.color;
			domNode.parentElement.style.fontFamily = span.domNode.style.fontFamily;
			domNode.parentElement.style.fontSize = span.domNode.style.fontSize;
		}

		this.remove();
	}
}
