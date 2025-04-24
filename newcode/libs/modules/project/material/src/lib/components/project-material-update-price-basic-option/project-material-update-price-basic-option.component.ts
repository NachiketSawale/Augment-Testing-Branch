/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {
	IUpdatePriceBasicOption
} from '../../model/entities/project-material-update-price-complate.interface';

@Component({
	selector: 'project-material-update-price-basic-option',
	templateUrl: './project-material-update-price-basic-option.component.html',
	styleUrls: ['./project-material-update-price-basic-option.component.scss'],
})
export class ProjectMaterialProjectMaterialUpdatePriceBasicOptionComponent implements OnInit {

	protected canUpdateFromCatalog?: boolean;

	protected catalogSelect?: string;

	protected radioSelect?: string;

	@Input()
	protected optionItem?: IUpdatePriceBasicOption;

	@Input()
	public eventEmitter?: EventEmitter<string> | undefined;

	public ngOnInit(): void  {
		this.canUpdateFromCatalog = this.optionItem?.canUpdateFromCatalog;
		this.catalogSelect = this.optionItem?.catalogSelect;
		this.radioSelect = this.optionItem?.radioSelect;
	}

	protected onCatalogSelectChange(input: string){
		this.optionItem!.catalogSelect = input;
	}

	protected onRadioSelectChange(input: string){
		this.optionItem!.radioSelect = input;
	}
}
