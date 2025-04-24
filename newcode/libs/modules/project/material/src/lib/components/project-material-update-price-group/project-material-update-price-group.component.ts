/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, EventEmitter, Input} from '@angular/core';
import {IUpdatePriceBasicOption} from '../../model/entities/project-material-update-price-complate.interface';

@Component({
	selector: 'project-material-update-price-group',
	templateUrl: './project-material-update-price-group.component.html',
	styleUrls: ['./project-material-update-price-group.component.scss'],
})
export class ProjectMaterialProjectMaterialUpdatePriceGroupComponent {

	@Input()
	public optionItem?: IUpdatePriceBasicOption;

	@Input()
	public eventEmitter?: EventEmitter<string>;

    public constructor() { }

	//protected currentStep!: string | undefined;

	protected get currentStep(): string | undefined {
		if(this.optionItem){
			switch (this.optionItem.radioSelect){
				case 'fromCatalog':
					return this.optionItem.catalogSelect;
				default:
					return this.optionItem.radioSelect;
			}
		}

		return undefined;
	}

	// public setTargetComponent(){
	// 	if(this.optionItem){
	// 		switch (this.optionItem.radioSelect){
	// 			case 'fromCatalog':
	// 				this.currentStep = this.optionItem.catalogSelect;
	// 				break;
	// 			default:
	// 				this.currentStep = this.optionItem.radioSelect;
	// 				break;
	// 		}
	// 	}
	// }
}
