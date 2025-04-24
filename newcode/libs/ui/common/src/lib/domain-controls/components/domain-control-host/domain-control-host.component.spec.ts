import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomainControlHostComponent } from './domain-control-host.component';
import { PropertyType } from '@libs/platform/common';

describe('DomainControlHostComponent', () => {
	let component: DomainControlHostComponent<PropertyType>;
	let fixture: ComponentFixture<DomainControlHostComponent<PropertyType>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DomainControlHostComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DomainControlHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
