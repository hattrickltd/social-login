import { Component, Host, h, Prop, Event, EventEmitter, Listen } from "@stencil/core";
import { FacebookProvider } from "../../utils/facebook-provider";
import { ISocialUser } from "../../utils/interfaces";

@Component({
  tag: "facebook-login-wrapper",
  styleUrl: "facebook-login-wrapper.css",
  shadow: true
})
export class FacebookLoginWrapper {

  @Prop() clientId: string;

  @Prop({ reflect: true }) expand: "" | "block" = "";

  /** Which Facebook locale the user will see. */
  @Prop() locale: string;

  /** Version of the Facebook API to use. */
  @Prop() version: string;

  /** Comma-separated string of fields to fetch. */
  @Prop() fields: string;

  /** Comma-separated string of scopes to request. See https://developers.facebook.com/docs/facebook-login/permissions */
  @Prop() scope: string;

  /** Comma-separated string of `auth_type`s, e.g. `rerequest`, `reauthenticate` or `reauthorize` See https://developers.facebook.com/docs/reference/javascript/FB.login#options */
  @Prop() authType: string = "";

  /** Additional Facebook Login options. See https://developers.facebook.com/docs/reference/javascript/FB.login#options */
  @Prop() options: any = {};

  /** When `continue_with` is chosen the status will automatically be checked and the `facebookStatus` event will trigger if a user is found. */
  @Prop() type: "login_with" | "continue_with" = "login_with";

  @Event() facebookStatus: EventEmitter<ISocialUser>;
  @Event() facebookLogin: EventEmitter<ISocialUser>;
  @Event() facebookError: EventEmitter<Error>;

  private provider = new FacebookProvider();
  private ready: Promise<any>;

  componentWillLoad() {
    this.ready = this.provider.loadScript(this.clientId, this.locale, this.version).then(() => {
      if (this.type === "continue_with") {
        this.provider.getLoginStatus(this.fields).then((user) => {
          this.facebookStatus.emit(user);
        }).catch((err) => {
          this.facebookError.emit(err);
        });
      }
    }).catch((err) => {
      this.facebookError.emit(err);
    });
  }

  @Listen("click")
  async login() {
    await this.ready;

    await this.provider.login(this.fields, { ...this.options, scope: this.scope, auth_type: this.authType }).then((user) => {
      this.facebookLogin.emit(user);
    }).catch((err) => {
      this.facebookError.emit(err);
    });
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
