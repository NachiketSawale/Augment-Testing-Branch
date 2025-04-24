import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstimateConfigDialogComponent } from './estimate-config-dialog.component';

describe('EstimateConfigDialogComponent', () => {
	let component: EstimateConfigDialogComponent;
	let fixture: ComponentFixture<EstimateConfigDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EstimateConfigDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(EstimateConfigDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
