/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IFontSize {
	value: string;
	size: string;
}
export interface IStyles2 {
	style: string;
	value: string;
}

export interface ILanguageSetting {
	test: string;
	language: string;
	culture: string;
}

export interface IUiLangOption {
	selectedId: ISelectedId;
}

export interface ISelectedId {
	languageName: string;
}

export interface IStyleEditor2Component {
	existingLanguage: number | string;
	existingCulture: string;
	uiLangOptions: IUiLangOption;
	defaultFonts: string[];
	fontSizes: IFontSize[];
	textarea: HTMLElement | null;
	isLink: boolean;
	textareaClass: string;
	value: string;
	textareaEditable: boolean;
	fontColor: string;
	hiliteColor: string;
	font: string | string[];
	format(cmd: string, ...args: string[]): void;
	cmdState(cmd: string): boolean;
	cmdValue(cmd: string): string;
	createLink(): void;
	uploadFile(): void;
	insertImage(): void;
	setFont(value: string): void;
	setFontSize(value: string): void;
	setFontColor(): void;
	setHiliteColor(): void;
}
