/*
 * Copyright (c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { PlatformPermissionService } from './platform-permission.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlatformPermissionService', () => {
	let service: PlatformPermissionService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports:[
				HttpClientModule
			]
		});
		service = TestBed.inject(PlatformPermissionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should load provided descriptors', () => {
		expect(service.loadPermissions([
			'1b77aedb2fae468cb9fd539af120b87a', // layout save system views
			'00f979839fb94839a2998b4ca9dd12e5', // layout save user views
			'842f845cb6934b109a40983366f981ef', // layout save role views
			'c9e2ece5629b4037b4f8695c92e59c1b', // layout save portal views
			'b92e1f10594d4e7daa2cba19be14d5aa', // import/export layout
			'91c3b3b31b5d4ead9c4f7236cb4f2bc0', // Access Right to enable the Grid Layout option
			'a1013e0c2c12480c9292deaed7cb11dd', // Access Right to enable the Edit View option
			'7ee17da2cd004de6a53c63af7cb4d3d9', // Right to maintain Role | System Configuration of Lookups
			'511ee30db32342c6808b02994435bf50', // BI+ Admin
			'54d412d4bd54444b9f9d93cc2e69b182'  // BI+ Admin or Editor
		])).toBeTruthy();
	});



	// it('should have read right', () => {
	// 	expect(service.hasRead('1b77aedb2fae468cb9fd539af120b87a')).toBeTruthy();
	// });

	// it('should have write right', () => {
	// 	expect(service.hasWrite('1b77aedb2fae468cb9fd539af120b87a')).toBeTruthy();
	// });

	// it('should have create right', () => {
	// 	expect(service.hasCreate('1b77aedb2fae468cb9fd539af120b87a')).toBeTruthy();
	// });

	// it('should have delete right', () => {
	// 	expect(service.hasDelete('1b77aedb2fae468cb9fd539af120b87a')).toBeTruthy();
	// });

	// it('should not have execute right', () => {
	// 	expect(service.hasDelete('1b77aedb2fae468cb9fd539af120b87a')).toBe(false);
	// });

	// it('should have execute right', () => {
	// 	expect(service.hasExecute('511ee30db32342c6808b02994435bf50')).toBeTruthy();
	// });

});
