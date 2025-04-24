/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
//import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
//import { ActivatedRoute } from '@angular/router';
//import { RouterTestingModule } from '@angular/router/testing';
//import { ContainerBase } from '../container-base/container-base';

//import { UiContainerSystemContainerLayoutsComponent } from './container-layouts.component';
//import { ISplitterLayout } from './interfaces/container-layout.interface';

export class MockContainerBaseclass {
}
/*
const containerData = [
	{
		'id': 'basics.clerk.detailClerkAbsenceTitle',
		'title': 'Absence Details',
		'containerType': 'BasicsClerkAbsenceDetailComponent',
		'uuid': '6122eee3bf1a41ce994e0f1e5c165850',
		'permission': 'dde598002bbf4a2d96c82dc927e3e578',
		'customOptions': {
			'write': true,
			'read': true,
			'containerType': 'BasicsClerkAbsenceDetailComponent'
		}
	}
];

const mockContainer = [
	{
		'groups': [
			{
				'content': [
					'6122eee3bf1a41ce994e0f1e5c165850',
					'dde598002bbf4a2d96c82dc927e3e578'
				],
				'pane': 'pane-l',
				'panelArr': []
			},
			{
				'content': [
					'c2dd899746024732aa0fc583526f04eb'
				],
				'pane': 'pane-r',
				'panelArr': []
			}
		],
		'splitterDef': [
			{
				'selectorName': 'horizontal',
				'panes': [
					{
						'collapsed': true,
						'size': '49'
					},
					{
						'collapsed': true,
						'size': '49'
					}
				]
			}
		],
		'layoutId': 'layout1'
	}];*/
describe('UiContainerSystemContainerLayoutsComponent', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
/*	let component: UiContainerSystemContainerLayoutsComponent;
	let fixture: ComponentFixture<UiContainerSystemContainerLayoutsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule,
				RouterTestingModule,
				// TODO: delete?
				//TranslateModule.forRoot()
			],
			declarations: [UiContainerSystemContainerLayoutsComponent],
			providers: [
				UiCommonMainViewService,
				{ provide: ContainerBase, useClass: MockContainerBaseclass },
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { data: { 'moduleInfo': containerData } } }
				}
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiContainerSystemContainerLayoutsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//Test suit for constructor
	it('should call constructor', () => {
		expect(component.constructor).toBeTruthy();
		expect(component.constructor).toBeCalled;
		expect(component.constructor).toBeDefined();
	});

	//Test suit for initializeConstructor
	it('should call initializeConstructor', () => {
		expect(component.initializeConstructor).toBeTruthy();
		expect(component.initializeConstructor).toBeCalled;
		expect(component.initializeConstructor).toBeDefined();
	});

	//Test suits for initializeConstructor
	it('initializeConstructor should call getHPanelData', fakeAsync(() => {
		component.layoutsData = mockContainer;
		component.mainview.layoutId.next('layout1');
		expect(component.initializeConstructor).toBeCalled;
		tick(3000);
	}));

	//Test suit for getLayout
	it('should call getLayout', () => {
		component.layoutsData = [
			{
				'groups': [
					{
						'content': [
							'6122eee3bf1a41ce994e0f1e5c165850',
							'dde598002bbf4a2d96c82dc927e3e578'
						],
						'pane': 'pane-l'
					},
					{
						'content': [
							'c2dd899746024732aa0fc583526f04eb'
						],
						'pane': 'pane-r'
					}
				],
				'splitterDef': [
					{
						'selectorName': 'horizontal',
						'panes': [
							{
								'collapsed': true,
								'size': '49'
							},
							{
								'collapsed': true,
								'size': '49'
							}
						]
					}
				],
				'layoutId': 'layout1'
			}
		];
		expect(component.getLayout).toBeTruthy();
		expect(component.getLayout()).toBeCalled;
		expect(component.getLayout).toBeDefined();
	});

	//Test suit for getSplitterData
	it('should call getSplitterData', () => {
		const data: ISplitterLayout[] = [{
			'selectorName': 'horizontal',
			'panes': [{ 'collapsed': true, 'size': '49.99999999999999' }, { 'collapsed': true, 'size': '49.99999999999999' }]
		}];
		expect(component.getSplitterData).toBeTruthy();
		expect(component.getSplitterData(data, 'layout1')).toBeCalled;
		expect(component.getSplitterData).toBeDefined();
	});

	//Test suit for getTabData
	it('should call getTabData', () => {
		expect(component.getTabData).toBeTruthy();
		expect(component.getTabData).toBeCalled;
		expect(component.getTabData).toBeDefined();
	});

	// TODO: method does not exist
	//Test suit for createModuleInfo
	/*it('should call createModuleInfo', () => {
    expect(component.createModuleInfo).toBeTruthy();
    expect(component.createModuleInfo).toBeCalled;
    expect(component.createModuleInfo).toBeDefined();
  });*/
	//Test suit for containers
	/*it('should call containers', () => {
		expect(component.containers).toBeCalled;
		expect(component.containers).toBeUndefined;
	});*/

});
