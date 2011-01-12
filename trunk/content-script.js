var wrapper = $(
'<div id="cew-wrapper">' +
	'<div id="cew-header">' +
		'<span id="cew-icon-chateverywhere" class="cew-icon16 cew-icon16-chateverywhere"></span>' +
                'Chat Everywhere&nbsp;' +
		'<span id="cew-icon-close" class="cew-icon16 cew-icon16-close"></span>' +
                '<span id="cew-icon-toggle-handler" class="cew-icon16 cew-icon16-expanded"></span>' +
                '<span id="cew-icon-settings" class="cew-icon16 cew-icon16-settings"></span>' +
		'<!--span id="cew-nb-messages">0</span><span id="cew-icon-nb-messages" class="cew-icon16 cew-icon16-messages"></span-->' +
		'</span><span id="cew-nb-users">0</span><span id="cew-icon-nb-users" class="cew-icon16 cew-icon16-users">' +
	'</div>' +
	'<div id="cew-chat-wrapper">' +
		'<div id="cew-messages">' +
		'</div>' +
		'<div id="cew-chat">' +
			'<textarea id="cew-chat-input"></textarea>' +
		'</div>' +
	'</div>' +
        '<div id="cew-info">Find us on: <a href="http://www.facebook.com/pages/Chat-Everywhere/180047995359066" target="_blank">Facebook</a>&nbsp<a href="https://chrome.google.com/webstore/detail/nmdkfohpgoniliafdejbpcfpggnlkkdc" target="_blank">Google Chrome webstore</a></div>' +
'</div>' +
'<style>' +
	'.cew-icon16{background-image: url(' + chrome.extension.getURL("image-bundle.png") + '); background-repeat: no-repeat; width: 16px; height: 16px; display: inline-block}' +
	'.cew-icon16-expanded{background-position: 0px 0px}' +
	'.cew-icon16-collapsed{background-position: -16px 0px}' +
	'.cew-icon16-close{background-position: -32px 0px}' +
	'.cew-icon16-messages{background-position: -48px 0px}' +
	'.cew-icon16-users{background-position: -64px 0px}' +
        '.cew-icon16-settings{background-position: -80px 0px}' +
        '.cew-icon16-chateverywhere{background-position: -96px 0px}' +
	'#cew-wrapper{display: none; line-height: 14px !important; width: 300px; border: 1px solid #ccc; margin: 20px; position: fixed; bottom: 10px; text-align: left !important; right: 10px; height: 400px; margin: 0; padding: 0; -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);  -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); -moz-border-radius: 5px; -webkit-border-radius: 5px; background:#eee; overflow: hidden; font-family: "lucida grande", tahoma, verdana, arial, sans-serif !important; font-size: 11px !important; corlor: #333; z-index: 999999 !important;}' +
	'#cew-header{border: 1px solid #254588; background-color: #6D84B4; cursor: move; font-weight: bold; padding: 3px; height: 16px; border-radius: 5px 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px; font-size: 11px; color: white !important;}' +
	'#cew-icon-nb-users{color: #fff; margin-left: 8px; margin-right: 4px;}' +
	'#cew-icon-nb-messages{color: #fff; margin-left: 8px; margin-right: 4px;}' +
	'#cew-header span{float: right;}' +
	'#cew-icon-chateverywhere{float: left !important; margin-right: 2px; margin-left: 2px;}' +  
        '#cew-icon-toggle-handler{cursor: pointer; float: right; margin-right: 2px; margin-left: 6px;}' +  
        '#cew-icon-close{cursor: pointer; float: right; margin-right: 2px; margin-left: 2px;}' + 
        '#cew-icon-settings{cursor: pointer; float: right; margin-left: 10px;}' +  
	'#cew-messages{margin: 2px; padding: 4px; height: 316px; overflow-y: scroll; width:288px}' +
        '#cew-chat{text-align: center;}' +
        
	'#cew-chat-input{overflow: hidden; margin: auto; width: 97% !important; border-radius: 3px; -moz-border-radius: 3px; background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#ddd)); background: -moz-linear-gradient(top, #FCFFA8, #ddd); border: 1px solid #bbb;font-family: "lucida grande", tahoma, verdana, arial, sans-serif !important; font-size: 11px !important;}' +
	'#cew-info{padding-left: 6px;}' +
        '.cew-message{border-radius: 3px 3px;-moz-border-radius: 3px;-webkit-border-radius: 3px; margin-bottom: 5px;}'  +
	'.cew-message-meta-info{display: block; overflow: hidden; width: 100%;}'  +
	'.cew-message-user{font-weight: bold; color: #3B5998; float: left;}'  +
	'.cew-message-time{color: gray; float: right;}'  +
        
'</style>'
);

