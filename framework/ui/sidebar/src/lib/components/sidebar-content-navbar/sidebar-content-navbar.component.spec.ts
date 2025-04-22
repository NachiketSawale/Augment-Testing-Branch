import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UiSidebarContentNavbarComponent } from './sidebar-content-navbar.component';


describe('UiSidebarContentNavbarComponent', () => {
	let component: UiSidebarContentNavbarComponent;
	let fixture: ComponentFixture<UiSidebarContentNavbarComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UiSidebarContentNavbarComponent],
			imports:[HttpClientModule]
		});
		fixture = TestBed.createComponent(UiSidebarContentNavbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
