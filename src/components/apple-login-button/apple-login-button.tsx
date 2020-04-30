import { Component, h, Prop, Event, EventEmitter, Host } from "@stencil/core";
import { ISocialUser } from "../../utils/interfaces";
import { AppleProvider } from "../../utils/apple-provider";

@Component({
  tag: "apple-login-button",
  styleUrl: "apple-login-button.css",
  shadow: true
})
export class AppleButton {

  @Prop() clientId: string;
  
  @Prop({ reflect: true }) size: "large" | "medium" | "small" = "large";
  
  @Prop({ reflect: true }) expand: "" | "block" = "";

  @Prop({ reflect: true }) border: boolean = false;
  
  /** Which Apple locale the user will see. */
  @Prop() locale: string;
  
  /** Space-separated string of scopes to request. See https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple */
  @Prop() scopes: string = "name email";
  
  /** Required if `usePopup === true`. Apple processes the authorization request, an HTTP POST request containing the results of the authorization is sent to the URL provided */
  @Prop() redirectURI: string;
  
  /** If the login should be shown as a popup */
  @Prop() usePopup: boolean = false;
  
  /** When `continue_with` is chosen the status will automatically be checked and the `facebookStatus` event will trigger if a user is found. */
  @Prop() type: "sign in" | "continue" = "sign in";
  
  @Prop() disabled: boolean = false;
  
  @Event() appleLogin: EventEmitter<ISocialUser>;
  @Event() appleError: EventEmitter<Error>;
  
  private provider = new AppleProvider();
  private isReady: Promise<any>;

  componentWillLoad() {
    this.isReady = this.provider.loadScript(this.clientId, this.redirectURI, this.scopes, this.usePopup, this.locale).catch((err) => {
      this.appleError.emit(err);
    });
  }

  private async login() {
    await this.isReady;

    await this.provider.login().then((user) => {
      this.appleLogin.emit(user);
    }).catch((err) => {
      this.appleError.emit(err);
    });
  }

  render() {
    return <Host>
      <button onClick={ () => this.login() } disabled={ this.disabled } {...{ part: "button" }}>
        <apple-icon {...{ part: "icon" }}></apple-icon>

        <span><slot/></span>
      </button>
    </Host>;
  }
}
