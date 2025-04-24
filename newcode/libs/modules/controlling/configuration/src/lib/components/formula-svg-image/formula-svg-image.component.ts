import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ControlContextInjectionToken } from '@libs/ui/common';
import { IMdcContrFormulaPropDefEntity} from '../../model/entities/mdc-contr-formula-prop-def-entity.interface';
import { filter, forEach } from 'lodash';
import {
  ControllingConfigurationFormulaDefinitionDataService
} from '../../services/controlling-configuration-formula-definition-data.service';
import * as katex from 'katex';

@Component({
  selector: 'itwo40-formula-svg-image',
  templateUrl: './formula-svg-image.component.html',
  styleUrl: './formula-svg-image.component.scss'
})
export class FormulaSvgImageComponent implements OnInit, OnDestroy, AfterViewInit {

  private controlContext = inject(ControlContextInjectionToken);
  public FormulaStr : string = '';
  private _entity?: IMdcContrFormulaPropDefEntity;
  private inputBox!: HTMLTextAreaElement;
  private popupDiv!: HTMLElement;
  //private popupDivJq = $(popupDiv);
  private pRegex = new RegExp('^[a-zA-Z0-9_]+$', 'g');
  private tooltip?: HTMLElement | null;
  private readonly formulaDataService = inject(ControllingConfigurationFormulaDefinitionDataService);

  public ngAfterViewInit(){
    this.inputBox = document.getElementById('formula-text-input-controller') as HTMLTextAreaElement || new HTMLTextAreaElement();
  }

  private get ignoreFormulaInput(){
    return !!this._entity && this._entity.ignoreFormulaInput;
  }

  public ngOnInit(): void {
    this._entity = this.controlContext.entityContext.entity as IMdcContrFormulaPropDefEntity;
    this.FormulaStr = this._entity ? (this._entity.Formula || '') : '';
  }

  public ngOnDestroy() {
    if(this._entity){
      this._entity.Formula = this.FormulaStr;
    }
  }

  public clickEvent(event:  MouseEvent){
    event.stopPropagation();
  }

  public openWin(event: FocusEvent): void{
      event.stopPropagation();

    if(document.getElementById('formula-matched-param-list')){
      return;
    }

    document.addEventListener('click', this.closeWin);

    const newDiv = document.createElement('div');
    newDiv.id = 'formula-matched-param-list';
    newDiv.style.position = 'absolute';
    newDiv.style.padding = '0px';
    newDiv.style.width = '410px';
    newDiv.style.height = '200px';
    newDiv.style.border = 'solid #ccc 1px';
    newDiv.style.backgroundColor = 'white';
    newDiv.style.zIndex = '9999';
    newDiv.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)';
    newDiv.style.display = this.ignoreFormulaInput ? 'none' : '';
    newDiv.innerHTML =
        '<div style="height: 199px; width: 270px; max-width: 270px; max-height: 199px; overflow: auto; text-align: center; line-height: 199px; float: right; font-size: 13px; font-weight: bolder" id="formulaImageDirectDiv"></div>' +
        '<div style="height: 199px; width: 210px; max-width: 130px; max-height: 199px; overflow: auto; border-right: solid #ccc 1px; float: left; vertical-align: top" id="formula-matched-param-list-items"></div>';
    newDiv.addEventListener('click', (event)=>{
      event.stopPropagation();
    });
    document.body.appendChild(newDiv);

    this.popupDiv = document.getElementById('formula-matched-param-list') || new HTMLElement();
    this.tooltip = this.popupDiv;

    let formulaList: string[] = [];
    // todo need to use a common way rather then specify service to get parameter codes
    this.formulaDataService.getParameters(this._entity).then((res) => {
      formulaList = res as string[];
      this.initSuggestions(formulaList);
      this.reloadFormulaImage();
    });

    this.initPopup();
    this.inputBox.addEventListener('click', () =>{
      this.initPopup();
    });

