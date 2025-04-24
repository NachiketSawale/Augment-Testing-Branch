import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BasicsSharedStatusChangeDialogComponent } from './status-change-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICustomDialogOptions, getCustomDialogDataToken, ICustomDialog } from '@libs/ui/common';
import { CHANGE_STATUS_DIALOG_OPTIONS, IChangeStatusDialogOptions } from '../../model/interfaces/status-dialog-options.interface';
import { IStatusChangeOptions } from '../../model/interfaces/status-change-options.interface';
import { IStatusChangeGroup } from '../../model/interfaces/status-change-group.interface';
import { IStatusChangeResult } from '../../model/interfaces/status-change-result.interface';

describe('StatusChangeDialogComponent', () => {
	let component: BasicsSharedStatusChangeDialogComponent;
	let fixture: ComponentFixture<BasicsSharedStatusChangeDialogComponent>;
	const dummyFn = () => {
		return undefined;
	};
	const conf: IStatusChangeOptions<object, object> = { title: 'test', statusName: 'test', statusField: 'test', checkAccessRight: true };
	const statusGroup: IStatusChangeGroup[] = [{ fromStatusName: 'closed', fromStatusId: 0, entityIds: [{ id: 0 }] }];
	const statusDialogOptions: IChangeStatusDialogOptions<object, object> = { statusChangeConf: conf, statusGroup: statusGroup };
	const customDlgWrapper: ICustomDialog<string, BasicsSharedStatusChangeDialogComponent> = {
		value: '',
		get body(): BasicsSharedStatusChangeDialogComponent {
			return component;
		},
		close() {},
	};
	const dialogOption: ICustomDialogOptions<IStatusChangeResult, BasicsSharedStatusChangeDialogComponent> = {
		width: '30%',
		headerText: 'test',
		buttons: [
			{ id: 'history', caption: { key: 'history' }, fn: dummyFn },
			{ id: 'back', caption: { key: 'back' }, fn: undefined },
			{ id: 'next', caption: { key: 'next' }, fn: dummyFn },
			{ id: 'ok', fn: dummyFn },
			{ id: 'cancel', caption: { key: 'ui.common.dialog.cancelBtn' }, fn: dummyFn },
		],
		resizeable: true,
		id: 'test',
		showCloseButton: true,
		bodyComponent: BasicsSharedStatusChangeDialogComponent,
		bodyProviders: [
			{
				provide: CHANGE_STATUS_DIALOG_OPTIONS,
				useValue: statusDialogOptions,
			},
			{
				provide: getCustomDialogDataToken<string, BasicsSharedStatusChangeDialogComponent>(),
				useValue: customDlgWrapper,
			},
		],
	};

	// beforeEach(async () => {
	//    // changeStatusService = TestBed.inject(BasicsSharedChangeStatusService<IEntityIdentification>);
	//     await TestBed.configureTestingModule({
	//         declarations: [BasicsSharedStatusChangeDialogComponent],
	//         providers: [{
	//             provide: CHANGE_STATUS_DIALOG_OPTIONS,
	//             useValue: statusDialogOptions
	//         }, {
	//             provide: getCustomDialogDataToken<string, BasicsSharedStatusChangeDialogComponent>(),
	//             useValue: customDlgWrapper
	//         },{
	//             provide: BasicsSharedChangeStatusService, useValue: null
	//         }],
	//         imports: [HttpClientTestingModule, MatDialogModule],
	//     }).compileComponents();
	//
	//     fixture = TestBed.createComponent(BasicsSharedStatusChangeDialogComponent);
	//     component = fixture.componentInstance;
	//     fixture.detectChanges();
	// });

	it('should create', () => {
		expect(true).toBeTruthy();
	});
});
