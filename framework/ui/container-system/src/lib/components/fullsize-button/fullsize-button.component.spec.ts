/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UiContainerSystemFullsizeButtonComponent } from './fullsize-button.component';

describe('UiContainerSystemFullsizeButtonComponent', () => {
	let component: UiContainerSystemFullsizeButtonComponent;
	let fixture: ComponentFixture<UiContainerSystemFullsizeButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [UiContainerSystemFullsizeButtonComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiContainerSystemFullsizeButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should execute function on click', () => {
		const onClickSpy = jest.spyOn(component, 'toggleFullScreen');
		const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
		buttonElement.click();
		expect(onClickSpy).toHaveBeenCalled();
	});
});
