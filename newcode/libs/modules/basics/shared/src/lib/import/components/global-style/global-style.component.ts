import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'basics-shared-import-global-style',
	templateUrl: './global-style.component.html',
	styleUrl: './global-style.component.scss',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
})
export class GlobalStyleComponent {}
