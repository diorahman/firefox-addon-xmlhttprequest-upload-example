const self = require('sdk/self');
const windowUtils = require('sdk/window/utils');
var tabs = require('sdk/tabs');
const {Cc, Ci, Cu} = require('chrome');

const XMLHttpRequest = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"];
const FormData = Cc["@mozilla.org/files/formdata;1"];
Cu.import('resource://gre/modules/FileUtils.jsm');

const TESTDATA = '/home/diorahman/Downloads/websocketd-0.2.11-linux_amd64.zip';

tabs.open('http://www.google.com');
tabs.on('ready', function(tab) {
    upload(TESTDATA, 'http://posttestserver.com/post.php?dump');
});

function upload(file, url) {
    let request = XMLHttpRequest.createInstance(Ci.nsIXMLHttpRequest);
    let formData = FormData.createInstance(Ci.nsIDOMFormData);
    let window = windowUtils.getMostRecentBrowserWindow();

    let domWindowUtils = window
        .QueryInterface(Ci.nsIInterfaceRequestor)
        .getInterface( Ci.nsIDOMWindowUtils);

    let nsIFile = new FileUtils.File(file);
    let domFile = domWindowUtils.wrapDOMFile(nsIFile);
    formData.append('opapa', domFile, 'omama');

    request.onreadystatechange = (e) => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                console.log(request.responseText);
            }
        }
    }
    request.onprogress = (e) => {
        console.log('progress: ', e.lengthComputable ? e.loaded * 100/e.total : '~');
    }
    request.open('POST', url);
    request.send(formData);
}

