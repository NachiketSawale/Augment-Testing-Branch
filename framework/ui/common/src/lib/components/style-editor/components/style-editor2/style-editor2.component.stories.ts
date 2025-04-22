/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonStyleEditor2Component } from './style-editor2.component';

export default {
	title: 'Style-Editor/UiCommonStyleEditor2Component',
	component: UiCommonStyleEditor2Component,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonStyleEditor2Component>;

const Template: Story<UiCommonStyleEditor2Component> = (args: UiCommonStyleEditor2Component) => ({
	component: UiCommonStyleEditor2Component,
	props: args,
});

export const WithIconTitles = Template.bind({});
WithIconTitles.args = {
	boldTitle: 'Bold',
	italicTitle: 'Italic',
	underLineTitle: 'Underline',
	strikeThroughTitle: 'Strikethrough',
	subscriptTitle: 'Subscript',
	superScriptTitle: 'Superscript',
	fontTitle: 'Fonts',
	fontSizeTitle: 'Font size',
	fontColorTitle: 'Font color',
	highlightColorTitle: 'Highlight Color',
	removeSettingTitle: 'Remove settings',
	orderedListTitle: 'Ordered List',
	unorderedListTitle: 'Unordered List',
	outdentTitle: 'Outdent',
	indentTitle: 'Indent',
	leftJustifyTitle: 'Left Justify',
	rightJustifyTitle: 'Right Justify',
	centerJustifyTitle: 'Center Justify',
	codeTitle: 'Code',
	quoteTitle: 'Quote',
	paragraphTitle: 'Paragraph',
	linkTitle: 'Link',
	unlinkTitle: 'Unlink',
	insertImageTitle: 'Insert Image',
};

export const WithFontsAndFontSizes = Template.bind({});
WithFontsAndFontSizes.args = {
	defaultFonts: ['Georgia', 'Palatino Linotype'],
	fontSizes: [
		{
			value: '1',
			size: '10px',
		},
		{
			value: '2',
			size: '13px',
		},
	],
};

export const WithToolbarItemIcons = Template.bind({});
WithToolbarItemIcons.args = {
	boldIcon: 'fa fa-bold',
	italicIcon: 'fa fa-italic',
	underlineIcon: 'fa fa-underline',
	strikeThroughIcon: 'fa fa-strikethrough',
	subscriptIcon: 'fa fa-subscript',
	superscriptIcon: 'fa fa-superscript',
	removeSettingsIcon: 'fa fa-eraser',
	orderedListIcon: 'fa fa-list-ol',
	unOrderedListIcon: 'fa fa-list-ul',
	outdentIcon: 'fa fa-outdent',
	indentIcon: 'fa fa-indent',
	leftJustifyIcon: 'fa fa-align-left',
	centerJustifyIcon: 'fa fa-align-center',
	rightJustifyIcon: 'fa fa-align-right',
	codeIcon: 'fa fa-code"',
	quoteIcon: 'fa fa-quote-right',
	linkIcon: 'fa fa-link',
	unlinkIcon: 'fa fa-unlink',
	insertImageIcon: 'fa fa-picture-o',
};
