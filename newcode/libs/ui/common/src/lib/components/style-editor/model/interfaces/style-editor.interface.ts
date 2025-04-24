/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IFontSize {
  value: string;
  size: string;
}

export interface IUiLangOption {
  selectedId: {
    languageName: string;
  };
}

export interface IMockstyle {
  property: string;
  value: string;
}

export interface IMockLanguageSettingFormat {
  test: string;
  language: string;
  culture: string;
}

export interface IStyleEditor {
  textareaClass: string;
  sampleText: string;
  boldTitle: string;
  italicTitle: string;
  underlinedTitle: string;
  strikeThroughTitle: string;
  fontTitle: string;
  fontSizeTitle: string;
  fontColorTitle: string;
  highlightColorTitle: string;
  removeFormattingTitle: string;
  boldIcon: string;
  italicIcon: string;
  underlineIcon: string;
  strikeThroughIcon: string;
  removeSettingsIcon: string;
  existingLanguage: number | string;
  existingCulture: string;
  uiLangOptions: IUiLangOption;
  enableBootstrapTitle: string;
  fontColor: string | number;
  hiliteColor: string;
  fonts: Array<string>;
  selectedFontValue: string;
  fontSizes: Array<IFontSize>;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  isStrikethrough: boolean;

  toggleStyle(property: unknown, value: string): void;

  getSpanElement(): HTMLElement;

  setCssString(): string;

  format(cmd: string, arg: string, event: unknown): void;

  setFont(value: string): void;

  setFontSize(value: string): void;

  setFontColor(value: string | null): void;

  setHiliteColor(value: string | null): void;

  removeAllStyles(...args: Array<string>): void;

  initStyle(): void;
}
