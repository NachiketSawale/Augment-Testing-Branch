import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedStatusChangeHistoryComponent } from './status-change-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { IStatusChangeOptions } from '../../model/interfaces/status-change-options.interface';
import { GridComponent } from '@libs/ui/common';

describe('StatusChangeHistoryComponent', () => {
	let component: BasicsSharedStatusChangeHistoryComponent;
	let fixture: ComponentFixture<BasicsSharedStatusChangeHistoryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BasicsSharedStatusChangeHistoryComponent],
			imports: [HttpClientTestingModule, MatDialogModule, GridComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BasicsSharedStatusChangeHistoryComponent);
		component = fixture.componentInstance;
		component.conf = {
			title: 'test',
			statusName: 'test',
			statusField: 'test',
			checkAccessRight: true,
		} as IStatusChangeOptions<object, object>;
		component.entityId = { id: 0 };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
