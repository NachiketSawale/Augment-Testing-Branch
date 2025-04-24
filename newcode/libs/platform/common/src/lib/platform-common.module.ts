/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { NgModule } from '@angular/core';
import { TranslatePipe } from './pipe/translate.pipe';


@NgModule({
	imports: [],
	declarations: [TranslatePipe],
	exports: [TranslatePipe]
})
export class PlatformCommonModule {
}
