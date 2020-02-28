import { newE2EPage } from "@stencil/core/testing";

describe("facebook-login-wrapper", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<facebook-login-wrapper></facebook-login-wrapper>");

    const element = await page.find("facebook-login-wrapper");
    expect(element).toHaveClass("hydrated");
  });
});
