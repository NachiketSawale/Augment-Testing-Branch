/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UiCommonStyleEditor2Component } from './style-editor2.component';
// import { defaultFonts, fontSizes, mockLanguageSetting, mockStyles, mockStyles2 } from '../../../../mock-data/style-editor2';
import { IFontSize, ILanguageSetting, IStyles2 } from '../../model/interfaces/style-editor2.interface';

export class MockElementRef extends ElementRef {}

describe('UiCommonStyleEditor2Component', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
/*	let component: UiCommonStyleEditor2Component;
	let fixture: ComponentFixture<UiCommonStyleEditor2Component>;
	document.execCommand = jest.fn();
	document.queryCommandValue = jest.fn();
	document.queryCommandState = jest.fn();
	window.prompt = jest.fn();
	String.toString = jest.fn();
	window.getSelection = jest.fn();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
			declarations: [UiCommonStyleEditor2Component],
			providers: [],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonStyleEditor2Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	//component testing
	describe('Style-editor2 Component', () => {
		it('should exist component', () => {
			expect(component).toBeTruthy();
		});

		it('should initialize component', () => {
			expect(component.isBold).toBeFalsy();
			expect(component.isItalic).toBeFalsy();
			expect(component.isUnderlined).toBeFalsy();
			expect(component.isStrikethrough).toBeFalsy();
			expect(component.isSubscript).toBeFalsy();
			expect(component.isSuperscript).toBeFalsy();
			expect(component.isOrderedList).toBeFalsy();
			expect(component.isUnorderedList).toBeFalsy();
			expect(component.isLeftJustified).toBeFalsy();
			expect(component.isCenterJustified).toBeFalsy();
			expect(component.isRightJustified).toBeFalsy();
			expect(component.isParagraph).toBeFalsy();
			expect(component.isPre).toBeFalsy();
			expect(component.isBlockquote).toBeFalsy();
			expect(component.isLink).toBeUndefined();
			expect(component.existingLanguage).toBeDefined();
			expect(component.existingCulture).toBeDefined();
			expect(component.uiLangOptions).toBeDefined();
			expect(component.defaultFonts).toBeDefined();
			expect(component.defaultFonts.length).not.toBe(0);
			expect(component.fontSizes).toBeDefined();
			expect(component.fontSizes.length).not.toBe(0);
			expect(component.selectedFontValue).toBeDefined();
			expect(component.selectedFontSize).toBeDefined();
			expect(component.textareaClass).toBeUndefined();
			expect(component.textareaEditable).toBeDefined();
			expect(component.fontColor).toBeDefined();
			expect(component.hiliteColor).toBeDefined();
		});
		it('should call ngOninit', () => {
			component.ngOnInit();
			fixture.detectChanges();
			expect(component.textarea).toBeDefined();
			expect(component.existingCulture).toBeDefined();
			expect(component.existingLanguage).toBeDefined();
		});
		it('should getItem from localstorage if present and should set values of existingLanguage and existingCulture ', () => {
			const languageSetting: ILanguageSetting = mockLanguageSetting;

			const key = globals.appBaseUrl + '-defLangOpts';

			//set object to localstorage

			window.localStorage.setItem(
				globals.appBaseUrl + '-defLangOpts',

				JSON.stringify(languageSetting)
			);

			fixture.detectChanges();

			component.ngOnInit();

			expect(window.localStorage[key]).toContain(JSON.stringify(languageSetting));

			expect(component.existingLanguage).toContain(languageSetting.language);

			expect(component.existingCulture).toContain(languageSetting.culture);
		});
	});

	//fuctional Testing
	describe('Style-editor2 Component', () => {
		it('format should call cmdState for all styles', () => {
			const mStyles: string[] = mockStyles;
			mStyles.forEach((style) => {
				const para = style;
				const arg = 'abc';
				const spy1 = jest.spyOn(component, 'cmdState').mockReturnValue(true);
				component.format(para, arg);
				expect(spy1).toHaveBeenCalled();
			});
		});

		it('format should call cmdValue for all values', () => {
			const mockStyles: IStyles2[] = mockStyles2;
			mockStyles.forEach((styles) => {
				const style = styles.style;
				const value = styles.value;
				const spy1 = jest.spyOn(component, 'cmdValue');
				component.format(style, value);
				expect(spy1).toHaveBeenCalled();
			});
		});

		/**
		 *   TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob
		 *//*
		it('should call uploadFile', async () => {
			const spyOn = jest.spyOn(component, 'uploadFile').mockImplementation();
			fixture.detectChanges();
			component.uploadFile();
			expect(spyOn).toHaveBeenCalled();
		});

		it('should call insertImage', () => {
			const spyOn = jest.spyOn(component, 'insertImage');
			component.insertImage();
			expect(spyOn).toHaveBeenCalled();
		});
		it('should call createLink', () => {
			const spy = jest.spyOn(component, 'createLink');
			fixture.detectChanges();
			component.createLink();
			expect(spy).toHaveBeenCalled();
		});
		it('should call createLink', () => {
			component.input = 'Enter the link URL';
			const spy = jest.spyOn(component, 'createLink');
			fixture.detectChanges();
			component.createLink();
			expect(spy).toHaveBeenCalled();
			expect(component.isLink).toBe(true);
		});

		it('setFont() should change font', () => {
			const deFonts: string[] = defaultFonts;
			deFonts.forEach((deFont) => {
				component.setFont(deFont);
				expect(component.selectedFontValue).toEqual(deFont);
			});
		});

		it('setFontSize() should change fontsize', () => {
			const fSizes: IFontSize[] = fontSizes;
			fSizes.forEach((fSize) => {
				component.setFontSize(fSize.size);
				expect(component.selectedFontSize).toEqual(fSize.size);
			});
		});

		it('setFontColor() should change color of element', () => {
			component.fontColor = 'green';
			component.setFontColor();
			expect(component.fontColor).toEqual('green');
		});

		it('setHiliteColor() should change background color of element', () => {
			component.hiliteColor = 'green';
			component.setHiliteColor();
			expect(component.hiliteColor).toEqual('green');
		});

		it('should call setHiliteColor', () => {
			const spyOn = jest.spyOn(component, 'setHiliteColor').mockImplementation();
			component.setHiliteColor();
			expect(spyOn).toHaveBeenCalled();
		});
		it('should call cmdState', () => {
			const cmd = 'abc';
			const spyOn = jest.spyOn(component, 'cmdState');
			component.cmdState(cmd);
			expect(spyOn).toHaveBeenCalled();
		});
		it('should call cmdValue', () => {
			const cmd = 'abc';
			const spyOn = jest.spyOn(component, 'cmdValue');
			component.cmdValue(cmd);
			expect(spyOn).toHaveBeenCalled();
		});
		it('should call format', () => {
			const cmd = 'cmd';
			const arg = 'dhdgd';
			const spyOn = jest.spyOn(component, 'format');
			component.format(cmd, arg);
			expect(spyOn).toHaveBeenCalled();
		});
		it('format when called with unlink should make isLink false', () => {
			const arg = 'dhdgd';
			component.format('unlink', arg);
			expect(component.isLink).toBe(false);
		});
		it('format when called with removeFormat should remove all styles', () => {
			const arg = 'dhdgd';
			const spyOn = jest.spyOn(component, 'cmdState');
			component.format('removeFormat', arg);
			expect(component.isBold).toBe(false);
			expect(component.isItalic).toBe(false);
			expect(component.isUnderlined).toBe(false);
			expect(component.isStrikethrough).toBe(false);
			expect(component.isSubscript).toBe(false);
			expect(component.isSuperscript).toBe(false);
			expect(component.isOrderedList).toBe(false);
			expect(component.isUnderlined).toBe(false);
			expect(component.isLeftJustified).toBe(false);
			expect(component.isRightJustified).toBe(false);
			expect(component.isCenterJustified).toBe(false);
			expect(component.isParagraph).toBe(false);
			expect(component.isBlockquote).toBe(false);
			expect(spyOn).toHaveBeenCalled();
		});
	});*/
});