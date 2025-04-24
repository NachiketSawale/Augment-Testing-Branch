import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UiSidebarSimpleSearchComponent } from './simple-search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('UiSidebarSimpleSearchComponent', () => {
	let component: UiSidebarSimpleSearchComponent;
	let fixture: ComponentFixture<UiSidebarSimpleSearchComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarSimpleSearchComponent],
			imports:[HttpClientModule]
		}).compileComponents();

		fixture = TestBed.createComponent(UiSidebarSimpleSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
