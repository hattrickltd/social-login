import { Component, Prop, h, Host, Event, EventEmitter, Element } from "@stencil/core";
import { FacebookProvider } from "../../utils/facebook-provider";
import { ISocialUser } from "../../utils/interfaces";

@Component({
  tag: "facebook-login-button",
  styleUrl: "facebook-login-button.css",
  // styleUrls: {
  //   large: "facebook-login-button.large.css",
  //   medium: "facebook-login-button.medium.css",
  //   small: "facebook-login-button.small.css",
  // },
  shadow: true,
})
export class FacebookLoginButton {

  @Element() host: HTMLFacebookLoginButtonElement;

  @Prop() clientId: string;

  @Prop({ reflect: true }) size: "large" | "medium" | "small" = "large";
  
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

  @Prop() disabled: boolean = false;

  @Event() facebookStatus: EventEmitter<ISocialUser>;
  @Event() facebookLogin: EventEmitter<ISocialUser>;
  @Event() facebookError: EventEmitter<Error>;

  private provider = new FacebookProvider();
  private isReady: Promise<any>;

  componentWillLoad() {
    this.isReady = this.provider.loadScript(this.clientId, this.locale, this.version).then(() => {
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

  private async login() {
    await this.isReady;

    await this.provider.login(this.fields, { ...this.options, scope: this.scope, auth_type: this.authType }).then((user) => {
      this.facebookLogin.emit(user);
    }).catch((err) => {
      this.facebookError.emit(err);
    });
  }

  render() {
    return <Host>
      <button onClick={ () => this.login() } disabled={ this.disabled } {...{ part: "button" }}>
        <facebook-icon {...{ part: "icon" }}></facebook-icon>

        <span><slot/></span>

        <slot name="picture"/>
      </button>
    </Host>;
  }
}
