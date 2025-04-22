/*
 * Copyright(c) RIB Software GmbH
 */

import Quill from 'quill';
import type Image from 'quill/formats/image';
const ImageBlot = Quill.import('formats/image') as typeof Image;

const ATTRIBUTES = ['alt', 'height', 'width', 'title'];

/**
 * Custom Image Bolt
 */
class CustomImage extends ImageBlot {
	/**
	 * Image Bolt Formats
	 *
	 * @param domNode Element
	 * @returns Record object
	 */
	public static override formats(domNode: Element): Record<string, string | null> {
		return ATTRIBUTES.reduce((formats: Record<string, string | null>, attribute) => {
			if (domNode.hasAttribute(attribute)) {
				formats[attribute] = domNode.getAttribute(attribute);
			}
			return formats;
		}, {});
	}

	/**
	 * To set the attribute on image bolt
	 *
	 * @param name attribute name
	 * @param value attribute value
	 */
	public override format(name: string, value: string) {
		if (ATTRIBUTES.indexOf(name) > -1) {
			if (value) {
				this.domNode.setAttribute(name, value);
			} else {
				this.domNode.removeAttribute(name);
			}
		} else {
			super.format(name, value);
		}
	}
}

export default CustomImage;
