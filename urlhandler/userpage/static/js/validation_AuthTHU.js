/**
 * Created with PyCharm.
 * User: Epsirom
 * Date: 13-11-29
 * Time: 下午5:27
 */

var xmlhttp = null;

function hideElem(id) {
    document.getElementById(id).setAttribute('style', 'display:none');
}

function showElem(id) {
    document.getElementById(id).setAttribute('style', 'display:block');
}

function clearHelp(groupid, helpid) {
    document.getElementById(groupid).setAttribute('class', 'form-group');
    //document.getElementById(helpid).setAttribute('hidden', 'hidden');
    //document.getElementById(helpid).setAttribute('style', 'display:none;');
    hideElem(helpid);
}

function clearAllHelps() {
    clearHelp('usernameGroup', 'helpUsername');
    clearHelp('passwordGroup', 'helpPassword');
    clearHelp('submitGroup', 'helpSubmit');
}

function showSuccess(groupid, helpid) {
    document.getElementById(groupid).setAttribute('class', 'form-group has-success');
    //document.getElementById(helpid).setAttribute('hidden', 'hidden');
    hideElem(helpid);
}

function showError(groupid, helpid, text) {
    var dom = document.getElementById(helpid);
    dom.innerText = text;
    //dom.removeAttribute('hidden');
    showElem(helpid);
    document.getElementById(groupid).setAttribute('class', 'form-group has-error');
}

function disableOne(id, flag) {
    var dom = document.getElementById(id);
    if (flag) {
        dom.setAttribute('disabled', 'disabled');
    } else {
        dom.removeAttribute('disabled');
    }
}

function disableAll(flag) {
    disableOne('inputUsername', flag);
    disableOne('inputPassword', flag);
    disableOne('submitBtn', flag);
}

function showLoading(flag) {
    //var dom = document.getElementById('helpLoading');
    if (flag) {
        //dom.removeAttribute('hidden');
        showElem('helpLoading');
    } else {
        //dom.setAttribute('hidden', 'hidden');
        hideElem('helpLoading');
    }
}

function readyStateChanged() {
    if (xmlhttp.readyState==4)
    {// 4 = "loaded"
        if (xmlhttp.status==200)
        {// 200 = OK
            var result = xmlhttp.responseText;
            switch (result)
            {
                case 'Accepted':
                    //document.getElementById('validationHolder').setAttribute('hidden', 'hidden');
                    hideElem('validationHolder');
                    //document.getElementById('successHolder').removeAttribute('hidden');
                    showElem('successHolder');
                    return;

                case 'Rejected':
                    showError('usernameGroup', 'helpUsername', '');
                    showError('passwordGroup', 'helpPassword', '学号或密码错误！请输入登录info的学号和密码');
                    break;

                case 'Error':
                    showError('submitGroup', 'helpSubmit', '出现了奇怪的错误，我们已经记录下来了，请稍后重试。')
                    break;
                default:
                    showError('submitGroup', 'helpSubmit', '出现了奇怪的错误，我们已经记录下来了，请稍后重试。')
                    break;
            }
        }
        else
        {
            showError('submitGroup', 'helpSubmit', '服务器连接异常，请稍后重试。')
        }
        showLoading(false);
        disableAll(false);
    }
}

function submitValidation(openid) {
    if (checkUsername() & checkPassword()) {
        disableAll(true);
        showLoading(true);
        var key = new RSAKeyPair("10001", "", "89323ab0fba8422ba79b2ef4fb4948ee5158f927f63daebd35c7669fc1af6501ceed5fd13ac1d236d144d39808eb8da53aa0af26b17befd1abd6cfb1dcfba937438e4e95cd061e2ba372d422edbb72979f4ccd32f75503ad70769e299a4143a428380a2bd43c30b0c37fda51d6ee7adbfec1a9d0ad1891e1ae292d8fb992821b");                    
        timeGeter = new XMLHttpRequest();
        timeGeter.onreadystatechange = function (){
            if(timeGeter.readyState==4){
                if(timeGeter.status==200){
                    var form = document.getElementById('validationForm')
                    var elems = form.elements;
                    var url = form.action;
                    var dataToSend = "&openid=" + encodeURIComponent(openid);
                    dataToSend += "&secret=" + encryptedString(key, timeGeter.responseText + "|" + $("#inputUsername").val() + "|" + $("#inputPassword").val());
                    for (i = 0, len = elems.length; i < len-2; ++i) {
                        //console.log(elems[i].name + '=' + elems[i].value);
                        dataToSend += '&' + elems[i].name + '=' + encodeURIComponent(elems[i].value);
                    }
                    xmlhttp = new XMLHttpRequest();
                    xmlhttp.open('POST', url, true);
                    //xmlhttp.open('POST', "http://localhost:8000/u/validate/AuthTHU/", true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                    xmlhttp.onreadystatechange = readyStateChanged;
                    xmlhttp.send(dataToSend);
                }
                else{
                    showError('submitGroup', 'helpSubmit', '服务器连接异常，请稍后重试。')
                }
            }
            showLoading(false);
            disableAll(false);
        }
        timeGeter.open('GET', "http://localhost:8000/u/validate/getTime/", true);
        timeGeter.send();
    }
    return false;
}

function checkNotEmpty(groupid, helpid, inputid, hintName) {
    if (document.getElementById(inputid).value.trim().length == 0) {
        document.getElementById(groupid).setAttribute('class', 'form-group has-error');
        var dom = document.getElementById(helpid);
        dom.innerText = '请输入' + hintName + '！';
        //dom.removeAttribute('hidden');
        showElem(helpid);
        return false;
    } else {
        showSuccess(groupid, helpid);
        return true;
    }
}

function checkIsDigit(groupid, helpid, inputid, hintName) {
    if (isNaN(document.getElementById(inputid).value)) {
        document.getElementById(groupid).setAttribute('class', 'form-group has-error');
        var dom = document.getElementById(helpid);
        dom.innerText = hintName + '必须为数字！';
        //dom.removeAttribute('hidden');
        showElem(helpid);
        return false;
    } else {
        showSuccess(groupid, helpid);
        return true;
    }
}

function checkUsername() {
    if (checkNotEmpty('usernameGroup', 'helpUsername', 'inputUsername', '学号')) {
        return checkIsDigit('usernameGroup', 'helpUsername', 'inputUsername', '学号');
    }
    return false;
}

function checkPassword() {
    return checkNotEmpty('passwordGroup', 'helpPassword', 'inputPassword', '密码');
}

window.setupWeixin({'optionMenu':false, 'toolbar':false});

clearAllHelps();

/*
document.getElementById('inputUsername').onfocus = function(){
    setfooter();
}

document.getElementById('inputPassword').onfocus = function(){
    setfooter();
}*/

function showValidation(isValidated) {
    if (!isValidated) {
        document.getElementById('inputUsername').focus();
    } else {
        showElem('successHolder');
        hideElem('validationHolder');
    }
}
