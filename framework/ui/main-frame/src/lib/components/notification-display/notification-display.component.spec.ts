import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMainFrameNotificationDisplayComponent } from './notification-display.component';

describe('UiMainFrameNotificationDisplayComponent', () => {
	let component: UiMainFrameNotificationDisplayComponent;
	let fixture: ComponentFixture<UiMainFrameNotificationDisplayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiMainFrameNotificationDisplayComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiMainFrameNotificationDisplayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
