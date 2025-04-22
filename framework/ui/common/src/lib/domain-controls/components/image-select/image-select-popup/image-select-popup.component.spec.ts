/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageSelectPopupComponent } from './image-select-popup.component';

import { ImageSelectComponent } from '../image-select.component';
import { ControlContextInjectionToken } from '../../../model/control-context.interface';
import { UiCommonPopupComponent, UiCommonPopupContainerComponent } from '../../../../popup';
import { UiCommonPopupResizableDirective } from '../../../../popup/directives/popup-resizable.directive';
import { IImageSelectControlContext } from '../../../model/image-select-control-context.interface';
import { IFixedSelectOptions } from '../../../../model/fields/additional/fixed-select-options.interface';
import { IImageSelectItem } from '../../../model/image-select-item.interface';

describe('ImageSelectPopupComponent', () => {
	let component: ImageSelectComponent;
	let fixture: ComponentFixture<ImageSelectComponent>;
	const mockdata: IImageSelectItem[] = [
		{
			id: 1,
			displayName: 'Cross',
			iconCSS: 'status-icons ico-status01',
			isSelected: false,
		},
		{
			id: 2,
			displayName: 'Hook',
			iconCSS: 'status-icons ico-status02',
			isSelected: false,
		},
		{
			id: 3,
			displayName: 'Minus',
			iconCSS: 'status-icons ico-status03',
			isSelected: false,
		},
	];
	const ctlCtx: IImageSelectControlContext = {
		fieldId: 'IsActive',
		readonly: false,
		validationResults: [],
		entityContext: {entity: {}, indexInSet: 0, totalCount: 0},
		itemsSource: {items: mockdata} as IFixedSelectOptions
	};
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UiCommonPopupResizableDirective, UiCommonPopupComponent, UiCommonPopupContainerComponent, ImageSelectPopupComponent, ImageSelectComponent],
			providers: [{provide: ControlContextInjectionToken, useValue: ctlCtx}],
		});
		fixture = TestBed.createComponent(ImageSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('initiate popup', () => {
		component.onButtonClick();
		fixture.detectChanges();
	});

	it('hover on popup element', () => {
		const hoverEvent = new Event('mouseenter', {});
		component.onButtonClick();
		fixture.detectChanges();
		const list = fixture.nativeElement.getElementsByClassName('select-popup')[0].getElementsByTagName('li')[2];
		list.dispatchEvent(hoverEvent);
		fixture.detectChanges();
	});

	it('click on popup element', () => {
		const clickEvent = new Event('click', {});
		component.onButtonClick();
		fixture.detectChanges();
		const list = fixture.nativeElement.getElementsByClassName('select-popup')[0].getElementsByTagName('li')[2];
		const btn = list.getElementsByTagName('button')[0];
		btn.dispatchEvent(clickEvent);
		fixture.detectChanges();
	});
});
