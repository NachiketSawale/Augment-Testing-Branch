import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityserverFailedComponent } from './identityserver-failed.component';

describe('IdentityserverFailedComponent', () => {
	let component: IdentityserverFailedComponent;
	let fixture: ComponentFixture<IdentityserverFailedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ IdentityserverFailedComponent ]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IdentityserverFailedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
