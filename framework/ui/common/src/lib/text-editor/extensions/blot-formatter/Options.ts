/*
 * Copyright(c) RIB Software GmbH
 */

import { ITextEditorSettings } from '../../model/interfaces/text-editor-settings.interface';
import { TextEditorSettingsService } from '../../services/text-editor-settings.service';
import BlotSpec from './specs/BlotSpec';
import ImageSpec from './specs/ImageSpec';

/**
 * type of Constructor
 */
type Constructor<T> = new (...args: unknown[]) => T;

/**
 * Overlay Options Properties
 */
export type OverlayOptions = {
	/**
	 * classname applied to the overlay element
	 */
	className: string;

	/**
	 * style applied to overlay element, or null to prevent styles
	 */
	style?: { [key: string]: unknown } | null | undefined;

	/**
	 * style applied to overlay size info element, or null to prevent styles
	 */
	sizeInfoStyle?: { [key: string]: unknown } | null | undefined;

	/**
	 * String literal labels rendered in the user interface - legacy use only
	 */

	labels?: { [key: string]: unknown } | null | undefined;
};

/**
 * Resize Options Properties
 */
export type ResizeOptions = {
	/**
	 * allow blot resizing - all other options except allowResizeModeChange irrelevent if false
	 */
	allowResizing: boolean;

	/**
	 * show % button to allow change between absolute and relative
	 * when aligning, and blot has a width attribute, allowResizeModeChange=false will set width according to useRelativeSize
	 */
	allowResizeModeChange: boolean;

	/**
	 * prevent images being resized larger than their natural size
	 */
	imageOversizeProtection: boolean;

	/**
	 * class name applied to the resize handles
	 */
	handleClassName: string;

	/**
	 * style applied to resize handles, or null to prevent styles
	 */
	handleStyle?: { [key: string]: unknown } | null | undefined;

	/**
	 * width is set as % rather than px (% of quill root width minus padding)
	 * if allowResizeModeChange=false, unknown resized blot will use this
	 * if allowResizeModeChange=true, only previously unsized blots will use this
	 */
	useRelativeSize: boolean;

	/**
	 * minimum width a blot can be resized to (px)
	 */
	minimumWidthPx: number;
};

/**
 * Delete Option
 */
export type DeleteOptions = {
	/**
	 * allow deleting blot with delete/backspace while overlay active
	 */
	allowKeyboardDelete: boolean;
};

/**
 * Image Options
 */
export type ImageOptions = {
	/**
	 * show T button for image alt/title editing
	 */

	allowAltTitleEdit: boolean;

	/**
	 * Register custom Quill Blot for image with suport for title attribute
	 */
	registerImageTitleBlot: boolean;

	/**
	 * Register ArrowRight keyboard binding to handle moving cursor past formatted image
	 */
	registerArrowRightFix: boolean;

	/**
	 * enable compressor action for embedded images
	 */
	allowCompressor: boolean;
};

/**
 * Options
 */
export type Options = {
	/**
	 * the BlotSpecs supported
	 */
	specs: Array<Constructor<BlotSpec>>;

	/**
	 * Overlay Option
	 */
	overlay: OverlayOptions;
	/**
	 * resize option
	 */
	resize: ResizeOptions;

	/**
	 * Delete Option
	 */
	delete: DeleteOptions;

	/**
	 * Image option
	 */
	image: ImageOptions;

	/**
	 * custom settings
	 */
	customSettings?: ITextEditorSettings;

	/**
	 * text editor settings services
	 */
	textEditorSettingsService?: TextEditorSettingsService;
};

/**
 * Default Options
 */
const DefaultOptions: Options = {
	specs: [ImageSpec as Constructor<BlotSpec>],
	overlay: {
		className: 'blot-formatter__overlay',
		style: {
			position: 'absolute',
			boxSizing: 'border-box',
			border: '1px dashed #444',

			maxWidth: '100%',
		},
		sizeInfoStyle: {
			position: 'absolute',
			color: 'rgba(255, 255, 255, 0.7)',
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			padding: '1em',
			textWrap: 'nowrap',
			fontSize: '1rem',
			opacity: 0,
			lineHeight: 1.2,
			display: 'none',
		},
	},
	resize: {
		allowResizing: true,
		allowResizeModeChange: false,
		imageOversizeProtection: false,
		handleClassName: 'blot-formatter__resize-handle',
		handleStyle: {
			position: 'absolute',
			height: '12px',
			width: '12px',
			backgroundColor: 'white',
			border: '1px solid #777',
			boxSizing: 'border-box',
			opacity: '0.80',
		},
		useRelativeSize: false,
		minimumWidthPx: 25,
	},
	delete: {
		allowKeyboardDelete: true,
	},
	image: {
		allowAltTitleEdit: false,
		registerImageTitleBlot: false,
		registerArrowRightFix: false,
		allowCompressor: false,
	},
};

export default DefaultOptions;
