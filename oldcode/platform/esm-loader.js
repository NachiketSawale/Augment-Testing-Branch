/**
 * loader to get es modules (mjs) loaded into application 
 **/

console.log('loading of es-modules ...');

import * as pdfjsLib from './lib/20_libs/pdf.mjs'
console.log('es-module pdfjs loaded:', pdfjsLib);

console.log('finished loading of es-modules');