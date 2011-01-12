const DEFAULT_MESSAGE_PROMPT = 'What do you want to say?';
const EVENT_CONTENT_INITIALIZED = 'content script initialized';
const EVENT_CONTENT_SEND_MESSAGE = 'content script send a message';
const EVENT_CONTENT_UPDATE_PROFILE = 'content script wants to update profile';
const EVENT_CONTENT_QUERY_MESSAGES = 'content script query for message';
const EVENT_NEW_MESSAGES = 'background notities new messages';
const EVENT_BROWSER_BUTTON_CLICKED = "browser button clicked";
const EVENT_USER_INFO = "background send user info";
const EVENT_TAB_CHANGED = 'New tab selected';

//local storage indexes
const LOCAL_STORAGE_INDEX_USER_ID = 'user-id';

//how long to check for new messages? 
const CHECK_FOR_NEW_MESSAGES_INTERVAL = 10000;

const URL_SERVER_API = 'http://chateverywhere.net/api/';
