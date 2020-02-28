import { newE2EPage } from "@stencil/core/testing";

describe("google-login-button", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<google-login-button></google-login-button>");

    const element = await page.find("google-login-button");
    expect(element).toHaveClass("hydrated");
  });
});
