/**
 * @param {string} login - the username to log in with
 * @param {string} role - full, admin, manage, none
 * @param {*} nameObj - {firstname,lastname} or {fullName}
 * @returns {Object} A minimal user object
 */
const getUserData = (login, role, nameObj) => {
  const roles = {
    full: ["admin:org:all", "portal_manage_subscriptions"],
    admin: ["admin:org:all"],
    manage: ["portal_manage_subscriptions"],
    none: [],
  };

  return Object.assign(
    {
      realm_access: {
        roles: roles[role],
      },
      REDHAT_LOGIN: login,
      account_number: "123456",
      preferred_username: "Agent Coulson",
      email: "foo@redhat.com",
      username: login,
    },
    nameObj
  );
};

suite("<rh-account-dropdown>", () => {
  test("it should upgrade", () => {
    assert.instanceOf(
      document.querySelector("rh-account-dropdown"),
      customElements.get("rh-account-dropdown"),
      "rh-account-dropdown should be an instance of RhAccountDropdown"
    );
  });

  test("login-link attribute is applied correctly", () => {
    // Test that the attribute applied correctly
    const ele = document.querySelector("rh-account-dropdown[login-link]");
    const testTxt = ele.getAttribute("login-link"); // "#login-test";
    const eleLink = ele.loginLink;
    assert.equal(
      testTxt,
      eleLink,
      `
    login-link attribute (${testTxt}) and
    Log in button address (${eleLink}) are not the same.
    `
    );
  });

  test("logout-link attribute is applied correctly", () => {
    // Test that the attribute applied correctly
    const ele = document.querySelector("rh-account-dropdown[logout-link]");
    const testTxt = ele.getAttribute("logout-link");
    const eleLink = ele.logoutLink;
    assert.equal(
      testTxt,
      eleLink,
      `
    login-link attribute (${testTxt}) and
    Log out button address (${eleLink}) are not the same.
    `
    );
  });

  test("full-name attribute is applied correctly", () => {
    // Test that the attribute applied correctly
    const ele = document.querySelector("rh-account-dropdown[full-name]");
    const testTxt = ele.getAttribute("full-name");
    const eleTxt = ele.fullName;
    assert.equal(
      testTxt,
      eleTxt,
      `
    full-name attribute (${testTxt}) and
    fullName property (${eleTxt}) are not the same.
    `
    );
  });

  test("management link requires portal_manage_subscriptions role", () => {
    const elePositive = document.querySelector("#mgmt-test-pos");
    const eleNegative = document.querySelector("#mgmt-test-neg");
    elePositive.setAttribute("logout-link", "#logout-link");
    eleNegative.setAttribute("logout-link", "#logout-link");
    let mockAdminUserData = getUserData("foo", "full", {
      fullName: "Agent Coulson",
    });
    elePositive.userData = mockAdminUserData;
    expect(
      elePositive.shadowRoot.querySelector(
        '[data-analytics-text="Subscriptions"]'
      )
    ).to.exist;
    mockAdminUserData = getUserData("foo", "none", {
      fullName: "Agent Coulson",
    });
    eleNegative.userData = mockAdminUserData;
    expect(
      eleNegative.shadowRoot.querySelector(
        '[data-analytics-text="Subscriptions"]'
      )
    ).to.not.exist;
  });

  test("avatar-url image is set correctly when image exists", () => {
    const ele = document.querySelector("#avatar-valid-url");
    ele.setAttribute("logout-link", "#logout-link");
    let mockUserData = getUserData("ldary24", "full", {
      firstName: "Agent",
      lastName: "Coulson",
    });
    ele.userData = mockUserData;
    assert.equal(
      ele.getAttribute("avatar-url"),
      `https://access.redhat.com/api/users/avatar/${mockUserData.REDHAT_LOGIN}`,
      "Avatar not updated correctly"
    );
  });

  test("avatar-url default is applied when image does not exist", () => {
    const ele = document.querySelector("#avatar-invalid-url");
    ele.setAttribute("logout-link", "#logout-link");
    let mockUserData = getUserData("foo", "full", {
      firstName: "Agent",
      lastName: "Coulson",
    });
    ele.userData = mockUserData;
    expect(ele.getAttribute("avatar-url")).to.not.exist;
  });

  test("When lang attribute is changed the dropdown content should get translated", () => {
    const ele = document.querySelector("#avatar-invalid-url");
    ele.setAttribute("lang", "ja");
    const accountTitle = ele.shadowRoot.querySelector(
      '[data-analytics-text="Account details"]'
    );
    assert.strictEqual(
      accountTitle.innerText.trim(),
      ele._navTranslations.ja.accountDetails.trim(),
      "The 'Account Details' text didn't get updated to Japanese translation."
    );
  });
});