$(document.body).append(wrapper);

var chatEverywhere = {
    selfElement: $('#cew-wrapper'),
    isExpanded: true,
    isVisible: false,
    accumulativeNbMessages: 0,
    port: null, 
    user: null,
    tabOrgTitle: null, 
    lastMessage: null,
    switchTitleStopSignal: true,
    headerElement: {
        selfElement: $('#cew-header'),
        nbUsersElement: $('#cew-nb-users'),
        nbMessagesElement: $('#cew-nb-messages'),
        toggleHandlerElement: $('#cew-icon-toggle-handler'),
        closeElement: $('#cew-icon-close'),
        settingsElement: $('#cew-icon-settings'),
        init: function(){
            //init draggable
            chatEverywhere.selfElement.draggable({
                handle: chatEverywhere.headerElement.selfElement
                });
            /*
			chatEverywhere.selfElement.resizable({
				minHeight: 24,
				minWidth: 300
			});
			*/
            chatEverywhere.selfElement.css({
                position: 'fixed', 
                bottom: '10px', 
                right: '10px'
            });
			
            chatEverywhere.headerElement.toggleHandlerElement.bind('click', chatEverywhere.headerElement.onToggleHandlerClicked);
            chatEverywhere.headerElement.settingsElement.bind('click', chatEverywhere.headerElement.onSettingsClicked);
            chatEverywhere.headerElement.closeElement.bind('click', function(){
                chatEverywhere.onMessage({event: EVENT_BROWSER_BUTTON_CLICKED});
            });
        },
        onToggleHandlerClicked: function(){
            chatEverywhere.toggle();
        },
        setNbUsers: function(number){
            chatEverywhere.headerElement.nbUsersElement.text(number);
        },
        setNbMessages: function(number){
            chatEverywhere.headerElement.nbMessagesElement.text(number);
        },
        onSettingsClicked: function(){
            var name = prompt("What is your name?", chatEverywhere.user.name);
            
            if( name != null && name.length > 0 ){
                var params = {
                    event: EVENT_CONTENT_UPDATE_PROFILE,
                    name: name
                };
                                
                chatEverywhere.port.postMessage(params);
                chatEverywhere.user.name = name;
            }
        }
    },
    chatElement: {
        selfElement: $('#cew-chat-wrapper'),
        messagesContainerElement: $('#cew-messages'),
        inputElement: $('#cew-chat-input'),
        init: function(){
            chatEverywhere.chatElement.inputElement.bind('focus', chatEverywhere.chatElement.onInputFocused);
            chatEverywhere.chatElement.inputElement.bind('blur', chatEverywhere.chatElement.onInputBlurred);
            chatEverywhere.chatElement.inputElement.bind('keyup', chatEverywhere.chatElement.onInputKeyUp);
            chatEverywhere.chatElement.inputElement.val(DEFAULT_MESSAGE_PROMPT);


        },
        onInputFocused: function(event){
            chatEverywhere.switchTitleStopSignal = true;
            
            var sender = $(event.target);
            if (sender.val() == DEFAULT_MESSAGE_PROMPT) {
                sender.val('');
            }
            sender.select();
        },
        onInputBlurred: function(event){
            var sender = $(event.target);
            if (sender.val() == '') {
                sender.val(DEFAULT_MESSAGE_PROMPT);
            }
        },
        onInputKeyUp: function(event){
            chatEverywhere.switchTitleStopSignal = true;
            
            var sender = $(event.target); 
			
            if (event.keyCode == 13) {
                var msg = sender.val().trim();
                //send send message to background page
                if (msg.length > 0 && msg != DEFAULT_MESSAGE_PROMPT) {
                    chatEverywhere.sendMessage(msg);
					
                    //clear the input after send
                    sender.text('');
                }
            }
        },
        appendMessage: function(msgObj){
            var html = 	'<div class="cew-message' + (msgObj.isTemporary?' cew-message-temporary' : '') + '">' +
            '<div class="cew-message-meta-info">' +
            '<div class="cew-message-user">' + msgObj.user + '</div>' +
            '<!--div class="cew-message-time">' + msgObj.at + '</div-->' +
            '</div>' +
            '<div class="cew-message-content">' + msgObj.message + '</div>' +
            '</div>';
    
            chatEverywhere.chatElement.messagesContainerElement.append(html);
            
        },
        clearMessages: function(){
            chatEverywhere.chatElement.messagesContainerElement.empty();
        }
    },
    
    toggle: function(){
        if (chatEverywhere.isExpanded) {
            chatEverywhere.selfElement.css({
                height: '24px'
            });
            chatEverywhere.headerElement.toggleHandlerElement.addClass('cew-icon16-collapsed');
            chatEverywhere.isExpanded = false;
        }
        else {
            chatEverywhere.selfElement.css({
                height: '400px'
            });
            chatEverywhere.headerElement.toggleHandlerElement.removeClass('cew-icon16-collapsed');
            chatEverywhere.isExpanded = true;
        }
    },
    init: function(){
        //chatEverywhere.resizeChatWindow();
        chatEverywhere.tabOrgTitle = document.title; 
        
        //console.log(chatEverywhere.tabOrgTitle);
        
        chatEverywhere.accumulativeNbMessages = 0;

        chatEverywhere.headerElement.init();
        chatEverywhere.chatElement.init();
		
                
        chatEverywhere.connect();
        

        //chatEverywhere.loadMoreMessages();
        //chatEverywhere.askForNewMessages();
        //setInterval("chatEverywhere.loadMoreMessages()", CHECK_FOR_NEW_MESSAGES_INTERVAL);
        
    },
    connect: function(){        
        chatEverywhere.port = chrome.extension.connect();
        chatEverywhere.port.onMessage.addListener(chatEverywhere.onMessage);
    
    },
    switchTitle: function(){
        if( chatEverywhere.switchTitleStopSignal ){
            document.title = chatEverywhere.tabOrgTitle;
            return;
        }
        
        if( document.title == chatEverywhere.tabOrgTitle ){
            document.title = chatEverywhere.lastMessage;
        }else{
            document.title = chatEverywhere.tabOrgTitle;
        }
        //sleep for 2 second
        setTimeout("chatEverywhere.switchTitle()", 3000);
    },
    onMessage: function(msg){
        
        switch(msg.event){
            case EVENT_NEW_MESSAGES:
                //remove all temporary message
                chatEverywhere.selfElement.find('.cew-message-temporary').remove();
                
                chatEverywhere.headerElement.setNbUsers(msg.data.nbActiveUsers);
            
                $(msg.data.messages).each(function(index, message){
                    chatEverywhere.chatElement.appendMessage(message);
                });
                chatEverywhere.scrollToEndOfMessages();
                
                //start the timer
                chatEverywhere.lastMessage = msg.data.messages[msg.data.messages.length -1].user + " says: " + msg.data.messages[msg.data.messages.length -1].message;
                
                //start timer to change the title
                chatEverywhere.switchTitleStopSignal = false;
                chatEverywhere.switchTitle();
                break;
            case EVENT_BROWSER_BUTTON_CLICKED:
                if( chatEverywhere.isVisible ){
                    chatEverywhere.selfElement.hide();
                    chatEverywhere.isVisible = false;
                }else{
                    chatEverywhere.switchTitleStopSignal = true;
                    chatEverywhere.selfElement.show();
                    chatEverywhere.chatElement.inputElement.focus();
                    chatEverywhere.isVisible = true;
                }
                chatEverywhere.scrollToEndOfMessages();
                
                break;
                
            case EVENT_TAB_CHANGED:
                chatEverywhere.switchTitleStopSignal = true;
                
                break;
           case EVENT_USER_INFO:
               chatEverywhere.user = msg.user; 
               
               break;
        }
    },
    scrollToEndOfMessages: function(){
        chatEverywhere.chatElement.messagesContainerElement.attr({
                    scrollTop: chatEverywhere.chatElement.messagesContainerElement.attr("scrollHeight")
                });
    },
    sendMessage: function(message){
        var params = {
            event: EVENT_CONTENT_SEND_MESSAGE,
            url: window.location.href,
            message: message
        };
        chatEverywhere.port.postMessage(params);
        
        chatEverywhere.chatElement.appendMessage({user: chatEverywhere.user.name, at: null, message: message, isTemporary: true});
        chatEverywhere.scrollToEndOfMessages();
    }
	

};



chatEverywhere.init();