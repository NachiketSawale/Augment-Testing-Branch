
(function (angular) {
    'use strict';

    let moduleName = 'controlling.configuration';


    angular.module(moduleName).directive('formulaTextInput',
        ['_', '$injector', '$http',
            function (_, $injector, $http) {
                return {
                    restrict: 'AE',
                    scope: true,
                    template: '' +
                        '<input class="domain-type-remark" id="formula-text-input-controller" ng-focus="openWin($event)" ng-click="clickEvent($event)" autocomplete="off" style="width: 100%" data-ng-model="value" data-config="groups[0].rows[2]" data-platform-control-validation data-entity="entity" data-options="options" />' +
                        // '<div id="matched-param-list" style="position: absolute; padding: 0px; width: 400px; height: 280px; background-color: white; border:solid #ccc 1px; display: none; z-index: 20000; max-width: 400px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);  ">' +
                        // '</div>' +
                        '',
                    link: function (scope) {

                        scope.clickEvent = function (event){
                            event.stopPropagation();
                        }

                        function closeWin(){
                            let div = document.getElementById('formula-matched-param-list');
                            if(div){
                                scope.entity.Formula = scope.value;
                                document.body.removeChild(div);
                            }
                            document.removeEventListener('click', closeWin);
                        }

                        scope.openWin = function (event) {
                            event.stopPropagation();

                            if(document.getElementById('formula-matched-param-list')){
                                return;
                            }

                            document.addEventListener('click', closeWin);

                            let ignoreFormulaInput = scope.entity && scope.entity.ignoreFormulaInput && scope.entity.ignoreFormulaInput();

                            let newDiv = document.createElement("div");
                            newDiv.id = 'formula-matched-param-list';
                            newDiv.style.position = 'absolute';
                            newDiv.style.padding = '0px';
                            newDiv.style.width = '410px';
                            newDiv.style.height = '200px';
                            newDiv.style.border = 'solid #ccc 1px';
                            newDiv.style.backgroundColor = 'white';
                            newDiv.style.zIndex = '9999';
                            newDiv.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)';
                            newDiv.style.display = ignoreFormulaInput ? 'none' : '';
                            newDiv.innerHTML =
                                '<div style="height: 199px; width: 270px; max-width: 270px; max-height: 199px; overflow: auto; text-align: center; line-height: 199px; float: right; font-size: 13px; font-weight: bolder" id="formulaImageDirectDiv"></div>' +
                                '<div style="height: 199px; width: 210px; max-width: 130px; max-height: 199px; overflow: auto; border-right: solid #ccc 1px; float: left; vertical-align: top" id="formula-matched-param-list-items"></div>';
                            newDiv.addEventListener('click', (event)=>{event.stopPropagation();});
                            document.body.appendChild(newDiv);

                            // document.getElementById('formulaImageDirectDiv').innerHTML  = '`' + scope.entity.Formula +'`';

                            let formulaList = [];
                            let options = scope.options || scope.groups[0]?.rows[2]?.options;
                            if (options && options.paramDataService && options.paramDataServiceFunc) {
                                let dataService = $injector.get(options.paramDataService)
                                if (dataService && dataService[options.paramDataServiceFunc]) {
                                    dataService[options.paramDataServiceFunc](scope.entity).then(function (res) {
                                        formulaList = res;
                                        initSuggestions(formulaList);
                                        reloadFormulaImage();
                                    })
                                }
                            }
                            let inputBox = document.getElementById('formula-text-input-controller');
                            let popupDiv = document.getElementById('formula-matched-param-list');
                            let popupDivJq = $(popupDiv);
                            let pRegex = new RegExp('^[a-zA-Z0-9_]+$', 'g');
                            let tooltip = popupDivJq[0];

                            function initPopup() {
                                if (ignoreFormulaInput) {
                                    return;
                                }
                                popupDivJq.show();

                                // calculate the location for popup window
                                const rect = inputBox.getBoundingClientRect();
                                const windowWidth = window.innerWidth;
                                const windowHeight = window.innerHeight;

                                tooltip.style.left = `${rect.left - 1}px`;
                                tooltip.style.top = `${rect.top + rect.height + 3}px`;

                                // if the popup window exceed the right of the screen, then move it toward to left;
                                let tooltipRect = tooltip.getBoundingClientRect();
                                if (tooltipRect.right > windowWidth - 80) {
                                    tooltip.style.left = `${rect.left - (tooltipRect.right - windowWidth + 80) - 10}px`;
                                }

                                // if the popup window exceed the bottom of the screen, then move it toward to top;
                                if (tooltip.getBoundingClientRect().bottom > windowHeight) {
                                    tooltip.style.top = `${rect.top - tooltipRect.height}px`;
                                }
                            }

                            initPopup();

                            inputBox.addEventListener('click', function () {
                                initPopup();
                            });

                            inputBox.addEventListener('keyup', function () {
                                let formula = inputBox.value;
                                scope.value = scope.$parent.value = inputBox.value;
                                if (!formula || formula === '') {
                                    initSuggestions(formulaList);
                                    reloadFormulaImage();
                                    return;
                                }

                                let parameter = $injector.get('basicsCommonStringFormatService').getSelectionVariables(formula, inputBox.selectionStart, inputBox.selectionEnd);
                                if (!parameter || parameter === '') {
                                    reloadFormulaImage();
                                    return;
                                }
                                let match = _.filter(formulaList, function (item) {
                                    return item.toLowerCase().indexOf(parameter.toLowerCase()) > -1;
                                });
                                initSuggestions(match);
                                reloadFormulaImage();
                            });

                            function initSuggestions(suggestions) {
                                if (ignoreFormulaInput) {
                                    return;
                                }

                                // if(suggestions && suggestions.length > 0){
                                //     popupDivJq.show();
                                // }else{
                                //     popupDivJq.hide();
                                //     return;
                                // }
                                // let popupDiv = popupDivJq[0];
                                let matchItems = document.getElementById('formula-matched-param-list-items');
                                matchItems.innerHTML = '';
                                suggestions.sort();
                                _.forEach(suggestions, function (suggestion) {
                                    let listItem = document.createElement('span');
                                    listItem.style.display = 'block';
                                    listItem.textContent = suggestion;
                                    listItem.addEventListener('click', function () {
                                        replaceLetter(suggestion);
                                    });
                                    matchItems.appendChild(listItem);
                                });
                            }

                            function replaceLetter(word) {
                                let formula = inputBox.value;
                                if (!formula || formula === '') {
                                    inputBox.value = word;
                                } else {
                                    inputBox.value = $injector.get('basicsCommonStringFormatService').appendVariables(inputBox.value, word, inputBox.selectionStart, inputBox.selectionEnd);
                                }
                                scope.value = scope.$parent.value = inputBox.value;
                                reloadFormulaImage();
                                inputBox.focus();
                                // popupDivJq[0].innerHTML = ''
                                // popupDivJq.hide();
                            }

                            function reloadFormulaImage() {
                                if (ignoreFormulaInput) {
                                    return;
                                }
                                let formula = scope.value;
                                let codes = [];
                                if (formula && formula !== '') {
                                    let paramRegEx = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');
                                    codes = formula.match(paramRegEx);

                                    if (formula.indexOf('/') > 0) {
	                                    formula = $injector.get('contrConfigFormulaImageService').handleDivisionChar(formula);
                                    }
                                }
                                handleCodeNShow(codes, formula);

                                function handleCodeNShow(codes, exp) {
                                    if (codes && codes.length > 0) {
                                        let replacedCodes = [];
                                        _.forEach(codes, function (code) {
                                            if (code === 'sqrt' || replacedCodes.indexOf(code) >= 0) {
                                                return;
                                            }
                                            replacedCodes.push(code);
                                            let regex = new RegExp('\\b' + code + '\\b', 'g');
                                            exp = exp.replace(regex, '\\verb|' + code + '|');

                                        });
                                    }

												let formulaDiv = document.getElementById('formulaImageDirectDiv')
                                    let svgStr = katex.renderToString(exp || '');
                                    svgStr = svgStr.replace('aria-hidden="true"', 'style="display:none"')
	                                 if(formulaDiv) {
		                                formulaDiv.innerHTML = svgStr;
	                                 }
                                    //renderMathInElement(formulaDiv);
                                }
                            }
                        }
                    }
                };
            }]);

})(angular);
