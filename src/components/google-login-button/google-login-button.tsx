import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { GoogleProvider } from "../../utils/google-provider";
import { ISocialUser } from "../../utils/interfaces";

@Component({
  tag: "google-login-button",
  styleUrl: "google-login-button.css",
  shadow: true
})
export class GoogleLoginButton {

  @Prop() clientId: string;

  @Prop({ reflect: true }) size: "large" | "medium" | "small" = "large";

  @Prop({ reflect: true }) expand: "" | "block" = "";
  
  /** Space-separated string of scopes to request. */
  @Prop() scope: string = "profile email"

  @Prop() checkStatus: boolean = false;

  @Prop() disabled: boolean = false;

  @Prop() loadFont: boolean = true;

  @Event() googleStatus: EventEmitter<ISocialUser>;
  @Event() googleLogin: EventEmitter<ISocialUser>;
  @Event() googleError: EventEmitter<Error>;

  private provider = new GoogleProvider();
  private ready: Promise<any>;

  componentWillLoad() {
    this.ready = Promise.all([
      this.loadFont ? this.provider.loadFont() : Promise.resolve(),

      this.provider.loadScript(this.clientId, this.scope).then(() => {
        if (this.checkStatus) {
          this.provider.getLoginStatus().then((user) => {
            this.googleStatus.emit(user);
          });
        }
      }).catch((err) => {
        this.googleError.emit(err);
      }),
    ]);
  }

  private async login() {
    await this.ready;

    await this.provider.login().then((user) => {
      this.googleLogin.emit(user);
    }).catch((err) => {
      this.googleError.emit(err);
    });
  }

  render() {
    return (
      <Host>
        <button onClick={ () => this.login() } disabled={ this.disabled } {...{ part: "button" }}>
          <google-icon {...{ part: "icon" }}></google-icon>
          
          <span><slot/></span>
        </button>
        
      </Host>
    );
  }

}
