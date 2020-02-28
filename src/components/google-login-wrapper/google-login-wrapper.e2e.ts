import { newE2EPage } from "@stencil/core/testing";

describe("google-login-wrapper", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<google-login-wrapper></google-login-wrapper>");

    const element = await page.find("google-login-wrapper");
    expect(element).toHaveClass("hydrated");
  });
});
