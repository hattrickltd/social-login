import { ISocialUser } from "./interfaces";

declare const FB: any;

export class FacebookProvider {

  static _loadScriptPromise: Promise<void>;

  constructor() {}

  loadScript(
    clientId: string,
    locale: string = navigator.language,
    version: string = "v6.0"
  ): Promise<void> {
    if (FacebookProvider._loadScriptPromise) return FacebookProvider._loadScriptPromise;

    return FacebookProvider._loadScriptPromise = new Promise((resolve, reject) => {
      let fbScript = document.createElement("script");
      fbScript.async = true;
      fbScript.src = `//connect.facebook.net/${ locale }/sdk.js`
      
      fbScript.onerror = () => reject(new Error("Failed to load Facebook script."));
      fbScript.onload = () => {
        FB.init({
          appId: clientId,
          autoLogAppEvents: true,
          cookie: true,
          xfbml: true,
          version: version
        });

        resolve();
      }

      document.head.appendChild(fbScript);
    });
  }

  async login(
    fields: string = "name,email,picture,first_name,last_name",
    scope: string = "email,public_profile",
    options: any = {},
  ): Promise<ISocialUser> {
    await FacebookProvider._loadScriptPromise;

    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          let authResponse = response.authResponse;
          resolve(this.me(authResponse.accessToken, fields));
        } else {
          reject(new Error("User cancelled login or did not fully authorize."));
        }
      }, { ...options, scope });
    });
  }

  async getLoginStatus(fields: string): Promise<ISocialUser> {
    await FacebookProvider._loadScriptPromise;

    return new Promise((resolve, reject) => {
      FB.getLoginStatus(async (response: any) => {
        if (response.status === "connected") {
          let authResponse = response.authResponse;

          resolve(await this.me(authResponse.accessToken, fields));
        } else {
          reject(new Error("No user is currently logged in."));
        }
      });
    });
  }

  private async me(accessToken: string, fields: string): Promise<ISocialUser> {
    return new Promise((resolve) => {
      FB.api(`/me?fields=${ fields }`, (fbUser: any) => {
        resolve({
          provider: "facebook",
  
          id: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          photoUrl: `https://graph.facebook.com/${ fbUser.id }/picture?type=normal`,
          firstName: fbUser.first_name,
          lastName: fbUser.last_name,
          authToken: accessToken,
  
          facebook: fbUser,
        });
      });
    });
  }
}
