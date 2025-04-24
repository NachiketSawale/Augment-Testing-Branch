/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnInit, inject, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

/**
 * renderes search, reload and download options for swagger
 */
@Component({
	selector: 'webapihelp-main-header',
	templateUrl: './webapihelp-main-header.component.html',
	styleUrls: ['./webapihelp-main-header.component.scss'],

})
export class WebApiHelpMainHeaderComponent implements OnInit {

	/**
	 * Inject service
	 */
	private webApiHelpService = inject(WebApiHelpMainService);

	/**
	 * Router Injection
	 */
	private router = inject(Router);

	/**
	 * Gives search input to the parent component
	 */
	@Output() public searchData: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * Gives boolean value to the parent for reload swagger
	 */
	@Output() public setReloadFlag: EventEmitter<boolean> = new EventEmitter<boolean>();

	/**
	 * Reload flag for swagger
	 */
	public reloadFlag = false;

	/**
	 * set the input field value
	 */
	@Input() public set leftMenuSerachedValue(value: string) {
		this.control.setValue(value.replace('%5B', '[').replace('%5D', ']'));
	}

	/**
	 * filtered Array
	 */
	public filteredData!: string[];

	/**
	 * The left menubar data 
	 */
	public leftMenubarData !: string[];

	/**
	 * formControl for input search field
	 */
	public control = new FormControl<string>('');

	/**
	 * Template Reference variable for MatAutocomplete
	 */
	@ViewChild(MatAutocompleteTrigger) public autocomplete!: MatAutocompleteTrigger;

	public ngOnInit(): void {
		this.leftMenuBarData();
		this.debounceInputFiled();
	}

	/**
	 * Method Is used to add debounceTime in Input field
	 */
	public debounceInputFiled() {
		this.control.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((query) => this.webApiHelpService.searchData(this.leftMenubarData, query))
			)
			.subscribe((results: string[]) => {
				this.filteredData = results;
			});
	}

	/**
	 * Subscribe the left menubar data from subject
	 */
	public leftMenuBarData() {
		this.webApiHelpService.leftmenubarData$.subscribe((res: string[]) => {
			this.leftMenubarData = res;
		});
	}

	/**
	 * This method sending the search input to the parent and behaviour subject.
	 * @param { string } input gets search input value.
	 */
	public search(): void {
		const input = this.control.value as string;
		this.webApiHelpService.setSearchInput(input);
		this.searchData.emit(input);
	}

	/**
	 * This method is emiting the boolean value to the parent that indicats page is reloaded
	 */
	public reloadbuttonEvent(): void {
		this.reloadFlag = true;
		this.webApiHelpService.reloadButtonFlag$.next(this.reloadFlag);
	}

	/**
	 * For navigat to the download page
	 */
	public navigateToDownloadPage() {
		this.router.navigate(['/webapihelp/webapi-help', { outlets: { clientArea: 'download' } }]);
	}

	/**
	 * Input method used to close MatAutocomplete
	 */
	public inputChange() {
		if (this.control.value === '' && this.autocomplete.panelOpen) {
			this.autocomplete.closePanel();
		}
	}
}