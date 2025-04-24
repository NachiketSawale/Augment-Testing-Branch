/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePipe } from '@libs/platform/common';

import { MessageBoxComponent } from './message-box.component';
import { getCustomDialogDataToken, ICustomDialog, IMessageBoxOptions } from '../../..';
import { getMessageBoxOptionsToken } from '../../model/message-box-options.interface';

describe('MessageBoxComponent', () => {
	let component: MessageBoxComponent;
	let fixture: ComponentFixture<MessageBoxComponent>;

	beforeEach(async () => {
		const data: IMessageBoxOptions = {
			headerText: 'Info',
			bodyText: 'This is an information.'
		};
		const dialogData: ICustomDialog<void, MessageBoxComponent, void> = {
			get body(): MessageBoxComponent {
				return component;
			},
			close() {
			}
		};

		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [MessageBoxComponent, TranslatePipe],
			providers: [{
				provide: getMessageBoxOptionsToken(),
				useValue: data
			}, {
				provide: getCustomDialogDataToken<void, MessageBoxComponent>(),
				useValue: dialogData
			}]
		}).compileComponents();

		fixture = TestBed.createComponent(MessageBoxComponent<void>);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

describe('MessageBoxComponent without bodytext', () => {
	let component: MessageBoxComponent;
	let fixture: ComponentFixture<MessageBoxComponent>;

	beforeEach(async () => {
		const data: IMessageBoxOptions = {
			headerText: 'Textless'
		};
		const dialogData: ICustomDialog<void, MessageBoxComponent, void> = {
			get body(): MessageBoxComponent {
				return component;
			},
			close() {
			}
		};

		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [MessageBoxComponent, TranslatePipe],
			providers: [{
				provide: getMessageBoxOptionsToken(),
				useValue: data
			}, {
				provide: getCustomDialogDataToken<void, MessageBoxComponent>(),
				useValue: dialogData
			}]
		}).compileComponents();

		fixture = TestBed.createComponent(MessageBoxComponent<void>);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
