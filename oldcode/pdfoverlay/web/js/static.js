var translations = {}; // Übersetzungen zwischenspeichern um unnötige Anfragen zu vermeiden
var translateMessage = function(code, alt){ // Übersetzung anfordern

    // Übersetzung gecached? -> Direkt ausliefern!
    alt  = typeof alt !== "undefined" ? alt : code;

    if(typeof code !== 'string')
        return alt;

    code = code.toLowerCase();
    if(code in translations)
        return translations[code];

    return alt;
};

var BUTTON_YES = 'Ja';
var BUTTON_NO = 'Nein';
var BUTTON_CANCEL = 'Abbrechen';
var BUTTON_RETRY = 'Erneut versuchen';
var BUTTON_SAVE = 'Speichern';
var BUTTON_UPDATE = 'Aktualisieren';
var BUTTON_SAVE_OPEN = 'Speichern & Öffnen';
var BUTTON_SAVE_NEW = 'Speichern & Neu';
var BUTTON_SAVE_ALL = 'Alle Speichern';
var BUTTON_OPEN = 'Öffnen';
var BUTTON_CLOSE = 'Schließen';
var BUTTON_DELETE = 'Löschen';
var BUTTON_REMOVE = 'Entfernen';
var BUTTON_MOVE = 'Verschieben';
var BUTTON_MOVE_OPEN = 'Verschieben und Öffnen';
var BUTTON_COMMIT = 'Übernehmen';
var BUTTON_REVERT = 'Verwerfen';
var BUTTON_EXPORT = 'Exportieren';
var BUTTON_IMPORT = 'Importieren';
var BUTTON_NEXT = 'Weiter';
var BUTTON_BACK = 'Zurück';
var BUTTON_ACCEPT = 'Akzeptieren';
var ERRORDIALOG_MESSAGE = 'Es ist ein Fehler aufgetreten. Bitte kontaktieren Sie Ihren Administrator.';
var ERRORDIALOG_DETAIL = 'Details';
var ERROR_VALIDATION = 'Die Eingabe ist nicht gültig!';
var ERROR_VALIDATION_NUMBER = 'Bitte eine Zahl eingeben!';
var ERROR_VALIDATION_MAIL = 'Bitte die E-Mail-Adresse überprüfen!';
var ERROR_VALIDATION_PHONE = 'Bitte die Telefonnummer überprüfen!';
var ERROR_VALIDATION_USTID = 'Bitte die USt-IdNr. überprüfen!';
var ERROR_VALIDATION_STEUERID = 'Bitte die Steuer-IdNr. überprüfen!';
var ERROR_VALIDATION_STEUERNR = 'Bitte die Steuer-Nr. überprüfen!';
var ERROR_VALIDATION_IBAN = 'Bitte die IBAN überprüfen!';
var ERROR_VALIDATION_BIC = 'Bitte die BIC überprüfen!';
var ERROR_VALIDATION_RVNR = 'Bitte die Rentenversicherungsnummer überprüfen!';
var ERROR_VALIDATION_GEOCORD = 'Bitte die Geo-Koordinate überprüfen!';
var ERROR_VALIDATION_FORMULA = 'Bitte die Formel überprüfen!';
var ERROR_PASSWORD_FAIL = 'Passwort falsch!';
var ERROR_USER_UNKNOWN = 'Nutzer unbekannt!';
var ERROR_NO_USER_AND_PASSWORD = 'Bitte Loginname und Passwort eingeben!';
var ERROR_NO_USER = 'Bitte Loginnamen eingeben!';
var ERROR_NO_PASSWORD = 'Bitte Passwort eingeben!';
var ERROR_NO_CLIENT = 'Bitte Client angeben!!';
var ERROR_SESSION_TIMEOUT = 'Ihre Session ist abgelaufen. Sie werden nun abgemeldet';
var ERROR_DATA_INTEGRITY = 'Das Objekt wird im System verwendet und kann daher nicht gelöscht werden. Bitte löschen Sie zuerst die Abhängigkeiten.';
var TITLE_LOADING = 'Loading ...';
var TITLE_INFORMATION = 'Information';
var TITLE_ATTENTION = 'Achtung!';
var TITLE_ERROR = 'Fehler!';
var TITLE_QUESTION = 'Frage';
var LOGGED_IN = 'Angemeldet : ';
var ERRORMESSAGE_HEADER = 'Fehlermeldung:\n';
var SESSION_TIMEOUT = 'Ihre Session ist abgelaufen, Sie werden nun abgemeldet.';
var SERVER_TIMEOUT = 'The server took too long to send the data.';
var TITLE_DELETE = 'Eintrag löschen';
var CONFIRM_DELETE = 'Wollen Sie den gewählten Eintrag dauerhaft entfernen?';
var TITLE_MOVE = 'Eintrag verschieben';
var CONFIRM_MOVE = 'Sind Sie sicher, dass Sie den gewählten Eintrag verschieben möchten?';
var TITLE_SIZE = 'Größe ändern';
var CONFIRM_SIZE = 'Sind Sie sicher, dass Sie die Größe des gewählten Eintrages ändern möchten?';
var TITLE_SAVE_CHANGES = 'Geänderte Daten';
var TITLE_FILE_SAVE_CHANGES = 'Geänderte Datei';
var CONFIRM_SAVE_CHANGES = 'Die Daten des Eintrags wurden seit dem letzten Speichervorgang geändert.<div style="margin-top:5px;font-weight:bold;">Möchten Sie diese Änderungen übernehmen?</div>';
var ERROR_UNDEFINED_LOGOUT ='Es ist ein unbekannter Fehler aufgetreten, Sie werden nun abgemeldet';
var CONFIRM_ARCHIVE = 'Hierdurch wird eine Kopie der Rechnung archiviert und kann nicht mehr ver&auml;ndert werden!! Vorgang ausf&uuml;hren ?!';

