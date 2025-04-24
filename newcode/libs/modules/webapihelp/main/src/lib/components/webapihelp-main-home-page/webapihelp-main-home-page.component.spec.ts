/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StsConfigLoader, OidcSecurityService } from 'angular-auth-oidc-client';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { of } from 'rxjs';

import { cssClass } from '../../model/enum/web-api-help-style-class.enum';

import { WebApiHelpMainHomePageComponent } from './webapihelp-main-home-page.component';
import { WebApiHelpMainHeaderComponent } from '../webapihelp-main-header/webapihelp-main-header.component';
import { WebApiHelpMainLeftMenuComponent } from '../webapihelp-main-leftmenu/webapihelp-main-leftmenu.component';
import { WebApiHelpMainPaginatorComponent } from '../webapihelp-main-paginator/webapihelp-main-paginator.component';
import { WebApiHelpMainScrollToTopComponent } from '../webapihelp-main-scroll-to-top/webapihelp-main-scroll-to-top.component';
import { WebApiHelpMainSwaggerContentComponent } from '../webapihelp-main-swagger-content/webapihelp-main-swagger-content.component';
import { PlatformConfigurationService } from '@libs/platform/common';
describe('WebApiHelpMainHomePageComponent', () => {
	let component: WebApiHelpMainHomePageComponent;
	let fixture: ComponentFixture<WebApiHelpMainHomePageComponent>;
	let service: OidcSecurityService;
	const classList = cssClass;
	const mockAccessToken = 'hSsrV6A4RJnXHf1mYBYsqEc/EYKJhCUoFbfQTDNN7QWOqAVfm9+bmlBSusr/HEFd6yAuPSYZwpICkxPxgNIo4ltqDfunmMfDlcwHyumdmu4=';
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule],
			declarations: [WebApiHelpMainHomePageComponent,
				WebApiHelpMainLeftMenuComponent,
				WebApiHelpMainHeaderComponent,
				WebApiHelpMainScrollToTopComponent,
				WebApiHelpMainPaginatorComponent,
				WebApiHelpMainSwaggerContentComponent
			],
			providers: [OidcSecurityService, PlatformConfigurationService, StsConfigLoader]
		}).compileComponents();

		fixture = TestBed.createComponent(WebApiHelpMainHomePageComponent);
		service = TestBed.inject(OidcSecurityService);
		component = fixture.componentInstance;
		jest.spyOn(service, 'getAccessToken').mockImplementation(() => {
			return of(mockAccessToken);
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('changeClass ==> toggleOut', () => {
		jest.spyOn(component, 'changeClass');
		component.changeClass(classList.toggleOut);
		expect(component.changeClass).toBeDefined();
	});

	it('changeClass ==> toggleIn', () => {
		jest.spyOn(component, 'changeClass');
		component.changeClass(classList.toggleIn);
		expect(component.changeClass).toBeDefined();
	});
	it('receivedSearchContent should be defined', () => {
		jest.spyOn(component, 'receivedSearchContent');
		component.receivedSearchContent('basic');
		expect(component.receivedSearchContent).toBeDefined();
	});

	it('reloadFlagEvent should be defined', () => {
		jest.spyOn(component, 'reloadFlagEvent');
		component.reloadFlagEvent(false);
		expect(component.receivedSearchContent).toBeDefined();
	});
});
