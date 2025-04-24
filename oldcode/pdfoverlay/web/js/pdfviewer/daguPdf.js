$( document ).ready(function() {

	return
	/* Druckbutton auf externe Funktion umbiegen */
	var printButton = $("#print");
	printButton.clone().attr("id","daguPrint").insertAfter(printButton).bind("click",function(e){
		parent.printViewerPDF();
	}).hide();
	printButton.hide();

	/* Download-Button immer anzeigen */
	$("#download").removeClass("hiddenMediumView");
});