var pastelColors = ['#c6d9f0','#dbe5f1','#f2dcdb','#ebf1dd','#e5e0ec','#dbeef3','#fdeada',
    '#8db3e2','#b8cce4','#e5b9b7','#d7e3bc','#ccc1d9','#b7dde8','#fbd5b5',
    '#548dd4','#95b3d7','#d99694','#c3d69b','#b2a2c7','#92cddc','#fac08f',
    '#17365d','#366092','#953734','#76923c','#5f497a','#31859b','#e36c09',
    '#0f243e','#244061','#632423','#4f6128','#3f3151','#205867','#974806']

var pastelColors_rainbow =[
    /*rot*/   '#953734', '#c0504d', '#d99694', '#e5b9b7', '#f2dcdb',
    /*lila*/  '#8064a2', '#b2a2c7', '#ccc1d9', '#e5e0ec',
    /*blau*/  '#4f81bd', '#95b3d7', '#b8cce4', '#dbe5f1',
    /*blau*/  '#4bacc6', '#92cddc', '#b7dde8', '#dbeef3',
    /*grün*/  '#9bbb59', '#c3d69b', '#d7e3bc', '#ebf1dd',
    /*orange*/'#f79646', '#fac08f', '#fbd5b5', '#fdeada',
    ///*beige*/ '#494429', '#938953', '#c4bd97', '#ddd9c3', '#eeece1'
///*blau*/  '#e2f909', '#c6d9f0', '#8db3e2', '#548dd4',
]

var HashMap = function(){
    this._dict = {};
}

HashMap.prototype._shared = {id: 1};
HashMap.prototype.put = function put(key, value){
    if(typeof key == "object"){
        if(!key.hasOwnProperty._id){
            key.hasOwnProperty = function(key){
                return Object.prototype.hasOwnProperty.call(this, key);
            }
            key.hasOwnProperty._id = this._shared.id++;
        }
        this._dict[key.hasOwnProperty._id] = value;
    }else{
        this._dict[key] = value;
    }
    return this; // for chaining
}
HashMap.prototype.get = function get(key){
    if(typeof key == "object"){
        return this._dict[key.hasOwnProperty._id];
    }
    return this._dict[key];
}

var checkObject = function(obj, type, defaultValue){
    if(type == null || typeof type != "string")
        return undefined

    switch(type){
        case "array"    :
            obj = $.isArray(obj) ? obj : checkObject(defaultValue, type, []);
            break;
        case "string"    :
            obj = typeof obj == type ? obj : checkObject(defaultValue, type, "");
            break;
        case "number"    :
            obj = typeof obj == type ? obj : checkObject(defaultValue, type, 0);
            break;
        case "boolean"    :
            obj = typeof obj == type ? obj : checkObject(defaultValue, type, false);
            break;
        case "object"    :
            obj = obj != null && typeof obj == type ? obj : checkObject(defaultValue, type, {});
            break;
        case "undefined":
            obj = typeof obj == type ? obj : checkObject(defaultValue, type, undefined);
            break;
        case "null"        :
            obj = obj == null ? obj : checkObject(defaultValue, type, null);
            break;
        default    :
            obj = undefined;
    }

    return obj;
};

function setTemporaryTranslation(code,translation) {
	translations[code.toLowerCase()] = translation;
}