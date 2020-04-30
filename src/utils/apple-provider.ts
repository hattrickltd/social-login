import { ISocialUser, IAppleLoginResponse } from "./interfaces";

declare const AppleID: any;

export class AppleProvider {

  static _loadScriptPromise: Promise<void>;

  constructor() {}

  loadScript(
    clientId: string,
    redirectURI: string = location.href,
    scopes: string = "name email",
    usePopup: boolean = false,
    locale: string = navigator.language,
  ): Promise<void> {
    if (AppleProvider._loadScriptPromise) return AppleProvider._loadScriptPromise;

    return AppleProvider._loadScriptPromise = new Promise((resolve, reject) => {
      let appleScript = document.createElement("script");
      appleScript.async = true;
      appleScript.src = `//appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/${ locale }/appleid.auth.js`

      appleScript.onerror = () => reject(new Error("Failed to load Apple script."));
      appleScript.onload = () => {
        AppleID.auth.init({
          clientId: clientId,
          scope: scopes,
          redirectURI: redirectURI,
          state: "[STATE]",
          usePopup: usePopup, //or false defaults to false
        });

        resolve();
      }

      document.head.appendChild(appleScript);
    });
  }

  async login(): Promise<ISocialUser> {
    await AppleProvider._loadScriptPromise;

    return new Promise(async (resolve, reject) => {
      try {
        const response: IAppleLoginResponse = await AppleID.auth.signIn();
  
        resolve({
          provider: "apple",
      
          id: undefined,
          name: undefined,
          email: response.user.email,
          photoUrl: undefined,
          firstName: response.user.name.firstName,
          lastName: response.user.name.lastName,
          authToken: response.authorization.id_token,
      
          apple: response,
        });
  
        return response;
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
