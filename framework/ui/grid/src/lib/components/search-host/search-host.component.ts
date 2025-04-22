/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Output, SecurityContext } from '@angular/core';
import { UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'ui-grid-search-host',
	templateUrl: './search-host.component.html',
	standalone: true,
	imports: [
		UiCommonModule,
		PlatformCommonModule
	]
})
export class UiGridSearchHostComponent implements AfterViewInit {

	protected hostElement = inject(ElementRef);
	private sanitizer = inject(DomSanitizer);

	@Output() public filterEvent : EventEmitter<string | null> = new EventEmitter();

	public ngAfterViewInit(): void {
		const delay = (() => {
			let timer: number = 0;
			return (callback: () => void, ms: number) => {
				clearTimeout(timer);
				timer = setTimeout(callback, ms) as unknown as number;
			};
		})();

		const input = this.hostElement.nativeElement.querySelector('input');
		if(input) {
			input.addEventListener('keyup', (e: KeyboardEvent) => {
					delay(() => {
						// clear on Esc
						if (e.key === 'Escape') {
							input.value = '';
						}

						let searchString : string | null = input.value.replace(/[:*?"<>|]/g, '');
						if(searchString !== null) {
							// Handle Parenthesis
							const specialCharacters = ['(', ')', '[', ']'];
							for (let i = 0; i < specialCharacters.length; i++) {
								searchString = searchString.replace(specialCharacters[i], '\\' + specialCharacters[i]);
							}
							searchString = this.sanitizer.sanitize(SecurityContext.HTML, searchString);

							this.filterEvent.emit(searchString);
						}

					}, 500);
				});
		}
	}
}