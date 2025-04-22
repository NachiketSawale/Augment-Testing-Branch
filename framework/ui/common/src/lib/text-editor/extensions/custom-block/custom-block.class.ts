/*
 * Copyright(c) RIB Software GmbH
 */
import Quill from 'quill';
import type TypeBlock from 'quill/blots/block';
import { Root } from 'parchment';
import { ITextEditorSettings } from '../../model/interfaces/text-editor-settings.interface';

/**
 * Quill Block
 */
const Block = Quill.import('blots/block') as typeof TypeBlock;

/**
 * to create the custom block
 *
 * @param uuid quill editor id
 * @param _backspace is back space
 * @param customSettings customseetings object
 */
export function createCustomBlock(uuid: string, _backspace: boolean, customSettings: ITextEditorSettings) {
	/**
	 * Genrate text editor Custom Block
	 */
	class CustomBlock extends Block {
		public constructor(scroll: Root, domNode: Node) {
			super(scroll, domNode);
			const fontSize = _backspace ? this.getCurrentFontValue('ql-size') : customSettings.system.defaultFontSize + 'pt';
			const font = _backspace ? this.getCurrentFontValue('ql-font') : customSettings.system.defaultFont;
			const size = (domNode as HTMLElement).style.fontSize ? (domNode as HTMLElement).style.fontSize : fontSize;
			this.format('size', size ?? '0px');
			const fonttxt = (domNode as HTMLElement).style.fontFamily ? (domNode as HTMLElement).style.fontFamily : font;
			this.format('font', fonttxt ?? '');
			_backspace = false;
		}

		/**
		 * Formats the elements
		 *
		 * @param domNode Node of element
		 * @returns get the font and size attribute value
		 */
		public static override formats(domNode: Node) {
			return ['font', 'size'].reduce((formats: Record<string, string | null>, attribute) => {
				if (attribute === 'font') {
					formats[attribute] = (domNode as HTMLElement).style.fontFamily ? (domNode as HTMLElement).style.fontFamily : customSettings.system.defaultFont;
				} else if (attribute === 'size') {
					formats[attribute] = (domNode as HTMLElement).style.fontSize ? (domNode as HTMLElement).style.fontSize : customSettings.system.defaultFontSize + 'pt';
				}

				return formats;
			}, {});
		}

		/**
		 * the format the element like set the attribute value
		 * @param name string
		 * @param value value
		 */
		public override format(name: string, value: string) {
			if (name === 'size' && value) {
				this.domNode.style.fontSize = value;
			} else if (name === 'font' && value) {
				this.domNode.style.fontFamily = value;
			} else {
				super.format(name, value);
			}
		}

		/**
		 * find the attribute value element from editor section
		 *
		 * @param type type of class element
		 * @returns attibute value
		 */
		public getCurrentFontValue(type: string): string | null {
			const element = document.querySelector(`#${uuid} span.${type} .ql-picker-label`);
			return element ? element.getAttribute('data-value') : null;
		  }
	}
	Quill.register(CustomBlock, true);
}
