import { ISocialUser } from "./interfaces";

declare const gapi: any;

export class GoogleProvider {
  static _loadScriptPromise: Promise<void>;
  static _loadFontPromise: Promise<void>;

  private auth2: any;

  constructor() {}

  loadScript(
    clientId: string,
    scope: string = "email",
  ): Promise<void> {
    if (GoogleProvider._loadScriptPromise) return GoogleProvider._loadScriptPromise;

    return GoogleProvider._loadScriptPromise = new Promise((resolve, reject) => {
      let fbScript = document.createElement("script");
      fbScript.async = true;
      fbScript.src = `https://apis.google.com/js/platform.js`
      
      fbScript.onerror = () => reject();
      fbScript.onload = () => {
        gapi.load("auth2", () => {
          this.auth2 = gapi.auth2.init({
            scope: scope,
            client_id: clientId,
          });

          this.auth2.then(() => {
            resolve();
          }).catch((err: any) => {
            reject(err);
          });
        });
      }

      document.head.appendChild(fbScript);
    });
  }

  loadFont(): Promise<void> {
    if (GoogleProvider._loadFontPromise) return GoogleProvider._loadFontPromise;

    GoogleProvider._loadFontPromise = new Promise((resolve, reject) => {
      // if ((document as any).fonts?.check?.("1em Roboto")) return resolve();

      let fontLink = document.createElement("link");
      fontLink.href = "https://fonts.googleapis.com/css?family=Roboto:500&display=swap";
      fontLink.rel = "stylesheet";
      fontLink.onerror = () => {
        const msg = "Failed to load font https://fonts.googleapis.com/css?family=Roboto:500&display=swap";
        console.warn(msg)
        reject(msg);
      };
      fontLink.onload = () => resolve();

      document.head.appendChild(fontLink);
    });
  }

  async login(): Promise<ISocialUser> {
    await GoogleProvider._loadScriptPromise;

    return new Promise((resolve, reject) => {
      // const offlineAccess: boolean = (opt && opt.offline_access) || (this.opt && this.opt.offline_access);
      // let promise = !offlineAccess ? this.auth2.signIn(opt) : this.auth2.grantOfflineAccess(opt);

      this.auth2.signIn().then((response: any) => {
        let profile = this.auth2.currentUser.get().getBasicProfile();
        let token = this.auth2.currentUser.get().getAuthResponse(true).access_token;
        let backendToken = this.auth2.currentUser.get().getAuthResponse(true).id_token;

        let user: ISocialUser = {
          provider: "google",

          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          photoUrl: profile.getImageUrl(),
          firstName: profile.getGivenName(),
          lastName: profile.getFamilyName(),
          authToken: token,

          idToken: backendToken,
        };

        if (response && response.code) {
          user.authorizationCode = response.code;
        }

        resolve(user);
      }, (_closed: any) => {
        reject(new Error("User cancelled login or did not fully authorize."));
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  async getLoginStatus(): Promise<ISocialUser> {
    await GoogleProvider._loadScriptPromise;

    return new Promise((resolve, reject) => {
      if (this.auth2.isSignedIn.get()) {
        let profile = this.auth2.currentUser.get().getBasicProfile();
        let token = this.auth2.currentUser.get().getAuthResponse(true).access_token;
        let backendToken = this.auth2.currentUser.get().getAuthResponse(true).id_token;

        let user: ISocialUser = {
          provider: "google",

          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          photoUrl: profile.getImageUrl(),
          firstName: profile.getGivenName(),
          lastName: profile.getFamilyName(),
          authToken: token,

          idToken: backendToken,
        };

        resolve(user);
      } else {
        reject("No user is currently logged in.");
      }
    });
  }
}