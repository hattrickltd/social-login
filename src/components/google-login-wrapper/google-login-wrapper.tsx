import { Component, Host, h, Prop, Event, EventEmitter, Listen } from "@stencil/core";
import { ISocialUser } from "../../utils/interfaces";
import { GoogleProvider } from "../../utils/google-provider";

@Component({
  tag: "google-login-wrapper",
  styleUrl: "google-login-wrapper.css",
  shadow: true
})
export class GoogleLoginWrapper {

  @Prop() clientId: string;

  @Prop({ reflect: true }) expand: "" | "block" = "";
  
  /** Space-separated string of scopes to request. */
  @Prop() scope: string = "profile email"

  @Prop() checkStatus: boolean = false;

  @Event() googleStatus: EventEmitter<ISocialUser>;
  @Event() googleLogin: EventEmitter<ISocialUser>;
  @Event() googleError: EventEmitter<Error>;

  private provider = new GoogleProvider();
  private ready: Promise<any>;

  componentWillLoad() {
    this.ready = Promise.all([
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

  @Listen("click")
  async login() {
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
        <slot></slot>
      </Host>
    );
  }

}