    this.inputBox.addEventListener('keyup', () =>{
      const formula = this.FormulaStr;
      //scope.value = scope.$parent.value = inputBox.value;
      if (!formula || formula === '') {
        this.initSuggestions(formulaList);
        this.reloadFormulaImage();
        return;
      }

      const parameter = formula.substring(this.getLeftIndex(), this.getRightIndex());
      if (!parameter || parameter === '') {
        this.reloadFormulaImage();
        return;
      }
      const match = filter(formulaList, function (item) {
        return item.toLowerCase().indexOf(parameter.toLowerCase()) > -1;
      });
      this.initSuggestions(match);
      this.reloadFormulaImage();
    });
  }

  private closeWin(){
    const div = document.getElementById('formula-matched-param-list');
    if(div){
      // scope.entity.Formula = scope.value;
      document.body.removeChild(div);
    }
    document.removeEventListener('click', this.closeWin);
  }

  private initPopup() {
    if (this.ignoreFormulaInput) {
      return;
    }
    if(this.popupDiv) {
      this.popupDiv.style.display = '';
    }

    // calculate the location for popup window
    const rect = this.inputBox.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if(this.tooltip) {
      this.tooltip.style.left = `${rect.left - 1}px`;
      this.tooltip.style.top = `${rect.top + rect.height + 1}px`;

      // if the popup window exceed the right of the screen, then move it toward to left;
      const tooltipRect = this.tooltip.getBoundingClientRect();
      if (tooltipRect.right > windowWidth - 80) {
        this.tooltip.style.left = `${rect.left - (tooltipRect.right - windowWidth + 80) - 10}px`;
      }

      // if the popup window exceed the bottom of the screen, then move it toward to top;
      if (this.tooltip.getBoundingClientRect().bottom > windowHeight) {
        this.tooltip.style.top = `${rect.top - tooltipRect.height}px`;
      }
    }
  }

  private initSuggestions(suggestions: string[]) {
    if (this.ignoreFormulaInput) {
      return;
    }

    const matchItems = document.getElementById('formula-matched-param-list-items');
    if(matchItems) {
      matchItems.innerHTML = '';
      suggestions.sort();
      forEach(suggestions, (suggestion) => {
        const listItem = document.createElement('span');
        listItem.style.display = 'block';
        listItem.textContent = suggestion;
        listItem.addEventListener('click', () => {
          this.replaceLetter(suggestion);
        });
        matchItems.appendChild(listItem);
      });
    }
  }

  private replaceLetter(word: string) {
    const formula = this.FormulaStr;
    if (!formula || formula === '') {
      this.FormulaStr = word;
    } else {
      const start = this.getLeftIndex();
      const end = this.getRightIndex();

      this.FormulaStr = formula.slice(0, start) + word + formula.slice(end);
    }
    // scope.value = scope.$parent.value = inputBox.value;
    this.reloadFormulaImage();
    this.inputBox.focus();
    // popupDivJq[0].innerHTML = ''
    // popupDivJq.hide();
  }

  private getLeftIndex() {
    const start = this.inputBox.selectionStart;
    if (start === 0) {
      return start;
    }
    const formula = this.FormulaStr;

    let left = start - 1;
    while (left >= 0) {
      const previous = formula.substring(left, start);
      this.pRegex.lastIndex = 0;
      if (!this.pRegex.test(previous)) {
        break;
      }
      left--;
    }
    return left + 1;
  }

  private getRightIndex() {
    const end = this.inputBox.selectionEnd;
    const formula = this.FormulaStr;
    if (end === formula.length) {
      return end;
    }

    let right = end + 1;
    while (right <= formula.length) {
      const next = formula.substring(end, right);
      this.pRegex.lastIndex = 0;
      if (!this.pRegex.test(next)) {
        break;
      }
      right++;
    }
    return right - 1;
  }

  private reloadFormulaImage() {
    if (this.ignoreFormulaInput) {
      return;
    }
    let formula = this.FormulaStr;
    const codes: string[] = [];
    if (formula && formula !== '') {
      const paramRegEx = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');
      const matchs = formula.match(paramRegEx);
      forEach(matchs, (match) => {
        codes.push(match);
      });


      if (formula.indexOf('/') > 0) {
        formula = this.handleDivisionChar(formula);
      }
    }
    this.handleCodeNShow(codes, formula);
  }

  private handleCodeNShow(codes: string[], exp: string) {
    if (codes && codes.length > 0) {
      const replacedCode: string[] = [];
      forEach(codes, function (code) {
        if (code === 'sqrt' || replacedCode.indexOf(code) >= 0) {
          return;
        }
        replacedCode.push(code);
        const regex = new RegExp('\\b' + code + '\\b', 'g');
        exp = exp.replace(regex, '\\verb|' + code + '|');

      });
    }

    const formulaDiv = document.getElementById('formulaImageDirectDiv');
    let svgStr = 'renderToString' in katex ? katex.renderToString(exp || '') : '';
    svgStr = svgStr.replace('aria-hidden="true"', 'style="display:none"');
    if(formulaDiv) {
      formulaDiv.innerHTML = svgStr;
    }
    //renderMathInElement(formulaDiv);
  }

	// convert a/b  to \frac{a}{b}
	private handleDivisionChar(exp: string) {
		if (exp.indexOf('/') > -1) {
			let tab: string[] = [];
			let frac = '___frac___';
			while (exp.indexOf('(') > -1) {
				exp = exp.replace(/(\([^()]*\))/g, function(m, t) {
					tab.push(t);
					return (frac + (tab.length - 1));
				});
			}

			tab.push(exp);
			exp = frac + (tab.length - 1);
			while (exp.indexOf(frac) > -1) {
				exp = exp.replace(new RegExp(frac + '(\\d+)', 'g'), (m, d: number) => {
					return this.replacePowerWithPowFunction(tab[d]);
				});
			}
		}
		return exp;
	};

	private replacePowerWithPowFunction(expression: string): string {
		function replaceSinglePower(str: string) {
			return str.replace(/([a-zA-Z0-9._]+)\s*\/\s*([a-zA-Z0-9._]+)/g, (match: string, base: string, exponent: string) => `\\frac{${base}}{${exponent}}`);
		}

		let previous;
		do {
			previous = expression;
			expression = replaceSinglePower(expression);
		} while (previous !== expression);

		return expression;
	}

}
