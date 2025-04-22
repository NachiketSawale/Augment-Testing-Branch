/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { PlatformTranslateService } from '@libs/platform/common';
import { UiCommonHotkeyService } from '../../../services/menu-list/hotkey.service';
import { PopupService } from '../../../popup/services/popup.service';

import { ActivePopup } from '../../../popup/model/active-popup';
import { MenuListItemBaseComponent } from './menu-list-item-base.component';
import { dropDownSample, groups, radioSample, tools } from '../../../mock-data/toolbar-base-mockdata';
import { TranslatePipe } from '@libs/platform/common';
import { ClassList } from '../enum/class-list.enum';
import { ItemType } from '../enum/menulist-item-type.enum';
import { IMenuItemsList } from '../interface/index';

@Component({
	selector: 'ui-common-test',
	template: `<ul class="tools showimages overflow ">
			<li class="collapsable"></li>
			<li class="collapsable divider"></li>
			<li class="collapsable"></li>
		</ul>
		'`,
})
class TestComponent extends MenuListItemBaseComponent<void> {
	public constructor(public elem: ElementRef, public renderer: Renderer2) {
		super();
	}
}
describe('MenuListItemBaseComponent', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let hotkeyService: UiCommonHotkeyService;
	let popupService: PopupService;

	const response = {
		close: jest.fn(),
	};

	const menuItem: IMenuItemsList = {
		activeValue: 'filterBoQ',
		cssClass: 'radio-group dropdown-menu-right',
		showTitles: false,
		items: [
			{
				caption: { key: 'cloud.common.filterAssigned' },
				iconClass: 'tlb-icons ico-filter-assigned ',
				id: 'filterBoQ',
				isDisplayed: true,
				type: ItemType.Radio,
			},
			{
				caption: { key: 'cloud.common.filterAssignedAndNotAssigned' },
				iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
				id: 'filterBoQAndNotAssigned',
				isDisplayed: true,
				type: ItemType.Radio,
			},
			{
				caption: { key: 'cloud.common.filterNotAssigned' },
				iconClass: 'tlb-icons ico-filter-notassigned',
				id: 'filterNotAssigned',
				isDisplayed: true,
				type: ItemType.Radio,
			},
		],
	};
	const menulist = {
		caption: {
			text: 'radio group caption',
			key: 'radio group caption',
		},
		groupId: 'dropdown-btn-radio2',
		hideItem: false,
		iconClass: 'tlb-icons ico-watchlist-add',
		id: 'radio2',
		layoutChangeable: true,
		layoutModes: 'vertical',
		type: ItemType.DropdownBtn,
		list: {
			activeValue: 't-addtowatchlist',
			cssClass: 'radio-group popup-menu',
			showTitles: true,
			items: [
				{
					caption: {
						key: 'cloud.common.addWawatchlist',
						text: 'Add to watchlist...',
					},
					iconClass: 'tlb-icons ico-watchlist-add',
					id: 't-addtowatchlist',
					sort: 110,
					type: ItemType.Item,
				},
				{
					caption: {
						key: 'cloud.common.bulkEditor.title',
						text: 'Bulk Editor',
					},
					hideItem: false,
					iconClass: 'type-icons ico-construction51',
					id: 't1444',
					sort: 140,
					type: ItemType.Item,
				},
				{
					caption: {
						key: 'cloud.common.taskBarColumnFilter',
						text: 'Column Filter',
					},
					hideItem: false,
					iconClass: 'tlb-icons ico-search-column',
					id: 'gridSearchColumn',
					sort: 160,
					type: ItemType.Item,
				},
			],
		},
		isSet: true,
	};
	const activeP = new Subject<ActivePopup>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [TestComponent],
			providers: [TranslatePipe,PlatformTranslateService, UiCommonHotkeyService, PopupService, { provide: 'menulist', useValue: menulist }, { provide: 'activepopup', useValue: activeP }],
		}).compileComponents();

		popupService = TestBed.inject(PopupService);
		hotkeyService = TestBed.inject(UiCommonHotkeyService);
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('getCssClass should create classList ', () => {
		let classList = component.getCssClass(tools[12]);
		expect(classList.includes(ClassList.dropdownToggle+ ' ' + ClassList.dropdownCaret)).toBeTruthy();
		classList = component.getCssClass(dropDownSample);
		expect(classList.includes(ClassList.dropdownToggle+ ' ' + ClassList.dropdownCaret)).toBeTruthy();
		classList = component.getCssClass(radioSample, 'filterBoQ');
		expect(classList.includes(ClassList.active)).toBeTruthy();
		classList = component.getCssClass(radioSample, 'sample');
		expect(classList.includes(ClassList.active)).toBeFalsy();
		classList = component.getCssClass(tools[19]);
		expect(classList.includes(ClassList.dropdownToggle + ' '+ ClassList.tlbIcons + ' '+ ClassList.menuButton)).toBeTruthy();
		classList = component.getCssClass(tools[0]);
		expect(classList).toEqual('');
	});

	it('isDisabled should return value of disabled', () => {
		let disabled = component.isDisabled(tools[1]);
		expect(disabled).toBeTruthy();
		disabled = component.isDisabled(tools[0]);
		expect(disabled).toBeFalsy();
	});

	it('getTitle should display tooltip', () => {
		let tooltip = component.getTitle(groups[0]);
		expect(tooltip).toEqual('radio group caption');
		jest.spyOn(hotkeyService, 'getTooltip').mockReturnValue('ctrl+c');
		tooltip = component.getTitle(groups[0]);
		expect(tooltip).toEqual('radio group caption ( ctrl+c )');
	});

	it('getPopupContentCss should return the cssclass', () => {
		expect(component.getPopupContentCss(menuItem)).toBe(menuItem);
	});

	it('tests open popup', () => {
		jest.spyOn(popupService, 'open').mockReturnValue(response as unknown as ActivePopup);
		expect(component.openPopup(menulist, component.elem, component.elem)).toEqual(response);
	});
	it('tests close popup', () => {
		const closePopupSpy = jest.spyOn(component, 'closePopup');
		jest.spyOn(popupService, 'open').mockReturnValue(response as unknown as ActivePopup);
		fixture.detectChanges();
		const act = component.openPopup(menulist, component.elem, component.elem);
		component.closePopup(act);
		expect(closePopupSpy).toHaveBeenCalled();
	});

	it('setAlignment should return the horizontal ', () => {
		const li = document.getElementsByTagName('li')[0];
		const ele = {
			nativeElement: li,
		};
		const alignment = component.setAlignment(ele);
		expect(alignment).toEqual('horizontal');
	});

	it('setAlignment should return the vertical ', () => {
		const alignment = component.setAlignment(component.elem);
		expect(alignment).toEqual('vertical');
	});
});
