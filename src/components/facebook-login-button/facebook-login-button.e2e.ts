import { newE2EPage } from "@stencil/core/testing";

describe("social-facebook-button", () => {
  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent("<social-facebook-button></social-facebook-button>");
    const element = await page.find("social-facebook-button");
    expect(element).toHaveClass("hydrated");
  });
});
