/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionComponent } from './action.component';
import { MenuListComponent } from '../../../components/menu-list/menu-list/menu-list.component';

import { IActionControlContext } from '../../model/action-control-context.interface';
import { ControlContextInjectionToken } from '../../model/control-context.interface';

import { IEntityContext } from '@libs/platform/common';

import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

describe('ActionComponent', () => {
	let component: ActionComponent<object>;
	let fixture: ComponentFixture<ActionComponent<object>>;

	beforeEach(async () => {
		const ctlCtx: IActionControlContext<object> = {
			fieldId: '',
			value: {
				id: 'actionButton',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-settings',
				fn: () => {
					console.log('action button click');
				},
				caption: { key: 'basics.config.setConfiguration' },
			},
			readonly: false,
			validationResults: [],
			entityContext: {} as unknown as IEntityContext<object>
		};
		await TestBed.configureTestingModule({
			declarations: [ActionComponent, MenuListComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: ctlCtx }]
		}).compileComponents();

		fixture = TestBed.createComponent(ActionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
